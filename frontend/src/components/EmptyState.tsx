import React from 'react';
import { 
  Inbox, 
  Search, 
  FileX, 
  AlertCircle, 
  Plus, 
  RefreshCw,
  Database,
  Shield,
  BarChart3
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

const defaultIcons: Record<string, React.ReactNode> = {
  default: <Inbox className="w-12 h-12 text-slate-400" />,
  search: <Search className="w-12 h-12 text-slate-400" />,
  file: <FileX className="w-12 h-12 text-slate-400" />,
  error: <AlertCircle className="w-12 h-12 text-rose-400" />,
  add: <Plus className="w-12 h-12 text-indigo-400" />,
  refresh: <RefreshCw className="w-12 h-12 text-indigo-400" />,
  database: <Database className="w-12 h-12 text-slate-400" />,
  governance: <Shield className="w-12 h-12 text-slate-400" />,
  analytics: <BarChart3 className="w-12 h-12 text-slate-400" />,
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  const displayIcon = icon || defaultIcons.default;

  return (
    <div className={`flex flex-col items-center justify-center p-8 md:p-12 text-center ${className}`}>
      <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
        {displayIcon}
      </div>
      
      <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm md:text-base text-slate-500 font-medium max-w-md mb-6">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            action.variant === 'primary'
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

interface EmptyStateWithIconProps extends Omit<EmptyStateProps, 'icon'> {
  iconType?: keyof typeof defaultIcons;
}

export const EmptyStateWithIcon: React.FC<EmptyStateWithIconProps> = ({
  iconType = 'default',
  ...props
}) => {
  return <EmptyState {...props} icon={defaultIcons[iconType]} />;
};

