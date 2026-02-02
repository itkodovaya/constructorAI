import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Play, Check, AlertCircle, Sparkles, Wand2 } from 'lucide-react';
import { api } from '../services/api';

export const VoiceCommander: React.FC<{ projectId: string; onAction: (result: any) => void }> = ({ projectId, onAction }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'success'>('idle');
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setStatus('recording');
      setTranscript('');
    };

    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptValue = event.results[current][0].transcript;
      setTranscript(transcriptValue);
    };

    recognitionRef.current.onend = async () => {
      setIsListening(false);
      if (status === 'recording') {
        processTranscript();
      }
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const processTranscript = async () => {
    if (!transcript) {
      setStatus('idle');
      return;
    }
    
    setStatus('processing');
    try {
      const result = await api.sendVoiceCommand(projectId, transcript);
      setStatus('success');
      onAction(result);
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <AnimatePresence>
          {isListening && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"
            />
          )}
        </AnimatePresence>
        
        <button 
          onClick={isListening ? stopListening : startListening}
          className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${
            isListening ? 'bg-rose-500 text-white' : 'bg-blue-600 text-white hover:scale-105'
          }`}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
      </div>

      <div className="text-center space-y-2 max-w-xs">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {status === 'idle' && 'Tap to speak commands'}
          {status === 'recording' && 'Listening...'}
          {status === 'processing' && 'Neural Analysis...'}
          {status === 'success' && 'Action Executed'}
        </div>
        
        <AnimatePresence mode="wait">
          {transcript && (
            <motion.p 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-slate-600 italic"
            >
              "{transcript}"
            </motion.p>
          )}
        </AnimatePresence>

        {status === 'success' && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-2 text-emerald-500">
            <Check className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase">Confirmed</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

