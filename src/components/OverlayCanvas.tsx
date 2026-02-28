import React, { useRef, useEffect } from 'react';
import { OverlayInstruction } from '../types';

interface OverlayCanvasProps {
  instructions: OverlayInstruction[];
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const OverlayCanvas: React.FC<OverlayCanvasProps> = ({ instructions, videoRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !videoRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!videoRef.current) return;
      
      // Sync canvas size with video display size
      const { clientWidth, clientHeight } = videoRef.current;
      if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
        canvas.width = clientWidth;
        canvas.height = clientHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      instructions.forEach((inst) => {
        const x = (inst.x || 0) * (canvas.width / 100);
        const y = (inst.y || 0) * (canvas.height / 100);
        const w = (inst.width || 10) * (canvas.width / 100);
        const h = (inst.height || 10) * (canvas.height / 100);
        const color = inst.color || '#00f2ff';

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';

        switch (inst.type) {
          case 'highlight':
            ctx.strokeRect(x, y, w, h);
            ctx.fillStyle = `${color}22`;
            ctx.fillRect(x, y, w, h);
            break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(x + w / 2, y + h / 2, Math.max(w, h) / 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = `${color}22`;
            ctx.fill();
            break;
          case 'arrow':
            const headlen = 15;
            const tox = x + w;
            const toy = y + h;
            const angle = Math.atan2(toy - y, tox - x);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(tox, toy);
            ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(tox, toy);
            ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
            break;
          case 'label':
            ctx.font = 'bold 16px Inter';
            const textWidth = ctx.measureText(inst.label || '').width;
            ctx.fillStyle = color;
            ctx.fillRect(x, y - 25, textWidth + 10, 25);
            ctx.fillStyle = '#000';
            ctx.fillText(inst.label || '', x + 5, y - 7);
            break;
        }
      });

      requestAnimationFrame(draw);
    };

    const animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [instructions, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
    />
  );
};
