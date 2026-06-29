export function PostCardSkeleton() {
  return (
    <div className="c-card-elevated" style={{ padding: '14px 16px 12px' }}>
      <div className="c-skeleton" style={{ width: '35%', height: '11px', marginBottom: '10px', borderRadius: '4px' }} />
      <div className="c-skeleton" style={{ width: '85%', height: '15px', marginBottom: '6px', borderRadius: '4px' }} />
      <div className="c-skeleton" style={{ width: '65%', height: '15px', marginBottom: '14px', borderRadius: '4px' }} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <div className="c-skeleton" style={{ width: '56px', height: '28px', borderRadius: '8px' }} />
        <div className="c-skeleton" style={{ width: '72px', height: '28px', borderRadius: '8px' }} />
      </div>
    </div>
  )
}

export function PostFeedSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {Array.from({ length: count }).map((_, i) => <PostCardSkeleton key={i} />)}
    </div>
  )
}

export function SidebarSkeleton() {
  return (
    <aside>
      <div className="c-card" style={{ padding: '16px', marginBottom: '12px' }}>
        <div className="c-skeleton" style={{ width: '60%', height: '14px', marginBottom: '12px', borderRadius: '4px' }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div className="c-skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="c-skeleton" style={{ width: '70%', height: '11px', marginBottom: '4px', borderRadius: '3px' }} />
              <div className="c-skeleton" style={{ width: '40%', height: '10px', borderRadius: '3px' }} />
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
