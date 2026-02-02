import React from 'react';
import { TrendingUp, BarChart3, PieChart } from 'lucide-react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface ChartBuilderProps {
  title: string;
  type: 'bar' | 'line' | 'pie' | 'area';
  data: ChartData[];
  height?: string;
}

export const ChartBuilder: React.FC<ChartBuilderProps> = ({
  title,
  type = 'bar',
  data = [],
  height = '300px',
}) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  const renderBarChart = () => (
    <div className="flex items-end justify-between gap-2 h-full">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <div
            className="w-full bg-blue-600 rounded-t-lg transition-all hover:bg-blue-700"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
              backgroundColor: item.color || '#6366f1',
            }}
          />
          <span className="text-xs font-bold text-slate-600">{item.label}</span>
          <span className="text-xs font-black text-slate-900">{item.value}</span>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="relative h-full">
      <svg className="w-full h-full" viewBox="0 0 400 200">
        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          points={data.map((item, index) => 
            `${(index / (data.length - 1)) * 400},${200 - (item.value / maxValue) * 180}`
          ).join(' ')}
        />
        {data.map((item, index) => (
          <circle
            key={index}
            cx={(index / (data.length - 1)) * 400}
            cy={200 - (item.value / maxValue) * 180}
            r="4"
            fill="#6366f1"
          />
        ))}
      </svg>
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;
            
            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
            const largeArc = angle > 180 ? 1 : 0;
            
            return (
              <path
                key={index}
                d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={item.color || `hsl(${index * 60}, 70%, 50%)`}
                className="hover:opacity-80 transition-opacity"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div className="w-full py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-slate-900 mb-2">{title}</h2>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl" style={{ height }}>
          {data.length > 0 ? renderChart() : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <BarChart3 className="w-16 h-16" />
            </div>
          )}
        </div>
        {type === 'pie' && (
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color || `hsl(${index * 60}, 70%, 50%)` }}
                />
                <span className="text-sm font-semibold text-slate-700">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

