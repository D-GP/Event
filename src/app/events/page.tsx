import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    include: { _count: { select: { registrations: true } } }
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Upcoming Events</h1>
        <Link href="/organizer/events/new" className="btn-primary">
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>No events found.</p>
          <Link href="/organizer/events/new" className="btn-secondary">Be the first to create one</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {events.map((event: any) => (
            <div key={event.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{event.title}</h3>
                <p style={{ color: 'var(--muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {event.description}
                </p>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                  📍 {event.location} <br />
                  👥 {event._count.registrations} registered
                </span>
                <Link href={`/events/${event.id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
