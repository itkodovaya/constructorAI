import React from 'react';
import { CheckCircle2, XCircle, Clock, User } from 'lucide-react';

interface ApprovalRequest {
  id: string;
  userId: string;
  userName: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: Date;
}

interface ApprovalWorkflowProps {
  requests: ApprovalRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  requests,
  onApprove,
  onReject,
}) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Approvals</h3>
      </div>
      <div className="space-y-4">
        {requests.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No pending requests</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{request.userName}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  request.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                  request.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-rose-50 text-rose-600'
                }`}>
                  {request.status}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">{request.description}</p>
              {request.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onApprove(request.id)}
                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(request.id)}
                    className="flex-1 py-3 bg-white border-2 border-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-rose-100 hover:text-rose-500 transition-all"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
