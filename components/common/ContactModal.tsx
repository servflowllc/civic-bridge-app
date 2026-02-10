import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialSubject?: string;
    userEmail?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
    isOpen,
    onClose,
    initialSubject = '',
    userEmail = ''
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: userEmail,
        subject: initialSubject,
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // Update subject if prop changes (e.g. opening different context)
    React.useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, subject: initialSubject, email: userEmail || prev.email }));
            setStatus('idle');
        }
    }, [isOpen, initialSubject, userEmail]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const encode = (data: any) => {
                return Object.keys(data)
                    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
                    .join("&");
            };

            await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: encode({ "form-name": "contact", ...formData })
            });

            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData(prev => ({ ...prev, message: '' })); // Reset message only
            }, 2000);

        } catch (error) {
            console.error("Form Submission Error:", error);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="bg-[#002e6d] px-6 py-4 flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg">Contact Us</h3>
                    <button onClick={onClose} className="text-blue-200 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {status === 'success' ? (
                        <div className="min-h-[240px] flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">Message Sent!</h4>
                            <p className="text-gray-500">Thank you for reaching out. We'll get back to you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="hidden" name="form-name" value="contact" />

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002e6d] focus:border-transparent outline-none transition-all"
                                    placeholder="Jane Citizen"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002e6d] focus:border-transparent outline-none transition-all"
                                    placeholder="jane@example.com"
                                />
                            </div>

                            <div className="relative">
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <div className="relative">
                                    <select
                                        name="subject"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002e6d] focus:border-transparent outline-none transition-all bg-white appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a topic...</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Feedback">Feedback</option>
                                        <option value="Support">Support</option>
                                        <option value="Join Waitlist">Join Waitlist</option>
                                        <option value="Donation Inquiry">Donation Inquiry</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows={4}
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002e6d] focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="How can we help?"
                                />
                            </div>

                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                    <AlertCircle size={16} />
                                    <span>Something went wrong. Please try again.</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full py-3 bg-[#cc0000] hover:bg-red-700 text-white font-bold rounded-xl shadow-md transform active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} /> Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
