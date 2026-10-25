import React, { useState } from 'react';
import { Sparkles, Search, Layers, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { GalaxyItem, galaxiesData } from '../data/spaceData.ts';
import { GalaxyCanvas } from './GalaxyCanvas.tsx';

export const GalaxyExplorer: React.FC = () => {
  const [selectedGalaxy, setSelectedGalaxy] = useState<GalaxyItem>(galaxiesData[0]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [compareGalaxy, setCompareGalaxy] = useState<GalaxyItem | null>(null);

  const filtered = galaxiesData.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.constellation.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || g.type.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* 3D Morphological Simulator */}
      <GalaxyCanvas galaxy={selectedGalaxy} onSelectGalaxy={(g) => setSelectedGalaxy(g)} />

      {/* Catalog Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search galaxies by name or constellation..."
            className="bg-transparent text-white placeholder-zinc-500 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'Spiral', 'Barred Spiral', 'Lenticular'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                typeFilter === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {type === 'all' ? 'All Morphologies' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Galaxy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((g) => {
          const isSelected = selectedGalaxy.id === g.id;
          return (
            <div
              key={g.id}
              onClick={() => setSelectedGalaxy(g)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-cyan-400 font-mono">
                    {g.hubbleClass}
                  </span>
                  <span className="text-[11px] text-zinc-400">{g.type}</span>
                </div>
                <h4 className="font-bold text-base text-white">{g.name}</h4>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{g.description}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800/70 text-[11px] text-zinc-400 font-mono">
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <span className="text-white font-semibold">{g.distanceMly} Mly</span>
                </div>
                <div className="flex justify-between">
                  <span>Diameter:</span>
                  <span className="text-white font-semibold">{g.diameterKly} kly</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Stars:</span>
                  <span className="text-cyan-300 font-semibold">{g.estimatedStars}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Galaxy Deep Dive & Comparison */}
      {selectedGalaxy && (
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Astronomical Profile
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">{selectedGalaxy.name}</h3>
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              Constellation: <span className="text-white font-semibold">{selectedGalaxy.constellation}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {selectedGalaxy.description}
          </p>

          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-semibold text-white">Distinguishing Characteristics:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedGalaxy.keyFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
