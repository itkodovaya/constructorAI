import React from 'react';

interface VideoHeroEditorProps {
  content: any;
  onUpdate: (newContent: any) => void;
}

export const VideoHeroEditor: React.FC<VideoHeroEditorProps> = ({ content, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Video URL (MP4)</label>
        <input
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.videoUrl || ''}
          onChange={(e) => onUpdate({ ...content, videoUrl: e.target.value })}
        />
      </div>
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
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="muted"
          checked={content.muted !== false}
          onChange={(e) => onUpdate({ ...content, muted: e.target.checked })}
        />
        <label htmlFor="muted" className="text-[10px] font-black text-slate-500 uppercase">Muted</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="loop"
          checked={content.loop !== false}
          onChange={(e) => onUpdate({ ...content, loop: e.target.checked })}
        />
        <label htmlFor="loop" className="text-[10px] font-black text-slate-500 uppercase">Loop</label>
      </div>
    </div>
  );
};
