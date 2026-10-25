import React, { useState } from 'react';
import { User, Bookmark, Award, Trash2, Globe, Shield, X, Check, Sparkles } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
  setLanguage: (lang: 'en' | 'bn') => void;
  bookmarks: string[];
  onRemoveBookmark: (item: string) => void;
  onClearAllData: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  language,
  setLanguage,
  bookmarks,
  onRemoveBookmark,
  onClearAllData,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookmarks' | 'privacy'>('profile');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Cosmic Profile & Preferences</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switch */}
        <div className="flex border-b border-zinc-800 px-4 pt-2 gap-2 text-xs bg-zinc-950">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 font-medium border-b-2 transition-colors ${
              activeTab === 'profile' ? 'border-cyan-400 text-cyan-400' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Profile & Language
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`pb-2.5 px-3 font-medium border-b-2 transition-colors flex items-center gap-1 ${
              activeTab === 'bookmarks' ? 'border-cyan-400 text-cyan-400' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Saved Bookmarks</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300">
              {bookmarks.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 font-medium border-b-2 transition-colors ${
              activeTab === 'privacy' ? 'border-cyan-400 text-cyan-400' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Privacy & Data
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-zinc-300">
          {activeTab === 'profile' && (
            <div className="space-y-5">
              {/* Explorer Level Badge */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Cosmic Explorer</h4>
                    <p className="text-[11px] text-zinc-400">Astrophysics Level 2 • 5 Quizzes Solved</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
                  Active
                </span>
              </div>

              {/* Language Preference */}
              <div>
                <label className="block font-semibold text-zinc-200 mb-2">Platform Primary Language:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      language === 'en'
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-white font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>English (International)</span>
                    {language === 'en' && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                  <button
                    onClick={() => setLanguage('bn')}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      language === 'bn'
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-white font-bold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>বাংলা (Bengali)</span>
                    {language === 'bn' && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="space-y-3">
              {bookmarks.length === 0 ? (
                <div className="text-center py-8 text-zinc-400 space-y-1">
                  <Bookmark className="w-8 h-8 mx-auto text-zinc-600" />
                  <p>No saved celestial objects or bookmarks yet.</p>
                  <p className="text-[11px] text-zinc-500">
                    Bookmark your favorite galaxies, exoplanets, or missions to view them here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {bookmarks.map((bm, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                    >
                      <span className="font-medium text-white">{bm}</span>
                      <button
                        onClick={() => onRemoveBookmark(bm)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Shield className="w-4 h-4" />
                  <span>Privacy & Zero Telemetry</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Galaxy Science AI stores all preferences, bookmarks, and quiz progress strictly on your local device. We never sell or track personal identifiable information.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (confirm('Clear all locally saved cosmic bookmarks, quiz scores, and settings?')) {
                      onClearAllData();
                      onClose();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Local Stored Data</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
