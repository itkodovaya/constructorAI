import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { GeneratedDesign } from '../utils/DesignParameters';
import { Check } from 'lucide-react';

interface InfiniteDesignGridProps {
  designs: GeneratedDesign[];
  selectedDesign: GeneratedDesign | null;
  onSelect: (design: GeneratedDesign) => void;
  onLoadMore: () => void;
  loading: boolean;
  hasMore: boolean;
}

export const InfiniteDesignGrid: React.FC<InfiniteDesignGridProps> = ({
  designs,
  selectedDesign,
  onSelect,
  onLoadMore,
  loading,
  hasMore,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer для бесконечной прокрутки
  useEffect(() => {
    if (!hasMore || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  // Виртуализация: показываем только видимые элементы
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemHeight = 300; // Примерная высота карточки
      const itemsPerRow = Math.floor(container.clientWidth / 250) || 4;
      const rowsVisible = Math.ceil(containerHeight / itemHeight) + 2;

      const start = Math.max(0, Math.floor(scrollTop / itemHeight) * itemsPerRow - itemsPerRow);
      const end = Math.min(designs.length, start + rowsVisible * itemsPerRow);

      setVisibleRange({ start, end });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial calculation
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [designs.length]);

  const visibleDesigns = designs.slice(visibleRange.start, visibleRange.end);

  return (
    <div ref={containerRef} className="overflow-y-auto h-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 p-4 sm:p-6">
        {/* Spacer для виртуализации */}
        {visibleRange.start > 0 && (
          <div style={{ height: `${Math.floor(visibleRange.start / 5) * 300}px` }} />
        )}

        {visibleDesigns.map((design, index) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (index % 20) * 0.02 }}
            onClick={() => onSelect(design)}
            className={`group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all will-change-transform bg-white shadow-sm ${
              selectedDesign?.id === design.id
                ? 'border-indigo-500 ring-4 ring-indigo-100 scale-105 z-10 shadow-xl'
                : 'border-slate-200 hover:border-indigo-300 hover:scale-[1.02] hover:shadow-lg'
            }`}
          >
            <img
              src={design.preview}
              alt={design.parameters.style.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-bold">{design.parameters.style.name}</p>
                <p className="text-white/80 text-xs">{design.parameters.colorPalette.name}</p>
                <div className="flex gap-1 mt-1">
                  {design.parameters.elements.slice(0, 2).map((elem, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] text-white"
                    >
                      {elem.type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {selectedDesign?.id === design.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1.5 shadow-lg"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* Spacer для виртуализации */}
        {visibleRange.end < designs.length && (
          <div style={{ height: `${Math.floor((designs.length - visibleRange.end) / 5) * 300}px` }} />
        )}
      </div>

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          {loading && (
            <div className="text-white/60 text-sm">Загрузка...</div>
          )}
        </div>
      )}
    </div>
  );
};

