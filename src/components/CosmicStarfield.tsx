import React, { useEffect, useRef } from 'react';

export const CosmicStarfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate stars
    const starCount = Math.min(Math.floor((width * height) / 3500), 240);
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      alphaChange: number;
      color: string;
      speedY: number;
    }> = [];

    const colors = ['#ffffff', '#a5b4fc', '#67e8f9', '#c4b5fd', '#fde047'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        alphaChange: (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 0.08 + 0.02,
      });
    }

    let t = 0;
    const render = () => {
      t += 0.005;
      ctx.clearRect(0, 0, width, height);

      // Deep space subtle gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#04091a');
      bgGrad.addColorStop(0.5, '#020510');
      bgGrad.addColorStop(1, '#010207');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw faint cosmic nebula cloud
      const nebGrad = ctx.createRadialGradient(
        width * 0.7 + Math.sin(t * 0.5) * 40,
        height * 0.25 + Math.cos(t * 0.5) * 30,
        0,
        width * 0.7,
        height * 0.25,
        width * 0.45
      );
      nebGrad.addColorStop(0, 'rgba(88, 28, 135, 0.12)'); // Deep violet
      nebGrad.addColorStop(0.5, 'rgba(14, 116, 144, 0.06)'); // Cyan
      nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      for (const s of stars) {
        s.alpha += s.alphaChange;
        if (s.alpha > 0.95 || s.alpha < 0.15) {
          s.alphaChange = -s.alphaChange;
        }
        s.y -= s.speedY;
        if (s.y < 0) s.y = height;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra twinkle glow on larger stars
        if (s.radius > 1.2) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = s.color;
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full"
      aria-hidden="true"
    />
  );
};
