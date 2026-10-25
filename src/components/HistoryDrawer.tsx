import React, { useState } from 'react';
import {
  X,
  Clock,
  Bookmark,
  Trash2,
  ExternalLink,
  Search,
  Calendar,
  Layers,
} from 'lucide-react';
import { SearchSession } from '../types.ts';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SearchSession[];
  onSelectSession: (session: SearchSession) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
  activeTab: 'all' | 'saved';
  setActiveTab: (tab: 'all' | 'saved') => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onDeleteSession,
  onClearAll,
  activeTab,
  setActiveTab,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredSessions = sessions.filter((s) => {
    const matchesTab = activeTab === 'all' || s.bookmarked;
    const matchesQuery = s.initialQuery.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-white">Search History & Saved</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-zinc-800 px-4 pt-2 gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>All History</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400">
                {sessions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarked</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400">
                {sessions.filter((s) => s.bookmarked).length}
              </span>
            </button>
          </div>

          {/* Search Filter input */}
          <div className="p-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter search queries..."
                className="bg-transparent text-zinc-200 placeholder-zinc-500 outline-none w-full"
              />
              {filterQuery && (
                <button onClick={() => setFilterQuery('')}>
                  <X className="w-3 h-3 text-zinc-500 hover:text-zinc-300" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 text-xs space-y-2">
                <p>No {activeTab === 'saved' ? 'bookmarked' : ''} searches found.</p>
                <p className="text-[11px] text-zinc-400">
                  Searches you conduct will appear here for instant replay.
                </p>
              </div>
            ) : (
              filteredSessions.map((session) => {
                const messageCount = session.messages.length;
                const lastModelMsg = session.messages.find((m) => m.role === 'model');
                const sourceCount = lastModelMsg?.sources?.length || 0;

                return (
                  <div
                    key={session.id}
                    className="group relative p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between gap-2"
                  >
                    <div
                      onClick={() => {
                        onSelectSession(session);
                        onClose();
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-cyan-400 uppercase tracking-wider">
                          {session.mode}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-xs font-medium text-zinc-200 group-hover:text-cyan-300 line-clamp-2">
                        {session.initialQuery}
                      </h4>

                      <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-400">
                        <span>{messageCount} turn{messageCount > 1 ? 's' : ''}</span>
                        {sourceCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Layers className="w-2.5 h-2.5 text-cyan-400" />
                            {sourceCount} source{sourceCount > 1 ? 's' : ''}
                          </span>
                        )}
                        {session.bookmarked && (
                          <span className="flex items-center gap-1 text-amber-400">
                            <Bookmark className="w-2.5 h-2.5 fill-amber-400" />
                            Saved
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1 pt-1 border-t border-zinc-800/50">
                      <button
                        onClick={() => onDeleteSession(session.id)}
                        className="p-1 rounded text-zinc-600 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                        title="Delete this query"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {sessions.length > 0 && (
            <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">
                Stored locally in your browser
              </span>
              <button
                onClick={onClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
