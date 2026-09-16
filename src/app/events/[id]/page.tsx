'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { useToast } from '@/app/components/Toast';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const { showToast } = useToast();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '' });
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [registrationId, setRegistrationId] = useState('');

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvent(data.event);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        showToast('Failed to load event details', 'error');
      });
  }, [id, showToast]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setRegistered(true);
        setRegistrationId(data.registration.id);
        const qr = await QRCode.toDataURL(data.registration.id, {
          color: { dark: '#0a0e1a', light: '#ffffff' },
          width: 250,
          margin: 2
        });
        setQrCodeUrl(qr);
        showToast('Registration successful! Save your QR code.', 'success');
      } else {
        showToast(data.error || 'Registration failed', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="container page-wrapper" style={{ padding: '3rem 1.5rem' }}>
        <div className="loading-center">
          <div className="spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container page-wrapper" style={{ padding: '3rem 1.5rem' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h2 className="empty-state-title">Event Not Found</h2>
          <p className="empty-state-desc">This event may have been removed or the link is incorrect.</p>
          <Link href="/events" className="btn-primary">Browse Events</Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <div className="container page-wrapper animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '1100px' }}>
      {/* Back link */}
      <Link href="/events" style={{ color: 'var(--muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        ← Back to Events
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
        {/* Large screens: side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '2.5rem' }}>
          
          {/* Left Column: Event Details */}
          <div className="animate-slide-left" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {isPast ? (
                <span className="badge badge-warning">Past Event</span>
              ) : (
                <span className="badge badge-success">Upcoming</span>
              )}
              <span className="badge badge-primary">
                👥 {event._count?.registrations || 0} registered
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1.5rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {event.title}
            </h1>

            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📅</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date & Time</div>
                  <div style={{ fontWeight: 600 }}>
                    {eventDate.toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                    {eventDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📍</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</div>
                  <div style={{ fontWeight: 600 }}>{event.location}</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: 'var(--muted)', whiteSpace: 'pre-wrap' }}>
              {event.description}
            </div>
          </div>

          {/* Right Column: Registration & Ticket */}
          <div className="animate-slide-right" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <div className="card" style={{ position: 'sticky', top: '88px' }}>
              {registered ? (
                <div className="success-panel">
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
                  <h3 style={{ color: 'var(--success)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>You&apos;re Registered!</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    Save this QR code — you&apos;ll need it for check-in at the venue.
                  </p>
                  {qrCodeUrl && (
                    <div style={{ background: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '1.5rem' }}>
                      <img src={qrCodeUrl} alt="Your Ticket QR Code" style={{ width: '200px', height: '200px', display: 'block' }} />
                    </div>
                  )}
                  <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
                    <strong>{form.name}</strong><br />
                    {form.email}
                  </div>
                  <Link
                    href={`/certificates/${registrationId}`}
                    className="btn-secondary"
                    style={{ width: '100%', fontSize: '0.875rem' }}
                  >
                    🎓 View Certificate (after check-in)
                  </Link>
                </div>
              ) : (
                <>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Reserve Your Spot</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
                    Free registration — takes 10 seconds
                  </p>
                  <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label>Full Name</label>
                      <input
                        type="text"
                        className="input-field"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label>Email Address</label>
                      <input
                        type="email"
                        className="input-field"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={registering}
                      className="btn-primary"
                      style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem' }}
                    >
                      {registering ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
                          Registering...
                        </span>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile responsive override */}
      <style>{`
        @media (max-width: 850px) {
          div[style*="gridTemplateColumns: 'minmax(0, 1fr) 380px'"],
          div[style*="grid-template-columns"] {
            display: flex !important;
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
