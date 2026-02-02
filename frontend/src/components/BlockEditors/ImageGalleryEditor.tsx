import React from 'react';

interface ImageGalleryEditorProps {
  content: any;
  onUpdate: (newContent: any) => void;
}

export const ImageGalleryEditor: React.FC<ImageGalleryEditorProps> = ({ content, onUpdate }) => {
  const images = content.images || [];

  const updateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    onUpdate({ ...content, images: newImages });
  };

  const addImage = () => {
    onUpdate({
      ...content,
      images: [...images, '']
    });
  };

  const removeImage = (index: number) => {
    onUpdate({
      ...content,
      images: images.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Gallery Title</label>
        <input
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.title || ''}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
        />
      </div>
      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-300 uppercase">Images</label>
        {images.map((image: string, index: number) => (
          <div key={index} className="p-4 bg-slate-50 rounded-2xl space-y-3 relative">
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500"
            >
              ×
            </button>
            <input
              className="w-full p-2 bg-white border border-slate-100 rounded-lg text-xs font-bold"
              placeholder="URL изображения"
              value={image}
              onChange={(e) => updateImage(index, e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={addImage}
          className="w-full py-3 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase hover:border-blue-400 hover:text-blue-500 transition-all"
        >
          + Add Image
        </button>
      </div>
    </div>
  );
};
