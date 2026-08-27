'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Link from 'next/link';

export default function QRScannerPage() {
  const scannerRef = useRef(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize Scanner only on client side
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
    
    scanner.render(async (decodedText) => {
      // Pause scanning after successful scan
      scanner.pause(true);
      setLoading(true);
      
      try {
        const res = await fetch('/api/events/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ registrationId: decodedText })
        });
        const data = await res.json();
        setScanResult(data);
      } catch (err) {
        setScanResult({ success: false, error: 'Network Error' });
      } finally {
        setLoading(false);
        // Resume after 3 seconds
        setTimeout(() => {
          setScanResult(null);
          scanner.resume();
        }, 3000);
      }
    }, (error) => {
      // Ignore routine errors
    });

    return () => {
      scanner.clear().catch(e => console.error(e));
    };
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '600px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '2rem' }}>QR Check-in Scanner</h1>
      
      <div className="card" style={{ padding: '2rem' }}>
        <div id="reader" style={{ width: '100%', marginBottom: '2rem' }}></div>
        
        <div style={{ minHeight: '80px' }}>
          {loading && <p style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>Processing check-in...</p>}
          
          {scanResult && scanResult.success && (
            <div style={{ color: 'var(--success)', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <h3>✅ {scanResult.message}</h3>
              <p>Attendee: {scanResult.registration.user.name}</p>
            </div>
          )}

          {scanResult && !scanResult.success && (
            <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)' }}>
              <h3>❌ Error</h3>
              <p>{scanResult.error}</p>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <Link href="/organizer" className="btn-secondary">Back to Dashboard</Link>
      </div>
    </div>
  );
}
