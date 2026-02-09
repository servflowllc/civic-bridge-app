import React, { useState } from 'react';
import { Representative, UserProfile, ViewState } from '../../types';
import { CheckCircle, ArrowRight, Printer, Mail, LayoutGrid, ShieldCheck, ExternalLink, Lock, MapPin } from 'lucide-react';
import { Sidebar } from '../common/Sidebar';

interface SuccessViewProps {
  rep: Representative;
  method: 'webform' | 'pdf';
  onReturn: () => void;
  onViewArchive: () => void;
  isGuest?: boolean;
  onNavigate: (view: ViewState) => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ rep, method, onReturn, onViewArchive, isGuest = false, onNavigate }) => {
  const [imageError, setImageError] = useState(false);

  // Fallback image generator based on party theme
  const getBgColor = () => {
    switch (rep.party) {
      case 'Democrat': return '002e6d'; // Civic Blue
      case 'Republican': return 'cc0000'; // Civic Red
      default: return '5b21b6'; // Violet for Independent
    }
  };
  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(rep.name)}&background=${getBgColor()}&color=fff&size=128&font-size=0.35`;

  // Use a dummy user object for the Sidebar display if in guest mode
  const sidebarUser: UserProfile = {
    id: 'guest',
    name: 'Guest',
    email: '',
    avatar: '',
    isVerified: false,
    isPro: false
  };

  // Helper to format address lines for better readability
  const renderAddressLines = (address: string) => {
    // 1. Remove excessive whitespace
    let cleanAddress = address.trim();

    // 2. Identify common break points
    // Pattern: Split "Street, City, State Zip"
    // We look for the City, State Zip pattern at the end
    const cityStateZipRegex = /,\s*([^,]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/;
    const match = cleanAddress.match(cityStateZipRegex);

    if (match) {
      const street = cleanAddress.replace(match[0], '');
      const cityStateZip = `${match[1]}, ${match[2]} ${match[3]}`;
      return (
        <>
          <span className="block">{street}</span>
          <span className="block">{cityStateZip}</span>
        </>
      );
    }

    // Fallback: If it contains "Washington, DC", force a break there
    if (cleanAddress.includes("Washington, DC")) {
      const parts = cleanAddress.split("Washington, DC");
      return (
        <>
          <span className="block">{parts[0].replace(/,\s*$/, '')}</span>
          <span className="block">Washington, DC{parts[1]}</span>
        </>
      );
    }

    // Default: just return the string
    return <span className="block">{cleanAddress}</span>;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex font-sans">
      {/* Sidebar Wrapper for "Guest Session" look */}
      <Sidebar
        user={sidebarUser}
        currentView="DASHBOARD" // Keep "Dashboard" or similar active to imply app context
        onNavigate={onNavigate}
        isGuest={isGuest}
      />

      {/* Mobile Sidebar Placeholder */}
      <div className="w-64 hidden md:block shrink-0"></div>

      <main className="flex-1 pt-12 pb-12 px-4 md:px-6 flex flex-col items-center animate-fade-in-up justify-center min-h-screen md:min-h-0">

        {/* Success Badge */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-sm relative z-10">
            <CheckCircle className="text-green-600 w-12 h-12" strokeWidth={3} />
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-green-50 rounded-full animate-ping opacity-50"></div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 flex items-center gap-1.5 whitespace-nowrap">
            <ShieldCheck size={12} className="text-green-600" />
            <span className="text-[10px] font-bold text-green-700 tracking-wider uppercase">Voter-Validated Action</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#002e6d] mb-4 text-center px-4 leading-tight">
          {method === 'webform' ? 'Advocacy Document Delivered' : 'Document Generated Successfully'}
        </h1>

        <p className="text-gray-600 text-center max-w-xl mb-12 text-base md:text-lg leading-relaxed px-2">
          {method === 'webform'
            ? `Your correspondence has been securely drafted and you have been redirected to ${rep.name}'s official office. If you submitted the form on their site, you should receive an automated receipt via email within 24 hours.`
            : `Your formal letter is ready for printing. Please sign it and mail it to the address provided below to ensure it reaches ${rep.name}'s legislative staff.`
          }
        </p>

        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl">

          {/* Left: Action Summary Card */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Submission Summary</h3>

            <div className="flex items-center gap-4 mb-8">
              <img
                src={imageError ? fallbackImage : rep.imageUrl}
                alt={rep.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                onError={() => setImageError(true)}
              />
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{rep.name}</h4>
                <p className="text-sm text-gray-500">{rep.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-400">REFERENCE ID</span>
                <span className="text-sm font-mono text-gray-700 font-bold">CB-{Math.floor(Math.random() * 1000000)}</span>
              </div>

              {method === 'pdf' && (
                <div className="bg-blue-50 rounded-xl p-5 border-2 border-dashed border-blue-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Mail className="w-24 h-24 text-[#002e6d]" />
                  </div>

                  <h4 className="font-bold text-[#002e6d] mb-4 flex items-center gap-2 text-xs uppercase tracking-widest relative z-10">
                    <Printer size={16} /> Mailing Label
                  </h4>

                  {/* Envelope Address Card */}
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 relative z-10 w-full">
                    <p className="font-bold text-gray-900 text-lg mb-1 leading-snug">{rep.role === 'U.S. Senator' ? 'Honorable' : 'Rep.'} {rep.name}</p>
                    <div className="text-gray-600 font-medium text-base leading-snug break-words">
                      {renderAddressLines(rep.mailingAddress)}
                    </div>
                  </div>

                  <p className="text-[10px] text-blue-800/60 mt-3 font-medium text-center md:text-left relative z-10">
                    *Write this address clearly on your envelope.
                  </p>
                </div>
              )}

              {method === 'webform' && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-bold text-[#002e6d] mb-1 flex items-center gap-2">
                    <ExternalLink size={14} /> Digital Handoff
                  </h4>
                  <p className="text-sm text-blue-800/80">
                    Your text was copied to the clipboard for submission via {rep.contactUrl ? new URL(rep.contactUrl).hostname : 'official channels'}.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Impact & Actions */}
          <div className="w-full lg:w-80 flex flex-col gap-4">

            {/* Impact Score */}
            <div className="bg-[#002e6d] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
              {/* Guest Lock Overlay */}
              {isGuest && (
                <div className="absolute inset-0 bg-[#002e6d]/90 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20 p-4 text-center">
                  <div className="bg-white/10 p-3 rounded-full mb-2 border border-white/20"><Lock size={20} /></div>
                  <span className="text-sm font-bold">Impact Score Locked</span>
                  <span className="text-[10px] opacity-75 mt-1 leading-snug">Create an account to track your civic influence over time.</span>
                  <button
                    onClick={() => onNavigate('UPGRADE')}
                    className="mt-3 px-4 py-1.5 bg-white text-[#002e6d] text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <div className="absolute -right-4 -bottom-4 opacity-20">
                <LayoutGrid size={120} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Civic Impact Score</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold">{rep.lifetimeContactCount + 1}</span>
                  <span className="text-sm opacity-80">Total Actions</span>
                </div>
                <p className="text-xs text-blue-200 leading-snug">
                  You're in the top 15% of active constituents in your district!
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex-1 flex flex-col justify-center">
              <h3 className="font-bold text-gray-900 mb-4 text-center">What's Next?</h3>
              <button
                onClick={onReturn}
                className="w-full bg-[#002e6d] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mb-3"
              >
                Return to Dashboard
              </button>
              <button
                onClick={onViewArchive}
                className="w-full bg-white hover:bg-gray-50 text-gray-600 font-semibold py-3.5 rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2"
              >
                {isGuest ? 'Unlock Archive' : 'View in Archive'}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};