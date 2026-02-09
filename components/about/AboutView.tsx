import * as React from 'react';
import { ViewState } from '../../types';
import { ShieldCheck, Scale, Lock, Globe } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (view: ViewState) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-6 animate-fade-in-up">
      <div className="max-w-5xl mx-auto">

        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-[#002e6d] text-sm font-bold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Democracy 2.0 is Here
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#002e6d] tracking-tight mb-6">
            Bridging the Gap Between <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cc0000] to-red-600">Citizens & Government</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Civic Bridge is the first neutral, non-partisan platform designed to amplify constituent voices through verified, impactful communication channels.
          </p>
        </div>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <ValueCard
            icon={<Scale className="text-white" size={24} />}
            title="Radical Neutrality"
            description="We provide the tools, not the opinions. Our AI strategists are constitutionally grounded and bias-checked to ensure your voice is the only one that matters."
            color="bg-[#002e6d]"
          />
          <ValueCard
            icon={<ShieldCheck className="text-white" size={24} />}
            title="Voter Verified"
            description="Legislators ignore bots. They listen to constituents. Our identity verification ensures your message lands in the 'Verified Constituent' inbox, not spam."
            color="bg-[#cc0000]"
          />
          <ValueCard
            icon={<Lock className="text-white" size={24} />}
            title="Privacy First"
            description="Your political views are personal. We use AES-256 encryption and never sell your advocacy data to third-party campaigners or PACs."
            color="bg-gray-900"
          />
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-200 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How Civic Bridge Works</h2>
            <p className="text-gray-500 mt-2">From frustration to legislation in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10 transform scale-x-75"></div>

            <Step
              number="01"
              title="Verify Identity"
              desc="Confirm your district using voter registration data to unlock your specific representatives."
            />
            <Step
              number="02"
              title="Draft Strategy"
              desc="Chat with our AI Legislative Aide to compose professional, constitutionally-sound correspondence."
            />
            <Step
              number="03"
              title="Make Impact"
              desc="Deliver via official webforms or physical mail. Track your 'Civic Impact Score' over time."
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-[#002e6d] to-blue-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <Globe size={400} className="-translate-x-1/2 -translate-y-1/2" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Ready to make your voice heard?</h2>
            <button
              onClick={() => onNavigate('DASHBOARD')}
              className="bg-white text-[#002e6d] font-bold py-4 px-10 rounded-xl hover:bg-gray-50 transition-transform hover:scale-105 shadow-lg"
            >
              Start Advocating Now
            </button>
            <p className="mt-6 text-sm text-blue-200 opacity-80">
              Join 10,000+ citizens actively shaping their communities today.
            </p>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-20 mb-20 text-center">
          <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-4">Data Sources & Acknowledgements</p>
          <div className="inline-flex flex-col items-center gap-2 text-gray-500 text-sm max-w-2xl mx-auto">
            <p>
              Legislative data provided by the <a href="https://github.com/unitedstates/congress-legislators" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">@unitedstates</a> project (Public Domain).
            </p>
            <p>
              Representative images via <a href="https://theunitedstates.io/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">theunitedstates.io</a>.
            </p>
            <p>
              Location services powered by Google Maps Platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ValueCard: React.FC<{ icon: React.ReactNode, title: string, description: string, color: string }> = ({ icon, title, description, color }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mb-6 shadow-md`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm">
      {description}
    </p>
  </div>
);

const Step: React.FC<{ number: string, title: string, desc: string }> = ({ number, title, desc }) => (
  <div className="flex flex-col items-center text-center bg-white">
    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm text-2xl font-bold text-gray-300">
      {number}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
      {desc}
    </p>
  </div>
);