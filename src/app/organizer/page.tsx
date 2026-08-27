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

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>Organizer Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/organizer/scanner" className="btn-secondary">
            📷 Open Scanner
          </Link>
          <Link href="/organizer/events/new" className="btn-primary">
            + New Event
          </Link>
        </div>
      </div>

      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Your Events</h2>
      
      {events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>You haven't organized any events yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {events.map((event: any) => (
            <div key={event.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{event.title}</h3>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{event._count.registrations}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Registered</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{event.registrations.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Checked In</div>
                </div>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                <Link href={`/events/${event.id}`} className="btn-secondary" style={{ flex: 1, textAlign: 'center', fontSize: '0.875rem' }}>
                  View Page
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
