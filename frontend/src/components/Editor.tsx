import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MousePointer2, Type, Square, Circle, 
  Layers, Move, Undo2, Redo2, 
  Trash2, Copy, Download, Share2,
  Wand2, Palette, AlignLeft, AlignCenter, AlignRight,
  Eye, EyeOff, ChevronDown, Plus
} from 'lucide-react';

interface Layer {
  id: string;
  name: string;
  type: 'text' | 'shape' | 'image';
  isVisible: boolean;
  isLocked: boolean;
}

interface EditorProps {
  brandName: string;
  logoUrl: string;
  palette: string[];
  fonts: { primary: string; secondary: string };
  onClose: () => void;
}

export const Editor: React.FC<EditorProps> = ({ brandName, logoUrl, palette, fonts, onClose }) => {
  const [activeTool, setActiveTool] = useState('select');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [layers, setLayers] = useState<Layer[]>([
    { id: '1', name: 'Logo Mark', type: 'image', isVisible: true, isLocked: false },
    { id: '2', name: 'Brand Name', type: 'text', isVisible: true, isLocked: false },
    { id: '3', name: 'Background', type: 'shape', isVisible: true, isLocked: true },
  ]);

  const toggleVisibility = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, isVisible: !l.isVisible } : l));
  };
  const [elements, setElements] = useState([
    { id: 'logo', type: 'image', content: logoUrl, x: 100, y: 100, width: 200, height: 200 },
    { id: 'text-brand', type: 'text', content: brandName, x: 320, y: 180, fontSize: 48, font: fonts.primary, color: palette[0] },
    { id: 'text-tagline', type: 'text', content: 'Tagline goes here', x: 320, y: 240, fontSize: 18, font: fonts.secondary, color: palette[3] }
  ]);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleElementMove = (id: string, newX: number, newY: number) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, x: newX, y: newY } : el));
  };

  const handleElementUpdate = (id: string, updates: any) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  return (
    <div className="fixed inset-0 bg-slate-100 z-[100] flex flex-col overflow-hidden select-none">
      {/* Top Bar */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Undo2 className="w-5 h-5 text-slate-500" />
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <h2 className="font-bold text-slate-800 text-sm">Редактор логотипа: {brandName}</h2>
          <div className="flex items-center gap-1 ml-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><Undo2 className="w-4 h-4" /></button>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><Redo2 className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Share2 className="w-4 h-4" /> Поделиться
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all">
            <Download className="w-4 h-4" /> Экспорт
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <aside className="w-14 bg-white border-r border-slate-200 flex flex-col items-center py-4 gap-2 z-10">
          <ToolButton icon={<MousePointer2 className="w-5 h-5" />} active={activeTool === 'select'} onClick={() => setActiveTool('select')} />
          <ToolButton icon={<Square className="w-5 h-5" />} active={activeTool === 'shape'} onClick={() => setActiveTool('shape')} />
          <ToolButton icon={<Circle className="w-5 h-5" />} active={activeTool === 'circle'} onClick={() => setActiveTool('circle')} />
          <ToolButton icon={<Type className="w-5 h-5" />} active={activeTool === 'text'} onClick={() => setActiveTool('text')} />
          <div className="h-px w-8 bg-slate-100 my-2" />
          <ToolButton icon={<ImageIcon className="w-5 h-5" />} active={activeTool === 'image'} onClick={() => setActiveTool('image')} />
          <ToolButton icon={<Wand2 className="w-5 h-5" />} active={activeTool === 'magic'} onClick={() => setActiveTool('magic')} />
        </aside>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-slate-100 overflow-hidden" ref={canvasRef}>
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[800px] h-[600px] bg-white shadow-2xl rounded-sm relative overflow-hidden">
              {elements.map((el) => (
                <motion.div
                  key={el.id}
                  drag={activeTool === 'select'}
                  dragMomentum={false}
                  onDragEnd={(_, info) => {
                    const canvas = canvasRef.current?.getBoundingClientRect();
                    if (canvas) {
                      // Basic coordinate transform
                      handleElementMove(el.id, el.x + info.offset.x, el.y + info.offset.y);
                    }
                  }}
                  onClick={() => setSelectedElement(el.id)}
                  style={{ 
                    position: 'absolute', 
                    left: el.x, 
                    top: el.y, 
                    cursor: activeTool === 'select' ? 'move' : 'default',
                    border: selectedElement === el.id ? '2px solid #6366f1' : '2px solid transparent'
                  }}
                  className="group"
                >
                  {el.type === 'image' && (
                    <img src={el.content as string} style={{ width: el.width, height: el.height }} alt="logo part" draggable={false} />
                  )}
                  {el.type === 'text' && (
                    <div style={{ 
                      fontSize: el.fontSize, 
                      fontFamily: el.font, 
                      color: el.color,
                      whiteSpace: 'nowrap',
                      padding: '4px'
                    }}>
                      {el.content}
                    </div>
                  )}
                  {selectedElement === el.id && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                      {el.id}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Properties Panel */}
        <aside className="w-72 bg-white border-l border-slate-200 flex flex-col z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
          <div className="flex-1 overflow-y-auto p-5 space-y-8">
            {/* Layers Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Слои</h3>
                <button className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-indigo-600 transition-all">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1">
                {elements.map((el) => (
                  <div 
                    key={el.id}
                    onClick={() => setSelectedElement(el.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all group cursor-pointer ${
                      selectedElement === el.id ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${selectedElement === el.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {el.type === 'text' ? <Type className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                      </div>
                      <span className="truncate max-w-[120px]">{el.type === 'text' ? el.content : el.id}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-slate-300 hover:text-indigo-600"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="text-slate-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="h-px bg-slate-100" />

            {/* Properties Section */}
            <section className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Свойства</h3>
              
              {selectedElement ? (
                <div className="space-y-6">
                   <div className="space-y-3">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Расположение</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 gap-2 focus-within:border-indigo-500 transition-colors">
                          <span className="text-[10px] font-bold text-slate-400">X</span>
                          <input 
                            type="number" 
                            className="w-full bg-transparent outline-none text-xs font-mono font-bold" 
                            value={Math.round(elements.find(e => e.id === selectedElement)?.x || 0)} 
                            onChange={(e) => handleElementUpdate(selectedElement, { x: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 gap-2 focus-within:border-indigo-500 transition-colors">
                          <span className="text-[10px] font-bold text-slate-400">Y</span>
                          <input 
                            type="number" 
                            className="w-full bg-transparent outline-none text-xs font-mono font-bold" 
                            value={Math.round(elements.find(e => e.id === selectedElement)?.y || 0)} 
                            onChange={(e) => handleElementUpdate(selectedElement, { y: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                   </div>

                   {elements.find(e => e.id === selectedElement)?.type === 'text' && (
                     <>
                        <div className="space-y-3">
                           <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Текст</label>
                           <input 
                             type="text" 
                             className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:border-indigo-500 outline-none transition-colors"
                             value={elements.find(e => e.id === selectedElement)?.content}
                             onChange={(e) => handleElementUpdate(selectedElement, { content: e.target.value })}
                           />
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center">
                              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Размер</label>
                              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{elements.find(e => e.id === selectedElement)?.fontSize}px</span>
                           </div>
                           <input 
                             type="range" 
                             min="12" 
                             max="120"
                             className="w-full accent-indigo-600"
                             value={elements.find(e => e.id === selectedElement)?.fontSize}
                             onChange={(e) => handleElementUpdate(selectedElement, { fontSize: parseInt(e.target.value) })}
                           />
                        </div>
                     </>
                   )}

                   <div className="space-y-3">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Цвет</label>
                      <div className="grid grid-cols-4 gap-3">
                        {palette.map(color => (
                          <button 
                            key={color} 
                            className={`w-10 h-10 rounded-xl border-2 transition-all ${elements.find(e => e.id === selectedElement)?.color === color ? 'border-indigo-600 scale-110 shadow-lg' : 'border-slate-100 hover:scale-105'}`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleElementUpdate(selectedElement, { color })}
                          />
                        ))}
                      </div>
                   </div>

                   <div className="pt-8 border-t border-slate-50 space-y-3">
                      <button className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                        <Copy className="w-4 h-4" /> Дублировать
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                        <Trash2 className="w-4 h-4" /> Удалить объект
                      </button>
                   </div>
                </div>
              ) : (
                <div className="py-20 text-center space-y-4 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                   <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto">
                      <MousePointer2 className="w-6 h-6 text-slate-300" />
                   </div>
                   <p className="text-[10px] text-slate-400 font-black uppercase leading-relaxed px-10">Выберите объект на холсте для редактирования</p>
                </div>
              )}
            </section>
          </div>

          <div className="p-5 bg-white border-t border-slate-100">
             <button className="w-full py-4 bg-indigo-600 text-white rounded-[20px] text-xs font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                Завершить редактирование
             </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

// Internal Sub-components
const ToolButton = ({ icon, active, onClick }: { icon: any, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-2.5 rounded-xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
  >
    {icon}
  </button>
);

const PropertyInput = ({ label, value }: { label: string, value: number }) => (
  <div className="flex items-center bg-slate-50 border border-slate-100 rounded-lg px-2 py-1.5 gap-2">
    <span className="text-[10px] font-bold text-slate-400">{label}</span>
    <span className="text-xs font-mono text-slate-700">{value}</span>
  </div>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

