import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User } from 'lucide-react';
import { useAQI } from '../../contexts/AQIContext';

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hi! I'm your environmental intelligence assistant. How can I help you today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const { data } = useAQI();

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    // Add user message
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend(input);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center gap-3 z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <Bot className="h-6 w-6" />
        <span className="font-bold">Ask AQI AI</span>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-[350px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transform transition-all duration-300 origin-bottom-right flex flex-col overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white shadow-md relative z-10">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h3 className="font-bold text-sm">AQI AI Assistant</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 h-[380px] p-4 bg-gray-50 overflow-y-auto flex flex-col gap-3">
          
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.type === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm' 
                  : 'bg-white border border-gray-200 text-gray-700 rounded-tl-sm shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
             <div className="flex justify-start">
               <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
          )}
          
          {messages.length === 1 && !isTyping && (
            <div className="mt-2 flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Suggested</p>
              {['Can I go running today?', 'What is the AQI near me?', 'Why is AQI high today?'].map(q => (
                <button 
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-left text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 py-2 px-3 rounded-xl transition-colors"
                >
                  "{q}"
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] relative z-10">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question..." 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
            <button 
              onClick={() => handleSend(input)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Send className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
