import React from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  HelpCircle, 
  PlusCircle, 
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';
import { WasteItem, WASTE_CATEGORIES } from './wasteDataset';

interface ItemDetailModalProps {
  item: WasteItem | null;
  onClose: () => void;
  onLogItem: (itemName: string, category: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onLogItem,
}) => {
  if (!item) return null;

  const catMeta = WASTE_CATEGORIES[item.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Category & Close */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-2xs"
                style={{ backgroundColor: item.binColor }}
              >
                {catMeta?.binName || item.categoryLabel}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {item.categoryLabel}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              {item.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Attributes Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Decomposition</span>
            <span className="font-semibold text-slate-800">{item.decompositionTime}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Recyclable</span>
            <span className="font-semibold text-slate-800">
              {item.canBeRecycled ? 'Yes, Industrially' : item.category === 'wet_organic' ? 'Compostable' : 'Special Handling'}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Carbon Impact</span>
            <span className="font-semibold text-emerald-700">{item.carbonImpact}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed">
          {item.description}
        </p>

        {/* "Why This Bin?" Scientific Breakdown */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            Why This Bin? (Scientific Justification)
          </h3>
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {item.whyThisBin}
          </div>
        </div>

        {/* Preparation Steps */}
        {item.preparationSteps && item.preparationSteps.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              How to Prepare for Disposal
            </h3>
            <ul className="space-y-2">
              {item.preparationSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reuse & Upcycling Ideas */}
        {item.reuseIdeas && item.reuseIdeas.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              Domestic & Campus Upcycling Ideas
            </h3>
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-100 text-teal-950 text-xs sm:text-sm space-y-1.5">
              {item.reuseIdeas.map((idea, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>{idea}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safety Warnings */}
        {item.safetyPrecautions && item.safetyPrecautions.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Safety Precautions
            </h3>
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm space-y-1">
              {item.safetyPrecautions.map((warn, idx) => (
                <p key={idx}>⚠️ {warn}</p>
              ))}
            </div>
          </div>
        )}

        {/* Local Rules Confirmation Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-slate-800">Local Municipality Notice:</strong> {item.localDisclaimer}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onLogItem(item.name, item.category);
              onClose();
            }}
            className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Disposal Action (+10 pts)</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
