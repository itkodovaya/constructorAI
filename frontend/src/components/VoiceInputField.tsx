import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Loader2 } from 'lucide-react';
import { useVoiceInput } from '../utils/voiceInput';

interface VoiceInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  lang?: string;
  className?: string;
  disabled?: boolean;
  onError?: (error: string) => void;
}

export const VoiceInputField: React.FC<VoiceInputFieldProps> = ({
  value,
  onChange,
  placeholder = 'Введите текст или нажмите микрофон для голосового ввода...',
  lang = 'ru-RU',
  className = '',
  disabled = false,
  onError
}) => {
  const [showVoiceButton, setShowVoiceButton] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { isListening, transcript, error, start, stop, isSupported } = useVoiceInput({
    lang,
    onResult: (text, isFinal) => {
      if (isFinal) {
        onChange(text);
        stop();
      } else {
        // Показываем промежуточный результат
        onChange(text);
      }
    },
    onError: (errorMessage) => {
      onError?.(errorMessage);
    }
  });

  useEffect(() => {
    if (transcript && !isListening) {
      // Финальный результат уже применен через onResult
    }
  }, [transcript, isListening]);

  const handleVoiceClick = () => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  };

  const handleClear = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!isSupported) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 ${className}`}
        disabled={disabled}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 pr-24
            border-2 rounded-xl
            focus:outline-none focus:ring-2 focus:ring-indigo-200
            ${isListening ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'}
            ${disabled ? 'bg-slate-50 cursor-not-allowed' : 'bg-white'}
          `}
          disabled={disabled}
        />
        
        {/* Voice Button */}
        <div className="absolute right-2 flex items-center gap-1">
          {value && (
            <button
              onClick={handleClear}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Очистить"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
          
          <motion.button
            onClick={handleVoiceClick}
            disabled={disabled}
            className={`
              p-2 rounded-lg transition-all
              ${isListening 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            aria-label={isListening ? 'Остановить запись' : 'Начать голосовой ввод'}
          >
            <AnimatePresence mode="wait">
              {isListening ? (
                <motion.div
                  key="listening"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <MicOff className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Mic className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Listening Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-sm text-indigo-700 flex items-center gap-2"
          >
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
            <span>Слушаю...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

