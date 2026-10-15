import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { LandingView } from './LandingView';
import { ScannerView } from './ScannerView';
import { SearchView } from './SearchView';
import { WhyThisBinView } from './WhyThisBinView';
import { DashboardView, ActivityLog } from './DashboardView';
import { QuizView } from './QuizView';
import { CentresView } from './CentresView';
import { CampusReportView } from './CampusReportView';
import { AdminPortalView } from './AdminPortalView';
import { AuthView, UserProfile } from './AuthView';
import { ItemDetailModal } from './ItemDetailModal';
import { CorrectionModal } from './CorrectionModal';
import { GuidedDemoModal } from './GuidedDemoModal';
import { LogDisposalModal } from './LogDisposalModal';
import { CustomerComplaintBox } from './CustomerComplaintBox';
import { WasteItem } from './wasteDataset';
import { Sparkles, Leaf, ShieldCheck, Heart, Building2, User } from 'lucide-react';

const DEFAULT_CUSTOMER: UserProfile = {
  id: 'cust-demo-1',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@smit.edu',
  role: 'customer',
  institution: 'Sikkim Manipal Institute of Technology (SMIT)',
  campusId: '22BCS104 (Hostel C)',
  department: 'Computer Science & Engineering',
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [ecoPoints, setEcoPoints] = useState<number>(145);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // User Auth & Role State: Login required first to access features
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('sortsmart_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null; // Must log in first
  });

  const [authRoleRequested, setAuthRoleRequested] = useState<'customer' | 'admin'>('customer');

  // Search & Navigation state
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [searchCategoryFilter, setSearchCategoryFilter] = useState<string>('all');

  // Modals state
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<WasteItem | null>(null);
  const [scanResultForCorrection, setScanResultForCorrection] = useState<any | null>(null);
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync user profile to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('sortsmart_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('sortsmart_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Keep activity history and the available credit balance synced with SQLite.
  useEffect(() => {
    if (!currentUser) return;
    const userId = encodeURIComponent(currentUser.id);
    const refresh = () => fetch(`/api/user/activities?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.activities) {
          setActivities(data.activities);
        }
        if (typeof data.totalPoints === 'number') {
          setEcoPoints(data.totalPoints);
        }
      })
      .catch((err) => console.log('Activities fetch error:', err));
    refresh();
    fetch(`/api/user/quizzes?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => setCompletedQuizzes(data.completedQuizIds || []))
      .catch((err) => console.log('Quiz completion fetch error:', err));
    const interval = window.setInterval(refresh, 5000);
    return () => window.clearInterval(interval);
  }, [currentUser?.id]);

  // Handler for logging an activity via server
  const handleLogActivity = async (
    itemName: string,
    category: string,
    actionType: 'scanned' | 'recycled' | 'composted',
    notes?: string,
    isVerified: boolean = false
  ) => {
    try {
      const res = await fetch('/api/user/activities/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          itemName,
          category,
          actionType,
          notes,
          isVerified,
        }),
      });

      if (res.status === 429) {
        showToast('⚠️ Cooldown: Action recently logged. Please wait 30 seconds.');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setActivities((prev) => [data.activity, ...prev]);
        setEcoPoints(data.totalPoints);
        showToast(`🎉 +${data.ecoPointsAdded} Eco-Points added for ${itemName}!`);
      }
    } catch (err) {
      console.error('Error logging activity:', err);
    }
  };

  // Handler for quiz point award
  const handleAwardQuizPoints = async (quizId: string, answers: number[]) => {
    try {
      const res = await fetch('/api/user/quizzes/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.id, quizId, answers }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.activity) setActivities((prev) => [data.activity, ...prev]);
        setEcoPoints(data.totalPoints);
        if (data.awarded) {
          setCompletedQuizzes((prev) => prev.includes(quizId) ? prev : [...prev, quizId]);
          showToast(`🌟 +${data.pointsAwarded} Eco-Credits earned! Quiz completed.`);
        }
        return Boolean(data.awarded);
      }
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Could not save quiz result.');
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw error;
    }
  };

  // Handler for AI correction submission
  const handleSubmitCorrection = async (
    correctedCategory: string,
    correctedName: string,
    reason: string
  ) => {
    try {
      const response = await fetch('/api/user/activities/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.id,
          itemName: `AI Correction: ${correctedName}`,
          category: correctedCategory,
          actionType: 'scanned',
          notes: `User corrected item to ${correctedCategory}. Reason: ${reason || 'Manual visual override'}`,
          isVerified: true,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setActivities((prev) => [data.activity, ...prev]);
        setEcoPoints(data.totalPoints);
        showToast(`✓ AI Correction logged! +${data.ecoPointsAdded} Eco-Credits awarded for training feedback.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to jump to a tab with optional query
  const handleNavigateWithQuery = (tab: string, query?: string) => {
    setCurrentTab(tab);
    if (query) {
      setSearchInitialQuery(query);
    }
  };

  const handleSelectCategoryFromLanding = (cat: string) => {
    setSearchCategoryFilter(cat);
    setCurrentTab('search');
  };

  const handleOpenAuth = (role: 'customer' | 'admin' = 'customer') => {
    setAuthRoleRequested(role);
    setCurrentTab('auth');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentTab('landing');
    try {
      localStorage.removeItem('sortsmart_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Signed out of SortSmart. Please log in to continue.');
  };

  // If user is not logged in, enforce login first before accessing features
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f7faf7] text-slate-800">
        {/* Center Login Gatekeeper Screen */}
        <div className="flex-1 flex flex-col items-center justify-center py-10 px-4">
          <div className="w-full max-w-xl space-y-4">
            <div className="text-center space-y-1 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white mx-auto shadow-md shadow-emerald-500/20">
                <Leaf className="w-6 h-6 text-emerald-100" />
              </div>
              <h2 className="text-2xl font-extrabold font-heading text-slate-900">
                Sort<span className="text-emerald-600">Smart</span>
              </h2>
              <p className="text-xs text-slate-500">
                AI-Powered Waste Segregation & Sustainable Disposal Assistant
              </p>
            </div>

            <AuthView
              initialRole={authRoleRequested}
              onLoginSuccess={(userProfile) => {
                setCurrentUser(userProfile);
                showToast(`Welcome, ${userProfile.name}! All SortSmart features are now unlocked.`);
                if (userProfile.role === 'admin') {
                  setCurrentTab('admin-console');
                } else {
                  setCurrentTab('landing');
                }
              }}
            />
          </div>
        </div>

        {/* Demo Modal if clicked */}
        {isDemoOpen && (
          <GuidedDemoModal
            onClose={() => setIsDemoOpen(false)}
            onNavigateTab={(tab, query) => {
              // Auto log in as customer or admin so the judge demo flows through all features
              if (tab === 'admin-console') {
                setCurrentUser({
                  id: 'admin-demo-1',
                  name: 'Dr. Ramesh K. Verma',
                  email: 'admin.sanitation@smit.edu',
                  role: 'admin',
                  institution: 'SMIT Majitar Campus Administration',
                  campusId: 'STAFF-DIR-08',
                  department: 'Facility Management & Environmental ESG Cell',
                });
              } else {
                setCurrentUser(DEFAULT_CUSTOMER);
              }
              handleNavigateWithQuery(tab, query);
            }}
          />
        )}
      </div>
    );
  }

  // Once authenticated, the user has full access to all features!
  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7] text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        ecoPoints={ecoPoints}
        onOpenDemo={() => setIsDemoOpen(true)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Authentication Page */}
        {currentTab === 'auth' && (
          <AuthView
            initialRole={authRoleRequested}
            onLoginSuccess={(userProfile) => {
              setCurrentUser(userProfile);
              showToast(`Welcome, ${userProfile.name}! Signed in as ${userProfile.role === 'admin' ? 'Facility Admin' : 'Customer'}.`);
              if (userProfile.role === 'admin') {
                setCurrentTab('admin-console');
              } else {
                setCurrentTab('landing');
              }
            }}
            onCancel={() => setCurrentTab('landing')}
          />
        )}

        {/* Customer View: Landing */}
        {currentTab === 'landing' && (
          <LandingView
            onNavigate={(tab) => {
              if (tab === 'admin-console' && currentUser?.role !== 'admin') {
                handleOpenAuth('admin');
              } else {
                setCurrentTab(tab);
              }
            }}
            onOpenDemo={() => setIsDemoOpen(true)}
            onSelectCategory={handleSelectCategoryFromLanding}
          />
        )}

        {/* AI Waste Scanner */}
        {currentTab === 'scanner' && (
          <ScannerView
            onLogActivity={(itemName, category, actionType) =>
              handleLogActivity(itemName, category, actionType)
            }
            onOpenCorrection={(result) => setScanResultForCorrection(result)}
            onNavigateToSearch={(q) => handleNavigateWithQuery('search', q)}
          />
        )}

        {/* Smart Waste Search */}
        {currentTab === 'search' && (
          <SearchView
            initialSearchQuery={searchInitialQuery}
            onSelectItem={(item) => setSelectedItemForDetail(item)}
            onSelectCategoryFilter={searchCategoryFilter}
          />
        )}

        {/* "Why This Bin?" Scientific Breakdown */}
        {currentTab === 'why-bin' && (
          <WhyThisBinView
            onNavigateToSearch={(q) => handleNavigateWithQuery('search', q)}
          />
        )}

        {/* Sustainability Dashboard */}
        {currentTab === 'dashboard' && (
          <>
            <DashboardView
              ecoPoints={ecoPoints}
              activities={activities}
              onOpenLogModal={() => setIsLogModalOpen(true)}
              onNavigateToQuiz={() => setCurrentTab('quiz')}
              onRedeemCredits={async () => {
                const response = await fetch('/api/user/credits/redeem', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: currentUser.id, amount: 100 }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Could not redeem credits.');
                setEcoPoints(data.balance);
                showToast(`🎁 ${data.reward} redeemed. 100 credits used.`);
              }}
            />
            <CustomerComplaintBox userId={currentUser.id} name={currentUser.name} email={currentUser.email} />
          </>
        )}

        {/* Quizzes & Eco-Points */}
        {currentTab === 'quiz' && (
          <QuizView
            ecoPoints={ecoPoints}
            onAwardPoints={handleAwardQuizPoints}
            completedQuizzes={completedQuizzes}
          />
        )}

        {/* Recycling Centre Locator */}
        {currentTab === 'centres' && <CentresView />}

        {/* Campus Bin Overflow Reporting */}
        {currentTab === 'campus-report' && (
          <CampusReportView
            userId={currentUser.id}
            onReportSuccess={(rep) => {
              if (typeof rep.totalPoints === 'number') setEcoPoints(rep.totalPoints);
              else setEcoPoints((prev) => prev + 20);
              showToast('✓ Campus report lodged! +20 Eco-Points added.');
            }}
          />
        )}

        {/* Admin Command Console (Role Protected) */}
        {currentTab === 'admin-console' && (
          currentUser?.role === 'admin' ? (
            <AdminPortalView
              currentUser={currentUser}
              onSwitchToCustomer={() => setCurrentTab('landing')}
            />
          ) : (
            <div className="max-w-md mx-auto py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Administrator Access Required
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Campus Command Console is reserved for facilities management, groundskeeping supervisors, and environmental compliance officers.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleOpenAuth('admin')}
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  Sign In as Facility Admin
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Modals */}
      {selectedItemForDetail && (
        <ItemDetailModal
          item={selectedItemForDetail}
          onClose={() => setSelectedItemForDetail(null)}
          onLogItem={(itemName, category) =>
            handleLogActivity(itemName, category, 'recycled', undefined, true)
          }
        />
      )}

      {scanResultForCorrection && (
        <CorrectionModal
          initialItemName={scanResultForCorrection.itemName}
          initialCategory={scanResultForCorrection.category}
          onClose={() => setScanResultForCorrection(null)}
          onSubmitCorrection={handleSubmitCorrection}
        />
      )}

      {isDemoOpen && (
        <GuidedDemoModal
          onClose={() => setIsDemoOpen(false)}
          onNavigateTab={handleNavigateWithQuery}
        />
      )}

      {isLogModalOpen && (
        <LogDisposalModal
          onClose={() => setIsLogModalOpen(false)}
          onSubmitLog={(itemName, category, actionType, notes, isVerified) =>
            handleLogActivity(itemName, category, actionType, notes, isVerified)
          }
        />
      )}
    </div>
  );
}
