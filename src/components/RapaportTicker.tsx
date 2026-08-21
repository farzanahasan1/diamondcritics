'use client';

const CALC_URL = '/diamond-price-calculator';

const items = [
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

const doubled = [...items, ...items];

export default function RapaportTicker() {
  return (
    <section
      aria-label="Rapaport diamond price index"
      style={{ background: '#fafafa', borderBottom: '1px solid #ebebeb', overflow: 'hidden' }}
    >
      <style>{`
        @keyframes dc-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .dc-ticker-track {
          display: flex;
          width: max-content;
          animation: dc-ticker 40s linear infinite;
        }
        .dc-ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes dc-live-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .dc-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
          animation: dc-live-pulse 2s ease-in-out infinite;
        }
        @media (max-width: 640px) {
          .dc-ticker-track { animation-duration: 28s; }
          .dc-ticker-sub   { display: none !important; }
        }
      `}</style>

      {/* Header row */}
      <a
        href={CALC_URL}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block', borderBottom: '1px solid #ebebeb' }}
        aria-label="Open Rapaport diamond price calculator"
      >
        <div style={{
          maxWidth: '1280px', margin: '0 auto', padding: '0 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '38px', gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div className="dc-live-dot" />
            <span style={{
              fontFamily: 'var(--body)',
              fontSize: '0.63rem',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#888',
              whiteSpace: 'nowrap',
            }}>
              Rapaport Price Index™
            </span>
            <span className="dc-ticker-sub" style={{
              fontFamily: 'var(--body)',
              fontSize: '0.6rem',
              color: '#bbb',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
            }}>
              · Round Brilliant · $/ct
            </span>
          </div>
          <span style={{
            fontFamily: 'var(--body)',
            fontSize: '0.63rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            whiteSpace: 'nowrap',
          }}>
            Price Calculator →
          </span>
        </div>
      </a>

      {/* Scrolling ticker */}
      <div
        style={{ background: '#111', overflow: 'hidden', cursor: 'pointer' }}
        onClick={() => { window.location.href = CALC_URL; }}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = CALC_URL; }}
        aria-label="Diamond price ticker — click for full price calculator"
      >
        <div className="dc-ticker-track">
          {doubled.map((item, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 24px',
                height: '40px',
                borderRight: '1px solid #1e1e1e',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {/* Gold diamond glyph as separator/icon */}
              <span style={{ color: 'var(--gold)', fontSize: '0.5rem', lineHeight: 1 }}>◆</span>

              {/* Weight label */}
              <span style={{
                fontFamily: 'var(--body)',
                fontSize: '0.7rem',
                color: '#aaa',
                letterSpacing: '0.04em',
              }}>
                {item.label}
              </span>

              <span style={{ color: '#333', fontSize: '0.65rem' }}>|</span>

              {/* Price */}
              <span style={{
                fontFamily: 'var(--body)',
                fontSize: '0.76rem',
                fontWeight: 600,
                color: '#fff',
                letterSpacing: '0.02em',
              }}>
                ${item.price}
              </span>

              {/* Change — no rounded corners, matching site sharp style */}
              <span style={{
                fontFamily: 'var(--body)',
                fontSize: '0.62rem',
                fontWeight: 700,
                color: item.up ? '#4ade80' : '#f87171',
                background: item.up ? 'rgba(74,222,128,0.10)' : 'rgba(248,113,113,0.10)',
                border: `1px solid ${item.up ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
                padding: '2px 5px',
                letterSpacing: '0.02em',
              }}>
                {item.up ? '▲' : '▼'} {item.change}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
