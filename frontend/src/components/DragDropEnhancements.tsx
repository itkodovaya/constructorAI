import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from 'lucide-react';

interface DragPreviewProps {
  blockType: string;
  blockName: string;
  x: number;
  y: number;
}

export const DragPreview: React.FC<DragPreviewProps> = ({ blockType, blockName, x, y }) => {
  return (
    <motion.div
      style={{
        position: 'fixed',
        top: y,
        left: x,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.8, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className="px-4 py-2 bg-white rounded-xl shadow-2xl border border-slate-100 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <Box className="w-4 h-4" />
        </div>
        <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{blockName}</span>
      </div>
    </motion.div>
  );
};

interface DropZoneProps {
  isActive: boolean;
  position: 'top' | 'bottom' | 'inside';
  onDrop: () => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ isActive, position, onDrop }) => {
  return (
    <div
      className={`absolute left-0 right-0 h-2 transition-all ${isActive ? 'bg-blue-500 opacity-100 scale-y-150' : 'bg-transparent opacity-0'} ${position === 'top' ? 'top-0' : 'bottom-0'}`}
      onMouseUp={onDrop}
    />
  );
};
