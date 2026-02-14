import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { loadGoogleMapsScript } from '../../services/googleMapsLoader';
import { ArrowRight, MapPin, ShieldCheck, Scale, Lock, Globe, Landmark, Star, BookOpen, Info, AlertCircle } from 'lucide-react';

interface LandingPageProps {
  onStartGuest: (address: string) => Promise<boolean>;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartGuest, onLogin }) => {
  const [constructedAddress, setConstructedAddress] = useState('');
  const [isValidSelection, setIsValidSelection] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');
  const [apiReady, setApiReady] = useState(false);

  // Ref strictly for the Google Element, separate from React state UI
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const initNewPlacesApi = async (attempts = 3) => {
      try {
        await loadGoogleMapsScript();

        if (!isMounted || !autocompleteContainerRef.current) return;

        console.log("[System] Importing New Places Library...");
        // 2. Import the specific library
        const { PlaceAutocompleteElement } = await (window as any).google.maps.importLibrary("places");

        if (!PlaceAutocompleteElement) {
          throw new Error("PlaceAutocompleteElement not found.");
        }

        // 3. Create Element
        const autocomplete = new PlaceAutocompleteElement({
          includedPrimaryTypes: ['street_address', 'premise'],
          componentRestrictions: { country: 'us' }
        });

        // 4. Manual DOM Manipulation (Safe because React leaves this div empty)
        if (autocompleteContainerRef.current) {
          autocompleteContainerRef.current.innerHTML = ''; // Clear previous
          // Added 'text-gray-900' to ensure text visibility
          autocomplete.classList.add('w-full', 'h-full', 'bg-transparent', 'outline-none', 'text-gray-900');
          autocompleteContainerRef.current.appendChild(autocomplete);
        }

        // 5. Update State
        setApiReady(true);
        setError(''); // Clear any previous errors

        // Listeners
        autocomplete.addEventListener('gmp-select', async (event: any) => {
          const prediction = event.placePrediction;
          if (!prediction) return;

          const place = prediction.toPlace();

          try {
            await place.fetchFields({
              fields: ['formattedAddress', 'addressComponents', 'location']
            });

            const address = place.formattedAddress;
            const components = place.addressComponents;

            const hasStreetNumber = components?.some((c: any) =>
              c.types.includes('street_number')
            );

            if (!hasStreetNumber) {
              setError("Please select a specific address with a street number.");
              setIsValidSelection(false);
              return;
            }

            setConstructedAddress(address);
            setIsValidSelection(true);
            setError('');
            sessionStorage.setItem('civic_user_address', address);

          } catch (err) {
            console.error("Error fetching place details:", err);
            setError("Failed to retrieve address details.");
          }
        });

      } catch (err) {
        console.error(`Initialization Attempt Failed (${attempts} left):`, err);
        if (attempts > 1) {
          setTimeout(() => initNewPlacesApi(attempts - 1), 1500); // Retry after 1.5s
        } else {
          setError("Map services unavailable. Please check your connection.");
        }
      }
    };

    initNewPlacesApi();

    return () => { isMounted = false; };
  }, []);

  const [showStartPrompt, setShowStartPrompt] = useState(false);
  const promptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (apiReady && !constructedAddress && !error) {
      const timer = setTimeout(() => {
        setShowStartPrompt(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [apiReady, constructedAddress, error]);

  const handleDismissPrompt = () => {
    setShowStartPrompt(false);
  };

  // Close prompt if user clicks outside
  useEffect(() => {
    if (showStartPrompt) {
      const handleClickOutside = (event: MouseEvent) => {
        if (promptRef.current && !promptRef.current.contains(event.target as Node)) {
          setShowStartPrompt(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showStartPrompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowStartPrompt(false);

    if (!isValidSelection || !constructedAddress) {
      setError("Please select an address from the dropdown suggestions.");
      return;
    }

    setIsLocating(true);

    // Attempt to start guest session
    try {
      const success = await onStartGuest(constructedAddress);
      if (!success) {
        setError("We could not find representatives for this address. Please try another specific address (include street number and zip).");
        setIsLocating(false);
      } else {
        // Success! The App component will handle navigation.
        // We can keep isLocating true until unmount or navigation.
      }
    } catch (e) {
      console.error("LandingPage Error:", e);
      setError("An unexpected error occurred. Please try again.");
      setIsLocating(false);
    }
  };

  return (
    <div className="bg-[#F5F7FA] font-sans flex flex-col min-h-screen">

      {/* Navigation Bar */}
      <nav className="w-full px-4 md:px-6 py-3 flex items-center justify-between bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center gap-2 md:gap-3 select-none">
          <div className="text-[#cc0000]">
            <Landmark className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold text-[#002e6d] tracking-tight leading-none">Civic Bridge</span>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide">Citizen Advocacy</span>
          </div>
        </div>
        <button
          onClick={onLogin}
          className="text-xs md:text-sm font-bold text-[#002e6d] hover:bg-blue-50 px-3 md:px-5 py-2 md:py-2.5 rounded-lg transition-colors border border-transparent hover:border-blue-100"
        >
          Member Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center pt-16 md:pt-24 pb-12 md:pb-20 px-4 md:px-6 relative overflow-hidden">

        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] md:w-[1200px] h-[600px] md:h-[800px] bg-gradient-to-b from-blue-50/80 to-transparent rounded-[100%] blur-3xl -z-10 opacity-60"></div>

        <div className="max-w-4xl w-full text-center relative z-10 animate-fade-in-up">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 bg-white border border-blue-100 rounded-full shadow-sm mb-6 md:mb-8">
            <Star size={10} className="text-[#cc0000]" fill="currentColor" />
            <span className="text-[10px] md:text-xs font-bold text-[#002e6d] tracking-wide uppercase">Discovery • Education • Action</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#0f172a] tracking-tight mb-4 md:mb-6 leading-tight">
            A Bridge Between You <br />
            <span className="text-[#002e6d]">and Your Representative.</span>
          </h1>

          {/* Subheadings */}
          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 mb-8 md:mb-10 px-2">
            <p className="text-base md:text-xl text-gray-700 leading-relaxed font-medium">
              We combine civic discovery with education, leveraging <span className="font-bold text-[#002e6d]">artificial intelligence</span> to help you understand the process and articulate your lived reality to those in power.
            </p>

            <p className="text-sm md:text-md text-gray-500 leading-relaxed">
              Civic Bridge is a neutral, non-partisan platform designed to help you understand your government and effectively make your voice heard. <span className="font-semibold text-gray-900">No account required to start.</span>
            </p>
          </div>

          {/* Explainer Box */}
          <div className="max-w-2xl mx-auto mb-8 md:mb-10 px-2">
            <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-blue-100 text-left flex flex-col md:flex-row gap-4 md:gap-5 shadow-lg shadow-blue-50">
              <div className="shrink-0 mt-1 flex md:block">
                <div className="w-10 h-10 bg-blue-50 text-[#002e6d] rounded-full flex items-center justify-center border border-blue-100">
                  <Info size={20} />
                </div>
                <h3 className="md:hidden ml-3 mt-2 text-sm font-bold text-[#002e6d] uppercase tracking-wide">What happens next?</h3>
              </div>
              <div>
                <h3 className="hidden md:block text-sm font-bold text-[#002e6d] uppercase tracking-wide mb-2">What happens when I enter my address?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We securely match your location to your specific <strong>Local, State, and Federal officials</strong> using government data. You will instantly see who represents you and can begin a guided session to draft professional advocacy letters to them.
                </p>
              </div>
            </div>
          </div>

          {/* Address Input Card */}
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-left mb-2 ml-1 flex items-center gap-2 relative">
              <span className="w-2 h-2 rounded-full bg-[#cc0000]"></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 1: Identify your District</span>

              {/* Start Here Prompt */}
              {showStartPrompt && (
                <div ref={promptRef} className="absolute left-0 bottom-full mb-3 z-40 animate-bounce-slow">
                  <div className="bg-[#002e6d] text-white px-4 py-3 rounded-xl shadow-xl flex items-start gap-3 w-[280px] md:w-[320px] relative">
                    <div className="absolute -bottom-2 left-6 w-4 h-4 bg-[#002e6d] rotate-45 transform origin-center"></div>
                    <div className="mt-0.5 shrink-0">
                      <MapPin size={16} className="text-blue-200" />
                    </div>
                    <div>
                      <p className="text-sm font-bold mb-1">Start here!</p>
                      <p className="text-xs text-blue-100 leading-snug">
                        Start typing your address to find your district representatives and get started.
                      </p>
                    </div>
                    <button
                      onClick={handleDismissPrompt}
                      className="text-blue-300 hover:text-white shrink-0 -mt-1 -mr-2 p-1"
                    >
                      <span className="sr-only">Dismiss</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="relative group z-30">
              {/* Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500 ${error ? 'from-red-300 to-orange-300' : 'from-blue-200 to-gray-200'}`}></div>

              {/* Container */}
              <div className={`relative bg-white rounded-2xl p-2 shadow-xl border flex flex-col sm:flex-row items-center gap-2 transition-colors ${error ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'}`}>

                {/* Left Side: Icon + Autocomplete Container */}
                <div className={`w-full flex-1 flex items-center bg-white rounded-xl px-4 h-14 border transition-all min-w-0 ${apiReady ? 'border-green-200 ring-1 ring-green-100' : 'border-transparent'}`}>
                  <MapPin className="text-gray-400 shrink-0 mr-3" size={20} />

                  <div className="flex-1 h-full relative min-w-0">
                    {/* 
                              CRITICAL FIX: 
                              Separate "Loading..." text from the container Ref.
                              The Ref div is purely for Google Maps to mutate.
                              React manages the "Loading" overlay separately.
                          */}
                    {!apiReady && (
                      <div className="absolute inset-0 flex items-center text-gray-400 pointer-events-none z-0">
                        Loading secure address search...
                      </div>
                    )}

                    <div ref={autocompleteContainerRef} className="w-full h-full relative z-10">
                      {/* Google Maps Element injects here */}
                    </div>
                  </div>
                </div>

                {/* Right Side: Button */}
                <button
                  type="submit"
                  disabled={isLocating || !isValidSelection}
                  className={`shrink-0 w-auto px-8 h-14 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap
                        ${isValidSelection && !isLocating
                      ? 'bg-[#cc0000] hover:bg-red-700 text-white cursor-pointer'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-70'
                    }
                      `}
                >
                  {isLocating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
                      <span>Locating...</span>
                    </>
                  ) : (
                    <>
                      Find Reps <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="absolute top-full left-0 w-full mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 animate-scale-in z-20 shadow-sm">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                  <span className="text-xs text-red-700 font-semibold text-left">{error}</span>
                </div>
              )}
            </form>
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-xs text-gray-400 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-green-600" />
              <span>Official Gov Data</span>
            </div>
            <div className="hidden md:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-1.5">
              <Lock size={14} className="text-gray-400" />
              <span>AES-256 Privacy</span>
            </div>
          </div>

        </div>
      </div>

      {/* Value Props / Info Graphics */}
      <div className="bg-white border-t border-gray-100 py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 group hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-[#002e6d] mb-4 md:mb-6 shadow-sm group-hover:bg-[#002e6d] group-hover:text-white transition-colors">
                <Globe size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Discovery</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Instantly identify who represents you at the Local, State, and Federal levels using official government data.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 group hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-[#cc0000] mb-4 md:mb-6 shadow-sm group-hover:bg-[#cc0000] group-hover:text-white transition-colors">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Education</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Learn how the legislative process works while our AI Strategist interviews you to understand your specific issue.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 group hover:border-blue-200 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 mb-4 md:mb-6 shadow-sm group-hover:bg-gray-900 group-hover:text-white transition-colors">
                <Scale size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Advocacy</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Translate your concerns into professional, constitutionally grounded correspondence ready for delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};