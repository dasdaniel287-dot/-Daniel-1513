import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Globe2,
  Layers,
  GraduationCap,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import { renderMarkdown } from '../utils/markdown.ts';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: Array<{ title: string; url: string; domain: string }>;
  followUps?: string[];
  createdAt: number;
}

export const GalaxyAIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `Greetings, explorer! I am **Galaxy AI**, your cosmic astrophysics and space science intelligence.\n\nI can explain any astronomical concept from planetary geology to general relativity and cosmic inflation. I support explanations in **English** and **Bengali (বাংলা)** across **Beginner**, **Intermediate**, and **Advanced Research** levels.\n\nAsk me anything about the universe, or select one of the suggested inquiries below!`,
      followUps: [
        'How was the universe formed and what is the cosmic microwave background?',
        'What is dark matter versus dark energy?',
        'Can life survive in Europa’s subsurface liquid ocean?',
        'মহাবিশ্ব কীভাবে সৃষ্টি হয়েছিল এবং বিগ ব্যাং তত্ত্ব কী?',
      ],
      createdAt: Date.now(),
    },
  ]);

  const [input, setInput] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input.trim();
    if (!textToSend || isLoading) return;

    setInput('');
    const userMsg: ChatMessage = {
      role: 'user',
      text: textToSend,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Use streaming SSE endpoint
      const response = await fetch('/api/galaxy-ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          level,
          language,
          conversationHistory: messages
            .filter((m) => m.text)
            .map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to connect to Galaxy AI');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (!reader) throw new Error('Stream reader not available');

      let accumulatedText = '';
      let sources: any[] = [];
      let followUps: string[] = [];

      // Append blank model placeholder
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: '',
          createdAt: Date.now(),
        },
      ]);

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
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  updated[lastIdx] = {
                    ...updated[lastIdx],
                    text: accumulatedText,
                  };
                  return updated;
                });
              } else if (eventData.type === 'done') {
                sources = eventData.sources || [];
                followUps = eventData.followUps || [];
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  updated[lastIdx] = {
                    ...updated[lastIdx],
                    text: accumulatedText,
                    sources,
                    followUps,
                  };
                  return updated;
                });
              } else if (eventData.type === 'error') {
                throw new Error(eventData.error);
              }
            } catch (err: any) {
              if (err.message && err.message.includes('Galaxy AI')) throw err;
            }
          }
        }
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: `⚠️ **Galaxy AI Notice**: ${err.message || 'Unable to complete synthesis at this time.'}\n\nPlease verify your network or configure your Gemini API key in the Settings > Secrets panel.`,
          createdAt: Date.now(),
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-zinc-950/90 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col h-[700px]">
      {/* Header Bar */}
      <div className="p-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">Galaxy AI</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                Gemini 3.8 Astrophysicist
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Scientific accuracy • Hypotheses vs Facts • Citations
            </p>
          </div>
        </div>

        {/* Level & Language Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Toggle */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                language === 'en' ? 'bg-cyan-500/20 text-cyan-300' : 'text-zinc-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                language === 'bn' ? 'bg-cyan-500/20 text-cyan-300' : 'text-zinc-400 hover:text-white'
              }`}
            >
              বাংলা (Bengali)
            </button>
          </div>

          {/* Difficulty Level */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
            {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors ${
                  level === lvl ? 'bg-purple-500/20 text-purple-300' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          const sources = msg.sources || [];
          const followUps = msg.followUps || [];

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-md'
                }`}
              >
                {isUser ? 'You' : <Sparkles className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-100 rounded-tr-none'
                    : 'bg-zinc-900/80 border border-zinc-800 text-zinc-200 rounded-tl-none shadow-lg'
                }`}
              >
                {/* Rendered Markdown */}
                <div
                  className="prose-search select-text"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(msg.text, sources),
                  }}
                />

                {/* Sources if present */}
                {sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-1.5">
                    <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block">
                      Grounded Scientific Sources:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sources.map((s, sIdx) => (
                        <a
                          key={sIdx}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-300 text-[10px] border border-zinc-700 transition-colors"
                        >
                          <span>{s.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-zinc-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Copy button */}
                {!isUser && msg.text && (
                  <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
                    <span>Galaxy AI 2026</span>
                    <button
                      onClick={() => handleCopy(msg.text, idx)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Follow-up question chips */}
                {followUps.length > 0 && !isUser && (
                  <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-1.5">
                    <span className="text-[10px] text-zinc-400 font-medium">Suggested Next Steps:</span>
                    <div className="flex flex-col gap-1">
                      {followUps.map((fu, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleSend(fu)}
                          className="text-left px-2.5 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 text-[11px] text-zinc-300 hover:text-cyan-300 transition-colors"
                        >
                          {fu}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-cyan-400 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Galaxy AI is formulating astrophysics synthesis...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-zinc-900/80 border-t border-zinc-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'bn'
                ? 'মহাকাশ বিজ্ঞান নিয়ে যেকোনো প্রশ্ন করুন (যেমন: ডার্ক ম্যাটার কী?)...'
                : 'Ask anything about cosmology, exoplanets, black holes, or missions...'
            }
            className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-bold transition-all shadow-md shadow-cyan-500/10 active:scale-95"
          >
            <Send className="w-4 h-4 text-zinc-950" />
          </button>
        </form>
      </div>
    </div>
  );
};
