import React, { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Volume2, Share2 } from 'lucide-react';

interface AgentResponsePanelProps {
  response: string;
  isProcessing: boolean;
  voiceEnabled: boolean;
}

export const AgentResponsePanel: React.FC<AgentResponsePanelProps> = ({ response, isProcessing, voiceEnabled }) => {
  const speakRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (response && voiceEnabled) {
      // Stop current speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Try to find a nice female voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Female')) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      window.speechSynthesis.speak(utterance);
      speakRef.current = utterance;
    } else if (!voiceEnabled) {
      window.speechSynthesis.cancel();
    }
  }, [response, voiceEnabled]);

  return (
    <div className="w-full max-w-2xl">
      <AnimatePresence mode="wait">
        {(response || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                <Bot className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-400/60">OmniGuide AI</span>
                  <div className="flex items-center gap-3">
                    {response && (
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(response);
                          alert('Copied to clipboard!');
                        }}
                        className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        <Share2 className="w-4 h-4 text-white/20 hover:text-indigo-400 transition-colors" />
                      </button>
                    )}
                    {response && <Volume2 className="w-4 h-4 text-indigo-400/40 animate-pulse" />}
                  </div>
                </div>
                <div className="text-white/90 leading-relaxed prose prose-invert prose-sm max-w-none">
                  {isProcessing && !response ? (
                    <div className="flex gap-1 py-2">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                    </div>
                  ) : (
                    <Markdown>{response}</Markdown>
                  )}
                </div>
              </div>
            </div>
            
            {/* Animated background glow */}
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
