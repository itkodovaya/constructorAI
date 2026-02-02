import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-[32px] border border-slate-200 shadow-xl p-8 md:p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-rose-600" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                  Что-то пошло не так
                </h1>
                <p className="text-sm md:text-base text-slate-500 font-medium">
                  Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
                </p>
              </div>

              {this.state.error && (
                <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Детали ошибки
                  </p>
                  <p className="text-sm font-mono text-rose-600 break-all">
                    {this.state.error.message || 'Неизвестная ошибка'}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={this.handleReset}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  Попробовать снова
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  На главную
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

