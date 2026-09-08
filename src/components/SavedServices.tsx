import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Trash2, ArrowRight, Landmark, Clock, CreditCard, BookmarkCheck, Inbox, ExternalLink, Sparkles, Share2, Check, Languages
} from "lucide-react";
import { ESevaService } from "../types";
import { serviceTranslations, Language } from "../LanguageContext";

interface SavedServicesProps {
  isOpen: boolean;
  onClose: () => void;
  savedServiceIds: string[];
  services: ESevaService[];
  onToggleSave: (serviceId: string) => void;
  onSelectService: (service: ESevaService) => void;
  language: string;
}

export default function SavedServices({
  isOpen,
  onClose,
  savedServiceIds,
  services,
  onToggleSave,
  onSelectService,
  language
}: SavedServicesProps) {
  // Find actual loaded service details matching saved IDs
  const savedServicesList = services.filter((s) => savedServiceIds.includes(s.id));
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toggledTranslates, setToggledTranslates] = useState<Record<string, boolean>>({});

  const getDisplayDescription = (service: ESevaService) => {
    const isToggled = toggledTranslates[service.id];
    const activeLang = language as Language;
    
    if (activeLang === "en") {
      if (isToggled) {
        const trans = serviceTranslations[service.id];
        if (trans && trans.hi) {
          return trans.hi.description;
        }
        return `सेवा विवरण: ${service.description}`;
      }
      return service.description;
    } else {
      if (isToggled) {
        const trans = serviceTranslations[service.id];
        if (trans) {
          const transLang = trans[activeLang] || trans.hi;
          if (transLang) {
            return transLang.description;
          }
        }
        return `[Translated ${activeLang.toUpperCase()}]: ${service.description}`;
      }
      return service.description;
    }
  };

  // Human category display label builder matching getCategoryLabel in list
  const getCategoryLabel = (service: ESevaService) => {
    const titleLower = service.title.toLowerCase();
    if (titleLower.includes("passport")) return language === "hi" ? "यात्रा (Travel)" : "Travel";
    if (titleLower.includes("driving")) return language === "hi" ? "ड्राइविंग (Driving)" : "Driving";
    if (titleLower.includes("voter")) return language === "hi" ? "नागरिक (Civic)" : "Civic";
    if (titleLower.includes("ration")) return language === "hi" ? "कल्याण (Welfare)" : "Welfare";
    if (titleLower.includes("kisan") || titleLower.includes("agriculture") || titleLower.includes("apeda")) return language === "hi" ? "कृषि (Agriculture)" : "Agriculture";
    if (titleLower.includes("scholarship") || titleLower.includes("education") || titleLower.includes("school")) return language === "hi" ? "शिक्षा (Education)" : "Education";
    
    switch (service.category) {
      case "IDENTITY": return language === "hi" ? "पहचान पत्र (Identity)" : "Identity";
      case "FINANCE": return language === "hi" ? "वित्त (Finance)" : "Finance";
      case "HEALTH": return language === "hi" ? "स्वास्थ्य (Health)" : "Health";
      case "LABOUR": return language === "hi" ? "रोजगार (Labour)" : "Labour";
      case "LAND": return language === "hi" ? "राजस्व (Land)" : "Land";
      case "WELFARE": return language === "hi" ? "कल्याण (Welfare)" : "Welfare";
      default: return language === "hi" ? "अन्य (General)" : "General";
    }
  };

  const getCategoryStyles = (label: string) => {
    const isHindi = language === "hi";
    if (label.includes("Travel") || label.includes("यात्रा") || label.includes("Driving") || label.includes("ड्राइविंग") || label.includes("Civic") || label.includes("नागरिक") || label.includes("Identity") || label.includes("पहचान पत्र")) {
      return { border: "border-orange-200/60 dark:border-orange-950/40", bg: "bg-orange-50/40 dark:bg-orange-950/10", text: "text-orange-700 dark:text-orange-400 font-bold", dot: "bg-orange-550" };
    }
    if (label.includes("Agriculture") || label.includes("कृषि")) {
      return { border: "border-emerald-200/60 dark:border-emerald-950/40", bg: "bg-emerald-50/40 dark:bg-emerald-950/10", text: "text-emerald-700 dark:text-emerald-400 font-bold", dot: "bg-emerald-550" };
    }
    if (label.includes("Finance") || label.includes("वित्त")) {
      return { border: "border-teal-200/60 dark:border-teal-950/40", bg: "bg-teal-50/40 dark:bg-teal-950/10", text: "text-teal-700 dark:text-teal-400 font-bold", dot: "bg-teal-550" };
    }
    if (label.includes("Health") || label.includes("स्वास्थ्य")) {
      return { border: "border-cyan-200/60 dark:border-cyan-950/40", bg: "bg-cyan-50/40 dark:bg-cyan-950/10", text: "text-cyan-700 dark:text-cyan-400 font-bold", dot: "bg-cyan-550" };
    }
    if (label.includes("Labour") || label.includes("रोजगार")) {
      return { border: "border-amber-200/60 dark:border-amber-950/40", bg: "bg-amber-50/40 dark:bg-amber-950/10", text: "text-amber-700 dark:text-amber-450 font-bold", dot: "bg-amber-550" };
    }
    if (label.includes("Land") || label.includes("राजस्व")) {
      return { border: "border-purple-200/60 dark:border-purple-950/40", bg: "bg-purple-50/40 dark:bg-purple-950/10", text: "text-purple-700 dark:text-purple-400 font-bold", dot: "bg-purple-550" };
    }
    return { border: "border-blue-200/60 dark:border-blue-950/40", bg: "bg-blue-50/40 dark:bg-blue-950/10", text: "text-blue-700 dark:text-blue-400 font-bold", dot: "bg-blue-550" };
  };

  // Grouped list
  const groupedSavedServices: Record<string, ESevaService[]> = {};
  savedServicesList.forEach((service) => {
    const label = getCategoryLabel(service);
    if (!groupedSavedServices[label]) {
      groupedSavedServices[label] = [];
    }
    groupedSavedServices[label].push(service);
  });

  // Category Colors matching standard style
  const categoryColorMap: Record<string, { bg: string, text: string, border: string }> = {
    IDENTITY: { bg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-900/30" },
    FINANCE: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-900/30" },
    HEALTH: { bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-700 dark:text-rose-400", border: "border-rose-200 dark:border-rose-900/30" },
    LABOUR: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-900/30" },
    LAND: { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-900/30" },
    WELFARE: { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-700 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-900/30" }
  };

  const handleShare = async (service: ESevaService, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?service=${service.id}`;
    const shareText = language === "hi" 
      ? `🎯 *आधिकारिक ई-सेवा निर्देशिका*\n\nसेवा: *${service.title}*\nविभाग: ${service.department}\nसरकारी शुल्क: ${service.fees === 0 ? "निःशुल्क" : `₹ ${service.fees}`}\nसमय-सीमा: ${service.processingTime}\n\nसभी आवश्यक दस्तावेज़ और सीधे आवेदन की जानकारी यहाँ देखें:\n👉 ${shareUrl}`
      : `🎯 *Official e-Seva Assistant*\n\nService: *${service.title}*\nDepartment: ${service.department}\nGovt Fee: ${service.fees === 0 ? "FREE" : `₹ ${service.fees}`}\nProcessing Time: ${service.processingTime}\n\nGet the complete document checklist & apply direct:\n👉 ${shareUrl}`;

    setCopiedId(service.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);

    if (navigator.share) {
      try {
        await navigator.share({
          title: service.title,
          text: `Check out document requirements and apply for ${service.title}`,
          url: shareUrl
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 dark:bg-black/80 z-50 pointer-events-auto backdrop-blur-md"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280, mass: 0.85 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl shadow-2xl z-50 flex flex-col border-l border-stone-200 dark:border-white/10"
          >
            {/* Header section with orange/dark ambient header design */}
            <div className="p-5 border-b border-stone-150 dark:border-white/5 bg-gradient-to-r from-slate-900 via-stone-900 to-orange-950/20 text-white relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-32 h-32 rounded-full bg-orange-650/10 blur-2xl pointer-events-none -z-10"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-orange-500/10 text-brand-coral border border-brand-coral/25 rounded-xl flex items-center justify-center shadow-3xs">
                    <BookmarkCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base text-white tracking-tight">
                      {language === "hi" ? "पसंदीदा डिजिटल सेवाएँ" : "Saved e-Services"}
                    </h3>
                    <p className="text-[10.5px] text-stone-400 font-mono">
                      {savedServicesList.length}{" "}
                      {language === "hi" ? "पोर्टल सुरक्षित बुकमार्क" : "Active Bookmarks"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 text-stone-400 hover:text-white transition duration-200 cursor-pointer"
                  title={language === "hi" ? "बंद करें" : "Close Panel"}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* List region */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
              {savedServicesList.length > 0 ? (
                Object.entries(groupedSavedServices).map(([categoryName, sList]) => {
                  const styles = getCategoryStyles(categoryName);
                  return (
                    <div key={categoryName} className="space-y-3" id={`saved-group-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}>
                      {/* Sticky Group Header */}
                      <div className="flex items-center justify-between sticky top-0 py-1 bg-white dark:bg-slate-950 z-10 select-none border-b border-stone-100 dark:border-white/5">
                        <div className="flex items-center gap-1.5 pb-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                          <span className={`text-[10px] font-sans font-extrabold tracking-wider uppercase ${styles.text}`}>
                            {categoryName}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-stone-400 bg-stone-100 dark:bg-slate-900 px-1.5 py-0.5 rounded-sm font-semibold mb-0.5">
                          {sList.length} {language === "hi" ? "सेवा" : (sList.length === 1 ? "service" : "services")}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {sList.map((service) => {
                          const colors = categoryColorMap[service.category] || categoryColorMap.WELFARE;
                          return (
                            <motion.div
                              layout
                              key={service.id}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="group p-4 bg-stone-50 dark:bg-slate-900/40 border border-stone-200 dark:border-white/5 hover:border-brand-coral/30 dark:hover:border-brand-coral/20 rounded-2xl transition duration-200 relative flex flex-col justify-between space-y-3.5 select-none"
                            >
                              {/* Top Row with badge and action */}
                              <div className="flex items-center justify-between">
                                <span className={`text-[8.5px] ${colors.bg} ${colors.text} ${colors.border} border font-extrabold px-2 py-0.5 rounded-md font-mono uppercase tracking-wide`}>
                                  {service.category}
                                </span>

                                <div className="flex items-center gap-1">
                                  {/* Share Button using Web Share API with copier fallback */}
                                  <button
                                    onClick={(e) => handleShare(service, e)}
                                    className={`p-1.5 rounded-lg border transition duration-150 flex items-center justify-center cursor-pointer ${
                                      copiedId === service.id
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-250 dark:bg-emerald-950/20 dark:border-emerald-900/45 animate-pulse"
                                        : "bg-white dark:bg-slate-900 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-500 hover:text-brand-coral border-stone-200 dark:border-white/5"
                                    }`}
                                    title={language === "hi" ? "साझा करें" : "Share Service Details"}
                                  >
                                    {copiedId === service.id ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                      <Share2 className="w-3.5 h-3.5" />
                                    )}
                                  </button>

                                  {/* Quick Translate Button */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setToggledTranslates(prev => ({
                                        ...prev,
                                        [service.id]: !prev[service.id]
                                      }));
                                    }}
                                    className={`p-1.5 rounded-lg border transition duration-155 flex items-center justify-center cursor-pointer ${
                                      toggledTranslates[service.id]
                                        ? "bg-orange-50 text-orange-655 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900/30 font-semibold"
                                        : "bg-white dark:bg-slate-900 hover:bg-stone-50 dark:hover:bg-slate-800 text-stone-500 border-stone-200 dark:border-white/5"
                                    }`}
                                    title={
                                      toggledTranslates[service.id]
                                        ? (language === "hi" ? "अंग्रेज़ी मूल देखें" : "Show original English")
                                        : (language === "hi" ? "हिंदी अनुवाद" : "Quick Translate")
                                    }
                                  >
                                    <Languages className={`w-3.5 h-3.5 ${toggledTranslates[service.id] ? "text-orange-500 font-bold" : ""}`} />
                                  </button>

                                  <button
                                    onClick={() => onToggleSave(service.id)}
                                    className="p-1.5 text-stone-400 hover:text-rose-650 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-stone-200 dark:border-white/5 rounded-lg active:scale-90 transition cursor-pointer"
                                    title={language === "hi" ? "बुकमार्क हटाएं" : "Remove Bookmark"}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Info Block */}
                              <div className="space-y-1">
                                <h4 
                                  onClick={() => {
                                    onSelectService(service);
                                    onClose();
                                  }}
                                  className="text-xs font-bold text-stone-900 dark:text-white hover:text-brand-coral dark:hover:text-amber-500 cursor-pointer transition line-clamp-1 flex items-center gap-1.5"
                                >
                                  {service.title}
                                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                                </h4>
                                <span className="text-[9.5px] font-semibold text-stone-400 font-mono block truncate">
                                  {service.department}
                                </span>
                                <div className="pt-1 pb-1">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50/70 border border-blue-200/40 text-[#1D4ED8] text-[9.5px] font-semibold font-mono">
                                    <Clock className="w-3 h-3 text-blue-500" />
                                    <span>{language === "hi" ? `औसत समय: ${service.processingTime}` : `Avg. Processing Time: ${service.processingTime}`}</span>
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-stone-555 dark:text-slate-400 font-normal leading-relaxed line-clamp-2 pt-0.5">
                                  {getDisplayDescription(service)}
                                </p>
                              </div>

                              {/* Footer Row with stats */}
                              <div className="flex items-center justify-between border-t border-stone-250/30 dark:border-white/5 pt-3">
                                <div className="flex items-center gap-3">
                                  <span className="text-[9.5px] text-stone-500 dark:text-slate-500 font-mono font-bold flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-stone-400" />
                                    {service.processingTime}
                                  </span>
                                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                                    <CreditCard className="w-3 h-3 text-emerald-500/70" />
                                    {service.fees === 0 ? (language === "hi" ? "मुफ़्त" : "FREE") : `₹ ${service.fees}`}
                                  </span>
                                </div>

                                <button
                                  onClick={() => {
                                    onSelectService(service);
                                    onClose();
                                  }}
                                  className="text-[9.5px] font-black text-brand-coral hover:underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  {language === "hi" ? "चेकलिस्ट देखें" : "View Checklist"}
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3.5 my-auto">
                  <div className="w-14 h-14 bg-stone-50 dark:bg-slate-900 rounded-full flex items-center justify-center border border-stone-200 dark:border-white/5 text-stone-400 text-3xl">
                    <Inbox className="w-6 h-6 text-stone-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-stone-900 dark:text-white">
                      {language === "hi" ? "बुकमार्क सूची खाली है" : "No Bookmarks Saved"}
                    </h4>
                    <p className="text-[11px] text-stone-500 max-w-xs mx-auto leading-relaxed">
                      {language === "hi" 
                        ? "किसी भी जनसेवा विवरण कार्ड पर मौजूद बुकमार्क बटन पर क्लिक करके उससे यहाँ तुरंत प्राप्त करें।"
                        : "Click the bookmark icon on any state or national e-service card to keep your vital links right here."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom notification indicator / info helper */}
            {savedServicesList.length > 0 && (
              <div className="p-4 bg-stone-50 dark:bg-slate-900 border-t border-stone-150 dark:border-white/5 text-center">
                <span className="text-[10px] text-stone-500 dark:text-slate-400 font-mono flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  {language === "hi"
                    ? "बुकमार्क सूची आपके ब्राउज़र की मेमोरी में सुरक्षित है"
                    : "Bookmarks safely synchronized with local storage memory"}
                </span>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
