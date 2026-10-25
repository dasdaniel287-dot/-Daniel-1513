/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Globe,
  Loader2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import {
  SearchMode,
  SearchTone,
  TimeFilter,
  SearchSession,
  SearchMessage,
  Source,
} from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { SearchBox } from './components/SearchBox.tsx';
import { AnswerView } from './components/AnswerView.tsx';
import { FollowUpBox } from './components/FollowUpBox.tsx';
import { TrendingGrid } from './components/TrendingGrid.tsx';
import { HistoryDrawer } from './components/HistoryDrawer.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';

const STORAGE_KEY = 'nexus_ai_search_sessions_v1';
const SETTINGS_KEY = 'nexus_ai_search_settings_v1';

export default function App() {
  const [sessions, setSessions] = useState<SearchSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeSession, setActiveSession] = useState<SearchSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Settings
  const [defaultMode, setDefaultMode] = useState<SearchMode>('all');
  const [defaultTone, setDefaultTone] = useState<SearchTone>('balanced');
  const [defaultTimeFilter, setDefaultTimeFilter] = useState<TimeFilter>('all');
  const [useStreaming, setUseStreaming] = useState<boolean>(true);

  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<'all' | 'saved'>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const resultsEndRef = useRef<HTMLDivElement>(null);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.defaultMode) setDefaultMode(parsed.defaultMode);
        if (parsed.defaultTone) setDefaultTone(parsed.defaultTone);
        if (parsed.defaultTimeFilter) setDefaultTimeFilter(parsed.defaultTimeFilter);
        if (parsed.useStreaming !== undefined) setUseStreaming(parsed.useStreaming);
      }
    } catch (e) {
      console.warn('Failed to load settings', e);
    }
  }, []);

  // Save settings on update
  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({
          defaultMode,
          defaultTone,
          defaultTimeFilter,
          useStreaming,
        })
      );
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }, [defaultMode, defaultTone, defaultTimeFilter, useStreaming]);

  // Persist sessions
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to save sessions', e);
    }
  }, [sessions]);

  // Animated loading pipeline stages
  useEffect(() => {
    if (!isLoading) {
      setLoadingStage('');
      return;
    }

    const stages = [
      'Connecting to real-time Google Search index...',
      'Analyzing query context & retrieving web documents...',
      'Reviewing grounded sources and cross-checking facts...',
      'Synthesizing authoritative intelligence...',
    ];
    let index = 0;
    setLoadingStage(stages[0]);

    const interval = setInterval(() => {
      index = (index + 1) % stages.length;
      setLoadingStage(stages[index]);
    }, 1800);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Start new search
  const handleStartSearch = async (
    query: string,
    mode: SearchMode = defaultMode,
    tone: SearchTone = defaultTone,
    timeFilter: TimeFilter = defaultTimeFilter
  ) => {
    setError(null);
    setIsLoading(true);

    const sessionId = Date.now().toString();
    const userMessage: SearchMessage = {
      role: 'user',
      text: query,
      createdAt: Date.now(),
    };

    const newSession: SearchSession = {
      id: sessionId,
      initialQuery: query,
      mode,
      tone,
      timeFilter,
      messages: [userMessage],
      createdAt: Date.now(),
      bookmarked: false,
    };

    setActiveSession(newSession);

    if (useStreaming) {
      await executeSearchStream(newSession, query, mode, tone, timeFilter);
    } else {
      await executeSearchSync(newSession, query, mode, tone, timeFilter);
    }
  };

  // Streaming search execution
  const executeSearchStream = async (
    session: SearchSession,
    query: string,
    mode: SearchMode,
    tone: SearchTone,
    timeFilter: TimeFilter
  ) => {
    let accumulatedText = '';
    const tempModelMessage: SearchMessage = {
      role: 'model',
      text: '',
      sources: [],
      webSearchQueries: [],
      followUps: [],
      createdAt: Date.now(),
    };

    // Prepare active session with blank response
    const updatedWithBlank = {
      ...session,
      messages: [...session.messages, tempModelMessage],
    };
    setActiveSession(updatedWithBlank);

    try {
      const res = await fetch('/api/search/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          mode,
          tone,
          timeFilter,
          conversation: session.messages
            .filter((m) => m.text)
            .map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Search failed with status ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (!reader) throw new Error('No readable stream available');

      let finalSources: Source[] = [];
      let finalQueries: string[] = [];
      let finalFollowUps: string[] = [];

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.slice(6));
              if (eventData.type === 'text') {
                accumulatedText += eventData.content;
                setActiveSession((prev) => {
                  if (!prev) return null;
                  const msgs = [...prev.messages];
                  const lastIdx = msgs.length - 1;
                  msgs[lastIdx] = {
                    ...msgs[lastIdx],
                    text: accumulatedText,
                  };
                  return { ...prev, messages: msgs };
                });
              } else if (eventData.type === 'done') {
                finalSources = eventData.sources || [];
                finalQueries = eventData.webSearchQueries || [];
                finalFollowUps = eventData.followUps || [];
              } else if (eventData.type === 'error') {
                throw new Error(eventData.error);
              }
            } catch (err: any) {
              if (err.message) throw err;
            }
          }
        }
      }

      const completedModelMessage: SearchMessage = {
        role: 'model',
        text: accumulatedText,
        sources: finalSources,
        webSearchQueries: finalQueries,
        followUps: finalFollowUps,
        createdAt: Date.now(),
      };

      const finalSession: SearchSession = {
        ...session,
        messages: [...session.messages, completedModelMessage],
      };

      setActiveSession(finalSession);
      setSessions((prev) => [finalSession, ...prev.filter((s) => s.id !== finalSession.id)]);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to complete search synthesis');
      setIsLoading(false);
    }
  };

  // Synchronous search execution
  const executeSearchSync = async (
    session: SearchSession,
    query: string,
    mode: SearchMode,
    tone: SearchTone,
    timeFilter: TimeFilter
  ) => {
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          mode,
          tone,
          timeFilter,
          conversation: session.messages
            .filter((m) => m.text)
            .map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Search failed with status ${res.status}`);
      }

      const data = await res.json();

      const modelMessage: SearchMessage = {
        role: 'model',
        text: data.text || 'No response returned from the model.',
        sources: data.sources || [],
        webSearchQueries: data.webSearchQueries || [],
        followUps: data.followUps || [],
        createdAt: Date.now(),
      };

      const completedSession: SearchSession = {
        ...session,
        messages: [...session.messages, modelMessage],
      };

      setActiveSession(completedSession);
      setSessions((prev) => [completedSession, ...prev.filter((s) => s.id !== completedSession.id)]);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to complete search synthesis');
      setIsLoading(false);
    }
  };

  // Follow-up search in active thread
  const handleFollowUp = async (followUpQuery: string) => {
    if (!activeSession || isLoading) return;

    setError(null);
    setIsLoading(true);

    const userMsg: SearchMessage = {
      role: 'user',
      text: followUpQuery,
      createdAt: Date.now(),
    };

    const sessionWithUser = {
      ...activeSession,
      messages: [...activeSession.messages, userMsg],
    };
    setActiveSession(sessionWithUser);

    if (useStreaming) {
      await executeSearchStream(
        sessionWithUser,
        followUpQuery,
        activeSession.mode,
        activeSession.tone,
        activeSession.timeFilter
      );
    } else {
      await executeSearchSync(
        sessionWithUser,
        followUpQuery,
        activeSession.mode,
        activeSession.tone,
        activeSession.timeFilter
      );
    }
  };

  // Toggle bookmark on active session
  const handleToggleBookmark = () => {
    if (!activeSession) return;
    const updated = {
      ...activeSession,
      bookmarked: !activeSession.bookmarked,
    };
    setActiveSession(updated);
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  // Delete session
  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSession?.id === id) {
      setActiveSession(null);
    }
  };

  // Clear all sessions
  const handleClearAllSessions = () => {
    if (confirm('Are you sure you want to clear your entire search history?')) {
      setSessions([]);
      setActiveSession(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleResetToHome = () => {
    setActiveSession(null);
    setError(null);
  };

  const bookmarkCount = sessions.filter((s) => s.bookmarked).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        onNewSearch={handleResetToHome}
        onToggleHistory={() => {
          setHistoryTab('all');
          setIsHistoryOpen(true);
        }}
        onToggleBookmarks={() => {
          setHistoryTab('saved');
          setIsHistoryOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        bookmarkCount={bookmarkCount}
        historyCount={sessions.length}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-6 sm:py-10 max-w-5xl mx-auto w-full">
        {!activeSession ? (
          /* HOME VIEW */
          <div className="w-full flex flex-col items-center justify-center my-auto py-8 sm:py-12 space-y-8 animate-in fade-in duration-500">
            {/* Hero Brand Title */}
            <div className="text-center space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-1">
                <Globe className="w-3.5 h-3.5" />
                <span>Live Web Grounding with Google Search</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                Where curiosity meets{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  real-time truth.
                </span>
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
                Synthesize instant answers, grounded web citations, and deep multi-source research
                powered by Gemini 3.8.
              </p>
            </div>

            {/* Omnibar Search Box */}
            <SearchBox
              onSearch={handleStartSearch}
              isLoading={isLoading}
              isCompact={false}
            />

            {/* Trending & Curated Discoveries */}
            <TrendingGrid onSelectQuery={(q) => handleStartSearch(q, defaultMode)} />
          </div>
        ) : (
          /* ACTIVE SEARCH RESULTS VIEW */
          <div className="w-full space-y-8 animate-in fade-in duration-300">
            {/* Docked top search bar to modify or issue new searches */}
            <div className="sticky top-16 z-30 pt-2 pb-4 backdrop-blur-md bg-zinc-950/80 -mx-4 px-4 border-b border-zinc-800/40">
              <SearchBox
                onSearch={handleStartSearch}
                isLoading={isLoading}
                initialQuery={activeSession.initialQuery}
                isCompact={true}
              />
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Search could not be completed</p>
                  <p className="text-xs text-rose-400/90 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => handleStartSearch(activeSession.initialQuery)}
                  className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-medium transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Conversation Messages Thread */}
            <div className="space-y-8">
              {activeSession.messages.map((message, idx) => {
                if (message.role === 'user') {
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 pt-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 text-zinc-300 font-semibold text-xs">
                        Q
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                          {message.text}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                          <span className="capitalize">{activeSession.mode} mode</span>
                          <span>•</span>
                          <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={idx} className="space-y-6">
                      <AnswerView
                        message={message}
                        query={activeSession.initialQuery}
                        isBookmarked={!!activeSession.bookmarked}
                        onToggleBookmark={handleToggleBookmark}
                        onSelectFollowUp={(fu) => handleFollowUp(fu)}
                        onRegenerate={() => handleFollowUp(`Elaborate further on this and provide more in-depth real-time insights.`)}
                      />
                    </div>
                  );
                }
              })}
            </div>

            {/* Loading Indicator with Animated Thinking Pipeline */}
            {isLoading && (
              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-cyan-500/30 flex flex-col items-center justify-center space-y-3 backdrop-blur-md animate-pulse">
                <div className="flex items-center gap-3 text-cyan-400 text-sm font-medium">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                  <span>{loadingStage || 'Synthesizing grounded answer...'}</span>
                </div>
                <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-emerald-400 animate-[shimmer_1.5s_infinite]" />
                </div>
              </div>
            )}

            {/* Follow-up Question Dock */}
            {!isLoading && (
              <div className="pt-4 border-t border-zinc-800/80">
                <FollowUpBox onSendFollowUp={handleFollowUp} isLoading={isLoading} />
              </div>
            )}

            <div ref={resultsEndRef} />
          </div>
        )}
      </main>

      {/* History & Saved Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={sessions}
        onSelectSession={(sess) => setActiveSession(sess)}
        onDeleteSession={handleDeleteSession}
        onClearAll={handleClearAllSessions}
        activeTab={historyTab}
        setActiveTab={setHistoryTab}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        defaultMode={defaultMode}
        setDefaultMode={setDefaultMode}
        defaultTone={defaultTone}
        setDefaultTone={setDefaultTone}
        defaultTimeFilter={defaultTimeFilter}
        setDefaultTimeFilter={setDefaultTimeFilter}
        useStreaming={useStreaming}
        setUseStreaming={setUseStreaming}
      />

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/60 py-4 text-center text-xs text-zinc-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-400">Nexus Search</span>
            <span>—</span>
            <span>Real-time intelligence grounded by Google Web Search</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Powered by Gemini 3.8</span>
            <span>•</span>
            <span>Zero Tracking</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
