import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceInputProps {
  onSpeech: (text: string) => void;
  isProcessing: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onSpeech, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const final = event.results[i][0].transcript;
            onSpeech(final);
            setTranscript('');
          } else {
            currentTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, [onSpeech]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleListening}
        className={`p-6 rounded-full transition-all duration-300 shadow-lg ${
          isListening 
            ? 'bg-red-500/20 text-red-400 border-2 border-red-500/50 animate-pulse' 
            : 'bg-indigo-500/20 text-indigo-400 border-2 border-indigo-500/50'
        }`}
      >
        {isProcessing ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : isListening ? (
          <Mic className="w-8 h-8" />
        ) : (
          <MicOff className="w-8 h-8" />
        )}
      </motion.button>
      
      <AnimatePresence>
        {(transcript || isListening) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl max-w-md text-center"
          >
            <p className="text-sm text-indigo-200/70 italic">
              {transcript || (isListening ? "Listening..." : "")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
