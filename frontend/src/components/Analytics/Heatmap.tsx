import React from 'react';

interface HeatmapProps {
  data: Array<{ x: number; y: number; value: number }>;
}

export const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  return (
    <div className="relative w-full h-full pointer-events-none opacity-60">
      {data.map((point, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-xl"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: `${point.value * 20}px`,
            height: `${point.value * 20}px`,
            background: `radial-gradient(circle, rgba(255,0,0,${point.value / 10}) 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};
