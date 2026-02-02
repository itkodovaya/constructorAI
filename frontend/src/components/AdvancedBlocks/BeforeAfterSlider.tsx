import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
  orientation = 'horizontal',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const position = orientation === 'horizontal'
      ? ((e.clientX - rect.left) / rect.width) * 100
      : ((e.clientY - rect.top) / rect.height) * 100;

    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const position = orientation === 'horizontal'
      ? ((touch.clientX - rect.left) / rect.width) * 100
      : ((touch.clientY - rect.top) / rect.height) * 100;

    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const position = orientation === 'horizontal'
        ? ((e.clientX - rect.left) / rect.width) * 100
        : ((e.clientY - rect.top) / rect.height) * 100;
      setSliderPosition(Math.max(0, Math.min(100, position)));
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMoveGlobal);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMoveGlobal);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, orientation]);

  if (orientation === 'vertical') {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            className="relative h-[600px] rounded-2xl overflow-hidden cursor-col-resize"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
          >
            {/* Before Image */}
            <div className="absolute inset-0">
              <img
                src={beforeImage}
                alt="Before"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold">
                {beforeLabel}
              </div>
            </div>

            {/* After Image */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(${100 - sliderPosition}% 0 0 0)` }}
            >
              <img
                src={afterImage}
                alt="After"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold">
                {afterLabel}
              </div>
            </div>

            {/* Slider Line */}
            <div
              className="absolute w-1 bg-white shadow-lg z-10"
              style={{
                top: 0,
                bottom: 0,
                left: `${sliderPosition}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                <div className="flex flex-col gap-1">
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div
          ref={containerRef}
          className="relative aspect-video rounded-2xl overflow-hidden cursor-col-resize"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* Before Image */}
          <div className="absolute inset-0">
            <img
              src={beforeImage}
              alt="Before"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold">
              {beforeLabel}
            </div>
          </div>

          {/* After Image */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={afterImage}
              alt="After"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold">
              {afterLabel}
            </div>
          </div>

          {/* Slider Line */}
          <div
            className="absolute h-full w-1 bg-white shadow-lg z-10"
            style={{
              left: `${sliderPosition}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
              <div className="flex gap-1">
                <ChevronLeft className="w-4 h-4 text-slate-700" />
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

