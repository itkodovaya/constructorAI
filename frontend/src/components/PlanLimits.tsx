/**
 * Компонент для управления тарифами и ограничениями
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Zap, Rocket, Check, X, AlertCircle } from 'lucide-react';

interface PlanLimitsProps {
  currentPlan: 'free' | 'pro' | 'brandkit';
  projectsCount: number;
  onUpgrade?: (plan: 'pro' | 'brandkit') => void;
}

export const PlanLimits: React.FC<PlanLimitsProps> = ({ currentPlan, projectsCount, onUpgrade }) => {
  const plans = {
    free: {
      name: 'Free',
      projects: 1,
      aiGenerations: 10,
      exports: 5,
      teamMembers: 1,
      icon: <Zap className="w-5 h-5" />,
      color: 'text-slate-600',
    },
    pro: {
      name: 'Pro',
      projects: Infinity,
      aiGenerations: Infinity,
      exports: Infinity,
      teamMembers: 5,
      icon: <Crown className="w-5 h-5" />,
      color: 'text-indigo-600',
    },
    brandkit: {
      name: 'Brand Kit',
      projects: Infinity,
      aiGenerations: Infinity,
      exports: Infinity,
      teamMembers: Infinity,
      icon: <Rocket className="w-5 h-5" />,
      color: 'text-purple-600',
    },
  };

  const current = plans[currentPlan];
  const isAtLimit = currentPlan === 'free' && projectsCount >= current.projects;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-slate-50 ${current.color}`}>
            {current.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Текущий план: {current.name}</h3>
            <p className="text-sm text-slate-500">Ограничения вашего тарифа</p>
          </div>
        </div>
        {isAtLimit && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-bold">Достигнут лимит</span>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Проекты</span>
          <span className="text-sm font-bold text-slate-900">
            {projectsCount} / {current.projects === Infinity ? '∞' : current.projects}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">AI генерации</span>
          <span className="text-sm font-bold text-slate-900">
            {current.aiGenerations === Infinity ? '∞' : `${current.aiGenerations} / месяц`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Экспорты</span>
          <span className="text-sm font-bold text-slate-900">
            {current.exports === Infinity ? '∞' : `${current.exports} / месяц`}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Участники команды</span>
          <span className="text-sm font-bold text-slate-900">
            {current.teamMembers === Infinity ? '∞' : current.teamMembers}
          </span>
        </div>
      </div>

      {currentPlan === 'free' && onUpgrade && (
        <div className="pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-4 text-center">Обновите план для снятия ограничений</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onUpgrade('pro')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all"
            >
              Pro $20/мес
            </button>
            <button
              onClick={() => onUpgrade('brandkit')}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all"
            >
              Brand Kit $120
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

