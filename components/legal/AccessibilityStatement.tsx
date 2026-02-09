import React, { useEffect } from 'react';
import { ArrowLeft, Accessibility, CheckCircle, Keyboard, Eye, MessageSquare, Monitor } from 'lucide-react';
import { ViewState } from '../../types';

interface AccessibilityStatementProps {
  onNavigate: (view: ViewState) => void;
}

export const AccessibilityStatement: React.FC<AccessibilityStatementProps> = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button 
            onClick={() => onNavigate('LANDING')}
            className="p-2 -ml-2 text-gray-500 hover:text-[#002e6d] hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Legal Center</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          
          <div className="border-b border-gray-100 pb-8 mb-8">
            <div className="flex items-center gap-2 text-[#002e6d] mb-4">
              <Accessibility size={24} />
              <span className="font-bold uppercase tracking-widest text-sm">Digital Inclusion</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Accessibility Statement</h1>
            <p className="text-gray-500">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
            <p className="text-lg font-medium text-gray-800">
              ServFlo LLC is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to the <strong>Civic Bridge</strong> platform.
            </p>
            
            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">Conformance Status</h3>
            <p>
              The <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Web Content Accessibility Guidelines (WCAG)</a> defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
            </p>
            <p>
              Civic Bridge is <strong>partially conformant</strong> with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not yet fully conform to the accessibility standard, though we are actively working to resolve these gaps.
            </p>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">Accessibility Features</h3>
            <p>We have implemented the following measures to ensure accessibility:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="bg-blue-100 text-[#002e6d] p-2 rounded-lg shrink-0">
                        <Keyboard size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">Keyboard Navigation</h4>
                        <p className="text-xs text-gray-500 mt-1">Our interface is navigable using standard keyboard inputs (Tab, Enter, Space) without requiring a mouse.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="bg-blue-100 text-[#002e6d] p-2 rounded-lg shrink-0">
                        <Eye size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">Visual Contrast</h4>
                        <p className="text-xs text-gray-500 mt-1">We adhere to a high-contrast color palette (Blue/Red/White) to ensure text is readable for users with low vision.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="bg-blue-100 text-[#002e6d] p-2 rounded-lg shrink-0">
                        <Monitor size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">Responsive Design</h4>
                        <p className="text-xs text-gray-500 mt-1">The application scales fluidly up to 200% zoom without loss of functionality or layout breaking.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="bg-blue-100 text-[#002e6d] p-2 rounded-lg shrink-0">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">Screen Readers</h4>
                        <p className="text-xs text-gray-500 mt-1">We utilize semantic HTML5 and ARIA labels to ensure compatibility with assistive technologies like NVDA and VoiceOver.</p>
                    </div>
                </div>
            </div>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">Technical Specifications</h3>
            <p>
              Accessibility of Civic Bridge relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>HTML5</li>
              <li>WAI-ARIA</li>
              <li>CSS</li>
              <li>JavaScript</li>
            </ul>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">Feedback & Contact</h3>
            <p>
              We welcome your feedback on the accessibility of Civic Bridge. Please let us know if you encounter accessibility barriers on our platform:
            </p>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-6">
                <p className="font-bold text-[#002e6d] mb-2">ServFlo LLC Accessibility Team</p>
                <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Email:</span> <a href="mailto:servflowllc@gmail.com" className="text-blue-600 hover:underline">servflowllc@gmail.com</a>
                </p>
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Web:</span> <a href="https://servflo.netlify.app/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">https://servflo.netlify.app/</a>
                </p>
                <p className="text-xs text-gray-500 mt-4">
                    We try to respond to feedback within 2 business days.
                </p>
            </div>
            
            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">Assessment Approach</h3>
            <p>
              ServFlo LLC assessed the accessibility of Civic Bridge by the following approaches:
            </p>
            <ul className="list-disc pl-5 space-y-1">
                <li>Self-evaluation using automated testing tools (Lighthouse).</li>
                <li>Manual audit of keyboard navigation paths.</li>
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
};