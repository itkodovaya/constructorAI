import React from 'react';

interface BookingSystemEditorProps {
  content: any;
  onUpdate: (newContent: any) => void;
}

export const BookingSystemEditor: React.FC<BookingSystemEditorProps> = ({ content, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Booking Title</label>
        <input
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.title || ''}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Service Name</label>
        <input
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.serviceName || ''}
          onChange={(e) => onUpdate({ ...content, serviceName: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Price per Slot</label>
        <input
          type="number"
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.price || 0}
          onChange={(e) => onUpdate({ ...content, price: parseFloat(e.target.value) })}
        />
      </div>
    </div>
  );
};
