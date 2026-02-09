import * as React from 'react';
import { useEffect } from 'react';
import { ArrowLeft, Scale, AlertTriangle, FileText, Gavel, UserCheck, Mic, ShieldAlert } from 'lucide-react';
import { ViewState } from '../../types';

interface TermsOfServiceProps {
  onNavigate: (view: ViewState) => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onNavigate }) => {
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
              <Scale size={24} />
              <span className="font-bold uppercase tracking-widest text-sm">Legal Agreement</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-500">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
            <p className="text-lg font-medium text-gray-800">
              Welcome to Civic Bridge. By accessing or using our web application, you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6 rounded-r-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-amber-600" size={20} />
                <h4 className="text-amber-800 font-bold m-0">Critical Disclaimer: AI Usage</h4>
              </div>
              <p className="m-0 text-sm text-amber-900">
                Civic Bridge uses Artificial Intelligence to assist in drafting correspondence. <strong>You are the final editor.</strong> You are solely responsible for the content you send to government officials. We do not guarantee that your letters will result in specific legislative outcomes.
              </p>
            </div>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">1. Use of Service</h3>

            <h4 className="text-gray-800 font-bold mt-4 mb-2">A. Eligibility</h4>
            <p>
              You must be at least 13 years old to use this Service. By using Civic Bridge, you represent and warrant that you have the right, authority, and capacity to enter into this agreement.
            </p>

            <h4 className="text-gray-800 font-bold mt-4 mb-2">B. Account Security</h4>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials (Google Auth) and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use.
            </p>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">2. User Conduct & Prohibited Content</h3>
            <p>
              Civic Bridge is a tool for constructive civic engagement. We strictly prohibit the use of our platform for:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Threats:</strong> Sending violent threats, harassment, or hate speech to public officials or staff.</li>
              <li><strong>Impersonation:</strong> Pretending to be another person or entity in your correspondence.</li>
              <li><strong>Spam:</strong> Automated, bulk, or repetitive messaging that disrupts government communication channels.</li>
              <li><strong>Illegal Acts:</strong> Promoting illegal activities or violating local, state, or federal laws.</li>
            </ul>
            <p>
              <strong>We reserve the right to ban any user</strong> who violates these conduct rules and, if necessary, report severe violations (such as threats of violence) to appropriate authorities.
            </p>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">3. Intellectual Property</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 not-prose">
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                  <Gavel size={18} /> Our Rights
                </div>
                <p className="text-xs text-gray-500">The code, design, logos, and AI prompting strategies of Civic Bridge are owned by ServFlo LLC and are protected by copyright and trademark laws.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                  <FileText size={18} /> Your Content
                </div>
                <p className="text-xs text-gray-500">You retain ownership of the letters, images, and documents you upload or generate. You grant us a license to process specific files to provide the AI analysis and PDF generation features.</p>
              </div>
            </div>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">4. Civic+ Subscriptions</h3>
            <p>
              If you purchase a Civic+ subscription:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Billing:</strong> Fees are billed in advance on a recurring basis (monthly or annually).</li>
              <li><strong>Cancellation:</strong> You may cancel at any time. Your access will continue until the end of the current billing period.</li>
              <li><strong>Refunds:</strong> Payments are generally non-refundable, except as required by law.</li>
            </ul>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">5. Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, ServFlo LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or goodwill, arising out of your use of the Service.
            </p>
            <p>
              We act solely as a communication conduit. We are not responsible for the actions, inactions, or responses of any government official or agency.
            </p>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">6. Changes to Terms</h3>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service constitutes acceptance of the new Terms.
            </p>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">7. Contact</h3>
            <p>
              For legal inquiries regarding these Terms, please contact:
            </p>
            <p className="font-semibold text-gray-900">
              ServFlo LLC<br />
              Attn: Legal Department<br />
              Email: servflowllc@gmail.com<br />
              Web: https://servflo.netlify.app/
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};