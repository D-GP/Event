'use client';

import { useEffect, useState, use, useRef } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  const [copied, setCopied] = useState(false);
  const [downloadingPass, setDownloadingPass] = useState(false);

  const ticketRef = useRef<HTMLDivElement>(null);

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

  // Restore existing registration if saved on this device
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`eventrix_ticket_${id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.registrationId) {
          setRegistrationId(parsed.registrationId);
          if (parsed.name || parsed.email) {
            setForm({ name: parsed.name || '', email: parsed.email || '' });
          }
          QRCode.toDataURL(parsed.registrationId, {
            color: { dark: '#0a0e1a', light: '#ffffff' },
            width: 320,
            margin: 2
          }).then(qr => {
            setQrCodeUrl(qr);
            setRegistered(true);
          });
        }
      }
    } catch {
      // Ignore localStorage errors
    }
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
        setRegistrationId(data.registration.id);
        const qr = await QRCode.toDataURL(data.registration.id, {
          color: { dark: '#0a0e1a', light: '#ffffff' },
          width: 320,
          margin: 2
        });
        setQrCodeUrl(qr);

        // Save to localStorage for future use
        try {
          localStorage.setItem(`eventrix_ticket_${id}`, JSON.stringify({
            registrationId: data.registration.id,
            name: form.name,
            email: form.email
          }));
        } catch {
          // Ignore localStorage errors
        }

        if (data.alreadyRegistered) {
          showToast('Welcome back! Here is your ticket QR code.', 'info');
        } else {
          showToast('Registration successful! Save your QR code.', 'success');
        }
      } else {
        showToast(data.error || 'Registration failed', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setRegistering(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    const safeTitle = (event?.title || 'event').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `${safeTitle}_Ticket_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('QR code downloaded! Keep it handy for check-in.', 'success');
  };

  const downloadTicketPassPDF = async () => {
    if (!ticketRef.current) return;
    setDownloadingPass(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0e1a'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a5'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 4, pdfWidth, pdfHeight);
      const safeTitle = (event?.title || 'event').replace(/[^a-zA-Z0-9_-]/g, '_');
      pdf.save(`${safeTitle}_Event_Pass.pdf`);
      showToast('Event Pass PDF downloaded!', 'success');
    } catch {
      showToast('Failed to generate Pass PDF', 'error');
    } finally {
      setDownloadingPass(false);
    }
  };

  const copyTicketId = () => {
    if (!registrationId) return;
    navigator.clipboard.writeText(registrationId);
    setCopied(true);
    showToast('Ticket ID copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegisterAnother = () => {
    setRegistered(false);
    setQrCodeUrl('');
    setRegistrationId('');
    setForm({ name: '', email: '' });
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
                <div className="success-panel" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎉</div>
                  <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                    You&apos;re Registered!
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Download your QR code below for event check-in and future use.
                  </p>

                  {/* Printable / Downloadable Digital Ticket Pass */}
                  <div
                    ref={ticketRef}
                    style={{
                      background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
                      border: '1px solid rgba(99, 102, 241, 0.35)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem 1.25rem',
                      marginBottom: '1.5rem',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Top ticket header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--primary)', textTransform: 'uppercase' }}>
                        ⚡ Eventrix Pass
                      </span>
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)', fontWeight: 600 }}>
                        ● CONFIRMED
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                      {event.title}
                    </h4>

                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                      📅 {eventDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} &bull; 📍 {event.location}
                    </div>

                    {/* QR Code Container */}
                    {qrCodeUrl && (
                      <div style={{
                        background: '#ffffff',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'inline-block',
                        marginBottom: '1rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                      }}>
                        <img
                          src={qrCodeUrl}
                          alt="Your Ticket QR Code"
                          style={{ width: '190px', height: '190px', display: 'block', margin: '0 auto' }}
                        />
                      </div>
                    )}

                    {/* Attendee Info */}
                    <div style={{ fontSize: '0.875rem', color: 'var(--foreground)', fontWeight: 600, marginBottom: '0.2rem' }}>
                      {form.name || 'Registered Attendee'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: '0.85rem' }}>
                      {form.email}
                    </div>

                    {/* Ticket Registration ID with Copy */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      color: 'var(--muted)',
                      fontFamily: 'monospace'
                    }}>
                      <span>ID: {registrationId.slice(0, 10)}...</span>
                      <button
                        type="button"
                        onClick={copyTicketId}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copied ? 'var(--success)' : 'var(--primary)',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: 0
                        }}
                      >
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Primary QR Code Download Button */}
                    <button
                      type="button"
                      onClick={downloadQRCode}
                      className="btn-primary"
                      style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <span>📥</span>
                      <span>Download QR Code (PNG)</span>
                    </button>

                    {/* PDF Ticket Pass Download Button */}
                    <button
                      type="button"
                      onClick={downloadTicketPassPDF}
                      disabled={downloadingPass}
                      className="btn-secondary"
                      style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      {downloadingPass ? (
                        <>
                          <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                          <span>Generating PDF...</span>
                        </>
                      ) : (
                        <>
                          <span>🎫</span>
                          <span>Download Event Pass (PDF)</span>
                        </>
                      )}
                    </button>

                    {/* View Certificate */}
                    <Link
                      href={`/certificates/${registrationId}`}
                      className="btn-secondary"
                      style={{ width: '100%', fontSize: '0.8125rem', padding: '0.65rem', border: '1px dashed var(--border)' }}
                    >
                      🎓 View Certificate (after check-in)
                    </Link>

                    {/* Register another attendee option */}
                    <button
                      type="button"
                      onClick={handleRegisterAnother}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--muted)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        marginTop: '0.5rem'
                      }}
                    >
                      Register someone else
                    </button>
                  </div>
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
