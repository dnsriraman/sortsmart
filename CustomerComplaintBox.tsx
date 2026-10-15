import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Clock3, MessageSquareWarning, Send } from 'lucide-react';

interface Complaint {
  id: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  createdAt: string;
}

interface CustomerComplaintBoxProps {
  userId: string;
  name: string;
  email: string;
}

export const CustomerComplaintBox: React.FC<CustomerComplaintBoxProps> = ({ userId, name, email }) => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('App issue');
  const [message, setMessage] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const refreshComplaints = useCallback(async () => {
    try {
      const response = await fetch(`/api/complaints?userId=${encodeURIComponent(userId)}`);
      if (!response.ok) throw new Error('Could not load complaints.');
      const data = await response.json();
      setComplaints(data.complaints || []);
    } catch (loadError) {
      console.error('Complaint history fetch error:', loadError);
    }
  }, [userId]);

  useEffect(() => {
    refreshComplaints();
    const interval = window.setInterval(refreshComplaints, 8000);
    return () => window.clearInterval(interval);
  }, [refreshComplaints]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSubmitted(false);
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name, email, subject, category, message }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Complaint could not be submitted.');
      setComplaints((current) => [data.complaint, ...current]);
      setSubject('');
      setMessage('');
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Complaint could not be submitted.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-8 mb-14 grid lg:grid-cols-2 gap-6 items-start" aria-labelledby="customer-complaints-title">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <MessageSquareWarning className="w-5 h-5" />
          </div>
          <div>
            <h2 id="customer-complaints-title" className="text-lg font-bold text-slate-900 font-heading">Customer help & complaints</h2>
            <p className="text-xs text-slate-500 mt-1">Send feedback or report a SortSmart service issue. Your ticket is saved to the local SQL database.</p>
          </div>
        </div>

        <label className="block text-xs font-semibold text-slate-700">
          Topic
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500">
            <option>App issue</option>
            <option>AI scan feedback</option>
            <option>Recycling hub information</option>
            <option>Credits or rewards</option>
            <option>Other</option>
          </select>
        </label>

        <label className="block text-xs font-semibold text-slate-700">
          Subject
          <input value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={160} required placeholder="Briefly describe the issue" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500" />
        </label>

        <label className="block text-xs font-semibold text-slate-700">
          Details
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} minLength={8} maxLength={4000} required rows={4} placeholder="Tell us what happened and what you need help with" className="mt-1.5 w-full resize-y rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal outline-none focus:border-emerald-500" />
        </label>

        {submitted && <div role="status" className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs text-emerald-800">Complaint submitted. You can follow its status here.</div>}
        {error && <div role="alert" className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-800">{error}</div>}

        <button disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50">
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Sending…' : 'Submit complaint'}
        </button>
      </form>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Your tickets</h3>
            <p className="text-xs text-slate-500 mt-1">Updates automatically while this panel is open.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{complaints.length}</span>
        </div>
        <div className="space-y-3 max-h-[440px] overflow-y-auto">
          {complaints.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">No complaints yet. Submitted tickets will appear here.</div>
          ) : complaints.map((complaint) => (
            <article key={complaint.id} className="rounded-2xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{complaint.subject}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{complaint.category} · {new Date(complaint.createdAt).toLocaleString()}</p>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                  {complaint.status === 'Resolved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock3 className="w-3 h-3" />}
                  {complaint.status}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-wrap">{complaint.message}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
