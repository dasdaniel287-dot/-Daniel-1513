import React from 'react';
import { Sparkles, History, Bookmark, Settings, Plus, Search } from 'lucide-react';

interface NavbarProps {
  onNewSearch: () => void;
  onToggleHistory: () => void;
  onToggleBookmarks: () => void;
  onOpenSettings: () => void;
  bookmarkCount: number;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewSearch,
  onToggleHistory,
  onToggleBookmarks,
  onOpenSettings,
  bookmarkCount,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={onNewSearch}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Nexus
              </span>
              <span className="text-xs px-2 py-0.5 font-medium rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI Search
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Real-time Google Grounding
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* New Search */}
          <button
            onClick={onNewSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-all hover:border-cyan-500/40 active:scale-95 shadow-sm"
            title="Start new search (Press /)"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">New Search</span>
            <kbd className="hidden md:inline-block px-1 py-0.2 bg-zinc-800 text-zinc-400 rounded text-[10px] font-mono border border-zinc-700">
              /
            </kbd>
          </button>

          {/* Bookmarks */}
          <button
            onClick={onToggleBookmarks}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-all hover:text-white"
            title="Saved Searches"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Saved</span>
            {bookmarkCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                {bookmarkCount}
              </span>
            )}
          </button>

          {/* History */}
          <button
            onClick={onToggleHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-all hover:text-white"
            title="Search History"
          >
            <History className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-medium border border-zinc-700">
                {historyCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-all"
            title="Search Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
