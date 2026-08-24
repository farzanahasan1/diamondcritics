// Google Search Console Indexing API — bulk submit all post URLs
//
// SETUP (one-time):
// 1. Go to Google Search Console → Settings → Users and permissions → API Access
//    OR: console.cloud.google.com → Create project → Enable "Web Search Indexing API"
// 2. Create a Service Account → download JSON key → save as service-account.json here
// 3. In Google Search Console → Settings → Owners → add the service account email as an OWNER
// 4. npm install googleapis
// 5. node submit-indexing.js
//
// Rate limit: 200 URLs/day on free tier. Script batches automatically.

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SERVICE_ACCOUNT_FILE = '/Users/mehedihasan/Projects/diamondcritics-8df8059f6989.json';
// Pass 'retry' as argument to submit failed URLs only: node submit-indexing.js retry
const retryMode = process.argv[2] === 'retry';
const URLS_FILE = path.join(__dirname, retryMode ? 'indexing-retry-tomorrow.txt' : 'indexing-urls.txt');
const DELAY_MS = 500; // 0.5s between requests to stay under rate limit

async function submitUrls() {
  if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
    console.error('ERROR: service-account.json not found.');
    console.error('See setup instructions at the top of this file.');
    process.exit(1);
  }

  if (!fs.existsSync(URLS_FILE)) {
    console.error('ERROR: indexing-urls.txt not found. Run convert-avif-to-jpg.js first.');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  });

  const indexing = google.indexing({ version: 'v3', auth });

  const urls = fs.readFileSync(URLS_FILE, 'utf8')
    .split('\n')
    .map(u => u.trim())
    .filter(Boolean);

  console.log(`Submitting ${urls.length} URLs to Google Indexing API...\n`);

  const results = { success: [], failed: [] };

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      await indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' },
      });
      results.success.push(url);
      console.log(`[${i+1}/${urls.length}] ✓ ${url}`);
    } catch (err) {
      results.failed.push({ url, error: err.message });
      console.error(`[${i+1}/${urls.length}] ✗ ${url}: ${err.message}`);
    }

    if (i < urls.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`Submitted : ${results.success.length}`);
  console.log(`Failed    : ${results.failed.length}`);
  console.log('═══════════════════════════════════════');

  if (results.failed.length > 0) {
    fs.writeFileSync('indexing-failed.txt', results.failed.map(f => f.url).join('\n') + '\n');
    console.log('Failed URLs saved to indexing-failed.txt — retry those manually in GSC');
  }
}

submitUrls().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
