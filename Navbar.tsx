import React, { useState } from 'react';
import { 
  Leaf, 
  Camera, 
  Search, 
  HelpCircle, 
  BarChart3, 
  Award, 
  MapPin, 
  AlertCircle, 
  PlayCircle,
  Sparkles,
  ShieldCheck,
  User,
  LogOut,
  Building2,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from './AuthView';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  ecoPoints: number;
  onOpenDemo: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: (role?: 'customer' | 'admin') => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  ecoPoints,
  onOpenDemo,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Customer navigation items
  const customerNavItems = [
    { id: 'landing', label: 'Home', icon: Leaf },
    { id: 'scanner', label: 'AI Scanner', icon: Camera, highlight: true },
    { id: 'search', label: 'Waste Directory', icon: Search },
    { id: 'why-bin', label: 'Why This Bin?', icon: HelpCircle },
    { id: 'dashboard', label: 'Impact Dashboard', icon: BarChart3 },
    { id: 'quiz', label: 'Quizzes & Points', icon: Award },
    { id: 'centres', label: 'Recycling Hubs', icon: MapPin },
    { id: 'campus-report', label: 'Report a Bin', icon: AlertCircle },
  ];

  // Admin navigation items (Has Admin Command Console PLUS full access to all tools)
  const adminNavItems = [
    { id: 'admin-console', label: 'Admin Console', icon: Building2, highlight: true },
    { id: 'scanner', label: 'AI Scanner', icon: Camera },
    { id: 'search', label: 'Waste Directory', icon: Search },
    { id: 'why-bin', label: 'Why This Bin?', icon: HelpCircle },
    { id: 'dashboard', label: 'Campus Analytics', icon: BarChart3 },
    { id: 'quiz', label: 'Quizzes', icon: Award },
    { id: 'centres', label: 'Recycling Hubs', icon: MapPin },
    { id: 'campus-report', label: 'Incident Feed', icon: AlertCircle },
  ];

  const activeNavItems = currentUser?.role === 'admin' ? adminNavItems : customerNavItems;

  // Tier calculation
  const getTier = (points: number) => {
    if (points >= 500) return { name: 'Eco Champion', color: 'bg-emerald-600 text-white' };
    if (points >= 250) return { name: 'Green Warrior', color: 'bg-teal-600 text-white' };
    if (points >= 100) return { name: 'Active Sprout', color: 'bg-emerald-100 text-emerald-800' };
    return { name: 'Eco Seedling', color: 'bg-slate-100 text-slate-700' };
  };

  const tier = getTier(ecoPoints);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div 
            onClick={() => setCurrentTab(currentUser?.role === 'admin' ? 'admin-console' : 'landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">
                  Sort<span className="text-emerald-600">Smart</span>
                </span>
                {currentUser?.role === 'admin' ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-md">
                    ADMIN
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    AI
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
                {currentUser?.role === 'admin' ? 'Campus Facility Operations Console' : 'Zero-Contamination Waste Assistant'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  } ${item.highlight && !isActive ? 'ring-1 ring-emerald-300/60' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Points Badge & Auth Account */}
          <div className="flex items-center gap-3">
            {/* Eco Points Badge (for Customer) */}
            {currentUser?.role !== 'admin' && (
              <div 
                onClick={() => setCurrentTab('quiz')}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-full cursor-pointer transition shadow-2xs group"
                title="Click to view Eco-Points and Quizzes"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  🌿
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                    <span>{ecoPoints}</span>
                    <span className="text-[10px] text-emerald-600 font-normal">pts</span>
                  </div>
                  <div className="text-[9px] text-emerald-700 font-medium">
                    {tier.name}
                  </div>
                </div>
              </div>
            )}

            {/* User Account / Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition shadow-2xs ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white ${
                    currentUser.role === 'admin' ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}>
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="font-bold truncate max-w-[120px]">{currentUser.name}</div>
                    <div className="text-[9px] text-slate-500 capitalize">{currentUser.role}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-fadeIn"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-slate-500 text-[11px] truncate">{currentUser.email}</div>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        currentUser.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {currentUser.role === 'admin' ? 'Campus Admin' : 'Customer / Student'}
                      </span>
                    </div>

                    {currentUser.role === 'admin' ? (
                      <button
                        onClick={() => setCurrentTab('landing')}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                        <span>View Customer App</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenAuth('admin')}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Switch to Admin Portal</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={onSignOut}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('customer')}
                className="py-1.5 px-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Role</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-100 bg-white/90 overflow-x-auto px-2 py-1.5 flex items-center gap-1 no-scrollbar">
        {activeNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
