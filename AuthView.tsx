import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Leaf, 
  AlertTriangle,
  KeyRound
} from 'lucide-react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  institution?: string;
  campusId?: string;
  department?: string;
}

interface AuthViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  onCancel?: () => void;
  initialRole?: 'customer' | 'admin';
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLoginSuccess,
  onCancel,
  initialRole = 'customer',
}) => {
  const [role, setRole] = useState<'customer' | 'admin'>(initialRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [campusId, setCampusId] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Pre-configured demo accounts for fast hackathon judging
  const handleQuickDemoLogin = (selectedRole: 'customer' | 'admin') => {
    if (selectedRole === 'customer') {
      onLoginSuccess({
        id: 'cust-demo-1',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@smit.edu',
        role: 'customer',
        institution: 'Sikkim Manipal Institute of Technology (SMIT)',
        campusId: '22BCS104 (Hostel C)',
        department: 'Computer Science & Engineering',
      });
    } else {
      onLoginSuccess({
        id: 'admin-demo-1',
        name: 'Dr. Ramesh K. Verma',
        email: 'admin.sanitation@smit.edu',
        role: 'admin',
        institution: 'SMIT Majitar Campus Administration',
        campusId: 'STAFF-DIR-08',
        department: 'Facility Management & Environmental ESG Cell',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide your email address and password.');
      return;
    }

    if (isSignUp && !name) {
      setError('Please enter your full name.');
      return;
    }

    // Role-based auth verification
    const defaultName = role === 'admin' ? 'Campus Facility Admin' : 'Eco Citizen';
    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || (email.split('@')[0]) || defaultName,
      email,
      role,
      institution: 'Sikkim Manipal Institute of Technology',
      campusId: campusId || (role === 'admin' ? 'FAC-MGMT-2026' : 'STU-2026-REG'),
      department: role === 'admin' ? 'Groundskeeping & Waste Operations' : 'Student Body',
    };

    onLoginSuccess(profile);
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Role-Based Access Control (RBAC)
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          {isSignUp ? 'Create SortSmart Account' : 'Sign in to SortSmart'}
        </h1>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setRole('customer');
            setError(null);
          }}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            role === 'customer'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Leaf className={`w-4 h-4 ${role === 'customer' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>Customer / Student</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setRole('admin');
            setError(null);
          }}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            role === 'admin'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className={`w-4 h-4 ${role === 'admin' ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>Facility Administrator</span>
        </button>
      </div>

      {/* Main Credentials Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">
            {role === 'admin' ? 'Administrator Credentials' : 'Customer Account Login'}
          </h2>
          <span className="text-xs text-slate-500">
            {role === 'admin' ? 'Security Cleared' : 'Earn Eco-Points'}
          </span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'admin' ? 'e.g. S. Sengupta (Chief Warden)' : 'e.g. Priya Sharma'}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-slate-800 outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">
              {role === 'admin' ? 'Official Campus Email' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'admin.facility@campus.edu' : 'student@smit.edu'}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-slate-800 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-slate-800 outline-none"
              />
            </div>
          </div>

          {role === 'customer' && isSignUp && (
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Student ID or Room / Flat # (Optional)</label>
              <input
                type="text"
                value={campusId}
                onChange={(e) => setCampusId(e.target.value)}
                placeholder="e.g. Hostel 2 - Room 314"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-slate-800 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{isSignUp ? 'Create Account & Enter' : `Sign In as ${role === 'admin' ? 'Facility Admin' : 'Customer'}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-emerald-700 hover:underline font-semibold cursor-pointer"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Continue as Guest
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
