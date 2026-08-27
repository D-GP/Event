'use client';

import { useEffect, useState, use, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Link from 'next/link';

export default function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We will just fetch the event and assume the attendee is verified for simplicity,
    // though in a real app we would have an API for fetching user registration safely.
    // For this demonstration, let's fetch checkin status via an API we'll create.
    fetch(`/api/certificates/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRegistration(data.registration);
        }
        setLoading(false);
      });
  }, [id]);

  const downloadPDF = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', format: 'a4' });
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
    pdf.save(`${registration.user.name.replace(/\s+/g, '_')}_Certificate.pdf`);
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading Certificate...</div>;
  if (!registration || !registration.checkedIn) return (
    <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
      <h2 style={{ marginBottom: '1rem' }}>Certificate Not Available</h2>
      <p style={{ color: 'var(--muted)' }}>You must check-in to the event to receive a certificate.</p>
    </div>
  );

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '1rem' }}>Your Certificate of Attendance</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Congratulations on completing the event!</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        {/* Certificate Preview */}
        <div 
          ref={certRef}
          style={{
            width: '800px',
            height: '600px',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            border: '8px solid var(--primary)',
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'serif',
            color: 'white',
            boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'var(--accent)', filter: 'blur(100px)', opacity: 0.5 }}></div>
          
          <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '4px' }}>Certificate</h1>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '3rem', letterSpacing: '2px', fontWeight: 'normal' }}>OF ATTENDANCE</h3>
          
          <p style={{ fontSize: '1.25rem', marginBottom: '1rem', fontStyle: 'italic', color: '#cbd5e1' }}>This is to certify that</p>
          <h2 style={{ fontSize: '3rem', marginBottom: '2rem', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem', display: 'inline-block' }}>
            {registration.user.name}
          </h2>
          
          <p style={{ fontSize: '1.25rem', marginBottom: '1rem', fontStyle: 'italic', color: '#cbd5e1' }}>has successfully attended</p>
          <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#f8fafc' }}>{registration.event.title}</h3>
          
          <p style={{ fontSize: '1.1rem', color: '#cbd5e1' }}>
            Held on {new Date(registration.event.date).toLocaleDateString()}
          </p>
          
          <div style={{ position: 'absolute', bottom: '3rem', right: '3rem', textAlign: 'center' }}>
            <div style={{ width: '150px', borderBottom: '1px solid white', marginBottom: '0.5rem' }}></div>
            <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Event Organizer</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={downloadPDF} className="btn-primary" style={{ fontSize: '1.125rem' }}>
          📥 Download PDF
        </button>
        <Link href="/events" className="btn-secondary">
          Explore More Events
        </Link>
      </div>
    </div>
  );
}
