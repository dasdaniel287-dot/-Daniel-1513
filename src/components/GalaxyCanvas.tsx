import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Layers, Sliders, Info, Eye } from 'lucide-react';
import { GalaxyItem, galaxiesData } from '../data/spaceData.ts';

interface GalaxyCanvasProps {
  galaxy?: GalaxyItem;
  onSelectGalaxy?: (g: GalaxyItem) => void;
}

export const GalaxyCanvas: React.FC<GalaxyCanvasProps> = ({
  galaxy = galaxiesData[0],
  onSelectGalaxy,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeGalaxy, setActiveGalaxy] = useState<GalaxyItem>(galaxy);
  const [armCount, setArmCount] = useState<number>(2);
  const [spinSpeed, setSpinSpeed] = useState<number>(1);
  const [coreIntensity, setCoreIntensity] = useState<number>(1);

  // Sync prop changes
  useEffect(() => {
    setActiveGalaxy(galaxy);
    if (galaxy.type === 'Barred Spiral') setArmCount(2);
    else if (galaxy.type === 'Spiral') setArmCount(4);
    else if (galaxy.type === 'Elliptical') setArmCount(0);
  }, [galaxy]);

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

    // Generate procedural stars for this galaxy
    const starCount = 3500;
    const stars: Array<{
      dist: number;
      angle: number;
      speed: number;
      size: number;
      color: string;
      alpha: number;
      armOffset: number;
    }> = [];

    const colors = ['#ffffff', '#a5b4fc', '#38bdf8', '#c084fc', '#fde047', '#f43f5e'];

    for (let i = 0; i < starCount; i++) {
      // Density wave distribution
      const r = Math.pow(Math.random(), 2.2) * (Math.min(width, height) * 0.44);
      const chosenArm = Math.floor(Math.random() * Math.max(1, armCount));
      const armAngle = (chosenArm * (2 * Math.PI)) / Math.max(1, armCount);
      // Logarithmic spiral: theta = a * ln(r)
      const spiralTheta = Math.log(r + 10) * 2.8;
      const dispersion = (Math.random() - 0.5) * (0.35 + r * 0.003);

      stars.push({
        dist: r,
        angle: armAngle + spiralTheta + dispersion,
        speed: (0.002 / (Math.sqrt(r + 1) * 0.1 + 1)) * spinSpeed,
        size: Math.random() * 1.5 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        armOffset: dispersion,
      });
    }

    let t = 0;

    const render = () => {
      t += 0.005 * spinSpeed;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Dark cosmos background
      ctx.fillStyle = '#02040b';
      ctx.fillRect(0, 0, width, height);

      // Central Bulge Glowing Core
      const coreRadius = Math.min(width, height) * 0.18;
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
      coreGrad.addColorStop(0, `rgba(254, 240, 138, ${0.9 * coreIntensity})`); // Warm stellar core
      coreGrad.addColorStop(0.3, `rgba(216, 180, 254, ${0.5 * coreIntensity})`); // Violet halo
      coreGrad.addColorStop(0.7, `rgba(56, 189, 248, ${0.2 * coreIntensity})`); // Cyan ionized gas
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Barred spiral central bar if applicable
      if (activeGalaxy.type === 'Barred Spiral') {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.4);
        const barGrad = ctx.createLinearGradient(-coreRadius * 1.2, 0, coreRadius * 1.2, 0);
        barGrad.addColorStop(0, 'rgba(254, 240, 138, 0)');
        barGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.7)');
        barGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = barGrad;
        ctx.fillRect(-coreRadius * 1.2, -12, coreRadius * 2.4, 24);
        ctx.restore();
      }

      // Draw all stars orbiting in the density wave
      for (const s of stars) {
        s.angle += s.speed;

        const x = cx + Math.cos(s.angle) * s.dist;
        const y = cy + Math.sin(s.angle) * s.dist * 0.65; // Tilted perspective

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
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
  }, [activeGalaxy, armCount, spinSpeed, coreIntensity]);

  const handleSelect = (g: GalaxyItem) => {
    setActiveGalaxy(g);
    if (onSelectGalaxy) onSelectGalaxy(g);
  };

  return (
    <div className="w-full rounded-2xl bg-zinc-950/80 border border-zinc-800 overflow-hidden shadow-2xl flex flex-col">
      {/* Top Controls */}
      <div className="p-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-900/50">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Interactive Galaxy Morphology</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
              Density Wave Model
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Real-time Lin-Shu density wave simulation of galactic spiral arms and bulge kinematics.
          </p>
        </div>

        {/* Quick galaxy buttons */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs overflow-x-auto">
          {galaxiesData.map((g) => (
            <button
              key={g.id}
              onClick={() => handleSelect(g)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeGalaxy.id === g.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {g.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Galaxy Canvas */}
      <div className="relative w-full h-[380px] sm:h-[450px] bg-black flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Active Galaxy HUD Card */}
        <div className="absolute top-4 left-4 z-10 max-w-xs p-3.5 rounded-xl bg-zinc-950/85 backdrop-blur-md border border-zinc-800 text-xs space-y-1.5 shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-white text-sm">{activeGalaxy.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300 font-mono">
              {activeGalaxy.hubbleClass}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 line-clamp-2">{activeGalaxy.description}</p>
          <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-800/80">
            <span>Dist: {activeGalaxy.distanceMly} Mly</span>
            <span>Dia: {activeGalaxy.diameterKly} kly</span>
            <span>Stars: {activeGalaxy.estimatedStars}</span>
          </div>
        </div>

        {/* Bottom controls dock */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-[94vw] w-full max-w-md">
          <div className="rounded-2xl bg-zinc-950/90 border border-zinc-800 shadow-2xl p-2.5 backdrop-blur-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-[11px]">Spiral Arms:</span>
              {[2, 3, 4, 6].map((arms) => (
                <button
                  key={arms}
                  onClick={() => setArmCount(arms)}
                  className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-colors ${
                    armCount === arms
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {arms}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-[11px]">Rotation:</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpinSpeed(s)}
                  className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-colors ${
                    spinSpeed === s
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
