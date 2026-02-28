import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings as SettingsIcon, Volume2, Zap, Camera, ShieldCheck } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-3xl z-50 shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <SettingsIcon className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold">Agent Settings</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6 text-white/40" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Voice Output Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/20 rounded-xl">
                    <Volume2 className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Voice Responses</h3>
                    <p className="text-xs text-white/40">AI will speak its analysis aloud</p>
                  </div>
                </div>
                <button
                  onClick={() => onSettingsChange({ ...settings, voiceEnabled: !settings.voiceEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.voiceEnabled ? 'bg-indigo-500' : 'bg-white/10'}`}
                >
                  <motion.div
                    animate={{ x: settings.voiceEnabled ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              {/* Auto Analyze Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-xl">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Auto-Analysis</h3>
                    <p className="text-xs text-white/40">Continuous scene understanding</p>
                  </div>
                </div>
                <button
                  onClick={() => onSettingsChange({ ...settings, autoAnalyze: !settings.autoAnalyze })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoAnalyze ? 'bg-emerald-500' : 'bg-white/10'}`}
                >
                  <motion.div
                    animate={{ x: settings.autoAnalyze ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              {/* Camera Resolution */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/20 rounded-xl">
                    <Camera className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Stream Quality</h3>
                    <p className="text-xs text-white/40">Resolution for visual analysis</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['720p', '1080p'].map((res) => (
                    <button
                      key={res}
                      onClick={() => onSettingsChange({ ...settings, cameraResolution: res as any })}
                      className={`py-2 rounded-xl border transition-all ${
                        settings.cameraResolution === res
                          ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                          : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy Info */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-3">
                <ShieldCheck className="w-5 h-5 text-white/20 shrink-0" />
                <p className="text-[10px] text-white/40 leading-relaxed">
                  OmniGuide AI processes visual data in real-time. Frames are sent to Gemini for analysis and stored locally in your session history. No data is used for training without your consent.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
