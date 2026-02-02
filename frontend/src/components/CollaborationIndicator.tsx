import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Users, Circle } from 'lucide-react';
import { getRealtimeSyncClient, type Presence } from '../services/realtimeSync';

interface CollaborationIndicatorProps {
  projectId: string;
  userId: string;
  userName: string;
}

export const CollaborationIndicator: React.FC<CollaborationIndicatorProps> = ({
  projectId,
  userId,
  userName
}) => {
  const { t } = useTranslation();
  const [activeUsers, setActiveUsers] = useState<Presence[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const syncClient = getRealtimeSyncClient();
    
    // Подключаемся к проекту
    syncClient.connect(projectId, userId, userName);

    // Подписываемся на обновления присутствия
    syncClient.on('presence_update', (message) => {
      if (message.data?.presence) {
        setActiveUsers(message.data.presence.filter((p: Presence) => p.userId !== userId));
      }
    });

    syncClient.on('connected', () => {
      setIsConnected(true);
    });

    syncClient.on('user_left', () => {
      // Обновляем список пользователей
      syncClient.updatePresence();
    });

    // Отправляем обновление присутствия
    syncClient.updatePresence();

    // Периодически обновляем присутствие
    const presenceInterval = setInterval(() => {
      syncClient.updatePresence();
    }, 5000);

    return () => {
      clearInterval(presenceInterval);
      syncClient.disconnect();
    };
  }, [projectId, userId, userName]);

  if (!isConnected || activeUsers.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-6 bg-white rounded-2xl shadow-lg border border-slate-200 p-4 z-50"
    >
      <div className="flex items-center gap-3 mb-3">
        <Users className="w-5 h-5 text-indigo-600" />
        <span className="text-sm font-bold text-slate-800">
          {t('collaboration.activeUsers')} ({activeUsers.length})
        </span>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence>
          {activeUsers.map((user) => (
            <motion.div
              key={user.userId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                  {user.userName[0].toUpperCase()}
                </div>
                <Circle className="w-3 h-3 text-green-500 absolute -bottom-0 -right-0 fill-current" />
              </div>
              <span className="text-sm text-slate-600">{user.userName}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

