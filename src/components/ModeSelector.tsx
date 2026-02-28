import React from 'react';
import { AppMode } from '../types';
import { Wrench, GraduationCap, Utensils, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

const modes = [
  { id: AppMode.GENERAL, label: 'General', icon: Sparkles, color: 'indigo' },
  { id: AppMode.APPLIANCE_FIXER, label: 'Fixer', icon: Wrench, color: 'orange' },
  { id: AppMode.HOMEWORK_TUTOR, label: 'Tutor', icon: GraduationCap, color: 'emerald' },
  { id: AppMode.COOKING_ASSISTANT, label: 'Chef', icon: Utensils, color: 'rose' },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="flex gap-2 p-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl">
      {modes.map((mode) => (
        <motion.button
          key={mode.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onModeChange(mode.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 ${
            currentMode === mode.id
              ? `bg-${mode.color}-500/20 text-${mode.color}-400 border border-${mode.color}-500/50`
              : 'text-white/40 hover:text-white/60 hover:bg-white/5'
          }`}
        >
          <mode.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{mode.label}</span>
        </motion.button>
      ))}
    </div>
  );
};
