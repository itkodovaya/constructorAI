import React from 'react';
import { BarChart3, Users, Calendar } from 'lucide-react';

interface CohortData {
  cohort: string;
  size: number;
  retention: number[];
}

interface CohortAnalysisProps {
  data: CohortData[];
}

export const CohortAnalysis: React.FC<CohortAnalysisProps> = ({ data }) => {
  return (
    <div className="p-8 space-y-8 overflow-x-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
          <BarChart3 className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Retention Cohorts</h3>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Cohort</th>
            <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Size</th>
            {[0, 1, 2, 3, 4, 5].map(w => (
              <th key={w} className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">W{w}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="p-4 text-xs font-black text-slate-900 border-b border-slate-50">{row.cohort}</td>
              <td className="p-4 text-xs font-bold text-slate-500 border-b border-slate-50">{row.size}</td>
              {row.retention.map((val, j) => (
                <td 
                  key={j} 
                  className="p-4 text-center border-b border-slate-50"
                >
                  <div 
                    className="w-full h-10 flex items-center justify-center rounded-lg text-[10px] font-black"
                    style={{ 
                      backgroundColor: `rgba(67, 97, 238, ${val / 100})`,
                      color: val > 50 ? 'white' : '#4361ee'
                    }}
                  >
                    {val}%
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
