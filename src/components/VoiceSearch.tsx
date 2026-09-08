import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, MicOff, X, Globe, RefreshCw, AlertCircle, Sparkles, Check, HelpCircle } from "lucide-react";

interface VoiceSearchProps {
  currentLanguage: string;
  onSpeechResult: (text: string) => void;
  triggerToast: (msg: string, type?: "success" | "info" | "error") => void;
  className?: string;
  iconSize?: number;
}

const INDIAN_SPEECH_LANGUAGES = [
  { code: "en", locale: "en-IN", name: "English (India)", nativeName: "English" },
  { code: "hi", locale: "hi-IN", name: "Hindi (हिन्दी)", nativeName: "हिन्दी" },
  { code: "ta", locale: "ta-IN", name: "Tamil (தமிழ்)", nativeName: "தமிழ்" },
  { code: "te", locale: "te-IN", name: "Telugu (తెలుగు)", nativeName: "తెలుగు" },
  { code: "bn", locale: "bn-IN", name: "Bengali (বাংলা)", nativeName: "বাংলা" },
  { code: "mr", locale: "mr-IN", name: "Marathi (मराठी)", nativeName: "मराठी" },
  { code: "gu", locale: "gu-IN", name: "Gujarati (ગુજરાતી)", nativeName: "ગુજરાતી" },
  { code: "kn", locale: "kn-IN", name: "Kannada (ಕನ್ನಡ)", nativeName: "ಕನ್ನಡ" },
  { code: "ml", locale: "ml-IN", name: "Malayalam (മലയാളം)", nativeName: "മലയാളം" },
  { code: "pa", locale: "pa-IN", name: "Punjabi (ਪੰਜਾਬੀ)", nativeName: "ਪੰਜਾਬੀ" },
  { code: "or", locale: "or-IN", name: "Odia (ଓଡ଼ିଆ)", nativeName: "ଓଡ଼ିଆ" }
];

export default function VoiceSearch({
  currentLanguage,
  onSpeechResult,
  triggerToast,
  className = "",
  iconSize = 16
}: VoiceSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const match = INDIAN_SPEECH_LANGUAGES.find(l => l.code === currentLanguage);
    return match ? match : INDIAN_SPEECH_LANGUAGES[0]; // Fallback to English
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Synchronize language if it changes externally
  useEffect(() => {
    const match = INDIAN_SPEECH_LANGUAGES.find(l => l.code === currentLanguage);
    if (match) {
      setSelectedLanguage(match);
    }
  }, [currentLanguage]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      }
    };
  }, []);

  const checkSupport = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    return !!SpeechRecognition;
  };

  const startListening = () => {
    setErrorMsg(null);
    setTranscript("");
    setInterimTranscript("");

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg(
        currentLanguage === "hi"
          ? "आपके ब्राउज़र या डिवाइस पर स्पीच रिकग्निशन समर्थित नहीं है।"
          : "Speech recognition is not supported on this browser/device."
      );
      triggerToast(
        currentLanguage === "hi"
          ? "स्पीच रिकग्निशन समर्थित नहीं है।"
          : "Speech recognition not supported on this device.",
        "error"
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage.locale;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setTranscript(prev => prev + " " + final);
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setErrorMsg(
            currentLanguage === "hi"
              ? "माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया ब्राउज़र सेटिंग्स में माइक्रोफ़ोन एक्सेस सक्षम करें।"
              : "Microphone permission denied. Please allow microphone access in browser/system settings."
          );
        } else if (event.error === "no-speech") {
          // Do not show hard error, just alert
          triggerToast(
            currentLanguage === "hi" ? "कोई आवाज़ नहीं सुनी गई।" : "No speech detected. Please speak louder.",
            "info"
          );
        } else {
          setErrorMsg(`Error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to initialize speech engine.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error(e);
      }
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleOpen = () => {
    if (!checkSupport()) {
      triggerToast(
        currentLanguage === "hi"
          ? "यह ब्राउज़र या डिवाइस वॉयस सर्च का समर्थन नहीं करता है।"
          : "Your device or WebView does not support speech-to-text search.",
        "error"
      );
      return;
    }
    setIsOpen(true);
    // Start listening automatically with a short delay to allow transition
    setTimeout(() => {
      startListening();
    }, 400);
  };

  const handleClose = () => {
    stopListening();
    setIsOpen(false);
  };

  const handleSelectLanguage = (lang: typeof INDIAN_SPEECH_LANGUAGES[0]) => {
    setSelectedLanguage(lang);
    stopListening();
    // Restart recognition with the new language after a brief delay
    setTimeout(() => {
      setErrorMsg(null);
      setTranscript("");
      setInterimTranscript("");
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = lang.locale;

          recognition.onstart = () => setIsListening(true);
          recognition.onresult = (event: any) => {
            let interim = "";
            let final = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) final += event.results[i][0].transcript;
              else interim += event.results[i][0].transcript;
            }
            if (final) setTranscript(prev => prev + " " + final);
            setInterimTranscript(interim);
          };
          recognition.onerror = (event: any) => {
            console.error("Speech error on language change:", event.error);
            if (event.error !== "no-speech") setErrorMsg(`Error: ${event.error}`);
            setIsListening(false);
          };
          recognition.onend = () => setIsListening(false);
          recognitionRef.current = recognition;
          recognition.start();
        } catch (e) {
          console.error(e);
        }
      }
    }, 200);
  };

  const handleApply = () => {
    const finalResult = (transcript + " " + interimTranscript).trim();
    if (finalResult) {
      onSpeechResult(finalResult);
      handleClose();
      triggerToast(
        currentLanguage === "hi"
          ? `खोज क्वेरी लागू की गई: "${finalResult}"`
          : `Applied spoken query: "${finalResult}"`,
        "success"
      );
    } else {
      triggerToast(
        currentLanguage === "hi"
          ? "कृपया लागू करने से पहले कुछ बोलें।"
          : "Please speak something before applying search.",
        "info"
      );
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleOpen}
        className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center border text-stone-500 hover:text-stone-850 bg-white border-stone-250 hover:bg-stone-50 select-none ${className}`}
        title={currentLanguage === "hi" ? "आवाज से खोजें" : "Search by speaking"}
        id="voice-search-trigger-btn"
      >
        <Mic className="text-brand-coral" size={iconSize} />
      </button>

      {/* Voice Assistant Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs select-none"
            id="voice-search-modal-backdrop"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-200 p-6 space-y-6 text-left relative"
              id="voice-search-modal-content"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-coral animate-pulse" />
                  <h3 className="text-sm font-display font-extrabold text-stone-900">
                    {currentLanguage === "hi" ? "आवाज से खोजें (Voice Search)" : "Sovereign Voice Search"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1 px-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 font-bold text-xs cursor-pointer transition border-0 outline-none"
                  id="close-voice-modal-btn"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speech Animation & Status */}
              <div className="flex flex-col items-center justify-center py-6 space-y-4 bg-stone-50 rounded-2xl border border-stone-150/65 relative overflow-hidden">
                <span className="absolute -top-10 -left-10 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none"></span>

                {/* Animated Pulsing Rings */}
                <div className="relative flex items-center justify-center">
                  <AnimatePresence>
                    {isListening && (
                      <>
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ scale: 1.8, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                          className="absolute w-16 h-16 bg-brand-coral/20 rounded-full"
                        />
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0.4 }}
                          animate={{ scale: 2.3, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 2, delay: 0.6, ease: "easeOut" }}
                          className="absolute w-16 h-16 bg-brand-coral/10 rounded-full"
                        />
                      </>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer select-none border shadow-md ${
                      isListening
                        ? "bg-brand-coral text-white border-brand-coral hover:bg-brand-coral/90 scale-105"
                        : "bg-white text-stone-600 border-stone-250 hover:bg-stone-50"
                    }`}
                    id="speech-toggle-mic-circle"
                  >
                    {isListening ? <Mic className="w-7 h-7 animate-pulse" /> : <MicOff className="w-7 h-7 text-stone-400" />}
                  </button>
                </div>

                <div className="text-center space-y-1 z-10">
                  <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isListening ? "text-brand-coral" : "text-stone-500"}`}>
                    {isListening 
                      ? (currentLanguage === "hi" ? "आवाज सुनी जा रही है..." : "Listening...") 
                      : (currentLanguage === "hi" ? "सुनना बंद है। शुरू करने के लिए माइक दबाएं" : "Paused. Tap mic to start")}
                  </span>
                  <p className="text-[10px] text-stone-400">
                    {currentLanguage === "hi" 
                      ? `भाषा: ${selectedLanguage.name}` 
                      : `Speaking in ${selectedLanguage.name}`}
                  </p>
                </div>

                {/* Simulated Soundwaves */}
                {isListening && (
                  <div className="flex items-center gap-1 h-4 select-none">
                    {[1.2, 1.8, 1.4, 2.2, 1.1, 1.7, 1.3, 1.9, 1.5, 1.1].map((val, idx) => (
                      <motion.span
                        key={idx}
                        animate={{ height: ["4px", `${val * 10}px`, "4px"] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: idx * 0.06, ease: "easeInOut" }}
                        className="w-0.75 bg-brand-coral rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Live Transcript Panel */}
              <div className="space-y-2">
                <label className="text-[9px] font-mono font-bold text-stone-500 block uppercase">
                  {currentLanguage === "hi" ? "वास्तविक समय प्रतिलेख (Live Transcript):" : "Dynamic Transcribed Text:"}
                </label>
                <div className="min-h-16 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs font-medium text-stone-800 leading-relaxed font-sans max-h-28 overflow-y-auto">
                  {transcript || interimTranscript ? (
                    <p>
                      <span className="text-stone-800">{transcript}</span>
                      {interimTranscript && (
                        <span className="text-stone-400 italic"> {interimTranscript}</span>
                      )}
                    </p>
                  ) : (
                    <span className="text-stone-400 italic">
                      {currentLanguage === "hi"
                        ? "जैसे ही आप बोलेंगे, आपका प्रतिलेख यहाँ दिखाई देगा..."
                        : "Spoken search keywords will appear here in real-time..."}
                    </span>
                  )}
                </div>
              </div>

              {/* Error Box */}
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-[10px] text-red-800 leading-normal">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* Language Selection Chips */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-stone-400" />
                  <span className="text-[9px] font-mono font-black text-stone-500 uppercase tracking-wider">
                    {currentLanguage === "hi" ? "अपनी क्षेत्रीय भाषा चुनें:" : "Choose Speak Language:"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 max-h-24 overflow-y-auto pr-1" id="voice-languages-list">
                  {INDIAN_SPEECH_LANGUAGES.map((lang) => {
                    const isSel = selectedLanguage.locale === lang.locale;
                    return (
                      <button
                        key={lang.locale}
                        type="button"
                        onClick={() => handleSelectLanguage(lang)}
                        className={`py-1.5 px-2 rounded-lg border text-[10px] font-bold transition text-center truncate ${
                          isSel
                            ? "bg-stone-900 border-stone-900 text-white"
                            : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100/60"
                        }`}
                      >
                        {lang.nativeName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTranscript("");
                      setInterimTranscript("");
                      setErrorMsg(null);
                      if (!isListening) {
                        startListening();
                      }
                    }}
                    className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-[10.5px] font-bold transition flex items-center justify-center gap-1 select-none"
                    title={currentLanguage === "hi" ? "पुनः प्रयास करें" : "Reset recording"}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-[10.5px] font-bold transition cursor-pointer select-none"
                  >
                    {currentLanguage === "hi" ? "रद्द करें" : "Cancel"}
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-5 py-2.5 bg-brand-coral hover:bg-brand-coral/90 text-white rounded-xl text-[10.5px] font-extrabold transition flex items-center gap-1.5 shadow-3xs cursor-pointer select-none"
                    id="apply-voice-search-btn"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{currentLanguage === "hi" ? "खोजें" : "Apply Search"}</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
