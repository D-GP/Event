export default function OrganizerLoading() {
  return (
    <div className="container page-wrapper animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div className="page-header">
        <div className="skeleton skeleton-title" style={{ width: '300px' }}></div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="skeleton" style={{ width: '140px', height: '44px', borderRadius: 'var(--radius-md)' }}></div>
          <div className="skeleton" style={{ width: '140px', height: '44px', borderRadius: 'var(--radius-md)' }}></div>
        </div>
      </div>
      <div className="skeleton skeleton-title" style={{ width: '180px', marginBottom: '1.5rem' }}></div>
      <div className="events-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton skeleton-card"></div>
        ))}
      </div>
    </div>
  );
}
