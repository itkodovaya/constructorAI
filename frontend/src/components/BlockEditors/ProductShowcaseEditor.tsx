import React from 'react';

interface ProductShowcaseEditorProps {
  content: any;
  onUpdate: (newContent: any) => void;
}

export const ProductShowcaseEditor: React.FC<ProductShowcaseEditorProps> = ({ content, onUpdate }) => {
  const products = content.products || [];

  const updateProduct = (index: number, field: string, value: any) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    onUpdate({ ...content, products: newProducts });
  };

  const addProduct = () => {
    onUpdate({
      ...content,
      products: [...products, { name: 'New Product', price: '$99', image: '' }]
    });
  };

  const removeProduct = (index: number) => {
    onUpdate({
      ...content,
      products: products.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-300 uppercase">Showcase Title</label>
        <input
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={content.title || ''}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
        />
      </div>
      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-300 uppercase">Products</label>
        {products.map((product: any, index: number) => (
          <div key={index} className="p-4 bg-slate-50 rounded-2xl space-y-3 relative">
            <button
              onClick={() => removeProduct(index)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500"
            >
              ×
            </button>
            <input
              className="w-full p-2 bg-white border border-slate-100 rounded-lg text-xs font-bold"
              placeholder="Название товара"
              value={product.name || ''}
              onChange={(e) => updateProduct(index, 'name', e.target.value)}
            />
            <input
              className="w-full p-2 bg-white border border-slate-100 rounded-lg text-xs font-bold"
              placeholder="Цена"
              value={product.price || ''}
              onChange={(e) => updateProduct(index, 'price', e.target.value)}
            />
            <input
              className="w-full p-2 bg-white border border-slate-100 rounded-lg text-xs font-bold"
              placeholder="URL изображения"
              value={product.image || ''}
              onChange={(e) => updateProduct(index, 'image', e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={addProduct}
          className="w-full py-3 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase hover:border-blue-400 hover:text-blue-500 transition-all"
        >
          + Add Product
        </button>
      </div>
    </div>
  );
};
