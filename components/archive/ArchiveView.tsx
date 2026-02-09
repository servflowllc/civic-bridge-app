import React from 'react';
import { UserProfile, ActivityLog, ArchivedDocument, ViewState } from '../../types';
import { Sidebar } from '../common/Sidebar';
import { Plus, FileText, Download, Lock, Crown, Archive } from 'lucide-react';

interface ArchiveViewProps {
  user: UserProfile;
  logs: ActivityLog[];
  documents: ArchivedDocument[];
  onNavigate: (view: ViewState) => void;
}

export const ArchiveView: React.FC<ArchiveViewProps> = ({ user, logs, documents, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex font-sans">
      
      <Sidebar user={user} currentView="ARCHIVE" onNavigate={onNavigate} />

      {/* Mobile Sidebar Placeholder */}
      <div className="w-64 hidden md:block shrink-0"></div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Civic Archive</h2>
            <p className="text-gray-500 mt-1">Track your legislative impact history.</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => onNavigate('DASHBOARD')}
               className="flex items-center gap-2 px-4 py-2 bg-[#1d4ed8] text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"
             >
                <Plus size={16} /> New Draft
             </button>
          </div>
        </header>

        {/* Top Grid: Stats & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Stat Card (Available to Free users) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#1d4ed8]">
                 <SendIcon />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +12% from last month
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 font-medium block mb-1">Total Letters Sent</span>
              <span className="text-4xl font-bold text-gray-900">{logs.length + 120}</span>
            </div>
          </div>

          {/* Timeline Chart (Mock) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 lg:col-span-2 relative overflow-hidden">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="font-bold text-gray-900">Activity Timeline</h3>
                   <span className="text-xs text-gray-400">Legislative engagement over past 12 months</span>
                </div>
                <div className="flex bg-gray-100 rounded-lg p-1">
                   <button className="px-3 py-1 text-xs font-semibold bg-white rounded-md shadow-sm text-gray-800">Year</button>
                   <button className="px-3 py-1 text-xs font-semibold text-gray-500 hover:text-gray-800">Month</button>
                </div>
             </div>

             <div className="relative h-32 w-full mt-4">
                <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-300 pointer-events-none">
                   <div className="border-t border-dashed border-gray-100 w-full h-0"></div>
                   <div className="border-t border-dashed border-gray-100 w-full h-0"></div>
                   <div className="border-t border-dashed border-gray-100 w-full h-0"></div>
                </div>

                <svg className="w-full h-full visible overflow-visible" preserveAspectRatio="none">
                   <defs>
                     <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                       <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                       <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                     </linearGradient>
                   </defs>
                   <path 
                     d="M0,80 C100,80 150,40 250,40 C350,40 400,60 500,20 C600,-20 650,90 800,90 C900,90 950,20 1000,30" 
                     fill="none" 
                     stroke="#2563eb" 
                     strokeWidth="3" 
                     strokeLinecap="round"
                     vectorEffect="non-scaling-stroke"
                   />
                   <path 
                     d="M0,80 C100,80 150,40 250,40 C350,40 400,60 500,20 C600,-20 650,90 800,90 C900,90 950,20 1000,30 V150 H0 Z" 
                     fill="url(#gradient)" 
                     className="opacity-50"
                     vectorEffect="non-scaling-stroke"
                   />
                   <circle cx="25%" cy="30%" r="4" fill="white" stroke="#2563eb" strokeWidth="2" />
                   <circle cx="50%" cy="15%" r="4" fill="white" stroke="#2563eb" strokeWidth="2" />
                   <circle cx="98%" cy="23%" r="4" fill="white" stroke="#2563eb" strokeWidth="2" />
                </svg>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Document Repository - LOCKED FOR FREE TIER */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 lg:col-span-3 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4 relative z-10">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2">
                   <Archive className="text-blue-600" size={18} />
                   Document Repository
                 </h3>
                 {user.isPro && <button className="text-xs text-blue-600 font-semibold hover:underline">View All</button>}
              </div>

              {/* Document List */}
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${!user.isPro ? 'filter blur-sm select-none opacity-50' : ''}`}>
                 {documents.map(doc => (
                    <div key={doc.id} className="group p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-4 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer">
                       <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                          <FileText size={20} />
                       </div>
                       <div className="flex-1 overflow-hidden">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">{doc.title}</h4>
                          <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                       </div>
                       <button className="text-gray-400 group-hover:text-blue-600">
                          <Download size={18} />
                       </button>
                    </div>
                 ))}
                 
                 {/* Fake docs for volume impression on Free tier */}
                 {!user.isPro && [1,2,3].map(i => (
                    <div key={i} className="group p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-4">
                       <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                       <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                       </div>
                    </div>
                 ))}
              </div>

              {/* UPGRADE OVERLAY */}
              {!user.isPro && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/30">
                      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white max-w-sm text-center transform translate-y-4">
                          <div className="w-12 h-12 bg-blue-100 text-[#002e6d] rounded-full flex items-center justify-center mx-auto mb-4">
                              <Lock size={24} />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">Unlock Your History</h3>
                          <p className="text-gray-600 text-sm mb-6">
                              Upgrade to Civic+ to access unlimited document storage and past correspondence.
                          </p>
                          <button 
                            onClick={() => onNavigate('SETTINGS')}
                            className="bg-[#002e6d] text-white font-bold py-2.5 px-6 rounded-lg text-sm hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 mx-auto w-full"
                          >
                              <Crown size={16} className="text-yellow-400" fill="currentColor" />
                              Upgrade to Civic+
                          </button>
                      </div>
                  </div>
              )}
           </div>
        </div>
      </main>

      {/* Right Column (Logs) - ALSO LOCKED FOR FREE TIER */}
      <aside className="w-80 bg-white border-l border-gray-200 hidden xl:flex flex-col p-6 h-screen sticky top-0 overflow-y-auto relative">
         <div className="flex justify-between items-end mb-6 relative z-10">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Historical Logs</h3>
              <p className="text-xs text-gray-500">Sent communication record</p>
            </div>
            {user.isPro && <button className="text-xs text-blue-600 font-semibold hover:underline">See all</button>}
         </div>

         <div className={`space-y-6 relative ${!user.isPro ? 'filter blur-sm select-none opacity-40' : ''}`}>
             <div className="absolute left-4 top-2 bottom-0 w-px bg-gray-100"></div>
             {logs.map(log => (
               <div key={log.id} className="relative pl-10 group">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full border-2 border-white shadow-sm overflow-hidden z-10">
                    <img src={log.repAvatar} alt={log.repName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                     <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-gray-900 text-sm">{log.repName}</span>
                     </div>
                     <p className="text-xs text-gray-600 font-medium leading-snug mb-2 line-clamp-2">
                        {log.topic}
                     </p>
                  </div>
               </div>
             ))}
         </div>
         
         {!user.isPro && (
             <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-white/40 to-white flex flex-col justify-end pb-20 items-center text-center p-6">
                 <Lock className="text-gray-400 mb-2" size={24} />
                 <p className="text-sm font-bold text-gray-800">Chat History Locked</p>
                 <p className="text-xs text-gray-500 mb-4">Upgrade to view full details.</p>
                 <button 
                   onClick={() => onNavigate('SETTINGS')}
                   className="text-blue-600 text-xs font-bold hover:underline"
                 >
                   View Plans
                 </button>
             </div>
         )}
      </aside>

    </div>
  );
};

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);