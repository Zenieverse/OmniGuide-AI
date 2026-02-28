import React, { useState, useRef, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'motion/react';
import { CameraView } from './components/CameraView';
import { VoiceInput } from './components/VoiceInput';
import { OverlayCanvas } from './components/OverlayCanvas';
import { ModeSelector } from './components/ModeSelector';
import { AgentResponsePanel } from './components/AgentResponsePanel';
import { HistoryPanel } from './components/HistoryPanel';
import { SettingsModal } from './components/SettingsModal';
import { AppMode, GeminiResponse, OverlayInstruction, Message, AppSettings, AgentStatus } from './types';
import { Sparkles, Info, Play, Github, History as HistoryIcon, Settings as SettingsIcon, Camera, LayoutGrid, Activity, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.GENERAL);
  const [status, setStatus] = useState<AgentStatus>(AgentStatus.IDLE);
  const [response, setResponse] = useState<string>('');
  const [overlays, setOverlays] = useState<OverlayInstruction[]>([]);
  const [history, setHistory] = useState<Message[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    voiceEnabled: true,
    autoAnalyze: false,
    cameraResolution: '720p'
  });
  
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    (window as any).clearHistory = () => {
      socketRef.current?.emit('clear_history', sessionId);
      setHistory([]);
    };
  }, [sessionId]);

  useEffect(() => {
    socketRef.current = io();

    socketRef.current.on('response', (data: GeminiResponse & { history: Message[] }) => {
      setResponse(data.analysis);
      setOverlays(data.overlay || []);
      setHistory(data.history);
      setStatus(AgentStatus.SPEAKING);
      
      // Reset status after a while if not speaking
      setTimeout(() => setStatus(AgentStatus.IDLE), 5000);
    });

    socketRef.current.on('history', (data: Message[]) => {
      setHistory(data);
    });

    socketRef.current.on('error', (err) => {
      console.error('Socket error:', err);
      setStatus(AgentStatus.ERROR);
    });

    // Request initial history
    socketRef.current.emit('get_history', sessionId);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [sessionId]);

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
    
    setStatus(AgentStatus.THINKING);
    const frame = captureFrame();
    
    if (frame && socketRef.current) {
      socketRef.current.emit('analyze', {
        image: frame,
        speech: text,
        mode,
        sessionId
      });
    } else {
      setStatus(AgentStatus.ERROR);
      setResponse("Vision required. Please ensure camera access is granted.");
    }
  };

  const runDemo = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981']
    });
    
    const demos = {
      [AppMode.APPLIANCE_FIXER]: "Identify the components of this device.",
      [AppMode.HOMEWORK_TUTOR]: "Help me understand this problem.",
      [AppMode.COOKING_ASSISTANT]: "What can I cook with these?",
      [AppMode.GENERAL]: "Describe the scene in front of me."
    };
    
    handleSpeech(demos[mode]);
  };

  const triggerManualCapture = () => {
    handleSpeech("Analyze this scene for me.");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[150px] rounded-full" 
        />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-6 flex flex-col items-center gap-6 max-w-6xl">
        {/* Top Navigation Bar */}
        <header className="w-full flex items-center justify-between gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="p-2.5 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tighter">OmniGuide AI</h1>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${status === AgentStatus.ERROR ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">System Active</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ModeSelector currentMode={mode} onModeChange={setMode} />
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all relative"
            >
              <HistoryIcon className="w-5 h-5 text-white/60" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#050505]">
                  {Math.min(history.length / 2, 9)}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            >
              <SettingsIcon className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Vision & Tools */}
          <section className="lg:col-span-8 space-y-4 flex flex-col">
            <div className="relative flex-1 min-h-[400px]">
              <CameraView videoRef={videoRef} isActive={true} />
              <OverlayCanvas instructions={overlays} videoRef={videoRef} />
              
              {/* Floating Camera Controls */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={triggerManualCapture}
                  className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl group"
                >
                  <Camera className="w-6 h-6 text-white group-hover:text-indigo-400 transition-colors" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={runDemo}
                  className="p-4 bg-indigo-500 border border-indigo-400 rounded-2xl shadow-2xl shadow-indigo-500/40 group"
                >
                  <Play className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              {/* Status Indicator Overlay */}
              <div className="absolute top-6 right-6 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-3">
                <Activity className={`w-4 h-4 ${status === AgentStatus.THINKING ? 'text-indigo-400 animate-spin' : 'text-white/40'}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                  {status === AgentStatus.IDLE ? 'Ready' : status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-3xl flex items-center gap-4">
                <div className="p-2 bg-indigo-500/20 rounded-xl">
                  <LayoutGrid className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Mode</p>
                  <p className="text-sm font-bold">{mode.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-3xl flex items-center gap-4">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Latency</p>
                  <p className="text-sm font-bold">~1.1s</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-3xl flex items-center gap-4">
                <div className="p-2 bg-orange-500/20 rounded-xl">
                  <Info className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Session</p>
                  <p className="text-sm font-bold">#{sessionId}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Right: Interaction & Response */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex-1 flex flex-col items-center justify-center gap-10 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative">
                <motion.div
                  animate={{
                    scale: status === AgentStatus.THINKING ? [1, 1.2, 1] : 1,
                    rotate: status === AgentStatus.THINKING ? 360 : 0,
                    opacity: status === AgentStatus.THINKING ? 0.8 : 0.4
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className={`w-40 h-40 rounded-full blur-3xl ${
                    status === AgentStatus.THINKING ? 'bg-indigo-500' : 'bg-indigo-400'
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center backdrop-blur-2xl shadow-2xl ${
                    status === AgentStatus.THINKING ? 'animate-pulse border-indigo-500/50' : ''
                  }`}>
                    <Sparkles className={`w-8 h-8 ${status === AgentStatus.THINKING ? 'text-indigo-400' : 'text-white/40'}`} />
                  </div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">How can I help?</h3>
                <p className="text-sm text-white/40 px-4">Speak naturally or use the manual capture button to analyze the scene.</p>
              </div>

              <VoiceInput 
                onSpeech={handleSpeech} 
                isProcessing={status === AgentStatus.THINKING} 
              />
            </div>

            <AgentResponsePanel 
              response={response} 
              isProcessing={status === AgentStatus.THINKING} 
              voiceEnabled={settings.voiceEnabled}
            />
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full pt-8 pb-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-widest text-white/20">
          <div className="flex items-center gap-6">
            <p>© 2026 OmniGuide AI</p>
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Gemini 2.5 Flash Engine
            </span>
            <a href="https://github.com" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </footer>
      </main>

      {/* Overlays */}
      <HistoryPanel 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        messages={history} 
      />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings} 
        onSettingsChange={setSettings} 
      />
    </div>
  );
}
