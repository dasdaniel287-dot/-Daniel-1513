import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Calendar, Compass, ShieldCheck, Loader2 } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  category: string;
  summary: string;
  url: string;
  imageUrl: string;
}

export const SpaceNewsSection: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/astronomy/news')
      .then((res) => res.json())
      .then((data) => {
        if (data.news) setArticles(data.news);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('News error', err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Space Science & Astronomy News</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
              Verified Sources
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Real discoveries from NASA, ESA, Caltech LIGO, and peer-reviewed astronomical research.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-cyan-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading verified astronomy news feeds...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all hover:shadow-lg group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
                  <span className="text-cyan-400 font-semibold">{item.category}</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-zinc-500" />
                    {item.date}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-400 font-medium">Source: {item.source}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Official Mission</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
