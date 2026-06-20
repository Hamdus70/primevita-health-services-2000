import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, MessageSquare, Calendar, Stethoscope, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: 'Hello. Welcome to PrimeVita Health Services. I am PrimeVita AI. I can help you learn about our services, book appointments, guide you through registration, answer healthcare questions, assist with applications, explain workflows, and support your journey through our platform. How may I assist you today?' }]);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: 'Book Appointment', icon: Calendar, action: 'I want to book an appointment' },
    { label: 'Check Symptoms', icon: Stethoscope, action: 'I want to check my symptoms' },
    { label: 'Speak to Agent', icon: Users, action: 'I want to speak with a human agent' },
  ];

  return (
    <>
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl z-50 transition-all duration-300 flex items-center justify-center p-0",
          isOpen ? "bg-red-600 hover:bg-red-700" : "bg-[#10837f] hover:bg-[#0e6e6a]"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden z-50"
          >
            <div className="bg-[#10837f] p-4 text-white font-semibold flex justify-between items-center shadow-md">
              <span>PrimeVita AI Assistant</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", m.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <span className={cn(
                    "p-3 rounded-2xl max-w-[85%] text-sm",
                    m.role === 'user' 
                      ? 'bg-[#10837f] text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  )}>
                    {m.content}
                  </span>
                </motion.div>
              ))}
              {isLoading && (
                <div className="text-sm text-gray-500 p-2 animate-pulse">PrimeVita AI is thinking...</div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {messages.length === 1 && (
              <div className="p-4 grid grid-cols-1 gap-2 bg-white">
                {quickActions.map((action) => (
                  <Button 
                    key={action.label}
                    variant="outline"
                    className="justify-start gap-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                    onClick={() => sendMessage(action.action)}
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                ))}
              </div>
            )}

            <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="How can I help you?"
                className="flex-1 rounded-full px-4 border-gray-300"
              />
              <Button onClick={() => sendMessage(input)} className="rounded-full bg-[#10837f] hover:bg-[#0e6e6a]" disabled={isLoading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
