import React from 'react';
import { UserProfile, ViewState } from '../../types';
import { Sidebar } from '../common/Sidebar';
import { Crown, ArrowLeft, ShieldCheck } from 'lucide-react';

interface UpgradeViewProps {
  user: UserProfile;
  onNavigate: (view: ViewState) => void;
  onUpdateUser?: (user: UserProfile) => void;
}

export const UpgradeView: React.FC<UpgradeViewProps> = ({ user, onNavigate }) => {

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex font-sans">
      <Sidebar user={user} currentView="UPGRADE" onNavigate={onNavigate} isGuest={user.id === 'guest'} />

      {/* Mobile Sidebar Placeholder */}
      <div className="w-64 hidden md:block shrink-0"></div>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center min-h-[80vh]">

        <div className="text-center max-w-2xl animate-fade-in-up">
          <div className="w-20 h-20 bg-blue-50 text-[#002e6d] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Crown size={40} fill="currentColor" className="text-yellow-400" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Civic+ Membership <br />
            <span className="text-[#002e6d]">Coming Soon</span>
          </h1>

          <p className="text-xl text-gray-500 mb-10 leading-relaxed">
            We are currently building the Civic+ experience. Please check back soon for updates.
          </p>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-left mb-10">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck size={20} className="text-green-600" />
              What to expect
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                <span>Unlimited AI Drafting & Tone Checks</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                <span>Full Historical Archive of all correspondence</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2"></div>
                <span>Verified Constituent Badge for higher impact</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('LANDING')}
            className="flex items-center gap-2 text-gray-400 hover:text-[#002e6d] font-semibold mx-auto transition-colors"
          >
            <ArrowLeft size={18} /> Return to Home
          </button>
        </div>
      </main>
    </div>
  );
};