import React from 'react';
import {
  Cpu,
  Rocket,
  Zap,
  TrendingUp,
  Dna,
  Code,
  Flame,
  ArrowUpRight,
  Globe,
  Sparkles,
} from 'lucide-react';
import { TrendingTopic } from '../types.ts';

interface TrendingGridProps {
  onSelectQuery: (query: string) => void;
}

const defaultTopics: TrendingTopic[] = [
  {
    category: 'AI & Frontier Tech',
    query: 'What are the newest breakthroughs in reasoning models and autonomous agents in 2026?',
    icon: 'cpu',
  },
  {
    category: 'Science & Space',
    query: 'What is the current status of the Artemis lunar missions and Starship deep space flights?',
    icon: 'rocket',
  },
  {
    category: 'Clean Energy & Climate',
    query: 'Latest advancements in commercial nuclear fusion and next-gen solid-state batteries',
    icon: 'zap',
  },
  {
    category: 'Markets & Economy',
    query: 'Global semiconductor supply chain outlook and AI infrastructure investments',
    icon: 'trending-up',
  },
  {
    category: 'Medicine & Biotech',
    query: 'CRISPR gene therapy clinical milestones and AI-accelerated protein drug discovery',
    icon: 'dna',
  },
  {
    category: 'Developer Ecosystem',
    query: 'Best practices for WebGPU and WebAssembly performance in modern full-stack web applications',
    icon: 'code',
  },
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'cpu':
      return <Cpu className="w-4 h-4 text-cyan-400" />;
    case 'rocket':
      return <Rocket className="w-4 h-4 text-indigo-400" />;
    case 'zap':
      return <Zap className="w-4 h-4 text-amber-400" />;
    case 'trending-up':
      return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    case 'dna':
      return <Dna className="w-4 h-4 text-rose-400" />;
    case 'code':
      return <Code className="w-4 h-4 text-teal-400" />;
    default:
      return <Sparkles className="w-4 h-4 text-cyan-400" />;
  }
};

export const TrendingGrid: React.FC<TrendingGridProps> = ({ onSelectQuery }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 pt-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Trending & Curated Discoveries</span>
        </div>
        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
          <Globe className="w-3 h-3 text-cyan-400" />
          Real-time Web Grounding
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {defaultTopics.map((topic, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuery(topic.query)}
            className="group relative flex flex-col justify-between p-4 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/60 border border-zinc-800/80 hover:border-cyan-500/30 transition-all text-left hover:shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-0.5 active:scale-[0.99]"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60">
                  {getIcon(topic.icon)}
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                {topic.category}
              </span>
              <p className="text-xs font-medium text-zinc-300 group-hover:text-white line-clamp-2 mt-1 leading-snug">
                {topic.query}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
