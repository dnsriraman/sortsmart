import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  ThumbsUp, 
  Sparkles, 
  Camera, 
  ShieldCheck,
  AlertTriangle,
  Building
} from 'lucide-react';
import { INITIAL_BIN_REPORTS, WASTE_CATEGORIES } from './wasteDataset';

interface BinReport {
  id: string;
  location: string;
  campusArea: string;
  wasteType: string;
  severity: string;
  status: string;
  description: string;
  reportedBy: string;
  timestamp: string;
  upvotes: number;
  assignedStaff: string;
}

interface CampusReportViewProps {
  userId: string;
  onReportSuccess: (result: any) => void;
}

export const CampusReportView: React.FC<CampusReportViewProps> = ({ userId, onReportSuccess }) => {
  const [reports, setReports] = useState<BinReport[]>(INITIAL_BIN_REPORTS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [campusArea, setCampusArea] = useState('Central Library');
  const [exactLocation, setExactLocation] = useState('');
  const [wasteType, setWasteType] = useState('dry_recyclable');
  const [severity, setSeverity] = useState('Overflowing');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  // Fetch live reports from server on mount
  useEffect(() => {
    fetch('/api/campus-bins')
      .then((res) => res.json())
      .then((data) => {
        if (data.reports) {
          setReports(data.reports);
        }
      })
      .catch((err) => console.log('Error fetching campus bin reports:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exactLocation || !description) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const res = await fetch('/api/campus-bins/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          coordinates,
          location: `${campusArea} - ${exactLocation}`,
          campusArea,
          wasteType,
          severity,
          description,
          reportedBy: reportedBy || 'Campus Eco-Monitor',
        }),
      });

      if (!res.ok) throw new Error('Submission failed');
      const data = await res.json();

      setReports((prev) => [data.report, ...prev]);
      setSubmitSuccess(true);
      onReportSuccess({ ...data.report, totalPoints: data.totalPoints });

      // Reset form
      setExactLocation('');
      setDescription('');
      setCoordinates(null);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Failed to submit report. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  const campusZones = [
    'Central Library',
    'Hostel Block A & Mess',
    'Hostel Block B & C',
    'Academic Block 1 (CS/IT)',
    'Mechanical Engineering Workshops',
    'Student Activity Centre (SAC)',
    'Main Sports Ground & Canteen'
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          Crowdsourced Campus Cleanliness
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          Campus Bin-Full Reporting
        </h1>
        <p className="text-sm text-slate-600">
          Spot an overflowing, contaminated, or damaged bin on campus? Report it to dispatch groundskeeping and earn <strong className="text-emerald-700 font-bold">+20 Eco-Points</strong>.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Left: Reporting Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Lodge a Bin Report
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
              +20 pts Reward
            </span>
          </div>

          {submitSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Report submitted! Facilities management notified and 20 Eco-Points added to your balance.
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Campus Zone */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Campus Zone / Building</label>
              <select
                value={campusArea}
                onChange={(e) => setCampusArea(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 text-slate-800 outline-none cursor-pointer"
              >
                {campusZones.map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>

            {/* Exact Location */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Specific Location Landmark</label>
              <input
                type="text"
                required
                value={exactLocation}
                onChange={(e) => setExactLocation(e.target.value)}
                placeholder="e.g. 2nd Floor Staircase next to Water Cooler"
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 text-slate-800 outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setLocationMessage(null);
                  if (!navigator.geolocation) {
                    setLocationMessage('Location is not available in this browser. The map will use an approximate campus-area pin.');
                    return;
                  }
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
                      setLocationMessage('GPS location attached to this bin report.');
                    },
                    () => setLocationMessage('GPS access was unavailable. The map will use an approximate campus-area pin.'),
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
                  );
                }}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
              >
                {coordinates ? '✓ GPS location attached' : 'Add my GPS location (optional)'}
              </button>
              {locationMessage && <p className="text-[11px] text-slate-500" role="status">{locationMessage}</p>}
            </div>

            {/* Waste Stream Type */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Bin Waste Stream</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWasteType('dry_recyclable')}
                  className={`p-2.5 rounded-xl border font-semibold text-left transition cursor-pointer ${
                    wasteType === 'dry_recyclable'
                      ? 'bg-sky-50 border-sky-500 text-sky-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  🔵 Blue Recyclable
                </button>
                <button
                  type="button"
                  onClick={() => setWasteType('wet_organic')}
                  className={`p-2.5 rounded-xl border font-semibold text-left transition cursor-pointer ${
                    wasteType === 'wet_organic'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  🟢 Green Organic
                </button>
                <button
                  type="button"
                  onClick={() => setWasteType('hazardous')}
                  className={`p-2.5 rounded-xl border font-semibold text-left transition cursor-pointer ${
                    wasteType === 'hazardous'
                      ? 'bg-rose-50 border-rose-500 text-rose-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  🔴 Red Hazardous
                </button>
                <button
                  type="button"
                  onClick={() => setWasteType('e_waste')}
                  className={`p-2.5 rounded-xl border font-semibold text-left transition cursor-pointer ${
                    wasteType === 'e_waste'
                      ? 'bg-slate-100 border-slate-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  ⚪ Grey E-Waste
                </button>
              </div>
            </div>

            {/* Severity Condition */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Observed Condition</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 text-slate-800 outline-none cursor-pointer"
              >
                <option value="Overflowing">Overflowing (Spilling on floor)</option>
                <option value="Full">Full (At capacity)</option>
                <option value="Contaminated / Mixed">Contaminated (Grease/liquid mixed in paper)</option>
                <option value="Damaged / Broken Bin">Damaged (Broken lid / pest infestation)</option>
              </select>
            </div>

            {/* Description Details */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Description of Issue</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current status (e.g. Cardboard boxes piled high after hostel unpacking, needs immediate pickup)..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 text-slate-800 outline-none"
              />
            </div>

            {/* Reporter Name (Optional) */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Your Name / Student ID (Optional)</label>
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                placeholder="e.g. Tenzing Norbu (Hostel 3) or Anonymous"
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 text-slate-800 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting Report...' : 'Submit Campus Bin Ticket'}</span>
            </button>
          </form>
        </div>

        {/* Right: Live Community Incident Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-bold text-slate-800">Live Campus Cleanliness Feed</span>
            <span>{reports.length} active tickets</span>
          </div>

          <div className="space-y-3">
            {reports.map((report) => {
              const statusColor = 
                report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                report.status === 'In Progress' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                'bg-rose-100 text-rose-800 border-rose-300';

              return (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3 hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 font-heading">
                          {report.location}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Area: {report.campusArea} • Reported by {report.reportedBy}
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                      {report.status}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    "{report.description}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-700">Assigned: {report.assignedStaff}</span>
                    </div>

                    <button
                      onClick={() => handleUpvote(report.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition text-xs font-medium cursor-pointer"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Verify / Upvote ({report.upvotes})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
