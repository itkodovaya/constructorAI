import React from 'react';

interface PricingCalculatorEditorProps {
  content: any;
  onUpdate: (newContent: any) => void;
}

export const PricingCalculatorEditor: React.FC<PricingCalculatorEditorProps> = ({ content, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Calculator Title</label>
        <input
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.title || ''}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Base Price</label>
        <input
          type="number"
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.basePrice || 0}
          onChange={(e) => onUpdate({ ...content, basePrice: parseFloat(e.target.value) })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Currency Symbol</label>
        <input
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.currency || '$'}
          onChange={(e) => onUpdate({ ...content, currency: e.target.value })}
        />
      </div>
    </div>
  );
};
