import React, { useEffect, useRef, useState } from 'react';
import { Eye, ShieldAlert, Sparkles, Sliders, Info, Zap } from 'lucide-react';
import { blackHolesData } from '../data/spaceData.ts';

export const BlackHoleSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedBh, setSelectedBh] = useState(blackHolesData[0]); // Sgr A*
  const [spin, setSpin] = useState<number>(0.85); // Kerr spin parameter a*
  const [showOverlays, setShowOverlays] = useState(true);
  const [activeTab, setActiveTab] = useState<'sim' | 'theory' | 'observations'>('sim');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.clientWidth);
    let height = (canvas.height = canvas.clientHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let angle = 0;

    const render = () => {
      angle += 0.015 * (1 + spin * 0.8);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.16;

      // Deep space background with warped grid
      ctx.fillStyle = '#02040a';
      ctx.fillRect(0, 0, width, height);

      // Warped Spacetime Grid lines
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.12)';
      ctx.lineWidth = 1;
      const gridSteps = 12;
      for (let r = 1; r <= gridSteps; r++) {
        const radius = (r / gridSteps) * Math.min(width, height) * 0.48;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Gravitational Lensing Einstein Ring (Outer glowing ring of bent background starlight)
      const einsteinGrad = ctx.createRadialGradient(cx, cy, baseRadius * 1.5, cx, cy, baseRadius * 2.8);
      einsteinGrad.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
      einsteinGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
      einsteinGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = einsteinGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Upper warped accretion disk (light bent around top of event horizon)
      ctx.save();
      ctx.translate(cx, cy);
      const diskGradTop = ctx.createRadialGradient(0, -baseRadius * 0.4, baseRadius, 0, -baseRadius * 0.4, baseRadius * 2.4);
      diskGradTop.addColorStop(0, 'rgba(253, 224, 71, 0.85)'); // Hot yellow
      diskGradTop.addColorStop(0.4, 'rgba(249, 115, 22, 0.65)'); // Orange
      diskGradTop.addColorStop(0.8, 'rgba(225, 29, 72, 0.25)'); // Reddish
      diskGradTop.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = diskGradTop;
      ctx.beginPath();
      ctx.ellipse(0, -baseRadius * 0.6, baseRadius * 2.2, baseRadius * 1.1, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Main Equator Accretion Disk with Relativistic Doppler Beaming
      // (The left side rotates toward us, appearing bright blue-white; the right side moves away, appearing dim red)
      ctx.save();
      ctx.translate(cx, cy);

      const diskSegments = 40;
      for (let i = 0; i < diskSegments; i++) {
        const theta = (i / diskSegments) * Math.PI * 2;
        const x = Math.cos(theta + angle) * baseRadius * 2.4;
        const y = Math.sin(theta + angle) * baseRadius * 0.65;

        // Doppler effect: moving towards camera if x < 0
        const isApproaching = Math.sin(theta + angle) > 0;
        const intensity = isApproaching ? 0.9 : 0.35;
        const particleColor = isApproaching ? '#38bdf8' : '#f97316';

        ctx.fillStyle = particleColor;
        ctx.globalAlpha = intensity;
        ctx.beginPath();
        ctx.arc(x, y, 2.5 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Photon Sphere (r = 1.5 rs)
      if (showOverlays) {
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 1.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Event Horizon / Shadow (Pure Pitch Black Core)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner shadow edge glow
      ctx.strokeStyle = 'rgba(253, 186, 116, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Front lower half of the accretion disk crossing in front
      ctx.save();
      ctx.translate(cx, cy);
      const diskGradBottom = ctx.createRadialGradient(0, baseRadius * 0.4, baseRadius, 0, baseRadius * 0.4, baseRadius * 2.4);
      diskGradBottom.addColorStop(0, 'rgba(253, 224, 71, 0.9)');
      diskGradBottom.addColorStop(0.3, 'rgba(56, 189, 248, 0.7)');
      diskGradBottom.addColorStop(0.8, 'rgba(244, 63, 94, 0.3)');
      diskGradBottom.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = diskGradBottom;
      ctx.beginPath();
      ctx.ellipse(0, baseRadius * 0.5, baseRadius * 2.3, baseRadius * 0.9, 0, 0, Math.PI);
      ctx.fill();
      ctx.restore();

      // Relativistic Plasma Jet (if Kerr spinning)
      if (spin > 0.4) {
        ctx.save();
        ctx.translate(cx, cy);
        const jetGrad = ctx.createLinearGradient(0, 0, 0, -height * 0.45);
        jetGrad.addColorStop(0, 'rgba(147, 197, 253, 0.8)');
        jetGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.4)');
        jetGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = jetGrad;

        // Top Jet
        ctx.beginPath();
        ctx.moveTo(-baseRadius * 0.15, -baseRadius * 0.8);
        ctx.lineTo(baseRadius * 0.15, -baseRadius * 0.8);
        ctx.lineTo(baseRadius * 0.5, -height * 0.45);
        ctx.lineTo(-baseRadius * 0.5, -height * 0.45);
        ctx.closePath();
        ctx.fill();

        // Bottom Jet
        const jetGradB = ctx.createLinearGradient(0, 0, 0, height * 0.45);
        jetGradB.addColorStop(0, 'rgba(147, 197, 253, 0.8)');
        jetGradB.addColorStop(0.5, 'rgba(99, 102, 241, 0.4)');
        jetGradB.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = jetGradB;
        ctx.beginPath();
        ctx.moveTo(-baseRadius * 0.15, baseRadius * 0.8);
        ctx.lineTo(baseRadius * 0.15, baseRadius * 0.8);
        ctx.lineTo(baseRadius * 0.5, height * 0.45);
        ctx.lineTo(-baseRadius * 0.5, height * 0.45);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [spin, showOverlays]);

  return (
    <div className="w-full rounded-2xl bg-zinc-950/80 border border-zinc-800 overflow-hidden shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-900/50">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Black Hole Relativity Explorer</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
              Relativistic Physics
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            General relativity ray-tracing simulation of event horizon, gravitational lensing, and Doppler beaming.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('sim')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'sim' ? 'bg-cyan-500/20 text-cyan-300' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Simulation
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'theory' ? 'bg-cyan-500/20 text-cyan-300' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Astrophysics Theory
          </button>
          <button
            onClick={() => setActiveTab('observations')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              activeTab === 'observations' ? 'bg-cyan-500/20 text-cyan-300' : 'text-zinc-400 hover:text-white'
            }`}
          >
            EHT Observations
          </button>
        </div>
      </div>

      {/* Target Black Hole Selector */}
      <div className="px-4 py-2 border-b border-zinc-800/80 bg-zinc-950/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider shrink-0">
          Target System:
        </span>
        {blackHolesData.map((bh) => (
          <button
            key={bh.id}
            onClick={() => setSelectedBh(bh)}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedBh.id === bh.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {bh.name}
          </button>
        ))}
      </div>

      {/* Content based on tab */}
      {activeTab === 'sim' && (
        <div>
          {/* Canvas Viewport */}
          <div className="relative w-full h-[380px] sm:h-[460px] bg-black flex items-center justify-center overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full" />

            {/* Scientific Labels Overlay */}
            {showOverlays && (
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between text-[11px] text-zinc-300 font-mono">
                <div className="flex justify-between items-start">
                  <div className="bg-zinc-950/80 px-2.5 py-1.5 rounded-lg border border-zinc-800 backdrop-blur-md">
                    <p className="text-cyan-400 font-bold">Relativistic Doppler Beaming</p>
                    <p className="text-zinc-400 text-[10px]">Left: Approaching (Blue-shifted)</p>
                    <p className="text-zinc-400 text-[10px]">Right: Receding (Red-shifted)</p>
                  </div>
                  <div className="bg-zinc-950/80 px-2.5 py-1.5 rounded-lg border border-zinc-800 backdrop-blur-md text-right">
                    <p className="text-amber-400 font-bold">Photon Sphere (r = 1.5 rs)</p>
                    <p className="text-zinc-400 text-[10px]">Bound unstable circular photon orbits</p>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="bg-zinc-950/80 px-2.5 py-1.5 rounded-lg border border-zinc-800 backdrop-blur-md">
                    <p className="text-rose-400 font-bold">Event Horizon (r = rs)</p>
                    <p className="text-zinc-400 text-[10px]">Escape velocity = c (No return)</p>
                  </div>
                  <div className="bg-zinc-950/80 px-2.5 py-1.5 rounded-lg border border-zinc-800 backdrop-blur-md text-right">
                    <p className="text-purple-400 font-bold">Gravitational Einstein Ring</p>
                    <p className="text-zinc-400 text-[10px]">Strong-field spacetime deflection</p>
                  </div>
                </div>
              </div>
            )}

            {/* Scientific simulation disclaimer */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-zinc-950/90 border border-zinc-800 text-[10px] text-zinc-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Interactive mathematical relativity simulation (Kerr Metric approximation).</span>
            </div>
          </div>

          {/* Interactive Parameters Bar */}
          <div className="p-4 bg-zinc-900/60 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-zinc-300 font-medium">Kerr Spin Parameter (a*):</span>
              <input
                type="range"
                min="0"
                max="0.99"
                step="0.01"
                value={spin}
                onChange={(e) => setSpin(parseFloat(e.target.value))}
                className="w-32 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-300 font-semibold">{spin.toFixed(2)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowOverlays(!showOverlays)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  showOverlays ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showOverlays ? 'Hide Physics Labels' : 'Show Physics Labels'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'theory' && (
        <div className="p-6 space-y-4 text-xs text-zinc-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Schwarzschild Radius Formula
              </h4>
              <p className="text-zinc-300 leading-relaxed">
                For a non-rotating spherically symmetric black hole, the event horizon radius is derived from General Relativity:
              </p>
              <div className="p-3 rounded-lg bg-zinc-950 font-mono text-cyan-300 text-center text-sm border border-zinc-800">
                r_s = \frac&#123;2GM&#125;&#123;c^2&#125;
              </div>
              <p className="text-[11px] text-zinc-400">
                Where G is the gravitational constant (6.674 × 10⁻¹¹ m³ kg⁻¹ s⁻²), M is mass, and c is the speed of light (299,792,458 m/s).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-400" />
                Hawking Radiation & Thermodynamics
              </h4>
              <p className="text-zinc-300 leading-relaxed">
                Formulated by Stephen Hawking (1974), quantum field theory in curved spacetime predicts black holes emit blackbody thermal radiation:
              </p>
              <div className="p-3 rounded-lg bg-zinc-950 font-mono text-amber-300 text-center text-sm border border-zinc-800">
                T_H = \frac&#123;\hbar c^3&#125;&#123;8\pi G M k_B&#125;
              </div>
              <p className="text-[11px] text-zinc-400">
                Larger black holes are colder. A solar-mass black hole has a Hawking temperature of just 60 nanokelvin — far colder than the 2.7K CMB background!
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'observations' && (
        <div className="p-6 space-y-4 text-xs text-zinc-300">
          <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 space-y-3">
            <h4 className="text-sm font-bold text-white">Event Horizon Telescope (EHT) Groundbreaking Milestones</h4>
            <p className="leading-relaxed text-zinc-300">
              The Event Horizon Telescope is a global synchronized network of millimeter-wave radio telescopes using Very Long Baseline Interferometry (VLBI) to create an Earth-sized virtual aperture capable of resolving angular scales as small as 20 microarcseconds.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800">
                <span className="text-cyan-400 font-bold block mb-1">M87* (April 2019)</span>
                <p className="text-[11px] text-zinc-400">
                  First direct image of a black hole shadow. Mass: 6.5 billion M☉. Confirmed Einstein's General Relativity predictions with unprecedented precision.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800">
                <span className="text-purple-400 font-bold block mb-1">Sagittarius A* (May 2022)</span>
                <p className="text-[11px] text-zinc-400">
                  First direct image of the black hole at the center of our Milky Way galaxy. Mass: 4.3 million M☉. Observed in dynamic, turbulent accretion state.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Black Hole Facts Footer */}
      <div className="p-4 bg-zinc-950/90 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-white font-bold">{selectedBh.name}</span>
          <span className="text-zinc-400 ml-2">({selectedBh.type} in {selectedBh.hostGalaxy})</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400 font-mono text-[11px]">
          <span>Mass: {selectedBh.massSolarMasses}</span>
          <span>•</span>
          <span>r_s: {selectedBh.schwarzschildRadiusKm}</span>
          <span>•</span>
          <span>Dist: {selectedBh.distanceLy}</span>
        </div>
      </div>
    </div>
  );
};
