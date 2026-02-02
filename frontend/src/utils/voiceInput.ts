/**
 * Утилиты для голосового ввода через Web Speech API
 */

import React from 'react';

export interface VoiceInputOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export class VoiceInputManager {
  private recognition: any = null;
  private isListening: boolean = false;
  private options: VoiceInputOptions;

  constructor(options: VoiceInputOptions = {}) {
    this.options = {
      lang: options.lang || 'ru-RU',
      continuous: options.continuous || false,
      interimResults: options.interimResults || true,
      ...options
    };

    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') {
      return;
    }

    // Проверка поддержки Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Web Speech API not supported');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = this.options.lang;
    this.recognition.continuous = this.options.continuous;
    this.recognition.interimResults = this.options.interimResults;

    // Обработчики событий
    this.recognition.onstart = () => {
      this.isListening = true;
      this.options.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      const isFinal = finalTranscript.length > 0;
      
      this.options.onResult?.(text.trim(), isFinal);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      const errorMessage = this.getErrorMessage(event.error);
      this.options.onError?.(errorMessage);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.options.onEnd?.();
    };
  }

  private getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      'no-speech': 'Речь не обнаружена. Попробуйте еще раз.',
      'audio-capture': 'Микрофон недоступен. Проверьте настройки.',
      'not-allowed': 'Доступ к микрофону запрещен. Разрешите доступ в настройках браузера.',
      'network': 'Ошибка сети. Проверьте подключение к интернету.',
      'aborted': 'Распознавание прервано.',
      'bad-grammar': 'Ошибка грамматики.',
      'language-not-supported': 'Язык не поддерживается.'
    };

    return errorMessages[error] || `Ошибка распознавания: ${error}`;
  }

  /**
   * Начать распознавание речи
   */
  start(): boolean {
    if (!this.recognition) {
      this.options.onError?.('Web Speech API не поддерживается в этом браузере');
      return false;
    }

    if (this.isListening) {
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start recognition:', error);
      return false;
    }
  }

  /**
   * Остановить распознавание речи
   */
  stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Прервать распознавание речи
   */
  abort(): void {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  /**
   * Проверка поддержки Web Speech API
   */
  static isSupported(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    return !!SpeechRecognition;
  }

  /**
   * Получение списка поддерживаемых языков
   */
  static getSupportedLanguages(): string[] {
    return [
      'ru-RU', 'en-US', 'en-GB', 'es-ES', 'de-DE', 'fr-FR',
      'it-IT', 'pt-BR', 'ja-JP', 'ko-KR', 'zh-CN', 'ar-SA'
    ];
  }

  /**
   * Проверка доступности микрофона
   */
  static async checkMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Запрос доступа к микрофону
   */
  static async requestMicrophonePermission(): Promise<boolean> {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error: any) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }
}

/**
 * Хук для использования голосового ввода в React компонентах
 */
export function useVoiceInput(options: VoiceInputOptions = {}) {
  const [isListening, setIsListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const managerRef = React.useRef<VoiceInputManager | null>(null);

  React.useEffect(() => {
    if (!VoiceInputManager.isSupported()) {
      setError('Web Speech API не поддерживается в этом браузере');
      return;
    }

    managerRef.current = new VoiceInputManager({
      ...options,
      onStart: () => {
        setIsListening(true);
        setError(null);
        options.onStart?.();
      },
      onResult: (text, isFinal) => {
        setTranscript(text);
        options.onResult?.(text, isFinal);
      },
      onError: (errorMessage) => {
        setIsListening(false);
        setError(errorMessage);
        options.onError?.(errorMessage);
      },
      onEnd: () => {
        setIsListening(false);
        options.onEnd?.();
      }
    });

    return () => {
      managerRef.current?.stop();
    };
  }, []);

  const start = React.useCallback(() => {
    if (managerRef.current) {
      const success = managerRef.current.start();
      if (!success) {
        setError('Не удалось начать распознавание');
      }
    }
  }, []);

  const stop = React.useCallback(() => {
    managerRef.current?.stop();
  }, []);

  const clear = React.useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    start,
    stop,
    clear,
    isSupported: VoiceInputManager.isSupported()
  };
}

