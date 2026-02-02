import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  current?: boolean;
}

interface ProgressTrackerProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  showDescriptions?: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  steps,
  orientation = 'horizontal',
  showDescriptions = true,
}) => {
  const currentStepIndex = steps.findIndex(s => s.current || (!s.completed && !steps.find((s2, i) => i > steps.indexOf(s) && !s2.completed)));

  if (orientation === 'vertical') {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-200">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                className="absolute top-0 left-0 w-full bg-indigo-600 origin-top"
              />
            </div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.id} className="relative flex gap-6">
                  {/* Step Circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                        step.completed
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : step.current
                          ? 'bg-white border-indigo-600 text-indigo-600'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      {step.completed ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </motion.div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pt-2">
                    <h3
                      className={`text-lg font-bold mb-1 ${
                        step.completed || step.current
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </h3>
                    {showDescriptions && step.description && (
                      <p className="text-sm text-slate-500">{step.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Horizontal Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              className="absolute top-0 left-0 h-full bg-indigo-600 origin-left"
            />
          </div>

          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${
                    step.completed
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : step.current
                      ? 'bg-white border-indigo-600 text-indigo-600'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {step.completed ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </motion.div>

                {/* Step Content */}
                <div className="mt-4 text-center max-w-[150px]">
                  <h3
                    className={`text-sm font-bold mb-1 ${
                      step.completed || step.current
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </h3>
                  {showDescriptions && step.description && (
                    <p className="text-xs text-slate-500">{step.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

