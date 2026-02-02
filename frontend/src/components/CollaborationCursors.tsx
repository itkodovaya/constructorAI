import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';

interface CursorData {
  userId: string;
  userName: string;
  cursor: { x: number; y: number };
  color: string;
}

const CURSOR_COLORS = [
  '#F43F5E', '#8B5CF6', '#10B981', '#F59E0B', 
  '#3B82F6', '#EC4899', '#6366F1', '#14B8A6'
];

export const CollaborationCursors: React.FC<{ projectId: string; userId: string; userName: string }> = ({ 
  projectId, userId, userName 
}) => {
  const [others, setOthers] = useState<Map<string, CursorData>>(new Map());
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:3001/ws/collaboration`;
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'join',
        projectId,
        userId,
        userName
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'presence' && data.userId !== userId) {
        setOthers(prev => {
          const next = new Map(prev);
          const existing = next.get(data.userId);
          next.set(data.userId, {
            userId: data.userId,
            userName: existing?.userName || 'Коллега',
            cursor: data.cursor,
            color: existing?.color || CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)]
          });
          return next;
        });
      }

      if (data.type === 'user_left') {
        setOthers(prev => {
          const next = new Map(prev);
          next.delete(data.userId);
          return next;
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'cursor',
          projectId,
          userId,
          cursor: { x: e.clientX, y: e.clientY }
        }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      socket.close();
    };
  }, [projectId, userId, userName]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {Array.from(others.values()).map((other) => (
          <motion.div
            key={other.userId}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              x: other.cursor.x,
              y: other.cursor.y
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
            className="absolute top-0 left-0"
          >
            <MousePointer2 
              className="w-5 h-5" 
              style={{ color: other.color, fill: other.color }} 
            />
            <div 
              className="ml-4 px-2 py-1 rounded-lg text-[10px] font-bold text-white shadow-xl whitespace-nowrap"
              style={{ backgroundColor: other.color }}
            >
              {other.userName}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

