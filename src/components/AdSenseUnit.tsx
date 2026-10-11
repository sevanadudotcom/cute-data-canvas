import React, { useState, useEffect, useRef } from "react";
import { Info, ExternalLink, Code2, Eye, RefreshCw, X, Sparkles } from "lucide-react";
import { useLanguage } from "../LanguageContext";

interface AdSenseUnitProps {
  id: string;
  format?: "horizontal" | "sidebar" | "inline";
  slotId?: string;
  className?: string;
}

interface SimulatedAd {
  title: { en: string; hi: string };
  desc: { en: string; hi: string };
  cta: { en: string; hi: string };
  url: string;
  badge: { en: string; hi: string };
}

const SIMULATED_ADS_POOL: SimulatedAd[] = [
  {
    title: { 
      en: "Direct DigiLocker Backup Tool", 
      hi: "सीधा डिजीलॉकर बैकअप टूल" 
    },
    desc: { 
      en: "Protect and sync your critical certificates with cloud redundancy. Free offline storage vault.",
      hi: "क्लाउड रिडंडेंसी के साथ अपने महत्वपूर्ण प्रमाणपत्रों को सुरक्षित रखें। निःशुल्क ऑफ़लाइन संग्रहण।"
    },
    cta: { en: "Secure Sync", hi: "सत्यापित सिंक" },
    url: "https://digilocker.gov.in",
    badge: { en: "Utility Backup", hi: "उपयोगिता बैकअप" }
  },
  {
    title: { 
      en: "Official Aadhaar Correction Directory", 
      hi: "आधिकारिक आधार सुधार निर्देशिका" 
    },
    desc: { 
      en: "Need a name, date of birth, or mobile update? Access direct regional kiosk coordinates instantly.",
      hi: "नाम, जन्म तिथि या मोबाइल नंबर अपडेट करना है? सीधे क्षेत्रीय कियोस्क के पते खोजें।"
    },
    cta: { en: "Find Kiosk", hi: "कियोस्क ढूंढें" },
    url: "https://uidai.gov.in",
    badge: { en: "Aadhaar Help", hi: "आधार सहायता" }
  },
  {
    title: { 
      en: "Govt Job & Skill India Training", 
      hi: "सरकारी नौकरी और कौशल विकास" 
    },
    desc: { 
      en: "Join PMKVY vocational modules and receive certified apprentice stipends up to ₹8,000 monthly.",
      hi: "पीएमकेवीवाई व्यावसायिक कोर्सेज में शामिल हों और ₹8,000 मासिक तक वजीफा प्राप्त करें।"
    },
    cta: { en: "Apply Free", hi: "निशुल्क आवेदन" },
    url: "https://www.pmkvayom.org.in",
    badge: { en: "Skill India", hi: "कौशल भारत" }
  }
];

export default function AdSenseUnit({ id, format = "horizontal", slotId = "0000000000", className = "" }: AdSenseUnitProps) {
  const { language } = useLanguage();
  const [inspectMode, setInspectMode] = useState(false);
  const [adIndex, setAdIndex] = useState(() => Math.floor(Math.random() * SIMULATED_ADS_POOL.length));
  const [adRemoved, setAdRemoved] = useState(false);

  // Lazy loading states
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setIsLoading(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "120px", // Pre-fetch 120px before entering viewport to prevent content delay
        threshold: 0.01,
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Simulate network delivery once scrolled into the viewport
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 700); // 700ms high-fidelity network buffering simulation
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const rotateAd = () => {
    setAdIndex((prev) => (prev + 1) % SIMULATED_ADS_POOL.length);
  };

  if (adRemoved) return null;

  // Render static skeleton matching format's height when outside the viewport (prevents Cumulative Layout Shift!)
  if (!isVisible) {
    return (
      <div 
        ref={containerRef} 
        id={`adsense-deferred-${id}`} 
        className={`group/ad relative select-none animate-pulse bg-stone-50/50 dark:bg-stone-900/10 border border-dashed border-stone-200 dark:border-stone-800/80 rounded-2xl ${
          format === "horizontal" ? "min-h-[110px] mb-6" : format === "sidebar" ? "min-h-[285px] mb-4" : "min-h-[145px] mb-4"
        } ${className}`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="flex items-center gap-2 text-stone-400 dark:text-stone-550">
            <Eye className="w-4 h-4 animate-pulse text-sky-500/70" />
            <span className="text-[10px] font-mono tracking-widest uppercase font-black text-stone-500">
              {language === "hi" ? "AdSense लोड हो रहा है..." : "AdSense Deferred Loading"}
            </span>
          </div>
          <p className="text-[9px] text-stone-400 dark:text-stone-600 mt-1 font-sans text-center max-w-xs md:max-w-md">
            {language === "hi" 
              ? "पेज स्पीड और कोर वेब वाइटल्स नियंत्रण: व्यूपोर्ट में प्रवेश करने पर लोड होगा।" 
              : "Intersection Observer active for Core Web Vitals (CLS & LCP Optimization)"}
          </p>
        </div>
      </div>
    );
  }

  // Render async retrieval loader when first entering viewport to simulate real programmatic auctions
  if (isLoading) {
    return (
      <div 
        ref={containerRef} 
        id={`adsense-fetching-${id}`} 
        className={`group/ad relative select-none bg-sky-50/20 dark:bg-sky-950/5 border border-dashed border-sky-200 dark:border-sky-900/40 rounded-2xl ${
          format === "horizontal" ? "min-h-[110px] mb-6" : format === "sidebar" ? "min-h-[285px] mb-4" : "min-h-[145px] mb-4"
        } ${className}`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <div className="flex items-center gap-2 text-sky-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-[10px] font-bold font-mono tracking-widest uppercase">
              {language === "hi" ? "असिंक्रोनस विज्ञापन लोड..." : "ASYNC ADSENSE INGESTION..."}
            </span>
          </div>
          <span className="text-[8px] font-mono text-sky-400 dark:text-sky-600 mt-1.5 uppercase tracking-wide">
            {language === "hi" ? "डिजिटल विज्ञापन स्लॉट असाइनमेंट" : `SLOT_ID: gp-${slotId} | INITIALIZING PROGRAMMATIC BIDDING...`}
          </span>
        </div>
      </div>
    );
  }

  const activeAd = SIMULATED_ADS_POOL[adIndex];

  // Formatting structures
  const containerClasses = {
    horizontal: "w-full min-h-[105px] border border-dashed border-sky-200 bg-sky-50/50 p-3 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden transition-all hover:bg-sky-50/80 mb-6",
    sidebar: "w-full min-h-[280px] border border-dashed border-sky-200 bg-sky-50/50 p-4 rounded-xl flex flex-col justify-between gap-4 relative overflow-hidden transition-all hover:bg-sky-50/80 mb-4",
    inline: "w-full min-h-[140px] border border-dashed border-teal-100 bg-teal-50/30 p-4 rounded-xl flex flex-col justify-between gap-3 relative overflow-hidden transition-all hover:bg-teal-50/50 mb-4"
  }[format];

  return (
    <div 
      ref={containerRef}
      id={`adsense-${id}`} 
      className={`group/ad relative select-none ${containerClasses} ${className}`}
    >
      
      {/* Absolute top badge indicators */}
      <div className="absolute top-1 right-2 flex items-center gap-1.5 z-10">
        <span className="text-[8px] font-bold font-mono text-sky-600/70 uppercase tracking-widest bg-sky-100/50 px-1.5 py-0.5 rounded leading-none select-none">
          {language === "hi" ? "प्रायोजित विज्ञापन" : "Sponsored Ad"}
        </span>
        
        {/* Toggle inspect mode */}
        <button
          onClick={() => setInspectMode(!inspectMode)}
          className="p-1 rounded-full text-slate-400 hover:text-sky-700 hover:bg-sky-100/80 transition cursor-pointer"
          title="Inspect AdSense React Code Snippet"
        >
          {inspectMode ? <Eye className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
        </button>

        {/* Rotate simulation */}
        <button
          onClick={rotateAd}
          className="p-1 rounded-full text-slate-400 hover:text-sky-700 hover:bg-sky-100/80 transition cursor-pointer"
          title="Simulate Ad Rotation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Suppress ad block */}
        <button
          onClick={() => setAdRemoved(true)}
          className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
          title="Dismiss Ad placeholder"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {inspectMode ? (
        /* React developer code viewer, useful so client can substitute Google Code with peace of mind */
        <div className="w-full h-full flex flex-col justify-between text-left font-mono text-[9px] text-slate-650 bg-slate-900 border border-slate-800 p-3 rounded-lg text-white mt-4 select-text">
          <div className="flex items-center justify-between mb-1 text-slate-400 border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1 font-bold text-orange-400 text-[10px]">
              <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              ADSENSE-READY CODE SLOT
            </span>
            <span>Slot ID: {slotId}</span>
          </div>
          <p className="text-slate-400 leading-normal mb-1.5">
            // Replace the interactive mockup with this native code when ready:
          </p>
          <pre className="overflow-x-auto whitespace-pre-wrap leading-tight text-emerald-400 scrollbar-none max-h-[110px]">
{`<ins className="adsbygoogle"
     style={{ display: 'block' }}
     data-ad-client="ca-pub-XXXXXXXXXXXXX"
     data-ad-slot="${slotId}"
     data-ad-format="${format === 'horizontal' ? 'horizontal' : format === 'sidebar' ? 'vertical' : 'fluid'}"
     data-full-width-responsive="true"></ins>
<script>
  (window.adsbygoogle = window.adsbygoogle || []).push({});
</script>`}
          </pre>
          <div className="mt-1.5 flex items-center justify-end">
            <button
              onClick={() => setInspectMode(false)}
              className="px-2 py-0.5 bg-orange-600 hover:bg-orange-700 transition font-sans font-bold text-[10px] rounded text-white cursor-pointer"
            >
              Back to Interactive View
            </button>
          </div>
        </div>
      ) : (
        /* The polished user-facing visual advertisement structure */
        <>
          {format === "horizontal" && (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-3 pt-2">
              <div className="flex items-start gap-3 max-w-2xl text-left">
                <div className="w-11 h-11 bg-orange-500 rounded-lg flex items-center justify-center text-white shrink-0 font-black text-sm border-2 border-white shadow-md">
                  {activeAd.badge.en.slice(0, 2).toUpperCase()}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="bg-sky-100 text-sky-700 font-extrabold text-[8px] px-1.5 py-0.5 rounded leading-none">
                      {language === "hi" ? activeAd.badge.hi : activeAd.badge.en}
                    </span>
                    <h5 className="font-extrabold text-xs text-slate-800 tracking-tight leading-snug">
                      {language === "hi" ? activeAd.title.hi : activeAd.title.en}
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-550 leading-relaxed max-w-xl">
                    {language === "hi" ? activeAd.desc.hi : activeAd.desc.en}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                <span className="text-[9px] text-slate-400 font-mono hidden md:inline">
                  ad_ref: gp-{slotId}
                </span>
                <a
                  href={activeAd.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-4 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5 hover:gap-2"
                >
                  <span>{language === "hi" ? activeAd.cta.hi : activeAd.cta.en}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {format === "sidebar" && (
            <div className="flex flex-col h-full w-full justify-between pt-1 text-left">
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white shrink-0 font-black text-xs border border-white shadow">
                    {activeAd.badge.en.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="bg-emerald-50 text-emerald-800 font-extrabold text-[8px] px-1 rounded block w-fit leading-tight mb-0.5">
                      {language === "hi" ? activeAd.badge.hi : activeAd.badge.en}
                    </span>
                    <h5 className="font-extrabold text-[12px] text-slate-900 leading-snug tracking-tight">
                      {language === "hi" ? activeAd.title.hi : activeAd.title.en}
                    </h5>
                  </div>
                </div>
                
                <p className="text-[11px] text-slate-600 leading-normal">
                  {language === "hi" ? activeAd.desc.hi : activeAd.desc.en}
                </p>
              </div>

              <div className="pt-4 border-t border-sky-100 mt-2">
                <a
                  href={activeAd.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-3 py-2 bg-sky-600 text-white hover:bg-sky-700 transition font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>{language === "hi" ? activeAd.cta.hi : activeAd.cta.en}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-[8px] text-slate-400 font-mono block text-center mt-2">
                  ID: client-ca-pub-{slotId}
                </span>
              </div>
            </div>
          )}

          {format === "inline" && (
            <div className="flex items-center justify-between gap-4 w-full text-left pt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-sky-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                  AD
                </div>
                <div>
                  <h6 className="text-[11px] font-bold text-slate-800 leading-none flex items-center gap-1.5">
                    {language === "hi" ? activeAd.title.hi : activeAd.title.en}
                    <span className="bg-sky-100 text-sky-850 font-bold text-[7px] px-1 rounded">
                      {language === "hi" ? activeAd.badge.hi : activeAd.badge.en}
                    </span>
                  </h6>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1 max-w-md sm:max-w-xl md:max-w-3xl">
                    {language === "hi" ? activeAd.desc.hi : activeAd.desc.en}
                  </p>
                </div>
              </div>
              <a
                href={activeAd.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-sky-550 border border-sky-600 text-slate-800 hover:text-white hover:bg-sky-600 text-[10px] font-bold rounded transition whitespace-nowrap flex items-center gap-1"
              >
                <span>{language === "hi" ? activeAd.cta.hi : activeAd.cta.en}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
