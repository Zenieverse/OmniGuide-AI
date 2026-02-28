import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({ videoRef, isActive }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black/40 rounded-3xl overflow-hidden border border-white/10 shadow-inner group">
      {isActive ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Live Vision</span>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/20">
          <CameraOff className="w-16 h-16" />
          <p className="text-sm font-medium">Camera is inactive</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 text-center">
          <div className="space-y-4">
            <p className="text-red-400 font-medium">{error}</p>
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors mx-auto"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-3xl pointer-events-none" />
    </div>
  );
};
