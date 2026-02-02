import React, { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
  blockId: string;
  position?: { x: number; y: number };
}

interface CommentsSystemProps {
  blockId: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

export const CommentsSystem: React.FC<CommentsSystemProps> = ({
  blockId,
  comments = [],
  onAddComment,
  onDeleteComment,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const blockComments = comments.filter(c => c.blockId === blockId);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <MessageSquare className="w-4 h-4 text-slate-600" />
        {blockComments.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
            {blockComments.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-0 right-0 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 flex flex-col max-h-96">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-black text-slate-900">Comments</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-all"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {blockComments.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No comments yet</p>
            ) : (
              blockComments.map(comment => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{comment.userName}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(comment.timestamp).toLocaleTimeString()}
                    </span>
                    {onDeleteComment && (
                      <button
                        onClick={() => onDeleteComment(comment.id)}
                        className="ml-auto text-xs text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm font-semibold"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

