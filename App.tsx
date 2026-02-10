import React, { useState, useEffect } from 'react';
import { UserProfile, ViewState, Representative, ActivityLog } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { LoginView } from './components/auth/LoginView';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { RepresentativeDashboard } from './components/dashboard/RepresentativeDashboard';
import { DraftingPortal } from './components/portal/DraftingPortal';
import { SuccessView } from './components/portal/SuccessView';
import { ArchiveView } from './components/archive/ArchiveView';
import { SettingsView } from './components/settings/SettingsView';
import { AboutView } from './components/about/AboutView';
import { EducationView } from './components/education/EducationView';
import { UpgradeView } from './components/subscription/UpgradeView';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsOfService } from './components/legal/TermsOfService';
import { AccessibilityStatement } from './components/legal/AccessibilityStatement';
import { MOCK_LOGS, MOCK_DOCUMENTS } from './services/mockData';
import { ContactModal } from './components/common/ContactModal';
import { fetchRepresentatives } from './services/civicService';

export const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('LANDING');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [guestAddress, setGuestAddress] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedRep, setSelectedRep] = useState<Representative | null>(null);
  const [showTour, setShowTour] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [lastActionMethod, setLastActionMethod] = useState<'webform' | 'pdf'>('webform');
  const [loginMessage, setLoginMessage] = useState<string>('');

  // State to hold representatives
  const [reps, setReps] = useState<Representative[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>(MOCK_LOGS);

  // State to force refresh of Education View when clicking header link
  const [educationRefreshKey, setEducationRefreshKey] = useState(0);

  // Helper to determine if we are in Guest Mode
  const isGuest = !user && !!guestAddress;

  // Initialize: Check session storage for existing guest session
  useEffect(() => {
    const storedAddress = sessionStorage.getItem('civic_user_address');
    if (storedAddress && !user) {
      console.log("[DEBUG] App.tsx: Found stored guest address in session:", storedAddress);
      setGuestAddress(storedAddress);
      handleFetchReps(storedAddress);
      setCurrentView('DASHBOARD');
    }
  }, [user]);

  // Load user-specific data when user logs in
  useEffect(() => {
    if (user) {
      // In the current "Coming Soon" flow, we don't fetch data for logged in users
      // because they land on the Upgrade/Coming Soon page.
      // If we were fully active, we would fetch here.
    }
  }, [user]);

  const handleFetchReps = async (address: string): Promise<boolean> => {
    console.log("[DEBUG] App.tsx: Fetching representatives for address:", address);
    const fetchedReps = await fetchRepresentatives(address);
    if (!fetchedReps || fetchedReps.length === 0) {
      return false;
    }
    setReps(fetchedReps);
    return true;
  };

  // Auth Handler
  const handleLogin = () => {
    setIsLoading(true);
    setLoginMessage('');
    setTimeout(() => {
      // Redirect to Civic+ (Coming Soon) page instead of logging in
      setIsLoading(false);
      setCurrentView('UPGRADE');
    }, 1200);
  };

  const handleLogout = () => {
    setUser(null);
    setGuestAddress(null);
    sessionStorage.removeItem('civic_user_address'); // Clear session
    setCurrentView('LANDING');
    setSelectedRep(null);
    setShowTour(false);
    setReps([]);
    setLogs(MOCK_LOGS);
  };

  // Guest Handler
  const handleStartGuest = async (address: string): Promise<boolean> => {
    console.log("[DEBUG] App.tsx: Starting Guest Session with Address:", address);

    // 1. Attempt Fetch
    const success = await handleFetchReps(address);

    if (success) {
      setGuestAddress(address);
      setCurrentView('DASHBOARD');

      const hasSeenTour = localStorage.getItem('civic_bridge_tour_seen');
      if (!hasSeenTour) {
        setShowTour(true);
      }
      return true;
    } else {
      // Failed
      setGuestAddress(null);
      return false;
    }
  };

  // Onboarding Handler (Logged In) - Kept for future use, but not triggered in current flow
  const handleOnboardingComplete = (address: string) => {
    if (user) {
      setUser({ ...user, address, isVerified: true });
      handleFetchReps(address);
      setCurrentView('DASHBOARD');
    }
  };

  const handleCloseTour = (dontShowAgain: boolean) => {
    setShowTour(false);
    if (dontShowAgain) {
      localStorage.setItem('civic_bridge_tour_seen', 'true');
    }
  };

  // Dashboard Handler
  const handleRepSelect = (rep: Representative) => {
    setSelectedRep(rep);
    setCurrentView('PORTAL');
  };

  const handleSuccess = (method: 'webform' | 'pdf') => {
    setLastActionMethod(method);

    // Update Rep Cooldown logic
    const updatedReps = reps.map(r => {
      if (selectedRep && r.id === selectedRep.id) {
        return {
          ...r,
          lastContacted: Date.now(),
          lifetimeContactCount: r.lifetimeContactCount + 1
        };
      }
      return r;
    });
    setReps(updatedReps);

    if (user && selectedRep) {
      // Logged in logic (if active)
      localStorage.setItem(`civic_bridge_data_${user.id}_reps`, JSON.stringify(updatedReps));
    } else if (isGuest && selectedRep) {
      // Guest: save simple contact record to local storage for "One per rep" limit
      const guestContacts = JSON.parse(localStorage.getItem('guest_contacted_reps') || '[]');
      if (!guestContacts.includes(selectedRep.id)) {
        guestContacts.push(selectedRep.id);
        localStorage.setItem('guest_contacted_reps', JSON.stringify(guestContacts));
      }
    }

    setCurrentView('SUCCESS');
  };

  // ... (inside handleNavigate) ...
  const handleNavigate = (view: ViewState) => {
    // 1. Guest Logic: If trying to go Home (LANDING) but has an address, send to DASHBOARD
    if (view === 'LANDING' && isGuest) {
      setCurrentView('DASHBOARD');
      return;
    }

    // 2. Permission Logic (Updated to include legal pages)
    const guestAllowed: ViewState[] = [
      'LANDING', 'LOGIN', 'DASHBOARD', 'PORTAL', 'EDUCATION', 'UPGRADE',
      'SUCCESS', 'ABOUT', 'PRIVACY', 'TERMS', 'ACCESSIBILITY'
    ];

    if (isGuest && !guestAllowed.includes(view)) {
      // If guest tries to access protected, send to Login or Upgrade
      if (view === 'ARCHIVE' || view === 'SETTINGS') {
        setLoginMessage("Please sign in to access your history and settings.");
        setCurrentView('LOGIN');
      }
      return;
    }

    // If user is not logged in AND not a guest, restricted
    if (!user && !isGuest && view !== 'LOGIN' && view !== 'LANDING' && view !== 'ABOUT' && view !== 'UPGRADE' && view !== 'PRIVACY' && view !== 'TERMS' && view !== 'ACCESSIBILITY') {
      setCurrentView('LOGIN');
      return;
    }

    // **FIX**: If navigating to EDUCATION while already there, force refresh
    if (view === 'EDUCATION' && currentView === 'EDUCATION') {
      setEducationRefreshKey(prev => prev + 1);
    }

    // Allow navigation
    setLoginMessage('');
    setCurrentView(view);
  };
  // ...
  {
    currentView === 'EDUCATION' && (
      <EducationView key={educationRefreshKey} onNavigate={handleNavigate} />
    )
  }

  const handleOpenContact = (subject: string = '') => {
    setContactSubject(subject);
    setIsContactModalOpen(true);
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col">
      {/* Hide Header on Landing Page for cleanliness, or keep it custom */}
      {currentView !== 'LANDING' && (currentView !== 'ARCHIVE' && currentView !== 'SETTINGS' && currentView !== 'UPGRADE' && currentView !== 'SUCCESS' && currentView !== 'PRIVACY' && currentView !== 'TERMS' && currentView !== 'ACCESSIBILITY') && (
        <Header user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
      )}

      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1">
          {currentView === 'LANDING' && (
            <LandingPage onStartGuest={handleStartGuest} onLogin={() => setCurrentView('LOGIN')} />
          )}

          {currentView === 'LOGIN' && (
            <LoginView
              onLogin={handleLogin}
              isLoading={isLoading}
              message={loginMessage}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'ONBOARDING' && (
            <OnboardingWizard onComplete={handleOnboardingComplete} />
          )}

          {currentView === 'DASHBOARD' && (
            <RepresentativeDashboard
              reps={reps}
              onSelectRep={handleRepSelect}
              showTour={showTour}
              onCloseTour={handleCloseTour}
              onNavigate={handleNavigate}
              isGuest={isGuest} // Pass guest status
            />
          )}

          {currentView === 'PORTAL' && selectedRep && (
            <DraftingPortal
              rep={selectedRep}
              user={user || { id: 'guest', name: 'Concerned Citizen', email: '', avatar: '', isVerified: false, isPro: false }} // Fallback user for guest
              isGuest={isGuest}
              guestAddress={guestAddress}
              onBack={() => setCurrentView('DASHBOARD')}
              onSuccess={handleSuccess}
              onUpgrade={() => setCurrentView('UPGRADE')}
            />
          )}

          {currentView === 'SUCCESS' && selectedRep && (
            <SuccessView
              rep={selectedRep}
              method={lastActionMethod}
              onReturn={() => setCurrentView('DASHBOARD')}
              onViewArchive={() => isGuest ? setCurrentView('UPGRADE') : setCurrentView('ARCHIVE')}
              isGuest={isGuest}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'ARCHIVE' && user && (
            <ArchiveView
              user={user}
              logs={logs}
              documents={MOCK_DOCUMENTS}
              onNavigate={handleNavigate}
              onSupportClick={() => handleOpenContact('Donation Inquiry')}
            />
          )}

          {currentView === 'SETTINGS' && user && (
            <SettingsView
              user={user}
              onNavigate={handleNavigate}
              onUpdateUser={(u) => setUser(u)}
              onLogout={handleLogout}
              onSupportClick={() => handleOpenContact('Donation Inquiry')}
            />
          )}

          {currentView === 'UPGRADE' && (
            <UpgradeView
              user={user || { id: 'guest', name: 'Guest', email: '', avatar: '', isVerified: false, isPro: false }}
              onNavigate={handleNavigate}
              onUpdateUser={(u) => setUser(u)}
              onJoinWaitlist={() => handleOpenContact('Join Waitlist')}
            />
          )}

          {currentView === 'ABOUT' && (
            <AboutView onNavigate={handleNavigate} />
          )}

          {currentView === 'EDUCATION' && (
            <EducationView key={educationRefreshKey} onNavigate={handleNavigate} />
          )}

          {/* Legal Pages */}
          {currentView === 'PRIVACY' && <PrivacyPolicy onNavigate={handleNavigate} />}
          {currentView === 'TERMS' && <TermsOfService onNavigate={handleNavigate} />}
          {currentView === 'ACCESSIBILITY' && <AccessibilityStatement onNavigate={handleNavigate} />}
        </div>

        {/* Only show footer on pages where it makes sense visually */}
        {currentView !== 'PORTAL' && (
          <div className={(currentView === 'UPGRADE' || currentView === 'ARCHIVE' || currentView === 'SETTINGS' || currentView === 'SUCCESS') ? 'md:ml-64' : ''}>
            <Footer onNavigate={handleNavigate} />
          </div>
        )}
      </main>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        initialSubject={contactSubject}
        userEmail={user?.email}
      />
    </div>
  );
};