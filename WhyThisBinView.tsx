import React, { useState } from 'react';
import { 
  HelpCircle, 
  Flame, 
  Droplet, 
  Sparkles, 
  AlertTriangle, 
  Recycle, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Beaker,
  Scale
} from 'lucide-react';

interface WhyThisBinViewProps {
  onNavigateToSearch: (query: string) => void;
}

export const WhyThisBinView: React.FC<WhyThisBinViewProps> = ({ onNavigateToSearch }) => {
  const [activeTab, setActiveTab] = useState<'grease' | 'batteries' | 'infinite' | 'styrofoam' | 'protocol'>('grease');

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Beaker className="w-3.5 h-3.5 text-emerald-600" />
          The Science of Segregation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
          "Why This Bin?" Deep Dive
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Waste segregation isn't arbitrary bureaucratics. It's grounded in chemical reactions, pulping mechanics, and industrial fire prevention.
        </p>
      </div>

      {/* Case Studies Navigation */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar max-w-4xl mx-auto">
        <button
          onClick={() => setActiveTab('grease')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'grease'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Droplet className="w-4 h-4 text-amber-300" />
          <span>Case 1: The Greasy Pizza Box Trap</span>
        </button>

        <button
          onClick={() => setActiveTab('batteries')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'batteries'
              ? 'bg-rose-700 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-300" />
          <span>Case 2: The Thermal Runaway Threat</span>
        </button>

        <button
          onClick={() => setActiveTab('infinite')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'infinite'
              ? 'bg-sky-700 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Recycle className="w-4 h-4 text-sky-200" />
          <span>Case 3: Infinite Metals vs Plastics</span>
        </button>

        <button
          onClick={() => setActiveTab('styrofoam')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'styrofoam'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4 text-slate-300" />
          <span>Case 4: The Styrofoam Illusion</span>
        </button>
      </div>

      {/* Case 1: Greasy Pizza Box */}
      {activeTab === 'grease' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Paper & Cardboard Chemistry
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-heading">
                Why One Greasy Pizza Box Can Ruin 500 kg of Recyclable Paper
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                The Water-Pulping Process
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Unlike metals or plastics which are melted at scorching temperatures (burning off impurities), paper recycling is a low-temperature <strong className="text-slate-900">water-slurry washing process</strong>.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cardboard and paper are agitated in huge water vats to break the wood fibers apart. Because oil and water never mix, food grease clings to the cellulose fibers like an adhesive shield, preventing them from bonding when rolled into new paper.
              </p>
            </div>

            <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-200 space-y-3">
              <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                The Domino Effect of Contamination
              </h3>
              <p className="text-xs text-amber-900 leading-relaxed">
                When grease-stained pulp makes its way into paper rolls, it creates structural weak spots and oil blemishes. Paper mills will reject the entire 500 kg baled batch, redirecting truckloads of recyclable paper straight to the landfill.
              </p>
              <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs font-semibold text-slate-800">
                💡 <strong className="text-emerald-700">Correct Protocol:</strong> Tear the box! The clean cardboard lid goes in the Blue Recyclable Bin. The greasy bottom goes in Green Composting or Black Residual.
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigateToSearch('pizza box')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              Inspect Pizza Box Profile <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Case 2: Batteries & Thermal Runaway */}
      {activeTab === 'batteries' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-200 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                Electrochemical Fire Physics
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-heading">
                Thermal Runaway: How Discarded Batteries Torpedo Landfills
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Puncture & Hydraulic Crushing
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Municipal garbage compactor trucks use 2,000+ PSI hydraulic rams to compact waste. When a discarded lithium-ion battery or alkaline pack is crushed, its ultra-thin separator membrane ruptures.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                This causes an instantaneous internal short circuit, sparking self-sustaining <strong className="text-rose-700">thermal runaway</strong> temperatures exceeding 600°C (1,100°F) in milliseconds, igniting surrounding paper and plastics.
              </p>
            </div>

            <div className="bg-rose-50/80 rounded-2xl p-5 border border-rose-200 space-y-3">
              <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                Heavy Metal Leachate
              </h3>
              <p className="text-xs text-rose-900 leading-relaxed">
                Batteries also contain toxic electrolytes and heavy metals (cadmium, nickel, lead, lithium salts). In unlined landfills, rainwater dissolves these toxins, producing black chemical leachate that poisons surrounding municipal aquifers.
              </p>
              <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs font-semibold text-slate-800">
                ⚡ <strong className="text-rose-700">Mandatory Rule:</strong> Always tape battery positive and negative terminals with scotch/electrical tape and drop only at dedicated E-Waste / Hazardous hubs.
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onNavigateToSearch('battery')}
              className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              Inspect Battery Safety Profile <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Case 3: Infinite Metals vs Plastics */}
      {activeTab === 'infinite' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sky-200 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700">
                Material Degradation Lifecycles
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-heading">
                The Infinite Recyclers: Aluminum & Glass vs Plastic Downcycling
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                Closed-Loop Infinite Remelting
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong className="text-sky-900">Aluminum and Glass</strong> are elemental structures. When melted down, their atomic lattice reforms without any chemical degradation. A soda can you drink from today can be remelted, refilled, and back on a store shelf in <strong className="text-sky-700">60 days flat</strong>, using 95% less energy than mining raw bauxite.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                The Myth of Infinite Plastic
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Plastics are long polymer chains. Every time plastic is melted and re-pelletized, the polymers shear and shorten. A clear PET water bottle cannot typically become a clear bottle more than 1-2 times; it is <strong className="text-slate-900">downcycled</strong> into polyester carpet or park benches, which cannot be recycled further.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 font-medium">
            💡 <strong>Takeaway:</strong> Prioritize aluminum cans and glass over single-use plastics whenever possible. Always rinse containers so food sugars do not attract insects at the recycling plant.
          </div>
        </div>
      )}

      {/* Case 4: Styrofoam Illusion */}
      {activeTab === 'styrofoam' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-300 shadow-sm max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Economics of Waste Transport
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-heading">
                The Styrofoam / Thermocol Illusion: Why Blue Bins Reject It
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                98% Trapped Air
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Expanded Polystyrene (EPS) foam is 95-98% air by volume. A 20-foot truck filled to the ceiling with Styrofoam cups holds barely 15 kg of actual plastic resin.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                The diesel fuel cost to transport the foam to a specialized recycling facility is higher than the value of the plastic recovered, generating more carbon emissions than it saves.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-slate-600" />
                Microplastic Static Contamination
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                When Styrofoam breaks inside collection trucks, it shatters into billions of electrostatically charged micro-beads. These cling to wet glass and paper, rendering otherwise clean materials unrecyclable.
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                🛑 <strong>Rule:</strong> Never throw Styrofoam into general blue recycling bins unless an institutional foam compactor is explicitly provided on campus.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Universal 5-Step Preparation Protocol */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Standard Operating Procedure
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            The Universal 5-Step Waste Prep Checklist
          </h2>
          <p className="text-sm text-emerald-200 mt-1">
            Follow this 15-second routine before letting go of any item:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-900 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="text-sm font-bold text-white">Empty & Drain</h4>
            <p className="text-xs text-emerald-100/80">
              No liquids or half-eaten yogurt. Wetness ruins paper bales and invites swarms of maggots.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-900 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="text-sm font-bold text-white">Quick Swirl Rinse</h4>
            <p className="text-xs text-emerald-100/80">
              A light splash with dish rinsing water is enough. It doesn't need to be dishwasher sterile.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-900 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="text-sm font-bold text-white">Separate Components</h4>
            <p className="text-xs text-emerald-100/80">
              Remove plastic bubble wrap from cardboard boxes; remove metal lids from glass jars.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-900 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h4 className="text-sm font-bold text-white">Crush to Conserve</h4>
            <p className="text-xs text-emerald-100/80">
              Flatten cardboard boxes and crush plastic bottles to cut transportation truck trips in half.
            </p>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-900 flex items-center justify-center font-bold text-sm">
              5
            </div>
            <h4 className="text-sm font-bold text-white">Tape Battery Terminals</h4>
            <p className="text-xs text-emerald-100/80">
              A simple piece of tape over (+/-) ends prevents devastating compactor fires.
            </p>
          </div>

          <div className="bg-emerald-500/20 rounded-2xl p-4 border border-emerald-400/30 flex flex-col justify-center items-center text-center space-y-2">
            <Sparkles className="w-6 h-6 text-emerald-300" />
            <h4 className="text-xs font-bold text-white">100% Segregation</h4>
            <p className="text-[11px] text-emerald-200">
              You've officially protected a whole batch from the landfill!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
