import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Loader2, 
  Scale, 
  Bell, 
  Bookmark,
  MessageSquare
} from 'lucide-react';
import { aiApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function VoiceAssistantModal({ isOpen, onClose, currentProductId = null }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [actionTriggered, setActionTriggered] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check browser speech recognition API support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-send once speech stops and transcript is present
  const handleQuery = async (queryText) => {
    const textToSend = queryText || transcript;
    if (!textToSend || !textToSend.trim()) return;

    setIsLoading(true);
    setAiResponse('');
    setActionTriggered(null);

    try {
      const res = await aiApi.chat({
        message: textToSend,
        currentProductId1: currentProductId,
      });

      const responseText = res.data.text;
      setAiResponse(responseText);
      setActionTriggered(res.data.actionData);

      // Speak response using SpeechSynthesis
      speakResponse(responseText);
    } catch (err) {
      setAiResponse("I'm sorry, I encountered an issue analyzing your query. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (!isSupported) return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (isListening) {
      try { recognitionRef.current?.stop(); } catch (e) {}
      setIsListening(false);
      if (transcript) handleQuery(transcript);
    } else {
      setTranscript('');
      setAiResponse('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Error starting speech recognition:', e);
      }
    }
  };

  const speakResponse = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*#_`]/g, '').replace(/\[.*?\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 to-brand-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-brand-600 text-white rounded-xl shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Buyora Voice Assistant</h3>
              <p className="text-xs text-slate-500">Ask about battery, real costs, performance or comparisons</p>
            </div>
          </div>
          <button 
            onClick={() => { stopSpeaking(); onClose(); }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-6">
          
          {!isSupported && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              Voice recognition is not supported in this browser. You can still type queries in the AI Assistant tab!
            </div>
          )}

          {/* Voice Wave / Pulse Circle */}
          <div className="relative flex items-center justify-center">
            {isListening && (
              <div className="absolute w-36 h-36 rounded-full bg-brand-400/20 animate-ping" />
            )}
            {isSpeaking && (
              <div className="absolute w-36 h-36 rounded-full bg-indigo-400/20 animate-pulse" />
            )}
            <button
              onClick={toggleListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
                isListening 
                  ? 'bg-rose-500 hover:bg-rose-600 scale-105 shadow-rose-500/30' 
                  : 'bg-gradient-to-tr from-brand-600 to-indigo-600 hover:scale-105 shadow-brand-500/30'
              }`}
            >
              {isListening ? (
                <Mic className="w-10 h-10 animate-bounce" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {isListening ? 'Listening... Speak your question' : isSpeaking ? 'Speaking response...' : isLoading ? 'Analyzing product data...' : 'Tap microphone to speak'}
          </p>

          {/* Live Transcript Display */}
          {transcript && (
            <div className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 font-medium">
              <span className="text-xs text-slate-400 block mb-1">You asked:</span>
              "{transcript}"
            </div>
          )}

          {/* AI Response Output */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-brand-600 font-medium py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Consulting verified product specifications...</span>
            </div>
          )}

          {aiResponse && !isLoading && (
            <div className="w-full text-left p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Buyora AI Intelligence
                </span>
                {isSpeaking ? (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <VolumeX className="w-3.5 h-3.5" /> Mute
                  </button>
                ) : (
                  <button
                    onClick={() => speakResponse(aiResponse)}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Replay
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {aiResponse}
              </p>

              {/* Action Trigger Pills */}
              {actionTriggered && (
                <div className="pt-2 border-t border-indigo-100 flex flex-wrap gap-2">
                  {actionTriggered.type === 'COMPARE' && (
                    <button
                      onClick={() => { stopSpeaking(); onClose(); navigate('/compare'); }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-sm"
                    >
                      <Scale className="w-3.5 h-3.5" /> Open Comparison Matrix
                    </button>
                  )}
                  {actionTriggered.type === 'ALERT' && (
                    <button
                      onClick={() => { stopSpeaking(); onClose(); navigate('/prices'); }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-700 shadow-sm"
                    >
                      <Bell className="w-3.5 h-3.5" /> Set Price Alert ({actionTriggered.targetPrice ? `₹${actionTriggered.targetPrice.toLocaleString()}` : 'Custom'})
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Voice Suggestions */}
          {!transcript && !aiResponse && (
            <div className="w-full text-left">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Sample Voice Queries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Which phone is best for battery life?",
                  "Is the ₹15,000 discount real or fake?",
                  "What hidden costs does this product have?",
                  "Compare iPhone 15 Pro Max and Galaxy S24 Ultra",
                ].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTranscript(s);
                      handleQuery(s);
                    }}
                    className="text-xs text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    "{s}"
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Connected to Google Gemini & Buyora Engine</span>
          <button
            onClick={() => { stopSpeaking(); onClose(); navigate('/assistant'); }}
            className="text-brand-600 font-semibold hover:underline flex items-center gap-1"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Open Full Chat
          </button>
        </div>

      </div>
    </div>
  );
}
