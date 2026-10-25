import React, { useState } from 'react';
import { Rocket, Calendar, CheckCircle2, Shield, Compass, Sparkles, ExternalLink } from 'lucide-react';
import { spaceMissionsData, SpaceMissionItem } from '../data/spaceData.ts';

export const SpaceMissionsTracker: React.FC = () => {
  const [filterAgency, setFilterAgency] = useState<string>('all');
  const [selectedMission, setSelectedMission] = useState<SpaceMissionItem>(spaceMissionsData[0]);

  const filtered = spaceMissionsData.filter(
    (m) => filterAgency === 'all' || m.agency === filterAgency
  );

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Space Missions & Planetary Exploration</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
              Verified Agencies
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Active and landmark deep-space missions across NASA, ESA, JAXA, and international consortia.
          </p>
        </div>

        {/* Agency Filter */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
          {['all', 'NASA', 'ESA', 'International Consortium'].map((ag) => (
            <button
              key={ag}
              onClick={() => setFilterAgency(ag)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterAgency === ag
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {ag === 'all' ? 'All Agencies' : ag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Missions Grid */}
      <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((mission) => (
          <div
            key={mission.id}
            className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all hover:shadow-lg group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    {mission.agency} • {mission.missionType}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mt-0.5">
                    {mission.name}
                  </h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0 font-medium">
                  {mission.status}
                </span>
              </div>

              <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-3">
                <span>🎯 Target: {mission.target}</span>
                <span>•</span>
                <span>📅 {mission.launchDate}</span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-zinc-300">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Primary Objectives:</span>
                <ul className="list-disc list-inside space-y-1 text-zinc-400 text-[11px]">
                  {mission.keyObjectives.map((obj, oIdx) => (
                    <li key={oIdx} className="leading-relaxed">
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 text-xs">
              <span className="text-[10px] text-emerald-400 uppercase font-semibold block mb-1">
                Verified Scientific Discoveries:
              </span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                {mission.scientificAchievements}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
