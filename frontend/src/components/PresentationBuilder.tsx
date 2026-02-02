import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Download, Layers, Type, Image as ImageIcon, 
  X, ChevronLeft, ChevronRight, Plus, Monitor, FileText
} from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  content: string;
  type: string;
}

interface PresentationBuilderProps {
  brandName: string;
  assets: any;
  slides: Slide[];
  onClose: () => void;
}

export const PresentationBuilder: React.FC<PresentationBuilderProps> = ({ brandName, assets, slides: initialSlides, onClose }) => {
  const [slides, setSlides] = useState<Slide[]>(initialSlides || []);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPreview, setIsPreview] = useState(false);

  const currentSlide = slides[currentSlideIndex];

  const updateSlide = (updates: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = { ...newSlides[currentSlideIndex], ...updates };
    setSlides(newSlides);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col transition-colors duration-500 ${isPreview ? 'bg-black' : 'bg-slate-50'}`}>
      {/* Toolbar */}
      {!isPreview && (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <X className="w-6 h-6 text-slate-400" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">AI Presentation Builder</h2>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPreview(true)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition-all"
            >
              <Play className="w-4 h-4" /> Cinema Mode
            </button>
            <button className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </header>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Slides list */}
        {!isPreview && (
          <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-4 overflow-y-auto shrink-0">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2">Slides</h3>
            <div className="space-y-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(index)}
                  className={`w-full aspect-video rounded-xl border-2 text-left p-3 transition-all relative group overflow-hidden ${
                    currentSlideIndex === index ? 'border-blue-600 shadow-md bg-blue-50/20' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="text-[10px] font-bold text-slate-400 mb-1">Slide {index + 1}</div>
                  <div className="text-[8px] font-bold text-slate-800 truncate">{slide.title}</div>
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors" />
                </button>
              ))}
              <button className="w-full py-4 border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center text-slate-300 hover:text-blue-400 hover:border-blue-200 transition-all">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </aside>
        )}

        {/* Main Canvas */}
        <main className={`flex-1 flex flex-col items-center justify-center p-12 relative ${isPreview ? 'p-0' : ''}`}>
          {isPreview && (
            <button 
              onClick={() => setIsPreview(false)}
              className="absolute top-8 right-8 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          )}

          <div className="w-full max-w-5xl aspect-video relative group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full h-full bg-white shadow-2xl overflow-hidden relative flex flex-col p-20"
                style={{ 
                  borderRadius: isPreview ? '0' : '32px',
                  fontFamily: assets.fonts?.[1] || 'Inter'
                }}
              >
                {/* Brand Background Elements */}
                <div className="absolute top-0 right-0 w-1/3 h-1/3 opacity-5 pointer-events-none" style={{ backgroundColor: assets.palette?.[1], borderRadius: '0 0 0 100%' }} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <header className="flex justify-between items-start mb-12">
                    <img src={assets.logo} alt="Logo" className="h-12 w-auto" />
                    <div className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">{brandName}</div>
                  </header>

                  <div className="flex-1 flex flex-col justify-center">
                    <motion.h2 
                      className="text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight"
                      style={{ fontFamily: assets.fonts?.[0], color: assets.palette?.[1] }}
                      contentEditable={!isPreview}
                      onBlur={(e) => updateSlide({ title: e.currentTarget.textContent || '' })}
                      suppressContentEditableWarning
                    >
                      {currentSlide.title}
                    </motion.h2>
                    <motion.p 
                      className="text-2xl text-slate-500 max-w-3xl leading-relaxed"
                      contentEditable={!isPreview}
                      onBlur={(e) => updateSlide({ content: e.currentTarget.textContent || '' })}
                      suppressContentEditableWarning
                    >
                      {currentSlide.content}
                    </motion.p>
                  </div>

                  <footer className="mt-auto flex justify-between items-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    <div>Slide {currentSlideIndex + 1} of {slides.length}</div>
                    <div className="flex gap-2">
                      {assets.palette?.map((c: string, i: number) => (
                        <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </footer>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 -left-16 flex items-center">
              <button 
                disabled={currentSlideIndex === 0}
                onClick={() => setCurrentSlideIndex(prev => prev - 1)}
                className="p-4 bg-white shadow-xl rounded-full text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute inset-y-0 -right-16 flex items-center">
              <button 
                disabled={currentSlideIndex === slides.length - 1}
                onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                className="p-4 bg-white shadow-xl rounded-full text-slate-400 hover:text-blue-600 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Slide Settings */}
        {!isPreview && (
          <aside className="w-80 bg-white border-l border-slate-200 p-8 shrink-0 overflow-y-auto">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-6">Settings</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Slide Type</label>
                <select className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-medium">
                  <option>Title Slide</option>
                  <option>Content & Image</option>
                  <option>Features Grid</option>
                  <option>Contact Info</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Layout Style</label>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-video bg-slate-50 rounded-lg border-2 border-slate-100 hover:border-blue-200 cursor-pointer transition-all" />
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button className="w-full py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-all">
                  <Monitor className="w-4 h-4" /> Present Now
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
