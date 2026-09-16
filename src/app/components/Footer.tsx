import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link href="/events" className="footer-link">Browse Events</Link>
        <Link href="/organizer" className="footer-link">Dashboard</Link>
        <Link href="/organizer/events/new" className="footer-link">Create Event</Link>
        <Link href="/organizer/scanner" className="footer-link">QR Scanner</Link>
      </div>
      <p>
        Built with ⚡ by <span className="gradient-text" style={{ fontWeight: 600 }}>Eventrix</span> &mdash; Next-Gen Event Management
      </p>
      <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
        Powered by Next.js, Prisma & Google Gemini AI
      </p>
    </footer>
  );
}
