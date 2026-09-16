import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>

        <div className="container">
          <div className="animate-fade-in-up stagger-1">
            <div className="hero-badge">
              ⚡ Powered by AI & QR Technology
            </div>
          </div>
          
          <h1 className="hero-title animate-fade-in-up stagger-2">
            <span className="gradient-text">The Future of</span>
            <br />
            Event Management
          </h1>
          
          <p className="hero-subtitle animate-fade-in-up stagger-3">
            Seamlessly organize, manage, and attend events with AI-powered descriptions, 
            instant QR check-ins, and beautifully generated certificates.
          </p>
          
          <div className="hero-actions animate-fade-in-up stagger-4">
            <Link href="/events" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.0625rem' }}>
              Explore Events
            </Link>
            <Link href="/organizer" className="btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.0625rem' }}>
              Organizer Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="container">
        <div className="stats-bar glass-panel animate-fade-in-up stagger-5">
          <div className="stat-item">
            <div className="stat-value gradient-text">∞</div>
            <div className="stat-label">Events</div>
          </div>
          <div className="stat-item">
            <div className="stat-value gradient-text">⚡</div>
            <div className="stat-label">Instant Check-in</div>
          </div>
          <div className="stat-item">
            <div className="stat-value gradient-text">AI</div>
            <div className="stat-label">Powered</div>
          </div>
          <div className="stat-item">
            <div className="stat-value gradient-text">PDF</div>
            <div className="stat-label">Certificates</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container">
        <div className="features-grid">
          <div className="card feature-card animate-fade-in-up stagger-1">
            <div className="feature-icon feature-icon-ai">✨</div>
            <h3 className="feature-title">AI Event Descriptions</h3>
            <p className="feature-desc">
              Generate compelling, professional event descriptions in seconds using Google Gemini AI. Just enter your title and keywords.
            </p>
          </div>

          <div className="card feature-card animate-fade-in-up stagger-2">
            <div className="feature-icon feature-icon-qr">📱</div>
            <h3 className="feature-title">QR Code Check-in</h3>
            <p className="feature-desc">
              Attendees receive a unique QR code upon registration. Organizers can scan codes for frictionless, instant venue check-in.
            </p>
          </div>

          <div className="card feature-card animate-fade-in-up stagger-3">
            <div className="feature-icon feature-icon-cert">🎓</div>
            <h3 className="feature-title">Auto Certificates</h3>
            <p className="feature-desc">
              Beautiful PDF certificates of attendance are automatically available for download after a successful check-in.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
        <div className="glass-panel" style={{ padding: '4rem 2rem', borderRadius: 'var(--radius-xl)', maxWidth: '700px', margin: '0 auto' }}>
          <h2 className="gradient-text" style={{ marginBottom: '1rem' }}>Ready to Get Started?</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '1.0625rem' }}>
            Create your first event in under 60 seconds — no account required.
          </p>
          <Link href="/organizer/events/new" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.0625rem' }}>
            Create Your Event →
          </Link>
        </div>
      </section>
    </>
  );
}
