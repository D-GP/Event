import Link from 'next/link';

export default function Home() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Next-Gen Event Experience</h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.25rem', marginBottom: '3rem' }}>
          Seamlessly organize, manage, and attend events with AI-powered descriptions, 
          instant QR check-ins, and automated certificates.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/events" className="btn-primary">
            Browse Events
          </Link>
          <Link href="/organizer" className="btn-secondary">
            Organizer Dashboard
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '6rem' }}>
        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✨</div>
          <h3 style={{ marginBottom: '0.5rem' }}>AI Descriptions</h3>
          <p style={{ color: 'var(--muted)' }}>Generate compelling event pages with Google Gemini AI in seconds.</p>
        </div>
        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📱</div>
          <h3 style={{ marginBottom: '0.5rem' }}>QR Check-in</h3>
          <p style={{ color: 'var(--muted)' }}>Frictionless entry for attendees with automated QR code scanning.</p>
        </div>
        <div className="card">
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎓</div>
          <h3 style={{ marginBottom: '0.5rem' }}>Certificates</h3>
          <p style={{ color: 'var(--muted)' }}>Automatically issue PDF certificates to checked-in participants.</p>
        </div>
      </div>
    </div>
  );
}
