'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Link from 'next/link';

export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const scannerInstanceRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);
    scannerInstanceRef.current = scanner;

    scanner.render(async (decodedText) => {
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
      } catch {
        setScanResult({ success: false, error: 'Network Error — please check your connection.' });
      } finally {
        setLoading(false);
        setTimeout(() => {
          setScanResult(null);
          scanner.resume();
        }, 4000);
      }
    }, () => {
      // Ignore routine scan errors
    });

    setScannerReady(true);

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="container page-wrapper animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '600px', textAlign: 'center' }}>
      <Link href="/organizer" style={{ color: 'var(--muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        ← Back to Dashboard
      </Link>

      <h1 className="page-title gradient-text" style={{ marginBottom: '0.5rem' }}>QR Check-in Scanner</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
        Point your camera at an attendee&apos;s QR code to check them in
      </p>

      <div className="card" style={{ padding: '2rem' }}>
        <div id="reader" style={{ width: '100%', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}></div>

        <div style={{ minHeight: '100px' }}>
          {loading && (
            <div className="loading-center" style={{ padding: '1rem 0' }}>
              <div className="spinner"></div>
              <p style={{ color: 'var(--primary-hover)', fontWeight: 500 }}>Processing check-in...</p>
            </div>
          )}

          {scanResult && scanResult.success && (
            <div className="success-panel animate-scale-in" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
              <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>{scanResult.message}</h3>
              <p style={{ color: 'var(--muted)' }}>
                <strong>{scanResult.registration.user.name}</strong>
                <br />
                <span style={{ fontSize: '0.8125rem' }}>{scanResult.registration.event.title}</span>
              </p>
              <Link
                href={`/certificates/${scanResult.registration.id}`}
                className="btn-secondary"
                style={{ marginTop: '1rem', fontSize: '0.8125rem' }}
              >
                🎓 View Certificate
              </Link>
            </div>
          )}

          {scanResult && !scanResult.success && (
            <div className="error-panel animate-scale-in">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>❌</div>
              <h3 style={{ marginBottom: '0.5rem' }}>Check-in Failed</h3>
              <p style={{ fontSize: '0.875rem' }}>{scanResult.error}</p>
            </div>
          )}

          {!loading && !scanResult && scannerReady && (
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
              📷 Scanner is active — waiting for QR code...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
