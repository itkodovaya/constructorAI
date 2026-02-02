import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, CheckCircle2, AlertTriangle, X, Eye } from 'lucide-react';
import { checkWCAGCompliance, checkContrast, getContrastColor } from '../utils/accessibility';

interface AccessibilityCheckerProps {
  onClose: () => void;
}

export const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({ onClose }) => {
  const [results, setResults] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const runCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      const mainContent = document.getElementById('root') || document.body;
      const checkResult = checkWCAGCompliance(mainContent);
      setResults(checkResult);
      setIsChecking(false);
    }, 1000);
  };

  useEffect(() => {
    runCheck();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <Accessibility className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Accessibility Checker</h2>
              <p className="text-slate-500 text-sm font-medium">Проверка соответствия WCAG 2.1</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/60 rounded-xl transition-all"
            aria-label="Закрыть проверку доступности"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {isChecking ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results ? (
            <div className="space-y-6">
              {/* Overall Status */}
              <div className={`p-6 rounded-2xl border-2 ${
                results.passed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {results.passed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  )}
                  <h3 className="text-xl font-bold text-slate-900">
                    {results.passed ? 'Соответствует WCAG 2.1 AA' : 'Требуются исправления'}
                  </h3>
                </div>
                <p className="text-slate-600">
                  {results.passed
                    ? 'Все проверки пройдены успешно. Платформа соответствует стандартам доступности.'
                    : 'Обнаружены проблемы, которые необходимо исправить для соответствия стандартам.'}
                </p>
              </div>

              {/* Issues */}
              {results.issues.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Критические проблемы ({results.issues.length})
                  </h4>
                  <ul className="space-y-2">
                    {results.issues.map((issue: string, index: number) => (
                      <li
                        key={index}
                        className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-slate-700"
                      >
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {results.warnings.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    Предупреждения ({results.warnings.length})
                  </h4>
                  <ul className="space-y-2">
                    {results.warnings.map((warning: string, index: number) => (
                      <li
                        key={index}
                        className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-slate-700"
                      >
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success Message */}
              {results.passed && results.issues.length === 0 && results.warnings.length === 0 && (
                <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-800 font-medium">
                    ✓ Все проверки доступности пройдены успешно!
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={runCheck}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Запустить проверку заново
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Закрыть
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

