import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function OrganizerDashboard() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
    include: {
      _count: { select: { registrations: true } },
      registrations: { where: { checkedIn: true } }
    }
  });

  const totalRegistrations = events.reduce((sum, e) => sum + e._count.registrations, 0);
  const totalCheckedIn = events.reduce((sum, e) => sum + e.registrations.length, 0);

  return (
    <div className="container page-wrapper animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title gradient-text">Organizer Dashboard</h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9375rem' }}>
            Manage your events and track attendance
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/organizer/scanner" className="btn-secondary">
            📷 Open Scanner
          </Link>
          <Link href="/organizer/events/new" className="btn-primary">
            + New Event
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
          <div className="stat-item">
            <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--primary-hover)' }}>{events.length}</div>
            <div className="stat-label">Total Events</div>
          </div>
          <div className="stat-item">
            <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--accent)' }}>{totalRegistrations}</div>
            <div className="stat-label">Registrations</div>
          </div>
          <div className="stat-item">
            <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--success)' }}>{totalCheckedIn}</div>
            <div className="stat-label">Checked In</div>
          </div>
          <div className="stat-item">
            <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--warning)' }}>
              {totalRegistrations > 0 ? Math.round((totalCheckedIn / totalRegistrations) * 100) : 0}%
            </div>
            <div className="stat-label">Check-in Rate</div>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.375rem' }}>Your Events</h2>

      {events.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🎯</div>
          <h3 className="empty-state-title">No Events Created</h3>
          <p className="empty-state-desc">
            Create your first event and start managing registrations.
          </p>
          <Link href="/organizer/events/new" className="btn-primary">
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event: any, index: number) => {
            const isPast = new Date(event.date) < new Date();
            return (
              <div
                key={event.id}
                className={`card event-card animate-fade-in-up stagger-${Math.min(index + 1, 5)}`}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {isPast ? (
                      <span className="badge badge-warning">Completed</span>
                    ) : (
                      <span className="badge badge-success">Active</span>
                    )}
                  </div>
                  <h3 className="event-card-title">{event.title}</h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>
                    📅 {new Date(event.date).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                    &nbsp;&middot;&nbsp;📍 {event.location}
                  </div>
                </div>

                <div className="dashboard-stats">
                  <div className="dashboard-stat">
                    <div className="dashboard-stat-value" style={{ color: 'var(--primary-hover)' }}>
                      {event._count.registrations}
                    </div>
                    <div className="dashboard-stat-label">Registered</div>
                  </div>
                  <div className="dashboard-stat">
                    <div className="dashboard-stat-value" style={{ color: 'var(--success)' }}>
                      {event.registrations.length}
                    </div>
                    <div className="dashboard-stat-label">Checked In</div>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <Link
                    href={`/events/${event.id}`}
                    className="btn-secondary"
                    style={{ flex: 1, textAlign: 'center', fontSize: '0.8125rem' }}
                  >
                    View Event
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
