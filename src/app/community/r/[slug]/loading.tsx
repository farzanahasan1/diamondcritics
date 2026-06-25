export default function CommunitySlugLoading() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
      <div>
        {/* Community header skeleton */}
        <div style={{
          background: '#fff', borderRadius: '12px', overflow: 'hidden',
          marginBottom: '12px', boxShadow: '0 1px 4px rgba(28,18,9,0.07)',
        }}>
          <div style={{ height: 68, background: 'linear-gradient(135deg, #1C1209 0%, #3A2208 100%)' }} />
          <div style={{ padding: '28px 20px 16px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ width: 100, height: 16, borderRadius: '4px', background: '#EDE8E1', marginBottom: '8px', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
              <div style={{ width: '70%', height: 12, borderRadius: '4px', background: '#F0ECE5', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
            </div>
          </div>
        </div>

        {/* Sort bar skeleton */}
        <div style={{
          background: '#fff', borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(28,18,9,0.07)',
          padding: '8px 12px', display: 'flex', gap: '8px',
          marginBottom: '12px',
        }}>
          {[60, 52, 52].map((w, i) => (
            <div key={i} style={{ width: w, height: 32, borderRadius: '8px', background: '#F0ECE5', animation: 'skeleton-pulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>

        {/* Post card skeletons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{
              background: '#fff', borderRadius: '12px',
              boxShadow: '0 1px 4px rgba(28,18,9,0.07)',
              display: 'flex', overflow: 'hidden',
            }}>
              <div style={{ width: 44, flexShrink: 0, background: '#FAF8F5', borderRight: '1px solid #EDE8E1', padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 20, height: 20, borderRadius: '4px', background: '#EDE8E1', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
                <div style={{ width: 24, height: 14, borderRadius: '4px', background: '#EDE8E1', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
                <div style={{ width: 20, height: 20, borderRadius: '4px', background: '#EDE8E1', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
              </div>
              <div style={{ flex: 1, padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: 80, height: 12, borderRadius: '4px', background: '#F0ECE5', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
                  <div style={{ width: 60, height: 12, borderRadius: '4px', background: '#F0ECE5', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
                </div>
                <div style={{ width: '80%', height: 16, borderRadius: '4px', background: '#EDE8E1', marginBottom: '6px', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
                <div style={{ width: '55%', height: 16, borderRadius: '4px', background: '#EDE8E1', marginBottom: '10px', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
                <div style={{ width: 80, height: 12, borderRadius: '4px', background: '#F0ECE5', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(28,18,9,0.07)', padding: '16px' }}>
          <div style={{ width: '70%', height: 14, borderRadius: '4px', background: '#EDE8E1', marginBottom: '12px', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: 28, height: 28, borderRadius: '8px', background: '#F0ECE5', flexShrink: 0, animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
              <div style={{ flex: 1, height: 12, borderRadius: '4px', background: '#F0ECE5', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  )
}
