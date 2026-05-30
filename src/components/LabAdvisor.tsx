/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Send, Bot, Sparkles, User, HelpCircle, Loader2, RefreshCw } from "lucide-react";
import { ChatMessage } from "../types";

export function LabAdvisor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Welcome to Madiyan Biotech's AI Diagnostics Advisor. I can help you understand lab test requirements (fasting, sample types), interpret general lab terminologies, or guide you on preparing for our ECG or home collection collections. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shortcutQuestions = [
    { label: "Lipid Test Fasting", text: "What are the fasting preparation rules for the Lipids Profile lab test?" },
    { label: "ECG Test Info", text: "How is an ECG test done and what should I expect?" },
    { label: "HbA1c Purpose", text: "What does an HbA1c test measure and who needs it?" },
    { label: "Home Collection areas", text: "Do you offer home collection in Manikoth & Madiyan Complex areas?" }
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setError(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5) // Send last few messages for ongoing context
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Server could not process request");
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Could not connect to medical lab assistant. Please ensure GEMINI_API_KEY is configured in AI Studio Secrets.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "assistant",
        text: "Chat database cleared. Ask me any medical biotech questions regarding preparations, laboratory diagnostics, or home visits.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setError(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[540px]">
      {/* Advisor Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between gap-3 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-teal-400 to-cyan-400 rounded-xl text-slate-900 shadow-inner">
            <Bot className="w-5 h-5 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold tracking-wide">Madiyan BioInterpreter™</h4>
              <span className="flex items-center gap-1 bg-teal-400/20 text-teal-300 text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold font-mono">
                <Sparkles className="w-2.5 h-2.5 inline" /> AI Advisor
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Instant Biotech Diagnostics Analyst</p>
          </div>
        </div>

        <button 
          onClick={clearChat}
          className="text-slate-400 hover:text-white transition p-1.5 hover:bg-slate-800 rounded-lg"
          title="Reset conversation history"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Lounge */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar block */}
            <div className={`p-1.5 rounded-xl self-start shrink-0 ${
              msg.sender === "user" 
                ? "bg-teal-600 text-white shadow-sm" 
                : "bg-slate-900 text-teal-400 shadow-sm"
            }`}>
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble body */}
            <div className={`rounded-2xl p-3.5 shadow-sm text-sm ${
              msg.sender === "user"
                ? "bg-teal-600 text-white rounded-tr-none"
                : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
            }`}>
              <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
              <div className={`text-[10px] text-right mt-1.5 uppercase font-mono ${
                msg.sender === "user" ? "text-teal-200" : "text-slate-400"
              }`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[85%] mr-auto items-center">
            <div className="p-1.5 rounded-xl bg-slate-900 text-teal-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-teal-500 animate-spin" />
              <span className="text-xs text-slate-500 font-medium">BioInterpreter is synthesizing parameters...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-slate-800 text-xs flex gap-3 items-start animate-fade-in shadow-inner">
            <HelpCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-rose-700">Advisory Alert</p>
              <p className="leading-relaxed text-rose-800">{error}</p>
              <p className="text-[10px] text-slate-400 font-mono">Ensure that the GEMINI_API_KEY secret is populated inside AI Studio Settings.</p>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Buttons */}
      <div className="p-3 border-t border-slate-100 bg-slate-100/30 overflow-x-auto shrink-0">
        <div className="flex gap-2 w-max pb-1">
          {shortcutQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q.text)}
              disabled={loading}
              className="text-xs bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all font-semibold rounded-lg px-3 py-1.5 shadow-sm shrink-0 whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Input Form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-4 border-t border-slate-200 bg-white flex gap-3 shrink-0"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about fasting, blood reference levels, ECG preparation..."
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 bg-slate-50"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-4 py-2.5 transition flex items-center justify-center cursor-pointer disabled:opacity-50 inline-flex"
          disabled={loading || !inputValue.trim()}
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
