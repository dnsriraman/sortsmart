import React, { useState } from 'react';
import { 
  X, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle 
} from 'lucide-react';
import { WASTE_CATEGORIES } from './wasteDataset';

interface CorrectionModalProps {
  initialItemName: string;
  initialCategory: string;
  onClose: () => void;
  onSubmitCorrection: (correctedCategory: string, correctedName: string, reason: string) => void;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({
  initialItemName,
  initialCategory,
  onClose,
  onSubmitCorrection,
}) => {
  const [correctedName, setCorrectedName] = useState(initialItemName);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [reason, setReason] = useState('');
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitCorrection(selectedCategory, correctedName, reason);
    setIsDone(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  const categories = [
    { id: 'wet_organic', label: 'Wet / Organic (Green Bin)', icon: '🟢' },
    { id: 'dry_recyclable', label: 'Dry / Recyclable (Blue Bin)', icon: '🔵' },
    { id: 'hazardous', label: 'Hazardous (Red / Yellow Bin)', icon: '🔴' },
    { id: 'e_waste', label: 'Electronic Waste (Grey Bin)', icon: '⚪' },
    { id: 'sanitary_residual', label: 'Sanitary / Residual (Black Bin)', icon: '⚫' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Community AI Feedback Loop
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Correct AI Classification
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isDone ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Correction Recorded!
            </h3>
            <p className="text-xs text-slate-600">
              Thank you for helping train the SortSmart campus model. <br />
              <strong className="text-emerald-700">+5 Eco-Points</strong> have been credited to your account!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <p className="text-slate-600">
              Did our vision model misidentify your item? Override the prediction below to update your personal log and improve future recognition accuracy.
            </p>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Actual Item Name</label>
              <input
                type="text"
                required
                value={correctedName}
                onChange={(e) => setCorrectedName(e.target.value)}
                placeholder="e.g. Lithium Polymer Battery or Coated Cardboard"
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 text-slate-800 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Correct Waste Category</label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full p-2.5 rounded-xl border font-semibold text-left transition flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.icon} {cat.label}</span>
                    {selectedCategory === cat.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Why was the initial guess wrong? (Optional)</label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Heavily food-stained or hidden battery inside..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 text-slate-800 outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs cursor-pointer"
              >
                Save Correction (+5 pts)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
