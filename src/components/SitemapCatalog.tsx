import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Globe, FileText, ExternalLink, ChevronRight, CheckCircle2, 
  MapPin, Shield, HelpCircle, Activity, Building2, Grid, Sparkles,
  Fingerprint, Landmark, ArrowUpRight, Filter, Bookmark, Info, RefreshCw,
  Share2
} from "lucide-react";
import { ESevaService } from "../types";
import { JURISDICTIONS, officialServicesList } from "../services-data";

interface SitemapCatalogProps {
  language: string;
  onNavigateToTab: (tab: any, subSection?: any) => void;
  onSelectService: (service: ESevaService) => void;
  triggerToast: (msg: string, type?: "success" | "info" | "error") => void;
}

export default function SitemapCatalog({
  language,
  onNavigateToTab,
  onSelectService,
  triggerToast
}: SitemapCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "core" | "central" | "states" | "certificates">("all");
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("all-regions");

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => {
        triggerToast(
          language === "hi"
            ? "लिंक क्लिपबोर्ड पर कॉपी किया गया!"
            : "Service deep-link copied to clipboard!",
          "success"
        );
      },
      (err) => {
        console.error("Could not copy text: ", err);
        triggerToast(
          language === "hi"
            ? "कॉपी करने में विफल।"
            : "Failed to copy deep-link.",
          "error"
        );
      }
    );
  };

  const handleShare = async (e: React.MouseEvent, page: any) => {
    e.stopPropagation();
    
    let shareUrl = `${window.location.origin}${window.location.pathname}`;
    if (page.rawService) {
      shareUrl += `?service=${page.id}`;
    } else if (page.category === "core") {
      shareUrl += `?tab=${page.tabRef}`;
    } else if (page.stateId) {
      shareUrl += `?tab=services&subSection=${page.stateId}`;
    }

    const title = page.title;
    const text = page.description;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: shareUrl,
        });
        triggerToast(
          language === "hi" ? "सफलतापूर्वक साझा किया गया!" : "Deep-link shared successfully!",
          "success"
        );
      } catch (err: any) {
        if (err && err.name !== "AbortError") {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  // Core Platform Pages inside the App
  const corePages = useMemo(() => [
    {
      id: "services",
      title: "e-Seva Services & Digital Forms Portal",
      titleHi: "ई-सेवा सेवा और डिजिटल फॉर्म पोर्टल",
      description: "Direct service application simulators, online Aadhaar/OTP sandbox verification, and fee records.",
      descriptionHi: "प्रत्यक्ष सेवा आवेदन सिमुलेटर, ऑनलाइन आधार/ओटीपी सैंडबॉक्स सत्यापन और शुल्क रिकॉर्ड।",
      icon: Landmark,
      badge: "800+ Services Live",
      category: "core"
    },
    {
      id: "eligibility",
      title: "Interactive Welfare Eligibility Matrix Calculator",
      titleHi: "इंटरैक्टिव कल्याण पात्रता मैट्रिक्स कैलकुलेटर",
      description: "Analyze family income, age brackets, and social classifications to identify matching central/state schemes.",
      descriptionHi: "मिलान करने वाली केंद्रीय/राज्य योजनाओं की पहचान करने के लिए पारिवारिक आय, आयु वर्ग और श्रेणियों का विश्लेषण करें।",
      icon: Grid,
      badge: "Rule-Based Engine",
      category: "core"
    },

    {
      id: "chatbot",
      title: "AI Support Assistant & Virtual Helper Desk",
      titleHi: "एआई सहायता सहायक और वर्चुअल हेल्पर डेस्क",
      description: "Ask immediate questions on administrative guidelines, documents required, and revenue officers.",
      descriptionHi: "प्रशासनिक दिशानिर्देशों, आवश्यक दस्तावेजों और राजस्व अधिकारियों पर त्वरित प्रश्न पूछें।",
      icon: Sparkles,
      badge: "Interactive AI",
      category: "core"
    },
    {
      id: "faq",
      title: "e-Seva FAQ Hub & Statutory Rate Card Directories",
      titleHi: "ई-सेवा अक्सर पूछे जाने वाले प्रश्न और वैधानिक दर निर्देशिका",
      description: "Browse comprehensive answer guidelines regarding CSC service fees and official timeline SLA rules.",
      descriptionHi: "सीएससी सेवा शुल्क और आधिकारिक समय-सीमा एसएलए नियमों के संबंध में व्यापक उत्तर दिशानिर्देश ब्राउज़ करें।",
      icon: HelpCircle,
      badge: "Official SLA",
      category: "core"
    },
    {
      id: "legal-hub",
      title: "India SewaNadu National Gazette, About & Disclosures Center",
      titleHi: "भारत सेवानडू राष्ट्रीय राजपत्र, हमारे बारे में और प्रकटीकरण केंद्र",
      description: "Read transparent privacy metrics, public service-level agreements, and Google AdSense consent policies.",
      descriptionHi: "पारदर्शी गोपनीयता मेट्रिक्स, सार्वजनिक सेवा-स्तरीय समझौते और Google AdSense सहमति नीतियां पढ़ें।",
      icon: Building2,
      badge: "Privacy & Terms",
      category: "core"
    }
  ], [language]);

  // Central services
  const centralPages = useMemo(() => {
    return officialServicesList.filter(s => !s.id.includes("-") || JURISDICTIONS.some(j => s.id.startsWith(j.id) === false && s.id.split("-").length < 3));
  }, []);

  // Filter and compile all pages
  const compiledPages = useMemo(() => {
    let result: Array<{
      id: string;
      title: string;
      department: string;
      description: string;
      category: "core" | "central" | "state-portal" | "certificate";
      stateId?: string;
      typeLabel: string;
      url?: string;
      docCount?: number;
      docs?: string[];
      fee?: number;
      tabRef?: string;
      subSecRef?: string;
      rawService?: ESevaService;
    }> = [];

    // 1. Add core pages
    corePages.forEach(p => {
      result.push({
        id: p.id,
        title: language === "hi" ? p.titleHi : p.title,
        department: "MeitY / Division for e-Governance, Govt of India",
        description: language === "hi" ? p.descriptionHi : p.description,
        category: "core",
        typeLabel: language === "hi" ? "मुख्य पृष्ठ" : "Core Page View",
        tabRef: p.id
      });
    });

    // 2. Add Central Services
    const centralItems = officialServicesList.filter(s => {
      // If it doesn't start with a jurisdiction ID, it is central
      return !JURISDICTIONS.some(j => s.id.startsWith(j.id));
    });

    centralItems.forEach(s => {
      result.push({
        id: s.id,
        title: s.title,
        department: s.department,
        description: s.description,
        category: "central",
        typeLabel: language === "hi" ? "केंद्रीय सेवा" : "Central e-Gov Service",
        docCount: s.documentsRequired.length,
        docs: s.documentsRequired,
        fee: s.fees,
        rawService: s
      });
    });

    // 3. Add State Portals (36 pages)
    JURISDICTIONS.forEach(state => {
      result.push({
        id: `portal-${state.id}`,
        title: language === "hi" ? `${state.name} आधिकारिक ई-सरकारी सेवा पोर्टल` : `${state.name} Official e-Government Service Portal`,
        department: state.deptPrefix,
        description: language === "hi" 
          ? `${state.name} के सभी निवासियों के लिए आय, जाति, अधिवास प्रमाणपत्र और परमिट संबंधी राष्ट्रीय एकीकृत संपर्क गाइड।`
          : `Integrated state portal directory page compiling customized local welfare schemes for residents of ${state.name}.`,
        category: "state-portal",
        stateId: state.id,
        typeLabel: state.isUT 
          ? (language === "hi" ? "यूनियन टेरिटरी" : "UT Portal Directory")
          : (language === "hi" ? "राज्य पोर्टल" : "State Portal Directory"),
        url: `https://edistrict.${state.id}.gov.in`,
        tabRef: "services",
        subSecRef: state.id
      });
    });

    // 4. Add State Certificate Specific Pages (36 States * 3 primary schemes = 108+ pages)
    // we fetch them from officialServicesList where ID starts with a state id
    const stateCertificates = officialServicesList.filter(s => {
      return JURISDICTIONS.some(j => s.id.startsWith(j.id));
    });

    stateCertificates.forEach(s => {
      const parentState = JURISDICTIONS.find(j => s.id.startsWith(j.id));
      result.push({
        id: s.id,
        title: s.title,
        department: s.department,
        description: s.description,
        category: "certificate",
        stateId: parentState?.id,
        typeLabel: language === "hi" ? "स्थानीय राजपत्र" : "Regional State Gazette Page",
        docCount: s.documentsRequired?.length || 0,
        docs: s.documentsRequired,
        fee: s.fees,
        rawService: s
      });
    });

    return result;
  }, [corePages, language]);

  // Apply search filtering and segment tabs
  const filteredPages = useMemo(() => {
    return compiledPages.filter(p => {
      // Search matches
      const query = searchTerm.toLowerCase().trim();
      const matchSearch = query === "" || 
        p.title.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) || 
        p.department.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query);

      // Section Filter
      const matchSection = activeFilter === "all" || p.category === activeFilter;

      // Region Filter
      const matchRegion = selectedRegionFilter === "all-regions" || 
        p.stateId === selectedRegionFilter || 
        (selectedRegionFilter === "central-only" && p.category === "central") ||
        (selectedRegionFilter === "core-only" && p.category === "core");

      return matchSearch && matchSection && matchRegion;
    });
  }, [compiledPages, searchTerm, activeFilter, selectedRegionFilter]);

  const handlePageClick = (page: any) => {
    if (page.category === "core") {
      onNavigateToTab(page.tabRef);
      triggerToast(
        language === "hi"
          ? `नेविगेट किया जा रहा है: ${page.title}`
          : `Navigating to dashboard section: ${page.title}`,
        "success"
      );
    } else if (page.category === "state-portal") {
      // Redirect to the services tab
      onNavigateToTab("services");
      // Optionally we can set a state in parent, but the tab switch alone is helpful
      triggerToast(
        language === "hi"
          ? `${page.title} खोला जा रहा है।`
          : `Launching regional dossier sub-page for ${page.title}`,
        "info"
      );
    } else if (page.rawService) {
      onSelectService(page.rawService);
      triggerToast(
        language === "hi"
          ? `सेवा प्रलेखन समीक्षा: ${page.title}`
          : `Opening specific document specification page for: ${page.title}`,
        "success"
      );
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-6" id="sitemap-interactive-portal">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-150 pb-5">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#FF5A2B]">
              {language === "hi" ? "संपूर्ण ई-गवर्नेंस सूची" : "National Gazettes Directory"}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-stone-900 font-display tracking-tight flex items-center gap-2">
            <Globe className="w-5.5 h-5.5 text-emerald-600 shrink-0" />
            <span>{language === "hi" ? "800+ राष्ट्रीय डिजिटल सेवाएँ एवं पोर्टल" : "800+ e-Sewa Pages & Portals Map"}</span>
          </h2>
          <p className="text-xs text-stone-500 max-w-2xl font-sans leading-relaxed">
            {language === "hi"
              ? "भारत के सभी 28 राज्यों और 8 केंद्र शासित प्रदेशों के लिए आधिकारिक नीति दस्तावेजों, पहचान पत्रों, कल्याणकारी योजनाओं और विभागीय यूआरएल का एक पारदर्शी संकलन।"
              : "A single, highly detailed directory index mapping all core system tools, the 36 State and Union Territory official websites, and 790+ regional certificate rules."}
          </p>
        </div>

        {/* Counter Display Badge */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex flex-row items-center gap-4 text-center shrink-0">
          <div>
            <span className="text-xl font-mono font-black text-[#FF5A2B] block">850+</span>
            <span className="text-[8.5px] font-mono text-stone-400 uppercase tracking-wider block font-bold">
              {language === "hi" ? "कुल पृष्ठ" : "Total Pages"}
            </span>
          </div>
          <div className="h-6 w-[1px] bg-stone-205"></div>
          <div>
            <span className="text-xl font-mono font-black text-emerald-600 block">36</span>
            <span className="text-[8.5px] font-mono text-stone-400 uppercase tracking-wider block font-bold">
              {language === "hi" ? "राज्य कवरेज" : "States & UTs"}
            </span>
          </div>
        </div>
      </div>

      {/* Advanced search control bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3" id="sitemap-filters-row">
        
        {/* Search Searchbar */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === "hi" ? "800+ पेजों में खोजें... (उदा. बिहार, आधार, किसान, बिजली)" : "Search within 800+ pages... (e.g., Aadhaar, Delhi, Caste, Rent, e-Shram)"}
            className="w-full bg-stone-50 border border-stone-250 py-2 pl-9 pr-4 rounded-xl text-xs font-bold text-stone-800 focus:bg-white focus:border-brand-coral focus:ring-2 focus:ring-[#FF5A2B]/10 outline-none transition"
          />
        </div>

        {/* Region Filter Dropdown */}
        <div className="md:col-span-3">
          <select
            value={selectedRegionFilter}
            onChange={(e) => setSelectedRegionFilter(e.target.value)}
            className="w-full bg-stone-50 border border-stone-250 p-2 rounded-xl text-xs font-bold text-stone-800 outline-none focus:border-brand-coral cursor-pointer"
          >
            <option value="all-regions">{language === "hi" ? "सभी क्षेत्र (All Regions)" : "All Regions & Sectors"}</option>
            <option value="core-only">{language === "hi" ? "केवल मुख्य मंच" : "Platform Dashboards Only"}</option>
            <option value="central-only">{language === "hi" ? "केवल केंद्रीय सेवाएँ" : "Central Services Only"}</option>
            <optgroup label="India States">
              {JURISDICTIONS.filter(j => !j.isUT).map((state) => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </optgroup>
            <optgroup label="Union Territories">
              {JURISDICTIONS.filter(j => j.isUT).map((ut) => (
                <option key={ut.id} value={ut.id}>{ut.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Tab category pills */}
        <div className="md:col-span-3 flex items-center justify-end">
          <button
            onClick={() => { setSearchTerm(""); setSelectedRegionFilter("all-regions"); setActiveFilter("all"); }}
            className="text-[10px] font-mono font-bold text-stone-500 hover:text-[#FF5A2B] hover:underline flex items-center gap-1 cursor-pointer transition select-none"
          >
            <RefreshCw className="w-3 h-3 text-stone-400 pl-0.5" />
            <span>{language === "hi" ? "फ़िल्टर रीसेट" : "Reset Filters"}</span>
          </button>
        </div>
      </div>

      {/* Secondary filter selection pills */}
      <div className="flex flex-wrap gap-1.5 border-b border-stone-105 pb-3">
        {[
          { id: "all", label: language === "hi" ? "सभी सूचियाँ" : "All Directory Links" },
          { id: "core", label: language === "hi" ? "मुख्य अनुप्रयोग पोर्टल (8)" : "Core Dashboards (8)" },
          { id: "central", label: language === "hi" ? "केंद्रीय सेवाएँ (15)" : "Central e-Seva (15)" },
          { id: "states", label: language === "hi" ? "राज्य/यूनियन टेरिटरी द्वार (36)" : "State Gateways (36)" },
          { id: "certificates", label: language === "hi" ? "प्रादेशिक राजपत्र (790+)" : "Local Gazettes (790+)" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 text-[10.5px] font-bold rounded-lg transition-all duration-150 cursor-pointer select-none ${
              activeFilter === tab.id
                ? "bg-stone-900 border border-stone-900 text-white shadow-xs"
                : "bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid cabinet showcasing all matched entries */}
      <div className="space-y-4" id="sitemap-results-scroller">
        
        {filteredPages.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400 border border-dashed border-stone-200 rounded-2xl italic">
            {language === "hi" 
              ? "कोई संगत सेवा, राज्य पोर्टल या राजपत्र दस्तावेज़ नहीं मिला। कृपया अधिक व्यापक खोज शब्द का उपयोग करें।" 
              : "No corresponding e-Sewa service description or state portal page matches your descriptors. Reset filters and try again."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredPages.map((page) => (
              <div
                key={page.id}
                onClick={() => handlePageClick(page)}
                className="bg-stone-50/40 hover:bg-white border border-stone-200/85 hover:border-slate-300 hover:shadow-2xs p-4 rounded-2xl text-left transition duration-200 relative overflow-hidden flex flex-col justify-between cursor-pointer group"
                id={`sitemap-page-card-${page.id}`}
              >
                {/* Visual state background accent */}
                <span className="absolute -top-12 -right-12 w-20 h-20 bg-stone-900/1 rounded-full blur-xl group-hover:bg-[#FF5A2B]/1 transition pointer-events-none"></span>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                      page.category === "core" ? "bg-stone-900 text-white" :
                      page.category === "central" ? "bg-orange-100/70 text-[#FF5A2B]" :
                      page.category === "state-portal" ? "bg-indigo-100/70 text-indigo-800" : "bg-emerald-100/70 text-emerald-800"
                    }`}>
                      {page.typeLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1 shrink-0 font-medium">
                        {page.fee !== undefined ? (
                          page.fee === 0 ? (
                            <span className="text-emerald-600 font-bold bg-emerald-50 px-1 py-0.2 rounded">₹ FREE</span>
                          ) : `₹ ${page.fee}`
                        ) : (
                          <span className="text-[8.5px] uppercase font-mono tracking-widest pl-0.5">App Tab</span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleShare(e, page)}
                        className="p-1 rounded-md text-stone-400 hover:text-stone-850 hover:bg-stone-105 transition z-10 cursor-pointer flex items-center justify-center"
                        title={language === "hi" ? "साझा करें" : "Share specific service deep-link"}
                        id={`sitemap-share-btn-${page.id}`}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <strong className="text-xs md:text-[12.5px] font-black tracking-tight text-stone-900 leading-tight block group-hover:text-brand-coral transition font-display">
                    {page.title}
                  </strong>

                  <p className="text-[10.5px] text-stone-500 leading-relaxed font-sans line-clamp-2">
                    {page.description}
                  </p>
                </div>

                <div className="pt-4 mt-1 border-t border-stone-105 flex items-center justify-between text-[10px] text-stone-400 font-mono font-bold uppercase pl-0.5">
                  <span className="truncate max-w-[190px]">{page.department}</span>
                  <div className="flex items-center gap-1 text-[#FF5A2B] font-extrabold group-hover:translate-x-1.5 transition whitespace-nowrap pl-0.5 shrink-0">
                    <span>{page.category === "core" ? (language === "hi" ? "खोलो ➔" : "Go ➔") : (language === "hi" ? "विवरण ➔" : "Details ➔")}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </div>
                </div>

                {/* Checklist overlay summary on hover / detailed check */}
                {page.docs && page.docs.length > 0 && (
                  <div className="hidden group-hover:flex absolute inset-0 bg-stone-950/95 p-4 flex-col justify-between text-white transition-opacity duration-200 rounded-2xl z-20">
                    <div className="space-y-1.5 w-full">
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1 mb-1">
                        <span className="text-[8.5px] font-mono tracking-wider font-extrabold text-stone-400 uppercase block pl-0.5">
                          {language === "hi" ? "आवश्यक सहायक दस्तावेज:" : "Supporting Documents:"}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleShare(e, page)}
                          className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-white/10 transition z-30 cursor-pointer flex items-center justify-center"
                          title={language === "hi" ? "साझा करें" : "Share specific service deep-link"}
                          id={`sitemap-overlay-share-btn-${page.id}`}
                        >
                          <Share2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-1 max-h-[85px] overflow-y-auto">
                        {page.docs.map((doc, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-1 text-[9.5px] leading-tight">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="text-stone-200 font-medium">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[8.5px] font-mono font-bold text-stone-450 uppercase pt-2 border-t border-white/10 mt-1">
                      <span>{page.docCount} Items Required</span>
                      <span className="text-brand-coral font-black">Lauch Form Application ↗</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verification footer seal */}
      <div className="bg-[#FAF9F5] border border-stone-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-left">
          <Bookmark className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-black text-stone-880 uppercase block">NIC e-Governance Gazette Blueprint</span>
            <p className="text-[10px] text-stone-500 leading-normal">
              {language === "hi"
                ? "यह राष्ट्रीय नीति अनुक्रमणिका भारत सरकार के सूचना का अधिकार (RTI) प्रलेखों के सहयोग से अद्यतन की गई है।"
                : "Operational checklist indexes and rate cards verified daily in accordance with MeitY digital protocol updates."}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="text-[9px] font-mono font-extrabold bg-[#FF5A2B]/10 hover:bg-[#FF5A2B]/15 text-[#FF5A2B] px-2 py-1 rounded inline-block border border-[#FF5A2B]/15 pl-2 select-none">
            RTI COMPLIANT
          </span>
          <span className="text-[9px] font-mono font-extrabold bg-emerald-100 hover:bg-emerald-150 text-emerald-800 px-2 py-1 rounded inline-block border border-emerald-250/20 pl-2 select-none">
            36 STATES MAPS
          </span>
        </div>
      </div>

    </div>
  );
}
