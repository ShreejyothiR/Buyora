import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Mic, 
  Scale, 
  Bell, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Loader2, 
  Layers, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { aiApi, productsApi } from '../services/api';

export default function AiAssistant({ onOpenVoice }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductId1, setSelectedProductId1] = useState(searchParams.get('p1') || '');
  const [selectedProductId2, setSelectedProductId2] = useState(searchParams.get('p2') || '');

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am Buyora AI, your independent product intelligence advisor. You can attach products above, ask about hidden costs, compare specifications, analyze marketing hype, or set price drop alerts. How can I help you today?',
      actionData: null,
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeakingIndex, setIsSpeakingIndex] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    productsApi.getAll()
      .then((res) => {
        setAllProducts(res.data);
        if (!selectedProductId1 && res.data.length > 0) {
          setSelectedProductId1(res.data[0].id);
        }
        if (!selectedProductId2 && res.data.length > 1) {
          setSelectedProductId2(res.data[1].id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await aiApi.chat({
        message: textToSend,
        currentProductId1: selectedProductId1 || undefined,
        currentProductId2: selectedProductId2 || undefined,
        history: newMessages.slice(-6),
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.data.text,
          actionData: res.data.actionData,
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an error analyzing product data. Please check your connection or query again.',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeech = (text, index) => {
    if (!window.speechSynthesis) return;

    if (isSpeakingIndex === index) {
      window.speechSynthesis.cancel();
      setIsSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`]/g, '').replace(/\[.*?\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.onend = () => setIsSpeakingIndex(null);
    utterance.onerror = () => setIsSpeakingIndex(null);

    setIsSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleResetChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setMessages([
      {
        role: 'assistant',
        content: 'Chat session refreshed. Select any context products above to begin a focused comparison or inquiry.',
        actionData: null,
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Product Context Selector Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-brand-600 text-white flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">Context-Aware AI Assistant</h1>
              <p className="text-xs text-slate-500">Attach active products to ask contextual comparison questions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              title="Reset Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenVoice}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
            >
              <Mic className="w-4 h-4" /> Voice Mode
            </button>
          </div>
        </div>

        {/* Active Context Products */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Active Context Product 1
            </label>
            <select
              value={selectedProductId1}
              onChange={(e) => setSelectedProductId1(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
            >
              <option value="">None (General Shopping Query)</option>
              {allProducts.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (₹{p.currentPrice?.toLocaleString()})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Active Context Product 2 (Optional for compare)
            </label>
            <select
              value={selectedProductId2}
              onChange={(e) => setSelectedProductId2(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
            >
              <option value="">None</option>
              {allProducts.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (₹{p.currentPrice?.toLocaleString()})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft p-6 flex flex-col h-[520px]">
        
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm space-y-2 ${
                  isUser
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800'
                }`}>
                  <p className="leading-relaxed whitespace-pre-line">
                    {msg.content}
                  </p>

                  {/* Speech Toggle Button for Assistant */}
                  {!isUser && (
                    <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 text-xs">
                      <button
                        onClick={() => handleSpeech(msg.content, index)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        {isSpeakingIndex === index ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" /> Stop Reading
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" /> Read Aloud
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Action Pill if returned by AI */}
                  {msg.actionData && (
                    <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
                      {msg.actionData.type === 'COMPARE' && (
                        <button
                          onClick={() => navigate(`/compare?p1=${selectedProductId1}&p2=${selectedProductId2}`)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm"
                        >
                          <Scale className="w-3.5 h-3.5" /> Launch Side-by-Side Comparison
                        </button>
                      )}
                      {msg.actionData.type === 'ALERT' && (
                        <button
                          onClick={() => navigate('/prices')}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-brand-600 text-white rounded-lg text-xs font-bold shadow-sm"
                        >
                          <Bell className="w-3.5 h-3.5" /> Configure Price Watch Alert
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500">
                Analyzing hardware benchmarks, price histories, and verified reviews...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-semibold uppercase tracking-wider shrink-0">Ask:</span>
          {[
            "Which one has better sustained battery?",
            "What hidden costs exist?",
            "Is this discount authentic?",
            "Who should avoid buying this?",
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 text-slate-600 rounded-lg whitespace-nowrap transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="pt-2 flex items-center gap-2 border-t border-slate-100"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything (e.g. Which laptop is better for programming and battery?)..."
            className="flex-1 px-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-2xl hover:from-brand-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
