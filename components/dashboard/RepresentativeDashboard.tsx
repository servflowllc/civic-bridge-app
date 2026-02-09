import React, { useEffect, useState } from 'react';
import { Representative, ViewState } from '../../types';
import { Clock, Send, Users, ShieldCheck, Archive, X, HelpCircle, Lock, MousePointer2, Map } from 'lucide-react';

interface DashboardProps {
  reps: Representative[];
  onSelectRep: (rep: Representative) => void;
  showTour?: boolean;
  onCloseTour?: (dontShowAgain: boolean) => void;
  onNavigate?: (view: ViewState) => void;
  isGuest?: boolean;
}

export const RepresentativeDashboard: React.FC<DashboardProps> = ({ reps, onSelectRep, showTour, onCloseTour, onNavigate, isGuest = false }) => {
  const [tourStep, setTourStep] = useState(1);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [showCooldownInfo, setShowCooldownInfo] = useState(false);
  const [guestContactedReps, setGuestContactedReps] = useState<string[]>([]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load guest contact history
  useEffect(() => {
    if (isGuest) {
        const stored = localStorage.getItem('guest_contacted_reps');
        if (stored) {
            setGuestContactedReps(JSON.parse(stored));
        }
    }
  }, [isGuest]);

  const handleTourNext = () => {
      setTourStep(2);
  };

  const handleTourFinish = () => {
      if (onCloseTour) onCloseTour(dontShowAgain);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-20 md:pt-28 pb-12 animate-fade-in-up relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4">
        <div>
           <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Civic Advocacy Dashboard</h2>
           <p className="text-gray-500 mt-2 text-base md:text-lg">Manage your legislative relationships and track your constituent impact.</p>
        </div>
        <div className="flex items-center gap-3">
            {!isGuest && (
                <button 
                    onClick={() => onNavigate?.('ARCHIVE')}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-full border border-gray-200 hover:bg-gray-50 hover:text-[#002e6d] transition-colors shadow-sm font-semibold text-sm"
                >
                    <Archive size={16} />
                    <span>View Archive</span>
                </button>
            )}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-full border ${isGuest ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-blue-50 text-[#002e6d] border-blue-100'}`}>
               <ShieldCheck size={14} />
               <span className="text-xs font-bold uppercase tracking-wider">{isGuest ? 'Guest Access' : 'Voter Verified'}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reps.map((rep, index) => {
          // Determine if this rep is locked for the guest
          const isGuestLocked = isGuest && guestContactedReps.includes(rep.id);
          
          return (
            <RepCard 
                key={rep.id} 
                rep={rep}
                index={index} 
                onAction={() => onSelectRep(rep)} 
                onShowCooldownInfo={() => setShowCooldownInfo(true)}
                isGuestLocked={isGuestLocked}
                showTourTooltip={showTour && tourStep === 2 && index === 0}
                onTourFinish={handleTourFinish}
                dontShowAgain={dontShowAgain}
                setDontShowAgain={setDontShowAgain}
            />
          );
        })}

        {/* Coming Soon Card for Local/State */}
        <div className="bg-gray-50/50 rounded-2xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center h-full min-h-[320px] transition-all hover:bg-gray-50 hover:border-blue-200 group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-gray-400 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                <Map size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">State & Local Officials</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs leading-relaxed">
                We are actively integrating with new data partners to bring detailed Governor, Mayor, and City Council data to the dashboard.
            </p>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg text-xs font-bold text-blue-700 uppercase tracking-widest shadow-sm">
                <Clock size={14} /> Coming Soon
            </span>
        </div>
      </div>

      {/* Tour Step 1 Overlay: "Choose Representative" */}
      {showTour && tourStep === 1 && onCloseTour && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-[2px] animate-fade-in-up pt-36 px-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl relative border-l-4 border-blue-600">
            {/* Arrow on LEFT side pointing left - Hidden on mobile if centered differently */}
            <div className="absolute -left-2 top-10 w-4 h-4 bg-white rotate-45 border-l border-b border-gray-200 hidden md:block"></div>
            
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-blue-600" size={20} />
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Step 2: Choose Representative</span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Meet Your Voice</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              We've automatically identified your officials from Local councils to Federal congress based on your district.
            </p>
            
            <div className="flex items-center justify-between">
               <div className="flex gap-2">
                 <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                 <div className="w-8 h-1.5 bg-blue-600 rounded-full"></div>
                 <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
               </div>
               
               <button onClick={handleTourNext} className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-100 transition-colors flex items-center gap-2">
                 Next <MousePointer2 size={16} />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Cooldown Info Modal */}
      {showCooldownInfo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-up">
           <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative animate-scale-in">
              {/* Header */}
              <div className="bg-[#0f172a] p-6 flex items-center justify-between text-white">
                 <h3 className="font-bold text-xl flex items-center gap-2">
                    <Clock size={20} className="text-blue-400" />
                    Why a Cooldown?
                 </h3>
                 <button onClick={() => setShowCooldownInfo(false)} className="text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>
              
              <div className="p-8">
                 <h4 className="font-bold text-gray-900 text-lg mb-4">Professional Advocacy over Spam</h4>
                 <p className="text-gray-600 mb-8 leading-relaxed">
                    To ensure your voice carries weight with elected officials, The Bridge prioritizes quality over quantity. Cooldowns are essential for maintaining a respectful and effective channel.
                 </p>

                 <button 
                    onClick={() => setShowCooldownInfo(false)}
                    className="w-full bg-[#cc0000] hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-red-100"
                 >
                    I Understand
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const RepCard: React.FC<{ 
    rep: Representative; 
    index: number;
    onAction: () => void; 
    onShowCooldownInfo: () => void;
    isGuestLocked?: boolean;
    showTourTooltip?: boolean;
    onTourFinish?: () => void;
    dontShowAgain?: boolean;
    setDontShowAgain?: (val: boolean) => void;
}> = ({ rep, index, onAction, onShowCooldownInfo, isGuestLocked, showTourTooltip, onTourFinish, dontShowAgain, setDontShowAgain }) => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  
  // If guest is locked, treat it as "forever" cooldown until signup
  const isBlocked = timeLeft !== null || isGuestLocked;

  // Fallback image generator based on party theme
  const getBgColor = () => {
      // Direct mappings
      if (rep.party === 'Democrat') return '002e6d'; // Civic Blue
      if (rep.party === 'Republican') return 'cc0000'; // Civic Red
      
      // If Independent or Unknown, cycle through colors based on card index
      // This ensures we don't just see a wall of Purple/Red if data is ambiguous
      const fallbackColors = ['002e6d', 'cc0000', '059669', '7c3aed']; // Blue, Red, Green, Purple
      return fallbackColors[index % fallbackColors.length];
  };
  
  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(rep.name)}&background=${getBgColor()}&color=fff&size=256&font-size=0.35`;

  useEffect(() => {
    if (!rep.lastContacted) return;

    const checkCooldown = () => {
      const now = Date.now();
      const diff = now - rep.lastContacted!;
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (diff < twentyFourHours) {
        const remaining = twentyFourHours - diff;
        const h = Math.floor(remaining / (1000 * 60 * 60));
        const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${h}h ${m}m`);
      } else {
        setTimeLeft(null);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 60000);
    return () => clearInterval(interval);
  }, [rep.lastContacted]);

  return (
    <div className={`relative group h-full ${showTourTooltip ? 'z-40' : ''}`}>
      {/* Visual Card Container - Handles Overflow Clipping */}
      <div className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 flex flex-col h-full relative overflow-hidden ${showTourTooltip ? 'ring-4 ring-blue-500/20' : ''}`}>
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div className="relative mb-4">
          <div className="h-32 rounded-xl bg-slate-50 overflow-hidden mb-[-40px]">
            <img 
                src={imageError ? fallbackImage : rep.imageUrl} 
                className="w-full h-full object-cover opacity-50 blur-xl scale-110 grayscale group-hover:grayscale-0 transition-all duration-500" 
                alt="Background" 
            />
          </div>
          <div className="flex items-end justify-between px-2">
              <img 
                src={imageError ? fallbackImage : rep.imageUrl} 
                alt={rep.name} 
                className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-md z-10 bg-white"
                onError={() => setImageError(true)}
              />
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border mb-11 shadow-sm ${
                rep.party === 'Republican' ? 'bg-red-50 text-red-700 border-red-100' :
                rep.party === 'Democrat' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                'bg-purple-50 text-purple-700 border-purple-100'
              }`}>
                {rep.level}
              </span>
          </div>
        </div>

        <div className="mt-2">
          <h3 className="font-bold text-gray-900 text-xl group-hover:text-[#002e6d] transition-colors">{rep.name}</h3>
          <p className="text-sm text-gray-500 font-medium mb-4">{rep.role}</p>
        </div>

        <div className="flex-1">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-colors">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 font-bold">Constituent Impact</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-[#002e6d]">{rep.lifetimeContactCount}</span>
              <span className="text-xs text-gray-500">interactions tracked</span>
            </div>
          </div>
        </div>

        <div className="mt-6 relative">
          {isBlocked ? (
            <button 
              onClick={isGuestLocked ? onAction : onShowCooldownInfo}
              className={`w-full bg-gray-50 hover:bg-gray-100 text-gray-400 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 border border-gray-100 transition-colors cursor-help group/btn ${isGuestLocked ? 'cursor-not-allowed opacity-75' : ''}`}
              disabled={isGuestLocked}
            >
              {isGuestLocked ? (
                  <>
                      <Lock size={18} />
                      <span className="text-xs">Already contacted</span>
                  </>
              ) : (
                  <>
                      <Clock size={18} />
                      <span>Cooldown: {timeLeft}</span>
                      <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center ml-1 group-hover/btn:bg-blue-100 group-hover/btn:text-blue-600 transition-colors">
                          <HelpCircle size={12} />
                      </div>
                  </>
              )}
            </button>
          ) : (
            <button 
              onClick={onAction}
              className="w-full bg-white border border-[#002e6d]/20 text-[#002e6d] hover:bg-[#002e6d] hover:text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Send size={18} />
              <span>Draft Message</span>
            </button>
          )}
        </div>
      </div>

      {/* Guest Lock Overlay - Positioned outside overflow-hidden to prevent clipping */}
      {isGuestLocked && (
          <div className="absolute bottom-6 left-4 right-4 z-20 animate-scale-in">
              <div className="bg-white p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 transform -rotate-1 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <Lock size={14} strokeWidth={2.5} />
                  </div>
                  <p className="text-xs font-bold text-gray-800 mt-3 mb-1">Start Your Advocacy Record</p>
                  <p className="text-[10px] text-gray-500 leading-snug px-2">
                    Sign up to keep your receipts! Save your history and track your impact score.
                  </p>
              </div>
          </div>
      )}

      {/* Step 3 Tour Tooltip - Rendered Outside the overflow-hidden Card */}
      {showTourTooltip && (
          <div className="absolute bottom-[85px] left-1/2 -translate-x-1/2 z-50 w-64 animate-fade-in-up">
              <div className="bg-[#0f172a] text-white p-5 rounded-2xl shadow-2xl relative text-center border border-gray-700">
                  {/* Arrow pointing down */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0f172a] rotate-45 border-r border-b border-gray-700"></div>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xs">3</div>
                      <span className="font-bold text-sm uppercase tracking-wider">Take Action</span>
                  </div>
                  
                  <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                      Click 'Draft Message' button to enter the Drafting Portal and use AI to write your message.
                  </p>
                  
                  <button 
                      onClick={(e) => { e.stopPropagation(); onTourFinish?.(); }}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-lg transition-colors mb-3"
                  >
                      Start Exploring
                  </button>

                  <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-700">
                      <input 
                        type="checkbox" 
                        id="dontShowTourTooltip"
                        checked={dontShowAgain}
                        onChange={(e) => setDontShowAgain?.(e.target.checked)}
                        className="w-3 h-3 text-blue-600 rounded cursor-pointer accent-blue-600"
                      />
                      <label htmlFor="dontShowTourTooltip" className="text-[10px] text-gray-400 cursor-pointer select-none">
                        Don't show tour again
                      </label>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};