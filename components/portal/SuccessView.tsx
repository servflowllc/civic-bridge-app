import React, { useState } from 'react';
import { Representative, UserProfile, ViewState } from '../../types';
import { CheckCircle, ArrowRight, Printer, Mail, LayoutGrid, ShieldCheck, ExternalLink, Lock, MapPin, Copy, Download, AlertTriangle } from 'lucide-react';
import { Sidebar } from '../common/Sidebar';
import { jsPDF } from "jspdf";

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
  const [hasSavedLabel, setHasSavedLabel] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

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
  const getFormattedAddressParts = (address: string) => {
    let cleanAddress = address.trim();

    // Strategy 1: Explicitly look for "Washington, DC" variations (common for federal)
    // Matches: "123 St, Washington, DC 20510" or "123 St Washington DC 20510"
    const dcRegex = /^(.*?)(?:,?\s+)?(Washington,?\s*\.?\s*D\.?C\.?.*)$/i;
    const dcMatch = cleanAddress.match(dcRegex);

    if (dcMatch) {
      return {
        street: dcMatch[1].trim().replace(/,\s*$/, ''), // Remove trailing comma from street
        cityStateZip: dcMatch[2].trim()
      };
    }

    // Strategy 2: Standard "City, State Zip" pattern
    // Looks for: ", City, ST 12345" at the end
    const cityStateZipRegex = /,\s*([^,]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/;
    const match = cleanAddress.match(cityStateZipRegex);

    if (match) {
      const street = cleanAddress.replace(match[0], '');
      const cityStateZip = `${match[1]}, ${match[2]} ${match[3]}`;
      return { street, cityStateZip };
    }

    return { street: cleanAddress, cityStateZip: '' };
  };

  const renderAddressLines = (address: string) => {
    const { street, cityStateZip } = getFormattedAddressParts(address);
    if (cityStateZip) {
      return (
        <>
          {street}
          <br />
          {cityStateZip}
        </>
      );
    }
    return address;
  };

  const handleCopyLabel = () => {
    const { street, cityStateZip } = getFormattedAddressParts(rep.mailingAddress);
    const addressToCopy = cityStateZip ? `${street}\n${cityStateZip}` : rep.mailingAddress;
    const textToCopy = `${rep.role === 'U.S. Senator' ? 'Honorable' : 'Rep.'} ${rep.name}\n${addressToCopy}`;
    navigator.clipboard.writeText(textToCopy);
    setHasSavedLabel(true);
    alert("Address copied to clipboard!");
  };

  const handleDownloadLabel = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [4, 2] // Standard label size
    });

    // 1. Decorative Border (Civic Blue)
    doc.setDrawColor(0, 46, 109); // #002e6d
    doc.setLineWidth(0.02);
    doc.roundedRect(0.1, 0.1, 3.8, 1.8, 0.1, 0.1, 'S');

    // 2. "To" Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("TO:", 0.3, 0.5);

    // 3. Recipient Name & Address
    doc.setTextColor(0, 0, 0);
    doc.setFont("times", "bold"); // Formal font for recipient
    doc.setFontSize(14);
    doc.text(`${rep.role === 'U.S. Senator' ? 'Honorable' : 'Rep.'} ${rep.name}`, 0.3, 0.75);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    // Force Line Break for PDF
    const { street, cityStateZip } = getFormattedAddressParts(rep.mailingAddress);

    if (cityStateZip) {
      // First line: Street (might wrap if very long, so we split it too just in case)
      const splitStreet = doc.splitTextToSize(street, 3.4);
      doc.text(splitStreet, 0.3, 0.95);

      // Calculate Y position for next line based on street lines
      // const streetHeight = splitStreet.length * 0.2; 

      // Second line: City, State Zip
      // We just hardcode a gap because usually street is 1 line. If 2 lines, it might overlap slightly or we check length.
      // Let's safe-guard the Y:
      const nextY = 0.95 + (splitStreet.length * 0.2);
      doc.text(cityStateZip, 0.3, nextY);
    } else {
      // Fallback standard wrap
      const splitAddress = doc.splitTextToSize(rep.mailingAddress, 3.4);
      doc.text(splitAddress, 0.3, 0.95);
    }

    // 4. Civic Bridge Branding (Bottom Right)
    // Small Icon
    const logoX = 2.8;
    const logoY = 1.6;
    // const s = 0.04; // Scale for icon - Removed custom shape drawing

    // Branding Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(0, 46, 109); // #002e6d
    doc.text("Civic Bridge", logoX + 1.0, logoY + 0.5, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5);
    doc.setTextColor(150, 150, 150);
    doc.text("Sent via civicbridge.com", logoX + 1.0, logoY + 0.65, { align: "right" });

    doc.save(`Mailing_Label_${rep.name.replace(/\s+/g, '_')}.pdf`);
    setHasSavedLabel(true);
  };

  const handleSidebarNavigate = (view: ViewState) => {
    handleNavigationAttempt(() => onNavigate(view));
  };

  const handleNavigationAttempt = (action: () => void) => {
    // Always warn for PDF method if navigating away, regardless of save status
    if (method === 'pdf') {
      setPendingAction(() => action);
      setShowExitWarning(true);
    } else {
      action();
    }
  };

  const confirmExit = () => {
    if (pendingAction) pendingAction();
    setShowExitWarning(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex font-sans">
      {/* Sidebar Wrapper for "Guest Session" look */}
      <Sidebar
        user={sidebarUser}
        currentView="DASHBOARD" // Keep "Dashboard" or similar active to imply app context
        onNavigate={handleSidebarNavigate}
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
                  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 relative z-10 w-full group/card transition-all hover:shadow-md">

                    {/* Actions - Always Visible with Theme Styling */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={handleCopyLabel}
                        className="p-2 text-[#002e6d] bg-blue-50 hover:bg-[#002e6d] hover:text-white rounded-lg transition-all shadow-sm border border-blue-100"
                        title="Copy Address"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={handleDownloadLabel}
                        className="p-2 text-[#cc0000] bg-red-50 hover:bg-[#cc0000] hover:text-white rounded-lg transition-all shadow-sm border border-red-100"
                        title="Download Label PDF"
                      >
                        <Download size={16} />
                      </button>
                    </div>

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
                    onClick={() => handleNavigationAttempt(() => onNavigate('UPGRADE'))}
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
                onClick={() => handleNavigationAttempt(onReturn)}
                className="w-full bg-[#002e6d] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mb-3"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => handleNavigationAttempt(onViewArchive)}
                className="w-full bg-white hover:bg-gray-50 text-gray-600 font-semibold py-3.5 rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2"
              >
                {isGuest ? 'Unlock Archive' : 'View in Archive'}
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Exit Warning Modal */}
      {showExitWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scale-in text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#002e6d]">
              <Printer size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">One Last Check!</h3>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed px-2">
              Did you save your <span className="font-bold text-gray-700">Mailing Label</span> and <span className="font-bold text-gray-700">PDF Letter</span>?
              <br /><br />
              Make sure to save them in a safe place so your representative can get your message!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowExitWarning(false)}
                className="w-full bg-white border-2 border-[#002e6d] text-[#002e6d] font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Back (Save Files)
              </button>
              <button
                onClick={confirmExit}
                className="w-full bg-[#002e6d] text-white font-bold py-3 rounded-xl hover:bg-blue-900 shadow-md transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};