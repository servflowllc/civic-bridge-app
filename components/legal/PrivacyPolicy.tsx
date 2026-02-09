import * as React from 'react';
import { useEffect } from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, Server } from 'lucide-react';
import { ViewState } from '../../types';

interface PrivacyPolicyProps {
  onNavigate: (view: ViewState) => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
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
              <Shield size={24} />
              <span className="font-bold uppercase tracking-widest text-sm">Official Policy</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-500">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
            <p className="text-lg font-medium text-gray-800">
              Civic Bridge ("we," "our," or "us"), a product of <strong>ServFlo LLC</strong>, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our web application.
            </p>

            <div className="bg-blue-50 border-l-4 border-[#002e6d] p-4 my-6 rounded-r-lg">
              <h4 className="text-[#002e6d] font-bold m-0 mb-2">Our Core Privacy Pledge</h4>
              <p className="m-0 text-sm text-blue-900">
                Civic Bridge is a non-partisan platform. <strong>We do not sell, rent, or trade your personal information to political campaigns, PACs, or data brokers.</strong> Your advocacy data belongs to you.
              </p>
            </div>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">1. Information We Collect</h3>

            <h4 className="text-gray-800 font-bold mt-4 mb-2">A. Personal Data</h4>
            <p>
              When you register via Google Authentication, we collect personally identifiable information such as your name, email address, and profile image. If you upgrade to Civic+, payment information is processed securely by Stripe; we do not store your full credit card details on our servers.
            </p>

            <h4 className="text-gray-800 font-bold mt-4 mb-2">B. Location Data</h4>
            <p>
              To function, Civic Bridge requires your residential address. This data is strictly used to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Query <strong>Open Data repositories (e.g., the @unitedstates project)</strong> to identify your specific elected officials.</li>
              <li>Populate formal letterheads for your advocacy documents.</li>
            </ul>
            <p>
              We do not track your real-time movements or GPS location in the background.
            </p>

            <h4 className="text-gray-800 font-bold mt-4 mb-2">C. Advocacy Content</h4>
            <p>
              We store the transcripts of your chats with our AI strategist, **uploaded evidence (photos/documents)**, and the generated letters to provide you with a history of your civic engagement. This content is encrypted at rest.
            </p>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">2. How We Use Artificial Intelligence</h3>
            <p>
              Civic Bridge utilizes Large Language Models (LLMs), specifically Google Gemini, to process your inputs and assist in drafting legislative correspondence.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Processing:</strong> Your chat inputs are sent to the AI provider to generate responses.</li>
              <li><strong>No Training:</strong> We have configured our API usage to request that your personal data is not used to train the underlying public models.</li>
              <li><strong>Accuracy:</strong> While we strive for accuracy, AI models can occasionally produce incorrect information (hallucinations). Always review your drafts before sending.</li>
            </ul>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">3. Disclosure of Your Information</h3>
            <p>
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 not-prose">
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                  <Server size={18} /> Service Providers
                </div>
                <p className="text-xs text-gray-500">We share data with third-party vendors (Google Cloud, Firebase, Stripe) solely to perform hosting, database management, and payment processing services.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                  <Database size={18} /> Legal Requirements
                </div>
                <p className="text-xs text-gray-500">We may disclose information if required to do so by law or in response to valid requests by public authorities.</p>
              </div>
            </div>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">4. Security of Your Information</h3>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. We utilize <strong>AES-256 encryption</strong> for data at rest and standard SSL/TLS encryption for data in transit. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">5. Children's Privacy</h3>
            <p>
              Our application is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information.
            </p>

            <h3 className="text-gray-900 font-bold text-xl mt-8 mb-4">6. Contact Us</h3>
            <p>
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <p className="font-semibold text-gray-900">
              ServFlo LLC<br />
              Legal Compliance Dept.<br />
              Email: servflowllc@gmail.com<br />
              Web: https://servflo.netlify.app/
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};