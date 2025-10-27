import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GroundingChunk } from '../types';
import { SendIcon, SparklesIcon, CheckCircleIcon, UserIcon } from './icons';
import MessageRenderer from './MessageRenderer';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onApprove?: (message: ChatMessage, index: number) => void;
  disabled: boolean;
  isBotResponding: boolean;
  isFindingItems?: boolean;
  placeholder?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
    messages, onSendMessage, onApprove, disabled, isBotResponding, isFindingItems, placeholder
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled && !isBotResponding) {
      onSendMessage(input.trim());
      setInput('');
    }
  };
  
  const renderSources = (sources: GroundingChunk[]) => {
    const validSources = sources.filter(s => s.web?.uri);
    if(validSources.length === 0) return null;

    return (
        <div className="mt-2">
            <h4 className="text-xs font-bold text-slate-500 mb-1">Sources:</h4>
            <div className="flex flex-wrap gap-2">
                {validSources.map((source, index) => (
                    <a 
                        key={index} 
                        href={source.web!.uri!} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-slate-200 hover:bg-slate-300 text-teal-700 px-2 py-1 rounded-md transition-colors font-medium"
                    >
                        {source.web!.title || new URL(source.web!.uri!).hostname}
                    </a>
                ))}
            </div>
        </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white border border-slate-200 rounded-lg shadow-xl flex flex-col" style={{height: '70vh'}}>
      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-end gap-3 animate-new-message ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.sender === 'ai' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-white"/></div>}
              <div className={`max-w-md`}>
                <div className={`p-3 rounded-lg ${message.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {message.sender === 'user' ? (
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }}></p>
                    ) : (
                        <MessageRenderer text={message.text} />
                    )}
                    {message.image && (
                        <img 
                            src={`data:${message.image.mimeType};base64,${message.image.base64}`} 
                            alt="AI generated design"
                            className="mt-2 rounded-lg border border-slate-200"
                        />
                    )}
                    {message.sender === 'ai' && message.sources && renderSources(message.sources)}
                    {message.actions?.includes('approve') && onApprove && (
                        <div className="mt-3 pt-3 border-t border-slate-300/50">
                            {message.isApproved ? (
                                <div className="flex items-center gap-2 text-green-700">
                                    <CheckCircleIcon className="w-5 h-5" />
                                    <span className="text-sm font-semibold">Approved</span>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => onApprove(message, index)}
                                    className="w-full text-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors"
                                >
                                    Approve
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {message.timestamp && (
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                )}
              </div>
              {message.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center"><UserIcon className="w-5 h-5 text-slate-500"/></div>}
            </div>
          ))}
           {isFindingItems && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-white"/></div>
              <div className="max-w-md p-3 rounded-lg bg-slate-100 text-slate-700">
                <div className="flex items-center space-x-3">
                    <svg className="animate-spin h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm text-slate-500">Searching for products...</span>
                </div>
              </div>
            </div>
           )}
           {isBotResponding && !isFindingItems && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-white"/></div>
              <div className="max-w-md p-3 rounded-lg bg-slate-100 text-slate-700">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
           )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder || (disabled ? "Upload an image to start" : "e.g., 'Make this room minimalist'")}
            disabled={disabled || isBotResponding}
            className="w-full bg-slate-100 text-slate-800 rounded-full py-3 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled || isBotResponding || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-teal-600 text-white hover:bg-teal-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;