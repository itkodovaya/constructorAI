import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
  variant?: 'spinner' | 'skeleton';
  skeletonLines?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  size = 'md',
  message,
  fullScreen = false,
  variant = 'spinner',
  skeletonLines = 3,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center p-4'
    : 'flex items-center justify-center p-8 md:p-12';

  if (variant === 'skeleton') {
    return (
      <div className={containerClasses}>
        <div className="w-full max-w-2xl space-y-4">
          {Array.from({ length: skeletonLines }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-slate-200 rounded-lg animate-pulse"
              style={{
                width: i === skeletonLines - 1 ? '60%' : '100%',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <Loader2 className={`${sizeClasses[size]} text-indigo-600 animate-spin`} />
        </div>
        {message && (
          <p className="text-sm md:text-base text-slate-500 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

interface SkeletonCardProps {
  className?: string;
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '', lines = 3 }) => {
  return (
    <div className={`bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 ${className}`}>
      <div className="space-y-4">
        <div className="h-6 bg-slate-200 rounded-lg w-3/4 animate-pulse" />
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-slate-200 rounded-lg animate-pulse"
            style={{
              width: i === lines - 1 ? '60%' : '100%',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <RefreshCw className={`${sizeClasses[size]} text-indigo-600 animate-spin ${className}`} />
  );
};

