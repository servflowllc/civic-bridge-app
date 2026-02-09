import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ArrowRight } from 'lucide-react';

interface AddressInputProps {
  onComplete: (address: string) => void;
}

export const AddressInput: React.FC<AddressInputProps> = ({ onComplete }) => {
  const [constructedAddress, setConstructedAddress] = useState('');
  const [isValidSelection, setIsValidSelection] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [error, setError] = useState('');
  
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const initNewPlacesApi = async () => {
        const waitForGlobal = () => new Promise<void>((resolve) => {
            if ((window as any).google && (window as any).google.maps) return resolve();
            const i = setInterval(() => {
                if ((window as any).google && (window as any).google.maps) {
                    clearInterval(i);
                    resolve();
                }
            }, 100);
        });

        await waitForGlobal();
        if (!isMounted || !autocompleteContainerRef.current) return;

        try {
            console.log("[Onboarding] Importing New Places Library...");
            const { PlaceAutocompleteElement } = await (window as any).google.maps.importLibrary("places");

            if (!PlaceAutocompleteElement) return;

            console.log("[Onboarding] Creating Element...");
            const autocomplete = new PlaceAutocompleteElement({
                includedPrimaryTypes: ['street_address', 'premise'], 
                componentRestrictions: { country: 'us' }
            });

            if (autocompleteContainerRef.current) {
                autocompleteContainerRef.current.innerHTML = '';
                // Added 'text-gray-900' to ensure visibility
                autocomplete.classList.add('w-full', 'h-full', 'bg-transparent', 'outline-none', 'text-gray-900');
                autocompleteContainerRef.current.appendChild(autocomplete);
            }

            setApiReady(true);

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
                        setError("Please include a street number.");
                        setIsValidSelection(false);
                        return;
                    }

                    setConstructedAddress(address);
                    setIsValidSelection(true);
                    setError('');
                    sessionStorage.setItem('civic_user_address', address);

                } catch (err) {
                    console.error("[Onboarding] Error details:", err);
                    setError("Failed to fetch address details.");
                }
            });

        } catch (err) {
            console.error("[Onboarding] Init Error:", err);
        }
    };

    initNewPlacesApi();

    return () => { isMounted = false; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidSelection || !constructedAddress) {
        setError("Please select a valid address.");
        return;
    }
    
    setIsVerifying(true);
    setTimeout(() => {
      onComplete(constructedAddress);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-32 px-4 bg-gray-50">
      <div className="w-full max-w-2xl text-center mb-10">
        <h2 className="text-3xl font-bold text-[#002e6d] mb-4">Confirm Your District</h2>
        <p className="text-gray-600">Enter your registered voting address to match you with your representatives.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Registered Address</label>
        
        <div className={`relative flex items-center mb-6 border rounded-xl bg-white p-1 transition-all ${error ? 'border-red-300 ring-2 ring-red-100' : apiReady ? 'border-green-200 ring-2 ring-green-100' : 'border-gray-200'}`}>
          <MapPin className="text-gray-400 ml-3 mr-2 shrink-0 z-20 relative" size={20} />
          <div className="flex-1 h-12 relative z-10">
              {/* Separate Loading State */}
              {!apiReady && (
                <div className="absolute inset-0 flex items-center text-gray-400 px-2 z-0 pointer-events-none">
                    Loading search...
                </div>
              )}
              {/* Separate Google Container */}
              <div ref={autocompleteContainerRef} className="w-full h-full relative z-10"></div>
          </div>
        </div>
        
        {error && (
            <p className="text-xs text-red-600 font-bold mb-4 -mt-4 pl-1">{error}</p>
        )}

        <button
          type="submit"
          disabled={isVerifying || !isValidSelection}
          className={`w-full font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all 
            ${isValidSelection && !isVerifying 
                ? 'bg-[#cc0000] hover:bg-red-700 text-white shadow-red-100' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {isVerifying ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
              <span>Verifying Registry...</span>
            </>
          ) : (
            <>
              <span>Find My Representatives</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 flex gap-4 text-xs text-gray-400">
        <span>Powered by Google Civic Information API</span>
        <span>•</span>
        <span>AES-256 Encrypted</span>
      </div>
    </div>
  );
};