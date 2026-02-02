import React from 'react';

interface ParticleEffectsEditorProps {
  content: any;
  onUpdate: (newContent: any) => void;
}

export const ParticleEffectsEditor: React.FC<ParticleEffectsEditorProps> = ({ content, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Particle Type</label>
        <select
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.particleType || 'circles'}
          onChange={(e) => onUpdate({ ...content, particleType: e.target.value })}
        >
          <option value="circles">Circles</option>
          <option value="squares">Squares</option>
          <option value="stars">Stars</option>
          <option value="snow">Snow</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Particle Count</label>
        <input
          type="number"
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.particleCount || 50}
          onChange={(e) => onUpdate({ ...content, particleCount: parseInt(e.target.value) })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Particle Color</label>
        <input
          type="color"
          className="w-full h-10 p-1 bg-white border border-slate-100 rounded-xl"
          value={content.particleColor || '#6366f1'}
          onChange={(e) => onUpdate({ ...content, particleColor: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Speed</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          className="w-full"
          value={content.speed || 1}
          onChange={(e) => onUpdate({ ...content, speed: parseFloat(e.target.value) })}
        />
      </div>
    </div>
  );
};
