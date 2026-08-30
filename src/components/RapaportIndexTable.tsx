'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Row {
  wt: string;
  change: string;
  up: boolean;
  verdict: string;
}

function buildVerdict(key: string, change: string, up: boolean): string {
  const pct = change.replace(/[^0-9.]/g, '') + '%';
  switch (key) {
    case '0.30':
      return up
        ? `Small stones recovering. Prices ${change} — buy ahead of continued upward momentum.`
        : `Small stones under pressure. Prices ${change} — good window to buy before the floor firms.`;
    case '0.50':
      return up
        ? `Strong recovery segment. Half-carat prices ${change} — the floor is in, prices are climbing.`
        : `Half-carat prices softening ${change} — more negotiating room for buyers right now.`;
    case '1.00':
      return up
        ? `1ct market turning positive. Prices ${change} — slight urgency returning after a flat year.`
        : `1ct prices eased ${change} — flat market with maximum retailer competition.`;
    case '3.00':
      return up
        ? `3ct natural recovering. Prices ${change} — lab alternatives still dominate value at this size.`
        : `3ct natural under mild pressure. Prices ${change} — lab alternatives dominate value at this size.`;
    default:
      return up ? `Up ${pct}.` : `Down ${pct}.`;
  }
}

const FALLBACK_ROWS: Row[] = [
  { wt: '0.30 ct', change: '+2.83%', up: true,  verdict: buildVerdict('0.30', '+2.83%', true) },
  { wt: '0.50 ct', change: '+2.57%', up: true,  verdict: buildVerdict('0.50', '+2.57%', true) },
  { wt: '1.00 ct', change: '+0.35%', up: true,  verdict: buildVerdict('1.00', '+0.35%', true) },
  { wt: '3.00 ct', change: '+0.07%', up: true,  verdict: buildVerdict('3.00', '+0.07%', true) },
];

const SIZE_KEYS = [
  { key: '0.30', label: '0.30 ct' },
  { key: '0.50', label: '0.50 ct' },
  { key: '1.00', label: '1.00 ct' },
  { key: '3.00', label: '3.00 ct' },
];

export default function RapaportIndexTable({ updatedLabel }: { updatedLabel?: string }) {
  const [rows, setRows]         = useState<Row[]>(FALLBACK_ROWS);
  const [dateLabel, setDate]    = useState(updatedLabel ?? '');

  useEffect(() => {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    sb.from('rapi_prices')
      .select('chart, updated_at')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (!data?.chart) return;
        const newRows: Row[] = SIZE_KEYS.map(({ key, label }) => {
          const entry = data.chart[key];
          if (!entry) return FALLBACK_ROWS.find(r => r.wt === label)!;
          return {
            wt:      label,
            change:  entry.change,
            up:      entry.up,
            verdict: buildVerdict(key, entry.change, entry.up),
          };
        });
        setRows(newRows);
        if (data.updated_at) {
          const d    = new Date(data.updated_at);
          const prev = new Date(d);
          prev.setFullYear(prev.getFullYear() - 1);
          const fmt  = (dt: Date) => dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
          setDate(`${fmt(prev)} – ${fmt(d)}`);
        }
      });
  }, []);

  return (
    <div style={{ overflowX: 'auto', margin: '1.75rem 0 2rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--body)', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#111', color: '#fff' }}>
            <th style={{ padding: '10px 16px', textAlign: 'left',  fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Carat Weight</th>
            <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>12-Month Change</th>
            <th style={{ padding: '10px 16px', textAlign: 'left',  fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>What This Means for Buyers</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.wt} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa', borderBottom: '1px solid #ebebeb' }}>
              <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111' }}>{row.wt}</td>
              <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: row.up ? '#16a34a' : '#dc2626' }}>{row.change}</td>
              <td style={{ padding: '12px 16px', color: '#555' }}>{row.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {dateLabel && (
        <p style={{ fontFamily: 'var(--body)', fontSize: '0.72rem', color: '#bbb', marginTop: '8px' }}>
          {dateLabel}. Based on Rapaport benchmark methodology. RAPI™ is a trademark of Rapaport Group Inc.
        </p>
      )}
    </div>
  );
}
