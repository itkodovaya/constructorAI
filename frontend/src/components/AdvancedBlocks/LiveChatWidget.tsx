import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2, Maximize2, Phone, Mail } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface LiveChatWidgetProps {
  title?: string;
  agentName?: string;
  agentStatus?: 'online' | 'offline' | 'away';
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
  position?: 'bottom-right' | 'bottom-left';
  integrations?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  title = 'Chat with us',
  agentName = 'Support Agent',
  agentStatus = 'online',
  initialMessages = [],
  onSendMessage,
  position = 'bottom-right',
  integrations,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    onSendMessage?.(inputValue);
    setInputValue('');

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.',
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className={`fixed ${positionClasses[position]} z-50 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-indigo-500/50 transition-all`}
        >
          <MessageCircle className="w-7 h-7" />
          {agentStatus === 'online' && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
          )}
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed ${positionClasses[position]} z-50 w-96 ${isMinimized ? 'h-16' : 'h-[600px]'} bg-white rounded-2xl shadow-2xl border-2 border-slate-100 flex flex-col overflow-hidden transition-all`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  {agentStatus === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <div className="font-bold">{agentName}</div>
                  <div className="text-xs text-white/80">
                    {agentStatus === 'online' ? 'Online' : agentStatus === 'away' ? 'Away' : 'Offline'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-sm">Start a conversation</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-3 ${
                            message.sender === 'user'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-slate-900 border border-slate-200'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Integrations */}
                {integrations && (integrations.phone || integrations.email || integrations.whatsapp) && (
                  <div className="px-4 py-3 bg-slate-100 border-t border-slate-200 flex items-center gap-3">
                    {integrations.phone && (
                      <a
                        href={`tel:${integrations.phone}`}
                        className="p-2 bg-white rounded-xl hover:bg-indigo-50 transition-colors"
                        title="Call us"
                      >
                        <Phone className="w-4 h-4 text-indigo-600" />
                      </a>
                    )}
                    {integrations.email && (
                      <a
                        href={`mailto:${integrations.email}`}
                        className="p-2 bg-white rounded-xl hover:bg-indigo-50 transition-colors"
                        title="Напишите нам"
                      >
                        <Mail className="w-4 h-4 text-indigo-600" />
                      </a>
                    )}
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
                    />
                    <button
                      onClick={handleSend}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

