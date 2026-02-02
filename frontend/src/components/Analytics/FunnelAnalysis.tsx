import React from 'react';
import { ArrowDown, Users, Target, MousePointer2 } from 'lucide-react';

interface FunnelStep {
  label: string;
  count: number;
  percentage: number;
}

interface FunnelAnalysisProps {
  steps: FunnelStep[];
}

export const FunnelAnalysis: React.FC<FunnelAnalysisProps> = ({ steps }) => {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
          <Target className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Conversion Funnel</h3>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div className="relative">
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{step.label}</p>
                    <p className="text-xl font-black text-slate-900">{step.count.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion</p>
                  <p className="text-xl font-black text-blue-600">{step.percentage}%</p>
                </div>
              </div>
              
              {/* Funnel Visual Effect */}
              <div 
                className="absolute inset-y-0 left-0 bg-blue-50/50 rounded-3xl -z-0 transition-all duration-1000"
                style={{ width: `${step.percentage}%` }}
              />
            </div>
            
            {i < steps.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <ArrowDown className="w-4 h-4" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
