import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  Filter, 
  Download, 
  TrendingUp, 
  ShieldCheck, 
  MapPin, 
  BarChart3, 
  Send,
  Users,
  Search,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { INITIAL_BIN_REPORTS, WASTE_CATEGORIES } from './wasteDataset';
import { UserProfile } from './AuthView';

interface AdminPortalViewProps {
  currentUser: UserProfile | null;
  onSwitchToCustomer: () => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  currentUser,
  onSwitchToCustomer,
}) => {
  const [reports, setReports] = useState(INITIAL_BIN_REPORTS);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterZone, setFilterZone] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<string>('Ramesh K. (Groundskeeping Unit 1)');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const janitorialStaff = [
    'Ramesh K. (Groundskeeping Unit 1)',
    'Suresh Verma (Hostel Sector Crew)',
    'Anita Roy (Central Cafeteria Custodian)',
    'Bikash Subba (E-Waste & Hazardous Specialist)',
    'Campus Rapid Response Unit'
  ];

  const fetchReports = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/campus-bins');
      const data = await res.json();
      if (data.reports) {
        setReports(data.reports);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string, staffName?: string) => {
    try {
      const assigned = staffName || selectedStaff;
      const res = await fetch(`/api/campus-bins/report/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          assignedStaff: assigned,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReports(prev =>
          prev.map(r => r.id === id ? { ...r, status: newStatus, assignedStaff: assigned } : r)
        );
        setNotification(`Ticket #${id.slice(-4)} updated to "${newStatus}" (Assigned: ${assigned})`);
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportAudit = () => {
    const auditData = {
      auditTitle: 'SMIT Campus Environmental Sanitation & Bin Overflow Audit',
      auditor: currentUser?.name || 'Chief Sustainability Officer',
      date: new Date().toISOString(),
      institution: 'Sikkim Manipal Institute of Technology (Majitar)',
      totalIncidentsLogged: reports.length,
      pendingIncidents: reports.filter(r => r.status === 'Pending').length,
      resolvedIncidents: reports.filter(r => r.status === 'Resolved').length,
      hotspotAnalysis: {
        primaryHotspot: 'Central Library East Entrance',
        overflowRateMultiplier: '2.8x higher on study weeks',
        recommendation: 'Deploy secondary blue recycling bins and schedule 11:30 AM custodial sweep'
      },
      reportsHistory: reports
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SortSmart-Admin-Sanitation-Audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  // Filtered reports
  const filteredReports = reports.filter(r => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterZone !== 'all' && r.campusArea !== filterZone) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchLoc = r.location.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchReporter = r.reportedBy.toLowerCase().includes(q);
      return matchLoc || matchDesc || matchReporter;
    }
    return true;
  });

  const pendingCount = reports.filter(r => r.status === 'Pending').length;
  const inProgressCount = reports.filter(r => r.status === 'In Progress').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900/60 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Campus Facility Command Center • Administrator Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Groundskeeping & Waste Operations
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
              Logged in as <strong className="text-white">{currentUser?.name || 'Facility Administrator'}</strong> ({currentUser?.department || 'Director of Facilities'}). Real-time janitorial dispatch, bin status triage, and regulatory audit trail.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportAudit}
              className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Regulatory Audit</span>
            </button>

            <button
              onClick={onSwitchToCustomer}
              className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Switch to Customer View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Admin KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Pending Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Pending Sweeps</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 font-heading">
            {pendingCount}
          </div>
          <span className="text-[11px] text-slate-400">Needs staff dispatch</span>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>In Cleaning</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 font-heading">
            {inProgressCount}
          </div>
          <span className="text-[11px] text-slate-400">Janitorial units deployed</span>
        </div>

        {/* Resolved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Cleared Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-heading">
            {resolvedCount}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Avg resolution: 21 mins</span>
        </div>

        {/* Hotspot Alert */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Hotspot Identified</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-base font-bold text-slate-900 font-heading truncate">
            Library Cafe (3x)
          </div>
          <span className="text-[11px] text-slate-500">Auto-recommend 2nd Blue Bin</span>
        </div>
      </div>

      {/* Main Operations Queue */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
        {/* Controls Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Live Campus Incident Queue
            </h2>
            <button
              onClick={fetchReports}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Refresh queue"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location or reporter..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs outline-none focus:border-emerald-500 w-44 sm:w-56"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Staff Assignment Pre-selector */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-xl text-xs">
              <span className="text-slate-500 font-medium">Default Assignee:</span>
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
              >
                {janitorialStaff.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tickets Table / Cards */}
        {filteredReports.length > 0 ? (
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const statusBadge = 
                report.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                report.status === 'In Progress' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                'bg-rose-100 text-rose-800 border-rose-300';

              const catMeta = WASTE_CATEGORIES[report.wasteType as keyof typeof WASTE_CATEGORIES];

              return (
                <div
                  key={report.id}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        #{report.id.slice(-5)}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 font-heading">
                        {report.location}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                        {report.campusArea}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge}`}>
                        {report.status}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        {report.severity}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                    "{report.description}"
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                    <div className="flex flex-wrap items-center gap-3">
                      <span>Reported by: <strong className="text-slate-800">{report.reportedBy}</strong></span>
                      <span>•</span>
                      <span>Assigned: <strong className="text-emerald-800">{report.assignedStaff}</strong></span>
                      <span>•</span>
                      <span>Upvotes: <strong>{report.upvotes}</strong></span>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {report.status !== 'In Progress' && report.status !== 'Resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'In Progress')}
                          className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Dispatch Janitorial Unit</span>
                        </button>
                      )}

                      {report.status !== 'Resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'Resolved')}
                          className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Cleared ✓</span>
                        </button>
                      )}

                      {report.status === 'Resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'In Progress')}
                          className="py-1 px-2.5 rounded-lg border border-slate-300 text-slate-500 hover:text-slate-700 text-[11px] cursor-pointer"
                        >
                          Reopen Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            No incident tickets match the selected filters.
          </div>
        )}
      </div>

      {/* Facilities Staff Roster & Campus Zones Reference */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Custodial Staff Duty Roster
            </h3>
            <span className="text-xs text-emerald-700 font-semibold">5 Units On Duty</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {janitorialStaff.map((staff, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {staff.charAt(0)}
                  </div>
                  <span className="font-semibold text-slate-800">{staff}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-heading">
            Campus Receptacle Density Guide
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard recommended ratio: 1 Four-Bin Station per 75 students in academic blocks, and 1 station per 40 students in food service dining halls.
          </p>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Next Recommended Facility Action</span>
            </div>
            <p className="text-emerald-900 leading-relaxed">
              Install 2 additional twin blue dry-recyclable bins at the Central Library East entrance prior to final exams week to avert recurrence of Ticket #rep-1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
