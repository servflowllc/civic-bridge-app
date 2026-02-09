import React, { useState } from 'react';
import { UserProfile, ViewState } from '../../types';
import { Sidebar } from '../common/Sidebar';
import { ShieldCheck, MapPin, Send, Bell, Lock, Download, Crown, Check, LogOut } from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  onNavigate: (view: ViewState) => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onNavigate, onUpdateUser, onLogout }) => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Mock handlers to demonstrate UI interaction
  const handleToggle = () => setUnsavedChanges(true);
  
  const handleUpgrade = () => {
      // Navigate to the new Upgrade view
      onNavigate('UPGRADE');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex font-sans">
      <Sidebar user={user} currentView="SETTINGS" onNavigate={onNavigate} />

      {/* Mobile Sidebar Placeholder */}
      <div className="w-64 hidden md:block shrink-0"></div>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full pb-24">
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Settings & Profile</h2>
          <p className="text-gray-500 mt-1">Manage your voter identity, privacy, and preferences.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Profile & Stats */}
          <div className="space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative overflow-hidden">
               <div className="flex items-start gap-4 relative z-10">
                  <div className="relative">
                    <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border-4 border-gray-50" />
                    {user.isVerified && (
                        <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full border-2 border-white">
                            <Check size={12} strokeWidth={4} />
                        </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                    {user.isVerified && (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1">
                            <ShieldCheck size={10} /> Voter-Validated
                        </span>
                    )}
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} /> {user.address ? 'Washington, D.C.' : 'Location not set'}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">Member since 2023</p>
                  </div>
               </div>

               {/* Watermark */}
               <div className="absolute -top-6 -right-6 text-gray-50 opacity-50">
                   <ShieldCheck size={140} />
               </div>

               <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                   <button className="w-full py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                       <MapPin size={16} /> Update Registration
                   </button>
                   <button 
                     onClick={onLogout}
                     className="w-full py-2 border border-gray-200 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-100 flex items-center justify-center gap-2 transition-colors"
                   >
                       <LogOut size={16} /> Sign Out
                   </button>
               </div>
            </div>

            {/* MEMBERSHIP PLAN CARD (PRO LOGIC) */}
            <div className={`rounded-2xl p-6 shadow-sm border relative overflow-hidden transition-all ${user.isPro ? 'bg-[#002e6d] border-[#002e6d] text-white' : 'bg-white border-gray-200'}`}>
                {user.isPro && (
                    <div className="absolute top-0 right-0 bg-white/10 p-4 rounded-bl-3xl">
                        <Crown className="text-yellow-400" size={24} fill="currentColor" />
                    </div>
                )}
                
                <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${user.isPro ? 'text-blue-200' : 'text-gray-400'}`}>Membership Plan</h3>
                
                <div className="mb-6">
                    <h4 className={`text-2xl font-bold ${user.isPro ? 'text-white' : 'text-gray-900'}`}>
                        {user.isPro ? 'Civic+ Pro' : 'Free Citizen'}
                    </h4>
                    <p className={`text-sm mt-1 ${user.isPro ? 'text-blue-100' : 'text-gray-500'}`}>
                        {user.isPro 
                            ? 'You have full access to chat history and document archives.' 
                            : 'Basic access to AI drafting and legislative tracking.'}
                    </p>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                         <div className={`p-1 rounded-full ${user.isPro ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'}`}>
                             <Check size={10} strokeWidth={4} />
                         </div>
                         <span className={`text-sm ${user.isPro ? 'text-white' : 'text-gray-600'}`}>Unlimited AI Drafts</span>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className={`p-1 rounded-full ${user.isPro ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                             {user.isPro ? <Check size={10} strokeWidth={4} /> : <Lock size={10} />}
                         </div>
                         <span className={`text-sm ${user.isPro ? 'text-white' : 'text-gray-400'}`}>Unlock Chat History</span>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className={`p-1 rounded-full ${user.isPro ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                             {user.isPro ? <Check size={10} strokeWidth={4} /> : <Lock size={10} />}
                         </div>
                         <span className={`text-sm ${user.isPro ? 'text-white' : 'text-gray-400'}`}>Download PDF Archive</span>
                    </div>
                </div>

                <button 
                    onClick={handleUpgrade}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                        user.isPro 
                        ? 'bg-white/10 text-white hover:bg-white/20' 
                        : 'bg-gradient-to-r from-[#002e6d] to-blue-600 text-white hover:shadow-lg'
                    }`}
                >
                    {user.isPro ? 'Manage Subscription' : 'Upgrade to Civic+'}
                </button>
            </div>

            {/* Civic Footprint - Removed Bill Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-sm font-bold text-[#002e6d] uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-1 h-4 bg-[#002e6d] rounded-full"></div>
                    Civic Footprint
                </h3>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <Send size={24} />
                        </div>
                        <div>
                            <span className="text-3xl font-bold text-gray-900 block">42</span>
                            <span className="text-xs text-gray-500 uppercase font-semibold">Letters Sent</span>
                        </div>
                    </div>
                </div>
                
                <p className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
                    Your impact on local and national legislation this session.
                </p>
            </div>

          </div>

          {/* Right Column: Settings Groups */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Notifications - Removed Bill Alerts */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
               <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                   <Bell size={20} className="text-[#002e6d]" />
                   Notification Preferences
               </h3>
               <p className="text-sm text-gray-500 mb-6">Manage how you receive updates.</p>

               <div className="space-y-6">
                   <ToggleRow 
                      label="Weekly Digest" 
                      description="Summary of your activity" 
                      defaultChecked={true} 
                      onChange={handleToggle}
                   />
                   <div className="h-px bg-gray-100"></div>
                   <ToggleRow 
                      label="Legislator Replies" 
                      description="Notify me when a rep responds" 
                      defaultChecked={true}
                      onChange={handleToggle}
                   />
               </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
               <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                   <Lock size={20} className="text-[#002e6d]" />
                   Privacy & Security
               </h3>
               <p className="text-sm text-gray-500 mb-6">Manage passwords and 2FA.</p>

               <div className="space-y-6">
                   <div className="flex items-center justify-between">
                       <div>
                           <h4 className="font-semibold text-gray-900">Password</h4>
                           <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                       </div>
                       <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">Edit</button>
                   </div>
                   
                   <div className="h-px bg-gray-100"></div>
                   
                   <ToggleRow 
                      label="Two-Factor Authentication" 
                      description="Secure your account with 2FA" 
                      defaultChecked={true}
                      onChange={handleToggle}
                   />
                   
                   <div className="mt-6">
                       <button className="w-full py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                           View Active Sessions
                       </button>
                   </div>
               </div>
            </div>

            {/* Data & Deactivation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
                     <div>
                         <h4 className="font-semibold text-gray-900 text-sm">Data Privacy</h4>
                         <p className="text-[10px] text-gray-500 max-w-[150px]">Download your voting history and platform data.</p>
                     </div>
                     <button className="text-gray-400 hover:text-[#002e6d]">
                         <Download size={20} />
                     </button>
                 </div>

                 <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center justify-between">
                     <div>
                         <h4 className="font-semibold text-gray-900 text-sm">Deactivate Account</h4>
                         <p className="text-[10px] text-gray-500">Temporarily disable your account.</p>
                     </div>
                     <button className="text-red-500 hover:text-red-700 text-sm font-semibold">
                         Deactivate
                     </button>
                 </div>
            </div>

          </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      {unsavedChanges && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-2xl border border-gray-100 flex items-center gap-6 animate-fade-in-up z-50">
              <span className="text-sm font-medium text-gray-600">Unsaved changes</span>
              <div className="flex gap-2">
                  <button 
                    onClick={() => setUnsavedChanges(false)}
                    className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                      Cancel
                  </button>
                  <button 
                    onClick={() => setUnsavedChanges(false)}
                    className="px-4 py-2 text-sm font-bold text-white bg-[#cc0000] hover:bg-red-700 rounded-lg shadow-md transition-colors"
                  >
                      Save Changes
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

const ToggleRow: React.FC<{ label: string; description: string; defaultChecked: boolean; onChange: () => void }> = ({ label, description, defaultChecked, onChange }) => {
    const [checked, setChecked] = useState(defaultChecked);
    
    const handleChange = () => {
        setChecked(!checked);
        onChange();
    };

    return (
        <div className="flex items-center justify-between">
            <div>
                <h4 className="font-semibold text-gray-900 text-sm">{label}</h4>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <button 
                onClick={handleChange}
                className={`w-12 h-7 rounded-full transition-colors relative ${checked ? 'bg-[#002e6d]' : 'bg-gray-200'}`}
            >
                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
            </button>
        </div>
    );
};