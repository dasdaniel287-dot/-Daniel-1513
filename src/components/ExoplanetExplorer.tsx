import React, { useState } from 'react';
import { Telescope, Search, Filter, ShieldAlert, Sparkles, Orbit, Compass, ExternalLink } from 'lucide-react';
import { exoplanetsData, ExoplanetItem } from '../data/spaceData.ts';

export const ExoplanetExplorer: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [onlyHabitable, setOnlyHabitable] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<ExoplanetItem>(exoplanetsData[0]);

  const filtered = exoplanetsData.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.hostStar.toLowerCase().includes(search.toLowerCase()) ||
      p.constellation.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || p.planetType === filterType;
    const matchesHabitable = !onlyHabitable || p.inHabitableZone;
    return matchesSearch && matchesType && matchesHabitable;
  });

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Telescope className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Exoplanet Discovery Catalog</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
              NASA Exoplanet Archive
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Explore confirmed worlds outside our Solar System cataloged by Kepler, TESS, and Webb.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 border-b border-zinc-800/80 bg-zinc-950 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by planet, host star, or constellation..."
            className="bg-transparent text-white placeholder-zinc-500 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-zinc-200 outline-none text-xs"
          >
            <option value="all">All Planet Types</option>
            <option value="Terrestrial">Terrestrial (Rocky)</option>
            <option value="Super-Earth">Super-Earth</option>
            <option value="Sub-Neptune">Sub-Neptune (Hycean candidate)</option>
            <option value="Hot Jupiter">Hot Jupiter</option>
          </select>

          <button
            onClick={() => setOnlyHabitable(!onlyHabitable)}
            className={`px-3 py-1.5 rounded-xl border transition-colors ${
              onlyHabitable
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Habitable Zone Only
          </button>
        </div>
      </div>

      {/* Main Grid & Details View */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left List of Exoplanets */}
        <div className="space-y-2.5 md:col-span-1 max-h-[500px] overflow-y-auto pr-1">
          {filtered.map((planet) => {
            const isSelected = selectedPlanet.id === planet.id;
            return (
              <div
                key={planet.id}
                onClick={() => setSelectedPlanet(planet)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md shadow-cyan-500/5'
                    : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{planet.name}</h4>
                  {planet.inHabitableZone && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">
                      Habitable Zone
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{planet.planetType}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-800/60 pt-1.5">
                  <span>{planet.distanceLy} ly away</span>
                  <span>{planet.discoveryMethod} ({planet.discoveryYear})</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Inspection Card */}
        <div className="md:col-span-2 space-y-4">
          {selectedPlanet ? (
            <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-white">{selectedPlanet.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {selectedPlanet.planetType}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Host: {selectedPlanet.hostStar} • Constellation: {selectedPlanet.constellation}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-cyan-400">{selectedPlanet.distanceLy} ly</span>
                  <p className="text-[10px] text-zinc-400">Distance from Earth</p>
                </div>
              </div>

              {/* Comparative Physical Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Radius</span>
                  <p className="text-base font-bold text-white mt-0.5">{selectedPlanet.radiusEarths} R⊕</p>
                  <span className="text-[10px] text-zinc-400">Earth radii</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Mass</span>
                  <p className="text-base font-bold text-white mt-0.5">{selectedPlanet.massEarths} M⊕</p>
                  <span className="text-[10px] text-zinc-400">Earth masses</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Orbital Period</span>
                  <p className="text-base font-bold text-cyan-300 mt-0.5">{selectedPlanet.orbitalPeriodDays} d</p>
                  <span className="text-[10px] text-zinc-400">Earth days</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block">Equilibrium Temp</span>
                  <p className="text-base font-bold text-purple-300 mt-0.5">{selectedPlanet.equilibriumTempK} K</p>
                  <span className="text-[10px] text-zinc-400">({selectedPlanet.equilibriumTempK - 273}°C)</span>
                </div>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-zinc-300">
                <p>{selectedPlanet.description}</p>
              </div>

              {/* Habitability & Scientific Disclaimer Callout */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-2.5 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold text-amber-300">Scientific Habitability Note:</span>
                  <p className="text-zinc-400 text-[11px] leading-relaxed">
                    {selectedPlanet.habitabilityNote}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-400 text-xs">
              Select an exoplanet to view scientific telemetry and atmospheric data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
