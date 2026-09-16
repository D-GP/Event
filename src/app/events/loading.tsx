export default function EventsLoading() {
  return (
    <div className="container page-wrapper animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div className="page-header">
        <div className="skeleton skeleton-title" style={{ width: '250px' }}></div>
        <div className="skeleton" style={{ width: '150px', height: '44px', borderRadius: 'var(--radius-md)' }}></div>
      </div>
      <div className="events-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton skeleton-card"></div>
        ))}
      </div>
    </div>
  );
}
