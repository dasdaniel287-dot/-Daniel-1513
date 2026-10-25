import React, { useState } from 'react';
import { Info, Mail, Shield, FileText, X, Check, Sparkles } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'about' | 'contact' | 'privacy' | 'terms';
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'about',
}) => {
  const [tab, setTab] = useState<'about' | 'contact' | 'privacy' | 'terms'>(defaultTab);
  const [contactSent, setContactSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Galaxy Science AI Information</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 px-4 pt-2 gap-2 text-xs bg-zinc-950 overflow-x-auto">
          {[
            { id: 'about', label: 'About Us' },
            { id: 'contact', label: 'Contact & Inquiries' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms of Use' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`pb-2.5 px-3 font-medium border-b-2 whitespace-nowrap transition-colors ${
                tab === t.id ? 'border-cyan-400 text-cyan-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-zinc-300 leading-relaxed">
          {tab === 'about' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-white">Exploring the Universe Beyond Imagination</h4>
              <p>
                <strong>Galaxy Science AI</strong> is a next-generation astronomical platform designed to democratize astrophysics, planetary science, and cosmology. By combining interactive 3D WebGL visualizations, relativistic physics simulations, and generative AI synthesis, we make the cosmos tangible and inspiring.
              </p>
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="font-bold text-cyan-400 block">Scientific Principles:</span>
                <ul className="list-disc list-inside space-y-1 text-zinc-400 text-[11px]">
                  <li>Strict demarcation between observational facts and theoretical models.</li>
                  <li>Direct integration of peer-reviewed data from NASA, ESA, JWST, and ALMA.</li>
                  <li>Bilingual accessibility supporting both English and Bengali (বাংলা).</li>
                  <li>No fabricated celestial coordinates or unverified discovery claims.</li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'contact' && (
            <div>
              {contactSent ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Inquiry Transmitted!</h4>
                  <p className="text-xs text-zinc-400">
                    Thank you for reaching out. Our astrophysics science education team will review your message.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Your Name:</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Dr. Carl Sagan"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Email Address:</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@institution.edu"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Message / Inquiry:</label>
                    <textarea
                      rows={4}
                      required
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Share your feedback, scientific inquiry, or educational partnership idea..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 text-xs resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors"
                  >
                    Send Cosmic Inquiry
                  </button>
                </form>
              )}
            </div>
          )}

          {tab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Privacy Policy</h4>
              <p>
                Galaxy Science AI is committed to privacy protection:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-zinc-400 text-[11px]">
                <li><strong>No Tracking:</strong> We do not deploy third-party advertising trackers, cross-site profiling, or behavioral fingerprinting.</li>
                <li><strong>Local Storage:</strong> Your bookmarks, difficulty levels, and quiz progress are stored securely on your client machine via Web Storage.</li>
                <li><strong>API Security:</strong> All AI interactions with Gemini and NASA are handled through secured server endpoints; no secret credentials are ever exposed in frontend bundles.</li>
              </ul>
            </div>
          )}

          {tab === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Terms of Use</h4>
              <p>
                All astronomical imagery provided by NASA, ESA, and STScI is used under public domain educational guidelines. Scientific calculators and simulations are provided for educational and research enrichment purposes.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
