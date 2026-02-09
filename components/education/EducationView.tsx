import * as React from 'react';
import { useState, useEffect } from 'react';
import { ViewState } from '../../types';
import { Search, FileText, MousePointer2, LayoutGrid, ArrowRight, ExternalLink, Building2, Scale, Lightbulb, Clock, Calendar, User, Printer, CheckCircle, Info, ArrowLeft, BookOpen, AlertTriangle, ChevronDown, ChevronUp, Play, XCircle, Award, Check, Flag, Map, Gavel, Trash2, Mail, Car, Shield, GraduationCap, DollarSign, Fish, Plane, Book, Music, Briefcase, Globe, Droplets, Home, ScrollText, Download, Filter } from 'lucide-react';

interface EducationViewProps {
  onNavigate: (view: ViewState) => void;
}

interface CivicInsight {
  id: string;
  text: string;
  source: string;
}

const CIVIC_INSIGHTS: CivicInsight[] = [
  { id: '1', text: "The legislative branch is the only branch of government that can enact laws.", source: "U.S. Constitution, Article I" },
  { id: '2', text: "The President has 10 days (excluding Sundays) to sign or veto a bill passed by Congress.", source: "Library of Congress" },
  { id: '3', text: "There are 435 voting members in the House of Representatives and 100 members in the Senate.", source: "House.gov" },
  { id: '4', text: "The 19th Amendment, ratified in 1920, guarantees American women the right to vote.", source: "National Archives" },
  { id: '5', text: "A filibuster in the Senate can only be stopped by a vote of 60 senators, known as 'cloture'.", source: "Senate.gov" },
  { id: '6', text: "The Supreme Court was established by Article III of the Constitution, but the number of justices is set by Congress.", source: "SupremeCourt.gov" },
  { id: '7', text: "The shortest term for a U.S. President was William Henry Harrison, who served only 32 days.", source: "WhiteHouse.gov" },
  { id: '8', text: "To override a Presidential veto, both the House and Senate must vote by a two-thirds majority.", source: "U.S. Constitution, Article I" },
  { id: '9', text: "The Speaker of the House is second in line to the Presidency, after the Vice President.", source: "Presidential Succession Act" },
  { id: '10', text: "Appropriation bills (spending money) must strictly originate in the House of Representatives.", source: "U.S. Constitution, Article I" },
  { id: '11', text: "The 26th Amendment lowered the voting age from 21 to 18 in 1971.", source: "National Archives" },
  { id: '12', text: "Federal judges are appointed for life to ensure they are insulated from political pressure.", source: "Federal Judicial Center" },
  { id: '13', text: "The 'Elastic Clause' allows Congress to pass laws 'necessary and proper' to carry out its powers.", source: "U.S. Constitution, Article I" },
  { id: '14', text: "There are 27 amendments to the U.S. Constitution. The last one was ratified in 1992.", source: "National Archives" },
  { id: '15', text: "The longest speech in Senate history lasted 24 hours and 18 minutes, delivered by Strom Thurmond in 1957.", source: "Senate.gov" }
];

export const EducationView: React.FC<EducationViewProps> = ({ onNavigate }) => {
  const [view, setView] = useState<'HUB' | 'GUIDE_BILL' | 'GUIDE_JURISDICTION' | 'GUIDE_DOCS'>('HUB');
  const [activeFilter, setActiveFilter] = useState('All Resources');

  // Insight State
  const [dailyInsight, setDailyInsight] = useState<CivicInsight>(CIVIC_INSIGHTS[0]);

  useEffect(() => {
    // Randomize insight on mount
    const random = CIVIC_INSIGHTS[Math.floor(Math.random() * CIVIC_INSIGHTS.length)];
    setDailyInsight(random);
  }, []);
  // Handle Internal Navigation
  if (view === 'GUIDE_BILL') {
    return <BillToLawGuide onBack={() => setView('HUB')} />;
  }
  if (view === 'GUIDE_JURISDICTION') {
    return <JurisdictionSorter onBack={() => setView('HUB')} />;
  }
  if (view === 'GUIDE_DOCS') {
    return <DocumentLibrary onBack={() => setView('HUB')} />;
  }

  // Filter Logic
  const showInteractive = activeFilter === 'All Resources' || activeFilter === 'Interactive Guides';
  const showDocuments = activeFilter === 'All Resources' || activeFilter === 'Documents';

  return (
    <div className="min-h-screen bg-[#F5F7FA] pt-20 md:pt-24 pb-12 px-4 md:px-6 font-sans animate-fade-in-up">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-8 md:mb-10 text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Civic Education Resource Center</h1>
          <p className="text-gray-500 text-base md:text-lg">Empowering citizens with the neutral, authoritative knowledge needed to advocate effectively.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 md:mb-10 space-y-6">

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            <FilterButton
              label="All Resources"
              icon={<LayoutGrid size={16} />}
              isActive={activeFilter === 'All Resources'}
              onClick={() => setActiveFilter('All Resources')}
            />
            <FilterButton
              label="Interactive Guides"
              icon={<MousePointer2 size={16} />}
              isActive={activeFilter === 'Interactive Guides'}
              onClick={() => setActiveFilter('Interactive Guides')}
            />
            <FilterButton
              label="Documents"
              icon={<FileText size={16} />}
              isActive={activeFilter === 'Documents'}
              onClick={() => setActiveFilter('Documents')}
            />
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 items-stretch">

          {/* Left Column: Interactive Hero Card (How a Bill Becomes Law) */}
          {showInteractive && (
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 lg:p-12 border border-gray-200 shadow-sm relative overflow-hidden group flex flex-col items-center lg:items-start text-center lg:text-left transition-all">
              {/* Background Decoration */}
              <div className="absolute -right-10 -bottom-10 opacity-[0.05] pointer-events-none">
                <Scale size={350} />
              </div>

              <div className="relative z-10 flex flex-col h-full w-full">
                <div className="mb-8 w-full">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#002e6d] mb-6 shadow-sm mx-auto lg:mx-0">
                    <LayoutGrid size={24} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 tracking-tight">How a Bill Becomes Law</h2>
                  <p className="text-gray-500 mb-8 md:mb-10 max-w-lg leading-relaxed text-base md:text-lg mx-auto lg:mx-0">
                    Master the complexities of the legislative process through our comprehensive, step-by-step interactive roadmap.
                  </p>

                  {/* Timeline Visual - Vertical on Mobile, Horizontal on Desktop */}
                  <div className="pl-0 lg:pl-2 w-full">
                    <TimelineStep
                      number="1"
                      title="Drafting & Introduction"
                      desc="A sponsor introduces the bill in either chamber."
                      isActive={true}
                    />
                    <TimelineStep
                      number="2"
                      title="Committee Review"
                      desc="Specialized groups research, revise, and vote on the bill."
                    />
                    <TimelineStep
                      number="3"
                      title="Floor Debate & Voting"
                      desc="Representatives or Senators discuss and vote on passage."
                      isLast={true}
                    />
                  </div>
                </div>

                <div className="mt-auto w-full flex justify-center lg:justify-start">
                  <button
                    onClick={() => setView('GUIDE_BILL')}
                    className="bg-[#002e6d] hover:bg-blue-800 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-900/10 flex items-center gap-2 transition-transform hover:scale-105"
                  >
                    Launch Interactive Experience <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Right Column: Stacked Cards */}
          <div className={`flex flex-col gap-6 ${!showInteractive ? 'lg:col-span-3' : ''}`}>

            {/* Understanding Your Rights Card */}
            {showDocuments && (
              <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="relative mb-4 lg:absolute lg:top-8 lg:right-8 p-3 bg-orange-50 rounded-full text-orange-500 mx-auto lg:mx-0">
                  <Scale size={20} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">Understanding Your Rights</h3>
                <p className="text-sm text-gray-500 mb-8">Foundational document library</p>

                <div className="space-y-6 lg:space-y-4 w-full">
                  <DocumentItem
                    icon={<FileText size={20} />}
                    title="The Constitution"
                    meta="Article • Transcript"
                  />
                  <DocumentItem
                    icon={<FileText size={20} />}
                    title="Civil Rights Act Summary"
                    meta="Article • 8 mins read"
                  />
                </div>

                <button
                  onClick={() => setView('GUIDE_DOCS')}
                  className="mt-8 text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center lg:justify-start gap-1 group w-full lg:w-fit whitespace-normal"
                >
                  Browse All Documents <ArrowRight size={14} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Jurisdiction Guide Card */}
            {showInteractive && (
              <div className="bg-[#0f172a] rounded-3xl p-6 lg:p-8 shadow-lg text-white relative overflow-hidden flex flex-col justify-center items-center lg:items-start text-center lg:text-left flex-grow group min-h-[300px]">

                <div className="relative z-10 w-full">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                    <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Building2 size={20} />
                    </div>
                    <ArrowRight size={16} className="text-gray-500 group-hover:text-blue-400" />
                    <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <Landmark size={20} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 leading-snug">Who Fixes This?<br />Jurisdiction Challenge</h3>
                  <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                    Potholes vs. Passports. Test your knowledge on which level of government handles what.
                  </p>

                  <button
                    onClick={() => setView('GUIDE_JURISDICTION')}
                    className="w-full py-3.5 bg-white text-[#0f172a] font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    Start Challenge <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Daily Insight Banner */}
        <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-6 lg:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-center justify-center gap-6 group text-center md:text-left">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full max-w-4xl">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white shrink-0 border border-white/20 shadow-inner">
              <Lightbulb size={32} fill="currentColor" className="text-yellow-300" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 mb-3">
                <span className="text-[10px] font-bold text-white tracking-widest uppercase">Daily Civic Insight</span>
              </div>
              <blockquote className="text-lg md:text-2xl font-serif text-white italic leading-relaxed">
                "{dailyInsight.text}"
              </blockquote>
              <p className="text-blue-200 text-sm mt-2 font-medium">— {dailyInsight.source}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub-components for Hub ---

const FilterButton: React.FC<{ label: string, icon: React.ReactNode, isActive: boolean, onClick: () => void }> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${isActive
      ? 'bg-[#002e6d] text-white shadow-md transform scale-105'
      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
      }`}
  >
    {icon}
    {label}
  </button>
);

const TimelineStep: React.FC<{ number: string; title: string; desc: string; isActive?: boolean; isLast?: boolean }> = ({ number, title, desc, isActive, isLast }) => (
  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-6 relative group mb-6 lg:mb-0 w-full">
    {!isLast && (
      <div className="block lg:block absolute left-[15px] top-8 bottom-[-24px] lg:bottom-[-8px] lg:top-10 w-0.5 bg-gray-100 z-0"></div>
    )}
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 z-10 transition-all ${isActive
      ? 'bg-[#002e6d] text-white shadow-md ring-4 ring-blue-50'
      : 'bg-white border-2 border-gray-200 text-gray-400'
      }`}>
      {number}
    </div>
    <div className="pb-4 lg:pb-8 pt-0 lg:pt-1 text-center lg:text-left flex-1">
      <h4 className={`font-bold text-sm mb-1 ${isActive ? 'text-[#002e6d]' : 'text-gray-900'}`}>{title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto lg:mx-0">{desc}</p>
    </div>
  </div>
);

const DocumentItem: React.FC<{ icon: React.ReactNode, title: string, meta: string }> = ({ icon, title, meta }) => (
  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group w-full">
    <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-[#002e6d] transition-colors">
      {icon}
    </div>
    <div className="text-center lg:text-left">
      <h4 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#002e6d] transition-colors">{title}</h4>
      <p className="text-xs text-gray-500 font-medium">{meta}</p>
    </div>
  </div>
);

const Landmark: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="22" x2="21" y2="22"></line>
    <line x1="6" y1="18" x2="6" y2="11"></line>
    <line x1="10" y1="18" x2="10" y2="11"></line>
    <line x1="14" y1="18" x2="14" y2="11"></line>
    <line x1="18" y1="18" x2="18" y2="11"></line>
    <polygon points="12 2 20 7 4 7"></polygon>
  </svg>
);


// --- DOCUMENT LIBRARY COMPONENT ---

interface CivicDocument {
  id: string;
  title: string;
  category: 'Founding Documents' | 'Modern Rights' | 'Advocacy Toolkits' | 'Official Portals';
  size: string;
  source: string;
  description: string;
  url: string;
}

const LIBRARY_DOCS: CivicDocument[] = [
  // Founding Documents (Transcripts/Articles)
  {
    id: 'doc_const',
    title: 'The Constitution',
    category: 'Founding Documents',
    size: 'Article',
    source: 'National Archives',
    description: 'The supreme law of the United States. Read the full transcript.',
    url: 'https://www.archives.gov/founding-docs/constitution-transcript'
  },
  {
    id: 'doc_decl',
    title: 'Declaration of Independence',
    category: 'Founding Documents',
    size: 'Article',
    source: 'National Archives',
    description: 'The pronouncement adopted by the Second Continental Congress in 1776.',
    url: 'https://www.archives.gov/founding-docs/declaration-transcript'
  },
  {
    id: 'doc_rights',
    title: 'The Bill of Rights',
    category: 'Founding Documents',
    size: 'Article',
    source: 'National Archives',
    description: 'The first ten amendments to the US Constitution.',
    url: 'https://www.archives.gov/founding-docs/bill-of-rights-transcript'
  },
  // Modern Rights (Milestone Documents/Portals)
  {
    id: 'doc_cra',
    title: 'Civil Rights Act of 1964',
    category: 'Modern Rights',
    size: 'Article',
    source: 'National Archives',
    description: 'Landmark legislation outlawing discrimination. Milestone document.',
    url: 'https://www.archives.gov/milestone-documents/civil-rights-act'
  },
  {
    id: 'doc_ada',
    title: 'Americans with Disabilities Act (ADA)',
    category: 'Modern Rights',
    size: 'Portal',
    source: 'ADA.gov',
    description: 'Official information and technical assistance on the Americans with Disabilities Act.',
    url: 'https://www.ada.gov/'
  },
  {
    id: 'doc_vra',
    title: 'Voting Rights Act of 1965',
    category: 'Modern Rights',
    size: 'Article',
    source: 'National Archives',
    description: 'Prohibits racial discrimination in voting. Milestone document.',
    url: 'https://www.archives.gov/milestone-documents/voting-rights-act'
  },
  // Advocacy Toolkits & Legislative Process
  {
    id: 'doc_how_laws_house',
    title: 'How Our Laws Are Made (House)',
    category: 'Advocacy Toolkits',
    size: 'Article',
    source: 'Congress.gov',
    description: 'The definitive guide by the Parliamentarian of the House regarding the legislative process.',
    url: 'https://www.congress.gov/help/learn-about-the-legislative-process/how-our-laws-are-made'
  },
  {
    id: 'doc_senate_process',
    title: 'Enactment of a Law (Senate)',
    category: 'Advocacy Toolkits',
    size: 'Article',
    source: 'Congress.gov',
    description: 'Overview of the legislative process from the Senate perspective.',
    url: 'https://www.congress.gov/help/learn-about-the-legislative-process/enactment-of-a-law'
  },
  {
    id: 'doc_foia',
    title: 'Freedom of Information Act Guide',
    category: 'Advocacy Toolkits',
    size: 'Article',
    source: 'FOIA.gov',
    description: 'Official guide to requesting unreleased information from the US Federal Government.',
    url: 'https://www.foia.gov/how-to.html'
  },
  // Official Government Portals
  {
    id: 'link_whitehouse',
    title: 'The White House',
    category: 'Official Portals',
    size: 'Portal',
    source: 'WhiteHouse.gov',
    description: 'Executive Branch news, briefing rooms, and administration priorities.',
    url: 'https://www.whitehouse.gov'
  },
  {
    id: 'link_house',
    title: 'U.S. House of Representatives',
    category: 'Official Portals',
    size: 'Portal',
    source: 'House.gov',
    description: 'Find your representative, view committees, and watch live floor activity.',
    url: 'https://www.house.gov'
  },
  {
    id: 'link_senate',
    title: 'U.S. Senate',
    category: 'Official Portals',
    size: 'Portal',
    source: 'Senate.gov',
    description: 'Senator information, committee schedules, and roll call vote records.',
    url: 'https://www.senate.gov'
  },
  {
    id: 'link_scotus',
    title: 'Supreme Court of the U.S.',
    category: 'Official Portals',
    size: 'Portal',
    source: 'SupremeCourt.gov',
    description: 'Recent opinions, oral arguments, and case filing instructions.',
    url: 'https://www.supremecourt.gov'
  },
  {
    id: 'link_doj',
    title: 'Department of Justice',
    category: 'Official Portals',
    size: 'Portal',
    source: 'Justice.gov',
    description: 'Federal law enforcement, legal news, and civil rights division resources.',
    url: 'https://www.justice.gov'
  },
  {
    id: 'link_usa',
    title: 'USA.gov',
    category: 'Official Portals',
    size: 'Portal',
    source: 'USA.gov',
    description: 'The consolidated official portal for US government services and information.',
    url: 'https://www.usa.gov'
  }
];

const DocumentLibrary: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredDocs = LIBRARY_DOCS.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Founding Documents', 'Modern Rights', 'Advocacy Toolkits', 'Official Portals'];

  return (
    <div className="min-h-screen bg-[#F5F7FA] pt-24 pb-12 animate-fade-in-up font-sans">
      <div className="max-w-7xl mx-auto px-6">

        {/* Navigation */}
        <div className="flex items-center gap-2 mb-8 text-sm font-medium text-gray-500">
          <button onClick={onBack} className="hover:text-[#002e6d] transition-colors flex items-center gap-1">
            <ArrowLeft size={16} /> Education
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold">Primary Source Library</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Primary Source Library</h1>
            <p className="text-gray-500 text-lg max-w-2xl">
              Access the foundational texts of American democracy and essential government portals. All sources are verified official domains.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <Shield size={16} className="text-green-600" />
            <span>Authenticated Sources Only</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 sticky top-24 z-20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search documents and sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002e6d]"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                    ? 'bg-[#002e6d] text-white shadow-md'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.category === 'Founding Documents' ? 'bg-amber-50 text-amber-700' :
                  doc.category === 'Modern Rights' ? 'bg-blue-50 text-blue-700' :
                    doc.category === 'Official Portals' ? 'bg-gray-100 text-gray-700' :
                      'bg-emerald-50 text-emerald-700'
                  }`}>
                  {doc.category === 'Official Portals' ? <Globe size={24} /> : doc.size === 'Article' ? <BookOpen size={24} /> : <ScrollText size={24} />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                  {doc.source}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-2 leading-snug group-hover:text-[#002e6d] transition-colors">
                {doc.title}
              </h3>
              <p className="text-sm text-gray-500 mb-6 flex-1">
                {doc.description}
              </p>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  {doc.size === 'Portal' ? <Globe size={12} /> : doc.size === 'Article' ? <BookOpen size={12} /> : <FileText size={12} />}
                  {doc.size}
                </span>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-bold text-[#002e6d] hover:text-blue-800 transition-colors"
                >
                  {doc.size === 'Portal' ? 'Visit Site' : doc.size === 'Article' ? 'Read Article' : 'View Source'} <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search size={24} />
            </div>
            <h3 className="text-gray-900 font-bold mb-2">No documents found</h3>
            <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
          </div>
        )}

      </div>
    </div>
  );
};


// --- NEW INTERACTIVE COMPONENT: BILL TO LAW GUIDE ---

type QuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
};

type StepData = {
  id: number;
  title: string;
  description: string;
  detail: React.ReactNode;
  termTitle?: string;
  termDesc?: string;
  quizQuestion: string;
  options: QuizOption[];
};

const STEPS: StepData[] = [
  {
    id: 1,
    title: "Introduction & Sponsorship",
    description: "Every law starts as an idea, but it needs a champion.",
    detail: (
      <div className="space-y-4">
        <p>A Representative or Senator must introduce the bill. This person is the <strong>Primary Sponsor</strong>.</p>
        <p>Before it can move, it is placed in the "Hopper" (in the House) or introduced on the floor (in the Senate).</p>
      </div>
    ),
    termTitle: "The Hopper",
    termDesc: "A wooden box on the Clerk's desk in the House where members deposit bills to officially introduce them.",
    quizQuestion: "Who is the only person allowed to officially introduce a federal bill?",
    options: [
      { id: 'a', text: ' The President', isCorrect: false, feedback: 'Incorrect. The President can suggest laws, but a member of Congress must introduce them.' },
      { id: 'b', text: 'A Member of Congress', isCorrect: true, feedback: 'Correct! Only a Representative or Senator can sponsor a bill.' },
      { id: 'c', text: 'A Concerned Citizen', isCorrect: false, feedback: 'Incorrect. Citizens can draft ideas, but cannot introduce them officially.' }
    ]
  },
  {
    id: 2,
    title: "The Committee Stage",
    description: "Where most bills go to die... or be perfected.",
    detail: (
      <div className="space-y-4">
        <p>The bill is assigned to a committee based on its topic (e.g., Agriculture, Defense). The committee studies it, holds hearings, and makes changes.</p>
        <div className="p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-100">
          <strong>Fact:</strong> Only about 4-8% of bills survive this stage.
        </div>
      </div>
    ),
    termTitle: "Mark-up",
    termDesc: "The process where a committee debates, amends, and rewrites proposed legislation.",
    quizQuestion: "What happens if a committee refuses to act on a bill?",
    options: [
      { id: 'a', text: 'It goes directly to the President', isCorrect: false, feedback: 'Incorrect. Skipping steps is not allowed.' },
      { id: 'b', text: 'It dies in committee', isCorrect: true, feedback: 'Correct. This is often called "pigeonholing".' },
      { id: 'c', text: 'It passes automatically', isCorrect: false, feedback: 'Incorrect. Inaction usually means the bill fails.' }
    ]
  },
  {
    id: 3,
    title: "Floor Debate & Vote",
    description: "The full chamber argues the merits.",
    detail: (
      <div className="space-y-4">
        <p>If the committee approves it, the bill goes to the floor. Members debate and propose amendments.</p>
        <p>In the Senate, debate is unlimited unless 60 senators vote to stop it.</p>
      </div>
    ),
    termTitle: "Filibuster",
    termDesc: "A Senate tactic to delay a vote by speaking for an extended period. Requires 60 votes (Cloture) to end.",
    quizQuestion: "How many votes are needed to break a filibuster in the Senate?",
    options: [
      { id: 'a', text: '51 (Simple Majority)', isCorrect: false, feedback: 'Incorrect. A simple majority passes the bill, but does not stop debate.' },
      { id: 'b', text: '60 (Three-Fifths)', isCorrect: true, feedback: 'Correct! This is known as invoking Cloture.' },
      { id: 'c', text: '100 (Unanimous)', isCorrect: false, feedback: 'Incorrect. Unanimous consent is rare.' }
    ]
  },
  {
    id: 4,
    title: "Presidential Action",
    description: "The final hurdle before becoming law.",
    detail: (
      <div className="space-y-4">
        <p>Once passed by both chambers, the bill reaches the President's desk.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Sign:</strong> Becomes law.</li>
          <li><strong>Veto:</strong> Rejects the bill (Congress can override with 2/3 vote).</li>
          <li><strong>Pocket Veto:</strong> President does nothing for 10 days while Congress is adjourned.</li>
        </ul>
      </div>
    ),
    quizQuestion: "Can Congress override a Presidential Veto?",
    options: [
      { id: 'a', text: 'No, the Veto is final', isCorrect: false, feedback: 'Incorrect. Checks and balances allow an override.' },
      { id: 'b', text: 'Yes, with a 2/3 vote in both chambers', isCorrect: true, feedback: 'Correct! It is difficult, but possible.' },
      { id: 'c', text: 'Yes, with a simple majority', isCorrect: false, feedback: 'Incorrect. It requires a supermajority.' }
    ]
  }
];

const BillToLawGuide: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeStepId, setActiveStepId] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [quizStatus, setQuizStatus] = useState<'IDLE' | 'CORRECT' | 'INCORRECT'>('IDLE');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const activeStep = STEPS.find(s => s.id === activeStepId) || STEPS[0];
  const isLastStep = activeStepId === STEPS.length;

  const handleNextStep = () => {
    if (!completedSteps.includes(activeStepId)) {
      setCompletedSteps(prev => [...prev, activeStepId]);
    }

    setQuizStatus('IDLE');
    setSelectedOption(null);

    // Always increment to move focus or finish
    // If it increments past the length, all steps collapse and completion message shows.
    setActiveStepId(prev => prev + 1);
  };

  const handleOptionSelect = (option: QuizOption) => {
    if (quizStatus === 'CORRECT') return; // Prevent double trigger

    setSelectedOption(option.id);
    if (option.isCorrect) {
      setQuizStatus('CORRECT');

      // Auto-advance after 1.5s delay to let user read the positive feedback
      setTimeout(() => {
        handleNextStep();
      }, 1500);
    } else {
      setQuizStatus('INCORRECT');
    }
  };

  const handleStepClick = (id: number) => {
    // Only allow clicking steps that are current or previously unlocked
    if (id <= Math.max(...completedSteps, 1) + 1 || id === 1) {
      setActiveStepId(id);
      setQuizStatus('IDLE');
      setSelectedOption(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pt-20 md:pt-24 pb-12 animate-fade-in-up font-sans">

      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <button onClick={onBack} className="hover:text-[#002e6d] transition-colors flex items-center gap-1">
            <ArrowLeft size={16} /> Education
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold">Interactive Guide</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-bold text-gray-600">Interactive Mode</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6">

        {/* Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-700"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">The Legislative Gauntlet</h1>
          <p className="text-gray-500 max-w-lg mx-auto text-sm md:text-base">
            Follow the bill. Answer correctly to unlock the next stage. Can you make it to the President's desk?
          </p>

          {/* Progress Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
              <span>Start</span>
              <span>Progress {Math.round((completedSteps.length / STEPS.length) * 100)}%</span>
              <span>Law</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#002e6d] transition-all duration-500 ease-out"
                style={{ width: `${(completedSteps.length / STEPS.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Steps Container */}
        <div className="space-y-4">
          {STEPS.map((step) => {
            const isActive = step.id === activeStepId;
            const isCompleted = completedSteps.includes(step.id);
            const isLocked = !isActive && !isCompleted && step.id > Math.max(...completedSteps, 0) + 1;

            return (
              <div
                key={step.id}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isActive
                  ? 'border-[#002e6d] shadow-lg ring-1 ring-blue-100'
                  : isLocked
                    ? 'border-gray-100 opacity-60 bg-gray-50'
                    : 'border-gray-200 hover:border-blue-300'
                  }`}
              >
                {/* Step Header (Clickable for nav) */}
                <button
                  onClick={() => !isLocked && handleStepClick(step.id)}
                  disabled={isLocked}
                  className="w-full flex items-center justify-between p-4 md:p-6 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors shrink-0 ${isCompleted
                      ? 'bg-green-100 text-green-600'
                      : isActive
                        ? 'bg-[#002e6d] text-white'
                        : 'bg-gray-100 text-gray-400'
                      }`}>
                      {isCompleted ? <Check size={20} strokeWidth={3} /> : step.id}
                    </div>
                    <div>
                      <h3 className={`font-bold text-base md:text-lg ${isActive ? 'text-[#002e6d]' : 'text-gray-900'}`}>{step.title}</h3>
                      {!isActive && <p className="text-xs md:text-sm text-gray-500">{step.description}</p>}
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {isActive ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </button>

                {/* Expanded Content */}
                {isActive && (
                  <div className="px-4 md:px-6 pb-8 animate-fade-in-up">
                    <div className="ml-0 md:ml-14 mt-2 md:mt-0">

                      {/* Description & Key Term */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="md:col-span-2 text-gray-600 leading-relaxed text-sm md:text-base">
                          {step.detail}
                        </div>
                        {step.termTitle && (
                          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 self-start">
                            <div className="flex items-center gap-2 mb-2 text-[#002e6d] font-bold text-xs uppercase tracking-wide">
                              <Info size={14} /> Key Term
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1">{step.termTitle}</h4>
                            <p className="text-xs text-blue-800/80 leading-snug">{step.termDesc}</p>
                          </div>
                        )}
                      </div>

                      {/* Interactive Quiz Section */}
                      <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Award className="text-[#cc0000]" size={20} />
                          Knowledge Check
                        </h4>
                        <p className="text-sm text-gray-600 mb-4 font-medium">{step.quizQuestion}</p>

                        <div className="space-y-3">
                          {step.options.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => quizStatus !== 'CORRECT' && handleOptionSelect(option)}
                              disabled={quizStatus === 'CORRECT'}
                              className={`w-full p-3 md:p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between group ${selectedOption === option.id
                                ? option.isCorrect
                                  ? 'bg-green-50 border-green-200 text-green-800 ring-1 ring-green-200'
                                  : 'bg-red-50 border-red-200 text-red-800 ring-1 ring-red-200'
                                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm text-gray-700'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${selectedOption === option.id
                                  ? option.isCorrect ? 'border-green-500 bg-green-500 text-white' : 'border-red-500 bg-red-500 text-white'
                                  : 'border-gray-300 text-gray-300 group-hover:border-blue-400'
                                  }`}>
                                  {selectedOption === option.id ? (option.isCorrect ? <Check size={14} /> : <XCircle size={14} />) : <span className="text-xs">{option.id.toUpperCase()}</span>}
                                </div>
                                {option.text}
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Feedback Area */}
                        {selectedOption && (
                          <div className={`mt-4 p-4 rounded-lg text-sm flex items-start gap-3 animate-scale-in ${quizStatus === 'CORRECT' ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            {quizStatus === 'CORRECT' ? <CheckCircle className="shrink-0 mt-0.5" size={16} /> : <AlertTriangle className="shrink-0 mt-0.5" size={16} />}
                            <div>
                              <span className="font-bold block mb-1">{quizStatus === 'CORRECT' ? 'That\'s Correct!' : 'Not quite right.'}</span>
                              {step.options.find(o => o.id === selectedOption)?.feedback}
                              {quizStatus === 'CORRECT' && <p className="mt-1 text-xs font-semibold text-green-700/80">Advancing to next step...</p>}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {completedSteps.length === STEPS.length && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-scale-in">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={32} />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Legislative Master!</h2>
            <p className="text-green-700 mb-6 max-w-md mx-auto">
              You've successfully navigated the complex path from idea to law. You are now ready to advocate effectively.
            </p>
            <button onClick={onBack} className="bg-white border border-green-200 text-green-700 hover:bg-green-50 font-bold py-3 px-6 rounded-xl transition-colors">
              Return to Resource Hub
            </button>
          </div>
        )}

      </div>
    </div>
  );
};


// --- JURISDICTION SORTER GAME ---

type Scenario = {
  id: number;
  text: string;
  icon: React.ReactNode;
  category: 'Local' | 'State' | 'Federal';
  explanation: string;
};

// Expanded to 30 scenarios for variety
const ALL_SCENARIOS: Scenario[] = [
  { id: 1, text: "My trash bin wasn't emptied this morning.", icon: <Trash2 size={40} />, category: 'Local', explanation: "Waste management and sanitation are handled by city or county municipal services." },
  { id: 2, text: "I need to renew my passport for a trip.", icon: <Flag size={40} />, category: 'Federal', explanation: "Passports are issued by the U.S. Department of State, a federal agency." },
  { id: 3, text: "There's a massive pothole on Main Street.", icon: <Car size={40} />, category: 'Local', explanation: "City streets are maintained by the local Public Works department." },
  { id: 4, text: "I need to get a new driver's license.", icon: <User size={40} />, category: 'State', explanation: "Driver's licenses are issued by the State Department of Motor Vehicles (DMV)." },
  { id: 5, text: "I didn't receive my mail today.", icon: <Mail size={40} />, category: 'Federal', explanation: "The USPS is an independent agency of the federal executive branch." },
  { id: 6, text: "Setting public school graduation requirements.", icon: <GraduationCap size={40} />, category: 'State', explanation: "While local boards run schools, the State Department of Education sets broad curriculum standards." },
  { id: 7, text: "Printing new $100 bills.", icon: <DollarSign size={40} />, category: 'Federal', explanation: "The U.S. Treasury Bureau of Engraving and Printing handles all currency." },
  { id: 8, text: "Responding to a house fire.", icon: <Shield size={40} />, category: 'Local', explanation: "Fire and Police departments are funded and managed by local municipalities." },
  { id: 9, text: "Declaring war on another country.", icon: <Gavel size={40} />, category: 'Federal', explanation: "The Constitution grants the power to declare war exclusively to the Federal Congress." },
  { id: 10, text: "Zoning a new plot for a garden shed.", icon: <Map size={40} />, category: 'Local', explanation: "Land use and zoning laws are strictly defined by city or county ordinances." },
  { id: 11, text: "Obtaining a fishing license for a lake.", icon: <Fish size={40} />, category: 'State', explanation: "Wildlife and recreational licenses are managed by the State Department of Natural Resources." },
  { id: 12, text: "Complaining about airport security lines.", icon: <Plane size={40} />, category: 'Federal', explanation: "The TSA (Transportation Security Administration) is a federal agency." },
  { id: 13, text: "Registering a new small business corporation.", icon: <Briefcase size={40} />, category: 'State', explanation: "Business incorporation is filed with the State Secretary of State." },
  { id: 14, text: "Reporting a noise complaint about neighbors.", icon: <Music size={40} />, category: 'Local', explanation: "Noise ordinances are local city laws enforced by local police." },
  { id: 15, text: "Negotiating a trade treaty with France.", icon: <Globe size={40} />, category: 'Federal', explanation: "Foreign relations and treaties are the exclusive domain of the Federal Government." },
  { id: 16, text: "Setting water usage rates for my home.", icon: <Droplets size={40} />, category: 'Local', explanation: "Public utilities like water and sewage are typically managed by local municipalities." },
  { id: 17, text: "Copyrighting my new novel.", icon: <Book size={40} />, category: 'Federal', explanation: "Intellectual property and copyright laws are determined federally." },
  { id: 18, text: "Building a new deck on my house.", icon: <Home size={40} />, category: 'Local', explanation: "Building permits and code enforcement are handled by your city or county." },
  { id: 19, text: "Certifying election results.", icon: <ScrollText size={40} />, category: 'State', explanation: "States have the primary responsibility for administering and certifying elections." },
  { id: 20, text: "Fixing a broken interstate highway sign.", icon: <Map size={40} />, category: 'State', explanation: "While funded federally, State DOTs manage and maintain interstate highways." },
  { id: 21, text: "Applying for Social Security benefits.", icon: <User size={40} />, category: 'Federal', explanation: "Social Security is a federal insurance program." },
  { id: 22, text: "Getting a marriage license.", icon: <ScrollText size={40} />, category: 'Local', explanation: "You apply at the County Clerk (Local), though they administer State law." },
  { id: 23, text: "Managing National Parks.", icon: <Building2 size={40} />, category: 'Federal', explanation: "The National Park Service is a federal bureau." },
  { id: 24, text: "Funding for the city public library.", icon: <Book size={40} />, category: 'Local', explanation: "Libraries are funded primarily through local property taxes." },
  { id: 25, text: "Issuing a patent for an invention.", icon: <Lightbulb size={40} />, category: 'Federal', explanation: "The USPTO is a federal agency handling patents and trademarks." },
  { id: 26, text: "Setting the state sales tax rate.", icon: <DollarSign size={40} />, category: 'State', explanation: "Base sales tax rates are set by the State legislature." },
  { id: 27, text: "Adopting a stray dog.", icon: <User size={40} />, category: 'Local', explanation: "Animal control and shelters are local municipal services." },
  { id: 28, text: "Minting new coins.", icon: <DollarSign size={40} />, category: 'Federal', explanation: "The U.S. Mint is a federal bureau." },
  { id: 29, text: "Barber and Cosmetology licensing.", icon: <User size={40} />, category: 'State', explanation: "Professional licenses are regulated by State boards." },
  { id: 30, text: "Recruiting for the Army.", icon: <Shield size={40} />, category: 'Federal', explanation: "Maintaining a standing army is a federal power." },
];

const JurisdictionSorter: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameState, setGameState] = useState<'INTRO' | 'PLAYING' | 'FEEDBACK' | 'SUMMARY'>('INTRO');
  const [feedback, setFeedback] = useState<{ correct: boolean, explanation: string } | null>(null);

  // Initial shuffle on mount
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Randomly select 10 unique scenarios from the pool of 30
    const shuffled = [...ALL_SCENARIOS].sort(() => 0.5 - Math.random());
    setScenarios(shuffled.slice(0, 10));
    setIndex(0);
    setScore(0);
    setStreak(0);
    setGameState('PLAYING');
    setFeedback(null);
  };

  const currentScenario = scenarios[index] || ALL_SCENARIOS[0]; // Fallback safe
  const progress = ((index) / 10) * 100;

  const handleAnswer = (selected: 'Local' | 'State' | 'Federal') => {
    const correct = selected === currentScenario.category;

    setFeedback({
      correct,
      explanation: currentScenario.explanation
    });
    setGameState('FEEDBACK');

    if (correct) {
      setScore(s => s + 100 + (streak * 10)); // Streak bonus
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const nextCard = () => {
    if (index < 9) { // 10 Questions total (0-9)
      setIndex(i => i + 1);
      setGameState('PLAYING');
      setFeedback(null);
    } else {
      setGameState('SUMMARY');
    }
  };

  // Intro Screen
  if (gameState === 'INTRO') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0f172a] to-[#0f172a] pointer-events-none"></div>

        <div className="max-w-md w-full text-center relative z-10 animate-fade-in-up">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Gavel size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Who Fixes This?</h1>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Potholes, Passports, and Police. Can you identify which level of government handles diverse civic issues?
          </p>

          <button
            onClick={startNewGame}
            className="w-full bg-white text-[#0f172a] hover:bg-gray-100 font-bold text-lg py-4 rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            Start Challenge <Play size={20} fill="currentColor" />
          </button>

          <button onClick={onBack} className="mt-6 text-slate-500 text-sm hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={14} /> Back to Education Hub
          </button>
        </div>
      </div>
    );
  }

  // Summary Screen
  if (gameState === 'SUMMARY') {
    return (
      <div className="min-h-screen bg-[#F5F7FA] pt-24 pb-12 px-6 font-sans flex flex-col items-center animate-fade-in-up">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-gray-200">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award size={48} className="text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Challenge Complete!</h2>
          <p className="text-gray-500 mb-8">You scored</p>

          <div className="text-6xl font-bold text-[#002e6d] mb-8">{score}</div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Questions</span>
              <span className="text-xl font-bold text-gray-900">10/10</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Rating</span>
              <span className="text-xl font-bold text-gray-900">{score > 800 ? 'Expert' : score > 500 ? 'Citizen' : 'Novice'}</span>
            </div>
          </div>

          <button
            onClick={startNewGame}
            className="w-full bg-[#002e6d] text-white font-bold py-3.5 rounded-xl mb-3 hover:bg-blue-800 transition-colors"
          >
            Play Again (New Questions)
          </button>
          <button
            onClick={onBack}
            className="w-full bg-white border border-gray-200 text-gray-600 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  // Main Game Loop
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Game Header */}
      <div className="bg-white px-6 py-4 shadow-sm z-10 sticky top-0">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#002e6d] transition-colors text-sm font-bold">
            <ArrowLeft size={18} /> Education
          </button>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Score</span>
            <span className="font-bold text-[#002e6d]">{score}</span>
          </div>
        </div>

        {/* Visual Progress Tracker (Stepped) */}
        <div className="w-full max-w-lg mx-auto mb-2 px-4">
          <div className="relative flex justify-between items-center">
            {/* Connecting Line - Background */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
            {/* Connecting Line - Filled */}
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#002e6d] -z-10 rounded-full transition-all duration-500"
              style={{ width: `${(index / 9) * 100}%` }}
            ></div>

            {/* Dots */}
            {Array.from({ length: 10 }).map((_, i) => {
              const isCompleted = i < index;
              const isCurrent = i === index;

              return (
                <div key={i} className="flex flex-col items-center gap-1 bg-gray-100/0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 relative z-10 ${isCompleted ? 'bg-[#002e6d] border-[#002e6d] text-white' :
                      isCurrent ? 'bg-white border-[#002e6d] text-[#002e6d] shadow-md scale-110' :
                        'bg-white border-gray-300 text-gray-300'
                      }`}
                  >
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : i + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">

        {/* Card */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8 text-center relative overflow-hidden min-h-[320px] flex flex-col items-center justify-center animate-scale-in border border-gray-100">

          {gameState === 'FEEDBACK' && (
            <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-8 backdrop-blur-md bg-white/95 transition-opacity duration-300`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${feedback?.correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {feedback?.correct ? <Check size={32} strokeWidth={4} /> : <XCircle size={32} />}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${feedback?.correct ? 'text-green-700' : 'text-red-700'}`}>
                {feedback?.correct ? 'Correct!' : 'Incorrect'}
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
                {feedback?.explanation}
              </p>
              <button
                onClick={nextCard}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center gap-2"
              >
                Next Issue <ArrowRight size={18} />
              </button>
            </div>
          )}

          <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-[#002e6d]">
            {currentScenario.icon}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-2">
            {currentScenario.text}
          </h2>
          <p className="text-gray-400 text-sm">Whose job is it to fix this?</p>
        </div>

        {/* Controls - Updated with Neutral Patriotism Colors */}
        <div className="w-full max-w-md mt-6 md:mt-8 grid grid-cols-3 gap-3 md:gap-4">
          <GameButton
            label="Local"
            icon={<Building2 size={24} />}
            color="bg-slate-600 hover:bg-slate-700"
            onClick={() => handleAnswer('Local')}
            disabled={gameState !== 'PLAYING'}
          />
          <GameButton
            label="State"
            icon={<Map size={24} />}
            color="bg-[#cc0000] hover:bg-red-800"
            onClick={() => handleAnswer('State')}
            disabled={gameState !== 'PLAYING'}
          />
          <GameButton
            label="Federal"
            icon={<Flag size={24} />}
            color="bg-[#002e6d] hover:bg-blue-900"
            onClick={() => handleAnswer('Federal')}
            disabled={gameState !== 'PLAYING'}
          />
        </div>

      </div>
    </div>
  );
};

const GameButton: React.FC<{ label: string, icon: React.ReactNode, color: string, onClick: () => void, disabled: boolean }> = ({ label, icon, color, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${color} text-white rounded-2xl p-2 md:p-4 flex flex-col items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed h-28 md:h-32`}
  >
    {icon}
    <span className="font-bold text-xs md:text-sm tracking-wide">{label}</span>
  </button>
);