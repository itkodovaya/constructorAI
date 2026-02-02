import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Check } from 'lucide-react';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  position: { x: number; y: number };
  resolved: boolean;
  replies?: any[];
}

export const CommentPin: React.FC<{ 
  comment: Comment; 
  active: boolean; 
  onClick: () => void;
  onResolve: (id: string) => void;
}> = ({ comment, active, onClick, onResolve }) => {
  return (
    <div 
      className="absolute z-50"
      style={{ left: comment.position.x, top: comment.position.y }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`w-8 h-8 rounded-full rounded-bl-none flex items-center justify-center shadow-lg transition-colors ${
          comment.resolved ? 'bg-slate-400' : 'bg-indigo-600'
        } text-white`}
      >
        <MessageSquare className="w-4 h-4" />
      </motion.button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-10 top-0 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">{comment.userName}</span>
              <button 
                onClick={() => onResolve(comment.id)}
                className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-4 text-sm text-slate-600 leading-relaxed">
              {comment.content}
            </div>
            <div className="p-3 bg-white border-t border-slate-50 flex gap-2">
              <input 
                type="text" 
                placeholder="Ответить..." 
                className="flex-1 text-xs bg-slate-100 border-none rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <button className="p-2 bg-indigo-600 text-white rounded-xl">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CommentOverlay: React.FC<{ 
  projectId: string; 
  comments: Comment[];
  onAddComment: (content: string, pos: { x: number; y: number }) => void;
  onResolveComment: (id: string) => void;
}> = ({ comments, onAddComment, onResolveComment }) => {
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [newCommentPos, setNewCommentPos] = useState<{ x: number; y: number } | null>(null);
  const [newContent, setNewContent] = useState('');

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeCommentId) {
      setActiveCommentId(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setNewCommentPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      className="absolute inset-0 z-40 cursor-crosshair"
      onClick={handleCanvasClick}
    >
      {comments.map(comment => (
        <CommentPin 
          key={comment.id}
          comment={comment}
          active={activeCommentId === comment.id}
          onClick={() => setActiveCommentId(comment.id)}
          onResolve={onResolveComment}
        />
      ))}

      <AnimatePresence>
        {newCommentPos && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-50 bg-white p-4 rounded-3xl shadow-2xl border border-indigo-100 w-64"
            style={{ left: newCommentPos.x, top: newCommentPos.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Новый комментарий</span>
              <button onClick={() => setNewCommentPos(null)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <textarea 
              autoFocus
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full h-20 bg-slate-50 border-none rounded-2xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 mb-3"
              placeholder="Напишите замечание..."
            />
            <button 
              onClick={() => {
                onAddComment(newContent, newCommentPos);
                setNewCommentPos(null);
                setNewContent('');
              }}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
            >
              <Send className="w-4 h-4" /> Отправить
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

