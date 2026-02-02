import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, Command, Zap, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: string;
}

interface AIAssistantProps {
  brandName: string;
  onAction: (action: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ brandName, onAction }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: `Привет! Я твой AI-дизайнер для бренда ${brandName}. Я могу помочь изменить палитру, сгенерировать новые блоки для сайта или адаптировать графику. Что сделаем?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Имитация логики AI
    setTimeout(() => {
      let responseContent = "Я проанализировал ваш запрос. ";
      let action;

      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('цвет') || lowerInput.includes('палитр')) {
        responseContent += "Конечно! Я подобрал более современную палитру для вашего бренда. Применить?";
        action = 'update_palette';
      } else if (lowerInput.includes('сайт') || lowerInput.includes('блок')) {
        responseContent += "Я добавил новый блок 'Отзывы' в структуру вашего сайта. Можете проверить в редакторе.";
        action = 'add_site_block';
      } else {
        responseContent += "Я готов помочь с любыми изменениями дизайна. Попробуйте попросить меня 'обновить палитру'.";
      }

      const assistantMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: responseContent,
        action
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      
      if (action) {
        onAction(action);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-3xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                {m.role === 'assistant' && <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-blue-600" /></div>}
                <div className="text-sm font-medium leading-relaxed">
                  {m.content}
                  {m.action && (
                    <div className="mt-2 p-2 bg-blue-600/10 rounded-lg border border-blue-600/20 text-[10px] font-bold text-blue-600 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Действие выполнено: {m.action}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-2">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-slate-50/50 border-t border-slate-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Спроси AI о дизайне..."
            className="w-full p-4 pr-14 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all shadow-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['Обнови палитру', 'Добавь блок на сайт', 'Сделай логотип проще'].map(s => (
            <button 
              key={s}
              onClick={() => setInput(s)}
              className="whitespace-nowrap px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-400 hover:border-blue-200 hover:text-blue-500 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
