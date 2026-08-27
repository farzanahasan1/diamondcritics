// One-time setup: creates rapi_prices table and inserts initial data
// Run: node setup-rapi-table.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('fs').readFileSync(path.join(__dirname, '.env.local'), 'utf8')
  .split('\n').forEach(line => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ticker = [
  { label: '0.30 ct', price: '899',    change: '+1.67%', up: true  },
  { label: '0.50 ct', price: '1,230',  change: '+1.89%', up: true  },
  { label: '0.70 ct', price: '1,580',  change: '+0.95%', up: true  },
  { label: '1.00 ct', price: '3,881',  change: '+0.25%', up: true  },
  { label: '1.50 ct', price: '8,200',  change: '+0.43%', up: true  },
  { label: '2.00 ct', price: '14,500', change: '+0.28%', up: true  },
  { label: '3.00 ct', price: '17,779', change: '−0.12%', up: false },
  { label: '4.00 ct', price: '22,400', change: '−0.52%', up: false },
  { label: '5.00 ct', price: '28,100', change: '+0.19%', up: true  },
];

const chart = {
  '0.30': { current: 899,   change: '+1.67%', up: true,  history: [565,548,530,516,505,496,490,488,492,498,507,516,526] },
  '0.50': { current: 1230,  change: '+1.89%', up: true,  history: [720,700,678,660,648,636,630,627,632,642,655,668,682] },
  '1.00': { current: 3881,  change: '+0.25%', up: true,  history: [1185,1095,1020,972,940,898,875,862,870,892,928,1060,1188] },
  '3.00': { current: 17779, change: '−0.12%', up: false, history: [1780,1812,1820,1800,1775,1748,1718,1692,1672,1678,1692,1705,1778] },
};

async function run() {
  console.log('Creating table via RPC...');

  // Create table using raw SQL via Supabase's rpc (service role bypasses RLS)
  const { error: sqlErr } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS rapi_prices (
        id         INTEGER PRIMARY KEY DEFAULT 1,
        updated_at DATE NOT NULL,
        ticker     JSONB NOT NULL,
        chart      JSONB NOT NULL
      );
      ALTER TABLE rapi_prices ENABLE ROW LEVEL SECURITY;
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename='rapi_prices' AND policyname='public read'
        ) THEN
          CREATE POLICY "public read" ON rapi_prices FOR SELECT USING (true);
        END IF;
      END $$;
    `
  });

  // exec_sql rpc might not exist — that's ok, just insert directly
  if (sqlErr) {
    console.log('Note: exec_sql RPC not available — inserting directly (table must already exist).');
    console.log('If you get an error below, first run Query 1 from the instructions in Supabase SQL Editor.');
  }

  console.log('Inserting initial data...');
  const { error } = await supabase
    .from('rapi_prices')
    .upsert({
      id: 1,
      updated_at: '2026-08-27',
      ticker,
      chart,
    }, { onConflict: 'id' });

  if (error) {
    console.error('ERROR:', error.message);
    console.log('\nThe table probably does not exist yet.');
    console.log('Run this ONE query in Supabase SQL Editor, then run this script again:\n');
    console.log('CREATE TABLE IF NOT EXISTS rapi_prices (');
    console.log('  id         INTEGER PRIMARY KEY DEFAULT 1,');
    console.log('  updated_at DATE NOT NULL,');
    console.log('  ticker     JSONB NOT NULL,');
    console.log('  chart      JSONB NOT NULL');
    console.log(');');
    console.log('ALTER TABLE rapi_prices ENABLE ROW LEVEL SECURITY;');
    console.log('CREATE POLICY "public read" ON rapi_prices FOR SELECT USING (true);');
    process.exit(1);
  }

  console.log('Done! Table created and data inserted.');
  console.log('Check Supabase → Table Editor → rapi_prices to verify.');
}

run().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
