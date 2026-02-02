import React from 'react';

interface ParallaxHeroEditorProps {
  content: any;
  onUpdate: (newContent: any) => void;
}

export const ParallaxHeroEditor: React.FC<ParallaxHeroEditorProps> = ({ content, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Title</label>
        <input
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.title || ''}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Subtitle</label>
        <textarea
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold h-24 resize-none"
          value={content.subtitle || ''}
          onChange={(e) => onUpdate({ ...content, subtitle: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Background Image URL</label>
        <input
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.backgroundImage || ''}
          onChange={(e) => onUpdate({ ...content, backgroundImage: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="overlay"
          checked={content.overlay !== false}
          onChange={(e) => onUpdate({ ...content, overlay: e.target.checked })}
        />
        <label htmlFor="overlay" className="text-[10px] font-black text-slate-500 uppercase">Add Overlay</label>
      </div>
      {content.overlay !== false && (
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-300 uppercase">Overlay Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={content.overlayOpacity || 0.5}
            onChange={(e) => onUpdate({ ...content, overlayOpacity: parseFloat(e.target.value) })}
          />
        </div>
      )}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Button Text</label>
        <input
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.buttonText || ''}
          onChange={(e) => onUpdate({ ...content, buttonText: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Button Link</label>
        <input
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.buttonLink || ''}
          onChange={(e) => onUpdate({ ...content, buttonLink: e.target.value })}
        />
      </div>
    </div>
  );
};
