import React, { useState } from 'react';
import { Calculator, ArrowRight, Info, Check, Sparkles, Scale, Compass, Orbit, Flame } from 'lucide-react';

export const CosmicCalculators: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<
    'distance' | 'travel' | 'weight' | 'kepler' | 'schwarzschild' | 'luminosity'
  >('distance');

  // 1. Distance Converter
  const [distInput, setDistInput] = useState<number>(1);
  const [distUnit, setDistUnit] = useState<'ly' | 'pc' | 'au'>('ly');

  // Constants
  const KM_PER_LY = 9.4607304725808e12;
  const KM_PER_PC = 3.08567758149137e13;
  const KM_PER_AU = 149597870.7;
  const SPEED_OF_LIGHT_KM_S = 299792.458;

  // 2. Travel Time Calculator
  const [travelDistAU, setTravelDistAU] = useState<number>(1);
  const [velocityKmS, setVelocityKmS] = useState<number>(17); // Default Voyager speed

  // 3. Planetary Weight
  const [earthWeightKg, setEarthWeightKg] = useState<number>(70);

  // 4. Kepler's Orbital Period
  const [semiMajorAxisAU, setSemiMajorAxisAU] = useState<number>(1);
  const [starMassSol, setStarMassSol] = useState<number>(1);

  // 5. Schwarzschild Radius
  const [bhMassSol, setBhMassSol] = useState<number>(10);

  // 6. Stellar Luminosity
  const [starRadiusSol, setStarRadiusSol] = useState<number>(1);
  const [starTempK, setStarTempK] = useState<number>(5778);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-zinc-950/80 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Astrophysics & Cosmic Calculators</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
              Verified Equations
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Real physical equations with explicit derivation steps, assumptions, and constant values.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-2 border-b border-zinc-800/80 bg-zinc-950 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
        {[
          { id: 'distance', label: 'Distance & Cosmic Units' },
          { id: 'travel', label: 'Interplanetary Travel Time' },
          { id: 'weight', label: 'Planetary Weight' },
          { id: 'kepler', label: "Kepler's Orbital Period" },
          { id: 'schwarzschild', label: 'Schwarzschild Radius' },
          { id: 'luminosity', label: 'Stellar Luminosity' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCalc(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeCalc === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Calculator Body */}
      <div className="p-5 sm:p-7 space-y-6 text-xs sm:text-sm text-zinc-300">
        {/* 1. DISTANCE CONVERTER */}
        {activeCalc === 'distance' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                Cosmic Unit Converter
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Enter Value:</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={distInput}
                    onChange={(e) => setDistInput(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Input Unit:</label>
                  <select
                    value={distUnit}
                    onChange={(e) => setDistUnit(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none focus:border-cyan-400 text-sm"
                  >
                    <option value="ly">Light-Years (ly)</option>
                    <option value="pc">Parsecs (pc)</option>
                    <option value="au">Astronomical Units (AU)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Calculations & Results */}
            {(() => {
              let km = 0;
              if (distUnit === 'ly') km = distInput * KM_PER_LY;
              else if (distUnit === 'pc') km = distInput * KM_PER_PC;
              else if (distUnit === 'au') km = distInput * KM_PER_AU;

              const ly = km / KM_PER_LY;
              const pc = km / KM_PER_PC;
              const au = km / KM_PER_AU;
              const miles = km * 0.621371;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 font-mono">
                    <span className="text-[10px] text-zinc-400 uppercase">Kilometers (km)</span>
                    <p className="text-base font-bold text-cyan-300 mt-1">{km.toExponential(4)} km</p>
                    <p className="text-[11px] text-zinc-400 mt-1">{miles.toExponential(4)} statute miles</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 font-mono">
                    <span className="text-[10px] text-zinc-400 uppercase">Astronomical Units (AU)</span>
                    <p className="text-base font-bold text-white mt-1">{au.toLocaleString(undefined, { maximumFractionDigits: 2 })} AU</p>
                    <p className="text-[11px] text-zinc-400 mt-1">{ly.toFixed(4)} ly • {pc.toFixed(4)} pc</p>
                  </div>
                </div>
              );
            })()}

            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
              <p>• 1 Light-Year is the distance traveled by electromagnetic radiation in vacuum in one Julian year (365.25 days) = 9.461 × 10¹² km.</p>
              <p>• 1 Parsec is the distance at which one astronomical unit subtends an angle of one arcsecond = 3.262 light-years.</p>
            </div>
          </div>
        )}

        {/* 2. TRAVEL TIME CALCULATOR */}
        {activeCalc === 'travel' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                Interplanetary & Interstellar Travel Duration
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Distance (Astronomical Units):</label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    value={travelDistAU}
                    onChange={(e) => setTravelDistAU(parseFloat(e.target.value) || 0.1)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none font-mono"
                  />
                  <span className="text-[10px] text-zinc-400">e.g. Earth to Sun: 1 AU; Earth to Mars closest: 0.38 AU; Earth to Pluto: ~39.5 AU</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Cruising Speed (km/s):</label>
                  <input
                    type="number"
                    min="0.001"
                    step="any"
                    value={velocityKmS}
                    onChange={(e) => setVelocityKmS(parseFloat(e.target.value) || 1)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none font-mono"
                  />
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    <button onClick={() => setVelocityKmS(17)} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-cyan-300">Voyager 1 (17 km/s)</button>
                    <button onClick={() => setVelocityKmS(190)} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-cyan-300">Parker Solar Probe (190 km/s)</button>
                    <button onClick={() => setVelocityKmS(SPEED_OF_LIGHT_KM_S)} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-cyan-300">Light Speed (c)</button>
                  </div>
                </div>
              </div>
            </div>

            {(() => {
              const km = travelDistAU * KM_PER_AU;
              const seconds = km / (velocityKmS || 1);
              const minutes = seconds / 60;
              const hours = minutes / 60;
              const days = hours / 24;
              const years = days / 365.25;

              return (
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Calculated Travel Duration:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400">Hours</span>
                      <p className="text-sm font-bold text-white">{hours < 1000 ? hours.toFixed(2) : hours.toExponential(2)}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400">Days</span>
                      <p className="text-sm font-bold text-cyan-300">{days < 1000 ? days.toFixed(1) : days.toExponential(2)}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400">Earth Years</span>
                      <p className="text-sm font-bold text-purple-300">{years < 100 ? years.toFixed(2) : years.toExponential(2)}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400">Total Distance</span>
                      <p className="text-sm font-bold text-white">{km.toExponential(3)} km</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 3. PLANETARY WEIGHT */}
        {activeCalc === 'weight' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                Planetary Surface Gravitational Weight
              </span>
              <div className="max-w-xs">
                <label className="block text-xs font-medium text-zinc-300 mb-1">Your Earth Weight (kg or lbs):</label>
                <input
                  type="number"
                  min="1"
                  value={earthWeightKg}
                  onChange={(e) => setEarthWeightKg(parseFloat(e.target.value) || 1)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white outline-none font-mono text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { name: 'Moon', g: 1.62, color: '#e2e8f0' },
                { name: 'Mars', g: 3.72, color: '#f87171' },
                { name: 'Venus', g: 8.87, color: '#fbbf24' },
                { name: 'Jupiter', g: 24.79, color: '#fb923c' },
                { name: 'Saturn', g: 10.44, color: '#fde047' },
                { name: 'Uranus', g: 8.69, color: '#38bdf8' },
                { name: 'Neptune', g: 11.15, color: '#60a5fa' },
                { name: 'Pluto', g: 0.62, color: '#c084fc' },
              ].map((p) => {
                const weight = earthWeightKg * (p.g / 9.807);
                return (
                  <div key={p.name} className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
                    <span className="text-xs font-bold" style={{ color: p.color }}>{p.name}</span>
                    <p className="text-lg font-bold text-white mt-1 font-mono">{weight.toFixed(1)}</p>
                    <span className="text-[10px] text-zinc-400 mt-1">g = {p.g} m/s² ({((p.g / 9.807) * 100).toFixed(0)}% Earth)</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-zinc-400">
              Formula: W_p = W_\oplus \times \frac&#123;g_p&#125;&#123;g_\oplus&#125; where g = \frac&#123;GM&#125;&#123;R^2&#125;. Mass remains invariant; only weight changes with local gravitational acceleration.
            </p>
          </div>
        )}

        {/* 4. KEPLER'S ORBITAL PERIOD */}
        {activeCalc === 'kepler' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                Kepler's Third Law Calculator
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Semi-major Axis a (AU):</label>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={semiMajorAxisAU}
                    onChange={(e) => setSemiMajorAxisAU(parseFloat(e.target.value) || 0.01)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Host Star Mass M (Solar Masses M☉):</label>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={starMassSol}
                    onChange={(e) => setStarMassSol(parseFloat(e.target.value) || 0.01)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {(() => {
              // T² = a³ / M -> T = sqrt(a³ / M) in Earth years
              const periodYears = Math.sqrt(Math.pow(semiMajorAxisAU, 3) / starMassSol);
              const periodDays = periodYears * 365.25;

              return (
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Calculated Orbital Period:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400">Earth Years</span>
                      <p className="text-lg font-bold text-cyan-300">{periodYears.toFixed(3)} years</p>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400">Days</span>
                      <p className="text-lg font-bold text-white">{periodDays.toFixed(1)} Earth days</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            <p className="text-[11px] text-zinc-400">
              Harmonic Law: T^2 = \frac&#123;4\pi^2&#125;&#123;G(M_* + m_p)&#125; a^3 \approx \frac&#123;a^3&#125;&#123;M_*&#125; (in astronomical units, solar masses, and Julian years).
            </p>
          </div>
        )}

        {/* 5. SCHWARZSCHILD RADIUS */}
        {activeCalc === 'schwarzschild' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                Black Hole Event Horizon Radius
              </span>
              <div className="max-w-xs">
                <label className="block text-xs font-medium text-zinc-300 mb-1">Mass in Solar Masses (M☉):</label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={bhMassSol}
                  onChange={(e) => setBhMassSol(parseFloat(e.target.value) || 0.1)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                />
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  <button onClick={() => setBhMassSol(10)} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-cyan-300">Stellar (10 M☉)</button>
                  <button onClick={() => setBhMassSol(4.3e6)} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-cyan-300">Sgr A* (4.3M M☉)</button>
                  <button onClick={() => setBhMassSol(6.5e9)} className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-cyan-300">M87* (6.5B M☉)</button>
                </div>
              </div>
            </div>

            {(() => {
              // rs = 2GM / c² approx 2.95 km per solar mass
              const rsKm = bhMassSol * 2.953;
              const photonSphereKm = rsKm * 1.5;
              const rsAU = rsKm / KM_PER_AU;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase">Event Horizon (rs)</span>
                    <p className="text-base font-bold text-rose-400 mt-1">{rsKm < 1e6 ? `${rsKm.toFixed(2)} km` : `${rsKm.toExponential(3)} km`}</p>
                    <p className="text-[10px] text-zinc-400">{rsAU.toExponential(2)} AU</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase">Photon Sphere (1.5 rs)</span>
                    <p className="text-base font-bold text-amber-300 mt-1">{photonSphereKm < 1e6 ? `${photonSphereKm.toFixed(2)} km` : `${photonSphereKm.toExponential(3)} km`}</p>
                    <p className="text-[10px] text-zinc-400">Unstable light orbit</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase">ISCO (Non-rotating)</span>
                    <p className="text-base font-bold text-cyan-300 mt-1">{(rsKm * 3).toExponential(3)} km</p>
                    <p className="text-[10px] text-zinc-400">Innermost stable orbit (3 rs)</p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 6. STELLAR LUMINOSITY */}
        {activeCalc === 'luminosity' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                Stefan-Boltzmann Stellar Luminosity
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Stellar Radius R (Solar Radii R☉):</label>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={starRadiusSol}
                    onChange={(e) => setStarRadiusSol(parseFloat(e.target.value) || 0.01)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Effective Surface Temp T (Kelvin):</label>
                  <input
                    type="number"
                    min="500"
                    step="50"
                    value={starTempK}
                    onChange={(e) => setStarTempK(parseFloat(e.target.value) || 5778)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                  <span className="text-[10px] text-zinc-400">Sun T_eff = 5,778 K (Spectral type G2V)</span>
                </div>
              </div>
            </div>

            {(() => {
              // L / L_sun = (R / R_sun)^2 * (T / T_sun)^4
              const ratioT = starTempK / 5778;
              const luminosityRatio = Math.pow(starRadiusSol, 2) * Math.pow(ratioT, 4);

              return (
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Calculated Bolometric Luminosity:</span>
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono">
                    <p className="text-xl font-bold text-amber-300">{luminosityRatio < 1000 ? luminosityRatio.toFixed(3) : luminosityRatio.toExponential(3)} L☉</p>
                    <p className="text-[11px] text-zinc-400 mt-1">Times the radiant energy output of our Sun (3.828 × 10²⁶ Watts)</p>
                  </div>
                </div>
              );
            })()}

            <p className="text-[11px] text-zinc-400">
              Stefan-Boltzmann law: L = 4\pi R^2 \sigma T^4. Radiated flux scales with the fourth power of thermodynamic temperature.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
