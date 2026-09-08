import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Newspaper, Globe, ExternalLink, Sparkles, RefreshCw, 
  MapPin, CheckCircle, AlertCircle, BookmarkCheck
} from "lucide-react";
import { JURISDICTIONS } from "../services-data";
import { getApiUrl } from "../lib/api";

interface NewsItem {
  headline: string;
  summary: string;
  date: string;
  category: string;
  impact: string;
}

interface SourceItem {
  title: string;
  url: string;
}

interface StateGovernanceNewsWidgetProps {
  language: string;
  triggerToast: (msg: string, type?: "success" | "info" | "error") => void;
}

export default function StateGovernanceNewsWidget({ language, triggerToast }: StateGovernanceNewsWidgetProps) {
  const [selectedStateId, setSelectedStateId] = useState("karnataka");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  const currentStateName = JURISDICTIONS.find(j => j.id === selectedStateId)?.name || "Karnataka";

  const fetchStateNews = async (stateId: string) => {
    const stateObj = JURISDICTIONS.find(j => j.id === stateId);
    const stateName = stateObj ? stateObj.name : "Karnataka";
    
    setLoading(true);
    try {
      const response = await fetch(getApiUrl(`/api/eseva/news?state=${encodeURIComponent(stateName)}`));
      if (response.ok) {
        const data = await response.json();
        setNews(data.news || []);
        setSources(data.sources || []);
        setFallbackUsed(!!data.fallbackUsed);
      } else {
        throw new Error("News response failed");
      }
    } catch (err) {
      console.error("Failed to fetch search-grounded news:", err);
      // Fallback local mock data just in case
      setNews([
        {
          headline: `${stateName} Activates Unified Citizen Single-Window Systems`,
          summary: `Administrative outposts are linked under unified e-Seva structures to accelerate demographic profile updates.`,
          date: "June 2026",
          category: "Digital",
          impact: "Directly minimizing queue bottlenecks"
        },
        {
          headline: `New State Rural Welfare Grants Approved`,
          summary: `Direct Benefit Transfer (DBT) funds are mobilized for families with linked Aadhaar identification cards.`,
          date: "June 2026",
          category: "Welfare",
          impact: "Targeting thousands of regional families"
        }
      ]);
      setSources([
        { title: "National Portal of India", url: "https://www.india.gov.in" }
      ]);
      setFallbackUsed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStateNews(selectedStateId);
  }, [selectedStateId]);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden" id="state-news-bulletin-widget">
      {/* Visual Accent Glow */}
      <span className="absolute -top-12 -left-12 w-28 h-28 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></span>

      {/* Header Bar */}
      <div className="border-b border-stone-100 pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-amber-500/15 rounded-lg flex items-center justify-center">
              <Newspaper className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <h3 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider font-display flex items-center gap-1.5">
              <span>{language === "hi" ? "राज्य लाइव सरकारी समाचार" : "Live State Governance News"}</span>
              <span className="flex items-center gap-0.5 bg-amber-500/10 text-amber-700 text-[8.5px] px-1.5 py-0.2 rounded font-mono font-bold uppercase shrink-0">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Grounding</span>
              </span>
            </h3>
          </div>
          <p className="text-[10px] text-stone-500 font-medium leading-relaxed">
            {language === "hi" 
              ? "गूगल सर्च एआई तकनीक द्वारा सीधे सरकारी वेब पोर्टलों से प्राप्त सत्यापित समाचार व नीतियां।" 
              : "Up-to-date regional welfare policies and municipal directives fetched live from official sources."}
          </p>
        </div>

        {/* State / UT selector select box */}
        <div className="relative shrink-0 min-w-[130px]" id="news-state-dropdown-wrapper">
          <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedStateId}
            onChange={(e) => {
              setSelectedStateId(e.target.value);
              triggerToast(
                language === "hi" 
                  ? `गूगल सर्च द्वारा लाइव ${JURISDICTIONS.find(j => j.id === e.target.value)?.name} समाचार खोजा जा रहा है...` 
                  : `Searching Google for live ${JURISDICTIONS.find(j => j.id === e.target.value)?.name} governance updates...`,
                "info"
              );
            }}
            className="w-full bg-stone-50 border border-stone-250 hover:border-stone-300 py-1.5 pl-7 pr-3 rounded-lg text-[10.5px] font-bold text-stone-750 outline-none transition cursor-pointer appearance-none"
            id="news-state-selector"
          >
            {JURISDICTIONS.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Bulletins Content Area */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="py-8 text-center flex flex-col items-center justify-center space-y-3" key="loading">
            <RefreshCw className="w-6 h-6 text-amber-500 animate-spin" />
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-stone-500">
                {language === "hi" ? "आधिकारिक डेटा स्रोतों को खोजा जा रहा है..." : "Filing Google Search query for live updates..."}
              </p>
              <span className="text-[8.5px] text-stone-400 font-sans block italic">
                Querying gemini-3.5-flash web grounded tool index
              </span>
            </div>
          </div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="space-y-3.5"
          >
            {/* News List */}
            <div className="space-y-3" id="news-bulletin-list">
              {news.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-stone-50 hover:bg-stone-100/60 border border-stone-150 rounded-xl transition-all duration-200 text-left relative group hover:shadow-3xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1 select-none">
                    <span className="bg-amber-600/10 text-amber-700 border border-amber-600/10 text-[8px] font-mono font-bold uppercase px-1.5 py-0.2 rounded">
                      {item.category || "Policy"}
                    </span>
                    <span className="text-[8.5px] text-stone-400 font-mono font-medium">
                      {item.date}
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-[11px] leading-tight font-sans mb-1 tracking-tight group-hover:text-amber-700 transition-colors">
                    {item.headline}
                  </h4>
                  
                  <p className="text-[10px] text-stone-550 leading-relaxed mb-2 font-sans">
                    {item.summary}
                  </p>

                  {item.impact && (
                    <div className="flex items-center gap-1.5 pt-1.5 border-t border-stone-100 text-[9px] font-sans font-semibold text-emerald-600 select-none">
                      <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{item.impact}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Citations section - highly relevant and professional */}
            {sources.length > 0 && (
              <div className="bg-amber-50/40 border border-amber-200/50 rounded-xl p-3.5 space-y-2 select-none" id="news-sources-panel">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[8.5px] font-mono font-black tracking-widest text-stone-450 uppercase">
                    {language === "hi" ? "गूगल सर्च सत्यापित स्रोत:" : "Google Search Verified Citations:"}
                  </span>
                  {fallbackUsed && (
                    <span className="text-[8.5px] text-stone-400 font-sans italic">Offline fallback</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {sources.map((src, sIdx) => (
                    <a
                      key={sIdx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-200/60 rounded text-[9.5px] font-semibold text-amber-900 shadow-3xs hover:shadow-2xs transition duration-200"
                      title={src.title}
                    >
                      <Globe className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                      <span className="truncate max-w-[130px]">{src.title}</span>
                      <ExternalLink className="w-2 h-2 text-stone-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
