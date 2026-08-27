'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();
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
    if (!form.title) return alert('Please enter a title first');
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
      } else {
        alert('Failed to generate: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error generating description');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        router.push('/events');
      } else {
        alert('Error creating event');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Create New Event</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Event Title</label>
            <input 
              type="text" 
              className="input-field" 
              required
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              placeholder="e.g., Tech Innovators Conference 2026"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Date & Time</label>
              <input 
                type="datetime-local" 
                className="input-field" 
                required
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
              />
            </div>
            <div style={{ flex: '1 1 300px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Location</label>
              <input 
                type="text" 
                className="input-field" 
                required
                value={form.location}
                onChange={e => setForm({...form, location: e.target.value})}
                placeholder="e.g., Moscone Center, SF (or Zoom Link)"
              />
            </div>
          </div>

          <div style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(59, 130, 246, 0.3)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ✨ AI Description Generator
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Keywords (Optional)</label>
              <input 
                type="text" 
                className="input-field" 
                value={form.keywords}
                onChange={e => setForm({...form, keywords: e.target.value})}
                placeholder="e.g., AI, future, networking, food provided"
              />
            </div>
            <button type="button" onClick={generateDescription} disabled={aiLoading} className="btn-secondary" style={{ width: '100%' }}>
              {aiLoading ? 'Generating Magic...' : 'Generate Description'}
            </button>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Event Description</label>
            <textarea 
              className="input-field" 
              required
              rows={6}
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Describe your event or use the AI generator above..."
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '1rem' }}>
            {loading ? 'Creating...' : 'Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
}
