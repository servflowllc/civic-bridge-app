import React, { useState } from 'react';
import { Landmark, Menu, X, Home, BookOpen, Info, LayoutGrid, Archive, Settings, Crown, LogOut, User } from 'lucide-react';
import { UserProfile, ViewState } from '../../types';

interface HeaderProps {
  user: UserProfile | null;
  onLogout: () => void;
  onNavigate: (view: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-4 md:px-6 py-3 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('LANDING')}
        >
          <div className="text-[#cc0000] group-hover:scale-105 transition-transform">
            <Landmark size={24} className="md:w-7 md:h-7" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold text-[#002e6d] tracking-tight leading-none">Civic Bridge</span>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide">Citizen Advocacy</span>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-8">
            <button
              onClick={() => onNavigate(user ? 'DASHBOARD' : 'LANDING')}
              className="text-gray-600 hover:text-[#002e6d] font-medium text-sm transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('EDUCATION')}
              className="text-gray-600 hover:text-[#002e6d] font-medium text-sm transition-colors"
            >
              Education
            </button>
            <button
              onClick={() => onNavigate('ABOUT')}
              className="text-gray-600 hover:text-[#002e6d] font-medium text-sm transition-colors"
            >
              About
            </button>
          </nav>
          
          {user ? (
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                 <p className="text-xs text-green-600 font-medium">Voter Verified</p>
               </div>
               <img 
                 src={user.avatar} 
                 alt="Profile" 
                 className="w-9 h-9 rounded-full border-2 border-white shadow-sm cursor-pointer hover:opacity-80"
                 onClick={() => onNavigate('SETTINGS')}
                 title="My Profile & Settings"
               />
            </div>
          ) : (
            <button onClick={() => onNavigate('LOGIN')} className="px-5 py-2 bg-[#002e6d] text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors shadow-md">
                Sign In / Join
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white animate-fade-in-up flex flex-col md:hidden">
          {/* Menu Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
             <div className="flex items-center gap-2">
                <Landmark className="text-[#cc0000]" size={24} />
                <span className="font-bold text-lg text-[#002e6d]">Civic Bridge</span>
             </div>
             <button 
               onClick={() => setIsMenuOpen(false)} 
               className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
               aria-label="Close Menu"
             >
               <X size={24} />
             </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-8 bg-[#F5F7FA]">
             
             {/* Main Navigation */}
             <div className="space-y-2">
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Menu</h3>
               <MobileNavItem icon={<Home size={20} />} label="Home" onClick={() => handleNav(user ? 'DASHBOARD' : 'LANDING')} />
               <MobileNavItem icon={<BookOpen size={20} />} label="Education Center" onClick={() => handleNav('EDUCATION')} />
               <MobileNavItem icon={<Info size={20} />} label="About Platform" onClick={() => handleNav('ABOUT')} />
             </div>

             {/* App Navigation (Visible if logged in) */}
             {user && (
               <div className="space-y-2">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Dashboard</h3>
                 <MobileNavItem icon={<LayoutGrid size={20} />} label="Representatives" onClick={() => handleNav('DASHBOARD')} />
                 <MobileNavItem icon={<Archive size={20} />} label="Civic Archive" onClick={() => handleNav('ARCHIVE')} />
                 <MobileNavItem icon={<Settings size={20} />} label="Settings" onClick={() => handleNav('SETTINGS')} />
                 <MobileNavItem icon={<Crown size={20} className="text-yellow-500" />} label="Civic+ Upgrade" onClick={() => handleNav('UPGRADE')} />
               </div>
             )}

             {/* User Section (Footer) */}
             <div className="pt-6 border-t border-gray-200">
               {user ? (
                 <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                   <div className="flex items-center gap-3 mb-4">
                      <img src={user.avatar} className="w-12 h-12 rounded-full border border-gray-200" alt="Profile" />
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => { onLogout(); setIsMenuOpen(false); }} 
                     className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl text-sm font-bold text-red-600 transition-colors"
                   >
                     <LogOut size={18} /> Sign Out
                   </button>
                 </div>
               ) : (
                 <button 
                   onClick={() => handleNav('LOGIN')} 
                   className="w-full py-4 bg-[#002e6d] text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                 >
                   <User size={20} /> Sign In / Join
                 </button>
               )}
             </div>
          </div>
        </div>
      )}
    </>
  );
};

const MobileNavItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 px-4 py-4 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-100 rounded-xl transition-all group active:scale-95"
  >
    <div className="text-gray-500 group-hover:text-[#002e6d] transition-colors">{icon}</div>
    <span className="font-semibold text-gray-700 group-hover:text-[#002e6d] text-base">{label}</span>
  </button>
);