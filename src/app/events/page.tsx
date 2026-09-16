import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    include: { _count: { select: { registrations: true } } }
  });

  return (
    <div className="container page-wrapper animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title gradient-text">Upcoming Events</h1>
          <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9375rem' }}>
            Discover and register for amazing events
          </p>
        </div>
        <Link href="/organizer/events/new" className="btn-primary">
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🎪</div>
          <h3 className="empty-state-title">No Events Yet</h3>
          <p className="empty-state-desc">
            Be the first to create an event and bring people together!
          </p>
          <Link href="/organizer/events/new" className="btn-primary">
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event: any, index: number) => (
            <div
              key={event.id}
              className={`card event-card animate-fade-in-up stagger-${Math.min(index + 1, 5)}`}
            >
              <div style={{ marginBottom: '1rem' }}>
                <div className="event-card-date">
                  📅 {new Date(event.date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
                <h3 className="event-card-title">{event.title}</h3>
                <p className="event-card-desc">{event.description}</p>
              </div>
              <div className="event-card-footer">
                <div className="event-card-meta">
                  <span>📍 {event.location}</span>
                  <span>👥 {event._count.registrations} registered</span>
                </div>
                <Link
                  href={`/events/${event.id}`}
                  className="btn-primary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
