import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  CheckCircle2, 
  Recycle, 
  Apple, 
  AlertTriangle, 
  Cpu, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

interface LogDisposalModalProps {
  onClose: () => void;
  onSubmitLog: (itemName: string, category: string, actionType: 'recycled' | 'composted', notes: string, isVerified: boolean) => void;
}

export const LogDisposalModal: React.FC<LogDisposalModalProps> = ({
  onClose,
  onSubmitLog,
}) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('dry_recyclable');
  const [actionType, setActionType] = useState<'recycled' | 'composted'>('recycled');
  const [notes, setNotes] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return;
    onSubmitLog(itemName, category, actionType, notes, isVerified);
    setIsDone(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              Citizen Impact Ledger
            </span>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              Record Physical Disposal
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
              Disposal Recorded!
            </h3>
            <p className="text-xs text-slate-600">
              +{actionType === 'composted' ? '20' : '15'} Eco-Points added to your balance.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Item Disposed</label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. 5x PET Water Bottles or Fruit Peels"
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 text-slate-800 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Category Stream</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value === 'wet_organic') {
                    setActionType('composted');
                  } else {
                    setActionType('recycled');
                  }
                }}
                className="w-full p-3 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 text-slate-800 outline-none cursor-pointer"
              >
                <option value="dry_recyclable">Dry Recyclable (Blue Bin)</option>
                <option value="wet_organic">Wet Organic (Green Bin)</option>
                <option value="hazardous">Hazardous (Red Bin)</option>
                <option value="e_waste">E-Waste (Grey Bin)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Action Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActionType('recycled')}
                  className={`p-2.5 rounded-xl border font-semibold text-center transition cursor-pointer ${
                    actionType === 'recycled'
                      ? 'bg-sky-50 border-sky-500 text-sky-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  ♻️ Recycled (+15 pts)
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('composted')}
                  className={`p-2.5 rounded-xl border font-semibold text-center transition cursor-pointer ${
                    actionType === 'composted'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  🌱 Composted (+20 pts)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Location Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Dropped in Library Blue Bin or Hostel Composter"
                className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 text-slate-800 outline-none"
              />
            </div>

            {/* Verification Checkbox */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
              <input
                type="checkbox"
                id="isVerified"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="isVerified" className="text-[11px] text-slate-600 cursor-pointer">
                <strong className="text-slate-800">Verified Drop-off:</strong> Check if this disposal was carried out at an authorized campus collection desk or partnered recycling depot.
              </label>
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
                Record Entry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
