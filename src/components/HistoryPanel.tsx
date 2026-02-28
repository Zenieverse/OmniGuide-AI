import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, History as HistoryIcon, MessageSquare, Clock } from 'lucide-react';
import { Message } from '../types';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, messages }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <HistoryIcon className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold">Interaction History</h2>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Clear all history?')) {
                        // We'll handle this in App.tsx
                        (window as any).clearHistory();
                      }
                    }}
                    className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors text-xs font-bold uppercase tracking-widest"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white/40" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/20 gap-4">
                  <MessageSquare className="w-12 h-12" />
                  <p>No history yet. Start a conversation!</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className="mx-1">•</span>
                      {msg.mode.replace('_', ' ')}
                    </div>
                    <div className={`max-w-[85%] p-4 rounded-2xl border ${
                      msg.role === 'user' 
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-100' 
                        : 'bg-white/5 border-white/10 text-white/80'
                    }`}>
                      {msg.image && (
                        <img 
                          src={msg.image} 
                          alt="Captured frame" 
                          className="w-full rounded-lg mb-3 border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
