import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Representative, ChatMessage, UserProfile } from '../../types';
import { generateCivicResponse, generateFormalDraft, checkGrammarAndTone } from '../../services/geminiService';
import { Send, Sparkles, Wand2, ArrowLeft, Download, FileText, Mic, Camera, PenTool, ChevronRight, MessageSquarePlus, RotateCcw, CheckCircle, Lock, Crown, Edit3, Paperclip, ImageIcon, XCircle } from 'lucide-react';
import { jsPDF } from "jspdf";

interface PortalProps {
  rep: Representative;
  user: UserProfile;
  isGuest?: boolean;
  guestAddress?: string | null;
  onBack: () => void;
  onSuccess: (method: 'webform' | 'pdf') => void;
  onUpgrade?: () => void;
}

export const DraftingPortal: React.FC<PortalProps> = ({ rep, user, isGuest = false, guestAddress, onBack, onSuccess, onUpgrade }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'copied' | 'submitting' | 'success'>('idle');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<{ inlineData: { data: string, mimeType: string } } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mobile View State ('CHAT' or 'DRAFT')
  const [mobileTab, setMobileTab] = useState<'CHAT' | 'DRAFT'>('CHAT');

  // Guest Name Collection State
  const [guestName, setGuestName] = useState<string>('');
  const [isCollectingName, setIsCollectingName] = useState(isGuest);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Determine current location context for AI
  const currentLocation = isGuest ? (guestAddress || 'United States') : (user.address || 'United States');

  // Initialize Chat
  useEffect(() => {
    if (messages.length === 0) {
      if (isGuest) {
        setMessages([{
          id: '1',
          role: 'model',
          text: `Welcome! I am your Civic Strategist. To generate an official letter for ${rep.name}, I first need your full name for the signature line. Please type it below.`,
          timestamp: Date.now()
        }]);
        setSuggestions([]);
      } else {
        setMessages([{
          id: '1',
          role: 'model',
          text: `Hello, ${user.name.split(' ')[0]}. I am your Civic Strategist. I'm here to help you articulate your message to ${rep.role} ${rep.name.split(' ')[1]}. To ensure we write an effective letter, could you please describe the specific issue you are facing and how it impacts you personally?`,
          timestamp: Date.now()
        }]);
        setSuggestions(["I'm concerned about traffic", "Funding for local schools", "Public safety issues"]);
      }
    }
  }, [isGuest, user.name, rep.name, rep.role, messages.length]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, suggestions]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simple validation
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("File is too large. Please select an image or document under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];

      const filePayload = {
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      };

      // Set state for local preview (if needed later) or just send immediately
      setSelectedFile(filePayload);

      // AUTO-SEND: Trigger analysis immediately
      handleSendMessage(undefined, filePayload);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (textOverride?: string, fileOverride?: { inlineData: { data: string, mimeType: string } }) => {
    const textToSend = textOverride || inputText;
    const fileToSend = fileOverride || selectedFile;

    // Allow sending if there's a file OR text
    if (!textToSend.trim() && !fileToSend) return;

    // Check for "Generate Draft" intent
    if (!isCollectingName && (textToSend.toLowerCase().includes('generate draft') || textToSend === '✨ Generate Draft')) {
      handleGenerateDraft();
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend || (fileToSend ? "📄 [Attached Evidence]" : ""),
      attachment: fileToSend, // Persist attachment in message history
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setSuggestions([]); // Clear suggestions while thinking

    // Clear selection state after sending
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    // --- Guest Name Collection Logic ---
    if (isCollectingName) {
      setGuestName(textToSend);
      setIsCollectingName(false);
      setIsTyping(true);

      // Capitalize First Name
      const rawName = textToSend.split(' ')[0];
      const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

      setTimeout(() => {
        const nextMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: `Thank you, ${firstName}. Now, could you please describe the specific issue you are facing and how it impacts you personally?`,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, nextMsg]);
        setSuggestions(["I'm concerned about traffic", "Funding for local schools", "Public safety issues"]);
        setIsTyping(false);
      }, 800);
      return;
    }
    // -----------------------------------

    setIsTyping(true);

    // Call Gemini for chat response (Interview Mode) - PASS LOCATION and ATTACHMENT
    const aiResponse = await generateCivicResponse(messages, userMsg.text, currentLocation, fileToSend || undefined);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiResponse.text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);

    // Update suggestions from AI
    let newSuggestions = aiResponse.suggestions || [];

    // Only allow "Generate Draft" after sufficient context is gathered (e.g., 4th turn -> 7+ messages)
    if (messages.length >= 7) {
      newSuggestions = ["✨ Generate Draft", ...newSuggestions];
    }
    setSuggestions(newSuggestions);
  };

  // Helper for consistent name capitalization
  const toTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleGenerateDraft = async () => {
    if (messages.length < 3 && !isCollectingName) {
      alert("Please provide a bit more detail in the chat before generating a draft.");
      return;
    }

    // 1. Switch to Draft Tab on Mobile to show loading state immediately
    setMobileTab('DRAFT');

    // 2. Add a system message indicating draft is starting
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'model',
      text: "Understood. I'm compiling your statement into a formal legislative letter now. Please check the Drafting Canvas.",
      timestamp: Date.now()
    }]);

    setIsGeneratingDraft(true);

    // Determine user info for draft
    const draftName = toTitleCase(isGuest ? guestName : user.name);
    const signatureBlock = `${currentLocation}\n${draftName}`;

    const draft = await generateFormalDraft(messages, rep.name, signatureBlock);
    setDraftContent(draft);
    setIsGeneratingDraft(false);
    setSubmissionStatus('idle'); // Reset status on new draft
  };

  const handleRegenerate = async () => {
    setIsGeneratingDraft(true);
    const draftName = toTitleCase(isGuest ? guestName : user.name);
    const signatureBlock = `${currentLocation}\n${draftName}`;

    const draft = await generateFormalDraft(messages, rep.name, signatureBlock);
    setDraftContent(draft);
    setIsGeneratingDraft(false);
    setSubmissionStatus('idle');
  };

  const handleRefine = async () => {
    if (!draftContent) return;
    setIsGeneratingDraft(true);
    const refined = await checkGrammarAndTone(draftContent);
    setDraftContent(refined);
    setIsGeneratingDraft(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - (margin * 2);

    // --- Header ---
    // 1. Icon (Landmark/Bank) - Red #cc0000
    doc.setDrawColor(204, 0, 0); // #cc0000
    doc.setLineWidth(0.7); // Roughly matches stroke-width="2" at this scale
    doc.setLineCap('round');
    doc.setLineJoin('round');

    // Icon Geometry (Matching Lucide 'Landmark' icon)
    // Original ViewBox 0 0 24 24.
    // We scale it down. Let's say s = 0.5 => 12mm size.
    const s = 0.5;
    const iconX = margin;
    const iconY = 15;

    // Roof (Triangle) points="12 2 20 7 4 7"
    doc.triangle(
      iconX + (12 * s), iconY + (2 * s),
      iconX + (20 * s), iconY + (7 * s),
      iconX + (4 * s), iconY + (7 * s),
      'S'
    );

    // Columns lines: x1, y1, x2, y2
    // line x1="6" y1="18" x2="6" y2="11"
    doc.line(iconX + (6 * s), iconY + (18 * s), iconX + (6 * s), iconY + (11 * s));
    // line x1="10" y1="18" x2="10" y2="11"
    doc.line(iconX + (10 * s), iconY + (18 * s), iconX + (10 * s), iconY + (11 * s));
    // line x1="14" y1="18" x2="14" y2="11"
    doc.line(iconX + (14 * s), iconY + (18 * s), iconX + (14 * s), iconY + (11 * s));
    // line x1="18" y1="18" x2="18" y2="11"
    doc.line(iconX + (18 * s), iconY + (18 * s), iconX + (18 * s), iconY + (11 * s));

    // Base line: x1="3" y1="22" x2="21" y2="22"
    doc.line(iconX + (3 * s), iconY + (22 * s), iconX + (21 * s), iconY + (22 * s));

    // 2. Text Branding
    doc.setTextColor(0, 46, 109); // #002e6d (Civic Blue)
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Civic Bridge", margin + 12, 24);

    doc.setTextColor(107, 114, 128); // Gray-500
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold"); // Medium/Bold
    doc.text("Citizen Advocacy", margin + 12, 29);

    // 3. Divider Line
    doc.setDrawColor(229, 231, 235); // Gray-200
    doc.setLineWidth(0.5);
    doc.line(margin, 36, pageWidth - margin, 36);

    // --- Content ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("times", "normal");

    // Handle multi-line text mapping
    const splitText = doc.splitTextToSize(draftContent, maxLineWidth);

    // Add text starting below header
    doc.text(splitText, margin, 60);

    // --- Footer ---
    const date = new Date().toLocaleDateString();
    const footerName = toTitleCase(isGuest ? guestName : user.name);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated securely by Civic Bridge for ${footerName} on ${date}`, margin, doc.internal.pageSize.getHeight() - 10);

    // --- Exhibit Page (If Image Evidence Exists) ---
    // Look for evidence in chat history (persist across draft generations)
    const evidenceMsg = [...messages].reverse().find(m => m.attachment);
    const evidenceFile = evidenceMsg?.attachment || selectedFile;

    if (evidenceFile && evidenceFile.inlineData.mimeType.startsWith('image/')) {
      doc.addPage();

      // Header
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 46, 109);
      doc.text("Exhibit A: Constituent Evidence", margin, 20);

      doc.setDrawColor(229, 231, 235);
      doc.line(margin, 25, pageWidth - margin, 25);

      // Image
      try {
        const imgData = `data:${evidenceFile.inlineData.mimeType};base64,${evidenceFile.inlineData.data}`;

        // Calculate dimensions to fit within margins while respecting original size (assuming 96 DPI)
        const maxImgWidth = pageWidth - (margin * 2);
        const maxImgHeight = doc.internal.pageSize.getHeight() - 40; // Space for header/footer

        const imgProps = doc.getImageProperties(imgData);
        const pxToMm = 0.264583; // 1px = 0.264583mm (96 DPI)

        let finalWidth = imgProps.width * pxToMm;
        let finalHeight = imgProps.height * pxToMm;

        // Scale down if larger than page width
        if (finalWidth > maxImgWidth) {
          const ratio = maxImgWidth / finalWidth;
          finalWidth = maxImgWidth;
          finalHeight = finalHeight * ratio;
        }

        // Scale down if larger than page height (and update width to match)
        if (finalHeight > maxImgHeight) {
          const ratio = maxImgHeight / finalHeight;
          finalHeight = maxImgHeight;
          finalWidth = finalWidth * ratio;
        }

        let format = 'JPEG';
        if (evidenceFile.inlineData.mimeType.includes('png')) format = 'PNG';
        if (evidenceFile.inlineData.mimeType.includes('webp')) format = 'WEBP';

        doc.addImage(imgData, format, margin, 30, finalWidth, finalHeight);

      } catch (err) {
        console.error("Error adding image to PDF", err);
        doc.setFontSize(10);
        doc.setTextColor(255, 0, 0);
        doc.text("Error: Could not render attached image evidence.", margin, 40);
      }
    }

    doc.save(`CivicBridge_Letter_to_${rep.name.replace(/\s+/g, '_')}.pdf`);

    // Trigger success after a short delay to allow download to start
    setTimeout(() => {
      onSuccess('pdf');
    }, 1500);
  };

  const handleSubmitWebform = async () => {
    if (isGuest) {
      // Guest mode intercept -> Upsell
      if (onUpgrade) onUpgrade();
      return;
    }

    if (!draftContent) return;

    setSubmissionStatus('submitting');

    try {
      // 1. Copy text to clipboard
      await navigator.clipboard.writeText(draftContent);

      // 2. Wait briefly to ensure copy is processed and show UI feedback
      setTimeout(() => {
        setSubmissionStatus('copied');

        // 3. Open the rep's contact page
        window.open(rep.contactUrl || 'https://www.usa.gov/elected-officials', '_blank');

        // 4. Transition to success screen after a delay
        setTimeout(() => {
          onSuccess('webform');
        }, 3000);
      }, 600);

    } catch (err) {
      console.error('Failed to copy text: ', err);
      setSubmissionStatus('idle');
      alert("Could not copy text automatically. Please select the text and copy it manually.");
    }
  };

  // Permission Handlers
  const handleCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      alert("Camera connected! (Mock: Image captured)");
    } catch (e) {
      alert("Camera permission denied. Please enable usage in your browser settings.");
    }
  };

  const handleMic = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      alert("Microphone connected! (Mock: Listening for speech...)");
    } catch (e) {
      alert("Microphone permission denied. Please enable usage in your browser settings.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] pt-16 md:pt-20 flex flex-col h-screen">
      {/* Sub-header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={onBack} className="text-gray-500 hover:text-[#002e6d] transition-colors p-1">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-base md:text-lg font-bold text-gray-900 leading-tight">Legislative Workshop</h2>
            <span className="text-[10px] md:text-xs text-gray-500 truncate max-w-[150px] md:max-w-none">Strategy Session for {rep.name}</span>
          </div>
        </div>
      </div>

      {/* 
        Responsive Layout Container 
        Mobile: One column visible at a time (controlled by mobileTab)
        Desktop: Flex-Row (Side-by-Side), Overflow Hidden Parent (Inner Scroll)
      */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#F5F7FA]">

        {/* LEFT: AI Chat (Discovery Phase) */}
        <div className={`w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-gray-200 bg-white relative z-10 shrink-0 h-full ${mobileTab === 'DRAFT' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-3 md:p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm md:text-base">
              <Sparkles size={16} className="text-[#cc0000]" />
              Discovery Interview
            </h3>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Zero-Assumption</span>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-slate-50 scroll-smooth"
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#cc0000] flex items-center justify-center mr-2 flex-shrink-0 text-white shadow-sm mt-1">
                    <Sparkles size={12} />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl p-3 md:p-4 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                  ? 'bg-[#002e6d] text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                  }`}>
                  {msg.text}
                  {/* Chat Thumbnail */}
                  {msg.attachment && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-white/20 max-w-[200px]">
                      {msg.attachment.inlineData.mimeType.startsWith('image/') ? (
                        <img
                          src={`data:${msg.attachment.inlineData.mimeType};base64,${msg.attachment.inlineData.data}`}
                          alt="Evidence"
                          className="w-full h-auto object-cover"
                        />
                      ) : (
                        <div className="bg-white/10 p-3 flex items-center gap-2">
                          <FileText size={20} />
                          <span className="text-xs truncate">Document Attached</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#cc0000] flex items-center justify-center mr-2 text-white mt-1">
                  <Sparkles size={12} />
                </div>
                <div className="bg-white p-3 md:p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">Analyzing legislation...</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75" />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 md:p-4 bg-white border-t border-gray-200 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20 pb-safe">
            {/* Suggestions Chips */}
            {suggestions.length > 0 && !isTyping && !isCollectingName && (
              <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mask-gradient-right">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion)}
                    className={`flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${suggestion === "✨ Generate Draft"
                      ? "bg-[#002e6d] text-white border-[#002e6d] hover:bg-blue-800 hover:shadow-md animate-pulse-slow order-first"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                  >
                    {suggestion === "✨ Generate Draft" ? <PenTool size={12} /> : <MessageSquarePlus size={12} />}
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isCollectingName ? "Enter your Full Name..." : "Describe your situation..."}
                className="w-full pl-4 md:pl-5 pr-28 md:pr-32 py-3 md:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#002e6d] focus:bg-white transition-all shadow-inner text-sm md:text-base"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() && !selectedFile}
                  className="p-2 bg-[#cc0000] text-white hover:bg-red-700 rounded-xl transition-all disabled:opacity-50 disabled:bg-gray-300 shadow-md"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            {/* Evidence Card & Preview Area */}
            <div className="mt-3">
              {!isCollectingName && (
                <>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />

                  {!selectedFile ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl p-3 flex items-center gap-3 transition-all group group-hover:shadow-sm text-left"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-[#002e6d] transition-colors shrink-0">
                        <div className="relative">
                          <Camera size={18} className="absolute -top-1 -left-1" />
                          <Paperclip size={14} className="absolute bottom-0 right-0" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-[#002e6d] block">Upload Evidence</span>
                        <span className="text-xs text-gray-400">Add photos or documents to support your case</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-[#002e6d]" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-3 rounded-xl animate-fade-in-up">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#002e6d] border border-blue-100 shrink-0 shadow-sm">
                        {selectedFile.inlineData.mimeType.startsWith('image/') ? <ImageIcon size={20} /> : <FileText size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-bold text-[#002e6d] block truncate">
                          Evidence Attached
                        </span>
                        <span className="text-xs text-blue-600/80 block">
                          Ready to analyze with Gemini
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="p-2 text-blue-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove attachment"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              Civic Bridge AI verifies facts against legislative databases.
            </p>
          </div>
        </div>

        {/* RIGHT: Document Canvas (Composition Phase) */}
        <div className={`w-full md:w-1/2 bg-[#E2E8F0] flex flex-col relative h-full ${mobileTab === 'CHAT' ? 'hidden md:flex' : 'flex'}`}>

          {/* Mobile-Only Header to go back to chat */}
          <div className="md:hidden bg-white border-b border-gray-200 p-3 flex items-center gap-2 sticky top-0 z-30">
            <button onClick={() => setMobileTab('CHAT')} className="text-[#002e6d] flex items-center gap-1 text-sm font-semibold">
              <ArrowLeft size={16} /> Back to Interview
            </button>
            <div className="flex-1 text-center font-bold text-gray-800 text-sm pr-16">Drafting Canvas</div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center">

            {isGeneratingDraft ? (
              // Loading State
              <div className="flex flex-col items-center justify-center my-auto animate-fade-in-up">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 relative">
                  <PenTool className="text-[#002e6d] animate-bounce" size={32} />
                  <div className="absolute inset-0 border-4 border-[#cc0000] rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Drafting Strategy...</h3>
                <p className="text-gray-500 text-center max-w-xs">
                  Synthesizing your key points into a formal legislative format.
                </p>
              </div>
            ) : draftContent ? (
              <div className="w-full max-w-2xl animate-scale-in mb-8 flex flex-col">

                {/* Action Toolbar (Mobile & Desktop) - Placed directly above paper */}
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-gray-200 shadow-sm mb-4 flex flex-wrap gap-2 sticky top-0 z-20 justify-center md:justify-end">
                  <button
                    onClick={handleRegenerate}
                    disabled={isGeneratingDraft || submissionStatus === 'submitting'}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#002e6d] transition-all flex-1 md:flex-none justify-center"
                  >
                    <RotateCcw size={14} /> Regenerate Draft
                  </button>
                  <button
                    onClick={handleRefine}
                    disabled={isGeneratingDraft || submissionStatus === 'submitting'}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#002e6d] transition-all flex-1 md:flex-none justify-center"
                  >
                    <Wand2 size={14} /> Refine Tone (Formal)
                  </button>
                  <button
                    onClick={() => setDraftContent('')}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Clear Draft"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>

                {/* The Paper */}
                <div className="bg-white shadow-2xl min-h-[500px] md:min-h-[700px] p-6 md:p-12 relative font-serif text-gray-900 border-t-8 border-[#002e6d]">
                  {/* Header Decoration */}
                  <div className="absolute top-4 right-4 md:top-8 md:right-8 opacity-10">
                    <FileText className="text-[#002e6d] w-16 h-16 md:w-24 md:h-24" />
                  </div>

                  <div className="mb-8 md:mb-12 text-right text-xs md:text-sm text-gray-500 font-sans">
                    {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>

                  <div className="whitespace-pre-wrap leading-loose text-base md:text-lg text-gray-800">
                    {draftContent}
                  </div>

                  <div className="mt-12 md:mt-16 pt-8 border-t border-gray-200 flex flex-col items-center gap-2">
                    <div className="w-32 md:w-48 h-px bg-gray-300 mb-8"></div>
                    <p className="font-dancing-script text-xl md:text-2xl text-gray-600">{toTitleCase(isGuest ? guestName : user.name)}</p>
                    <p className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400">Constituent Signature</p>
                  </div>
                </div>

                {/* Assistant Info Box */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 shadow-sm">
                  <Sparkles className="text-[#002e6d] shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-[#002e6d] font-medium leading-relaxed">
                      I am the Civic Bridge assistant. This is a draft for your review. Final decisions are yours.
                    </p>
                  </div>
                </div>

                {/* Delivery Options Card */}
                <div className="mt-4 mb-20 md:mb-20">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Select Delivery Method</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Option 1: Webform (Locked for Guest) */}
                    <button
                      onClick={handleSubmitWebform}
                      disabled={submissionStatus !== 'idle' && submissionStatus !== 'success'} // Allow clicking again if success/copied
                      className={`flex flex-col items-start p-6 bg-white border rounded-xl transition-all group text-left relative overflow-hidden ${isGuest
                        ? 'border-gray-200 hover:border-yellow-400 hover:shadow-md'
                        : submissionStatus === 'copied' || submissionStatus === 'success'
                          ? 'border-green-500 ring-2 ring-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-[#002e6d] hover:shadow-md'
                        }`}
                    >
                      <div className={`absolute top-0 left-0 w-1 h-full transition-all ${isGuest ? 'bg-yellow-400' :
                        submissionStatus === 'copied' || submissionStatus === 'success' ? 'bg-green-500' : 'bg-[#002e6d] group-hover:h-full'
                        }`}></div>

                      <div className={`mb-3 p-2 rounded-lg ${isGuest ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-[#002e6d]'}`}>
                        {isGuest ? <Lock size={24} /> : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                          </svg>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 block">
                          {isGuest ? 'Unlock Official Webform' : (submissionStatus === 'copied' || submissionStatus === 'success' ? 'Text Copied!' : 'Official Webform')}
                        </span>
                        {isGuest && <Crown size={14} className="text-yellow-500" fill="currentColor" />}
                      </div>

                      <span className="text-xs text-gray-500 leading-relaxed">
                        {isGuest
                          ? "Upgrade to Civic+ to copy text directly to official representative channels."
                          : (submissionStatus === 'copied' || submissionStatus === 'success'
                            ? "Redirecting to official site... Please paste your message there."
                            : `Copy draft and open ${rep.name}'s official contact form.`)}
                      </span>
                    </button>

                    {/* Option 2: PDF (Free) */}
                    <button
                      onClick={handleDownloadPDF}
                      disabled={submissionStatus !== 'idle' && submissionStatus !== 'success'}
                      className="flex flex-col items-start p-6 bg-white border border-gray-200 rounded-xl hover:border-[#cc0000] hover:shadow-md transition-all group text-left relative disabled:opacity-50"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#cc0000] group-hover:h-full transition-all"></div>
                      <div className="mb-3 bg-red-50 p-2 rounded-lg text-[#cc0000]">
                        <FileText size={24} />
                      </div>
                      <span className="font-bold text-gray-900 block mb-1">Download PDF</span>
                      <span className="text-xs text-gray-500 leading-relaxed">
                        Generate a formal PDF document to print, sign, and mail via USPS.
                      </span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              // Empty State
              <div className="text-center max-w-sm my-auto pb-10 md:pb-20 pt-10 md:pt-0">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-900/5 relative">
                  <div className="absolute inset-0 bg-blue-50 rounded-full animate-ping opacity-20"></div>
                  <PenTool className="text-[#002e6d]" size={32} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Drafting Canvas</h3>
                <p className="text-sm md:text-base text-gray-500 mb-8 leading-relaxed">
                  {isCollectingName ? "Please enter your name to begin." : "Chat with the Strategist to build your case. When you're ready, click 'Generate Draft'."}
                </p>
              </div>
            )}
          </div>

          {/* Sticky Action Bar for Draft Canvas (Only when NOT generating and NOT collecting name) */}
          {!draftContent && !isCollectingName && !isGeneratingDraft && (
            <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 md:p-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] flex justify-center z-30">
              <button
                onClick={handleGenerateDraft}
                disabled={messages.length < 7}
                className="w-full max-w-md bg-white border-2 border-[#002e6d] text-[#002e6d] hover:bg-[#002e6d] hover:text-white disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-[#002e6d] disabled:cursor-not-allowed font-bold py-3 md:py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm text-sm md:text-base"
              >
                <ChevronRight />
                Start Drafting
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};