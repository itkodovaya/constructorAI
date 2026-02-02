import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';
import { useVoiceInput } from '../utils/voiceInput';

interface VoiceInputButtonProps {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  lang?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'floating';
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  onError,
  lang = 'ru-RU',
  className = '',
  size = 'md',
  variant = 'default'
}) => {
  const { isListening, transcript, error, start, stop, isSupported } = useVoiceInput({
    lang,
    onResult: onTranscript,
    onError: onError
  });

  const [showTranscript, setShowTranscript] = useState(false);

  if (!isSupported) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const handleClick = () => {
    if (isListening) {
      stop();
      setShowTranscript(false);
    } else {
      start();
      setShowTranscript(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={handleClick}
        className={`
          ${sizeClasses[size]}
          rounded-full
          flex items-center justify-center
          transition-all
          ${variant === 'floating' 
            ? 'bg-indigo-600 text-white shadow-lg hover:shadow-xl' 
            : variant === 'minimal'
            ? 'bg-transparent text-slate-600 hover:bg-slate-100'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }
          ${isListening ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isListening ? 'Остановить запись' : 'Начать запись'}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <MicOff className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'} text-red-600`} />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'}`} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Transcript Popup */}
      <AnimatePresence>
        {showTranscript && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm max-w-xs shadow-lg z-50"
          >
            <div className="flex items-start gap-2">
              <Mic className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="flex-1">{transcript}</p>
            </div>
            {isListening && (
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>Слушаю...</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm max-w-xs shadow-lg z-50"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="flex-1">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

