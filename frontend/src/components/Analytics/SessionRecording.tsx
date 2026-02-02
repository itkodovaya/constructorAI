import React, { useState } from 'react';
import { Play, Pause, RotateCcw, User, Clock } from 'lucide-react';

interface SessionRecordingProps {
  recording: {
    id: string;
    userName: string;
    duration: string;
    timestamp: Date;
    events: any[];
  };
}

export const SessionRecording: React.FC<SessionRecordingProps> = ({ recording }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{recording.userName}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{recording.duration} • {new Date(recording.timestamp).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Mock Player Area */}
      <div className="aspect-video bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center">
        <div className="text-white/20 font-black uppercase tracking-[0.2em] text-xs">
          {isPlaying ? 'Playing Session...' : 'Ready to Play'}
        </div>
        {isPlaying && (
          <div className="absolute bottom-0 left-0 h-1 bg-blue-500 animate-[progress_10s_linear_infinite]" style={{ width: '100%' }} />
        )}
      </div>
    </div>
  );
};
