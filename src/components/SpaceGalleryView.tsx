import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Sparkles, X, ExternalLink, Calendar, Maximize2, ShieldCheck, Loader2 } from 'lucide-react';
import { spaceGalleryData, SpaceGalleryImage } from '../data/spaceData.ts';

export const SpaceGalleryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<SpaceGalleryImage | null>(null);

  // APOD State
  const [apodData, setApodData] = useState<any>(null);
  const [isLoadingApod, setIsLoadingApod] = useState(true);

  useEffect(() => {
    fetch('/api/nasa/apod')
      .then((res) => res.json())
      .then((data) => {
        setApodData(data);
        setIsLoadingApod(false);
      })
      .catch((err) => {
        console.warn('APOD error', err);
        setIsLoadingApod(false);
      });
  }, []);

  const filteredImages = spaceGalleryData.filter(
    (img) => selectedCategory === 'all' || img.category === selectedCategory
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* 1. NASA APOD HERO CARD */}
      <div className="rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white">Astronomy Picture of the Day (APOD)</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
              NASA Open API
            </span>
          </div>
          {apodData?.date && (
            <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              {apodData.date}
            </span>
          )}
        </div>

        {isLoadingApod ? (
          <div className="p-12 flex items-center justify-center gap-2 text-xs text-cyan-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Retrieving today's astronomical observation...</span>
          </div>
        ) : apodData ? (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 sm:h-80 md:h-auto overflow-hidden bg-black group">
              <img
                src={apodData.url}
                alt={apodData.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] text-zinc-300">
                Credit: {apodData.copyright || 'NASA / STScI'}
              </div>
            </div>

            <div className="p-5 sm:p-7 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white leading-snug">{apodData.title}</h4>
                <p className="text-xs text-zinc-300 leading-relaxed max-h-52 overflow-y-auto pr-1">
                  {apodData.explanation}
                </p>
              </div>

              {apodData.hdurl && (
                <div className="pt-2 border-t border-zinc-800/80">
                  <a
                    href={apodData.hdurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs text-cyan-300 border border-zinc-700 transition-colors"
                  >
                    <span>Inspect High-Resolution Image</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* 2. CURATED SPACE IMAGE GALLERY */}
      <div className="rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-2xl overflow-hidden p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Curated Deep Space Gallery</h3>
            </div>
            <p className="text-[11px] text-zinc-400">
              High-resolution imagery captured by James Webb, Hubble, and European Southern Observatory.
            </p>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs overflow-x-auto">
            {['all', 'Nebulae', 'Planets', 'Deep Field'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Images' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              onClick={() => setActiveImage(img)}
              className="group relative rounded-xl overflow-hidden border border-zinc-800 hover:border-cyan-500/50 bg-zinc-900 cursor-pointer transition-all shadow-md hover:-translate-y-1"
            >
              <div className="h-44 w-full overflow-hidden bg-black">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-3 bg-zinc-950 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="text-cyan-400 font-semibold">{img.category}</span>
                  <span>{img.dimensions}</span>
                </div>
                <h5 className="font-bold text-xs text-white group-hover:text-cyan-300 line-clamp-1">
                  {img.title}
                </h5>
                <p className="text-[10px] text-zinc-400 line-clamp-1">Credit: {img.credit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal View */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
              <h4 className="font-bold text-white text-sm">{activeImage.title}</h4>
              <button
                onClick={() => setActiveImage(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative max-h-[50vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="p-5 space-y-3 overflow-y-auto text-xs text-zinc-300 bg-zinc-950">
              <p className="leading-relaxed">{activeImage.description}</p>
              <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800 pt-2 font-mono">
                <span>Credit: {activeImage.credit}</span>
                <span>Category: {activeImage.category}</span>
                <span>Resolution: {activeImage.dimensions}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
