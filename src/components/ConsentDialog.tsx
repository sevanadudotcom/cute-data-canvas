import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Check, ChevronRight, Scale, FileText, Sparkles, ExternalLink } from "lucide-react";

interface ConsentDialogProps {
  isOpen: boolean;
  language: string;
  onAccept: () => void;
  onViewPolicy: (policy: "privacy" | "terms" | "cookies" | "disclaimer") => void;
}

export default function ConsentDialog({
  isOpen,
  language,
  onAccept,
  onViewPolicy
}: ConsentDialogProps) {
  const [preferences, setPreferences] = useState({
    privacy: true,
    terms: true,
    cookies: true,
    disclaimer: true
  });

  if (!isOpen) return null;

  const isAllChecked = preferences.privacy && preferences.terms && preferences.cookies && preferences.disclaimer;

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelectAll = () => {
    setPreferences({
      privacy: true,
      terms: true,
      cookies: true,
      disclaimer: true
    });
  };

  const isHi = language === "hi";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-stone-900/80 dark:bg-slate-950/90 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col"
          id="legal-consent-dialog-card"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-stone-100 dark:border-stone-850 bg-gradient-to-br from-amber-50/40 via-white to-transparent dark:from-amber-950/10 dark:via-stone-900 dark:to-transparent">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-amber-500/10 dark:bg-amber-500/15 rounded-2xl shrink-0">
                <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-500 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[9px] font-mono font-black text-stone-550 dark:text-stone-350 tracking-wider uppercase">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  {isHi ? "सहमति और विश्वसनीयता" : "Compliance & Consent"}
                </span>
                <h3 className="font-display font-black text-base text-stone-900 dark:text-white tracking-tight leading-tight">
                  {isHi ? "नागरिक कानूनी और सहमति प्रपत्र" : "Citizen Agreement & Policy Consent"}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-slate-400 leading-normal font-sans">
                  {isHi 
                    ? "SewaNadu का उपयोग जारी रखने से पहले कृपया निम्नलिखित कानूनी नीतियों और स्वीकृतियों की समीक्षा करें और सहमति दें।"
                    : "Before exploring SewaNadu, please review and accept our legal transparency terms to configure your secure browsing session."}
                </p>
              </div>
            </div>
          </div>

          {/* Checklist Area */}
          <div className="p-6 py-4 space-y-3 overflow-y-auto max-h-72">
            
            {/* 1. Privacy Policy */}
            <div 
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 text-left ${
                preferences.privacy 
                  ? "bg-white dark:bg-stone-850/40 border-amber-500/30 shadow-2xs" 
                  : "bg-stone-50/50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800"
              }`}
            >
              <button 
                type="button"
                onClick={() => handleToggle("privacy")}
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  preferences.privacy 
                    ? "bg-amber-500 border-amber-500 text-neutral-900" 
                    : "border-stone-300 dark:border-stone-700 hover:border-amber-400 bg-white dark:bg-stone-800"
                }`}
              >
                {preferences.privacy && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[12px] font-extrabold text-stone-900 dark:text-white">
                    {isHi ? "1. गोपनीयता नीति" : "1. Privacy Policy"}
                  </span>
                  <button 
                    onClick={() => onViewPolicy("privacy")}
                    className="text-[9.5px] font-mono text-amber-600 dark:text-amber-500 hover:underline flex items-center gap-0.5"
                  >
                    <span>{isHi ? "नीति पढ़ें" : "Read Policy"}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 dark:text-slate-400 leading-normal">
                  {isHi 
                    ? "हम आपके व्यक्तिगत डेटा को सुरक्षित रखते हैं और इसे किसी बाहरी विज्ञापनदाता को लीक नहीं करते हैं।"
                    : "Outlines how data remains secured locally. We absolute safeguard citizen security on client levels."}
                </p>
              </div>
            </div>

            {/* 2. Terms & Conditions */}
            <div 
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 text-left ${
                preferences.terms 
                  ? "bg-white dark:bg-stone-850/40 border-amber-500/30 shadow-2xs" 
                  : "bg-stone-50/50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800"
              }`}
            >
              <button 
                type="button"
                onClick={() => handleToggle("terms")}
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  preferences.terms 
                    ? "bg-amber-500 border-amber-500 text-neutral-900" 
                    : "border-stone-300 dark:border-stone-700 hover:border-amber-400 bg-white dark:bg-stone-800"
                }`}
              >
                {preferences.terms && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[12px] font-extrabold text-stone-900 dark:text-white">
                    {isHi ? "2. नियम और शर्तें" : "2. Terms & Conditions"}
                  </span>
                  <button 
                    onClick={() => onViewPolicy("terms")}
                    className="text-[9.5px] font-mono text-amber-600 dark:text-amber-500 hover:underline flex items-center gap-0.5"
                  >
                    <span>{isHi ? "शर्तें पढ़ें" : "Read Terms"}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 dark:text-slate-400 leading-normal">
                  {isHi 
                    ? "हमारे शैक्षिक सिमुलेटर और नागरिक सेवाओं के गैर-व्यावसायिक उपयोग के कानूनी नियम।"
                    : "Rules of conduct concerning civic information tools, educational simulation limits, and user licenses."}
                </p>
              </div>
            </div>

            {/* 3. Cookie Policy */}
            <div 
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 text-left ${
                preferences.cookies 
                  ? "bg-white dark:bg-stone-850/40 border-amber-500/30 shadow-2xs" 
                  : "bg-stone-50/50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800"
              }`}
            >
              <button 
                type="button"
                onClick={() => handleToggle("cookies")}
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  preferences.cookies 
                    ? "bg-amber-500 border-amber-500 text-neutral-900" 
                    : "border-stone-300 dark:border-stone-700 hover:border-amber-400 bg-white dark:bg-stone-800"
                }`}
              >
                {preferences.cookies && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[12px] font-extrabold text-stone-900 dark:text-white">
                    {isHi ? "3. कुकी नीति" : "3. Cookie Policy"}
                  </span>
                  <button 
                    onClick={() => onViewPolicy("cookies")}
                    className="text-[9.5px] font-mono text-amber-600 dark:text-amber-500 hover:underline flex items-center gap-0.5"
                  >
                    <span>{isHi ? "कुकी नीति" : "Read Cookies"}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 dark:text-slate-400 leading-normal">
                  {isHi 
                    ? "हम उपयोगकर्ता सुविधा और प्राथमिकता सहेजने के लिए स्थानीय ब्राउज़र भंडारण (localStorage) का उपयोग करते हैं।"
                    : "Clarifying our minimal local browser storage to persist saved services and user configuration preferences."}
                </p>
              </div>
            </div>

            {/* 4. Disclaimer for this website */}
            <div 
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 text-left ${
                preferences.disclaimer 
                  ? "bg-white dark:bg-stone-850/40 border-amber-500/30 shadow-2xs" 
                  : "bg-stone-50/50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800"
              }`}
            >
              <button 
                type="button"
                onClick={() => handleToggle("disclaimer")}
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  preferences.disclaimer 
                    ? "bg-amber-500 border-amber-500 text-neutral-900" 
                    : "border-stone-300 dark:border-stone-700 hover:border-amber-400 bg-white dark:bg-stone-800"
                }`}
              >
                {preferences.disclaimer && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[12px] font-extrabold text-stone-900 dark:text-white">
                    {isHi ? "4. वेबसाइट का कानूनी अस्वीकरण" : "4. Official Disclaimer"}
                  </span>
                  <button 
                    onClick={() => onViewPolicy("disclaimer")}
                    className="text-[9.5px] font-mono text-amber-600 dark:text-amber-500 hover:underline flex items-center gap-0.5"
                  >
                    <span>{isHi ? "अस्वीकरण पढ़ें" : "Read Disclaimer"}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 dark:text-slate-400 leading-normal">
                  {isHi 
                    ? "यह एक स्वतंत्र संसाधन मार्गदर्शिका है जिसका किसी भी सरकारी मंत्रालय से संबंध नहीं है।"
                    : "Confirms our status as an independent helper portal and educational guide without state affiliations."}
                </p>
              </div>
            </div>

          </div>

          {/* Actions Footer */}
          <div className="p-6 border-t border-stone-100 dark:border-stone-850 bg-stone-50 dark:bg-stone-900/40 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2">
              {!isAllChecked && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[10px] font-sans font-extrabold tracking-wide text-amber-600 dark:text-amber-500 hover:underline hover:opacity-90 transition cursor-pointer border-0 bg-transparent"
                >
                  {isHi ? "✓ सभी का चयन करें" : "✓ Grant Full Authorization"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                disabled={!preferences.privacy || !preferences.terms || !preferences.cookies || !preferences.disclaimer}
                onClick={onAccept}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-sans font-black text-xs leading-none transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  preferences.privacy && preferences.terms && preferences.cookies && preferences.disclaimer
                    ? "bg-amber-500 hover:bg-amber-400 text-neutral-950 active:scale-95 shadow-sm"
                    : "bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed"
                }`}
              >
                <span>{isHi ? "स्वीकार करें और जारी रखें" : "Accept & Proceed"}</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
