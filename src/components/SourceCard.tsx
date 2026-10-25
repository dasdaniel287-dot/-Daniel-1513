import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { Source } from '../types.ts';
import { extractDomainFavicon } from '../utils/markdown.ts';

interface SourceCardProps {
  source: Source;
  index: number;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, index }) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between p-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-cyan-500/40 transition-all hover:shadow-md hover:shadow-cyan-500/5 hover:-translate-y-0.5 text-left select-none overflow-hidden"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {!imageError ? (
              <img
                src={extractDomainFavicon(source.domain)}
                alt=""
                className="w-4 h-4 rounded-sm object-contain shrink-0"
                onError={() => setImageError(true)}
              />
            ) : (
              <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            )}
            <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-300 truncate">
              {source.domain}
            </span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-cyan-400 border border-zinc-700/60 shrink-0 font-semibold">
            #{index + 1}
          </span>
        </div>

        <h4 className="text-xs font-medium text-zinc-200 group-hover:text-cyan-300 line-clamp-2 leading-snug">
          {source.title}
        </h4>
      </div>

      <div className="mt-2 pt-2 border-t border-zinc-800/50 flex items-center justify-between text-[10px] text-zinc-500 group-hover:text-cyan-400/80">
        <span className="truncate">Visit source</span>
        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </a>
  );
};
