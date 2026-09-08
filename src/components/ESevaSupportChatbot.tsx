import React, { useState, useRef, useEffect } from "react";
import { 
  Building2, Send, Bot, User, RefreshCcw, Landmark, 
  HelpCircle, Sparkles, MessageSquare, AlertCircle, ShieldAlert,
  ExternalLink
} from "lucide-react";
import { ChatMessage } from "../types";
import { useLanguage } from "../LanguageContext";

interface ESevaSupportChatbotProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string, useSearch?: boolean) => Promise<void>;
  onClearChat: () => void;
  loading: boolean;
}

export default function ESevaSupportChatbot({ chatHistory, onSendMessage, onClearChat, loading }: ESevaSupportChatbotProps) {
  const { t, language } = useLanguage();
  const [inputText, setInputText] = useState("");
  const [useSearch, setUseSearch] = useState(true); // Enabled by default to use search grounding!
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const suggestionChips = language === "hi" ? [
    "आधार का पता कैसे बदलें?",
    "आभा स्वास्थ्य कार्ड के लिए आवेदन कैसे करें?",
    "ई-श्रम कार्ड के क्या लाभ हैं?",
    "पीएम-किसान योजना के दस्तावेज?",
    "जाति प्रमाण पत्र कहाँ से बनवाएं?"
  ] : [
    "How to change Aadhaar address?",
    "Apply for ABHA health card",
    "What are e-Shram worker benefits?",
    "Check PM-KISAN eligibility documents",
    "Where to file caste certificate?"
  ];

  // Auto scroll messages to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    onSendMessage(inputText, useSearch);
    setInputText("");
  };

  const handleChipClick = (chipText: string) => {
    if (loading) return;
    onSendMessage(chipText, useSearch);
  };

  return (
    <div className="bg-white border border-gray-150 rounded-2xl flex flex-col h-[550px] shadow-sm overflow-hidden text-xs text-slate-800 animate-fade-in" id="suvidha-sahayak-bot">
      
      {/* 1. Chatbot Header bar */}
      <div className="bg-slate-950 p-4 text-white flex items-center justify-between border-b border-slate-850 shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white border border-white/10 shadow shadow-amber-500/20">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-extrabold text-sm tracking-tight font-sans">
                {language === "hi" ? "ई-सेवा सुविधा सहायक" : "e-Seva Suvidha Sahayak"}
              </h4>
              <span className="bg-orange-500/25 text-orange-350 border border-orange-500/20 text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase">
                {t("chat.ai_badge")}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-0.5">{t("chat.sub_title")}</p>
          </div>
        </div>

        <button
          onClick={onClearChat}
          className="p-1.5 hover:bg-slate-900 border border-slate-850 text-slate-300 rounded-lg transition"
          title={language === "hi" ? "संवाद इतिहास साफ़ करें" : "Clear Conversation Logs"}
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Security note */}
      <div className="bg-orange-50 p-2.5 border-b border-orange-100 flex items-center gap-2 text-slate-700 shrink-0 select-none">
        <ShieldAlert className="w-4.5 h-4.5 text-orange-600 shrink-0" />
        <span className="text-[10px] leading-snug">
          <strong>{t("chat.safety_hdr")}</strong> {t("chat.safety_txt")}
        </span>
      </div>

      {/* 2. Messages conversation pool */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 bg-slate-50/50">
        
        {chatHistory.length === 0 && (
          <div className="text-center py-8 px-4 max-w-sm mx-auto space-y-4 select-none">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-slate-850">{t("chat.welcome_hdr")}</h5>
              <p className="text-[11px] text-slate-505 leading-relaxed">
                {t("chat.welcome_txt")}
              </p>
            </div>
          </div>
        )}

        {chatHistory.map((msg) => {
          const isModel = msg.role === "model";
          return (
            <div 
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isModel ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isModel ? "bg-orange-500 text-white" : "bg-slate-900 text-slate-100"
              }`}>
                {isModel ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
              </div>

              <div className="space-y-0.5">
                <div className={`p-3 rounded-2xl border leading-relaxed font-sans text-[11.5px] whitespace-pre-line ${
                  isModel 
                    ? "bg-white border-gray-200 text-slate-755 rounded-tl-none shadow-xs" 
                    : "bg-slate-900 border-slate-900 text-white rounded-tr-none shadow-xs"
                }`}>
                  {msg.text}

                  {isModel && msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-gray-100 select-none">
                      <span className="text-[9px] font-mono font-bold tracking-wider text-gray-400 block mb-1.5 uppercase">
                        {language === "hi" ? "गूगल सर्च सत्यापित स्रोत:" : "Google Search Verified Sources:"}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 text-amber-900 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/30 rounded text-[9.5px] font-semibold transition"
                            title={src.title}
                          >
                            <ExternalLink className="w-2.5 h-2.5 text-amber-700 dark:text-amber-500 shrink-0" />
                            <span className="truncate max-w-[124px]">{src.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className={`text-[8.5px] font-mono text-slate-455 block select-none ${isModel ? "text-left pl-1" : "text-right pr-1"}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="p-3 bg-white border border-gray-250 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-1.5 text-slate-500">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              <span className="font-mono text-[10.5px] text-slate-400 ml-1">{t("chat.thinking")}</span>
            </div>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </div>

      {/* Suggestion Chips Panel */}
      {chatHistory.length === 0 && (
        <div className="px-4 py-3 bg-white border-t border-gray-100 shrink-0">
          <span className="font-extrabold text-gray-400 text-[9px] uppercase tracking-wider block mb-2 select-none">
            {t("chat.suggestions_lbl")}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(chip)}
                disabled={loading}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-gray-200 rounded-lg text-[10px] transition text-left cursor-pointer select-none"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Input Text Box form */}
      <div className="p-4 bg-white border-t border-gray-150 shrink-0">
        <div className="flex items-center justify-between mb-3.5 px-1 select-none">
          <button
            type="button"
            onClick={() => setUseSearch(!useSearch)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10.2px] font-extrabold tracking-wide transition-all cursor-pointer ${
              useSearch 
                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-400 shadow-3xs" 
                : "bg-stone-50 border-stone-200/60 text-stone-500 hover:border-stone-300 hover:text-stone-755"
            }`}
          >
            {/* Custom Google Styled "G" badge */}
            <span className="flex items-center justify-center w-3 h-3 text-[10px] font-black bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent select-none">G</span>
            <span>{language === "hi" ? "गूगल सर्च डेटा उपयोग करें" : "Use Google Search data"}</span>
            {useSearch && <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-500 animate-pulse ml-0.5" />}
          </button>
          
          <span className="text-[9px] font-mono text-stone-400 dark:text-slate-500">
            {useSearch ? (language === "hi" ? "लाइव वेब सक्षम" : "Live Web Grounding Active") : (language === "hi" ? "स्थानीय सहायक" : "Core Assistant Knowledge")}
          </span>
        </div>

        <form onSubmit={handleSend} className="flex gap-2.5">
          <input
            type="text"
            placeholder={t("chat.input_placeholder")}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-50 border border-gray-300 rounded-xl py-3 px-4 focus:ring-1 focus:ring-orange-500 outline-none text-xs"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="px-4 bg-orange-600 hover:bg-orange-750 hover:scale-105 active:scale-95 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center shrink-0 disabled:opacity-40 select-none border-0"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>

    </div>
  );
}
