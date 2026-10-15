import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Clock, 
  X
} from 'lucide-react';
import { WASTE_DATASET, WASTE_CATEGORIES, WasteItem } from './wasteDataset';

interface SearchViewProps {
  initialSearchQuery?: string;
  onSelectItem: (item: WasteItem) => void;
  onSelectCategoryFilter?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({
  initialSearchQuery = '',
  onSelectItem,
  onSelectCategoryFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    onSelectCategoryFilter || 'all'
  );

  const filterTabs = [
    { id: 'all', label: 'All Items' },
    { id: 'wet_organic', label: 'Wet / Organic' },
    { id: 'dry_recyclable', label: 'Dry / Recyclable' },
    { id: 'hazardous', label: 'Hazardous' },
    { id: 'e_waste', label: 'E-Waste' },
    { id: 'sanitary_residual', label: 'Sanitary / Residual' },
  ];

  const popularKeywords = [
    'Banana Peel',
    'Used Battery',
    'Pizza Box',
    'Plastic Bottle',
    'CFL Bulb',
    'Smartphone',
    'Cardboard',
    'Coffee Grounds',
    'Medicine'
  ];

  // Search logic with alias and substring match
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return WASTE_DATASET.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      if (!q) return true;

      const nameMatch = item.name.toLowerCase().includes(q);
      const aliasMatch = item.aliases.some((a) => a.toLowerCase().includes(q));
      const descMatch = item.description.toLowerCase().includes(q);
      const categoryMatch = item.categoryLabel.toLowerCase().includes(q);
      const whyMatch = item.whyThisBin.toLowerCase().includes(q);

      return nameMatch || aliasMatch || descMatch || categoryMatch || whyMatch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Search className="w-3.5 h-3.5 text-emerald-600" />
          Curated Waste Knowledge Base
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          Smart Waste Search
        </h1>
        <p className="text-sm text-slate-600">
          Find authoritative disposal protocols, decomposition timelines, and segregation safety for over 50 everyday household and campus items.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search waste item (e.g. banana peel, battery, pizza box, charger)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-slate-300 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/20 shadow-xs text-sm sm:text-base outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Popular Search Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Quick suggestions:</span>
          {popularKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setSearchQuery(kw)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 transition cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
        {filterTabs.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 max-w-6xl mx-auto px-1">
        <span>Showing <strong>{filteredItems.length}</strong> items</span>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-emerald-700 hover:underline font-medium cursor-pointer"
          >
            Clear category filter
          </button>
        )}
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {filteredItems.map((item) => {
            const catMeta = WASTE_CATEGORIES[item.category];
            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-3">
                  {/* Category Pill & Recyclable Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-2xs"
                      style={{ backgroundColor: item.binColor }}
                    >
                      {catMeta?.binName || item.categoryLabel}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.decompositionTime.split('(')[0].trim()}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors font-heading">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Scientific highlight snippet */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Why this bin?</span>
                    </div>
                    <p className="line-clamp-2 text-[11px] text-slate-600">
                      {item.whyThisBin}
                    </p>
                  </div>
                </div>

                {/* Footer details & Action */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {item.canBeRecycled ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Recyclable
                      </span>
                    ) : item.category === 'wet_organic' ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        🌱 Compostable
                      </span>
                    ) : (
                      <span className="text-rose-700 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Special Handling
                      </span>
                    )}
                  </div>

                  <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    View Instructions <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Search State */
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 max-w-xl mx-auto p-8 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No waste items matched "{searchQuery}"
          </h3>
          <p className="text-xs text-slate-500">
            Try searching for broader terms like "plastic", "battery", "peel", or clear your filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
