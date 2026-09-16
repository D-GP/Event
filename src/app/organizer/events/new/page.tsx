'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/app/components/Toast';

export default function CreateEventPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    date: '',
    location: '',
    keywords: '',
    description: ''
  });

  const generateDescription = async () => {
    if (!form.title) {
      showToast('Please enter an event title first', 'error');
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.title, keywords: form.keywords })
      });
      const data = await res.json();
      if (data.success) {
        setForm({ ...form, description: data.description });
        showToast('AI description generated!', 'success');
      } else {
        showToast('AI generation failed: ' + data.error, 'error');
      }
    } catch {
      showToast('Network error generating description', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.date || !form.location.trim() || !form.description.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Event created successfully!', 'success');
        router.push('/events');
      } else {
        showToast('Error creating event: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-wrapper animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <Link href="/organizer" style={{ color: 'var(--muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        ← Back to Dashboard
      </Link>

      <h1 className="page-title gradient-text" style={{ marginBottom: '0.5rem' }}>Create New Event</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Fill in the details below. Use AI to auto-generate a description!</p>

      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label>Event Title <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input
              type="text"
              className="input-field"
              required
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Tech Innovators Conference 2026"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px' }}>
              <label>Date & Time <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                type="datetime-local"
                className="input-field"
                required
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div style={{ flex: '1 1 280px' }}>
              <label>Location <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                type="text"
                className="input-field"
                required
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="e.g., Moscone Center, SF"
              />
            </div>
          </div>

          {/* AI Description Generator */}
          <div className="ai-section">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.0625rem', position: 'relative', zIndex: 1 }}>
              ✨ AI Description Generator
              <span className="badge badge-primary" style={{ fontSize: '0.625rem' }}>Gemini</span>
            </h3>
            <div style={{ marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
              <label>Keywords / Themes (Optional)</label>
              <input
                type="text"
                className="input-field"
                value={form.keywords}
                onChange={e => setForm({ ...form, keywords: e.target.value })}
                placeholder="e.g., AI, future, networking, food provided"
              />
            </div>
            <button
              type="button"
              onClick={generateDescription}
              disabled={aiLoading}
              className="btn-secondary"
              style={{ width: '100%', position: 'relative', zIndex: 1 }}
            >
              {aiLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                  Generating with AI...
                </span>
              ) : (
                '✨ Generate Description'
              )}
            </button>
          </div>

          <div>
            <label>Event Description <span style={{ color: 'var(--danger)' }}>*</span></label>
            <textarea
              className="input-field"
              required
              rows={8}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your event or use the AI generator above..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '0.5rem', width: '100%', padding: '1rem', fontSize: '1rem' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
                Publishing...
              </span>
            ) : (
              '🚀 Publish Event'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
