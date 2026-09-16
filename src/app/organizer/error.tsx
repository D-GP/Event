'use client';

import Link from 'next/link';

export default function OrganizerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container page-wrapper animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div className="empty-state">
        <div className="empty-state-icon">⚠️</div>
        <h2 className="empty-state-title">Dashboard Unavailable</h2>
        <p className="empty-state-desc">
          We couldn&apos;t load the organizer dashboard. Please check your database connection and try again.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
