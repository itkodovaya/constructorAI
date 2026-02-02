import React from 'react';
import { History, User, Clock } from 'lucide-react';

interface Change {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: Date;
  blockId?: string;
}

interface ChangeTrackerProps {
  changes: Change[];
}

export const ChangeTracker: React.FC<ChangeTrackerProps> = ({ changes }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
          <History className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Activity Log</h3>
      </div>
      <div className="space-y-4">
        {changes.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No recent activity</p>
        ) : (
          changes.map((change) => (
            <div key={change.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900">
                  <span className="text-indigo-600">{change.userName}</span> {change.action}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  {new Date(change.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
