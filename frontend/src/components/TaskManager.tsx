import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  CheckSquare, Clock, AlertCircle, 
  Plus, User, Calendar, Tag,
  MoreHorizontal, ChevronRight, Hash
} from 'lucide-react';

export const TaskManager: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [columns, setColumns] = useState<any[]>([
    { id: 'todo', title: 'К выполнению', tasks: [
      { id: 't1', title: 'Обновить Hero-блок', priority: 'high', date: '29 Янв' },
      { id: 't2', title: 'Настроить SEO-мета', priority: 'medium', date: '30 Янв' }
    ]},
    { id: 'in_progress', title: 'В работе', tasks: [
      { id: 't3', title: 'Генерация соц-постов', priority: 'high', date: 'Сегодня' }
    ]},
    { id: 'done', title: 'Готово', tasks: [
      { id: 't4', title: 'Выбор цветовой палитры', priority: 'low', date: 'Вчера' }
    ]}
  ]);

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-black text-slate-900">Задачи проекта</h3>
          <p className="text-slate-500 font-medium">Командная работа и планирование</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <Plus className="w-4 h-4" /> Создать задачу
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8 h-[calc(100vh-250px)]">
        {columns.map(column => (
          <div key={column.id} className="flex flex-col bg-slate-50/50 rounded-[40px] p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  column.id === 'todo' ? 'bg-blue-500' : 
                  column.id === 'in_progress' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <h4 className="font-bold text-slate-800">{column.title}</h4>
                <span className="bg-white px-2.5 py-1 rounded-lg text-[10px] font-black text-slate-400 border border-slate-100 shadow-sm">
                  {column.tasks.length}
                </span>
              </div>
              <button className="text-slate-300 hover:text-slate-500 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
              {column.tasks.map(task => (
                <motion.div 
                  key={task.id}
                  whileHover={{ y: -2, scale: 1.02 }}
                  className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                      task.priority === 'high' ? 'bg-rose-50 text-rose-500 border-rose-100' : 
                      task.priority === 'medium' ? 'bg-amber-50 text-amber-500 border-amber-100' : 
                      'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {task.priority}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-indigo-600 transition-all">
                      <Hash className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h5 className="font-bold text-slate-800 mb-6 group-hover:text-indigo-600 transition-colors">{task.title}</h5>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      {task.date}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

