'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const CALC_URL = '/diamond-price-calculator';

type WeightKey = '0.30' | '0.50' | '1.00' | '3.00';

interface ChartEntry {
  current: number;
  change: string;
  up: boolean;
  history: number[];
}

const FALLBACK_DATASETS: Record<WeightKey, ChartEntry> = {
  '0.30': { current: 899,   change: '+1.67%', up: true,  history: [565,548,530,516,505,496,490,488,492,498,507,516,526] },
  '0.50': { current: 1230,  change: '+1.89%', up: true,  history: [720,700,678,660,648,636,630,627,632,642,655,668,682] },
  '1.00': { current: 3881,  change: '+0.25%', up: true,  history: [1185,1095,1020,972,940,898,875,862,870,892,928,1060,1188] },
  '3.00': { current: 17779, change: '−0.12%', up: false, history: [1780,1812,1820,1800,1775,1748,1718,1692,1672,1678,1692,1705,1778] },
};

const TABLE_ROWS: { key: WeightKey; size: string }[] = [
  { key: '0.30', size: '0.30 ct.' },
  { key: '0.50', size: '0.50 ct.' },
  { key: '1.00', size: '1.00 ct.' },
  { key: '3.00', size: '3.00 ct.' },
];

const X_LABELS  = ['Aug 25', 'Nov 25', 'Feb 26', 'May 26', 'Aug 26'];
const X_TICK_IDX = [0, 3, 6, 9, 12];
const N = 13;

const VW = 520, VH = 190;
const PAD = { l: 52, t: 14, r: 14, b: 42 };
const CW  = VW - PAD.l - PAD.r;
const CH  = VH - PAD.t - PAD.b;
const X_STEP = CW / (N - 1);

function toX(i: number) { return PAD.l + i * X_STEP; }
function toY(v: number, yMin: number, yMax: number) {
  return PAD.t + ((yMax - v) / (yMax - yMin)) * CH;
}

function deriveRange(history: number[]): { yMin: number; yMax: number; yTicks: number[] } {
  const min  = Math.min(...history);
  const max  = Math.max(...history);
  const pad  = (max - min) * 0.15 || max * 0.1;
  const yMin = Math.floor((min - pad) / 50) * 50;
  const yMax = Math.ceil((max + pad) / 50) * 50;
  const step = Math.ceil((yMax - yMin) / 4 / 50) * 50;
  const ticks: number[] = [];
  for (let t = yMax; t >= yMin; t -= step) ticks.push(t);
  return { yMin, yMax, yTicks: ticks };
}

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = i > 0 ? pts[i - 1] : pts[i];
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const [x3, y3] = i < pts.length - 2 ? pts[i + 2] : pts[i + 1];
    const cp1x = x1 + (x2 - x0) / 5;
    const cp1y = y1 + (y2 - y0) / 5;
    const cp2x = x2 - (x3 - x1) / 5;
    const cp2y = y2 - (y3 - y1) / 5;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
  }
  return d;
}

function fmtTick(v: number) {
  return v >= 1000 ? `$${(v / 1000).toFixed(1).replace(/\.0$/, '')}K` : `$${v}`;
}

export default function DiamondPriceChart() {
  const [active,   setActive]   = useState<WeightKey>('1.00');
  const [datasets, setDatasets] = useState<Record<WeightKey, ChartEntry>>(FALLBACK_DATASETS);
  const [updatedAt, setUpdatedAt] = useState('Aug 20, 2025 – Aug 20, 2026');

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
        if (data?.chart) {
          setDatasets(data.chart as Record<WeightKey, ChartEntry>);
          if (data.updated_at) {
            const d = new Date(data.updated_at);
            const prev = new Date(d);
            prev.setFullYear(prev.getFullYear() - 1);
            const fmt = (dt: Date) => dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
            setUpdatedAt(`${fmt(prev)} – ${fmt(d)}`);
          }
        }
      });
  }, []);

  const ds  = datasets[active];
  const { yMin, yMax, yTicks } = deriveRange(ds.history);
  const pts: [number, number][] = ds.history.map((v, i) => [toX(i), toY(v, yMin, yMax)]);
  const linePath  = smoothPath(pts);
  const areaPath  = `${linePath} L ${pts[N - 1][0].toFixed(1)},${(PAD.t + CH).toFixed(1)} L ${pts[0][0].toFixed(1)},${(PAD.t + CH).toFixed(1)} Z`;

  return (
    <section
      aria-label="Rapaport diamond price chart section"
      style={{ borderBottom: '1px solid #ebebeb', background: '#fff' }}
    >
      <div
        style={{
          maxWidth: '1280px', margin: '0 auto', padding: '0 2rem',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0',
        }}
        className="dc-price-chart-grid"
      >
        {/* ── Left ── */}
        <div
          style={{
            padding: '3.5rem 3rem 3.5rem 0',
            borderRight: '1px solid #ebebeb',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}
          className="dc-price-chart-left"
        >
          <p style={{ fontFamily: 'var(--body)', fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.75rem' }}>
            Market Intelligence
          </p>
          <h2 style={{ fontFamily: 'var(--heading)', fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: 300, lineHeight: 1.15, color: '#111', marginBottom: '1.1rem' }}>
            The Global Benchmark<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>for Pricing Diamonds.</em>
          </h2>
          <p style={{ fontFamily: 'var(--body)', fontSize: '0.88rem', lineHeight: 1.78, color: '#555', marginBottom: '1rem', maxWidth: '400px' }}>
            The Rapaport Diamond Price List is the international benchmark used to price diamonds across all major markets worldwide.
          </p>
          <p style={{ fontFamily: 'var(--body)', fontSize: '0.88rem', lineHeight: 1.78, color: '#555', marginBottom: '2rem', maxWidth: '400px' }}>
            Over 20,000 professionals in 100+ countries use Rapaport pricing data daily to accurately value diamonds and negotiate deals.
          </p>
          <Link href={CALC_URL} style={{
            display: 'inline-block', background: '#111', color: '#fff',
            fontFamily: 'var(--body)', fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.13em', textTransform: 'uppercase',
            padding: '13px 28px', textDecoration: 'none', width: 'fit-content',
          }}>
            Diamond Price Calculator →
          </Link>
          <p style={{ fontFamily: 'var(--body)', fontSize: '0.63rem', color: '#bbb', marginTop: '1rem', letterSpacing: '0.04em' }}>
            Based on{' '}
            <a href="https://rapaport.com/" target="_blank" rel="nofollow noopener noreferrer" style={{ color: '#bbb', textDecoration: 'underline' }}>
              Rapaport
            </a>
            {' '}Price List data. Updated daily.
          </p>
        </div>

        {/* ── Right: Chart + Table ── */}
        <div style={{ padding: '3rem 0 3rem 3rem', display: 'flex', flexDirection: 'column', gap: '0' }} className="dc-price-chart-right">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <p style={{ fontFamily: 'var(--body)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '3px' }}>
                Rapaport Trade Diamond Index (RAPI™)
              </p>
              <p style={{ fontFamily: 'var(--body)', fontSize: '0.68rem', color: '#bbb', letterSpacing: '0.04em' }}>
                {updatedAt}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }} className="dc-chart-inner">
            {/* Mini table */}
            <div style={{ flexShrink: 0 }} className="dc-mini-table">
              <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', borderTop: '1px solid #ebebeb', borderLeft: '1px solid #ebebeb' }}>
                <div style={{ padding: '6px 14px', borderRight: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb', background: '#fafafa' }}>
                  <span style={{ fontFamily: 'var(--body)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa' }}>Size</span>
                </div>
                <div style={{ padding: '6px 14px', borderRight: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb', background: '#fafafa' }}>
                  <span style={{ fontFamily: 'var(--body)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa' }}>Monthly</span>
                </div>
                {TABLE_ROWS.map((row) => {
                  const rowDs   = datasets[row.key];
                  const isActive = active === row.key;
                  return (
                    <>
                      <div key={`sz-${row.key}`} onClick={() => setActive(row.key)}
                        style={{ padding: '8px 14px', borderRight: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb', background: isActive ? '#111' : '#fff', cursor: 'pointer', transition: 'background 0.15s' }}>
                        <span style={{ fontFamily: 'var(--body)', fontSize: '0.78rem', color: isActive ? '#fff' : '#333', whiteSpace: 'nowrap', fontWeight: isActive ? 600 : 400 }}>
                          {row.size}
                        </span>
                      </div>
                      <div key={`ch-${row.key}`} onClick={() => setActive(row.key)}
                        style={{ padding: '8px 14px', borderRight: '1px solid #ebebeb', borderBottom: '1px solid #ebebeb', textAlign: 'right', background: isActive ? '#111' : '#fff', cursor: 'pointer', transition: 'background 0.15s' }}>
                        <span style={{ fontFamily: 'var(--body)', fontSize: '0.78rem', fontWeight: 600, color: isActive ? (rowDs.up ? '#4ade80' : '#f87171') : (rowDs.up ? '#16a34a' : '#dc2626') }}>
                          {rowDs.change}
                        </span>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>

            {/* SVG chart */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <svg viewBox={`0 0 ${VW} ${VH}`} width="100%" style={{ display: 'block', overflow: 'visible' }}
                aria-label={`RAPI diamond price index chart for ${active} ct`} role="img">
                <defs>
                  <linearGradient id="dc-area-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {yTicks.map((yv) => {
                  const gy = toY(yv, yMin, yMax);
                  return (
                    <g key={yv}>
                      <line x1={PAD.l} y1={gy} x2={VW - PAD.r} y2={gy} stroke="#ebebeb" strokeWidth="1" />
                      <text x={PAD.l - 6} y={gy + 4} textAnchor="end" fontSize="10" fill="#bbb" fontFamily="var(--body)">
                        {fmtTick(yv)}
                      </text>
                    </g>
                  );
                })}
                <line x1={PAD.l} y1={PAD.t + CH} x2={VW - PAD.r} y2={PAD.t + CH} stroke="#ddd" strokeWidth="1" />
                {X_TICK_IDX.map((idx, li) => (
                  <text key={idx} x={toX(idx)} y={VH - 6} textAnchor="middle" fontSize="9.5" fill="#bbb" fontFamily="var(--body)">
                    {X_LABELS[li]}
                  </text>
                ))}
                <path d={areaPath} fill="url(#dc-area-fill)" />
                <path d={linePath} fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                <text x={PAD.l + 8} y={PAD.t + 14} fontSize="10" fill="#ccc" fontFamily="var(--body)" fontWeight="700" letterSpacing="0.08em">
                  RAPI™ · {active} ct
                </text>
              </svg>
            </div>
          </div>

          <p style={{ fontFamily: 'var(--body)', fontSize: '0.62rem', color: '#bbb', lineHeight: 1.6, marginTop: '1rem', borderTop: '1px solid #ebebeb', paddingTop: '0.75rem' }}>
            The RAPI™ is the global standard diamond price index, based on{' '}
            <a href="https://rapaport.com/" target="_blank" rel="nofollow noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Rapaport</a>
            {' '}Price List data. Use our{' '}
            <Link href={CALC_URL} style={{ color: 'var(--gold)', textDecoration: 'none' }}>diamond price calculator</Link>
            {' '}to get an estimate for any stone.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dc-price-chart-grid  { grid-template-columns: 1fr !important; }
          .dc-price-chart-left  { padding: 2.5rem 0 2rem !important; border-right: none !important; border-bottom: 1px solid #ebebeb; }
          .dc-price-chart-right { padding: 2rem 0 2.5rem !important; }
          .dc-chart-inner       { flex-direction: column !important; }
          .dc-mini-table        { width: 100% !important; }
          .dc-mini-table > div  { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .dc-price-chart-left h2 { font-size: 1.5rem !important; }
        }
      `}</style>
    </section>
  );
}
