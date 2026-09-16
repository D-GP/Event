'use client';

import { useEffect, useState, use, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Link from 'next/link';
import { useToast } from '@/app/components/Toast';

export default function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const { showToast } = useToast();

  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/certificates/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRegistration(data.registration);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        showToast('Failed to load certificate data', 'error');
      });
  }, [id, showToast]);

  const downloadPDF = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true, backgroundColor: null });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', format: 'a4' });
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
      pdf.save(`${registration.user.name.replace(/\s+/g, '_')}_Certificate.pdf`);
      showToast('Certificate downloaded!', 'success');
    } catch {
      showToast('Failed to generate PDF', 'error');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="container page-wrapper">
        <div className="loading-center">
          <div className="spinner"></div>
          <p>Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (!registration || !registration.checkedIn) {
    return (
      <div className="container page-wrapper animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <h2 className="empty-state-title">Certificate Not Available</h2>
          <p className="empty-state-desc">
            You must check-in to the event at the venue to receive your certificate of attendance.
          </p>
          <Link href="/events" className="btn-primary">Browse Events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-wrapper animate-fade-in" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
      <h1 className="page-title gradient-text" style={{ marginBottom: '0.5rem' }}>Certificate of Attendance</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2.5rem' }}>
        Congratulations on completing the event! 🎉
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem', overflow: 'auto' }}>
        <div
          ref={certRef}
          className="certificate-wrapper"
          style={{
            width: '800px',
            height: '566px',
            background: 'linear-gradient(145deg, #1e293b, #0f172a)',
            border: '6px solid #6366f1',
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Georgia, serif',
            color: 'white',
            boxShadow: '0 0 60px rgba(99, 102, 241, 0.2), inset 0 0 100px rgba(168, 85, 247, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
          }}
        >
          {/* Decorative elements */}
          <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '200px', height: '200px', background: '#a855f7', filter: 'blur(120px)', opacity: 0.3 }}></div>
          <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '200px', height: '200px', background: '#6366f1', filter: 'blur(120px)', opacity: 0.3 }}></div>

          {/* Corner decorations */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', width: '60px', height: '60px', borderTop: '3px solid #fcd34d', borderLeft: '3px solid #fcd34d', opacity: 0.6 }}></div>
          <div style={{ position: 'absolute', top: '20px', right: '20px', width: '60px', height: '60px', borderTop: '3px solid #fcd34d', borderRight: '3px solid #fcd34d', opacity: 0.6 }}></div>
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '60px', height: '60px', borderBottom: '3px solid #fcd34d', borderLeft: '3px solid #fcd34d', opacity: 0.6 }}></div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '60px', height: '60px', borderBottom: '3px solid #fcd34d', borderRight: '3px solid #fcd34d', opacity: 0.6 }}></div>

          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.75rem', marginBottom: '0.25rem', color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '6px', fontWeight: 700 }}>
              Certificate
            </h1>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '2.5rem', letterSpacing: '4px', fontWeight: 400, color: '#94a3b8' }}>
              OF ATTENDANCE
            </h3>

            <p style={{ fontSize: '1rem', marginBottom: '0.75rem', fontStyle: 'italic', color: '#cbd5e1' }}>
              This is to certify that
            </p>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.75rem', borderBottom: '2px solid #6366f1', paddingBottom: '0.5rem', display: 'inline-block' }}>
              {registration.user.name}
            </h2>

            <p style={{ fontSize: '1rem', marginBottom: '0.75rem', fontStyle: 'italic', color: '#cbd5e1' }}>
              has successfully attended
            </p>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.75rem', color: '#f1f5f9' }}>
              {registration.event.title}
            </h3>

            <p style={{ fontSize: '0.9375rem', color: '#94a3b8' }}>
              Held on {new Date(registration.event.date).toLocaleDateString(undefined, {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
              })}
            </p>
          </div>

          <div style={{ position: 'absolute', bottom: '2.5rem', right: '3rem', textAlign: 'center', zIndex: 1 }}>
            <div style={{ width: '130px', borderBottom: '1px solid rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}></div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8' }}>Event Organizer</p>
          </div>

          <div style={{ position: 'absolute', bottom: '2.5rem', left: '3rem', zIndex: 1 }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              <span style={{ color: '#6366f1' }}>⚡</span> Eventrix
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={downloadPDF} disabled={downloading} className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
          {downloading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
              Generating PDF...
            </span>
          ) : (
            '📥 Download PDF'
          )}
        </button>
        <Link href="/events" className="btn-secondary" style={{ padding: '0.875rem 2rem' }}>
          Explore More Events
        </Link>
      </div>
    </div>
  );
}
