import React, { useState } from 'react';
import { ArrowRight, CornerDownLeft, Loader2, MessageSquarePlus } from 'lucide-react';

interface FollowUpBoxProps {
  onSendFollowUp: (query: string) => void;
  isLoading: boolean;
}

export const FollowUpBox: React.FC<FollowUpBoxProps> = ({ onSendFollowUp, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendFollowUp(input.trim());
    setInput('');
  };

  return (
    <div className="w-full pt-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-lg"
      >
        <div className="p-1.5 text-zinc-500">
          <MessageSquarePlus className="w-4 h-4 text-cyan-400" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up question or explore a specific detail..."
          className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex items-center justify-center p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-zinc-950 transition-all active:scale-95 shrink-0"
          title="Send follow-up"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};
