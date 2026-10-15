import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  PlayCircle, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Award,
  BarChart3,
  Building2,
  TrendingUp,
  Camera,
  Search
} from 'lucide-react';

interface GuidedDemoModalProps {
  onClose: () => void;
  onNavigateTab: (tab: string, searchParam?: string) => void;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({
  onClose,
  onNavigateTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const demoSteps = [
    {
      stepNumber: 1,
      title: '1. Introduce the Waste Segregation Crisis',
      duration: '45 seconds',
      tabTarget: 'landing',
      summary: 'Demonstrate why everyday recycling programs fail.',
      talkingPoints: [
        'Over 80% of collected recyclable material in India and globally ends up dumped in landfills due to cross-contamination.',
        'A single oily pizza box ruins entire bales of clean paper pulping.',
        'Household citizens and college students want to recycle, but disposal instructions are ambiguous or inaccessible when standing in front of bins.'
      ],
      actionLabel: 'Go to Overview & Problem Statement',
    },
    {
      stepNumber: 2,
      title: '2. Search for Everyday Organic Item: Banana Peel',
      duration: '30 seconds',
      tabTarget: 'search',
      searchParam: 'banana peel',
      summary: 'Show instant fuzzy search and category recommendation.',
      talkingPoints: [
        'Open the Waste Directory and search for "Banana Peel".',
        'SortSmart maps it instantly to the Green Bin (Wet / Organic).',
        'Decomposition time: 2-4 weeks into rich nutrient humus.'
      ],
      actionLabel: 'Execute Banana Peel Search',
    },
    {
      stepNumber: 3,
      title: '3. Display "Why This Bin?" Scientific Explanation',
      duration: '35 seconds',
      tabTarget: 'why-bin',
      summary: 'Explain the microbial chemistry of organic composting.',
      talkingPoints: [
        'When organics decompose aerobically in compost pits, they turn into soil humus.',
        'If trapped under compressed plastic in landfills without oxygen, anaerobic bacteria generate methane (CH4)—28x more potent than CO2.',
        'SortSmart explains the science so segregation becomes an intuitive habit.'
      ],
      actionLabel: 'View "Why This Bin?" Case Studies',
    },
    {
      stepNumber: 4,
      title: '4. Search for Hazardous Item: Used Battery',
      duration: '40 seconds',
      tabTarget: 'search',
      searchParam: 'battery',
      summary: 'Demonstrate critical fire prevention and terminal taping instructions.',
      talkingPoints: [
        'Search for "Used Alkaline / Lithium Battery" in the Red / Hazardous stream.',
        'Highlight the compactor truck fire hazard: crushing lithium cells causes 600°C thermal runaway fires.',
        'Show preparation guidance: taping positive (+) and negative (-) terminals with clear tape stops contact friction sparks.'
      ],
      actionLabel: 'Inspect Battery Safety Protocol',
    },
    {
      stepNumber: 5,
      title: '5. Demonstrate AI-Assisted Photo Classification',
      duration: '50 seconds',
      tabTarget: 'scanner',
      summary: 'Showcase the Google Gemini 3.8 Flash Vision engine with uncertainty metrics.',
      talkingPoints: [
        'Open the AI Waste Scanner with live webcam or sample image presets.',
        'Point out transparency: AI confidence percentage and uncertainty levels are clearly labeled (no false certainty).',
        'Demonstrate the "Report Incorrect AI Result" button that lets users override mistakes and feeds back ground-truth data.'
      ],
      actionLabel: 'Open AI Vision Scanner',
    },
    {
      stepNumber: 6,
      title: '6. Complete a Short Educational Quiz',
      duration: '40 seconds',
      tabTarget: 'quiz',
      summary: 'Earn Eco-Points and demonstrate anti-spam gamification.',
      talkingPoints: [
        'Open the "Waste Segregation 101" quiz.',
        'Answer questions on greasy pizza boxes and battery terminals to see real-time explanations.',
        'Upon passing, earn verified Eco-Points with celebratory confetti; anti-spam cooldown prevents duplicate point exploitation.'
      ],
      actionLabel: 'Launch Interactive Quiz',
    },
    {
      stepNumber: 7,
      title: '7. Review the Live Sustainability Dashboard',
      duration: '35 seconds',
      tabTarget: 'dashboard',
      summary: 'Watch eco-points, activity ledger, and landfill diversion update.',
      talkingPoints: [
        'Show the updated Eco-Wallet balance and activity ledger.',
        'Highlight data ethics: clear visual distinction between Measured Facility Logs, Self-Reported Actions, and Estimated Carbon Offsets.',
        'Demonstrate one-click JSON Sustainability Audit export for campus reporting.'
      ],
      actionLabel: 'View Updated Impact Dashboard',
    },
    {
      stepNumber: 8,
      title: '8. Explain Institutional Campus Deployment',
      duration: '35 seconds',
      tabTarget: 'campus-report',
      summary: 'Show crowdsourced bin-overflow alerts and rapid janitorial dispatch.',
      talkingPoints: [
        'How does a college campus run this? QR codes are placed directly on hostel and cafeteria bins.',
        'Students report overflowing or contaminated bins in 10 seconds with photo and location landmark.',
        'Facility managers monitor tickets in real-time on the admin service queue.'
      ],
      actionLabel: 'View Campus Bin Report Feed',
    },
    {
      stepNumber: 9,
      title: '9. Facility Admin Console & Role Separation',
      duration: '45 seconds',
      tabTarget: 'admin-console',
      summary: 'Demonstrate operational role separation between Customer and Facility Administrator.',
      talkingPoints: [
        'Dedicated Facility Admin Console for campus groundskeeping and sanitation managers.',
        'Real-time incident ticket triage: dispatch janitorial crews, assign staff, and track resolution metrics.',
        'One-click official sanitation audit export for NAAC / State Pollution Control Board compliance.'
      ],
      actionLabel: 'Open Admin Facility Console',
    },
  ];

  const currentStep = demoSteps[currentStepIndex];

  const handleExecuteAction = () => {
    onNavigateTab(currentStep.tabTarget, currentStep.searchParam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
              <PlayCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Judge Pitch Mode
                </span>
                <span className="text-xs bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-200">
                  {currentStep.duration}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
                5-Minute Hackathon Demonstration
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="bg-slate-100 px-4 py-2 flex items-center justify-between overflow-x-auto no-scrollbar gap-1 border-b border-slate-200">
          {demoSteps.map((s, idx) => (
            <button
              key={s.stepNumber}
              onClick={() => setCurrentStepIndex(idx)}
              className={`flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                idx === currentStepIndex
                  ? 'bg-emerald-600 text-white shadow-xs scale-105'
                  : idx < currentStepIndex
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-white text-slate-400 border border-slate-200'
              }`}
              title={s.title}
            >
              {s.stepNumber}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Step {currentStep.stepNumber} of 9
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Target Duration: {currentStep.duration}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
            {currentStep.title}
          </h3>

          <p className="text-sm text-slate-600 font-medium">
            {currentStep.summary}
          </p>

          {/* Talking Points Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2.5">
            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
              Presenter Talking Points & Visual Cues
            </span>
            <ul className="space-y-2">
              {currentStep.talkingPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation & Jump Action */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIndex(prev => Math.max(prev - 1, 0))}
              disabled={currentStepIndex === 0}
              className="p-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentStepIndex(prev => Math.min(prev + 1, demoSteps.length - 1))}
              disabled={currentStepIndex === demoSteps.length - 1}
              className="p-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleExecuteAction}
            className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{currentStep.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
