// Daily RAPI™ price updater — writes to Supabase (zero Vercel ISR impact)
//
// FIRST-TIME SETUP: Run this SQL in your Supabase dashboard → SQL Editor:
//
//   CREATE TABLE IF NOT EXISTS rapi_prices (
//     id          INTEGER PRIMARY KEY DEFAULT 1,
//     updated_at  DATE NOT NULL,
//     ticker      JSONB NOT NULL,
//     chart       JSONB NOT NULL
//   );
//   ALTER TABLE rapi_prices ENABLE ROW LEVEL SECURITY;
//   CREATE POLICY "public read" ON rapi_prices FOR SELECT USING (true);
//   INSERT INTO rapi_prices (id, updated_at, ticker, chart)
//   VALUES (1, '2026-08-27', '[]'::jsonb, '{}'::jsonb)
//   ON CONFLICT (id) DO NOTHING;
//
// RUN MANUALLY:  node update-rapi-prices.js
//
// CRON (6am daily — add via: crontab -e):
//   0 6 * * * cd /Users/mehedihasan/Projects/diamondcritics && node update-rapi-prices.js >> /tmp/rapi-update.log 2>&1

const puppeteer        = require('puppeteer-extra');
const StealthPlugin    = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Load env from .env.local
require('fs').readFileSync(path.join(__dirname, '.env.local'), 'utf8')
  .split('\n')
  .forEach(line => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  });

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SVCKEY   = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RAPI_URL          = 'https://rapaport.com/';

// Sizes NOT in Rapaport public ticker — we interpolate from nearest RAPI % change
const INTERPOLATED_KEYS = ['0.70', '1.50', '2.00', '4.00', '5.00'];

async function scrapeRapaport() {
  console.log('Launching browser…');
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/125 Safari/537.36'
  );

  console.log('Loading rapaport.com…');
  try {
    await page.goto(RAPI_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  } catch (e) { /* ignore frame detach on redirect */ }
  await new Promise(r => setTimeout(r, 10000)); // wait for ticker JS to render

  // Extract RAPI ticker prices from rendered DOM text
  const domPrices = await page.evaluate(() => {
    const results = [];
    const allText = document.body.innerText;
    // Pattern: "0.30 ct  899  ↑  2.27%" or similar
    const pattern = /([\d.]+)\s*ct[^\d]*?([\d,]+)\s*[▲▼↑↓]\s*([0-9.]+%)/gi;
    let m;
    while ((m = pattern.exec(allText)) !== null) {
      const ct    = parseFloat(m[1]);
      const price = parseInt(m[2].replace(/,/g, ''), 10);
      const pct   = m[3];
      // Determine direction: look at char before % number
      const before = allText.slice(Math.max(0, m.index), m.index + m[0].length);
      const isDown = /[▼↓−-]/.test(before.replace(m[2], '').replace(m[1], ''));
      if (ct && price > 100) {
        results.push({
          ct:     ct.toFixed(2),
          price,
          change: (isDown ? '−' : '+') + pct,
          up:     !isDown,
        });
      }
    }
    return results;
  });

  await browser.close();
  console.log(`Scraped ${domPrices.length} price entries from DOM.`);

  const map = {};
  for (const item of domPrices) map[item.ct] = item;
  return map;
}

function fmtPrice(n) {
  return n.toLocaleString('en-US');
}

function applyChangePct(oldPrice, changePct) {
  const pct = parseFloat(changePct.replace(/[^0-9.-]/g, ''));
  return Math.round(oldPrice * (1 + pct / 100));
}

async function run() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SVCKEY);
  const today    = new Date().toISOString().slice(0, 10);

  // Load current data from Supabase
  const { data: row, error } = await supabase
    .from('rapi_prices')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Supabase read failed:', error.message);
    console.error('Did you create the table? See SQL at the top of this file.');
    process.exit(1);
  }

  const ticker = row.ticker;
  const chart  = row.chart;

  // Scrape Rapaport public ticker
  let scraped = {};
  try {
    scraped = await scrapeRapaport();
  } catch (err) {
    console.error('Scrape failed:', err.message);
    console.log('Keeping existing prices, updating date only.');
    await supabase.from('rapi_prices').update({ updated_at: today }).eq('id', 1);
    return;
  }

  const proxy = scraped['1.00'] || scraped['1.0']; // fallback for interpolation
  let updatedCount = 0;

  // --- Initialize ticker if empty (first run or reset) ---
  const ALL_SIZES = ['0.30', '0.50', '0.70', '1.00', '1.50', '2.00', '3.00', '4.00', '5.00'];
  if (ticker.length === 0 && Object.keys(scraped).length > 0) {
    console.log('Ticker is empty — initializing from scraped data…');
    for (const key of ALL_SIZES) {
      const src = scraped[key];
      if (src) {
        ticker.push({ label: `${parseFloat(key)} ct`, price: fmtPrice(src.price), change: src.change, up: src.up });
      } else if (INTERPOLATED_KEYS.includes(key) && proxy) {
        // Use proxy change on a baseline price (0 means it will stay at 0 until next real scrape)
        ticker.push({ label: `${parseFloat(key)} ct`, price: '0', change: proxy.change, up: proxy.up });
      }
    }
    console.log(`  Initialized ${ticker.length} ticker items.`);
  }

  // Update scraped prices in ticker array
  for (const item of ticker) {
    const key = parseFloat(item.label).toFixed(2);
    if (scraped[key]) {
      item.price  = fmtPrice(scraped[key].price);
      item.change = scraped[key].change;
      item.up     = scraped[key].up;
      updatedCount++;
      console.log(`  ✓ ${item.label}: $${item.price} ${item.change}`);
    } else if (INTERPOLATED_KEYS.includes(key) && proxy) {
      // Interpolate from 1ct change as proxy
      const old = parseInt(item.price.replace(/,/g, ''), 10) || 0;
      const neu = old > 0 ? applyChangePct(old, proxy.change) : 0;
      item.price  = neu > 0 ? fmtPrice(neu) : item.price;
      item.change = proxy.change;
      item.up     = proxy.up;
      console.log(`  ~ ${item.label}: $${item.price} ${item.change} (interpolated)`);
    }
  }

  // --- Initialize chart keys if missing ---
  for (const key of ['0.30', '0.50', '1.00', '3.00']) {
    if (!chart[key] && scraped[key]) {
      chart[key] = {
        current: scraped[key].price,
        change:  scraped[key].change,
        up:      scraped[key].up,
        history: Array(13).fill(scraped[key].price),
      };
      console.log(`  + Initialized chart[${key}] at $${scraped[key].price}`);
    }
  }

  // Update chart data for the 4 primary scraped sizes
  for (const key of ['0.30', '0.50', '1.00', '3.00']) {
    if (!chart[key] || !scraped[key]) continue;
    const entry    = chart[key];
    const newPrice = scraped[key].price;
    entry.change   = scraped[key].change;
    entry.up       = scraped[key].up;
    entry.current  = newPrice;
    if (newPrice !== entry.history[entry.history.length - 1]) {
      entry.history.push(newPrice);
      if (entry.history.length > 13) entry.history.shift();
    }
  }

  // Upsert back to Supabase
  const { error: writeErr } = await supabase
    .from('rapi_prices')
    .update({ updated_at: today, ticker, chart })
    .eq('id', 1);

  if (writeErr) {
    console.error('Supabase write failed:', writeErr.message);
    process.exit(1);
  }

  console.log(`\nDone — ${updatedCount} live + ${INTERPOLATED_KEYS.length} interpolated → Supabase updated.`);

  if (updatedCount === 0) {
    console.warn('WARNING: No prices scraped. Rapaport may have changed their markup.');
    console.warn('Check rapaport.com manually and update via Supabase dashboard if needed.');
  }
}

run().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
