import React from 'react';
import { Landmark } from 'lucide-react';
import { ViewState } from '../../types';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto z-10 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          
          {/* Left Side: Brand & Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left">
             <div className="flex items-center gap-2 opacity-90 group cursor-default">
                <Landmark className="w-5 h-5 text-[#cc0000]" />
                <span className="font-bold text-sm text-[#002e6d]">Civic Bridge</span>
             </div>
             
             <span className="hidden md:block w-px h-4 bg-gray-300"></span>
             
             <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-xs text-gray-400">
                <span>Non-Partisan. Empowering Citizens.</span>
                <span className="hidden md:inline">•</span>
                <span>&copy; {year} Created by <a href="https://servflo.netlify.app/" target="_blank" rel="noreferrer" className="hover:text-[#002e6d] transition-colors">ServFlo LLC</a>.</span>
             </div>
          </div>

          {/* Right Side: Links */}
          <div className="flex items-center gap-6 text-xs font-semibold text-gray-500">
            <button onClick={() => onNavigate('PRIVACY')} className="hover:text-[#002e6d] transition-colors">
              Privacy
            </button>
            <button onClick={() => onNavigate('TERMS')} className="hover:text-[#002e6d] transition-colors">
              Terms
            </button>
            <button onClick={() => onNavigate('ACCESSIBILITY')} className="hover:text-[#002e6d] transition-colors">
              Accessibility
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};