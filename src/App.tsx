import React, { useState, useRef, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'motion/react';
import { CameraView } from './components/CameraView';
import { VoiceInput } from './components/VoiceInput';
import { OverlayCanvas } from './components/OverlayCanvas';
import { ModeSelector } from './components/ModeSelector';
import { AgentResponsePanel } from './components/AgentResponsePanel';
import { AppMode, GeminiResponse, OverlayInstruction } from './types';
import { Sparkles, Info, Play, Github } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERAL);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [overlays, setOverlays] = useState<OverlayInstruction[]>([]);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io();

    socketRef.current.on('response', (data: GeminiResponse) => {
      setResponse(data.analysis);
      setOverlays(data.overlay || []);
      setIsProcessing(false);
    });

    socketRef.current.on('error', (err) => {
      console.error('Socket error:', err);
      setIsProcessing(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const handleSpeech = (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    const frame = captureFrame();
    
    if (frame && socketRef.current) {
      socketRef.current.emit('analyze', {
        image: frame,
        speech: text,
        mode,
        sessionId
      });
    } else {
      setIsProcessing(false);
      setResponse("I need to see through your camera to help you. Please make sure it's enabled.");
    }
  };

  const runDemo = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899']
    });
    
    const demos = {
      [AppMode.APPLIANCE_FIXER]: "Why is my sink leaking?",
      [AppMode.HOMEWORK_TUTOR]: "Can you solve this math problem?",
      [AppMode.COOKING_ASSISTANT]: "What can I make with these ingredients?",
      [AppMode.GENERAL]: "What do you see in front of me?"
    };
    
    handleSpeech(demos[mode]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center gap-8 max-w-5xl">
        {/* Header */}
        <header className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                OmniGuide AI
              </h1>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400/80">
                Multimodal Live Agent
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ModeSelector currentMode={mode} onModeChange={setMode} />
            <button 
              onClick={runDemo}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
              title="Run Demo Scenario"
            >
              <Play className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>

        {/* Main Interface */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Vision */}
          <section className="lg:col-span-7 space-y-6">
            <div className="relative">
              <CameraView videoRef={videoRef} isActive={true} />
              <OverlayCanvas instructions={overlays} videoRef={videoRef} />
            </div>
            
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-white/40">
                <Info className="w-4 h-4" />
                <span className="text-xs font-medium">Point your camera and speak naturally</span>
              </div>
              <div className="flex items-center gap-4">
                <a href="#" className="text-white/20 hover:text-white/40 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </section>

          {/* Right Column: Interaction */}
          <section className="lg:col-span-5 flex flex-col gap-8 h-full">
            <div className="flex-1 flex flex-col items-center justify-center gap-12 py-8">
              {/* AI Orb Animation */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: isProcessing ? [1, 1.2, 1] : 1,
                    rotate: isProcessing ? 360 : 0,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`w-32 h-32 rounded-full blur-2xl opacity-50 ${
                    isProcessing ? 'bg-indigo-500' : 'bg-indigo-400/30'
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center backdrop-blur-xl ${
                    isProcessing ? 'animate-pulse' : ''
                  }`}>
                    <Sparkles className={`w-6 h-6 ${isProcessing ? 'text-indigo-400' : 'text-white/20'}`} />
                  </div>
                </div>
              </div>

              <VoiceInput onSpeech={handleSpeech} isProcessing={isProcessing} />
            </div>

            <AgentResponsePanel response={response} isProcessing={isProcessing} />
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full pt-12 pb-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
          <p>© 2026 OmniGuide AI • Gemini Live Agent Challenge</p>
          <div className="flex gap-6">
            <span className="hover:text-indigo-400/60 cursor-help transition-colors">Latency: ~1.2s</span>
            <span className="hover:text-indigo-400/60 cursor-help transition-colors">Model: Gemini 2.5 Flash</span>
            <span className="hover:text-indigo-400/60 cursor-help transition-colors">Status: Operational</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
