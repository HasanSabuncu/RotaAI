import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User as UserIcon, Sparkles, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollArea } from './ui/scroll-area';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'TR' | 'EN';
  onNavigate: (page: string, data?: any) => void;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  suggestions?: Array<{ id: string; name: string; nameEn: string; category: string; rating: number }>;
}

export function Chatbot({ isOpen, onClose, language, onNavigate }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const translations = {
    TR: {
      title: 'AI Seyahat Asistanı',
      placeholder: 'Mesajınızı yazın...',
      send: 'Gönder',
      welcome: 'Merhaba! Ben RotaAI asistanınızım. Size nasıl yardımcı olabilirim? Gezmek istediğiniz yerleri, ilgi alanlarınızı veya tercihlerinizi anlatın.',
      typing: 'Yazıyor...',
      viewDetails: 'Detayları Gör',
      quickResponses: {
        historical: 'Tarihi yerler',
        nature: 'Doğa ve manzara',
        food: 'Yemek ve gastronomi',
        art: 'Sanat ve müzeler'
      }
    },
    EN: {
      title: 'AI Travel Assistant',
      placeholder: 'Type your message...',
      send: 'Send',
      welcome: 'Hello! I\'m your RotaAI assistant. How can I help you? Tell me about the places you want to visit, your interests, or preferences.',
      typing: 'Typing...',
      viewDetails: 'View Details',
      quickResponses: {
        historical: 'Historical places',
        nature: 'Nature & scenery',
        food: 'Food & gastronomy',
        art: 'Art & museums'
      }
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: t.welcome
      }]);
    }
  }, [isOpen, messages.length, t.welcome]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const mockSuggestions = [
        {
          id: '1',
          name: 'Ayasofya',
          nameEn: 'Hagia Sophia',
          category: 'historical',
          rating: 4.8
        },
        {
          id: '2',
          name: 'Topkapı Sarayı',
          nameEn: 'Topkapi Palace',
          category: 'historical',
          rating: 4.7
        },
        {
          id: '3',
          name: 'Kapalıçarşı',
          nameEn: 'Grand Bazaar',
          category: 'shopping',
          rating: 4.6
        }
      ];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: language === 'TR' 
          ? 'Harika! İstediğiniz kriterlere göre size özel öneriler hazırladım. İşte sizin için seçtiğim yerler:'
          : 'Great! I\'ve prepared custom recommendations based on your criteria. Here are the places I selected for you:',
        suggestions: mockSuggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickResponse = (text: string) => {
    setInput(text);
    setTimeout(() => handleSend(), 100);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full md:max-w-2xl h-[90vh] md:h-[600px] bg-white md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white">{t.title}</h3>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'bot' 
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                      : 'bg-gray-200'
                  }`}>
                    {message.type === 'bot' ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                    <div className={`inline-block p-3 rounded-2xl max-w-[80%] ${
                      message.type === 'bot'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    }`}>
                      <p>{message.content}</p>
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion) => (
                          <motion.div
                            key={suggestion.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm cursor-pointer"
                            onClick={() => {
                              onNavigate('place-detail', suggestion);
                              onClose();
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="text-gray-900">
                                  {language === 'TR' ? suggestion.name : suggestion.nameEn}
                                </h4>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                  <span>⭐ {suggestion.rating}</span>
                                  <span>•</span>
                                  <span className="capitalize">{suggestion.category}</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                {t.viewDetails}
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Responses */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {Object.entries(t.quickResponses).map(([key, value]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickResponse(value)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-sm text-gray-700 hover:border-blue-400 transition-colors"
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.placeholder}
                className="flex-1 rounded-full border-2 focus:border-blue-400"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                className="rounded-full w-12 h-12 p-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
