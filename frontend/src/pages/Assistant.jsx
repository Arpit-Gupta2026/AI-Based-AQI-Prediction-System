import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader } from 'lucide-react';
import { useAQI } from '../contexts/AQIContext';

export default function Assistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Welcome to the full EcoGuard Intelligence Center! I'm your AI assistant powered by Gemini. Ask me anything about the environment, air quality, or get personalized recommendations." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { data } = useAQI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    const newUserMsg = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: data?.current || null
        })
      });
      
      const result = await response.json();
      
      const newBotMsg = { 
        id: Date.now(), 
        type: 'bot', 
        text: result.reply 
      };
      setMessages(prev => [...prev, newBotMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        type: 'bot', 
        text: "Sorry, I'm having trouble connecting to the intelligence engine right now." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[750px] max-h-[85vh] overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center gap-4 text-white">
        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
          <Bot className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold">EcoGuard Intelligence Center</h2>
          <p className="text-sm text-blue-100">Powered by Gemini AI (or fallback rules)</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto flex flex-col gap-6">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-4 rounded-3xl text-[15px] leading-relaxed shadow-sm flex items-start gap-3 ${
              msg.type === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-sm' 
                : 'bg-white border border-gray-200 text-gray-700 rounded-tl-sm'
            }`}>
              {msg.type === 'bot' && <Bot className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />}
              <div>{msg.text}</div>
              {msg.type === 'user' && <User className="h-5 w-5 text-blue-200 shrink-0 mt-0.5" />}
            </div>
          </div>
        ))}

        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white border border-gray-200 p-4 rounded-3xl rounded-tl-sm shadow-sm flex items-center gap-2">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask anything about the air quality, or how to stay healthy today..." 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-[15px]"
          />
          <button 
            onClick={() => handleSend(input)}
            className="h-14 w-14 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Send className="h-6 w-6 ml-1" />
          </button>
        </div>
        <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          <p className="text-sm font-semibold text-gray-400 whitespace-nowrap">Suggested:</p>
          {['Give me a full health report for today.', 'Can I take my kids to the park?', 'Why does humidity affect PM2.5?'].map(q => (
            <button 
              key={q}
              onClick={() => handleSend(q)}
              className="text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
