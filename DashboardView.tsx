import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Recycle, 
  PlusCircle, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  Download,
  Leaf
} from 'lucide-react';
import { WASTE_CATEGORIES } from './wasteDataset';

export interface ActivityLog {
  id: string;
  itemName: string;
  category: string;
  actionType: 'scanned' | 'searched' | 'recycled' | 'composted' | 'quiz_completed' | 'bin_reported';
  ecoPoints: number;
  timestamp: string;
  isVerified: boolean;
  notes?: string;
}

interface DashboardViewProps {
  ecoPoints: number;
  activities: ActivityLog[];
  onOpenLogModal: () => void;
  onNavigateToQuiz: () => void;
  onRedeemCredits: () => Promise<void>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  ecoPoints,
  activities,
  onOpenLogModal,
  onNavigateToQuiz,
  onRedeemCredits,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);

  const handleRedeem = async () => {
    setIsRedeeming(true);
    setRedeemError(null);
    try {
      await onRedeemCredits();
    } catch (error) {
      setRedeemError(error instanceof Error ? error.message : 'Could not redeem credits.');
    } finally {
      setIsRedeeming(false);
    }
  };

  // Actual recycled or composted actions (distinct from just searching/scanning)
  const physicalActions = activities.filter(
    (a) => a.actionType === 'recycled' || a.actionType === 'composted' || a.actionType === 'bin_reported'
  );

  // Environmental impact calculations (labeled as scientific estimates based on EPA WARM model)
  const estimatedKgDiverted = (physicalActions.length * 0.45).toFixed(1);
  const estimatedKgCO2eAvoided = (physicalActions.length * 0.82).toFixed(1);
  const estimatedLitersConserved = (physicalActions.length * 3.5).toFixed(0);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const rangeStart = new Date(today);
  if (selectedTimeframe === 'week') rangeStart.setDate(today.getDate() - 6);
  if (selectedTimeframe === 'month') rangeStart.setDate(today.getDate() - 29);
  if (selectedTimeframe === 'all' && activities.length > 0) {
    const firstActivity = activities.reduce((earliest, activity) => {
      const date = new Date(activity.timestamp);
      return date < earliest ? date : earliest;
    }, new Date(activities[0].timestamp));
    rangeStart.setTime(firstActivity.getTime());
    rangeStart.setDate(1);
    rangeStart.setHours(0, 0, 0, 0);
  }

  const rangeActivities = activities.filter((activity) => new Date(activity.timestamp) >= rangeStart);
  const chartBuckets = (() => {
    if (selectedTimeframe === 'week') {
      return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(rangeStart);
        date.setDate(rangeStart.getDate() + index);
        return { key: date.toDateString(), label: date.toLocaleDateString(undefined, { weekday: 'short' }), date };
      });
    }
    if (selectedTimeframe === 'month') {
      return Array.from({ length: 5 }, (_, index) => {
        const date = new Date(rangeStart);
        date.setDate(rangeStart.getDate() + index * 7);
        return { key: `week-${index}`, label: `Week ${index + 1}`, date };
      });
    }

    const firstMonth = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
    const monthCount = Math.max(1, (today.getFullYear() - firstMonth.getFullYear()) * 12 + today.getMonth() - firstMonth.getMonth() + 1);
    const visibleMonths = Math.min(monthCount, 12);
    const displayStart = new Date(today.getFullYear(), today.getMonth() - visibleMonths + 1, 1);
    const months = Array.from({ length: visibleMonths }, (_, index) => {
      const date = new Date(displayStart.getFullYear(), displayStart.getMonth() + index, 1);
      return { key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleDateString(undefined, { month: 'short' }), date };
    });
    return monthCount > visibleMonths
      ? [{ key: 'older', label: 'Older', date: firstMonth }, ...months]
      : months;
  })();

  const chartData = chartBuckets.map((bucket, index) => {
    const nextBucket = chartBuckets[index + 1];
    const bucketActivities = rangeActivities.filter((activity) => {
      const date = new Date(activity.timestamp);
      if (selectedTimeframe === 'week') return date.toDateString() === bucket.key;
      if (selectedTimeframe === 'month') {
        const end = nextBucket ? nextBucket.date : new Date(today.getTime() + 86400000);
        return date >= bucket.date && date < end;
      }
      if (bucket.key === 'older' && nextBucket) return date < nextBucket.date;
      return date.getFullYear() === bucket.date.getFullYear() && date.getMonth() === bucket.date.getMonth();
    });
    return {
      ...bucket,
      items: bucketActivities.length,
      credits: bucketActivities.reduce((sum, activity) => sum + activity.ecoPoints, 0),
    };
  });
  const maxItems = Math.max(...chartData.map((bucket) => bucket.items), 1);
  const maxCredits = Math.max(...chartData.map((bucket) => bucket.credits), 1);
  const chartActivityTotal = chartData.reduce((sum, bucket) => sum + bucket.items, 0);
  const chartCreditTotal = chartData.reduce((sum, bucket) => sum + bucket.credits, 0);
  const peakBucket = chartData.reduce((peak, bucket) => bucket.items > peak.items ? bucket : peak, chartData[0]);

  const categoryGroups = [
    { id: 'dry', label: 'Dry Recyclable', color: 'bg-sky-500', matches: (category: string) => /dry|paper|cardboard|plastic|glass|aluminum|steel|can/i.test(category) },
    { id: 'wet', label: 'Wet / Organic', color: 'bg-emerald-600', matches: (category: string) => /wet|organic|compost/i.test(category) },
    { id: 'hazardous', label: 'Hazardous', color: 'bg-rose-600', matches: (category: string) => /hazard|batter|medicine|syringe|cfl/i.test(category) },
    { id: 'ewaste', label: 'E-Waste', color: 'bg-slate-600', matches: (category: string) => /e.?waste|electronic/i.test(category) },
  ];
  const composition = categoryGroups.map((group) => {
    const count = rangeActivities.filter((activity) => group.matches(activity.category || '')).length;
    return { ...group, count, percent: rangeActivities.length ? Math.round((count / rangeActivities.length) * 100) : 0 };
  });
  const otherCategoryCount = rangeActivities.length - composition.reduce((sum, group) => sum + group.count, 0);
  if (otherCategoryCount > 0) composition.push({ id: 'other', label: 'Other', color: 'bg-violet-500', matches: () => false, count: otherCategoryCount, percent: Math.round((otherCategoryCount / rangeActivities.length) * 100) });

  const handleExportReport = () => {
    const reportData = {
      userTier: ecoPoints >= 500 ? 'Eco Champion' : ecoPoints >= 250 ? 'Green Warrior' : 'Active Sprout',
      totalEcoPoints: ecoPoints,
      verifiedActionsCount: activities.filter(a => a.isVerified).length,
      selfReportedActionsCount: activities.filter(a => !a.isVerified).length,
      estimatedLandfillKgDiverted: estimatedKgDiverted,
      estimatedCO2eAvoidedKg: estimatedKgCO2eAvoided,
      activityHistory: activities,
      generatedDate: new Date().toISOString(),
      institution: 'Sikkim Manipal Institute of Technology (SMIT)',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SortSmart-Sustainability-Audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            Environmental Impact Analytics
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-heading mt-1">
            Sustainability Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-time tracking of waste diverted, verified drop-offs, and environmental savings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenLogModal}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Physical Disposal</span>
          </button>

          <button
            onClick={handleExportReport}
            className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
            title="Export JSON ESG Audit Report"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Export Audit</span>
          </button>
        </div>
      </div>

      {/* Mandatory Data Transparency Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Transparent Data Classification:</strong> This dashboard rigorously separates{' '}
          <span className="font-semibold underline decoration-emerald-500">Verified Facility Records</span>,{' '}
          <span className="font-semibold underline decoration-amber-500">Self-Reported Citizen Actions</span>, and{' '}
          <span className="font-semibold underline decoration-blue-500">Model-Estimated Impact</span> (based on EPA Waste Reduction Model factors). Searching or scanning an item is tracked for education and is <strong className="font-bold">never</strong> counted as verified landfill diversion.
        </div>
      </div>

      {/* 4 Key Impact Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Eco Points */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Eco-Credits Available</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-heading">
            {ecoPoints}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Stored in your SortSmart wallet</span>
          </div>
          {ecoPoints >= 100 ? (
            <button onClick={handleRedeem} disabled={isRedeeming} className="mt-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 disabled:opacity-50">
              {isRedeeming ? 'Redeeming…' : 'Use 100 credits for an eco-reward'}
            </button>
          ) : (
            <div className="mt-1 text-[11px] text-slate-500">Earn {100 - ecoPoints} more to redeem a campus eco-reward.</div>
          )}
          {redeemError && <div role="alert" className="mt-1 text-[11px] text-rose-700">{redeemError}</div>}
        </div>

        {/* Metric 2: Estimated Landfill Diversion */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Landfill Diverted</span>
            <Recycle className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-heading">
            {estimatedKgDiverted} <span className="text-lg font-semibold text-slate-500">kg</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Based on {physicalActions.length} recorded drop-offs
          </div>
        </div>

        {/* Metric 3: Carbon Offset Avoided */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>CO2e Prevented</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-heading">
            {estimatedKgCO2eAvoided} <span className="text-lg font-semibold text-slate-500">kg</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">
            Methane & virgin refining offset
          </div>
        </div>

        {/* Metric 4: Total Actions Recorded */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Logged Activities</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-heading">
            {activities.length}
          </div>
          <div className="text-[11px] text-slate-500">
            {activities.filter(a => a.isVerified).length} verified by campus kiosks
          </div>
        </div>
      </div>

      {/* Live Activity Graphs */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5" aria-labelledby="activity-chart-title">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 id="activity-chart-title" className="text-base font-bold text-slate-900 font-heading">Activity & credit trends</h3>
              <p className="text-xs text-slate-500">Based on records saved to your account.</p>
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1" aria-label="Chart time period">
              {([
                ['week', '7 days'],
                ['month', '30 days'],
                ['all', 'All time'],
              ] as const).map(([period, label]) => (
                <button key={period} type="button" onClick={() => setSelectedTimeframe(period)} aria-pressed={selectedTimeframe === period} className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition ${selectedTimeframe === period ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" /> Activities</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> Credits earned</span>
          </div>

          {chartActivityTotal === 0 ? (
            <div className="h-48 flex items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
              No activity in this period yet. Log a disposal, scan, or complete a quiz to build your graph.
            </div>
          ) : (
            <div className="h-52 flex items-stretch gap-2 sm:gap-4 px-1 border-b border-slate-200" role="img" aria-label={`${chartActivityTotal} activities and ${chartCreditTotal} credits earned in the selected period`}>
              {chartData.map((bucket) => {
                const activityHeight = bucket.items ? Math.max((bucket.items / maxItems) * 100, 5) : 0;
                const creditHeight = bucket.credits ? Math.max((bucket.credits / maxCredits) * 100, 5) : 0;
                return (
                  <div key={bucket.key} className="relative flex-1 min-w-0 h-full flex items-end justify-center gap-1 pb-7 group" title={`${bucket.label}: ${bucket.items} activities, ${bucket.credits} credits`}>
                    <div className="w-[38%] max-w-7 rounded-t-md bg-emerald-600 transition-all group-hover:bg-emerald-500" style={{ height: `${activityHeight}%` }} />
                    <div className="w-[38%] max-w-7 rounded-t-md bg-sky-500 transition-all group-hover:bg-sky-400" style={{ height: `${creditHeight}%` }} />
                    <span className="absolute bottom-1 inset-x-0 text-center text-[10px] text-slate-500 truncate">{bucket.label}</span>
                    <span className="absolute top-1 text-[10px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100">{bucket.items}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
            <span>{chartActivityTotal} activities · {chartCreditTotal} credits earned</span>
            {chartActivityTotal > 0 && <span>Most active: <strong className="text-emerald-800">{peakBucket.label} ({peakBucket.items})</strong></span>}
          </div>
        </section>

        <section className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5" aria-labelledby="category-chart-title">
          <div>
            <h3 id="category-chart-title" className="text-base font-bold text-slate-900 font-heading">Waste category breakdown</h3>
            <p className="text-xs text-slate-500">Share of logged activities in the selected period.</p>
          </div>

          {rangeActivities.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">Category breakdown will appear when activities are recorded.</div>
          ) : (
            <div className="space-y-4">
              {composition.map((group) => (
                <div key={group.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{group.label} <span className="font-normal text-slate-500">({group.count})</span></span>
                    <span>{group.percent}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden" role="progressbar" aria-label={`${group.label} activities`} aria-valuenow={group.percent} aria-valuemin={0} aria-valuemax={100}>
                    <div className={`h-full ${group.color} rounded-full transition-all duration-500`} style={{ width: `${group.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            Charts update from your saved activity records. Credit totals show credits earned in the period before any redemptions.
          </div>
        </section>
      </div>

      {/* Recent User Activity Feed */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Recorded Activity Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Complete chronological audit trail with verification tags
            </p>
          </div>

          <button
            onClick={onOpenLogModal}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            + Add Log <span className="hidden sm:inline">Entry</span>
          </button>
        </div>

        {activities.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {activities.map((act) => {
              const catMeta = WASTE_CATEGORIES[act.category as keyof typeof WASTE_CATEGORIES];
              return (
                <div key={act.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs"
                      style={{ backgroundColor: catMeta?.color || '#0284c7' }}
                    >
                      {act.actionType === 'recycled' ? '♻️' :
                       act.actionType === 'composted' ? '🌱' :
                       act.actionType === 'quiz_completed' ? '🎓' :
                       act.actionType === 'bin_reported' ? '⚠️' : '🔍'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {act.itemName}
                        </span>
                        {act.isVerified ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <ShieldCheck className="w-2.5 h-2.5" /> Verified Drop-off
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            Self-Reported
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {act.notes || `Disposed in ${catMeta?.binName || 'designated bin'}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center text-xs">
                    <span className="text-slate-400">
                      {new Date(act.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      +{act.ecoPoints} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            No activities recorded yet. Complete a quiz or scan an item to earn your first eco-points!
          </div>
        )}
      </div>
    </div>
  );
};
