import React, { useState, useMemo } from "react";
import { useLanguage } from "../LanguageContext";
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Undo2,
  Sparkles,
  Award
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "documents" | "status" | "locker" | "general";
  question: Record<string, string>;
  answer: Record<string, string>;
}

export default function ESevaFaq({ onBackToServices }: { onBackToServices?: () => void }) {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "documents" | "status" | "locker" | "general">("all");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  // Local dictionaries for basic dashboard elements
  const localT = {
    en: {
      title: "Help & FAQ Hub",
      subtitle: "Resolve common e-Seva difficulties, check document criteria, and learn how to bypass administrative verification blocks instantly.",
      searchPlaceholder: "Search FAQ topics (e.g., Aadhaar mismatch, status)...",
      catAll: "All Topics",
      catDocs: "Documents & e-KYC",
      catStatus: "Status & Hurdles",
      catLocker: "DigiLocker & QR Check",
      catGeneral: "General Inquiries",
      noResults: "No Matching Frequently Asked Questions Found",
      noResultsDesc: "Try revising your terminology or switching the categories.",
      backBtn: "Apply for Services",
      quickTipTitle: "Self-Verifications Hint",
      quickTipDesc: "Is your petition stuck in \"Under Verification\"? Select your application on the tracking panel on the right side and click \"Lodge Administrative Approval\" to bypass district bureaucratic review and issue credentials instantly!",
      relatedTitle: "Common Documentation Standards",
      docsRequired: "Typical proofs requested across union territories:",
      docAddress: "Address Verification: Utility utility bill (<3 mths), bank ledger, voter ID, passport.",
      docIdentity: "Identity Proof: Verifiable 12-digit Aadhaar Card, PAN card, driving licence.",
      docIncome: "Income Proof: Village accountant certified audit register or monthly salary slip.",
    },
    hi: {
      title: "सहायता एवं प्रश्नोत्तरी केंद्र",
      subtitle: "आम ई-सेवा कठिनाइयों का समाधान करें, दस्तावेजों के पात्रता मानदंडों की जांच करें, तथा प्रशासनिक सत्यापन को तुरंत हल करना सीखें।",
      searchPlaceholder: "अक्सर पूछे जाने वाले सवाल खोजें (जैसे कि आधार, स्थिति)...",
      catAll: "सभी विषय",
      catDocs: "दस्तावेज़ एवं ई-केवाईसी",
      catStatus: "आवेदन की स्थिति और अड़चनें",
      catLocker: "डिजीलॉकर और क्यूआर चेक",
      catGeneral: "सामान्य प्रश्न",
      noResults: "कोई मेल खाता प्रश्न नहीं मिला",
      noResultsDesc: "कृपया अधिक सरल शब्दों का प्रयोग करें या श्रेणी बदलें।",
      backBtn: "सेवाओं के लिए आवेदन करें",
      quickTipTitle: "स्व-सत्यापन संकेत",
      quickTipDesc: "क्या आपका आवेदन \"सत्यापन प्रक्रिया\" में अटका हुआ है? दाईं ओर ट्रैकिंग पैनल पर अपना आवेदन चुनें और जिला स्तर के सत्यापन को तुरंत दरकिनार कर प्रमाण पत्र जारी करने के लिए \"प्रशासनिक स्वीकृति दर्ज करें (Lodge Approval)\" पर क्लिक करें!",
      relatedTitle: "सामान्य दस्तावेज़ मानक",
      docsRequired: "राज्यों और केंद्र शासित प्रदेशों में मांगे जाने वाले सामान्य प्रमाण पत्र:",
      docAddress: "पता सत्यापन: उपयोगिता बिल (3 महीने से कम पुराना), बैंक पासबुक, मतदाता पत्र, पासपोर्ट।",
      docIdentity: "पहचान प्रमाण: सत्यापित 12-अंकीय आधार कार्ड, पैन कार्ड, ड्राइविंग लाइसेंस।",
      docIncome: "आय का प्रमाण: पटवारी या ग्राम लेखाकार द्वारा प्रमाणित आय घोषणा पत्र या वेतन पर्ची।",
    }
  };

  const currentT = localT[language === "hi" ? "hi" : "en"] || localT["en"];

  // Core set of localized FAQ items representing e-Seva document guidelines and common application hurdles
  const faqItems: FAQItem[] = [
    {
      id: "faq-1",
      category: "status",
      question: {
        en: "Why is my application status stuck under \"Under Verification\" and how do I resolve this?",
        hi: "मेरा आवेदन काफी समय से \"सत्यापन प्रक्रिया (Under Verification)\" में क्यों अटका हुआ है और इसका समाधान कैसे करें?"
      },
      answer: {
        en: "In the real world, state applications must be analyzed and approved by respective Sub-Divisional Officers (SDO) or Local Revenue Authorities, which usually takes 5-15 business days. In this digital portal workspace, you can easily bypass this step! Simply locate your active application card in the 'Recent Tracker' panel on the right side of the screen, select it, and click 'Lodge Administrative Approval'. This will run localized officer signatures and issue your credential instantly to your DigiLocker.",
        hi: "वास्तविक राज्यों में, आवेदनों का सत्यापन उप-विभागीय अधिकारियों (SDO) या स्थानीय राजस्व अधिकारियों द्वारा किया जाता है जिसमें ५-१५ दिन लगते हैं। इस डिजिटल पोर्टल पर आप इस प्रक्रिया को तुरंत पूरा कर सकते हैं! बस स्क्रीन के दाहिनी ओर 'Recent Tracker' वाले हिस्से में अपने आवेदन पर क्लिक करें और 'प्रशासनिक स्वीकृति दर्ज करें (Lodge Administrative Approval)' बटन दबाएं। इससे त्वरित मंजूरी मिल जाएगी और प्रमाण पत्र जारी होकर आपके डिजीलॉकर में सुरक्षित आ जाएगा।"
      }
    },
    {
      id: "faq-2",
      category: "documents",
      question: {
        en: "Why is my PAN card application showing \"UIDAI Demographic Verification Failure\"?",
        hi: "मेरे पैन कार्ड फॉर्म में \"आधार नाम/जनसांख्यिकी सत्यापन विफलता\" त्रुटि संदेश क्यों दिखाई देता है?"
      },
      answer: {
        en: "PAN registration systems retrieve demographic records (Spelling, Gender, Birthdate) directly from Aadhaar services (UIDAI). If even a single character, spacing, or middle name is mismatched compared to your official Aadhaar card, the income tax department gateway will reject your request. Ensure that the spelling matches your digital credentials exactly. If required, update your Aadhaar demographic variables first.",
        hi: "पैन कार्ड प्रणाली आपका नाम, लिंग और जन्म तिथि सीधे आधार (UIDAI) डेटाबेस से सत्यापित करती है। यदि आपके आधार रिकॉर्ड और पैन आवेदन में एक अक्षर या स्पेस का भी अंतर है, तो आयकर विभाग का पोर्टल आवेदन अस्वीकार कर देगा। कृपया आवेदन पत्र में ठीक वैसा ही नाम भरें जैसा आपके आधार कार्ड में लिखा है। आवश्यकता होने पर पहले अपना आधार विवरण सुधारें।"
      }
    },
    {
      id: "faq-3",
      category: "locker",
      question: {
        en: "How do I check if my digital credential is legally valid and cryptographically signed?",
        hi: "मैं यह कैसे जांचूं कि मेरा डिजिटल प्रमाण पत्र कानूनी रूप से मान्य और हस्ताक्षरित (Signed) है?"
      },
      answer: {
        en: "All certificates generated on this national portal (Aadhaar cards, PAN registry cards, ABHA Health IDs, Income certificates, e-Shram cards) are cryptographically authenticated under national IT rules. Navigate to the \"My DigiLocker Wallet\" tab to preview your issue records. Each file displays a verifiable QR code containing secure citizen telemetry, an administrative watermarked verification stamp, and the official digital signature hash confirming authenticity.",
        hi: "इस राष्ट्रीय पोर्टल पर जनरेट होने वाले सभी कार्ड (आधार, पैन, आभा हेल्थ आईडी, आय प्रमाण पत्र, ई-श्रम) आईटी कानून के तहत डिजिटल रूप से हस्ताक्षरित हैं। अपने प्रमाण पत्र देखने के लिए ऊपर 'My DigiLocker Wallet' टैब पर जाएं। प्रत्येक सत्यापित प्रमाण पत्र पर एक क्यूआर कोड (QR Code), जारीकर्ता प्राधिकरण का वॉटरमार्क स्टैम्प और डिजिटल हस्ताक्षर हैश प्रदर्शित होता है जो इसकी आधिकारिक वैधता को दर्शाता है।"
      }
    },
    {
      id: "faq-4",
      category: "documents",
      question: {
        en: "Which documents are approved as standard address proof for identity/caste welfare certificates?",
        hi: "पहचान पत्र या जाति/आय कल्याणकारी योजनाओं के लिए मानक निवास (पता) प्रमाण के रूप में कौन से दस्तावेज स्वीकृत हैं?"
      },
      answer: {
        en: "Standard certified documents permitted for resident verification under MeitY guidelines include: 1. Recent utility bill (Electricity, Water, or PNG pipeline bill dated within last 3 months). 2. National Passport or Voter ID Card. 3. Bank register passbook containing physical bank branch manager signature stamps. 4. Registered home lease/rent agreement certified by a judicial sub-registrar office.",
        hi: "MeitY द्वारा स्वीकृत सामान्य पता प्रमाण पत्रों के अंतर्गत ये दस्तावेज मान्यता प्राप्त हैं: १. वर्तमान उपयोगिता बिल (बिजली बिल, पानी या गैस पाइपलाइन का बिल पिछले ३ महीनों का हो), २. पासपोर्ट या मतदाता पहचान पत्र (Voter ID), ३. बैंक पासबुक जिस पर शाखा प्रबंधक के हस्ताक्षर और सील हो, ४. सब-रजिस्ट्रार कार्यालय द्वारा विधिवत प्रमाणित पंजीकृत किरायानामा।"
      }
    },
    {
      id: "faq-5",
      category: "general",
      question: {
        en: "How does the Dynamic Eligibility Comparison Matrix operate?",
        hi: "गतिशील पात्रता तुलना मैट्रिक्स (Dynamic Eligibility Comparison) कैसे काम करता है?"
      },
      answer: {
        en: "Our 'Eligibility Checker' module analyzes dynamic state eligibility formulas against your household profile. On inputting parameters such as residency, social sub-categories, and seasonal crop variables, the backend compares candidate fields against active welfare schemas. It immediately identifies maximum subvention payouts, shows exact mandatory proof documents required, and provides a direct activation trigger link to begin your application instantly.",
        hi: "हमारा 'Eligibility Checker' मॉड्यूल आपके द्वारा दी गई पारिवारिक जानकारी के आधार पर विभिन्न राज्य योजनाओं की पात्रता का स्वतः विश्लेषण करता है। जब आप निवास राज्य, मासिक/वार्षिक आय, विशिष्ट सामाजिक श्रेणियाँ और कृषि क्षेत्र आदि दर्ज करते हैं, तो कंप्यूटर तुरंत आपकी तुलना उपलब्ध योजनाओं से करता है और आपको अधिकतम संभावित लाभ के साथ-साथ आवश्यक कागजातों की सूची दिखा देता है।"
      }
    },
    {
      id: "faq-6",
      category: "status",
      question: {
        en: "Is there any cost or government processing fee for e-Seva public certificates on SewaNadu?",
        hi: "क्या SewaNadu पर ई-सेवा जन कल्याणकारी प्रमाण पत्रों के लिए कोई सरकारी शुल्क देना पड़ता है?"
      },
      answer: {
        en: "SewaNadu complies with the Digital India mission parameters. Identity cards (Aadhaar demographic renewals, ABHA health records, e-Shram worker codes) are processed 100% FREE without any governmental levies. Revenue and finance issuances (such as state Income declarations or Caste certificates) have a designated minimal administrative service fee (e.g. ₹30) which is processed inside this secure portal gateway simulator without actual payment linkages.",
        hi: "SewaNadu डिजिटल इंडिया अभियान के मानदंडों का पूरी तरह से पालन करता है। बुनियादी सामाजिक और स्वास्थ्य कार्ड (जैसे आधार अपडेट, आभा हेल्थ आईडी, ई-श्रम पंजीकरण) पूरी तरह से मुफ्त (₹0 शुल्क) हैं। जबकि राजस्व विभाग द्वारा जारी किए जाने वाले प्रमाण पत्रों (जैसे आय प्रमाण पत्र) के लिए मामूली प्रशासनिक शुल्क (₹30) का प्रावधान है, जो यहाँ इस सिम्युलेटर में बिना किसी वास्तविक भुगतान के पूरा हो जाता है।"
      }
    }
  ];

  // Apply search query and category filters
  const filteredItems = useMemo(() => {
    return faqItems.filter(item => {
      // Category filter
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }
      // Term filter
      const searchLower = searchQuery.toLowerCase();
      if (!searchLower) return true;

      const qEn = (item.question.en || "").toLowerCase();
      const qHi = (item.question.hi || "").toLowerCase();
      const aEn = (item.answer.en || "").toLowerCase();
      const aHi = (item.answer.hi || "").toLowerCase();

      return qEn.includes(searchLower) || qHi.includes(searchLower) || aEn.includes(searchLower) || aHi.includes(searchLower);
    });
  }, [searchQuery, activeCategory]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xs border border-stone-200/80 overflow-hidden" id="faq-container-root">
      
      {/* FAQ Banner Header */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white p-6 sm:p-8 relative">
        <div className="absolute top-0 right-0 p-3 opacity-15">
          <HelpCircle className="w-28 h-28 text-white stroke-1" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-[10px] tracking-wider uppercase border border-amber-500/20">
              <Sparkles className="w-3 h-3" />
              Self-Service Help Center
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl leading-tight text-white select-text">
              {currentT.title}
            </h2>
            <p className="text-stone-300 text-xs leading-relaxed max-w-lg font-sans select-text">
              {currentT.subtitle}
            </p>
          </div>

          {onBackToServices && (
            <button
              onClick={onBackToServices}
              className="px-4 py-2 bg-amber-550 hover:bg-amber-600 text-stone-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shrink-0"
              id="faq-back-to-services-btn"
            >
              <Award className="w-4 h-4" />
              {currentT.backBtn}
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Search Bar & Category filter badges integrated */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={currentT.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 py-3 pl-10 pr-4 rounded-2xl text-xs outline-none focus:border-brand-coral/45 focus:bg-white focus:ring-2 focus:ring-brand-coral/10 transition text-stone-850 shadow-inner"
              id="faq-search-input"
            />
          </div>

          {/* Tag Category Filters */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: currentT.catAll },
              { id: "documents", label: currentT.catDocs },
              { id: "status", label: currentT.catStatus },
              { id: "locker", label: currentT.catLocker },
              { id: "general", label: currentT.catGeneral }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-full text-[10.5px] font-bold tracking-tight transition cursor-pointer select-none border ${
                  activeCategory === cat.id 
                    ? "bg-stone-900 border-stone-900 text-white shadow-xs" 
                    : "bg-white border-stone-200 hover:bg-stone-100/70 text-stone-605"
                }`}
                id={`faq-cat-filter-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Accordion list of answers */}
        <div className="space-y-3" id="faq-accordion-list">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-stone-200 bg-stone-50/50">
              <AlertTriangle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <h4 className="font-extrabold text-stone-800 text-xs select-text">{currentT.noResults}</h4>
              <p className="text-[11px] text-stone-500 mt-1 select-text">{currentT.noResultsDesc}</p>
            </div>
          ) : (
            filteredItems.map(item => {
              const itemQ = item.question[language] || item.question.en;
              const itemA = item.answer[language] || item.answer.en;
              const isExpanded = expandedId === item.id;

              return (
                <div 
                  key={item.id}
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isExpanded 
                      ? "border-brand-coral/30 bg-orange-50/15 ring-1 ring-brand-coral/10" 
                      : "border-stone-250/70 bg-white hover:bg-stone-50/30 hover:border-stone-300"
                  }`}
                  id={`faq-item-card-${item.id}`}
                >
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full px-5 py-4 text-left flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className={`w-4 h-4 mt-0.5 shrink-0 transition ${
                        isExpanded ? "text-brand-coral" : "text-stone-400"
                      }`} />
                      <span className="font-sans font-bold text-stone-850 text-xs sm:text-[13px] leading-snug select-text">
                        {itemQ}
                      </span>
                    </div>
                    <div className="shrink-0 p-1 bg-stone-50 rounded-lg border border-stone-200">
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-stone-600" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-stone-655" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 pl-11 text-xs text-stone-650 leading-relaxed font-sans border-t border-dashed border-stone-200/50 select-text animate-fadeIn">
                      <p className="whitespace-pre-line leading-relaxed select-text">{itemA}</p>
                      
                      {/* Interactive hint context specifically for status checks */}
                      {item.category === "status" && (
                        <div className="mt-3.5 p-3 bg-white border border-stone-200 rounded-xl flex items-start gap-2 text-[10.5px] text-amber-850 leading-normal">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Interactive Shortcut:</strong> Check the <strong>"Lodge Administrative Approval"</strong> trigger button right inside the side application details popup to skip bureaucratic waiting in this sandbox.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Extra resources & Documentation standards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 border-t border-stone-200/70 pt-6 select-text">
          
          <div className="md:col-span-7 space-y-3">
            <h4 className="font-extrabold text-[#111111] text-[12px] uppercase tracking-wider flex items-center gap-1.5 select-text">
              <FileText className="w-4 h-4 text-brand-coral" />
              {currentT.relatedTitle}
            </h4>
            <p className="text-[11px] text-stone-500 leading-none select-text">{currentT.docsRequired}</p>
            
            <div className="space-y-2.5 pt-1 text-[11.5px] font-sans">
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-705 leading-relaxed select-text">
                <span className="font-bold text-stone-900 block mb-0.5">📍 {currentT.docAddress.split(":")[0]}:</span>
                {currentT.docAddress.split(":")[1] || currentT.docAddress}
              </div>
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-705 leading-relaxed select-text">
                <span className="font-bold text-stone-900 block mb-0.5">💳 {currentT.docIdentity.split(":")[0]}:</span>
                {currentT.docIdentity.split(":")[1] || currentT.docIdentity}
              </div>
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-705 leading-relaxed select-text">
                <span className="font-bold text-stone-900 block mb-0.5">🌾 {currentT.docIncome.split(":")[0]}:</span>
                {currentT.docIncome.split(":")[1] || currentT.docIncome}
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4.5 space-y-2.5 h-full flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <h4>{currentT.quickTipTitle}</h4>
                </div>
                <p className="text-[11px] text-stone-707 leading-relaxed select-text">
                  {currentT.quickTipDesc}
                </p>
              </div>
              
              <div className="text-[10px] text-stone-450 font-mono flex items-center justify-between border-t border-amber-505/15 pt-2.5">
                <span>VERIFIABLE GATEWAY</span>
                <span>MeitY SECURE</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
