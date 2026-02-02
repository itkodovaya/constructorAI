import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Calendar } from 'lucide-react';

interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
}

interface InteractiveTimelineProps {
  title?: string;
  items: TimelineItem[];
  orientation?: 'horizontal' | 'vertical';
}

export const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({
  title,
  items,
  orientation = 'vertical',
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  if (orientation === 'horizontal') {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
            {title}
          </h2>
        )}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform -translate-y-1/2" />
          
          <div className="relative flex justify-between items-center">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="relative flex flex-col items-center cursor-pointer group"
                onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
              >
                {/* Timeline Dot */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`w-12 h-12 rounded-full bg-white border-4 ${
                    activeItem === item.id
                      ? 'border-indigo-600 scale-110'
                      : 'border-indigo-300'
                  } flex items-center justify-center shadow-lg transition-all z-10`}
                  style={{ borderColor: item.color || '#6366f1' }}
                >
                  {item.icon ? (
                    <span className="text-2xl">{item.icon}</span>
                  ) : (
                    <Calendar className="w-6 h-6 text-indigo-600" />
                  )}
                </motion.div>

                {/* Content Card */}
                <AnimatePresence>
                  {activeItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute top-16 w-64 bg-white rounded-xl shadow-xl p-4 z-20"
                    >
                      <div className="text-xs font-bold text-indigo-600 mb-2">
                        {item.date}
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Date Label */}
                <div className="mt-4 text-center">
                  <div className="text-xs font-bold text-slate-600">{item.date}</div>
                  <div className="text-sm font-semibold text-slate-900 mt-1">
                    {item.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      {title && (
        <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">
          {title}
        </h2>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />

          <div className="space-y-12">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-24 cursor-pointer group"
                onClick={() => setActiveItem(activeItem === item.id ? null : item.id)}
              >
                {/* Timeline Dot */}
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={`absolute left-0 w-16 h-16 rounded-full bg-white border-4 ${
                    activeItem === item.id
                      ? 'border-indigo-600 scale-110'
                      : 'border-indigo-300'
                  } flex items-center justify-center shadow-lg transition-all z-10`}
                  style={{ borderColor: item.color || '#6366f1' }}
                >
                  {item.icon ? (
                    <span className="text-2xl">{item.icon}</span>
                  ) : (
                    <Calendar className="w-6 h-6 text-indigo-600" />
                  )}
                </motion.div>

                {/* Content */}
                <div
                  className={`bg-white rounded-xl p-6 shadow-lg transition-all ${
                    activeItem === item.id
                      ? 'shadow-xl ring-2 ring-indigo-500'
                      : 'hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-bold text-indigo-600">{item.date}</div>
                    <ChevronRight
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        activeItem === item.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <AnimatePresence>
                    {activeItem === item.id && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-slate-600"
                      >
                        {item.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

