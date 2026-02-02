import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface ImageGalleryProps {
  title?: string;
  images: Array<{ id: string; url: string; title?: string; category?: string }>;
  columns?: number;
  showFilters?: boolean;
  lightbox?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  title,
  images,
  columns = 4,
  showFilters = true,
  lightbox = true,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))];

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  const currentIndex = selectedImage ? filteredImages.findIndex(img => img.id === selectedImage) : -1;

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return;
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % filteredImages.length
      : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[newIndex].id);
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      {title && (
        <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
          {title}
        </h2>
      )}

      {/* Filters */}
      {showFilters && categories.length > 1 && (
        <div className="max-w-7xl mx-auto mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      <div className={`max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-${columns} gap-4`}>
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => lightbox && setSelectedImage(image.id)}
            className="aspect-square bg-slate-100 rounded-2xl overflow-hidden cursor-pointer group relative"
          >
            <img
              src={image.url}
              alt={image.title || 'Gallery image'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {image.title && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p className="text-white font-bold">{image.title}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl max-h-[90vh] w-full"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {filteredImages.length > 1 && (
                <>
                  <button
                    onClick={() => navigateLightbox('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => navigateLightbox('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <img
                src={filteredImages[currentIndex]?.url}
                alt={filteredImages[currentIndex]?.title || 'Gallery image'}
                className="w-full h-full object-contain rounded-2xl"
              />

              {filteredImages[currentIndex]?.title && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3">
                  <p className="text-white font-bold text-center">
                    {filteredImages[currentIndex].title}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

