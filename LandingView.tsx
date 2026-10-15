import React from 'react';
import { 
  Camera, 
  Search, 
  Sparkles, 
  Recycle, 
  AlertTriangle, 
  Apple, 
  Cpu, 
  Trash2, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  TrendingUp,
  PlayCircle
} from 'lucide-react';
import { WASTE_CATEGORIES } from './wasteDataset';

interface LandingViewProps {
  onNavigate: (tab: string) => void;
  onOpenDemo: () => void;
  onSelectCategory: (cat: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onOpenDemo,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-8 md:p-14 shadow-xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Founder’s Code 2026 Hackathon • Domain 4: Environment
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-heading">
            Zero Contamination. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
              AI-Powered Waste Segregation.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-emerald-100/90 leading-relaxed font-normal">
            Every day, <strong className="text-white font-semibold">over 80% of recyclable materials</strong> are ruined because one greasy pizza box or misplaced battery contaminates an entire collection truck. SortSmart gives every citizen, student, and campus instant AI vision categorization, scientific disposal reasons, and actionable eco-rewards.
          </p>

          {/* Primary Two Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>Scan Waste Item with AI</span>
            </button>

            <button
              onClick={() => onNavigate('search')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 backdrop-blur-xs transition-all cursor-pointer"
            >
              <Search className="w-5 h-5 text-emerald-300" />
              <span>Search 50+ Common Items</span>
            </button>

            <button
              onClick={onOpenDemo}
              className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-teal-800/60 hover:bg-teal-700/60 text-teal-200 hover:text-white border border-teal-500/30 text-sm font-medium transition cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              <span>5-Min Pitch Demo</span>
            </button>
          </div>

          {/* Environmental Ticker */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-emerald-800/60 text-emerald-200">
            <div>
              <div className="text-2xl font-bold text-white font-heading">50+</div>
              <div className="text-xs text-emerald-300/80">Curated Waste Profiles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-heading">4 Bins</div>
              <div className="text-xs text-emerald-300/80">Scientifically Mapped</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-heading">95%</div>
              <div className="text-xs text-emerald-300/80">Energy Saved on Aluminum</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-heading">0%</div>
              <div className="text-xs text-emerald-300/80">Guesswork Required</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Real Problem & Solution Breakdown */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Why Everyday Recycling Fails
          </div>
          <h2 className="text-3xl font-bold text-slate-900 font-heading">
            The Invisible Crisis of Waste Mixing
          </h2>
          <p className="text-sm text-slate-600">
            Good intentions aren't enough when instructions are ambiguous or hard to find.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-200 transition">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Recycling Batch Ruin
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Greasy food boxes, coffee cup plastic linings, or unrinsed bottles create mold and oil slicks that cause municipal recycling centers to reject entire multi-ton truckloads into landfills.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-200 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Lethal Hazardous Cross-Contamination
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Lithium batteries and fluorescent CFL bulbs tossed into general trash cause violent compactor truck fires and leach neurotoxic mercury into municipal groundwater reserves.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-200 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Apple className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Methane from Trapped Organics
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Food scraps trapped inside tightly packed plastic in landfills decompose anaerobically, generating methane gas—a greenhouse agent 28 times more heat-trapping than CO2.
            </p>
          </div>
        </div>
      </section>

      {/* The 4-Bin Master System Cards */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Standardized Waste Sorting
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-heading">
              The 4-Bin Master Protocol
            </h2>
          </div>
          <button
            onClick={() => onNavigate('why-bin')}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer"
          >
            Deep dive into segregation chemistry <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Green Bin */}
          <div 
            onClick={() => onSelectCategory('wet_organic')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border-2 border-emerald-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Green Bin
                </span>
                <Apple className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Wet / Organic Waste
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Raw kitchen scraps, fruit rinds, vegetable trimmings, coffee grounds, and fallen garden leaves for composting.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-emerald-700 flex items-center justify-between border-t border-emerald-50 pt-3">
              <span>View 10+ Organic items</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Blue Bin */}
          <div 
            onClick={() => onSelectCategory('dry_recyclable')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border-2 border-sky-200 hover:border-sky-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                  Blue Bin
                </span>
                <Recycle className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Dry / Recyclable
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Clean and dry cardboard, PET plastic beverage bottles, aluminum cans, metal food tins, and glass containers.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-sky-700 flex items-center justify-between border-t border-sky-50 pt-3">
              <span>View 12+ Recyclable items</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Red Bin */}
          <div 
            onClick={() => onSelectCategory('hazardous')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border-2 border-rose-200 hover:border-rose-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                  Red / Yellow Bin
                </span>
                <AlertTriangle className="w-5 h-5 text-rose-600 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Hazardous Waste
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Used batteries, CFL mercury tubes, expired blister packs, solvent cans, and aerosol sprays. Must never mix.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-rose-700 flex items-center justify-between border-t border-rose-50 pt-3">
              <span>View 8+ Hazardous items</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Grey Bin */}
          <div 
            onClick={() => onSelectCategory('e_waste')}
            className="group cursor-pointer bg-white rounded-2xl p-5 border-2 border-slate-300 hover:border-slate-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                  Grey Bin
                </span>
                <Cpu className="w-5 h-5 text-slate-700 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Electronic Waste (E-Waste)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Dead phones, charging cables, power banks, computer boards, and cartridges containing precious metals.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-slate-700 flex items-center justify-between border-t border-slate-100 pt-3">
              <span>View 8+ E-Waste items</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Engineered for Real-World Campuses & Towns
          </span>
          <h2 className="text-3xl font-bold font-heading">
            Everything Required for 100% Segregation Compliance
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold text-white">AI Vision Waste Scanner</h3>
            <p className="text-sm text-slate-300">
              Powered by Google Gemini vision capabilities with uncertainty transparency. Users can correct incorrect predictions to refine the campus model.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold text-white">"Why This Bin?" Scientific Logic</h3>
            <p className="text-sm text-slate-300">
              No generic rules. Learn exactly why greasy pizza boxes ruin cellulose pulping or how taping battery terminals prevents thermal runaway fires.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold text-white">Eco-Points & Habit Gamification</h3>
            <p className="text-sm text-slate-300">
              Earn redeemable eco-points for passing segregation quizzes and logging drop-offs. Anti-spam logic prevents repeat point abuse.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="text-lg font-semibold text-white">Campus Bin-Overflow Reporting</h3>
            <p className="text-sm text-slate-300">
              Crowdsourced campus cleanliness. Students flag overflowing or contaminated bins with photo and location, auto-dispatching facility staff.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              5
            </div>
            <h3 className="text-lg font-semibold text-white">Recycling Center & Kabadiwala Map</h3>
            <p className="text-sm text-slate-300">
              Direct connection to authorized e-waste depots, campus MRFs, and informal scrap partners with cash-back rates and accepted materials.
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              6
            </div>
            <h3 className="text-lg font-semibold text-white">Institutional ESG & Admin Portal</h3>
            <p className="text-sm text-slate-300">
              Campus administrators receive monthly landfill diversion metrics, carbon offset audits, and hotspot bottleneck tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Team & Hackathon Credentials Footer Banner */}
      <section className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            SMIT Founder's Code 24-Hour Hackathon Submission
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">
            Team SortSmart • 4-Member Innovators
          </h3>
          <p className="text-sm text-slate-600">
            Targeting Indian campuses, residential societies, and smart municipal wards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin-console')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-xs transition cursor-pointer"
          >
            Access Facility Admin Portal
          </button>
        </div>
      </section>
    </div>
  );
};
