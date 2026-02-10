import React, { useState } from 'react';
import { Landmark, PenTool, Archive, Settings, Crown, X, Heart, Lock, User } from 'lucide-react';
import { UserProfile, ViewState } from '../../types';

interface SidebarProps {
  user: UserProfile;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isGuest?: boolean;
  onSupportClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, currentView, onNavigate, isGuest = false, onSupportClick }) => {
  const [showDonationModal, setShowDonationModal] = useState(false);

  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-40 hidden md:flex">
        <div
          className="p-6 flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('DASHBOARD')}
        >
          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-[#cc0000] group-hover:bg-red-100 transition-colors">
            <Landmark size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-[#002e6d] leading-none group-hover:text-blue-800 transition-colors">Civic Bridge</h1>
            <span className="text-[10px] text-gray-400 font-medium">Citizen Advocacy</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <NavItem
            icon={<PenTool size={18} />}
            label="Draft Letter"
            active={currentView === 'PORTAL' || currentView === 'DASHBOARD'}
            onClick={() => onNavigate('DASHBOARD')}
          />

          <NavItem
            icon={isGuest ? <Lock size={18} /> : <Archive size={18} />}
            label="Civic Archive"
            active={currentView === 'ARCHIVE'}
            onClick={() => isGuest ? onNavigate('UPGRADE') : onNavigate('ARCHIVE')}
            locked={isGuest}
          />

          <NavItem
            icon={isGuest ? <Lock size={18} /> : <Settings size={18} />}
            label="Settings"
            active={currentView === 'SETTINGS'}
            onClick={() => isGuest ? onNavigate('UPGRADE') : onNavigate('SETTINGS')}
            locked={isGuest}
          />

          <div className="pt-4 mt-4 border-t border-gray-100"></div>

          <NavItem
            icon={<Crown size={18} className={currentView === 'UPGRADE' ? "text-yellow-500" : "text-gray-400"} />}
            label="Civic+ Upgrade"
            active={currentView === 'UPGRADE'}
            onClick={() => onNavigate('UPGRADE')}
          />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 m-4 bg-[#002e6d] rounded-2xl text-white shrink-0">
          <h3 className="font-bold text-sm mb-1">Support Us</h3>
          <p className="text-[10px] text-blue-200 mb-3 leading-relaxed">
            Donations coming soon. Please check back later.
          </p>
          <button
            onClick={() => setShowDonationModal(true)}
            className="w-full bg-white/10 hover:bg-white/20 transition-colors py-2 rounded-lg text-xs font-semibold"
          >
            Coming Soon
          </button>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
          {isGuest ? (
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
              <User size={20} />
            </div>
          ) : (
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
          )}

          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-gray-900 truncate">{isGuest ? 'Guest User' : user.name}</span>
            <span className="text-xs text-gray-500 truncate">{isGuest ? 'Free Tier' : user.email}</span>
          </div>
          {user.isPro && !isGuest && (
            <div className="ml-auto bg-yellow-400 text-[#002e6d] rounded-full p-1" title="Civic+ Member">
              <Crown size={12} fill="currentColor" />
            </div>
          )}
        </div>
      </aside>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-scale-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
            <button
              onClick={() => setShowDonationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-1"
            >
              <X size={20} />
            </button>

            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-[#cc0000] rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={32} fill="currentColor" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Support Civic Bridge</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Your voice is powerful, and your support amplifies our mission. Help us build the bridge to a more responsive government for every citizen. Secure donation options are landing soon!
              </p>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-[#002e6d] mb-8 text-left">
                <strong>Impact Preview:</strong> Your future support will help us maintain free access and expand our tools.
              </div>

              <button
                onClick={() => {
                  setShowDonationModal(false);
                  if (onSupportClick) onSupportClick();
                }}
                className="w-full bg-[#002e6d] hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
              >
                Contact Us for Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void; locked?: boolean }> = ({ icon, label, active, onClick, locked }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${active
      ? 'bg-blue-50 text-[#002e6d] font-bold'
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      } ${locked ? 'opacity-75 bg-gray-50/50' : ''}`}
  >
    {icon}
    {label}
    {locked && (
      <Lock size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
    )}
  </button>
);