import React, { useState } from 'react';
import { Map, ArrowRight, MapPin, Navigation, Landmark } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (address: string) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => Math.max(1, prev - 1));

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    setIsVerifying(true);
    setTimeout(() => {
      onComplete(address);
    }, 1500);
  };

  const handleGPS = () => {
    setIsVerifying(true);
    // Simulating a secure GPS lookup for the demo to avoid intrusive browser permission prompts
    // This ensures the user isn't stuck and the flow feels native
    setTimeout(() => {
      setIsVerifying(false);
      onComplete("1600 Pennsylvania Avenue NW, Washington, DC");
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-scale-in">
      <div className="bg-white w-full max-w-[500px] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col">
        
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="flex flex-col h-full animate-fade-in-up">
            {/* Header Branding */}
            <div className="h-48 bg-white flex flex-col items-center justify-center border-b border-gray-100 relative overflow-hidden">
               {/* Background Decorative Element */}
               <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#002e6d] via-white to-[#cc0000]"></div>
               <div className="absolute -right-10 -top-10 text-gray-50 opacity-20">
                  <Landmark size={150} />
               </div>

               <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#cc0000] mb-3 shadow-sm border border-red-100">
                      <Landmark size={32} strokeWidth={2.5} />
                  </div>
                  <div className="text-center">
                      <h1 className="text-2xl font-bold text-[#002e6d] tracking-tight leading-none mb-1">Civic Bridge</h1>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Citizen Advocacy Platform</p>
                  </div>
               </div>
            </div>
            
            <div className="p-8 text-center flex flex-col items-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, Citizen.</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-sm">
                Civic Bridge is built on the principle of <span className="font-semibold text-[#cc0000]">&quot;One Citizen, One Voice.&quot;</span> We provide a neutral platform for you to track legislation, find your representatives, and make your voice heard effectively.
              </p>

              {/* Pagination Dots */}
              <div className="flex gap-2 mb-8">
                <div className="w-8 h-1.5 bg-[#cc0000] rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
              </div>

              <button 
                onClick={handleNext}
                className="w-full bg-[#cc0000] hover:bg-red-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
              >
                Next: Set Location <ArrowRight size={18} />
              </button>
              
              <button className="mt-4 text-xs text-gray-400 hover:text-gray-600">
                Skip Intro
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="flex flex-col h-full animate-fade-in-up">
            <div className="p-10 pb-0 flex justify-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                 <Map size={40} strokeWidth={1.5} />
              </div>
            </div>

            <div className="px-8 text-center">
               <h2 className="text-2xl font-bold text-gray-900 mb-3">Find Your Representatives</h2>
               <p className="text-gray-600 text-sm leading-relaxed mb-8">
                 We need your location to connect you with the specific legislators who represent your district.
               </p>

               <button 
                 onClick={handleGPS}
                 disabled={isVerifying}
                 className="w-full bg-[#0f172a] hover:bg-[#1e293b] disabled:opacity-70 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 mb-6"
               >
                 {isVerifying ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                 ) : (
                   <Navigation size={18} />
                 )}
                 {isVerifying ? 'Locating...' : 'Use My GPS'}
               </button>

               <div className="relative flex items-center justify-center mb-6">
                 <div className="absolute w-full h-px bg-gray-200"></div>
                 <span className="bg-white px-3 text-xs font-semibold text-gray-400 uppercase tracking-widest relative z-10">OR</span>
               </div>

               <form onSubmit={handleLocationSubmit} className="space-y-4">
                 <div className="text-left">
                   <label className="text-xs font-bold text-gray-900 ml-1 mb-1.5 block">Manual Entry</label>
                   <input 
                     type="text"
                     value={address}
                     onChange={(e) => setAddress(e.target.value)}
                     placeholder="Zip Code or Residential Address"
                     className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent"
                     disabled={isVerifying}
                   />
                 </div>
                 
                 <button 
                    type="submit"
                    disabled={isVerifying || !address}
                    className="w-full bg-[#cc0000] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-red-100"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Location'}
                  </button>
               </form>
            </div>

            <div className="p-8 mt-auto flex flex-col items-center">
               {/* Pagination Dots */}
               <div className="flex gap-2 mb-6">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                <div className="w-8 h-1.5 bg-[#cc0000] rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
              </div>
              
              <button onClick={handleBack} disabled={isVerifying} className="text-sm text-gray-500 hover:text-gray-800 disabled:opacity-50">
                Back
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};