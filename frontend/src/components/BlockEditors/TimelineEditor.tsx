import React from 'react';

interface TimelineEditorProps {
  content: any;
  onUpdate: (newContent: any) => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({ content, onUpdate }) => {
  const items = content.items || [];

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onUpdate({ ...content, items: newItems });
  };

  const addItem = () => {
    onUpdate({
      ...content,
      items: [...items, { date: '2026', title: 'Новое событие', description: 'Описание' }]
    });
  };

  const removeItem = (index: number) => {
    onUpdate({
      ...content,
      items: items.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Заголовок временной линии</label>
        <input
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.title || ''}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
        />
      </div>
      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-300 uppercase">Элементы временной линии</label>
        {items.map((item: any, index: number) => (
          <div key={index} className="p-4 bg-slate-50 rounded-2xl space-y-3 relative">
            <button
              onClick={() => removeItem(index)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500"
            >
              ×
            </button>
            <input
              className="w-full p-2 bg-white border border-slate-100 rounded-lg text-xs font-bold"
              placeholder="Дата"
              value={item.date || ''}
              onChange={(e) => updateItem(index, 'date', e.target.value)}
            />
            <input
              className="w-full p-2 bg-white border border-slate-100 rounded-lg text-xs font-bold"
              placeholder="Заголовок"
              value={item.title || ''}
              onChange={(e) => updateItem(index, 'title', e.target.value)}
            />
            <textarea
              className="w-full p-2 bg-white border border-slate-100 rounded-lg text-xs font-bold h-16 resize-none"
              placeholder="Описание"
              value={item.description || ''}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={addItem}
          className="w-full py-3 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase hover:border-blue-400 hover:text-blue-500 transition-all"
        >
          + Add Item
        </button>
      </div>
    </div>
  );
};
