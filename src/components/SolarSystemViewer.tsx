import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Info, Sparkles, Layers, Sliders, Globe } from 'lucide-react';
import { celestialBodiesData, CelestialBody } from '../data/spaceData.ts';

interface SolarSystemViewerProps {
  onSelectBody?: (body: CelestialBody) => void;
  selectedBodyId?: string;
}

export const SolarSystemViewer: React.FC<SolarSystemViewerProps> = ({
  onSelectBody,
  selectedBodyId = 'earth',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [is2DMode, setIs2DMode] = useState(false);
  const [activeBody, setActiveBody] = useState<CelestialBody>(
    celestialBodiesData.find((b) => b.id === selectedBodyId) || celestialBodiesData[3]
  );
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);

  // Keep ref for animation loop
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const speedRef = useRef(speedMultiplier);
  speedRef.current = speedMultiplier;

  // Selected planet state
  const handleSelectPlanet = (body: CelestialBody) => {
    setActiveBody(body);
    if (onSelectBody) onSelectBody(body);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container || is2DMode) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 500;

    // Detect software WebGL per Three.js directives
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.003);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000);
    camera.position.set(0, 50, 75);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Ambient & Point light from Sun
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xfffaed, 2.5, 300, 0.5);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Celestial Mesh Objects
    const planetsConfig = [
      { id: 'mercury', radius: 0.9, dist: 10, speed: 0.04, color: 0x9e9e9e },
      { id: 'venus', radius: 1.4, dist: 16, speed: 0.025, color: 0xe0a96d },
      { id: 'earth', radius: 1.6, dist: 23, speed: 0.018, color: 0x2b82c9 },
      { id: 'mars', radius: 1.1, dist: 30, speed: 0.013, color: 0xc1440e },
      { id: 'jupiter', radius: 3.8, dist: 42, speed: 0.007, color: 0xc88b3a },
      { id: 'saturn', radius: 3.2, dist: 55, speed: 0.005, color: 0xe2bf7d, hasRing: true },
      { id: 'uranus', radius: 2.2, dist: 68, speed: 0.003, color: 0x4b70dd, hasRing: true },
      { id: 'neptune', radius: 2.1, dist: 80, speed: 0.002, color: 0x274687 },
      { id: 'pluto', radius: 0.6, dist: 90, speed: 0.0015, color: 0xc39b77 },
    ];

    // The Sun
    const sunGeom = new THREE.SphereGeometry(4.8, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffbb22 });
    const sunMesh = new THREE.Mesh(sunGeom, sunMat);
    scene.add(sunMesh);

    // Sun outer glow mesh
    const glowGeom = new THREE.SphereGeometry(5.4, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff8800,
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeom, glowMat);
    scene.add(glowMesh);

    const planetMeshes: Array<{
      id: string;
      dist: number;
      speed: number;
      angle: number;
      pivot: THREE.Group;
      mesh: THREE.Mesh;
    }> = [];

    // Build orbits and planets
    planetsConfig.forEach((p) => {
      // Orbit circle line
      const orbitPoints: THREE.Vector3[] = [];
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(Math.cos(theta) * p.dist, 0, Math.sin(theta) * p.dist));
      }
      const orbitGeom = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x334155,
        transparent: true,
        opacity: 0.35,
      });
      const orbitLine = new THREE.LineLoop(orbitGeom, orbitMat);
      scene.add(orbitLine);

      // Planet pivot
      const pivot = new THREE.Group();
      scene.add(pivot);

      // Planet mesh
      const pGeom = new THREE.SphereGeometry(p.radius, 24, 24);
      const pMat = new THREE.MeshStandardMaterial({
        color: p.color,
        roughness: 0.8,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(pGeom, pMat);
      mesh.position.set(p.dist, 0, 0);
      pivot.add(mesh);

      // Special Saturn / Uranus Ring
      if (p.hasRing) {
        const ringGeom = new THREE.RingGeometry(p.radius * 1.4, p.radius * 2.3, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: p.color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        mesh.add(ringMesh);
      }

      // Earth Moon
      if (p.id === 'earth') {
        const moonGeom = new THREE.SphereGeometry(0.35, 16, 16);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        const moonMesh = new THREE.Mesh(moonGeom, moonMat);
        moonMesh.position.set(2.4, 0, 0);
        mesh.add(moonMesh);
      }

      planetMeshes.push({
        id: p.id,
        dist: p.dist,
        speed: p.speed,
        angle: Math.random() * Math.PI * 2,
        pivot,
        mesh,
      });
    });

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Drag-to-rotate interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = 0;
    let sphericalPhi = Math.PI / 4;
    let camRadius = 85;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      sphericalTheta -= deltaX * 0.007;
      sphericalPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, sphericalPhi + deltaY * 0.007));
    };
    const onMouseUp = () => {
      isDragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camRadius = Math.max(25, Math.min(180, camRadius + e.deltaY * 0.06));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isPlayingRef.current) {
        // Spin the Sun
        sunMesh.rotation.y += 0.004 * speedRef.current;

        // Orbit planets
        planetMeshes.forEach((p) => {
          p.angle += p.speed * speedRef.current * (delta * 60);
          p.pivot.rotation.y = p.angle;
          p.mesh.rotation.y += 0.02 * speedRef.current;
        });
      }

      // Camera position from spherical coords
      camera.position.x = camRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      camera.position.y = camRadius * Math.cos(sphericalPhi);
      camera.position.z = camRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);

      renderer.dispose();
      sunGeom.dispose();
      sunMat.dispose();
      glowGeom.dispose();
      glowMat.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [is2DMode]);

  return (
    <div className="relative w-full rounded-2xl bg-zinc-950/80 border border-zinc-800/80 overflow-hidden shadow-2xl flex flex-col">
      {/* Top Header & Planet Selector */}
      <div className="p-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-900/50 backdrop-blur-sm z-10">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Interactive Solar System</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
              3D Real-time
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Drag to rotate orbital plane • Scroll to zoom • Select planets below
          </p>
        </div>

        {/* 2D / 3D Mode Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIs2DMode(!is2DMode)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{is2DMode ? 'Switch to 3D View' : '2D Schematic'}</span>
          </button>
        </div>
      </div>

      {/* Planet Quick Pills */}
      <div className="px-4 py-2 border-b border-zinc-800/60 bg-zinc-950/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none z-10">
        {celestialBodiesData.map((body) => {
          const isSelected = activeBody.id === body.id;
          return (
            <button
              key={body.id}
              onClick={() => handleSelectPlanet(body)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                  : 'bg-zinc-900/70 text-zinc-400 hover:text-white hover:bg-zinc-800/80 border border-zinc-800'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: body.color }}
              />
              <span>{body.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main 3D Viewport or 2D Schematic */}
      <div className="relative w-full h-[440px] sm:h-[500px] bg-zinc-950 flex items-center justify-center select-none overflow-hidden">
        {!is2DMode ? (
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        ) : (
          /* 2D Schematic Fallback View */
          <div className="w-full h-full p-6 flex flex-col items-center justify-center space-y-6 overflow-x-auto">
            <div className="flex items-center gap-3 overflow-x-auto max-w-full pb-4">
              {celestialBodiesData.map((body) => (
                <button
                  key={body.id}
                  onClick={() => handleSelectPlanet(body)}
                  className={`flex flex-col items-center p-3 rounded-xl border transition-all shrink-0 ${
                    activeBody.id === body.id
                      ? 'bg-cyan-500/15 border-cyan-500 text-white'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full mb-2 flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: body.color }}
                  >
                    <span className="text-[10px] font-bold text-zinc-950">{body.name[0]}</span>
                  </div>
                  <span className="text-xs font-medium">{body.name}</span>
                  <span className="text-[10px] text-zinc-400">{body.orbitalDistanceAU} AU</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-400 text-center max-w-md">
              2D schematic projection for low-power devices. Distances are ordered by semi-major axis.
            </p>
          </div>
        )}

        {/* Scale Disclaimer Badge */}
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-[10px] text-zinc-400 max-w-xs flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Note: Planetary sizes & distances scaled for interactive legibility.</span>
        </div>

        {/* Unified Bottom Control Dock (Three.js Skill Directive) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-[94vw] w-full max-w-md">
          <div className="rounded-2xl bg-zinc-950/90 border border-zinc-800/90 shadow-2xl p-2.5 backdrop-blur-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold transition-all"
                title={isPlaying ? 'Pause simulation' : 'Play simulation'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <span className="text-zinc-300 font-medium ml-1">
                {isPlaying ? 'Orbiting' : 'Paused'}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              <span className="text-[10px] text-zinc-400 px-1">Speed:</span>
              {[0.5, 1, 3, 10].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeedMultiplier(s)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-colors ${
                    speedMultiplier === s
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

      {/* Selected Planet Details Drawer / Panel */}
      {activeBody && (
        <div className="p-5 sm:p-6 bg-zinc-900/70 border-t border-zinc-800 text-xs space-y-4 animate-in fade-in">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
                  style={{ backgroundColor: activeBody.color }}
                />
                <h4 className="text-lg font-bold text-white tracking-tight">{activeBody.name}</h4>
                <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-cyan-400 text-[10px] font-medium border border-zinc-700">
                  {activeBody.type}
                </span>
              </div>
              <p className="text-zinc-300 mt-1 max-w-2xl text-[13px] leading-relaxed">
                {activeBody.description}
              </p>
            </div>
          </div>

          {/* Grid of verified scientific specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Diameter</span>
              <p className="text-sm font-bold text-white mt-0.5">
                {activeBody.diameterKm.toLocaleString()} km
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Surface Gravity</span>
              <p className="text-sm font-bold text-white mt-0.5">{activeBody.gravityMs2} m/s²</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Orbital Period</span>
              <p className="text-sm font-bold text-white mt-0.5">
                {activeBody.orbitalPeriodDays > 0 ? `${activeBody.orbitalPeriodDays} Earth days` : 'N/A (Sun)'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Known Moons</span>
              <p className="text-sm font-bold text-white mt-0.5">{activeBody.moonsCount}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/80">
              <span className="text-[10px] text-cyan-400 font-semibold uppercase">Surface & Atmosphere</span>
              <p className="text-zinc-300 mt-1 text-[11px] leading-relaxed">
                {activeBody.surfaceFeatures}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {activeBody.atmosphere.map((gas, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 border border-zinc-700/60"
                  >
                    {gas}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/80">
              <span className="text-[10px] text-emerald-400 font-semibold uppercase">Scientific Discovery</span>
              <p className="text-zinc-300 mt-1 text-[11px] leading-relaxed">
                {activeBody.scientificDiscovery}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
