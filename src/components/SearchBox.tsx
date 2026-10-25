import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Globe,
  Sparkles,
  GraduationCap,
  Code2,
  Newspaper,
  Mic,
  MicOff,
  ArrowRight,
  Clock,
  SlidersHorizontal,
  X,
  Loader2,
} from 'lucide-react';
import { SearchMode, SearchTone, TimeFilter } from '../types.ts';

interface SearchBoxProps {
  onSearch: (query: string, mode: SearchMode, tone: SearchTone, timeFilter: TimeFilter) => void;
  isLoading: boolean;
  initialQuery?: string;
  isCompact?: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch,
  isLoading,
  initialQuery = '',
  isCompact = false,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState<SearchMode>('all');
  const [tone, setTone] = useState<SearchTone>('balanced');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync initial query if it changes from external clicks (e.g., trending chips)
  useEffect(() => {
    if (initialQuery !== undefined) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== textareaRef.current && !['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;
    onSearch(trimmed, mode, tone, timeFilter);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Web Speech API Voice Search
  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechFeedback('Voice recognition not supported in this browser.');
      setTimeout(() => setSpeechFeedback(''), 3000);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechFeedback('Listening... speak now');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech error:', event.error);
        setIsListening(false);
        setSpeechFeedback(`Voice error: ${event.error}`);
        setTimeout(() => setSpeechFeedback(''), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setSpeechFeedback('');
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const modeButtons: Array<{ id: SearchMode; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'All Web', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'deep', label: 'Deep Research', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'academic', label: 'Academic', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'code', label: 'Code & Tech', icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: 'news', label: 'News', icon: <Newspaper className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className={`w-full transition-all duration-300 ${isCompact ? 'max-w-4xl' : 'max-w-3xl'}`}>
      {/* Mode Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-2">
        {modeButtons.map((m) => {
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border border-zinc-800/80'
              }`}
            >
              {m.icon}
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Main Omnibar Box */}
      <div className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800/90 hover:border-zinc-700/80 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-xl shadow-black/40 backdrop-blur-md transition-all">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex items-start px-4 pt-3.5 pb-2 gap-3">
            <Search className="w-5 h-5 text-zinc-500 mt-1 shrink-0" />
            <textarea
              ref={textareaRef}
              rows={isCompact ? 1 : 2}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === 'deep'
                  ? 'Ask anything for comprehensive deep research & multi-source breakdown...'
                  : mode === 'academic'
                  ? 'Search scholarly research, scientific papers, or academic literature...'
                  : mode === 'code'
                  ? 'Search programming solutions, documentation, APIs, and libraries...'
                  : mode === 'news'
                  ? 'Search breaking news, chronological timelines, and recent reports...'
                  : 'Ask anything, explore topics, or search real-time web...'
              }
              className="w-full bg-transparent text-white placeholder-zinc-500 resize-none outline-none text-base sm:text-base leading-relaxed"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors shrink-0 mt-0.5"
                title="Clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Voice feedback message banner */}
          {speechFeedback && (
            <div className="px-4 py-1 text-xs text-cyan-400 animate-pulse flex items-center gap-1.5 border-t border-zinc-800/60">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              {speechFeedback}
            </div>
          )}

          {/* Bottom Toolbar inside the searchbox */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-800/60 bg-zinc-950/40 rounded-b-2xl gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Filter toggler */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  showFilters || timeFilter !== 'all' || tone !== 'balanced'
                    ? 'bg-zinc-800 text-cyan-300 border border-cyan-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
                title="Search Filters & Tone"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {(timeFilter !== 'all' || tone !== 'balanced') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </button>

              {/* Quick Time indicator tag */}
              {timeFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-zinc-800 text-zinc-300 border border-zinc-700">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  Past {timeFilter}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Voice Input Mic */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
                title={isListening ? 'Stop listening' : 'Search with voice'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Searching</span>
                  </>
                ) : (
                  <>
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Collapsible Filter Bar */}
        {showFilters && (
          <div className="p-3.5 bg-zinc-950/80 border-t border-zinc-800 rounded-b-2xl flex flex-wrap items-center justify-between gap-4 text-xs animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-medium">Time Horizon:</span>
              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                {(['all', 'day', 'week', 'month', 'year'] as TimeFilter[]).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeFilter(tf)}
                    className={`px-2 py-0.5 rounded-md capitalize font-medium transition-colors ${
                      timeFilter === tf
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tf === 'all' ? 'Anytime' : tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-medium">Synthesis Tone:</span>
              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                {(['balanced', 'concise', 'comprehensive'] as SearchTone[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-2 py-0.5 rounded-md capitalize font-medium transition-colors ${
                      tone === t
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
