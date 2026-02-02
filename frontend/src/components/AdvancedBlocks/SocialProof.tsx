import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShoppingCart, Eye, TrendingUp } from 'lucide-react';

interface SocialProofProps {
  type: 'users-online' | 'recent-purchases' | 'viewers' | 'trending';
  count?: number;
  items?: Array<{
    id: string;
    name: string;
    action?: string;
    time?: string;
    avatar?: string;
  }>;
  updateInterval?: number; // in milliseconds
}

export const SocialProof: React.FC<SocialProofProps> = ({
  type,
  count,
  items = [],
  updateInterval = 5000,
}) => {
  const [currentCount, setCurrentCount] = useState(count || 0);
  const [displayItems, setDisplayItems] = useState(items.slice(0, 5));

  useEffect(() => {
    if (type === 'users-online' || type === 'viewers') {
      const interval = setInterval(() => {
        // Simulate count changes
        const variation = Math.floor(Math.random() * 10) - 5;
        setCurrentCount(Math.max(0, (count || 0) + variation));
      }, updateInterval);

      return () => clearInterval(interval);
    }

    if (type === 'recent-purchases' && items.length > 0) {
      const interval = setInterval(() => {
        // Rotate items
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        setDisplayItems(shuffled.slice(0, 5));
      }, updateInterval);

      return () => clearInterval(interval);
    }
  }, [type, count, items, updateInterval]);

  const getIcon = () => {
    switch (type) {
      case 'users-online':
        return <Users className="w-5 h-5" />;
      case 'recent-purchases':
        return <ShoppingCart className="w-5 h-5" />;
      case 'viewers':
        return <Eye className="w-5 h-5" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'users-online':
        return 'Пользователей онлайн';
      case 'recent-purchases':
        return 'Недавние покупки';
      case 'viewers':
        return 'Смотрят сейчас';
      case 'trending':
        return 'В тренде сейчас';
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{getTitle()}</h3>
            {(type === 'users-online' || type === 'viewers') && (
              <motion.div
                key={currentCount}
                initial={{ scale: 1.2, color: '#6366f1' }}
                animate={{ scale: 1, color: '#1e293b' }}
                className="text-2xl font-black text-slate-900"
              >
                {currentCount.toLocaleString()}
              </motion.div>
            )}
          </div>
        </div>

        {type === 'recent-purchases' && displayItems.length > 0 && (
          <div className="space-y-3">
            <AnimatePresence>
              {displayItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm"
                >
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    {item.action && (
                      <div className="text-sm text-slate-500">{item.action}</div>
                    )}
                  </div>
                  {item.time && (
                    <div className="text-xs text-slate-400 font-semibold">{item.time}</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {type === 'trending' && items.length > 0 && (
          <div className="space-y-2">
            {items.slice(0, 5).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 font-bold text-slate-900">{item.name}</div>
                {item.action && (
                  <div className="text-xs text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full">
                    {item.action}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

