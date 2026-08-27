'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '' });
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvent(data.event);
        }
        setLoading(false);
      });
  }, [id]);

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
        // Generate QR code with Registration ID
        const qr = await QRCode.toDataURL(data.registration.id, { color: { dark: '#0f172a', light: '#ffffff' } });
        setQrCodeUrl(qr);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Registration failed.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading event details...</div>;
  if (!event) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Event not found.</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '1000px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem' }}>
        
        {/* Left Column: Event Details */}
        <div>
          <div style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '1rem' }}>
            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
          </div>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', background: 'none', WebkitTextFillColor: 'var(--foreground)' }}>{event.title}</h1>
          
          <div style={{ padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
            <strong>Location:</strong> {event.location}
          </div>

          <div style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--muted)', whiteSpace: 'pre-wrap' }}>
            {event.description}
          </div>
        </div>

        {/* Right Column: Registration & Ticket */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '2rem' }}>
            {registered ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>You're Registered!</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
                  Please save this QR Code. You will need it to check-in at the venue.
                </p>
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="Your Ticket QR Code" style={{ width: '200px', height: '200px', margin: '0 auto', borderRadius: 'var(--radius-md)' }} />
                )}
                <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
                  Name: {form.name} <br/>
                  Email: {form.email}
                </div>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Reserve Your Spot</h3>
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Full Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      required 
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email Address</label>
                    <input 
                      type="email" 
                      className="input-field" 
                      required 
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                    />
                  </div>
                  <button type="submit" disabled={registering} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                    {registering ? 'Registering...' : 'Complete Registration'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
