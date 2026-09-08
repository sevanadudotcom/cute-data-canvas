import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Briefcase, Landmark, ShieldCheck, Heart, UserCheck, Search, Info, 
  MapPin, Clock, Banknote, FileSignature, ArrowRight, CheckCircle, 
  Globe, Compass, Star, ChevronDown, Check, Sparkles, Filter, RefreshCw,
  Share2, BookOpen, Bookmark, Languages, AlertTriangle, Sprout, GraduationCap,
  ArrowDownAZ, X, ArrowLeft, PlayCircle
} from "lucide-react";
import { ESevaService } from "../types";
import { useLanguage, serviceTranslations, Language } from "../LanguageContext";
import AdSenseUnit from "./AdSenseUnit";

interface ESevaServiceListProps {
  services: ESevaService[];
  onApplyClick: (service: ESevaService) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onFeedbackClick?: (service: ESevaService) => void;
  onDonateClick?: (service: ESevaService) => void;
  onReportIssueClick?: (service: ESevaService) => void;
  savedServiceIds?: string[];
  onToggleSave?: (serviceId: string, e: React.MouseEvent) => void;
}

// Custom localized content translations to align with screenshots perfectly
const contentTrans = {
  en: {
    heroPill: "Every government document, demystified.",
    heroTitle: "Know exactly which documents you need.",
    heroDesc: "Apply for Aadhaar, PAN, Passport, Driving Licence, Ration Card and 100+ Indian government services – with the complete checklist, fees and timelines, in your language.",
    searchPlaceholder: "Search a service (e.g. Aadhaar, PAN, Passport)",
    browseBtn: "Browse all services →",
    stat1_val: "100+",
    stat1_lbl: "Govt. services covered",
    stat2_val: "7",
    stat2_lbl: "Indian languages",
    stat3_val: "₹0",
    stat3_lbl: "Always free to check",
    catHeader: "BROWSE BY CATEGORY",
    catSub: "What do you need today?",
    popularHeader: "Popular Services",
    popularSub: "Most requested citizen documents with instant checksheets",
    whyHeader: "Built for every Indian",
    why1_title: "Plain-language checklists",
    why1_desc: "No jargon. Just the exact documents, in the order you need them.",
    why2_title: "Fees & timelines upfront",
    why2_desc: "Know what to pay and how long it takes before you start.",
    why3_title: "Multi-language",
    why3_desc: "Available in English, Hindi, Tamil, Bengali, Telugu, Marathi and Gujarati.",
    catalogTitle: "All Services",
    resetBtn: "Reset",
    allStates: "All India ▾",
    sortRelevance: "Relevance ▾",
    docsCount: "{count} docs Required",
    applyLink: "Apply ↗",
    centralGovt: "Central",
    stateGovt: "State",
  },
  hi: {
    heroPill: "हर सरकारी दस्तावेज़, अब हुआ आसान।",
    heroTitle: "जानिए आपको ठीक कौन से दस्तावेज़ चाहिए।",
    heroDesc: "आधार, पैन, पासपोर्ट, ड्राइविंग लाइसेंस, राशन कार्ड और 100+ भारतीय सरकारी सेवाओं के लिए आवेदन करें - अपनी भाषा में पूरी चेकलिस्ट, शुल्क और समय सीमा के साथ।",
    searchPlaceholder: "सेवा खोजें (मसलन आधार, पैन, पासपोर्ट, राशन कार्ड)",
    browseBtn: "सभी सेवाएं देखें →",
    stat1_val: "100+",
    stat1_lbl: "सरकारी सेवाएं शामिल",
    stat2_val: "7",
    stat2_lbl: "भारतीय भाषाएँ",
    stat3_val: "₹0",
    stat3_lbl: "चेक करना हमेशा मुफ़्त",
    catHeader: "श्रेणी अनुसार खोजें",
    catSub: "आज आपको किस चीज़ की आवश्यकता है?",
    popularHeader: "लोकप्रिय सेवाएं",
    popularSub: "नागरिकों द्वारा सबसे अधिक खोजी जाने वाली चेकलिस्ट और प्रमाण पत्र",
    whyHeader: "हर भारतीय के लिए निर्मित",
    why1_title: "सरल भाषा में चेकलिस्ट",
    why1_desc: "कोई जटिल तकनीकी शब्द नहीं। केवल वही दस्तावेज़, जिस क्रम में आपको उनकी आवश्यकता है।",
    why2_title: "फीस और समय सीमा स्पष्ट",
    why2_desc: "शुरू करने से पहले जानें कि कितना भुगतान करना है और कितना समय लगेगा।",
    why3_title: "बहुभाषी सहायता",
    why3_desc: "अंग्रेजी, हिंदी, तमिल, बंगाली, तेलुगु, मराठी और गुजराती में उपलब्ध है।",
    catalogTitle: "सभी सेवाएं",
    resetBtn: "रीसेट करें",
    allStates: "संपूर्ण भारत ▾",
    sortRelevance: "प्रासंगिकता ▾",
    docsCount: "{count} दस्तावेज़ आवश्यक",
    applyLink: "आवेदन करें ↗",
    centralGovt: "केंद्र",
    stateGovt: "राज्य",
  }
};

interface CategoryGroup {
  id: string;
  name: string;
  nameHi: string;
  icon: React.ComponentType<any>;
  description: string;
  descriptionHi: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "identity",
    name: "Identity & Civil Documents",
    nameHi: "पहचान और नागरिक दस्तावेज़",
    icon: UserCheck,
    description: "Aadhaar, Passport, Voter ID, Birth, Death, Marriage & Domicile certificates.",
    descriptionHi: "आधार, पासपोर्ट, वोटर आईडी, जन्म, मृत्यु, विवाह और मूल निवास प्रमाण पत्र।",
    color: "from-orange-500/10 to-orange-500/5 text-orange-850",
    borderColor: "border-orange-200/50",
    bgColor: "bg-orange-50/40"
  },
  {
    id: "health",
    name: "Health & Medical",
    nameHi: "स्वास्थ्य और चिकित्सा",
    icon: Heart,
    description: "ABHA Health Card, FSSAI Food Licenses, ESIC, Ayush and hospital services.",
    descriptionHi: "आभा हेल्थ कार्ड, FSSAI खाद्य लाइसेंस, ESIC, आयुष और अस्पताल सेवाएं।",
    color: "from-rose-500/10 to-rose-500/5 text-rose-850",
    borderColor: "border-rose-200/50",
    bgColor: "bg-rose-50/40"
  },
  {
    id: "agriculture",
    name: "Agriculture & Farming",
    nameHi: "कृषि एवं किसान कल्याण",
    icon: Sprout,
    description: "PM-Kisan subsidies, farmer welfare, APEDA exports and agricultural licenses.",
    descriptionHi: "पीएम-किसान सब्सिडी, किसान कल्याण, एपीडा निर्यात और कृषि संबंधी सेवाएं।",
    color: "from-emerald-500/10 to-emerald-500/5 text-emerald-850",
    borderColor: "border-emerald-200/50",
    bgColor: "bg-emerald-50/40"
  },
  {
    id: "finance",
    name: "Finance, Tax & Business",
    nameHi: "वित्त, कर एवं व्यवसाय",
    icon: Banknote,
    description: "PAN Card, Income & EWS Certificates, GST, MSME, Startup India and Taxes.",
    descriptionHi: "पैन कार्ड, आय व EWS प्रमाण पत्र, GST, MSME, स्टार्टअप और आयकर सेवाएं।",
    color: "from-amber-500/10 to-amber-500/5 text-amber-850",
    borderColor: "border-amber-200/50",
    bgColor: "bg-amber-50/40"
  },
  {
    id: "education",
    name: "Education & Scholarships",
    nameHi: "शिक्षा एवं छात्रवृत्ति",
    icon: GraduationCap,
    description: "National scholarships, CBSE marksheets, entrance exams and digital learning.",
    descriptionHi: "राष्ट्रीय छात्रवृत्ति, सीबीएसई अंकपत्र, प्रवेश परीक्षाएं और डिजिटल शिक्षा।",
    color: "from-purple-500/10 to-purple-500/5 text-purple-850",
    borderColor: "border-purple-200/50",
    bgColor: "bg-purple-50/40"
  },
  {
    id: "welfare",
    name: "Welfare & Social Schemes",
    nameHi: "कल्याण एवं सामाजिक योजनाएं",
    icon: ShieldCheck,
    description: "Ration Cards, Old-age & Widow pensions, PMAY housing, and citizen amenities.",
    descriptionHi: "राशन कार्ड, वृद्धावस्था व विधवा पेंशन, पीएम आवास योजना और नागरिक सुविधाएं।",
    color: "from-blue-500/10 to-blue-500/5 text-blue-850",
    borderColor: "border-blue-200/50",
    bgColor: "bg-blue-50/40"
  },
  {
    id: "land",
    name: "Land & Property Records",
    nameHi: "भूमि एवं संपत्ति रिकॉर्ड",
    icon: Landmark,
    description: "7/12 Land Records, Mutation, Encumbrance EC, Patta and Property approvals.",
    descriptionHi: "7/12 खसरा भू-अभिलेख, नामांतरण, भारमुक्त प्रमाण पत्र और संपत्ति मंजूरी।",
    color: "from-teal-500/10 to-teal-500/5 text-teal-850",
    borderColor: "border-teal-200/50",
    bgColor: "bg-teal-50/40"
  },
  {
    id: "labour",
    name: "Labour & Transport",
    nameHi: "श्रमिक, परिवहन एवं रोजगार",
    icon: Briefcase,
    description: "Driving Licences, e-Shram worker cards, EPFO UAN, vehicle permits and FASTag.",
    descriptionHi: "ड्राइविंग लाइसेंस, ई-श्रम कार्ड, ईपीएफओ यूएएन, वाहन परमिट और फास्टैग।",
    color: "from-indigo-500/10 to-indigo-500/5 text-indigo-850",
    borderColor: "border-indigo-200/50",
    bgColor: "bg-indigo-50/40"
  }
];

const getServiceGroup = (service: ESevaService): string => {
  const sid = service.id.toLowerCase();
  const title = service.title.toLowerCase();
  const desc = service.description.toLowerCase();
  const dept = service.department.toLowerCase();
  const text = `${sid} ${title} ${desc} ${dept}`;

  // 1. Agriculture
  if (
    sid.includes("kisan") ||
    sid.includes("agriculture") ||
    sid.includes("apeda") ||
    text.includes("agriculture") ||
    text.includes("farmer") ||
    text.includes("kisan") ||
    text.includes("crop") ||
    text.includes("cultivator")
  ) {
    return "agriculture";
  }

  // 2. Health
  if (
    service.category === "HEALTH" ||
    sid.includes("abha") ||
    sid.includes("fssai") ||
    sid.includes("esic") ||
    sid.includes("ayush") ||
    text.includes("health") ||
    text.includes("medical") ||
    text.includes("hospital") ||
    text.includes("doctor")
  ) {
    return "health";
  }

  // 3. Education
  if (
    service.category === "EDUCATION" ||
    sid.includes("scholarship") ||
    sid.includes("cbse") ||
    sid.includes("neet") ||
    sid.includes("ugc") ||
    sid.includes("nid") ||
    sid.includes("nielit") ||
    sid.includes("swayam") ||
    sid.includes("mhrd") ||
    text.includes("scholarship") ||
    text.includes("matric") ||
    text.includes("education") ||
    text.includes("school") ||
    text.includes("student") ||
    text.includes("exam")
  ) {
    return "education";
  }

  // 4. Identity
  if (
    service.category === "IDENTITY" ||
    sid.includes("aadhaar") ||
    sid.includes("passport") ||
    sid.includes("voter") ||
    sid.includes("domicile") ||
    sid.includes("birth") ||
    sid.includes("death") ||
    sid.includes("marriage") ||
    sid.includes("child") ||
    sid.includes("drone") ||
    sid.includes("digilocker") ||
    sid.includes("visa") ||
    text.includes("identity") ||
    text.includes("passport") ||
    text.includes("voter") ||
    text.includes("aadhaar")
  ) {
    return "identity";
  }

  // 5. Land & Property
  if (
    service.category === "LAND" ||
    sid.includes("land") ||
    sid.includes("mutation") ||
    sid.includes("encumbrance") ||
    sid.includes("building") ||
    text.includes("land record") ||
    text.includes("7/12") ||
    text.includes("khasra") ||
    text.includes("patta") ||
    text.includes("mutation") ||
    text.includes("encumbrance")
  ) {
    return "land";
  }

  // 6. Labour & Transport
  if (
    service.category === "LABOUR" ||
    sid.includes("rto") ||
    sid.includes("driving") ||
    sid.includes("shram") ||
    sid.includes("epfo") ||
    sid.includes("uan") ||
    sid.includes("vahan") ||
    sid.includes("fastag") ||
    sid.includes("transport") ||
    sid.includes("employment") ||
    sid.includes("bar-council") ||
    sid.includes("trade-licence") ||
    text.includes("driving licence") ||
    text.includes("driver") ||
    text.includes("labour") ||
    text.includes("worker")
  ) {
    return "labour";
  }

  // 7. Finance & Tax
  if (
    service.category === "FINANCE" ||
    sid.includes("pan") ||
    sid.includes("gst") ||
    sid.includes("msme") ||
    sid.includes("udyog") ||
    sid.includes("income") ||
    sid.includes("tax") ||
    sid.includes("ews") ||
    sid.includes("company") ||
    sid.includes("startup") ||
    sid.includes("savings") ||
    sid.includes("nps") ||
    sid.includes("gpf") ||
    text.includes("finance") ||
    text.includes("income tax")
  ) {
    return "finance";
  }

  // 8. Welfare
  return "welfare";
};

// Estimate reading time based on content length
const getReadingTime = (service: ESevaService) => {
  const content = [
    service.title,
    service.department,
    service.description,
    ...service.documentsRequired
  ].join(" ");
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  // Standard average reading speed is ~150-180 WPM, but since there are documents lists, let's round min to 1, dividing by 50 for realistic, variable estimation.
  return Math.max(1, Math.ceil(wordCount / 50));
};

const getServiceProTip = (service: ESevaService, language: "en" | "hi") => {
  const tips: Record<string, { en: string; hi: string }> = {
    "uidai-aadhaar": {
      en: "Book a morning slot online at an Aadhaar Seva Kendra to bypass walk-in crowds and long queues.",
      hi: "लंबी भीड़ और कतारों से बचने के लिए सरकारी आधार सेवा केंद्र पर सुबह का ऑनलाइन स्लॉट बुक करें।"
    },
    "nsdl-pan": {
      en: "Choose paperless e-KYC via Aadhaar OTP to receive your digital e-PAN card via email in 10 minutes.",
      hi: "मात्र 10 मिनट में ईमेल पर डिजिटल ई-पैन कार्ड प्राप्त करने के लिए आधार ओटीपी के माध्यम से पेपरलेस ई-केवाईसी चुनें।"
    },
    "mea-passport": {
      en: "Make sure local address proofs match Aadhaar spellings exactly to avoid police verification hold-ups.",
      hi: "पुलिस सत्यापन में देरी से बचने के लिए स्थानीय पते का प्रमाण पत्र और आधार की स्पेलिंग का मिलान सुनिश्चित करें।"
    },
    "rto-dl": {
      en: "Attempt online mock tests beforehand to clear the mandatory RTO computers test on your very first try.",
      hi: "प्रथम प्रयास में ही अनिवार्य आरटीओ कंप्यूटर टेस्ट पास करने के लिए पहले से ही ऑनलाइन मॉक टेस्ट का अभ्यास करें।"
    },
    "eci-voter": {
      en: "Submit a high-contrast front-facing photo on a light background to prevent manual inspection rejection.",
      hi: "मैन्युअल जांच में अस्वीकृति से बचने के लिए हल्के रंग की पृष्ठभूमि पर खींची गई उच्च-गुणवत्ता वाली फोटो जमा करें।"
    },
    "pds-ration": {
      en: "Link Aadhaar numbers of all family members to avoid monthly foodgrain distribution authentication issues.",
      hi: "मासिक खाद्यान्न वितरण प्रमाणीकरण समस्याओं से बचने के लिए परिवार के सभी सदस्यों के आधार नंबर लिंक करें।"
    },
    "mohfw-abha": {
      en: "Register using your Aadhaar-linked mobile for one-click activation without any manual paperwork.",
      hi: "बिना किसी कागजी कार्रवाई के एक-क्लिक सक्रियण के लिए अपने आधार से जुड़े मोबाइल का उपयोग करके पंजीकरण करें।"
    },
    "mole-eshram": {
      en: "Keep active Bank Account IFSC codes ready to prevent Direct Benefit Transfer (DBT) subsidy failures.",
      hi: "डायरेक्ट बेनिफिट ट्रांसफर (डीबीटी) सब्सिडी विफलताओं से बचने के लिए सक्रिय बैंक खाता और आईएफएससी कोड तैयार रखें।"
    },
    "revenue-income": {
      en: "Prepare a local municipal or Tehsildar self-declaration form to accelerate processing.",
      hi: "प्रसंस्करण में तेजी लाने के लिए स्थानीय नगर पालिका या तहसीलदार का स्व-घोषणा पत्र पहले से तैयार रखें।"
    },
    "agriculture-pmkisan": {
      en: "Verify that the name in land revenue records matches Aadhaar spelling exactly before submission.",
      hi: "जमा करने से पहले सत्यापित करें कि भूमि रिकॉर्ड में नाम और आधार की स्पेलिंग पूरी तरह मेल खाती है।"
    }
  };

  if (tips[service.id]) {
    return tips[service.id][language];
  }

  // Category fallback tips if specific service ID is not mapped
  const categoryTips: Record<string, { en: string; hi: string }> = {
    IDENTITY: {
      en: "Keep clear scans of original documents ready; self-attest them to prevent regional rejection.",
      hi: "दस्तावेजों के स्पष्ट स्कैन तैयार रखें; क्षेत्रीय अस्वीकृति से बचने के लिए उन्हें स्व-सत्यापित करें।"
    },
    FINANCE: {
      en: "Use Aadhaar OTP and DigiLocker logins to reduce verification wait times by up to 5 working days.",
      hi: "सत्यापन की प्रतीक्षा अवधि को 5 कार्य दिवसों तक कम करने के लिए आधार ओटीपी और डिजिलॉकर लॉगिन का उपयोग करें।"
    },
    HEALTH: {
      en: "Choose digital-only generation to immediately download and carry verified healthcare IDs.",
      hi: "सत्यापित स्वास्थ्य पहचान पत्र को तुरंत डाउनलोड करने और उपयोग करने के लिए डिजिटल-ओनली मॉडल चुनें।"
    },
    LABOUR: {
      en: "Register using active personal numbers to receive automated SMS updates on welfare eligibility approvals.",
      hi: "पात्रता एवं सरकारी मंजूरी पर स्वचालित एसएमएस अपडेट प्राप्त करने के लिए सक्रिय व्यक्तिगत नंबर से पंजीकरण करें।"
    },
    LAND: {
      en: "Retrieve digital RoR copies first; they speed up stamp-duty and local authority registry approvals.",
      hi: "डिजिटल आरओआर (जमाबंदी) प्रतियां पहले प्राप्त करें; ये स्थानीय प्राधिकरण मंजूरी को तेज करती हैं।"
    },
    WELFARE: {
      en: "Ensure your bank account has active DBT (Direct Benefit Transfer) mapping to receive quick grants.",
      hi: "शीघ्र सरकारी अनुदान राशि प्राप्त करने के लिए सुनिश्चित करें कि आपका बैंक खाता सक्रिय डीबीटी से मैप है।"
    }
  };

  return categoryTips[service.category]?.[language] || (language === "hi" 
    ? "प्रक्रिया को तेज करने के लिए सभी दस्तावेजों के मूल मूल स्कैन और स्व-सत्यापित प्रतियां तैयार रखें।" 
    : "Keep pristine scans of original documents and self-attested copies ready to fast-track verification.");
};

export default function ESevaServiceList({ 
  services, 
  onApplyClick, 
  searchQuery: propsSearchQuery, 
  setSearchQuery: propsSetSearchQuery,
  onFeedbackClick,
  onDonateClick,
  onReportIssueClick,
  savedServiceIds: propsSavedServiceIds,
  onToggleSave: propsOnToggleSave
}: ESevaServiceListProps) {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [copiedServiceId, setCopiedServiceId] = useState<string | null>(null);
  const [toggledTranslates, setToggledTranslates] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<"RELEVANCE" | "ALPHABETICAL" | "NEWEST" | "POPULARITY">("RELEVANCE");

  const [popularityScores, setPopularityScores] = useState<Record<string, number>>(() => {
    const baseScores: Record<string, number> = {
      "uidai-aadhaar": 2452,
      "nsdl-pan": 1982,
      "mea-passport": 1745,
      "rto-dl": 1624,
      "eci-voter": 1281,
      "pds-ration": 1153,
      "mohfw-abha": 925,
      "mole-eshram": 842,
      "revenue-income": 712,
      "agriculture-pmkisan": 681,
    };

    // Preseed other services with custom scores based on their ID character codes
    services.forEach(s => {
      if (!baseScores[s.id]) {
        let code = 0;
        for (let i = 0; i < s.id.length; i++) {
          code += s.id.charCodeAt(i);
        }
        baseScores[s.id] = 120 + (code % 380);
      }
    });

    try {
      const stored = localStorage.getItem("sewanadu_popularity_registry");
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.keys(parsed).forEach(k => {
          baseScores[k] = (baseScores[k] || 0) + parsed[k];
        });
      }
    } catch (e) {
      console.error(e);
    }

    return baseScores;
  });

  const incrementPopularity = (serviceId: string) => {
    setPopularityScores(prev => {
      const current = prev[serviceId] || 0;
      const updated = { ...prev, [serviceId]: current + 5 }; // increment score by 5 per interaction to make user action noticeable
      try {
        const stored = localStorage.getItem("sewanadu_popularity_registry");
        const parsed = stored ? JSON.parse(stored) : {};
        parsed[serviceId] = (parsed[serviceId] || 0) + 5;
        localStorage.setItem("sewanadu_popularity_registry", JSON.stringify(parsed));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const handleOpenWorkflow = (service: ESevaService, e: React.MouseEvent) => {
    e.stopPropagation();
    incrementPopularity(service.id);
    setSelectedWorkflowService(service);
  };

  const handleOpenQuickApply = (service: ESevaService, e: React.MouseEvent) => {
    e.stopPropagation();
    incrementPopularity(service.id);
    setSelectedQuickApplyService(service);
    setQuickApplyStep(0);
  };

  const handleApplyClick = (service: ESevaService) => {
    incrementPopularity(service.id);
    onApplyClick(service);
  };

  // Quick Apply types & states
  interface TutorialStep {
    id: number;
    titleEn: string;
    titleHi: string;
    descriptionEn: string;
    descriptionHi: string;
    checklistLabelEn: string;
    checklistLabelHi: string;
    checklistEn: string[];
    checklistHi: string[];
    proTipEn: string;
    proTipHi: string;
    visualActionEn: string;
    visualActionHi: string;
  }

  const [selectedQuickApplyService, setSelectedQuickApplyService] = useState<ESevaService | null>(null);
  const [quickApplyStep, setQuickApplyStep] = useState<number>(0);
  const [completedTutorials, setCompletedTutorials] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("eseva_completed_tutorials");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("eseva_completed_tutorials", JSON.stringify(completedTutorials));
    } catch (err) {
      console.error(err);
    }
  }, [completedTutorials]);

  const handleMarkTutorialComplete = (serviceId: string) => {
    setCompletedTutorials(prev => ({
      ...prev,
      [serviceId]: true
    }));
  };

  const getServiceTutorial = (service: ESevaService): TutorialStep[] => {
    const titleLower = service.title.toLowerCase();

    if (titleLower.includes("aadhaar") || service.id.includes("aadhaar")) {
      return [
        {
          id: 1,
          titleEn: "Perform Pre-Enrolment",
          titleHi: "प्री-एनरोलमेंट फॉर्म भरें",
          descriptionEn: "Head to the UIDAI website to fill out the pre-enrolment form. This reserves your data, saving valuable time at the offline center.",
          descriptionHi: "यूआईडीएआई की वेबसाइट पर जाएं और प्री-एनरोलमेंट फॉर्म भरें। इससे आपका डेटा सिंक हो जाता है और ऑफलाइन केंद्र पर समय बचता है।",
          checklistLabelEn: "Verify you have these in hand:",
          checklistLabelHi: "जांचें कि आपके पास ये दस्तावेज हैं:",
          checklistEn: ["Active Mobile number linked with any ID", "Proof of Identity (POI) - e.g. Voter ID, PAN", "Proof of Address (POA) - e.g. Ration Card, Electricity bill"],
          checklistHi: ["सक्रिय मोबाइल नंबर", "पहचान पत्र (POI) - जैसे वोटर आईडी, पैन कार्ड", "पते का प्रमाण (POA) - जैसे राशन कार्ड, बिजली बिल"],
          proTipEn: "Double check that the spellings on your POI match your address proof exactly.",
          proTipHi: "सुनिश्चित करें कि आपके पहचान पत्र पर स्पेलिंग आपके पते के प्रमाण से बिल्कुल मेल खाती हो।",
          visualActionEn: "Fill online precheck form & select documents",
          visualActionHi: "ऑनलाइन प्री-चेक फॉर्म भरें और दस्तावेज़ चुनें"
        },
        {
          id: 2,
          titleEn: "Book Appointment Token",
          titleHi: "अपॉइंटमेंट टोकन बुक करें",
          descriptionEn: "Choose your nearest 'Aadhaar Seva Kendra' (ASK) and select a convenient 15-minute slot. Download the generated appointment slip with QR code.",
          descriptionHi: "अपने नजदीकी 'आधार सेवा केंद्र' (ASK) का चयन करें और अपनी सुविधा के अनुसार 15 मिनट का स्लॉट बुक करें। QR कोड वाली रसीद डाउनलोड करें।",
          checklistLabelEn: "Appointment preparation checklist:",
          checklistLabelHi: "अपॉइंटमेंट की तैयारी चेकलिस्ट:",
          checklistEn: ["Download and print Appointment Slip", "Keep original documents ready (copies are not accepted for physical verification)", "Plan to arrive 15 minutes prior to slot"],
          checklistHi: ["अपॉइंटमेंट पर्ची डाउनलोड और प्रिंट करें", "मूल दस्तावेज तैयार रखें (सत्यापन के लिए फोटोकॉपी मान्य नहीं है)", "निर्धारित समय से 15 मिनट पहले पहुंचें"],
          proTipEn: "Booking an early morning slot usually has minimal waiting queue times.",
          proTipHi: "सुबह का स्लॉट बुक करने से आमतौर पर केंद्र पर सबसे कम भीड़ मिलती है।",
          visualActionEn: "Locate ASK center & generate barcode slip",
          visualActionHi: "ASK केंद्र ढूंढें और बारकोड पर्ची जनरेट करें"
        },
        {
          id: 3,
          titleEn: "Physical Biometric Collection",
          titleHi: "बायोमेट्रिक डेटा संग्रह",
          descriptionEn: "Visit the Aadhaar center. At your designated counter, the executive will capture your fingerprints, iris scans, and a fresh headshot picture.",
          descriptionHi: "आधार केंद्र पर जाएं। निर्दिष्ट काउंटर पर, कर्मचारी आपके उंगलियों के निशान, आंखों की पुतली का स्कैन और एक नया फोटो लेंगे।",
          checklistLabelEn: "At the kiosk, make sure to:",
          checklistLabelHi: "सत्यापन खिड़की पर इन बातों का ध्यान रखें:",
          checklistEn: ["Review the spellings on the operator's display screen prior to approval", "Ensure iris camera is at eye level", "Pay the official ₹50 charge (if updating details)"],
          checklistHi: ["सबमिट करने से पहले ऑपरेटर की स्क्रीन पर स्पेलिंग जरूर जांचें", "सुनिश्चित करें कि आइरिस कैमरा आंखों के स्तर पर हो", "यदि विवरण अपडेट कर रहे हैं तो ₹50 शुल्क का भुगतान करें"],
          proTipEn: "Always ask for a physical printed acknowledgment sheet before leaving the desk.",
          proTipHi: "डेस्क छोड़ने से पहले भौतिक रूप से मुद्रित पावती पर्ची ज़रूर मांगें।",
          visualActionEn: "Fingerprint scanner & Iris matching",
          visualActionHi: "फिंगरप्रिंट स्कैनर और आइरिस सत्यापन"
        },
        {
          id: 4,
          titleEn: "Download Secure e-Aadhaar",
          titleHi: "सुरक्षित ई-आधार डाउनलोड करें",
          descriptionEn: "Once approved, a secure digital PDF copy of your card (e-Aadhaar) can be downloaded via OTP. Your physical card will be dispatched via India Post.",
          descriptionHi: "मंजूरी मिलने के बाद, आपके कार्ड की एक सुरक्षित डिजिटल पीडीएफ कॉपी (ई-आधार) ओटीपी के जरिए डाउनलोड की जा सकती है। मूल कार्ड डाक से भेजा जाएगा।",
          checklistLabelEn: "To open your downloaded PDF:",
          checklistLabelHi: "डाउनलोड की गई पीडीएफ को खोलने के लिए:",
          checklistEn: ["Password format: First 4 letters of your name in CAPITALS + Year of Birth (e.g., ANIK1995)", "Verify digital signature validity in Adobe PDF Reader (it should show a green check mark)"],
          checklistHi: ["पासवर्ड का प्रारूप: आपके नाम के पहले 4 अक्षर कैपिटल में + जन्म का वर्ष (जैसे, ANIK1995)", "एडोब पीडीएफ रीडर में डिजिटल हस्ताक्षर की वैधता जांचें (यह हरा टिक मार्क दिखाना चाहिए)"],
          proTipEn: "e-Aadhaar is legally equal to a physical card in all government services.",
          proTipHi: "ई-आधार सभी सरकारी सेवाओं में भौतिक कार्ड के बिल्कुल बराबर कानूनी रूप से मान्य है।",
          visualActionEn: "DigiLocker / e-Aadhaar PDF ready",
          visualActionHi: "डिजिलॉकर / ई-आधार पीडीएफ तैयार"
        }
      ];
    }

    if (titleLower.includes("pan") || service.id.includes("pan") || titleLower.includes("permanent account")) {
      return [
        {
          id: 1,
          titleEn: "Fill Application Form 49A",
          titleHi: "आवेदन पत्र फॉर्म 49A भरें",
          descriptionEn: "Access NSDL (Protean) or UTIITSL website. Select Form 49A as an 'Indian Citizen', and 'Individual' as candidate category.",
          descriptionHi: "NSDL (प्रोटियन) या UTIITSL वेबसाइट पर जाएं। 'भारतीय नागरिक' के रूप में फॉर्म 49A और श्रेणी के रूप में 'व्यक्तिगत' चुनें।",
          checklistLabelEn: "Form 49A inputs checklist:",
          checklistLabelHi: "फॉर्म 49A भरने के लिए जरूरी बातें:",
          checklistEn: ["Aadhaar number (linked with active mobile)", "Exact full name & initials", "Correct Date of Birth matching Aadhaar"],
          checklistHi: ["आधार नंबर (सक्रिय मोबाइल नंबर से जुड़ा हुआ)", "सटीक पूरा नाम और उपनाम (सरनेम)", "आधार के समान जन्मतिथि"],
          proTipEn: "Select both 'Physical PAN Card and e-PAN' option to receive the PVC card by mail.",
          proTipHi: "डाक द्वारा प्लास्टिक कार्ड प्राप्त करने के लिए 'भौतिक पैन कार्ड और ई-पैन' दोनों का विकल्प चुनें।",
          visualActionEn: "Select Form 49A & enter Individual details",
          visualActionHi: "फॉर्म 49A चुनें और व्यक्तिगत विवरण दर्ज करें"
        },
        {
          id: 2,
          titleEn: "Complete e-KYC Verification",
          titleHi: "ई-केवाईसी सत्यापन पूरा करें",
          descriptionEn: "Opt for 'Paperless e-KYC and e-Sign'. This reads your details directly from Aadhaar via secure OTP authentication, saving you from posting physical papers.",
          descriptionHi: "'पेपरलेस ई-केवाईसी और ई-साइन' का विकल्प चुनें। यह सुरक्षित ओटीपी ऑथेंटिकेशन के माध्यम से आधार से आपका विवरण पढ़ेगा, जिससे दस्तावेज पोस्ट करने की आवश्यकता नहीं होगी।",
          checklistLabelEn: "Aadhaar e-KYC steps:",
          checklistLabelHi: "आधार ई-केवाईसी चरण:",
          checklistEn: ["Wait for UIDAI SMS token", "Enter the 6-digit OTP code in the input modal", "Agree to share Aadhaar demographic photo"],
          checklistHi: ["UIDAI एसएमएस टोकन की प्रतीक्षा करें", "इनपुट बॉक्स में 6-अंकों का ओटीपी कोड दर्ज करें", "आधार फोटोग्राफ साझा करने के लिए सहमति दें"],
          proTipEn: "If the OTP isn't received in 60 seconds, check if your phone storage is full or tap 'Resend OTP'.",
          proTipHi: "यदि 60 सेकंड में ओटीपी प्राप्त नहीं होता है, तो जांचें कि आपके फोन में नेटवर्क है या 'ओटीपी पुनः भेजें' दबाएं।",
          visualActionEn: "Aadhaar OTP secure authorization window",
          visualActionHi: "आधार ओटीपी सुरक्षित ऑथेंटिकेशन विंडो"
        },
        {
          id: 3,
          titleEn: "Online Processing Fee",
          titleHi: "ऑनलाइन प्रोसेसिंग शुल्क",
          descriptionEn: "Pay the prescribed application fee to complete NSDL dispatch queue mapping.",
          descriptionHi: "NSDL प्रेषण कतार को एक्टिवेट करने के लिए निर्धारित आवेदन शुल्क का भुगतान करें।",
          checklistLabelEn: "Payment options & details:",
          checklistLabelHi: "भुगतान क्रेडेंशियल और शुल्क जानकारी:",
          checklistEn: ["Official Fee: ₹107 (including GST)", "UPI, Debit Card, or Net Banking are instant", "Note down the Payment Transaction Reference Number"],
          checklistHi: ["आधिकारिक शुल्क: ₹107 (जीएसटी सहित)", "यूपीआई या डेबिट कार्ड से तुरंत भुगतान होता है", "भुगतान का ट्रांजैक्शन रेफरेंस नंबर नोट कर लें"],
          proTipEn: "Upon successful receipt, you will earn a 15-digit Acknowledgement Number instantly.",
          proTipHi: "सफल भुगतान पर, आपको तुरंत 15 अंकों का पावती संख्या (Acknowledgement Number) प्राप्त होगी।",
          visualActionEn: "Payment Gateway integration & receipt generation",
          visualActionHi: "पेमेंट गेटवे और रसीद जनरेशन"
        },
        {
          id: 4,
          titleEn: "Instant e-PAN Download",
          titleHi: "ई-पैन तुरंत डाउनलोड करें",
          descriptionEn: "Use your 15-digit acknowledgement number to fetch the newly generated e-PAN card PDF within 24 to 48 hours.",
          descriptionHi: "24 से 48 घंटों के भीतर नए जेनरेट किए गए ई-पैन कार्ड की पीडीएफ प्राप्त करने के लिए अपने 15 अंकों के पावती नंबर का उपयोग करें।",
          checklistLabelEn: "Post-approval access checklist:",
          checklistLabelHi: "स्वीकृति के बाद डाउनलोड चरण:",
          checklistEn: ["Check register email inbox for the encrypted PDF", "Download password is your full Date of Birth in DDMMYYYY format", "Verify card on Income Tax e-filing portal"],
          checklistHi: ["पंजीकृत ईमेल इनबॉक्स में पासवर्ड-सुरक्षित पीडीएफ देखें", "खोलने का पासवर्ड 'DDMMYYYY' प्रारूप में आपकी जन्मतिथि है", "आयकर ई-फाइलिंग पोर्टल पर पैन की पुष्टि करें"],
          proTipEn: "Digitally signed e-PAN is universally acceptable for opening bank accounts or filing taxes.",
          proTipHi: "डिजिटली हस्ताक्षरित ई-पैन बैंक खाता खोलने या टैक्स फाइल करने के लिए पूरी तरह मान्य है।",
          visualActionEn: "e-PAN PDF secure wallet download",
          visualActionHi: "ई-पैन पीडीएफ सुरक्षित वॉलेट डाउनलोड"
        }
      ];
    }

    if (titleLower.includes("passport") || service.id.includes("passport")) {
      return [
        {
          id: 1,
          titleEn: "Registration & Application Filing",
          titleHi: "पंजीकरण और आवेदन पत्र भरना",
          descriptionEn: "Register on the Passport Seva official portal. Log in, click 'Apply for Fresh/Reissue Passport' and fill out the detailed form.",
          descriptionHi: "पासपोर्ट सेवा के आधिकारिक पोर्टल पर पंजीकरण करें। लॉग इन करें, 'Apply for Fresh/Reissue Passport' पर क्लिक करें और फॉर्म भरें।",
          checklistLabelEn: "Form fields verification checklist:",
          checklistLabelHi: "फॉर्म के विवरण की जांच:",
          checklistEn: ["Enter exact full names (no initials like A.K. Prasad - write complete words)", "Mention two local emergency contact references", "Correct dual parent/spouse identification spellings"],
          checklistHi: ["सटीक पूरा नाम लिखें (जैसे A.K. Prasad के स्थान पर Anish Kumar Prasad)", "दो स्थानीय आपातकालीन संपर्क संदर्भ दर्ज करें", "माता-पिता और जीवनसाथी के नामों की सही स्पेलिंग भरें"],
          proTipEn: "Double check your past 1 year of residential addresses to avoid police verification delays.",
          proTipHi: "पुलिस सत्यापन में देरी से बचने के लिए पिछले 1 वर्ष के अपने सभी पतों को सही-सही भरें।",
          visualActionEn: "Form 1: Personal, Family & Address details",
          visualActionHi: "फॉर्म 1: व्यक्तिगत, पारिवारिक और पते के विवरण"
        },
        {
          id: 2,
          titleEn: "Fee Payment & Slot Booking",
          titleHi: "शुल्क भुगतान और स्लॉट बुकिंग",
          descriptionEn: "Complete online fee payment of ₹1,500 (Normal category 36 pages) to enable slot calendar booking.",
          descriptionHi: "स्लॉट बुकिंग शुरू करने के लिए ₹1,500 (नॉर्मल कैटेगरी, 36 पेज) के ऑनलाइन शुल्क का भुगतान करें।",
          checklistLabelEn: "Appointment booking checklist:",
          checklistLabelHi: "अपॉइंटमेंट बुकिंग चेकलिस्ट:",
          checklistEn: ["Pay securely online (UPI / Credit Card / SBI Chalan)", "Select closest Passport Seva Kendra (PSK) or Post Office PSK", "Pick date & print green confirmation sheet"],
          checklistHi: ["यूपीआई या क्रेडिट कार्ड द्वारा ऑनलाइन सुरक्षित भुगतान करें", "अपने नजदीकी पासपोर्ट सेवा केंद्र (PSK) या डाकघर केंद्र (POPSK) को चुनें", "तारीख का चयन करें और हरे रंग की अपॉइंटमेंट रसीद प्रिंट करें"],
          proTipEn: "Rescheduling is limited to 3 times per application, so choose your appointment date wisely.",
          proTipHi: "एक आवेदन पर आप केवल 3 बार अपॉइंटमेंट रीशेड्यूल कर सकते हैं, इसलिए सावधानी से तारीख चुनें।",
          visualActionEn: "Pay ₹1500 & book convenient calendar slot",
          visualActionHi: "₹1500 भुगतान करें और कैलेंडर स्लॉट बुक करें"
        },
        {
          id: 3,
          titleEn: "Visit the Seva Kendra (PSK)",
          titleHi: "पासपोर्ट केंद्र (PSK) का दौरा",
          descriptionEn: "Attend your physical slot at the PSK. Your application will iterate through three internal processing desks: Counter A, B, and C.",
          descriptionHi: "निर्धारित समय पर पासपोर्ट केंद्र पहुंचें। आपका आवेदन तीन आंतरिक डेस्क (काउंटर A, B और C) से होकर गुजरेगा।",
          checklistLabelEn: "Carry originals inside a safe folder:",
          checklistLabelHi: "एक सुरक्षित फ़ोल्डर में मूल दस्तावेज़ साथ ले जाएँ:",
          checklistEn: ["Appointment Confirmation Slip printout", "Aadhaar Card as Address & Identity proof", "10th Class Passing Certificate (for Non-ECR status check)"],
          checklistHi: ["अपॉइंटमेंट रसीद का प्रिंटआउट", "पता और पहचान पत्र के रूप में आधार कार्ड", "10वीं कक्षा का मूल प्रमाण पत्र (Non-ECR श्रेणी के सत्यापन हेतु)"],
          proTipEn: "Do not carry laptops, pendrives, or bulky luggage inside; they are strictly prohibited in the security cabin.",
          proTipHi: "सुरक्षा कारणों से केंद्र के भीतर लैपटॉप, पेनड्राइव या भारी सामान ले जाना वर्जित है।",
          visualActionEn: "Counters A, B & C document audit",
          visualActionHi: "काउंटर A, B और C पर मूल दस्तावेजों का मिलान"
        },
        {
          id: 4,
          titleEn: "Track Police Verification",
          titleHi: "पुलिस सत्यापन की निगरानी करें",
          descriptionEn: "Your application is sent back to your local Police Station. An officer will contact you to physically verify your address.",
          descriptionHi: "आपका आवेदन सत्यापन के लिए आपके स्थानीय पुलिस स्टेशन भेजा जाता है। एक पुलिस अधिकारी आपसे पते के सत्यापन के लिए संपर्क करेगा।",
          checklistLabelEn: "Police verification preparation:",
          checklistLabelHi: "पुलिस सत्यापन की तैयारी में रखें ये तैयार:",
          checklistEn: ["Original Aadhaar Card and 2 photography passport size", "Two reputable neighbors with their Aadhaar cards to sign as witnesses", "Original Electricity or Water bill copy"],
          checklistHi: ["मूल आधार कार्ड और 2 पासपोर्ट साइज फोटो", "सत्यापन गवाह के तौर पर हस्ताक्षर करने के लिए आधार कार्ड के साथ दो पड़ोसी", "मूल बिजली या हालिया पानी का बिल"],
          proTipEn: "You will receive an automated SMS once the police submit a positive status return to the RTO.",
          proTipHi: "जैसे ही police सकारात्मक रिपोर्ट कार्यालय भेजेगी, आपको स्वचालित रूप से एसएमएस प्राप्त हो जाएगा।",
          visualActionEn: "Local station coordination & verification log",
          visualActionHi: "स्थानीय पुलिस स्टेशन समन्वय और सत्यापन"
        }
      ];
    }

    if (titleLower.includes("license") || titleLower.includes("licence") || titleLower.includes("driving")) {
      return [
        {
          id: 1,
          titleEn: "Apply for Learner's Licence",
          titleHi: "लर्नर लाइसेंस के लिए आवेदन करें",
          descriptionEn: "Open Sarathi Parivahan portal, select your State, and submit Learner's Licence application details.",
          descriptionHi: "सारथी परिवहन पोर्टल खोलें, अपना राज्य चुनें, और लर्नर लाइसेंस आवेदन के लिए विवरण जमा करें।",
          checklistLabelEn: "Mandatory LL details:",
          checklistLabelHi: "लर्नर लाइसेंस हेतु दस्तावेज:",
          checklistEn: ["Aadhaar number", "Age limit proof documents (18+ for MCW / LMV)", "Self-Declaration Medical Form 1 (fill online)"],
          checklistHi: ["आधार नंबर", "आयु सत्यापन दस्तावेज (पक्का करें कि आपकी आयु 18+ हो)", "स्व-घोषणा चिकित्सा फॉर्म 1 (ऑनलाइन भरना होगा)"],
          proTipEn: "Many states now support fully online contactless Learner tests using Aadhaar biometric OTP validation.",
          proTipHi: "कई राज्य अब आधार ऑथेंटिकेशन के माध्यम से पूरी तरह से ऑनलाइन घर बैठे लर्नर टेस्ट का समर्थन करते हैं।",
          visualActionEn: "Form submission & Medical Self-Declaration F1",
          visualActionHi: "विंडो पर फॉर्म सबमिशन और मेडिकल घोषणा फॉर्म 1"
        },
        {
          id: 2,
          titleEn: "Pass online Signal Test",
          titleHi: "ऑनलाइन ट्रैफिक संकेत टेस्ट पास करें",
          descriptionEn: "Attempt the online road signs, safety rules, and driver protocol test to get your Learner's licence instantly.",
          descriptionHi: "लर्नर लाइसेंस प्राप्त करने के लिए यातायात संकेतों, सुरक्षा नियमों और चालक प्रोटोकॉल की संक्षिप्त ऑनलाइन परीक्षा पास करें।",
          checklistLabelEn: "Preparation tips for sign test:",
          checklistLabelHi: "ऑनलाइन संकेत परीक्षा की तैयारी:",
          checklistEn: ["Study the PDF guide on traffic symbols on Sarathi website", "Pass rate is typically 60% or higher", "You get immediate score results"],
          checklistHi: ["सारथी वेबसाइट से यातायात चिन्हों की पीडीएफ गाइड डाउनलोड कर अध्ययन करें", "उत्तीर्ण होने के लिए न्यूनतम 60% अंक आवश्यक हैं", "परीक्षा परिणाम तुरंत स्क्रीन पर दिखाई देता है"],
          proTipEn: "Learner's Licence is valid for exactly 6 months. You can apply for a Permanent Licence after 30 days.",
          proTipHi: "लर्नर लाइसेंस जारी होने की तारीख से ठीक 6 महीने तक मान्य रहता है। आप केवल 30 दिनों के बाद स्थायी लाइसेंस के लिए आवेदन कर सकते हैं।",
          visualActionEn: "15 Traffic questions timed online test",
          visualActionHi: "यातायात सुरक्षा नियमों की 15 प्रश्नों की ऑनलाइन परीक्षा"
        },
        {
          id: 3,
          titleEn: "RTO Driving Track Test",
          titleHi: "आरटीओ ड्राइविंग ट्रैक टेस्ट",
          descriptionEn: "Book your Permanent DL slot on Sarathi, pay the fees, and bring your own functional vehicle to your local RTO test track.",
          descriptionHi: "सारथी पोर्टल पर स्थायी ड्राइविंग लाइसेंस का स्लॉट बुक करें, शुल्क भरें और परीक्षण के लिए स्वयं का वैध वाहन लेकर आरटीओ ट्रैक पर पहुंचें।",
          checklistLabelEn: "Driving test evaluation patterns:",
          checklistLabelHi: "ट्रैक परीक्षण पैरामीटर:",
          checklistEn: ["LMV: Navigate Figure-8, parallel parking, and reverse S-curves without touching poles", "Two-Wheeler: Ride slow, maintain balance on narrow track, and signal properly with indicators"],
          checklistHi: ["चार पहिया: खंभों को छुए बिना 'Z' या '8' आकृति ट्रैक पर रिवर्स करें", "दोपहिया: धीमी गति से चलें, संकीर्ण ज़िग-ज़ैग ट्रैक पर संतुलन रखें और इंडिकेटर्स चालू करें"],
          proTipEn: "The officer will fail you instantly if you stall the engine or put your feet down on the track, so practice thoroughly.",
          proTipHi: "यदि आपका वाहन बीच में बंद हो जाता है या पैर जमीन पर छू जाते हैं, तो निरीक्षक तुरंत फेल कर सकते हैं; इसलिए पहले अभ्यास करें।",
          visualActionEn: "Figure-8 test track navigate layout",
          visualActionHi: "'8' आकृति टेस्ट ट्रैक पर ड्राइविंग"
        },
        {
          id: 4,
          titleEn: "Smart Card Issue & Post Delivery",
          titleHi: "स्मार्ट कार्ड जारी और गृह वितरण",
          descriptionEn: "Once approved by the inspector, your DL number is generated. A smart PVC chip card is manufactured and mailed via India Post.",
          descriptionHi: "परीक्षण उत्तीर्ण करने के बाद, आपका डीएल नंबर स्वीकृत होकर जारी हो जाता है। स्मार्ट चिप-युक्त ड्राइविंग लाइसेंस स्पीड पोस्ट से डिलीवर होगा।",
          checklistLabelEn: "Post-approval access checklist:",
          checklistLabelHi: "स्वीकृति के बाद आवश्यक निगरानी:",
          checklistEn: ["Register license copy in DigiLocker or mParivahan app", "Keep online PDF copy on phone for immediate access", "Verify address is up-to-date in system database"],
          checklistHi: ["डिजिलॉकर या एम-परिवहन ऐप पर डिजिटल सुरक्षित कॉपी सहेजें", "तुरंत मोबाइल पर उपयोग के लिए पीडीएफ डाउनलोड कर लें", "पक्का करें कि सरकारी रजिस्टर में पता सही सुधारा गया है"],
          proTipEn: "A digital driving licence in DigiLocker or mParivahan is fully valid under the IT Act.",
          proTipHi: "डिजिलॉकर में सहेजा गया ड्राइविंग लाइसेंस कानूनन भौतिक लाइसेंस के समान पूरी तरह मान्य है।",
          visualActionEn: "mParivahan app / DigiLocker secure integration",
          visualActionHi: "एम-परिवहन ऐप / डिजिलॉकर एकीकरण"
        }
      ];
    }

    if (titleLower.includes("ration") || service.id.includes("ration")) {
      return [
        {
          id: 1,
          titleEn: "Determine Card Category",
          titleHi: "राशन कार्ड श्रेणी चुनें",
          descriptionEn: "Verify database guidelines to select correct poverty categorization (AAY, BPL, PHH) depending on family income limits.",
          descriptionHi: "पारिवारिक वार्षिक आय के आधार पर सही कार्ड श्रेणी (अंत्योदय योजना, गरीबी रेखा से नीचे - BPL, या प्राथमिकता परिवार - PHH) का चयन करें।",
          checklistLabelEn: "Checklist of documents and parameters:",
          checklistLabelHi: "आवश्यक कागजात:",
          checklistEn: ["Aadhaar cards of ALL family members link active", "Current collective passport family group photograph", "Annual income salary certificate"],
          checklistHi: ["परिवार के सभी सदस्यों के आधार कार्ड", "पूरे परिवार की पारिवारिक समूह तस्वीर", "तहसीलदार द्वारा प्रमाणित वार्षिक आय प्रमाण पत्र"],
          proTipEn: "The eldest female member of the family is legally registered as the 'Head of Household'.",
          proTipHi: "कानूनन परिवार की सबसे बड़ी महिला सदस्य को 'गृहस्वामी' (मुखिया) के रूप में पंजीकृत किया जाना आवश्यक है।",
          visualActionEn: "Categorize household income limits",
          visualActionHi: "परिवार की आय सीमा और श्रेणी का चयन"
        },
        {
          id: 2,
          titleEn: "Online State Portal upload",
          titleHi: "ऑनलाइन राज्य पोर्टल पर अपलोड",
          descriptionEn: "Log in to your state's Food and Civil Supplies portal. Complete the comprehensive application and upload scanned papers.",
          descriptionHi: "अपने राज्य के खाद्य और नागरिक आपूर्ति विभाग के पोर्टल पर जाएं। संबंधित फॉर्म भरें और दस्तावेजों की पीडीएफ कॉपी अपलोड करें।",
          checklistLabelEn: "Online portal verification:",
          checklistLabelHi: "पोर्टल पर ध्यान रखने योग्य बातें:",
          checklistEn: ["Verify bank details for LPG gas subsidy tie", "Map Aadhaar number to avoid double-allocation errors", "Download generated transaction draft"],
          checklistHi: ["एलपीजी गैस सब्सिडी के लिए बैंक खाता सही भरें", "दोहरे आवंटन की त्रुटियों से बचने के लिए आधार नंबर लिंक करें", "सबमिट कर फाइनल ट्रांजैक्शन रिपोर्ट डाउनलोड करें"],
          proTipEn: "Take a clear screenshot of the acknowledgement screen with the registration serial ID.",
          proTipHi: "रजिस्ट्रेशन आईडी के नंबर वाली रसीद का स्क्रीनशॉट या फोटो जरूर सहेजें।",
          visualActionEn: "Upload family details form PDF",
          visualActionHi: "पारिवारिक सदस्यों के विवरण फॉर्म पर अपलोड"
        },
        {
          id: 3,
          titleEn: "Inspect Inspector physical visit",
          titleHi: "क्षेत्रीय निरीक्षक द्वारा गृह दौरा",
          descriptionEn: "The food department circles a physical visit desk order. A local inspector visits your household to verify claim parameters.",
          descriptionHi: "खाद्य विभाग आपके पारिवारिक विवरण की पुष्टि के लिए एक क्षेत्रीय निरीक्षक को पते पर भेजता है जो दावों का सत्यापन करता है।",
          checklistLabelEn: "Keeper preparation checklists:",
          checklistLabelHi: "दौरे के समय तैयार रखने वाली चीजें:",
          checklistEn: ["Keep original income records accessible", "Introduce neighbors for local references", "Stay present at the address during official call slot"],
          checklistHi: ["आय के मूल दस्तावेज तैयार रखें", "पड़ोसियों को स्थानीय संदर्भ के रूप में उपस्थित रहने को कहें", "घोषित पते पर स्वयं उपस्थित रहें"],
          proTipEn: "Being cooperative and present accelerates approval speed immensely.",
          proTipHi: "सहयोगात्मक रवैया अपनाने और आवश्यक दस्तावेज सामने रखने से मंजूरी तेजी से मिलती है।",
          visualActionEn: "Verification audit check log logs",
          visualActionHi: "क्षेत्रीय निरीक्षक द्वारा भौतिक सत्यापन प्रक्रिया"
        },
        {
          id: 4,
          titleEn: "FPS Allocation Check",
          titleHi: "राशन डिपो आवंटन वितरण",
          descriptionEn: "Once successfully verified, your family database ledger is mapped to your selected local Fair Price Shop (depot).",
          descriptionHi: "सत्यापन पूर्ण होने पर, आपकी पात्रता सूची को क्षेत्र के निकटतम सरकारी राशन भंडार (राशन डिपो) से लिंक कर दिया जाता है।",
          checklistLabelEn: "FPS pickup instructions:",
          checklistLabelHi: "वितरण केंद्र विवरण आवंटन:",
          checklistEn: ["Ration Card is dispatched within 15-20 days by Speed Post", "Check allocated items digitally on One Nation One Ration Card database", "Complete monthly biometry OTP pickup"],
          checklistHi: ["स्मार्ट राशन कार्ड 15-20 दिनों में डाक द्वारा भेजा जाता है", "वन नेशन वन राशन कार्ड (ONORC) डेटाबेस पर राशन देख सकते हैं", "हर महीने डिपो पर फिंगरप्रिंट देकर अनाज ले सकते हैं"],
          proTipEn: "You can swipe your Aadhaar biometric at any ration shop nationwide if registered on the ONORC portal.",
          proTipHi: "यदि पंजीकृत हैं, तो आप देश भर में किसी भी राशन दुकान से अंगूठा लगाकर राशन प्राप्त कर सकते हैं।",
          visualActionEn: "One Nation One Ration Card mapping",
          visualActionHi: "वन नेशन वन राशन कार्ड ऑनलाइन मैपिंग"
        }
      ];
    }

    // Default Fallback
    return [
      {
        id: 1,
        titleEn: "Prerequisites & Preparation",
        titleHi: "पात्रता और दस्तावेजों की तैयारी",
        descriptionEn: "Compile all basic eligibility documents and verify you meet the age and location prerequisites.",
        descriptionHi: "सभी मूल दस्तावेजों को एकत्रित करें और जांचें कि क्या आप इस सेवा के आयु व क्षेत्र पात्रता मानदंडों को पूरा करते हैं।",
        checklistLabelEn: "Required items in hand:",
        checklistLabelHi: "तैयार रखने वाली चीजें:",
        checklistEn: ["Valid Aadhaar card with mobile linked", "Income or address proof certificate", "Recent passport size digital photo"],
        checklistHi: ["सक्रिय मोबाइल नंबर से जुड़ा आधार कार्ड", "आय या निवास प्रमाण पत्र", "हालिया पासपोर्ट साइज फोटो"],
        proTipEn: "Keep scanned soft copies of all papers in PDF format below 2MB file size.",
        proTipHi: "अपने सभी दस्तावेजों की स्कैंड सॉफ्ट कॉपियों को 2MB से कम साइज की पीडीएफ बनाकर रख लें।",
        visualActionEn: "Bundle documents & run verification",
        visualActionHi: "दस्तावेज़ों को संकलित करें और सत्यापन करें"
      },
      {
        id: 2,
        titleEn: "Fill Application on Portal",
        titleHi: "पोर्टल पर ऑनलाइन फॉर्म भरना",
        descriptionEn: "Log in to the official service desk website page. Enter basic biographical and contact database inputs.",
        descriptionHi: "संबंधित विभाग के आधिकारिक वेब पोर्टल पर लॉग इन करें। बुनियादी व्यक्तिगत और संपर्क विवरण सही-सही भरें।",
        checklistLabelEn: "In the portal form:",
        checklistLabelHi: "ऑनलाइन फॉर्म भरते समय:",
        checklistEn: ["Fill spelling fields matching Aadhaar exact layouts", "Choose correct service sub-category node", "Complete e-KYC if prompted"],
        checklistHi: ["आधार के समान नाम और पते की स्पेलिंग भरें", "सही उप-श्रेणी विकल्प का चयन करें", "कहे जाने पर ई-केवाईसी प्रक्रिया पूरी करें"],
        proTipEn: "Review your application summary draft thoroughly before payment.",
        proTipHi: "भुगतान करने से पहले अपने आवेदन पत्र के ड्राफ्ट की एक-एक पंक्ति की समीक्षा अवश्य करें।",
        visualActionEn: "Fill in registration variables",
        visualActionHi: "पंजीकरण विवरणों को प्रविष्ट करें"
      },
      {
        id: 3,
        titleEn: "Secure Fee Processing",
        titleHi: "सुरक्षित आवेदन शुल्क भुगतान",
        descriptionEn: "Pay the prescribed official agency processing fee to submit your file into the server validation queue.",
        descriptionHi: "अपने आवेदन को विभाग के मुख्य सर्वर सत्यापन में भेजने के लिए निर्धारित प्रक्रिया शुल्क का भुगतान करें।",
        checklistLabelEn: "Payment options & tips:",
        checklistLabelHi: "भुगतान और शुल्क क्रेडेंशियल:",
        checklistEn: ["Pay via instant secure modes (UPI, card, etc)", "Note the Transaction ID from payment success receipt", "Keep the generated application tracking number"],
        checklistHi: ["सुरक्षित माध्यमों जैसे यूपीआई या डेबिट कार्ड से भुगतान करें", "भुगतान रसीद से ट्रांजैक्शन आईडी नोट करें", "प्राप्त आवेदन ट्रैकिंग संख्या (Tracking No) संभाल कर रखें"],
        proTipEn: "Print the generated PDF acknowledgment receipt immediately as reference.",
        proTipHi: "संदर्भ के तौर पर प्राप्त हुई पीडीएफ पावती रसीद को तुरंत प्रिंट या सुरक्षित कर लें।",
        visualActionEn: "Process secure token checkout gateway",
        visualActionHi: "सुरक्षित टोकन चेकआउट विवरण प्रक्रिया"
      },
      {
        id: 4,
        titleEn: "Obtain Final Certificate",
        titleHi: "अंतिम प्रमाण पत्र प्राप्त करें",
        descriptionEn: "The desk administrative officers complete verification and issue a cryptographically signed digital certificate.",
        descriptionHi: "विभाग के प्रशासनिक अधिकारी सत्यापन पूरा करके एक डिजिटल हस्ताक्षरित प्रमाणपत्र जारी करेंगे।",
        checklistLabelEn: "Post-approval download steps:",
        checklistLabelHi: "स्वीकृति के बाद डाउनलोड चरण:",
        checklistEn: ["Check portal database status periodically with Tracking ID", "Download PDF cert to device secure folder", "Import certified copy to DigiLocker"],
        checklistHi: ["ट्रैकिंग आईडी से समय-समय पर स्टेटस जांचते रहें", "प्रमाण पत्र की पीडीएफ अपने फ़ोन में सहेजें", "डिजिलॉकर में सत्यापित कॉपी को जोड़े"],
        proTipEn: "You can verify the official QR verification code on back to check authenticity.",
        proTipHi: "प्रामाणिकता साबित करने के लिए आप प्रमाणपत्र के बैकसाइड पर मौजूद सरकारी QR कोड को स्कैन कर सकते हैं।",
        visualActionEn: "Download certified PDF with secure barcode",
        visualActionHi: "बारकोड युक्त पीडीएफ प्रमाण पत्र सफलतापूर्वक सहेजें"
      }
    ];
  };

  // Workflow steps interface & states
  interface WorkflowStep {
    id: number;
    titleEn: string;
    titleHi: string;
    descEn: string;
    descHi: string;
    durationEn: string;
    durationHi: string;
    type: "document" | "payment" | "biometric" | "office" | "dispatch" | "digital" | "status";
  }

  const [selectedWorkflowService, setSelectedWorkflowService] = useState<ESevaService | null>(null);
  const [checkedWorkflowSteps, setCheckedWorkflowSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("eseva_checked_workflow_steps");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("eseva_checked_workflow_steps", JSON.stringify(checkedWorkflowSteps));
    } catch (err) {
      console.error("Failed to save workflow steps:", err);
    }
  }, [checkedWorkflowSteps]);

  const handleToggleWorkflowStep = (serviceId: string, stepId: number) => {
    const key = `${serviceId}-${stepId}`;
    setCheckedWorkflowSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getServiceWorkflow = (service: ESevaService): WorkflowStep[] => {
    const titleLower = service.title.toLowerCase();
    
    if (titleLower.includes("aadhaar") || service.id.includes("aadhaar")) {
      return [
        {
          id: 1,
          titleEn: "Pre-Registration & Appointment",
          titleHi: "पूर्व-पंजीकरण और समय निर्धारण (अपॉइंटमेंट)",
          descEn: "Visit UIDAI portal, fill online application form, select required supporting documents of Identity/Address, and book an appointment slot at your nearest Aadhaar Seva Kendra.",
          descHi: "यूआईडीएआई पोर्टल पर जाएं, ऑनलाइन आवेदन पत्र भरें, पहचान/पते के सहायक दस्तावेज चुनें और अपने नजदीकी आधार सेवा केंद्र में समय निर्धारित करें।",
          durationEn: "15 mins",
          durationHi: "15 मिनट",
          type: "document"
        },
        {
          id: 2,
          titleEn: "Biometric Data Capture",
          titleHi: "बायोमेट्रिक डेटा संग्रह",
          descEn: "Visit the Aadhaar Seva Kendra. The operator will capture physical biometrics: 10 fingerprints database verification, dual iris scans, and a digital passport photo.",
          descHi: "संबंधित आधार केंद्र पर जाएं। ऑपरेटर उंगलियों के निशान, आंखों की पुतली का स्कैन और एक डिजिटल फोटो कैप्चर करेंगे।",
          durationEn: "15-30 mins",
          durationHi: "15-30 मिनट",
          type: "biometric"
        },
        {
          id: 3,
          titleEn: "UIDAI Central Verification",
          titleHi: "यूआईडीएआई केंद्रीय सत्यापन",
          descEn: "The central CIDR database runs de-duplication checks to ensure your biometrics aren't associated with another Aadhaar card.",
          descHi: "केंद्रीय यूआईडीएआई डेटाबेस यह सुनिश्चित करने के लिए सत्यापन करेगा कि आपकी बायोमेट्रिक्स किसी और कार्ड से मेल तो नहीं खाती।",
          durationEn: "5-15 days",
          durationHi: "5-15 दिन",
          type: "status"
        },
        {
          id: 4,
          titleEn: "Aadhaar Card Generation & Despatch",
          titleHi: "आधार कार्ड निर्माण और प्रेषण",
          descEn: "A physical smart card letter is printed and despatched via India Post (Speed Post) to your address. Simultaneously, you can download the digital copy (e-Aadhaar) securely via OTP.",
          descHi: "एक भौतिक आधार पत्र भारतीय डाक द्वारा आपके घर के पते पर भेजा जाएगा। साथ ही, आप ऑनलाइन 'ई-आधार' कॉपी भी डाउनलोड कर सकते हैं।",
          durationEn: "Digital: 2 days | Physical: 3 weeks",
          durationHi: "डिजिटल: 2 दिन | भौतिक: 3 सप्ताह",
          type: "digital"
        }
      ];
    }
    
    if (titleLower.includes("pan") || service.id.includes("pan") || titleLower.includes("permanent account")) {
      return [
        {
          id: 1,
          titleEn: "Online Application Filing",
          titleHi: "ऑनलाइन आवेदन जमा करना",
          descEn: "Fill Form 49A/49AA on UTIITS or Protean (NSDL) portal. Choose between physical PAN card + e-PAN, or e-PAN only.",
          descHi: "UTIITS या Protean (NSDL) पोर्टल पर फॉर्म 49A/49AA भरें। भौतिक पैन और ई-पैन दोनों का विकल्प चुनें।",
          durationEn: "20 mins",
          durationHi: "20 मिनट",
          type: "document"
        },
        {
          id: 2,
          titleEn: "Fee Payment & e-KYC",
          titleHi: "शुल्क भुगतान और ई-केवाईसी",
          descEn: "Pay application processing fee and complete e-KYC using Aadhaar OTP authentication. No physical documents need to be mailed if using OTP-based e-KYC.",
          descHi: "प्रक्रिया शुल्क का भुगतान करें और आधार ओटीपी ऑथेंटिकेशन के माध्यम से ई-केवाईसी पूरी करें, जिससे दस्तावेज भेजने की आवश्यकता नहीं रहती।",
          durationEn: "5 mins",
          durationHi: "5 मिनट",
          type: "payment"
        },
        {
          id: 3,
          titleEn: "ITD Assessment & Number Allocation",
          titleHi: "आईटीडी मूल्यांकन और पैन आवंटन",
          descEn: "The Income Tax Department evaluates applications for duplicate PANs. Once verified, a unique 10-character alphanumeric PAN is allocated.",
          descHi: "आयकर विभाग आपके आवेदन का मूल्यांकन करता है। सत्यापन के बाद, एक अद्वितीय 10-अक्षर वाला पैन नंबर आवंटित किया जाता है।",
          durationEn: "3-5 days",
          durationHi: "3-5 दिन",
          type: "status"
        },
        {
          id: 4,
          titleEn: "e-PAN Download & Physical Despatch",
          titleHi: "ई-पैन डाउनलोड और भौतिक वितरण",
          descEn: "The e-PAN is emailed to you as a password-protected PDF. The physical high-quality PVC card with QR hologram is manufactured and despatched via post.",
          descHi: "ई-पैन आपकी ईमेल आईडी पर पीडीएफ के रूप में भेजा जाता है। भौतिक प्लास्टिक पैन कार्ड डाक से डिलीवर किया जाएगा।",
          durationEn: "Digital: 24 hrs | Physical: 10 days",
          durationHi: "डिजिटल: 24 घंटे | भौतिक: 10 दिन",
          type: "digital"
        }
      ];
    }

    if (titleLower.includes("passport") || service.id.includes("passport")) {
      return [
        {
          id: 1,
          titleEn: "Online Portals Form & Payment",
          titleHi: "ऑनलाइन फॉर्म भरना और शुल्क भुगतान",
          descEn: "Register on Passport Seva website, complete the online application, upload document checklist, pay the official fee, and book physical appointment slot at your nearest PSK/POPSK.",
          descHi: "पासपोर्ट सेवा वेबसाइट पर पंजीकरण करें, फॉर्म भरें, दस्तावेज़ अपलोड करें, आधिकारिक शुल्क का भुगतान करें और केंद्र में अपनी यात्रा बुक करें।",
          durationEn: "30 mins",
          durationHi: "30 मिनट",
          type: "document"
        },
        {
          id: 2,
          titleEn: "PSK Verification Counter checks",
          titleHi: "पासपोर्ट सेवा केंद्र (PSK) सत्यापन",
          descEn: "Attend scheduled slot at PSK. Go through counter verification stages: Counter A (Biometric, photo, payment check), Counter B (Original documents check by Verification Officer), Counter C (Granting Officer approval).",
          descHi: "तय समय पर PSK पहुंचें। काउंटर A (बायोमेट्रिक्स), काउंटर B (मूल दस्तावेजों की जांच) और काउंटर C (अनुमोदन अधिकारी) की प्रक्रियाओं से गुजरें।",
          durationEn: "2-3 hours",
          durationHi: "2-3 घंटे",
          type: "office"
        },
        {
          id: 3,
          titleEn: "Police Verification (Local Beat)",
          titleHi: "पुलिस सत्यापन प्रक्रिया",
          descEn: "The passport system sends electronic requests to your local Police Station. An officer schedules a physical visit to verify your identity, residential address, address proof, and check criminal histories.",
          descHi: "पासपोर्ट कार्यालय आपकी स्थानीय पुलिस को सूचित करेगा। पुलिस अधिकारी पते और चरित्र सत्यापन के लिए आपके आवास का दौरा करेंगे।",
          durationEn: "3-10 days",
          durationHi: "3-10 दिन",
          type: "status"
        },
        {
          id: 4,
          titleEn: "Printing & Dispatch",
          titleHi: "पासपोर्ट मुद्रण और प्रेषण",
          descEn: "Upon positive police report, Passport printing is queued at the Central Security Printing Press, packaged, and despatched via Speed Post with real-time SMS tracking.",
          descHi: "पुलिस रिपोर्ट सकारात्मक होने के बाद, आपका पासपोर्ट केंद्रीय मुद्रण प्रेस में छपेगा और स्पीड पोस्ट द्वारा ट्रैक नंबर के साथ भेजा जाएगा।",
          durationEn: "4-7 days",
          durationHi: "4-7 दिन",
          type: "dispatch"
        }
      ];
    }

    if (titleLower.includes("license") || titleLower.includes("licence") || titleLower.includes("driving")) {
      return [
        {
          id: 1,
          titleEn: "Learner's License Application & Test",
          titleHi: "लर्नर लाइसेंस (LL) आवेदन व परीक्षा",
          descEn: "Apply on Sarathi Parivahan portal, upload age/address proofs, pay nominal fee, and take the online/offline road signs test to receive a Learner's Licence valid for 6 months.",
          descHi: "सारथी परिवहन पोर्टल पर आवेदन करें, दस्तावेज अपलोड करें और ऑनलाइन यातायात नियमों की परीक्षा उत्तीर्ण कर 6 महीने के लिए वैध लर्नर लाइसेंस प्राप्त करें।",
          durationEn: "1-2 days",
          durationHi: "1-2 दिन",
          type: "document"
        },
        {
          id: 2,
          titleEn: "Permanent DL Slot Booking",
          titleHi: "स्थायी लाइसेंस टेस्ट स्लॉट बुकिंग",
          descEn: "After a mandatory wait of 30 days from LL issue, register online on the Sarathi portal for a Permanent Driving Licence and book a driving test slot at your local RTO.",
          descHi: "लर्नर लाइसेंस जारी होने के 30 दिन बाद, परिवहन पोर्टल पर स्थायी ड्राइविंग लाइसेंस के लिए सड़क परीक्षण टेस्ट हेतु स्लॉट बुक करें।",
          durationEn: "10 mins",
          durationHi: "10 मिनट",
          type: "office"
        },
        {
          id: 3,
          titleEn: "Practical Driving Track Test",
          titleHi: "आरटीओ ड्राइविंग ट्रैक टेस्ट",
          descEn: "Visit the RTO test track with your chosen vehicle. Navigate standard physical layouts (such as Figure 8, Parallel Parking, S-turns, Gradient Climbs) in front of an authorized Motor Vehicle Inspector.",
          descHi: "आरटीओ टेस्ट ट्रैक पर अपने वाहन के साथ पहुंचे। निरीक्षक के समक्ष समानांतर पार्किंग, 'H' या '8' आकृति ट्रैक पर अपनी ड्राइविंग का सफल प्रदर्शन करें।",
          durationEn: "1-2 hours",
          durationHi: "1-2 घंटे",
          type: "biometric"
        },
        {
          id: 4,
          titleEn: "Approval, Manufacture & Dispatch",
          titleHi: "अनुमोदन और स्मार्ट कार्ड वितरण",
          descEn: "Once the RTO inspector submits a positive report, your licence is digitally approved, and a chip-based PVC Driving Licence card is manufactured and mailed.",
          descHi: "आरटीओ द्वारा परीक्षण स्वीकृत होने के बाद, आपका स्थायी लाइसेंस स्वीकृत हो जाता है और चिप-युक्त स्मार्ट कार्ड डाक द्वारा भेजा जाता है।",
          durationEn: "7-14 days",
          durationHi: "7-14 दिन",
          type: "dispatch"
        }
      ];
    }

    if (titleLower.includes("ration") || service.id.includes("ration")) {
      return [
        {
          id: 1,
          titleEn: "State Portal Submission",
          titleHi: "राज्य पोर्टल पर पंजीकरण",
          descEn: "Submit family details on state Food Civil Supplies department, upload Aadhaar cards of all members, family photo, and verified income proofs.",
          descHi: "खाद्य एवं नागरिक आपूर्ति विभाग के पोर्टल पर आवेदन करें, सभी सदस्यों के आधार कार्ड, सामूहिक फोटो और आय प्रमाण पत्र अपलोड करें।",
          durationEn: "30 mins",
          durationHi: "30 मिनट",
          type: "document"
        },
        {
          id: 2,
          titleEn: "Verification Inspecting Visit",
          titleHi: "क्षेत्रीय निरीक्षकों का सर्वेक्षण",
          descEn: "A designated area supply inspector conducts local physical checks on your family household density and income classification (AAY / BPL / PHH).",
          descHi: "नामित क्षेत्र आपूर्ति निरीक्षक गरीबी रेखा वर्गीकरण (BPL/PHH) की पुष्टि के लिए आपके घर या पड़ोस का भौतिक सत्यापन करेंगे।",
          durationEn: "5-10 days",
          durationHi: "5-10 दिन",
          type: "status"
        },
        {
          id: 3,
          titleEn: "Fair Price Shop (FPS) Depot Mapping",
          titleHi: "सरकारी राशन राशन डिपो (FPS) मैपिंग",
          descEn: "The verified family data ledger is officially tied to your closest Fair Price retail shop for distributing grains and cooking fuel quota.",
          descHi: "सत्यापित डेटा को सरकारी राशन दुकान से जोड़ दिया जाता है, जिससे आपके परिवार का मासिक अनाज और ईंधन राशन सुनिश्चित होता है।",
          durationEn: "2-3 days",
          durationHi: "2-3 दिन",
          type: "office"
        },
        {
          id: 4,
          titleEn: "Ration Card Dispatch",
          titleHi: "राशन कार्ड वितरण",
          descEn: "Receive a physical barcoded NFSA Smart Ration Card from the block circle office or download the digital card through DigiLocker.",
          descHi: "ब्लॉक कार्यालय से भौतिक स्मार्ट बारकोडेड राशन कार्ड प्राप्त करें या डिजिलॉकर के माध्यम से अपना डिजिटल राशन कार्ड तुरंत डाउनलोड करें।",
          durationEn: "15-20 days",
          durationHi: "15-20 दिन",
          type: "digital"
        }
      ];
    }

    // General fallback by category
    return [
      {
        id: 1,
        titleEn: "Eligibility Checks & Paperwork Pre-check",
        titleHi: "पात्रता जाँच एवं आवश्यक कागजात",
        descEn: "Determine specific age, residential, and caste/income eligibility prerequisites. Gather and verify mandatory documents from pre-checksheets.",
        descHi: "योजना की पात्रता सूची (जैसे आयु, निवास या श्रेणी) की जांच करें और हमारी चेकलिस्ट के अनुसार सभी दस्तावेज एकत्र करें।",
        durationEn: "1 day",
        durationHi: "1 दिन",
        type: "document"
      },
      {
        id: 2,
        titleEn: "Online Application & Portal Upload",
        titleHi: "पोर्टल पर आवेदन फॉर्म भरना",
        descEn: "Access the government service web application, input personal bio-details, scan and upload required verified documents, and securely submit the application.",
        descHi: "संबंधित विभाग के ऑनलाइन पोर्टल पर जाएं, मूल विवरण दर्ज करें, दस्तावेज अपलोड करें और आवेदन पत्र सबमिट करें।",
        durationEn: "20-40 mins",
        durationHi: "20-40 मिनट",
        type: "digital"
      },
      {
        id: 3,
        titleEn: "Verification Audits by Despatched Officers",
        titleHi: "प्रशासनिक अधिकारियों द्वारा सत्यापन",
        descEn: "State or Central designated block desk officers carry out administrative verification, query resolutions, and field checks to approve your applications.",
        descHi: "संबंधित विभाग के डेस्क अधिकारी तथा क्षेत्रीय निरीक्षक आपके दस्तावेजों और तथ्यों का भौतिक व प्रशासनिक सत्यापन करते हैं।",
        durationEn: "7-14 days",
        durationHi: "7-14 दिन",
        type: "status"
      },
      {
        id: 4,
        titleEn: "Certificate Approval & Electronic Issue",
        titleHi: "स्वीकृति एवं डिजिटल प्रमाण पत्र जारी होना",
        descEn: "The service is granted. A digital, digitally-signed PDF is issued (often verified with cryptographic signature) and physical copies are delivered to your address.",
        descHi: "कार्य पूर्ण रूप से स्वीकृत होने के बाद डिजिटल हस्ताक्षरित प्रमाण पत्र पीडीएफ के रूप में पोर्टल पर जारी होता है या आपके पते पर भेजा जाता है।",
        durationEn: "3-5 days",
        durationHi: "3-5 दिन",
        type: "digital"
      }
    ];
  };

  // Expandable docs checklist state
  const [expandedDocServices, setExpandedDocServices] = useState<Record<string, boolean>>({});
  const [showProTips, setShowProTips] = useState<Record<string, boolean>>({});
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("eseva_checked_docs");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem("eseva_checked_docs", JSON.stringify(checkedDocs));
    } catch (err) {
      console.error(err);
    }
  }, [checkedDocs]);

  const toggleExpandDocs = (serviceId: string) => {
    setExpandedDocServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const getCheckedCount = (serviceId: string, docs: string[]) => {
    return docs.reduce((count, doc) => {
      return count + (checkedDocs[`${serviceId}-${doc}`] ? 1 : 0);
    }, 0);
  };

  const getPercentReady = (serviceId: string, docs: string[]) => {
    if (docs.length === 0) return 0;
    const checked = getCheckedCount(serviceId, docs);
    return Math.round((checked / docs.length) * 100);
  };

  const handleToggleDocCheckbox = (serviceId: string, doc: string) => {
    const uniqueKey = `${serviceId}-${doc}`;
    setCheckedDocs(prev => ({
      ...prev,
      [uniqueKey]: !prev[uniqueKey]
    }));
  };

  const getDisplayDescription = (service: ESevaService) => {
    const isToggled = toggledTranslates[service.id];
    
    if (language === "en") {
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
          const transLang = trans[language] || trans.hi;
          if (transLang) {
            return transLang.description;
          }
        }
        return `[Translated ${language.toUpperCase()}]: ${service.description}`;
      }
      return service.description;
    }
  };

  const [localSavedIds, setLocalSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("sewanadu_saved_services");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const savedIds = propsSavedServiceIds !== undefined ? propsSavedServiceIds : localSavedIds;

  const handleToggleSave = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    incrementPopularity(serviceId);
    if (propsOnToggleSave) {
      propsOnToggleSave(serviceId, e);
    } else {
      setLocalSavedIds((prev) => {
        const isSaved = prev.includes(serviceId);
        const next = isSaved ? prev.filter(id => id !== serviceId) : [...prev, serviceId];
        try {
          localStorage.setItem("sewanadu_saved_services", JSON.stringify(next));
        } catch (err) {
          console.error(err);
        }
        return next;
      });
    }
  };

  const handleShare = async (service: ESevaService, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?service=${service.id}`;
    const shareText = language === "hi" 
      ? `🎯 *आधिकारिक ई-सेवा निर्देशिका*\n\nसेवा: *${service.title}*\nविभाग: ${service.department}\nसरकारी शुल्क: ${service.fees === 0 ? "निःशुल्क" : `₹ ${service.fees}`}\nसमय-सीमा: ${service.processingTime}\n\nसभी आवश्यक दस्तावेज़ और सीधे आवेदन की जानकारी यहाँ देखें:\n👉 ${shareUrl}`
      : `🎯 *Official e-Seva Assistant*\n\nService: *${service.title}*\nDepartment: ${service.department}\nGovt Fee: ${service.fees === 0 ? "FREE" : `₹ ${service.fees}`}\nProcessing Time: ${service.processingTime}\n\nGet the complete document checklist & apply direct:\n👉 ${shareUrl}`;

    setCopiedServiceId(service.id);
    setTimeout(() => {
      setCopiedServiceId(null);
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
      console.error("Failed to copy", err);
    }
  };

  const searchQuery = propsSearchQuery !== undefined ? propsSearchQuery : localSearchQuery;
  const setSearchQuery = propsSetSearchQuery !== undefined ? propsSetSearchQuery : setLocalSearchQuery;
  
  // Independent search query specifically within the ESevaServiceList component
  const [standaloneKeyword, setStandaloneKeyword] = useState("");
  const activeSearchQuery = standaloneKeyword !== "" ? standaloneKeyword : (searchQuery || "");
  
  // Track if user clicked to browse or interactively searched
  const [viewCatalog, setViewCatalog] = useState(false);

  // Recent Searches state persisted to local storage (last 5 queries)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("sewanadu_recent_searches");
      return saved ? JSON.parse(saved) : ["Aadhaar", "PAN Card", "Passport", "Driving Licence", "PM Kisan"];
    } catch {
      return ["Aadhaar", "PAN Card", "Passport", "Driving Licence", "PM Kisan"];
    }
  });

  const [showHeroDropdown, setShowHeroDropdown] = useState(false);
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);

  const addRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem("sewanadu_recent_searches", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recent searches", e);
      }
      return updated;
    });
  };

  const removeRecentSearch = (query: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s.toLowerCase() !== query.toLowerCase());
      try {
        localStorage.setItem("sewanadu_recent_searches", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recent searches", e);
      }
      return updated;
    });
  };

  const clearAllRecentSearches = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem("sewanadu_recent_searches");
    } catch (e) {
      console.error("Failed to clear recent searches", e);
    }
  };

  const handleSelectSearchTerm = (term: string) => {
    setStandaloneKeyword(term);
    addRecentSearch(term);
    setViewCatalog(true);
  };

  const renderSearchDropdownOverlay = (
    onSelect: (query: string) => void,
    onClose: () => void
  ) => {
    return (
      <div 
        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-950 border border-stone-200/90 dark:border-white/10 rounded-2xl shadow-xl z-[70] overflow-hidden font-sans text-left transition-all duration-150 animate-in fade-in slide-in-from-top-1"
        onMouseDown={(e) => e.preventDefault()}
      >
        {/* Header section */}
        <div className="p-3 border-b border-stone-100 dark:border-white/5 flex items-center justify-between bg-stone-50/90 dark:bg-slate-900/60">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-stone-800 dark:text-stone-200">
            <Clock className="w-3.5 h-3.5 text-brand-coral" />
            <span>{language === "hi" ? "हाल की खोजें (Recent Searches)" : "Recent Searches"}</span>
          </div>
          {recentSearches.length > 0 && (
            <button
              type="button"
              onClick={(e) => clearAllRecentSearches(e)}
              className="text-[10.5px] font-bold text-stone-400 hover:text-rose-600 transition cursor-pointer"
            >
              {language === "hi" ? "सभी साफ़ करें" : "Clear All"}
            </button>
          )}
        </div>

        {/* Items list */}
        <div className="py-1 max-h-56 overflow-y-auto">
          {recentSearches.length > 0 ? (
            recentSearches.map((term, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelect(term);
                  onClose();
                }}
                className="group px-3.5 py-2 hover:bg-orange-50/70 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition text-xs text-stone-800 dark:text-stone-200"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Clock className="w-3.5 h-3.5 text-stone-400 group-hover:text-brand-coral shrink-0" />
                  <span className="font-semibold truncate">{term}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => removeRecentSearch(term, e)}
                  className="p-1 text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 transition rounded-full hover:bg-stone-200/60 dark:hover:bg-slate-700 cursor-pointer"
                  title={language === "hi" ? "हटाएं" : "Remove item"}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-stone-400 italic">
              {language === "hi" ? "कोई हालिया खोज नहीं है" : "No recent searches saved"}
            </div>
          )}
        </div>

        {/* Popular Suggestions Bar */}
        <div className="p-2.5 bg-stone-50/60 dark:bg-slate-900/40 border-t border-stone-100 dark:border-white/5">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5 px-1">
            {language === "hi" ? "लोकप्रिय खोज सुझाव:" : "Popular Queries:"}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Aadhaar", "PAN Card", "Passport", "Driving Licence", "Ration Card", "PM Kisan"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  onSelect(tag);
                  onClose();
                }}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-white/10 rounded-lg text-[10.5px] font-bold text-stone-700 dark:text-stone-300 hover:border-brand-coral hover:text-brand-coral transition cursor-pointer shadow-3xs"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Localized Copy Dictionary
  const copy = useMemo(() => {
    return contentTrans[language as "en" | "hi"] || contentTrans.en;
  }, [language]);

  const renderCategoryFilterPills = (isCatalogView = false) => {
    const pills = [
      { id: "POPULAR", labelEn: "Popular", labelHi: "लोकप्रिय", icon: Sparkles, color: "rose" },
      { id: "IDENTITY", labelEn: "Identity", labelHi: "पहचान पत्र", icon: UserCheck, color: "orange" },
      { id: "HEALTH", labelEn: "Health", labelHi: "स्वास्थ्य", icon: Heart, color: "cyan" },
      { id: "AGRICULTURE", labelEn: "Agriculture", labelHi: "कृषि", icon: Sprout, color: "emerald" },
      { id: "FINANCE", labelEn: "Finance", labelHi: "वित्तीय", icon: Banknote, color: "amber" },
      { id: "EDUCATION", labelEn: "Education", labelHi: "शिक्षा", icon: GraduationCap, color: "violet" },
      { id: "WELFARE", labelEn: "Welfare", labelHi: "कल्याण", icon: ShieldCheck, color: "blue" },
      { id: "LAND", labelEn: "Land/Property", labelHi: "भूमि", icon: Landmark, color: "teal" },
      { id: "LABOUR", labelEn: "Labour", labelHi: "रोजगार", icon: Briefcase, color: "indigo" },
    ];

    return (
      <div className={`flex flex-wrap items-center justify-center gap-2 mt-2 select-none ${isCatalogView ? "md:justify-start" : "justify-center"}`}>
        <span className="text-[10px] font-mono tracking-wider text-stone-400 font-bold uppercase mr-1">
          {language === "hi" ? "श्रेणी फ़िल्टर:" : "Category Filter:"}
        </span>
        {pills.map((pill) => {
          const PillIcon = pill.icon;
          const label = language === "hi" ? pill.labelHi : pill.labelEn;
          const isActive = activeCategory === pill.id;
          
          let baseColors = "";
          if (pill.color === "orange") {
            baseColors = isActive 
              ? "bg-orange-600 border-orange-600 text-white shadow-xs ring-2 ring-orange-500/30" 
              : "bg-orange-50/70 hover:bg-orange-50 border-orange-200/60 text-orange-850 hover:border-orange-300";
          } else if (pill.color === "blue") {
            baseColors = isActive 
              ? "bg-blue-600 border-blue-600 text-white shadow-xs ring-2 ring-blue-500/30" 
              : "bg-blue-50/70 hover:bg-blue-50 border-blue-200/60 text-blue-850 hover:border-blue-300";
          } else if (pill.color === "emerald") {
            baseColors = isActive 
              ? "bg-emerald-600 border-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30" 
              : "bg-emerald-50/70 hover:bg-emerald-50 border-emerald-200/60 text-emerald-850 hover:border-emerald-300";
          } else if (pill.color === "cyan") {
            baseColors = isActive 
              ? "bg-[#0891b2] border-[#0891b2] text-white shadow-xs ring-2 ring-cyan-500/30" 
              : "bg-cyan-50/70 hover:bg-cyan-50 border-cyan-200/60 text-cyan-850 hover:border-cyan-300";
          } else if (pill.color === "rose") {
            baseColors = isActive 
              ? "bg-rose-600 border-rose-600 text-white shadow-xs ring-2 ring-rose-500/30 animate-pulse" 
              : "bg-rose-50/80 hover:bg-rose-50 border-rose-200/60 text-rose-850 hover:border-rose-300";
          } else if (pill.color === "amber") {
            baseColors = isActive 
              ? "bg-amber-600 border-amber-600 text-white shadow-xs ring-2 ring-amber-500/30" 
              : "bg-amber-50/70 hover:bg-amber-50 border-amber-200/60 text-amber-850 hover:border-amber-300";
          } else if (pill.color === "teal") {
            baseColors = isActive 
              ? "bg-teal-600 border-teal-600 text-white shadow-xs ring-2 ring-teal-500/30" 
              : "bg-teal-50/70 hover:bg-teal-50 border-teal-200/60 text-teal-850 hover:border-teal-300";
          } else if (pill.color === "indigo") {
            baseColors = isActive 
              ? "bg-indigo-600 border-indigo-600 text-white shadow-xs ring-2 ring-indigo-500/30" 
              : "bg-indigo-50/70 hover:bg-indigo-50 border-indigo-200/60 text-indigo-850 hover:border-indigo-300";
          } else {
            baseColors = isActive 
              ? "bg-violet-600 border-violet-600 text-white shadow-xs ring-2 ring-violet-500/30" 
              : "bg-violet-50/70 hover:bg-violet-50 border-violet-200/60 text-violet-850 hover:border-violet-305";
          }

          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => {
                handleCategoryClick(pill.id);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold tracking-tight transition duration-150 cursor-pointer border ${baseColors}`}
              id={`quick-filter-${pill.id.toLowerCase()}`}
            >
              <PillIcon className={`w-3.5 h-3.5 ${isActive ? "text-white animate-pulse" : "text-stone-500 hover:text-stone-705"}`} />
              <span>{label}</span>
            </button>
          );
        })}
        {activeCategory !== "ALL" && (
          <button
            type="button"
            onClick={() => {
              setActiveCategory("ALL");
              setSearchQuery("");
            }}
            className="text-[10px] font-bold text-stone-500 hover:text-stone-800 transition font-sans underline cursor-pointer"
          >
            {language === "hi" ? "साफ़ करें" : "Clear Filter"}
          </button>
        )}
      </div>
    );
  };

  // Handle Category Mapping
  const categories = [
    { id: "ALL", label: language === "hi" ? "सभी सेवाएं" : "All Services", icon: Landmark, count: "100+ Services" },
    { id: "POPULAR", label: language === "hi" ? "लोकप्रिय" : "Popular", icon: Sparkles, count: language === "hi" ? "ट्रेंडिंग" : "Trending Now" },
    { id: "IDENTITY", label: language === "hi" ? "पहचान पत्र" : "Identity", icon: UserCheck, count: "Aadhaar, Passport, Voter" },
    { id: "HEALTH", label: language === "hi" ? "स्वास्थ्य" : "Health", icon: Heart, count: "ABHA, FSSAI, Medical" },
    { id: "AGRICULTURE", label: language === "hi" ? "कृषि एवं किसान" : "Agriculture", icon: Sprout, count: "PM-Kisan, Subsidies" },
    { id: "FINANCE", label: language === "hi" ? "वित्त एवं कर" : "Finance & Tax", icon: Banknote, count: "PAN, Tax, GST, MSME" },
    { id: "EDUCATION", label: language === "hi" ? "शिक्षा" : "Education", icon: GraduationCap, count: "Scholarships, CBSE" },
    { id: "WELFARE", label: language === "hi" ? "कल्याण योजनाएं" : "Welfare", icon: ShieldCheck, count: "Ration, Pensions" },
    { id: "LAND", label: language === "hi" ? "भूमि एवं संपत्ति" : "Land & Property", icon: Landmark, count: "7/12, Patta, Mutation" },
    { id: "LABOUR", label: language === "hi" ? "श्रमिक एवं परिवहन" : "Labour & Transport", icon: Briefcase, count: "DL, e-Shram, EPFO" },
    { id: "SAVED", label: language === "hi" ? "सहेजी गई" : "Saved", icon: Bookmark, count: `${savedIds.length} saved` },
  ];

  // Category-specific search suggestion tags
  const CATEGORY_SEARCH_TAGS: Record<string, { en: string[]; hi: string[] }> = {
    IDENTITY: {
      en: ["Aadhaar", "Passport", "Voter ID", "Domicile", "Birth Certificate", "Marriage"],
      hi: ["आधार", "पासपोर्ट", "वोटर आईडी", "मूल निवास", "जन्म प्रमाण", "विवाह"]
    },
    HEALTH: {
      en: ["ABHA Card", "FSSAI Food License", "ESIC", "Ayush", "Hospital"],
      hi: ["आभा कार्ड", "खाद्य लाइसेंस", "ESIC", "आयुष", "अस्पताल"]
    },
    AGRICULTURE: {
      en: ["PM Kisan", "Crop Insurance", "Fertilizer", "APEDA Exports", "Soil Card"],
      hi: ["पीएम किसान", "फसल बीमा", "उर्वरक", "एपीडा", "मृदा कार्ड"]
    },
    FINANCE: {
      en: ["PAN Card", "Income Certificate", "GST", "MSME Udyam", "EWS"],
      hi: ["पैन कार्ड", "आय प्रमाण पत्र", "जीएसटी", "एमएसएमई", "ईडब्ल्यूएस"]
    },
    EDUCATION: {
      en: ["Scholarship", "CBSE Marksheet", "NEET Exam", "NSP Portal", "SWAYAM"],
      hi: ["छात्रवृत्ति", "सीबीएसई अंकपत्र", "नीट", "एनएसपी", "स्वयं"]
    },
    WELFARE: {
      en: ["Ration Card", "Old Age Pension", "PMAY Housing", "Widow Pension"],
      hi: ["राशन कार्ड", "वृद्धावस्था पेंशन", "पीएम आवास", "विधवा पेंशन"]
    },
    LAND: {
      en: ["7/12 Extract", "Land Mutation", "Encumbrance EC", "Patta", "Khasra"],
      hi: ["7/12 खसरा", "नामांतरण", "भारमुक्त प्रमाण पत्र", "पट्टा", "खसरा"]
    },
    LABOUR: {
      en: ["Driving Licence", "e-Shram Card", "EPFO UAN", "Vehicle Permit", "FASTag"],
      hi: ["ड्राइविंग लाइसेंस", "ई-श्रम कार्ड", "ईपीएफओ यूएएन", "परमिट", "फास्टैग"]
    },
    POPULAR: {
      en: ["Aadhaar", "PAN Card", "Passport", "PM Kisan", "Ration Card"],
      hi: ["आधार", "पैन कार्ड", "पासपोर्ट", "पीएम किसान", "राशन कार्ड"]
    },
    SAVED: {
      en: ["Bookmarked Services"],
      hi: ["सहेजी गई सेवाएं"]
    }
  };

  const activeCategoryObj = categories.find((c) => c.id === activeCategory);
  const activeCategoryName = activeCategoryObj ? activeCategoryObj.label.split(" (")[0] : activeCategory;

  // Map category click back to actual services categories with true toggle capability
  const handleCategoryClick = (catId: string) => {
    setViewCatalog(true);
    setSearchQuery("");
    setStandaloneKeyword("");
    if (activeCategory === catId) {
      setActiveCategory("ALL");
    } else {
      setActiveCategory(catId);
    }
  };

  // Filter services statically based on standard schema mapping helper
  const filteredServices = useMemo(() => {
    const list = services.filter((s) => {
      let matchesCategory = false;
      if (activeCategory === "ALL" || activeCategory === "POPULAR") {
        matchesCategory = true;
      } else if (activeCategory === "SAVED") {
        matchesCategory = savedIds.includes(s.id);
      } else {
        const serviceGroup = getServiceGroup(s);
        matchesCategory = serviceGroup.toLowerCase() === activeCategory.toLowerCase();
      }
      const matchesSearch = s.title.toLowerCase().includes(activeSearchQuery.toLowerCase()) || 
                            s.department.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
                            s.description.toLowerCase().includes(activeSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (activeCategory === "POPULAR" || sortBy === "POPULARITY") {
      return [...list].sort((a, b) => {
        const scoreA = popularityScores[a.id] || 0;
        const scoreB = popularityScores[b.id] || 0;
        return scoreB - scoreA;
      });
    }

    if (sortBy === "ALPHABETICAL") {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "NEWEST") {
      return [...list].sort((a, b) => services.indexOf(b) - services.indexOf(a));
    } else {
      // RELEVANCE: preserve original relative position
      return [...list].sort((a, b) => services.indexOf(a) - services.indexOf(b));
    }
  }, [services, activeCategory, activeSearchQuery, savedIds, sortBy, popularityScores]);

  // Get specific category color theme badges
  const getCategoryTheme = (category: string, titleStr: string) => {
    const titleLower = titleStr.toLowerCase();
    if (titleLower.includes("passport")) return "bg-sky-50 text-sky-850 border-sky-200";
    if (titleLower.includes("driving")) return "bg-rose-50 text-rose-850 border-rose-200";
    if (titleLower.includes("voter")) return "bg-indigo-50 text-indigo-850 border-indigo-200";
    if (titleLower.includes("ration")) return "bg-teal-50 text-teal-850 border-teal-200";
    if (titleLower.includes("kisan") || titleLower.includes("agriculture") || titleLower.includes("apeda")) return "bg-emerald-50 text-emerald-850 border-emerald-200";

    switch (category) {
      case "IDENTITY": return "bg-orange-50 text-orange-850 border-orange-200";
      case "FINANCE": return "bg-emerald-50 text-emerald-850 border-emerald-200";
      case "HEALTH": return "bg-cyan-50 text-cyan-850 border-cyan-200";
      case "LABOUR": return "bg-amber-50 text-amber-850 border-amber-200";
      case "LAND": return "bg-purple-50 text-purple-850 border-purple-200";
      case "WELFARE": return "bg-blue-50 text-blue-850 border-blue-200";
      case "AGRICULTURE": return "bg-emerald-50 text-emerald-850 border-emerald-200";
      case "EDUCATION": return "bg-violet-50 text-violet-850 border-violet-200";
      default: return "bg-slate-50 text-slate-850 border-slate-200";
    }
  };

  // Human category display label builder
  const getCategoryLabel = (service: ESevaService) => {
    const titleLower = service.title.toLowerCase();
    if (titleLower.includes("passport")) return language === "hi" ? "यात्रा" : "Travel";
    if (titleLower.includes("driving")) return language === "hi" ? "ड्राइविंग" : "Driving";
    if (titleLower.includes("voter")) return language === "hi" ? "नागरिक" : "Civic";
    if (titleLower.includes("ration")) return language === "hi" ? "कल्याण" : "Welfare";
    if (titleLower.includes("kisan") || titleLower.includes("agriculture") || titleLower.includes("apeda")) return language === "hi" ? "कृषि" : "Agriculture";
    if (titleLower.includes("scholarship") || titleLower.includes("education") || titleLower.includes("school")) return language === "hi" ? "शिक्षा" : "Education";
    
    switch (service.category) {
      case "IDENTITY": return language === "hi" ? "पहचान पत्र" : "Identity";
      case "FINANCE": return language === "hi" ? "वित्त" : "Finance";
      case "HEALTH": return language === "hi" ? "स्वास्थ्य" : "Health";
      case "LABOUR": return language === "hi" ? "रोजगार" : "Labour";
      case "LAND": return language === "hi" ? "राजस्व" : "Land";
      case "WELFARE": return language === "hi" ? "कल्याण" : "Welfare";
      default: return language === "hi" ? "अन्य" : "General";
    }
  };

  // Find popular services instantly to render on homepage
  const popularServices = useMemo(() => {
    const list = [
      services.find(s => s.id === "uidai-aadhaar"),
      services.find(s => s.id === "nsdl-pan"),
      services.find(s => s.id === "mea-passport"),
      services.find(s => s.id === "rto-dl"),
      services.find(s => s.id === "eci-voter"),
      services.find(s => s.id === "pds-ration")
    ];
    return list.filter((x): x is ESevaService => !!x);
  }, [services]);

  // Is user currently looking at the home landing view or the results?
  const isSearchOrFilterActive = activeSearchQuery !== "" || activeCategory !== "ALL" || viewCatalog;

  return (
    <div id="service-directory" className="space-y-8 animate-fade-in font-sans">
      
      {!isSearchOrFilterActive ? (
        // ==========================================
        // A. SEWANADU HIGH-FIDELITY HOME LANDING VIEW
        // ==========================================
        <div className="space-y-12">
          
          {/* 1. HERO VIEW */}
          <div className="relative text-center max-w-3xl mx-auto pt-6 pb-2 space-y-6">
            
            {/* Soft background colorful peach ambient glow on the right (matching screenshot mockup layout) */}
            <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-brand-coral/5 blur-3xl -z-10 pointer-events-none"></div>
            
            {/* Green dot active notification label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-emerald-800 tracking-wide uppercase font-sans">
                {copy.heroPill}
              </span>
            </div>

            {/* Main Premium Typography Display Heading */}
            <h1 className="font-display font-extrabold text-[#111111] text-3xl sm:text-5xl md:text-6xl tracking-tight leading-[1.08] text-balance">
              {copy.heroTitle}
            </h1>

            {/* Landing Body description text */}
            <p className="text-sm md:text-base text-stone-600 font-normal leading-relaxed max-w-2xl mx-auto">
              {copy.heroDesc}
            </p>

            {/* Quick Category-Based Filtering Pills */}
            {renderCategoryFilterPills()}

            {/* Custom search launcher box with Category-based filter dropdown */}
            <div className="max-w-2xl mx-auto relative mt-2" id="landing-search-container">
              <div className="p-1 px-1.5 flex flex-col sm:flex-row sm:items-center bg-white border border-[#E5E2D9] rounded-2xl shadow-sm hover:border-brand-coral/40 focus-within:border-brand-coral/60 focus-within:ring-3 focus-within:ring-brand-coral/10 transition gap-2">
                
                {/* Elegant Filter Dropdown */}
                <div className="relative flex items-center px-3 py-1 bg-stone-50 hover:bg-stone-100 rounded-xl transition cursor-pointer shrink-0">
                  <Filter className="w-3.5 h-3.5 text-brand-coral shrink-0 mr-1.5" />
                  <select
                    id="search-category-dropdown"
                    value={activeCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleCategoryClick(val);
                      setViewCatalog(true);
                    }}
                    className="bg-transparent text-[11px] font-bold text-stone-700 cursor-pointer outline-none py-1.5 pr-6 border-none appearance-none font-sans"
                  >
                    <option value="ALL">{language === "hi" ? "सभी श्रेणियां" : "All Categories"}</option>
                    <option value="POPULAR">{language === "hi" ? "लोकप्रिय (Popular)" : "Popular"}</option>
                    <option value="SAVED">{language === "hi" ? "सहेजी गई सेवाएं (Saved)" : "Saved Services"}</option>
                    <option value="HEALTH">{language === "hi" ? "स्वास्थ्य (Health)" : "Health"}</option>
                    <option value="EDUCATION">{language === "hi" ? "शिक्षा (Education)" : "Education"}</option>
                    <option value="FINANCE">{language === "hi" ? "वित्तीय (Financial)" : "Financial"}</option>
                    <option value="UTILITY">{language === "hi" ? "उपयोगिता (Utility)" : "Utility"}</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2 pointer-events-none" />
                </div>

                {/* Text search input */}
                <div className="flex-1 flex items-center min-w-0 relative">
                  <Search className="w-4 h-4 text-brand-coral shrink-0 ml-2 hidden sm:block animate-pulse" />
                  <input 
                    type="text" 
                    id="search-input-field"
                    placeholder={language === "hi" ? "निर्देशिका खोजें (उदा. आधार, पैन, लाइसेंस)" : "Search directory (e.g. Aadhaar, PAN, Licence)..."}
                    value={standaloneKeyword}
                    onFocus={() => setShowHeroDropdown(true)}
                    onBlur={() => setTimeout(() => setShowHeroDropdown(false), 200)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && standaloneKeyword.trim()) {
                        addRecentSearch(standaloneKeyword);
                        setViewCatalog(true);
                        setShowHeroDropdown(false);
                      }
                    }}
                    onChange={(e) => {
                      setStandaloneKeyword(e.target.value);
                      if (e.target.value !== "") setViewCatalog(true);
                    }}
                    className="w-full bg-transparent py-2.5 px-3 text-xs outline-none text-stone-900 font-sans placeholder-stone-400 focus:outline-none pr-8"
                  />
                  {standaloneKeyword && (
                    <button
                      type="button"
                      onClick={() => setStandaloneKeyword("")}
                      className="absolute right-2.5 text-stone-400 hover:text-stone-700 font-bold transition p-1 text-sm bg-transparent border-0 cursor-pointer"
                    >
                      ×
                    </button>
                  )}

                  {/* Recent Searches Overlay Dropdown */}
                  {showHeroDropdown && renderSearchDropdownOverlay(
                    (term) => handleSelectSearchTerm(term),
                    () => setShowHeroDropdown(false)
                  )}
                </div>

                {/* Trigger Button */}
                <button
                  id="search-button-trigger"
                  onClick={() => {
                    if (standaloneKeyword.trim()) addRecentSearch(standaloneKeyword);
                    setViewCatalog(true);
                    setShowHeroDropdown(false);
                  }}
                  className="bg-brand-coral hover:bg-brand-coral-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs active:scale-95 w-full sm:w-auto"
                >
                  {language === "hi" ? "सेवाएं खोजें" : "Search Services"} <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>

            {/* Quick search helper action pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-stone-500 font-semibold uppercase tracking-wider">
              <span>{language === "hi" ? "सुझाव:" : "Popular:"}</span>
              {["Aadhaar", "PAN", "Passport", "Driving"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setStandaloneKeyword(tag);
                    setViewCatalog(true);
                  }}
                  className="px-2.5 py-1 bg-brand-cream-card hover:bg-brand-cream-dark border border-[#E5E2D9] rounded-lg transition text-stone-700 cursor-pointer font-mono"
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>

          {/* 2. STATS BAR GRID */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto bg-stone-50 border border-stone-200/65 rounded-2xl p-4 md:p-5 text-center shadow-2xs">
            <div className="space-y-0.5 border-r border-stone-200/60 last:border-0">
              <div className="text-xl md:text-2xl font-black text-brand-coral tracking-tight font-display">{copy.stat1_val}</div>
              <div className="text-[10px] md:text-xs text-stone-500 font-sans tracking-tight font-medium leading-tight">{copy.stat1_lbl}</div>
            </div>
            <div className="space-y-0.5 border-r border-stone-200/60 last:border-0">
              <div className="text-xl md:text-2xl font-black text-brand-coral tracking-tight font-display">{copy.stat2_val}</div>
              <div className="text-[10px] md:text-xs text-stone-500 font-sans tracking-tight font-medium leading-tight">{copy.stat2_lbl}</div>
            </div>
            <div className="space-y-0.5 border-r border-stone-200/60 last:border-0">
              <div className="text-xl md:text-2xl font-black text-emerald-600 tracking-tight font-display">{copy.stat3_val}</div>
              <div className="text-[10px] md:text-xs text-stone-500 font-sans tracking-tight font-medium leading-tight">{copy.stat3_lbl}</div>
            </div>
          </div>

          {/* 3. BROWSE BY CATEGORY Grid representing 8 customized categories */}
          <div className="space-y-4" id="home-categories-block">
            <div className="text-center md:text-left space-y-0.5">
              <span className="text-[10px] font-bold text-brand-coral block tracking-widest uppercase font-mono">{copy.catHeader}</span>
              <h2 className="text-xl font-bold tracking-tight text-stone-900 font-sans">{copy.catSub}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.slice(1).map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="group bg-white hover:bg-brand-cream-card border border-[#E9E6DC] hover:border-brand-coral/30 rounded-2xl p-4 flex flex-col items-center sm:items-start text-center sm:text-left gap-3.5 transition text-stone-800 shadow-2xs hover:shadow-xs cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-brand-cream-dark text-brand-coral rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-brand-coral/10 group-hover:text-brand-coral transition-all">
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs group-hover:text-stone-950 font-sans">{cat.label}</h4>
                      <p className="text-[10px] text-stone-500">{cat.count}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AdSense Unit in middle of homepage to render seamlessly */}
          <AdSenseUnit id="homepage-mid" format="inline" slotId="3401928372" />

          {/* 4. POPULAR SERVICES WITH BULLET CHECKLISTS EXPLICIT COMPLIANT CARD DESIGN */}
          <div className="space-y-4" id="popular-cards-block">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-brand-coral block tracking-widest uppercase font-mono">{language === "hi" ? "आधिकारिक डेटा" : "PORTAL TOP PICKS"}</span>
              <h2 className="text-xl font-bold tracking-tight text-stone-900 font-sans">{copy.popularHeader}</h2>
              <p className="text-xs text-stone-500">{copy.popularSub}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {popularServices.map((service) => (
                <div 
                  key={service.id}
                  className="bg-white border border-[#E9E6DC] rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-sm space-y-4 shadow-2xs"
                >
                  <div className="space-y-3">
                    {/* Header line tag */}
                    <div className="flex items-center justify-between gap-1">
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold font-mono uppercase tracking-wider border ${getCategoryTheme(service.category, service.title)}`}>
                        {getCategoryLabel(service)} • {copy.centralGovt}
                      </span>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-stone-400 justify-end">
                        <span className="flex items-center gap-1 bg-rose-50 border border-rose-100/70 text-rose-700 px-1.5 py-0.5 rounded text-[9.5px] font-bold" title="Trending citizen interest metric">
                          <Sparkles className="w-2.5 h-2.5 text-rose-500 animate-pulse shrink-0" />
                          <span>{popularityScores[service.id] || 0} {language === "hi" ? "रुचि" : "views"}</span>
                        </span>
                        <span className="flex items-center gap-1 bg-stone-100/60 px-1.5 py-0.5 rounded text-[9.5px] font-semibold" title="Estimated reading time">
                          <BookOpen className="w-3 h-3 text-stone-400" />
                          <span>{getReadingTime(service)} {language === "hi" ? "मि पठन" : "min read"}</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {service.processingTime}
                        </div>
                      </div>
                    </div>

                    {/* Title and details */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="font-extrabold text-[#111111] text-sm leading-snug">{service.title}</h3>
                        {completedTutorials[service.id] && (
                          <span className="flex items-center gap-0.5 text-[9px] font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-250 px-1.5 py-0.5 rounded-full select-none shadow-3xs animate-fadeIn">
                            <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                            <span>{language === "hi" ? "त्वरित गाइड पूर्ण" : "Guide Done"}</span>
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowProTips(prev => ({ ...prev, [service.id]: !prev[service.id] }));
                          }}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold font-mono transition-all duration-150 cursor-pointer select-none border shadow-3xs ${
                            showProTips[service.id] 
                              ? "bg-amber-500 border-amber-600 text-neutral-950 scale-[1.03]"
                              : "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800"
                          }`}
                          title={language === "hi" ? "त्वरित प्रक्रिया प्रो-टिप देखें" : "View fast-track pro-tip"}
                          id={`popular-pro-tip-btn-${service.id}`}
                        >
                          <Sparkles className={`w-2.5 h-2.5 ${showProTips[service.id] ? "text-neutral-950" : "text-amber-500 animate-pulse"}`} />
                          <span>{language === "hi" ? "प्रो-टिप" : "Pro-Tip"}</span>
                        </button>
                      </div>
                      <div className="pt-0.5 pb-1 select-none">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-250/20 text-[#1D4ED8] text-[9.5px] font-bold font-mono shadow-3xs" title="Average Processing Time">
                          <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>{language === "hi" ? `औसत प्रसंस्करण समय: ${service.processingTime}` : `Avg. Processing Time: ${service.processingTime}`}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-normal line-clamp-2">{getDisplayDescription(service)}</p>
                    </div>

                    {showProTips[service.id] && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-950 animate-fadeIn"
                        id={`popular-pro-tip-box-${service.id}`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                        <div className="space-y-0.5 text-left">
                          <span className="text-[9px] font-extrabold font-mono uppercase tracking-wider text-amber-700 block">
                            {language === "hi" ? "त्वरित प्रक्रिया प्रो-टिप:" : "Expedite Process Pro-Tip:"}
                          </span>
                          <p className="text-[11px] font-semibold leading-relaxed">
                            {getServiceProTip(service, language === "hi" ? "hi" : "en")}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Expandable Documentation & Checksheet Tracker */}
                    <div className="space-y-2">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpandDocs(service.id);
                        }}
                        className="w-full flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100/90 border border-stone-200 rounded-xl transition cursor-pointer text-left"
                        id={`popular-expand-docs-btn-${service.id}`}
                      >
                        <div className="flex items-center gap-2">
                          <FileSignature className="w-3.5 h-3.5 text-brand-coral shrink-0" />
                          <span className="text-xs font-bold text-[#111111] select-none">
                            {language === "hi" ? "आवश्यक दस्तावेज़ कार्यपत्र" : "Required Documents List"}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[9px] font-bold font-mono select-none">
                            {getCheckedCount(service.id, service.documentsRequired)}/{service.documentsRequired.length}
                          </span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 shrink-0 ${expandedDocServices[service.id] ? "rotate-180" : ""}`} />
                      </button>

                      {expandedDocServices[service.id] ? (
                        <div className="p-3 bg-brand-cream-card/70 border border-stone-200/40 rounded-xl space-y-2 animate-fadeIn" id={`popular-docs-container-${service.id}`}>
                          <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold uppercase font-mono tracking-wider select-none">
                            <span>{language === "hi" ? "दस्तावेज़ उपलब्धता चेकलिस्ट" : "Availability Checklist"}</span>
                            <span className="text-brand-coral">{getPercentReady(service.id, service.documentsRequired)}%</span>
                          </div>
                          
                          {/* Animated progress bar */}
                          <div className="w-full h-1.5 bg-stone-200/80 rounded-full overflow-hidden select-none">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-300"
                              style={{ width: `${getPercentReady(service.id, service.documentsRequired)}%` }}
                            ></div>
                          </div>

                          <ul className="space-y-1.5 pt-1 text-[11px] text-stone-750 font-sans leading-relaxed">
                            {service.documentsRequired.map((doc, idx) => {
                              const uniqueKey = `${service.id}-${doc}`;
                              const isChecked = !!checkedDocs[uniqueKey];
                              return (
                                <li 
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleDocCheckbox(service.id, doc);
                                  }}
                                  className="flex items-start gap-2.5 p-1.5 bg-white/70 hover:bg-white rounded-lg transition-all cursor-pointer border border-transparent hover:border-stone-200/40 select-none"
                                >
                                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                                    isChecked 
                                      ? "bg-emerald-500 border-emerald-500 text-white shadow-2xs" 
                                      : "border-stone-300 bg-white"
                                  }`}>
                                    {isChecked && <Check className="w-3 h-3 stroke-[3px]" />}
                                  </div>
                                  <span className={`leading-normal ${isChecked ? "text-stone-400 line-through decoration-stone-200/60" : "text-stone-850 font-semibold"}`}>
                                    {doc}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>

                          {/* All Checked congratulations notice */}
                          {getCheckedCount(service.id, service.documentsRequired) === service.documentsRequired.length && (
                            <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-lg text-[10px] font-bold flex items-center gap-1.5 mt-1 animate-pulse select-none">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{language === "hi" ? "सभी दस्तावेज़ तैयार हैं! सीधे आवेदन करें।" : "Excellent! All documents are ready to submit."}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-2.5 bg-brand-cream-card border border-stone-200/30 rounded-xl text-[10px] text-stone-500 font-medium select-none flex items-center justify-between">
                          <span className="truncate max-w-[80%]">
                            {language === "hi" ? "दस्तावेज़:" : "Required: "} {service.documentsRequired.slice(0, 2).join(", ")}
                            {service.documentsRequired.length > 2 && "..."}
                          </span>
                          <span className="text-[9px] font-bold text-brand-coral uppercase shrink-0">
                            {language === "hi" ? "विस्तार" : "EXPAND"} (+{service.documentsRequired.length})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-stone-100">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Share Button */}
                      <button
                        onClick={(e) => handleShare(service, e)}
                        className={`p-1.5 px-2 rounded-lg border transition duration-150 flex items-center justify-center cursor-pointer ${
                          copiedServiceId === service.id
                            ? "bg-emerald-50 text-emerald-600 border-emerald-250 animate-pulse"
                            : "bg-stone-50 hover:bg-stone-100 text-stone-555 hover:text-stone-755 border-stone-200"
                        }`}
                        title={language === "hi" ? "साझा करें" : "Share Service Details"}
                      >
                        {copiedServiceId === service.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5 text-stone-555" />
                        )}
                        <span className="text-[10px] font-bold font-sans ml-1">
                          {copiedServiceId === service.id
                            ? (language === "hi" ? "कॉपी!" : "Copied!")
                            : (language === "hi" ? "साझा" : "Share")
                          }
                        </span>
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
                        className={`p-1.5 px-2 rounded-lg border transition duration-150 flex items-center justify-center cursor-pointer ${
                          toggledTranslates[service.id]
                            ? "bg-orange-50 text-orange-600 border-orange-250 font-bold"
                            : "bg-stone-50 hover:bg-stone-100 text-stone-555 border-stone-200"
                        }`}
                        title={
                          toggledTranslates[service.id]
                            ? (language === "hi" ? "मूल भाषा में देखें" : "Show original English")
                            : (language === "hi" ? "हिंदी में अनुवाद करें" : `Translate to ${language === "en" ? "Hindi" : "selected language"}`)
                        }
                      >
                        <Languages className={`w-3.5 h-3.5 ${toggledTranslates[service.id] ? "text-orange-500" : "text-stone-400"}`} />
                        <span className="text-[10px] font-bold font-sans ml-1">
                          {toggledTranslates[service.id]
                            ? (language === "hi" ? "English" : "Original")
                            : (language === "hi" ? "अनुवाद" : "Translate")
                          }
                        </span>
                      </button>

                      {/* Bookmark Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(service.id, e)}
                        className={`p-1.5 px-2 rounded-lg border transition duration-150 flex items-center justify-center cursor-pointer whitespace-nowrap ${
                          savedIds.includes(service.id)
                            ? "bg-amber-50 text-amber-600 border-amber-250 font-semibold"
                            : "bg-stone-50 hover:bg-stone-100 text-stone-555 border-stone-200"
                        }`}
                        title={savedIds.includes(service.id) ? (language === "hi" ? "सहेजा गया" : "Saved") : (language === "hi" ? "सहेजें" : "Save")}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${savedIds.includes(service.id) ? "fill-amber-500 text-amber-500 font-bold" : "text-stone-400"}`} />
                        <span className="text-[10px] font-bold font-sans ml-1">
                          {savedIds.includes(service.id)
                            ? (language === "hi" ? "सहेजा" : "Saved")
                            : (language === "hi" ? "सहेजें" : "Save")
                          }
                        </span>
                      </button>

                      {/* Feedback Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onFeedbackClick) onFeedbackClick(service);
                        }}
                        className="p-1.5 px-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-250 transition duration-150 flex items-center justify-center cursor-pointer text-stone-555"
                        title={language === "hi" ? "प्रतिक्रिया दें" : "Give Feedback"}
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span className="text-[10px] font-bold font-sans ml-1">
                          {language === "hi" ? "फीडबैक" : "Feedback"}
                        </span>
                      </button>

                      {/* Report Issue Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onReportIssueClick) onReportIssueClick(service);
                        }}
                        className="p-1.5 px-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-250 transition duration-150 flex items-center justify-center cursor-pointer text-stone-555"
                        title={language === "hi" ? "त्रुटि या टूटी लिंक की रिपोर्ट करें" : "Report incorrect info or broken link"}
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-[10px] font-bold font-sans ml-1">
                          {language === "hi" ? "रिपोर्ट" : "Report"}
                        </span>
                      </button>

                      {/* Donate Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDonateClick) onDonateClick(service);
                        }}
                        className="p-1.5 px-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-red-50 hover:text-red-150 hover:border-red-200 transition duration-150 flex items-center justify-center cursor-pointer text-stone-555 whitespace-nowrap"
                        title={language === "hi" ? "कल्याण अभियान दान" : "Donate & Support Welfare"}
                      >
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-400" />
                        <span className="text-[10px] font-bold font-sans ml-1">
                          {language === "hi" ? "योगदान" : "Donate"}
                        </span>
                      </button>

                      {/* View Workflow Button */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenWorkflow(service, e)}
                        className="p-1.5 px-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-250 transition duration-150 flex items-center justify-center cursor-pointer text-stone-555 whitespace-nowrap"
                        title={language === "hi" ? "आवेदन प्रक्रिया प्रवाह आरेख देखें" : "View application process workflow flowchart"}
                        id={`popular-view-workflow-btn-${service.id}`}
                      >
                        <Compass className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] font-bold font-sans ml-1">
                          {language === "hi" ? "वर्कफ़्लो" : "Workflow"}
                        </span>
                      </button>

                      {/* Quick Apply Tutorial Overlay Button */}
                      <button
                        type="button"
                        onClick={(e) => handleOpenQuickApply(service, e)}
                        className="p-1.5 px-2 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:border-emerald-350 transition duration-150 flex items-center justify-center cursor-pointer whitespace-nowrap shadow-3xs"
                        title={language === "hi" ? "त्वरित आवेदन और इंटरैक्टिव ट्यूटोरियल" : "Interactive guide for instant validation & quick apply steps"}
                        id={`popular-quick-apply-btn-${service.id}`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-605 animate-pulse" />
                        <span className="text-[10px] font-extrabold font-sans ml-1">
                          {language === "hi" ? "त्वरित गाइड" : "Quick Apply"}
                        </span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleApplyClick(service)}
                      className="text-brand-coral hover:text-brand-coral-hover font-bold text-xs tracking-tight transition flex items-center gap-1 cursor-pointer hover:underline shrink-0"
                    >
                      {copy.applyLink}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. BUILT FOR EVERY INDIAN FEATURES HIGHLIGHT GRID (SewaNadu Brand Credibility showcase) */}
          <div className="bg-stone-50 border border-stone-200/70 rounded-2xl p-6 shadow-2xs space-y-6">
            <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-stone-400 text-center">{copy.whyHeader}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-stone-200/70">
              <div className="space-y-1.5 pt-4 md:pt-0 md:pl-4 first:pl-0">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-brand-coral mb-2">
                  <CheckCircle className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-bold text-xs text-stone-900">{copy.why1_title}</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">{copy.why1_desc}</p>
              </div>
              <div className="space-y-1.5 pt-4 md:pt-0 md:pl-6">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-bold text-xs text-stone-900">{copy.why2_title}</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">{copy.why2_desc}</p>
              </div>
              <div className="space-y-1.5 pt-4 md:pt-0 md:pl-6">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 mb-2">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-bold text-xs text-stone-900">{copy.why3_title}</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">{copy.why3_desc}</p>
              </div>
            </div>
          </div>

        </div>
      ) : (
        // ==========================================
        // B. SEWANADU CATALOG RESULTS DIRECTORY GRID
        // ==========================================
        <div className="space-y-6">
          
          {/* Header & statistics block */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div className="space-y-1 animate-fade-in">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setViewCatalog(false);
                    setStandaloneKeyword("");
                    setSearchQuery("");
                    setActiveCategory("ALL");
                  }} 
                  className="text-stone-400 hover:text-stone-900 text-[10.5px] tracking-tight uppercase font-bold pr-2 border-r border-[#E5E2D9] font-sans"
                >
                  ← {language === "hi" ? "होम बैक" : "Back Home"}
                </button>
                <h2 className="text-sm font-bold tracking-tight text-stone-900 uppercase font-sans">
                  {copy.catalogTitle} ({filteredServices.length})
                </h2>
              </div>
              <p className="text-xs text-stone-500">
                {language === "hi" ? "कुल उपलब्ध सरकारी योजनाओं और प्रमाणपत्रों की सूची" : "Full catalog list of verified citizen gateways & e-Sevas"}
              </p>
            </div>

            {/* Quick selectors row */}
            <div className="flex flex-wrap items-center gap-2 select-none">
              {/* Region Selector */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E5E2D9] rounded-xl text-[10.5px] font-bold text-stone-650 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{copy.allStates}</span>
              </div>
              {/* Relevance Selector Dropdown */}
              <div className="relative inline-flex items-center bg-white border border-[#E5E2D9] rounded-xl pl-3 pr-2 py-1.5 text-[10.5px] font-bold text-stone-650 shadow-2xs hover:border-brand-coral/30 cursor-pointer transition">
                <Filter className="w-3.5 h-3.5 text-stone-400 mr-1.5 shrink-0" />
                <select
                  id="catalog-quick-sort-dropdown"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-[10.5px] font-bold text-stone-705 cursor-pointer outline-none appearance-none pr-3.5 font-sans"
                >
                  <option value="RELEVANCE">{language === "hi" ? "प्रासंगिकता (Default)" : "Relevance"}</option>
                  <option value="POPULARITY">{language === "hi" ? "लोकप्रियता (Trending)" : "Popularity"}</option>
                  <option value="ALPHABETICAL">{language === "hi" ? "वर्णानुक्रम (A-Z)" : "Alphabetical"}</option>
                  <option value="NEWEST">{language === "hi" ? "नवीनतम जोड़े गए" : "Newest Added"}</option>
                </select>
                <ChevronDown className="w-3 h-3 text-stone-400 pointer-events-none absolute right-1.5" />
              </div>
              {/* Direct active status */}
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-mono font-bold uppercase tracking-wider border border-emerald-100">
                ● LIVE
              </span>
            </div>
          </div>

          {/* Quick Category-Based Filtering Pills */}
          <div className="bg-white p-4 pb-3 border border-stone-200/60 rounded-2xl space-y-1 shadow-3xs">
            <p className="text-[10px] text-stone-500 font-semibold tracking-wide uppercase font-mono">
              {language === "hi" ? "विशिष्ट सेवा श्रेणियां:" : "Select service category query:"}
            </p>
            {renderCategoryFilterPills(true)}
          </div>

          {/* NEW PREMIUM SEARCH & CATEGORY FILTER PANEL (Allows quick category narrowing) */}
          <div className="bg-[#FAF8F5] border border-stone-200/90 p-3.5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center gap-3 shadow-3xs" id="catalog-filter-dashboard">
            
            {/* 1. Dropdown Filter Box */}
            <div className="relative shrink-0 flex items-center bg-white border border-[#E5E2D9] rounded-xl px-3.5 py-2 hover:border-brand-coral/30 cursor-pointer shadow-3xs transition">
              <Filter className="w-3.5 h-3.5 text-brand-coral shrink-0 mr-2" />
              <span className="text-[10px] text-stone-450 uppercase tracking-wider font-mono mr-1.5 hidden lg:inline">{language === "hi" ? "श्रेणी:" : "Filter:"}</span>
              <select
                id="catalog-category-dropdown"
                value={activeCategory}
                onChange={(e) => {
                  const val = e.target.value;
                  handleCategoryClick(val);
                }}
                className="bg-transparent text-xs font-bold text-stone-700 cursor-pointer outline-none pr-6 appearance-none font-sans"
              >
                <option value="ALL">{language === "hi" ? "सभी श्रेणियां (All)" : "All Categories"}</option>
                <option value="POPULAR">{language === "hi" ? "लोकप्रिय (Popular)" : "Popular Services"}</option>
                <option value="IDENTITY">{language === "hi" ? "पहचान पत्र (Identity)" : "Identity & Civil"}</option>
                <option value="HEALTH">{language === "hi" ? "स्वास्थ्य (Health)" : "Health & Medical"}</option>
                <option value="AGRICULTURE">{language === "hi" ? "कृषि एवं किसान (Agriculture)" : "Agriculture & Farming"}</option>
                <option value="FINANCE">{language === "hi" ? "वित्त एवं कर (Finance)" : "Finance & Tax"}</option>
                <option value="EDUCATION">{language === "hi" ? "शिक्षा (Education)" : "Education & Scholarships"}</option>
                <option value="WELFARE">{language === "hi" ? "कल्याण योजनाएं (Welfare)" : "Welfare & Social Schemes"}</option>
                <option value="LAND">{language === "hi" ? "भूमि एवं संपत्ति (Land)" : "Land & Property"}</option>
                <option value="LABOUR">{language === "hi" ? "श्रमिक एवं परिवहन (Labour)" : "Labour & Transport"}</option>
                <option value="SAVED">{language === "hi" ? "सहेजी गई सेवाएं (Saved)" : "Saved Services"}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 pointer-events-none" />
            </div>

            {/* 1b. Dropdown Sort Box */}
            <div className="relative shrink-0 flex items-center bg-white border border-[#E5E2D9] rounded-xl px-3.5 py-2 hover:border-brand-coral/30 cursor-pointer shadow-3xs transition">
              <ArrowDownAZ className="w-3.5 h-3.5 text-brand-coral shrink-0 mr-2" />
              <span className="text-[10px] text-stone-450 uppercase tracking-wider font-mono mr-1.5 hidden lg:inline">{language === "hi" ? "क्रम:" : "Sort:"}</span>
              <select
                id="catalog-sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-stone-705 cursor-pointer outline-none pr-6 appearance-none font-sans"
              >
                <option value="RELEVANCE">{language === "hi" ? "प्रासंगिकता (Default)" : "Relevance"}</option>
                <option value="POPULARITY">{language === "hi" ? "लोकप्रियता (Trending)" : "Popularity"}</option>
                <option value="ALPHABETICAL">{language === "hi" ? "वर्णानुक्रम (A-Z)" : "Alphabetical"}</option>
                <option value="NEWEST">{language === "hi" ? "नवीनतम जोड़े गए" : "Newest Added"}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3 pointer-events-none" />
            </div>

            {/* 2. Instant Text Search Box */}
            <div className="relative flex-1 flex items-center bg-white border border-[#E5E2D9] rounded-xl shadow-3xs focus-within:border-brand-coral/60 focus-within:ring-2 focus-within:ring-brand-coral/5 transition">
              <Search className="w-4 h-4 text-brand-coral absolute left-3.5 shrink-0" />
              <input 
                type="text" 
                id="catalog-search-input"
                placeholder={
                  activeCategory !== "ALL"
                    ? (language === "hi" ? `श्रेणी में खोजें (${activeCategoryName})...` : `Search within ${activeCategoryName}...`)
                    : (language === "hi" ? "त्वरित कीवर्ड फ़िल्टर (उदा. आधार, राशन)..." : "Instant keyword filter (e.g. Aadhaar, Ration)...")
                }
                value={standaloneKeyword}
                onFocus={() => setShowCatalogDropdown(true)}
                onBlur={() => setTimeout(() => setShowCatalogDropdown(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && standaloneKeyword.trim()) {
                    addRecentSearch(standaloneKeyword);
                    setShowCatalogDropdown(false);
                  }
                }}
                onChange={(e) => setStandaloneKeyword(e.target.value)}
                className="w-full bg-transparent py-2.5 pl-10 pr-9 text-xs outline-none text-stone-900 font-sans placeholder-stone-400 focus:outline-none"
              />
              {standaloneKeyword && (
                <button
                  type="button"
                  onClick={() => setStandaloneKeyword("")}
                  className="absolute right-3 text-stone-400 hover:text-stone-700 transition lg:text-sm font-bold bg-transparent border-0 cursor-pointer"
                  title="Clear keywords"
                >
                  ×
                </button>
              )}

              {/* Recent Searches Overlay Dropdown */}
              {showCatalogDropdown && renderSearchDropdownOverlay(
                (term) => handleSelectSearchTerm(term),
                () => setShowCatalogDropdown(false)
              )}
            </div>

            {/* 3. Action / Reset filter button */}
            <button
              id="catalog-clear-filters"
              onClick={() => {
                setStandaloneKeyword("");
                setSearchQuery("");
                setActiveCategory("ALL");
              }}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-[#E5E2D9] font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs text-center"
            >
              <RefreshCw className="w-3 h-3 text-stone-400 shrink-0" />
              <span>{copy.resetBtn}</span>
            </button>
          </div>

          {/* Category Horizontal Filter Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              // Avoid duplicate filter triggers on catalog row
              const labelClean = cat.id === "ALL" && language === "hi" ? "सभी" : cat.label.split(" (")[0];
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer border select-none ${
                    isActive 
                      ? "bg-brand-coral border-brand-coral text-white" 
                      : "bg-white hover:bg-brand-cream-card border-[#E5E2D9] text-stone-705"
                  }`}
                >
                  {labelClean}
                </button>
              );
            })}
          </div>

          {/* Active Category Search Filter Banner */}
          {activeCategory !== "ALL" && (
            <div className="bg-gradient-to-r from-orange-50/90 via-white to-amber-50/60 border border-orange-200/90 p-4 rounded-2xl shadow-3xs space-y-3 font-sans animate-fade-in" id="active-category-search-banner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-coral text-white rounded-xl shadow-3xs shrink-0">
                    <Filter className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                        {language === "hi" ? "श्रेणी फ़िल्टर सक्रिय" : "Category Filter Active"}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-500">
                        ({filteredServices.length} {language === "hi" ? "सेवाएं मिलीं" : "services found"})
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-stone-900 font-display mt-0.5">
                      {language === "hi" ? `${activeCategoryName} में खोजें` : `Searching in ${activeCategoryName}`}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  {standaloneKeyword && (
                    <span className="px-2.5 py-1 bg-white border border-orange-200 text-orange-800 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-3xs">
                      <span>"{standaloneKeyword}"</span>
                      <button 
                        type="button"
                        onClick={() => setStandaloneKeyword("")}
                        className="text-stone-400 hover:text-rose-600 font-bold ml-1 cursor-pointer"
                        title={language === "hi" ? "फ़िल्टरएं" : "Clear filter"}
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory("ALL");
                      setStandaloneKeyword("");
                      setSearchQuery("");
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-3xs"
                  >
                    <X className="w-3.5 h-3.5 text-stone-400" />
                    <span>{language === "hi" ? "सभी श्रेणियां दिखाएं" : "Show All Categories"}</span>
                  </button>
                </div>
              </div>

              {/* Category Specific Quick Keyword Tags */}
              {CATEGORY_SEARCH_TAGS[activeCategory] && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider mr-1">
                    {language === "hi" ? "विशिष्ट सेवा सुझाव:" : "Quick Category Tags:"}
                  </span>
                  {CATEGORY_SEARCH_TAGS[activeCategory][language === "hi" ? "hi" : "en"].map((tag) => {
                    const isSelected = standaloneKeyword.toLowerCase() === tag.toLowerCase();
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setStandaloneKeyword("");
                          } else {
                            setStandaloneKeyword(tag);
                            addRecentSearch(tag);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border cursor-pointer select-none ${
                          isSelected
                            ? "bg-brand-coral text-white border-brand-coral shadow-3xs"
                            : "bg-white hover:bg-orange-100/70 text-stone-700 border-stone-200 hover:border-orange-300"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Matches grid listing */}
          {filteredServices.length === 0 ? (
            <div className="p-16 text-center border-2 border-dashed border-stone-200 bg-[#FAF8F5] rounded-3xl space-y-3">
              <p className="font-bold text-stone-850 text-xs">
                {language === "hi" ? "कोई भी मेल खाने वाली सेवा मयस्सर नहीं है" : "No matching directory services"}
              </p>
              <p className="text-[11px] text-stone-450 max-w-sm mx-auto">
                {language === "hi" 
                  ? "कृपया अपना वर्तनी बदलें या अन्य श्रेणियाँ चुनें। आप ऊपर दिए 'रीसेट' बटन से वापस पूरी निर्देशिका की सूची देख सकते हैं।" 
                  : "We cannot identify e-Seva schemes matching this query. Revise spelling parameters or click 'Reset' to restore full manual catalog list."}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("ALL");
                }}
                className="mt-2 bg-brand-coral hover:bg-brand-coral-hover text-white px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                {language === "hi" ? "सभी सेवाएं पुनर्स्थापित करें" : "Restore All Services"}
              </button>
            </div>
          ) : (
            <div className="space-y-10" id="grouped-services-catalog">
              {CATEGORY_GROUPS.map((group) => {
                const groupServices = filteredServices.filter(s => getServiceGroup(s) === group.id);
                if (groupServices.length === 0) return null;

                const GroupIcon = group.icon;
                const groupTitle = language === "hi" ? group.nameHi : group.name;
                const groupDesc = language === "hi" ? group.descriptionHi : group.description;

                return (
                  <div key={group.id} className="space-y-4 animate-fade-in" id={`catalog-group-${group.id}`}>
                    {/* Category Group Header Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-50 to-stone-100/30 border border-stone-200/85 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white rounded-xl border border-stone-250/60 text-brand-coral shrink-0">
                          <GroupIcon className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="font-display font-black text-slate-950 text-sm tracking-tight">
                            {groupTitle}
                          </h3>
                          <p className="text-[11px] text-stone-550 font-sans leading-tight">
                            {groupDesc}
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-white border border-stone-200 text-stone-605 font-mono text-[10px] font-bold rounded-lg self-start sm:self-center shrink-0 shadow-3xs">
                        {groupServices.length} {groupServices.length === 1 ? (language === "hi" ? "सेवा" : "service") : (language === "hi" ? "सेवाएं" : "services")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {groupServices.map((service) => (
                        <div 
                          key={service.id} 
                          id={`service-card-${service.id}`}
                          className="bg-white border border-[#E9E6DC] rounded-2xl p-5 hover:border-brand-coral/45 transition flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs"
                        >
                          <div className="space-y-3">
                            
                            {/* Badge headers */}
                            <div className="flex items-start justify-between gap-1.5 flex-wrap">
                              <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold font-mono uppercase tracking-wider border ${getCategoryTheme(service.category, service.title)}`}>
                                {getCategoryLabel(service)} • {copy.centralGovt}
                              </span>
                              <div className="flex flex-wrap items-center gap-2 text-[10px] text-stone-450 font-mono justify-end font-sans">
                                <span className="flex items-center gap-1 bg-rose-50 border border-rose-100/70 text-rose-700 px-1.5 py-0.5 rounded text-[9.5px] font-bold" title="Trending citizen interest metric">
                                  <Sparkles className="w-2.5 h-2.5 text-rose-500 animate-pulse shrink-0" />
                                  <span>{popularityScores[service.id] || 0} {language === "hi" ? "रुचि" : "views"}</span>
                                </span>
                                <span className="flex items-center gap-1 bg-stone-100/60 px-1.5 py-0.5 rounded text-[9.5px] font-semibold" title="Estimated reading time">
                                  <BookOpen className="w-3 h-3 text-stone-400" />
                                  <span>{getReadingTime(service)} {language === "hi" ? "मि पठन" : "min read"}</span>
                                </span>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" /> {service.processingTime}
                                </div>
                              </div>
                            </div>

                            {/* Main fields */}
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <h4 className="font-extrabold text-[#111111] text-sm leading-tight">
                                  {service.title}
                                </h4>
                                {completedTutorials[service.id] && (
                                  <span className="flex items-center gap-0.5 text-[9px] font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-250 px-1.5 py-0.5 rounded-full select-none shadow-3xs animate-fadeIn">
                                    <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                                    <span>{language === "hi" ? "त्वरित गाइड पूर्ण" : "Guide Done"}</span>
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowProTips(prev => ({ ...prev, [service.id]: !prev[service.id] }));
                                  }}
                                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold font-mono transition-all duration-150 cursor-pointer select-none border shadow-3xs ${
                                    showProTips[service.id] 
                                      ? "bg-amber-500 border-amber-600 text-neutral-950 scale-[1.03]"
                                      : "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800"
                                  }`}
                                  title={language === "hi" ? "त्वरित प्रक्रिया प्रो-टिप देखें" : "View fast-track pro-tip"}
                                  id={`catalog-pro-tip-btn-${service.id}`}
                                >
                                  <Sparkles className={`w-2.5 h-2.5 ${showProTips[service.id] ? "text-neutral-950" : "text-amber-500 animate-pulse"}`} />
                                  <span>{language === "hi" ? "प्रो-टिप" : "Pro-Tip"}</span>
                                </button>
                              </div>
                              <span className="text-[10px] font-semibold text-stone-400 block tracking-tight line-clamp-1 uppercase font-mono">
                                {service.department}
                              </span>
                            </div>

                            <div className="pt-0.5 pb-0.5 select-none animate-fadeIn">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-250/20 text-[#1D4ED8] text-[9.5px] font-bold font-mono shadow-3xs" title="Average Processing Time">
                                <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span>{language === "hi" ? `औसत प्रसंस्करण समय: ${service.processingTime}` : `Avg. Processing Time: ${service.processingTime}`}</span>
                              </span>
                            </div>

                            <p className="text-xs text-stone-605 leading-relaxed">
                              {getDisplayDescription(service)}
                            </p>

                            {showProTips[service.id] && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-950 animate-fadeIn"
                                id={`catalog-pro-tip-box-${service.id}`}
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                                <div className="space-y-0.5 text-left">
                                  <span className="text-[9px] font-extrabold font-mono uppercase tracking-wider text-amber-700 block">
                                    {language === "hi" ? "त्वरित प्रक्रिया प्रो-टिप:" : "Expedite Process Pro-Tip:"}
                                  </span>
                                  <p className="text-[11px] font-semibold leading-relaxed">
                                    {getServiceProTip(service, language === "hi" ? "hi" : "en")}
                                  </p>
                                </div>
                              </motion.div>
                            )}

                            {/* Expandable Documentation & Checksheet Tracker */}
                            <div className="space-y-2">
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpandDocs(service.id);
                                }}
                                className="w-full flex items-center justify-between p-2.5 bg-stone-50 hover:bg-stone-100/90 border border-stone-200 rounded-xl transition cursor-pointer text-left"
                                id={`catalog-expand-docs-btn-${service.id}`}
                              >
                                <div className="flex items-center gap-2">
                                  <FileSignature className="w-3.5 h-3.5 text-brand-coral shrink-0" />
                                  <span className="text-xs font-bold text-[#111111] select-none">
                                    {language === "hi" ? "आवश्यक दस्तावेज़ कार्यपत्र" : "Required Documents List"}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[9px] font-bold font-mono select-none">
                                    {getCheckedCount(service.id, service.documentsRequired)}/{service.documentsRequired.length}
                                  </span>
                                </div>
                                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 shrink-0 ${expandedDocServices[service.id] ? "rotate-180" : ""}`} />
                              </button>

                              {expandedDocServices[service.id] ? (
                                <div className="p-3 bg-brand-cream-card/70 border border-stone-200/40 rounded-xl space-y-2 animate-fadeIn" id={`catalog-docs-container-${service.id}`}>
                                  <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold uppercase font-mono tracking-wider select-none">
                                    <span>{language === "hi" ? "दस्तावेज़ उपलब्धता चेकलिस्ट" : "Availability Checklist"}</span>
                                    <span className="text-brand-coral">{getPercentReady(service.id, service.documentsRequired)}%</span>
                                  </div>
                                  
                                  {/* Animated progress bar */}
                                  <div className="w-full h-1.5 bg-stone-200/80 rounded-full overflow-hidden select-none">
                                    <div 
                                      className="h-full bg-emerald-500 transition-all duration-300"
                                      style={{ width: `${getPercentReady(service.id, service.documentsRequired)}%` }}
                                    ></div>
                                  </div>

                                  <ul className="space-y-1.5 pt-1 text-[11px] text-stone-750 font-sans leading-relaxed">
                                    {service.documentsRequired.map((doc, idx) => {
                                      const uniqueKey = `${service.id}-${doc}`;
                                      const isChecked = !!checkedDocs[uniqueKey];
                                      return (
                                        <li 
                                          key={idx}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleDocCheckbox(service.id, doc);
                                          }}
                                          className="flex items-start gap-2.5 p-1.5 bg-white/70 hover:bg-white rounded-lg transition-all cursor-pointer border border-transparent hover:border-stone-200/40 select-none"
                                        >
                                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                                            isChecked 
                                              ? "bg-emerald-500 border-emerald-500 text-white shadow-2xs" 
                                              : "border-stone-300 bg-white"
                                          }`}>
                                            {isChecked && <Check className="w-3 h-3 stroke-[3px]" />}
                                          </div>
                                          <span className={`leading-normal ${isChecked ? "text-stone-400 line-through decoration-stone-200/60" : "text-stone-850 font-semibold"}`}>
                                            {doc}
                                          </span>
                                        </li>
                                      );
                                    })}
                                  </ul>

                                  {/* All Checked congratulations notice */}
                                  {getCheckedCount(service.id, service.documentsRequired) === service.documentsRequired.length && (
                                    <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-lg text-[10px] font-bold flex items-center gap-1.5 mt-1 animate-pulse select-none">
                                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      <span>{language === "hi" ? "सभी दस्तावेज़ तैयार हैं! सीधे आवेदन करें।" : "Excellent! All documents are ready to submit."}</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="p-2.5 bg-brand-cream-card border border-stone-200/30 rounded-xl text-[10px] text-stone-500 font-medium select-none flex items-center justify-between">
                                  <span className="truncate max-w-[80%]">
                                    {language === "hi" ? "दस्तावेज़:" : "Required: "} {service.documentsRequired.slice(0, 2).join(", ")}
                                    {service.documentsRequired.length > 2 && "..."}
                                  </span>
                                  <span className="text-[9px] font-bold text-brand-coral uppercase shrink-0">
                                    {language === "hi" ? "विस्तार" : "EXPAND"} (+{service.documentsRequired.length})
                                  </span>
                                </div>
                              )}
                            </div>

                          </div>

                          {/* Footers Section */}
                          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <button
                                onClick={(e) => handleShare(service, e)}
                                className={`p-2 rounded-xl border transition duration-150 flex items-center justify-center cursor-pointer ${
                                  copiedServiceId === service.id
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-250 animate-pulse"
                                    : "bg-stone-50 hover:bg-stone-100 text-stone-555 hover:text-stone-755 border-stone-200"
                                }`}
                                title={language === "hi" ? "साझा करें" : "Share Service Details"}
                              >
                                {copiedServiceId === service.id ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Share2 className="w-4 h-4 text-stone-555" />
                                )}
                                <span className="text-[10px] font-bold font-sans ml-1">
                                  {copiedServiceId === service.id
                                    ? (language === "hi" ? "कॉपी!" : "Copied!")
                                    : (language === "hi" ? "साझा करें" : "Share")
                                  }
                                </span>
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
                                className={`p-2 rounded-xl border transition duration-150 flex items-center justify-center cursor-pointer ${
                                  toggledTranslates[service.id]
                                    ? "bg-orange-50 text-orange-600 border-orange-250 font-bold"
                                    : "bg-stone-50 hover:bg-stone-100 text-stone-555 border-stone-200"
                                }`}
                                title={
                                  toggledTranslates[service.id]
                                    ? (language === "hi" ? "मूल भाषा में देखें" : "Show original English")
                                    : (language === "hi" ? "हिंदी में अनुवाद करें" : `Translate to ${language === "en" ? "Hindi" : "selected language"}`)
                                }
                              >
                                <Languages className={`w-4.5 h-4.5 ${toggledTranslates[service.id] ? "text-orange-500 font-bold" : "text-stone-400"}`} />
                                <span className="text-[10px] font-bold font-sans ml-1">
                                  {toggledTranslates[service.id]
                                    ? (language === "hi" ? "English" : "Original")
                                    : (language === "hi" ? "अनुवाद" : "Translate")
                                  }
                                </span>
                              </button>

                              {/* Service Specific Bookmark Button */}
                              <button
                                type="button"
                                onClick={(e) => handleToggleSave(service.id, e)}
                                className={`p-2 rounded-xl border transition duration-150 flex items-center justify-center cursor-pointer whitespace-nowrap ${
                                  savedIds.includes(service.id)
                                    ? "bg-amber-50 text-amber-600 border-amber-250 font-semibold"
                                    : "bg-stone-50 hover:bg-stone-100 text-stone-555 border-stone-200"
                                }`}
                                title={savedIds.includes(service.id) ? (language === "hi" ? "सहेजा गया" : "Saved") : (language === "hi" ? "सहेजें" : "Save")}
                              >
                                <Bookmark className={`w-4 h-4 ${savedIds.includes(service.id) ? "fill-amber-500 text-amber-500" : "text-stone-400"}`} />
                                <span className="text-[10px] font-bold font-sans ml-1">
                                  {savedIds.includes(service.id)
                                    ? (language === "hi" ? "सहेजा" : "Saved")
                                    : (language === "hi" ? "सहेजें" : "Save")
                                  }
                                </span>
                              </button>

                              {/* Service Specific Feedback Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onFeedbackClick) onFeedbackClick(service);
                                }}
                                className="p-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-250 transition duration-150 flex items-center justify-center cursor-pointer text-stone-555 whitespace-nowrap"
                                title={language === "hi" ? "प्रतिक्रिया दें" : "Give Feedback"}
                              >
                                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                                <span className="text-[10px] font-bold font-sans ml-1">
                                  {language === "hi" ? "फीडबैक" : "Feedback"}
                                </span>
                              </button>

                              {/* Service Specific Report Issue Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onReportIssueClick) onReportIssueClick(service);
                                }}
                                className="p-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-250 transition duration-150 flex items-center justify-center cursor-pointer text-stone-555 whitespace-nowrap"
                                title={language === "hi" ? "त्रुटि या टूटी लिंक की रिपोर्ट करें" : "Report incorrect info or broken link"}
                              >
                                <AlertTriangle className="w-4 h-4 text-rose-500" />
                                <span className="text-[10px] font-bold font-sans ml-1">
                                  {language === "hi" ? "रिपोर्ट" : "Report"}
                                </span>
                              </button>

                              {/* Service Specific Donate Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onDonateClick) onDonateClick(service);
                                }}
                                className="p-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-red-550/40 hover:text-red-600 hover:border-red-250 transition duration-150 flex items-center justify-center cursor-pointer text-stone-555 whitespace-nowrap"
                                title={language === "hi" ? "कल्याण अभियान दान" : "Donate & Support Welfare"}
                              >
                                <Heart className="w-4 h-4 text-red-500 fill-red-400 animate-pulse" />
                                <span className="text-[10px] font-bold font-sans ml-1">
                                  {language === "hi" ? "योगदान" : "Donate"}
                                </span>
                              </button>

                              {/* Service Specific View Workflow Button */}
                              <button
                                type="button"
                                onClick={(e) => handleOpenWorkflow(service, e)}
                                className="p-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:text-emerald-750 hover:border-emerald-250 transition duration-150 flex items-center justify-center cursor-pointer text-stone-555 whitespace-nowrap"
                                title={language === "hi" ? "आवेदन प्रक्रिया प्रवाह आरेख देखें" : "View application process workflow flowchart"}
                                id={`catalog-view-workflow-btn-${service.id}`}
                              >
                                <Compass className="w-4 h-4 text-emerald-600" />
                                <span className="text-[10px] font-bold font-sans ml-1">
                                  {language === "hi" ? "वर्कफ़्लो" : "Workflow"}
                                </span>
                              </button>

                              {/* Service Specific Quick Apply Button */}
                              <button
                                type="button"
                                onClick={(e) => handleOpenQuickApply(service, e)}
                                className="p-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-750 hover:border-emerald-350 transition duration-150 flex items-center justify-center cursor-pointer whitespace-nowrap shadow-3xs"
                                title={language === "hi" ? "त्वरित आवेदन और इंटरैक्टिव ट्यूटोरियल" : "Interactive guide for instant validation & quick apply steps"}
                                id={`catalog-quick-apply-btn-${service.id}`}
                              >
                                <Sparkles className="w-4 h-4 text-emerald-605 animate-pulse" />
                                <span className="text-[10px] font-bold font-sans ml-1">
                                  {language === "hi" ? "त्वरित गाइड" : "Quick Apply"}
                                </span>
                              </button>

                              <div className="font-mono text-xs">
                                <span className="text-stone-450 text-[10.5px] block leading-none">{language === "hi" ? "आधिकारिक शुल्क" : "Official Govt Fee"}</span>
                                <strong className="text-stone-850 text-xs font-sans font-black block mt-0.5">
                                  {service.fees === 0 ? (language === "hi" ? "निःशुल्क" : "Free") : `₹ ${service.fees}`}
                                </strong>
                              </div>
                            </div>

                            <button
                              onClick={() => handleApplyClick(service)}
                              className="px-4 py-2 bg-brand-coral hover:bg-brand-coral-hover active:scale-95 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                            >
                              {language === "hi" ? "मार्गदर्शिका और दस्तावेज़" : "Guide & Docs"} <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* AdSense Placement */}
          <AdSenseUnit id="catalog-bottom" format="inline" slotId="8472910542" />

          {/* Pro tip */}
          <div className="p-4 rounded-2xl bg-brand-cream-card border border-[#E5E2D9] flex items-start gap-3 shadow-2xs">
            <Info className="w-5 h-5 text-brand-coral shrink-0 mt-0.5" />
            <div className="text-[11.5px] text-stone-700 leading-relaxed font-sans">
              <strong>{language === "hi" ? "💡 नागरिकों के लिए उपयोगी सुझाव:" : "💡 Pro Tip for Indian Citizens:"}</strong> {t("directory.pro_tip_desc")}
            </div>
          </div>

          {/* Visual Workflow Overlay Dialog */}
          {selectedWorkflowService && (() => {
            const steps = getServiceWorkflow(selectedWorkflowService);
            const totalSteps = steps.length;
            const completedCount = steps.reduce((sum, step) => {
              const key = `${selectedWorkflowService.id}-${step.id}`;
              return sum + (checkedWorkflowSteps[key] ? 1 : 0);
            }, 0);
            const percentCompleted = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

            const getStepIconComponent = (type: string) => {
              switch (type) {
                case "document":
                  return FileSignature;
                case "payment":
                  return Banknote;
                case "biometric":
                  return UserCheck;
                case "office":
                  return Landmark;
                case "dispatch":
                  return MapPin;
                case "digital":
                  return Globe;
                case "status":
                default:
                  return Clock;
              }
            };

            return (
              <div 
                className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
                onClick={() => setSelectedWorkflowService(null)}
                id="workflow-modal-backdrop"
              >
                <div 
                  className="bg-[#FAF9F5] w-full max-w-2xl rounded-3xl border border-[#E9E6DC] shadow-2xl relative overflow-hidden flex flex-col my-8 animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                  id="workflow-modal-card"
                >
                  {/* Decorative background accent */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 animate-pulse"></div>
                  
                  {/* Header */}
                  <div className="p-6 md:p-8 pb-4 border-b border-stone-200/60 flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold font-mono uppercase tracking-wider border ${getCategoryTheme(selectedWorkflowService.category, selectedWorkflowService.title)}`}>
                          {getCategoryLabel(selectedWorkflowService)}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full select-none">
                          <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{language === "hi" ? "त्वरित मार्गदर्शन" : "Interactive Guide"}</span>
                        </span>
                      </div>
                      <h3 className="font-display font-black text-slate-950 text-base md:text-lg leading-tight">
                        {selectedWorkflowService.title}
                      </h3>
                      <p className="text-[10px] font-bold tracking-tight text-stone-400 font-mono uppercase">
                        {selectedWorkflowService.department}
                      </p>
                    </div>

                    <button 
                      onClick={() => setSelectedWorkflowService(null)}
                      className="p-2 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition cursor-pointer shrink-0 animate-scale"
                      title={language === "hi" ? "बंद करें" : "Close"}
                      id="workflow-modal-close-btn"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 md:p-8 pt-4 pb-6 space-y-6 overflow-y-auto max-h-[60vh] scrollbar-thin">
                    
                    {/* Interactive workflow progress summary card */}
                    <div className="p-4 rounded-2xl bg-white border border-stone-200/50 shadow-3xs space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-800 font-sans select-none">
                        <span>{language === "hi" ? "आवेदन प्रगति स्तर" : "Application Setup Steps Progress"}</span>
                        <span className="text-emerald-700 font-mono text-[11px] font-bold">{completedCount}/{totalSteps} {language === "hi" ? "पूर्ण" : "Completed"} ({percentCompleted}%)</span>
                      </div>
                      
                      {/* Interactive Progress Bar */}
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden select-none">
                        <div 
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentCompleted}%` }}
                        ></div>
                      </div>

                      <p className="text-[10.5px] text-stone-500 leading-relaxed font-sans">
                        {language === "hi" 
                          ? "नीचे दिए गए चरणों के चक्र को अपनी तैयारी के अनुसार चिह्नित (चेक) करें।" 
                          : "Tip: Mark each milestone as completed to monitor your progress in this specific checklist pipeline."}
                      </p>
                    </div>

                    {/* Step-by-Step connected visual timeline flowchart */}
                    <div className="relative pl-4 space-y-6" id="workflow-flowchart-stepper">
                      
                      {/* Visual connecting trace line */}
                      <div className="absolute top-2 left-[19px] bottom-6 w-0.5 border-l-2 border-dashed border-stone-200/80"></div>

                      {steps.map((step) => {
                        const stepKey = `${selectedWorkflowService.id}-${step.id}`;
                        const isStepChecked = !!checkedWorkflowSteps[stepKey];
                        const StepIconComponent = getStepIconComponent(step.type);
                        const stepTitle = language === "hi" ? step.titleHi : step.titleEn;
                        const stepDesc = language === "hi" ? step.descHi : step.descEn;
                        const stepDuration = language === "hi" ? step.durationHi : step.durationEn;

                        return (
                          <div 
                            key={step.id} 
                            className="relative flex gap-4 items-start group transition"
                            id={`workflow-item-step-${step.id}`}
                          >
                            {/* Step circle node pointer */}
                            <button
                              type="button"
                              onClick={() => handleToggleWorkflowStep(selectedWorkflowService.id, step.id)}
                              className={`z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition duration-200 shrink-0 cursor-pointer shadow-3xs hover:scale-105 ${
                                isStepChecked 
                                  ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-100" 
                                  : "bg-white border-stone-250 text-stone-500 hover:border-emerald-500"
                              }`}
                              title={language === "hi" ? "पूर्ण मार्क करें" : "Toggle completed milestone status"}
                            >
                              {isStepChecked ? (
                                <Check className="w-4.5 h-4.5 stroke-[3px]" />
                              ) : (
                                <StepIconComponent className="w-4.5 h-4.5" />
                              )}
                            </button>

                            {/* Step Description Card */}
                            <div 
                              onClick={() => handleToggleWorkflowStep(selectedWorkflowService.id, step.id)}
                              className={`flex-1 p-4 rounded-2xl border transition duration-200 cursor-pointer text-left select-none ${
                                isStepChecked 
                                  ? "bg-emerald-50/40 border-emerald-100/60 shadow-2xs" 
                                  : "bg-white border-stone-200 hover:border-stone-250 hover:bg-stone-50/40"
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                <h4 className={`text-xs font-extrabold leading-tight ${isStepChecked ? "text-emerald-950 line-through decoration-emerald-200/60" : "text-[#111111]"}`}>
                                  {step.id}. {stepTitle}
                                </h4>
                                <span className={`flex items-center gap-1 text-[9px] font-bold font-mono tracking-tight uppercase px-1.5 py-0.5 rounded ${
                                  isStepChecked 
                                    ? "bg-emerald-100/70 text-emerald-800" 
                                    : "bg-stone-100 text-stone-500"
                                }`}>
                                  <Clock className="w-3 h-3 shrink-0" />
                                  <span>{stepDuration}</span>
                                </span>
                              </div>

                              <p className={`text-[11px] leading-relaxed ${isStepChecked ? "text-emerald-900/75" : "text-stone-605"}`}>
                                {stepDesc}
                              </p>
                              
                              <div className="flex items-center justify-end mt-2 select-none">
                                <span className={`text-[9.5px] font-bold font-mono uppercase tracking-wider ${isStepChecked ? "text-emerald-700" : "text-stone-400 group-hover:text-emerald-600 transition"}`}>
                                  {isStepChecked ? (language === "hi" ? "✓ पूर्ण सहेजा" : "✓ COMPLETED") : (language === "hi" ? "मार्क करें" : "MARK DONE")}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    </div>

                    {/* All Steps Completed Congratulations celebration banner */}
                    {completedCount === totalSteps && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-150 flex items-start gap-3 shadow-2xs animate-pulse">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <h5 className="font-extrabold text-emerald-900 text-xs">
                            {language === "hi" ? "बधाई हो! सारी प्रक्रिया पूरी हो चुकी है।" : "Congratulations! All process milestones completed."}
                          </h5>
                          <p className="text-[10.5px] text-emerald-800 leading-normal">
                            {language === "hi" 
                              ? "आपके पास सभी आवश्यक दस्तावेज एवं स्वीकृतियां तैयार हैं। अब आप पूरे आत्मविश्वास के साथ आधिकारिक पोर्टल पर आवेदन कर सकते हैं।" 
                              : "You are fully prepared! Continue to the official government portal to submit your pre-filled files."}
                          </p>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Actions footer */}
                  <div className="p-6 md:p-8 pt-4 bg-stone-50/60 border-t border-stone-250/50 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-3xl">
                    <button
                      type="button"
                      onClick={() => setSelectedWorkflowService(null)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-250 text-stone-700 hover:bg-stone-100 text-xs font-bold transition cursor-pointer text-center"
                      id="workflow-modal-dismiss-btn"
                    >
                      {language === "hi" ? "वापस जाएं" : "Go Back"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleApplyClick(selectedWorkflowService);
                        setSelectedWorkflowService(null);
                      }}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-coral hover:bg-brand-coral-hover text-white text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95 text-center shadow-xs"
                      id="workflow-modal-start-application-btn"
                    >
                      {language === "hi" ? "आधिकारिक पोर्टल पर फॉर्म भरें" : "Proceed to Official Portal"} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })()}

          {/* Quick Apply Tutorial Overlay Modal */}
          {selectedQuickApplyService && (() => {
            const steps = getServiceTutorial(selectedQuickApplyService);
            const totalSteps = steps.length;
            const currentStepData = steps[quickApplyStep] || steps[0];
            const isFirstStep = quickApplyStep === 0;
            const isLastStep = quickApplyStep === totalSteps - 1;

            return (
              <div 
                className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
                onClick={() => setSelectedQuickApplyService(null)}
                id="quick-apply-modal-backdrop"
              >
                <div 
                  className="bg-[#FAF9F5] w-full max-w-4xl rounded-3xl border border-[#E9E6DC] shadow-2xl relative overflow-hidden flex flex-col my-4 md:my-8 animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                  id="quick-apply-modal-card"
                >
                  {/* Top glowing strip */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 animate-pulse"></div>

                  {/* Header */}
                  <div className="p-5 md:p-6 pb-3 border-b border-stone-200/60 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold font-mono uppercase tracking-wider border ${getCategoryTheme(selectedQuickApplyService.category, selectedQuickApplyService.title)}`}>
                          {getCategoryLabel(selectedQuickApplyService)}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full select-none border border-emerald-100">
                          <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{language === "hi" ? "त्वरित मार्गदर्शन" : "Interactive Guide"}</span>
                        </span>
                      </div>
                      <h3 className="font-display font-black text-slate-950 text-base md:text-lg leading-tight">
                        {selectedQuickApplyService.title} — {language === "hi" ? "त्वरित आवेदन गाइड" : "Quick Apply Tutorial"}
                      </h3>
                      <p className="text-[10.5px] font-medium text-stone-500">
                        {language === "hi" 
                          ? "इस सेवा के आवेदन को सफलतापूर्वक पूरा करने के लिए हमारे इंटरैक्टिव ट्यूटोरियल का अनुसरण करें।" 
                          : "Follow our interactive step-by-step walkthrough tutorial to confidently navigate and file this portal form."}
                      </p>
                    </div>

                    <button 
                      onClick={() => setSelectedQuickApplyService(null)}
                      className="p-1.5 md:p-2 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-555 hover:text-stone-850 transition cursor-pointer shrink-0"
                      title={language === "hi" ? "बंद करें" : "Close Tutorial"}
                      id="quick-apply-close-btn"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Stepper Progress Bar Block */}
                  <div className="bg-stone-50/60 border-b border-stone-200/30 px-6 py-4">
                    <div className="max-w-2xl mx-auto relative flex items-center justify-between">
                      {/* Connecting progress track line */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-stone-250 z-0">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${(quickApplyStep / (totalSteps - 1)) * 100}%` }}
                        ></div>
                      </div>

                      {steps.map((st, idx) => {
                        const isCurrent = idx === quickApplyStep;
                        const isPassed = idx < quickApplyStep;

                        return (
                          <button
                            key={st.id}
                            onClick={() => setQuickApplyStep(idx)}
                            className="relative z-10 focus:outline-none flex flex-col items-center group cursor-pointer"
                            title={`Step ${idx + 1}`}
                          >
                            <span 
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-xs border-2 transition-all ${
                                isCurrent 
                                  ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100 scale-110" 
                                  : isPassed
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "bg-white border-stone-300 text-stone-500 group-hover:border-stone-400"
                              }`}
                            >
                              {isPassed ? <Check className="w-4 h-4 stroke-[2.5px]" /> : idx + 1}
                            </span>
                            <span className="mt-1.5 hidden md:block text-[10px] font-bold tracking-tight text-center text-stone-500 max-w-[120px] truncate">
                              {language === "hi" ? st.titleHi : st.titleEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tutorial Main Split Section */}
                  <div className="p-5 md:p-6 flex-1 overflow-y-auto max-h-[60vh] grid grid-cols-1 md:grid-cols-12 gap-6 scrollbar-thin">
                    
                    {/* Left Column (Col span: 7) */}
                    <div className="md:col-span-7 flex flex-col justify-between space-y-5">
                      
                      <div className="space-y-4">
                        {/* Step Label Badging */}
                        <div className="flex items-center gap-1.5 select-none">
                          <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200/60 font-mono text-[9px] font-extrabold text-amber-700 tracking-wider uppercase">
                            {language === "hi" ? `चरण ${quickApplyStep + 1}` : `Step ${quickApplyStep + 1}`}
                          </span>
                          <span className="text-[10px] font-mono text-stone-400 font-bold">
                            / {totalSteps} {language === "hi" ? "कुल चरण" : "Total Steps"}
                          </span>
                        </div>

                        {/* Step Title Header */}
                        <div>
                          <h4 className="font-display font-black text-stone-900 text-base md:text-lg tracking-tight leading-tight">
                            {language === "hi" ? currentStepData.titleHi : currentStepData.titleEn}
                          </h4>
                          <p className="text-xs text-stone-605 leading-relaxed mt-1.5">
                            {language === "hi" ? currentStepData.descriptionHi : currentStepData.descriptionEn}
                          </p>
                        </div>

                        {/* Interactive Verification Checks */}
                        <div className="p-4 rounded-2xl bg-white border border-stone-200/60 shadow-3xs space-y-2.5">
                          <h5 className="text-[11px] font-extrabold text-[#111111] uppercase tracking-wide flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>{language === "hi" ? currentStepData.checklistLabelHi : currentStepData.checklistLabelEn}</span>
                          </h5>
                          <div className="space-y-2">
                            {(language === "hi" ? currentStepData.checklistHi : currentStepData.checklistEn).map((checkItem, checkIdx) => (
                              <label 
                                key={checkIdx} 
                                className="flex items-start gap-2.5 cursor-pointer text-left select-none text-stone-705 hover:text-stone-900 transition"
                              >
                                <input 
                                  type="checkbox" 
                                  className="mt-0.5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                                  defaultChecked={false}
                                />
                                <span className="text-[11px] leading-tight font-sans">
                                  {checkItem}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Pro Tip Callout Card */}
                      <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-150 flex items-start gap-2.5 text-left">
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <strong className="text-[10px] uppercase font-bold text-amber-800 tracking-wider font-mono block">
                            {language === "hi" ? "विशेष सुझाव (Pro Tip):" : "Official Pro Tip:"}
                          </strong>
                          <p className="text-[11px] text-amber-900 leading-normal font-sans">
                            {language === "hi" ? currentStepData.proTipHi : currentStepData.proTipEn}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Visual Sandbox Simulator (Col span: 5) */}
                    <div className="md:col-span-5 flex flex-col justify-center items-center">
                      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-5 shadow-xs relative overflow-hidden flex flex-col min-h-[300px] justify-between">
                        
                        {/* Simulation Bar */}
                        <div className="border-b border-stone-100 pb-2.5 flex items-center justify-between select-none">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                          </div>
                          <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                            {language === "hi" ? "लाइव सिमुलेशन" : "Interactive Mockup"}
                          </span>
                        </div>

                        {/* Simulation Graphics */}
                        <div className="my-6 flex-1 flex flex-col justify-center items-center text-center space-y-4">
                          {(() => {
                            switch (quickApplyStep) {
                              case 0:
                                return (
                                  <div className="space-y-3 flex flex-col items-center animate-scale">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-2xs">
                                      <FileSignature className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <div className="space-y-1">
                                      <strong className="text-xs text-stone-800 block">
                                        {language === "hi" ? "दस्तावेज़ संकलन" : "Document Compiling"}
                                      </strong>
                                      <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                                        {language === "hi" ? "सत्यापित" : "READY TO FILE"}
                                      </span>
                                    </div>
                                    <div className="w-36 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                      <div className="w-3/4 h-full bg-emerald-500 animate-pulse"></div>
                                    </div>
                                  </div>
                                );
                              case 1:
                                return (
                                  <div className="space-y-3 flex flex-col items-center animate-scale">
                                    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shadow-2xs">
                                      <Globe className="w-8 h-8 text-amber-600 animate-spin" style={{ animationDuration: '3s' }} />
                                    </div>
                                    <div className="space-y-1">
                                      <strong className="text-xs text-stone-800 block">
                                        {language === "hi" ? "पोर्टल पंजीकरण" : "Portal Form Draft"}
                                      </strong>
                                      <span className="text-[10px] font-mono text-amber-750 font-bold uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                                        {language === "hi" ? "सक्रिय कार्य" : "ACTIVE FILL PREVIEW"}
                                      </span>
                                    </div>
                                    <div className="border border-stone-150 rounded-lg p-2 bg-stone-50/80 w-44 text-left font-mono text-[8px] text-stone-5
                                    00 space-y-1">
                                      <div className="flex justify-between">
                                        <span>&lt;online-portal&gt;</span>
                                        <span className="text-emerald-600">✓ live</span>
                                      </div>
                                      <div className="h-0.5 bg-stone-200 w-full mb-1"></div>
                                      <div>Identity Status: VERIFIED</div>
                                      <div>OTP Delivery: VALIDATED</div>
                                    </div>
                                  </div>
                                );
                              case 2:
                                return (
                                  <div className="space-y-3 flex flex-col items-center animate-scale">
                                    <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shadow-2xs">
                                      <Banknote className="w-8 h-8 text-rose-600" />
                                    </div>
                                    <div className="space-y-1">
                                      <strong className="text-xs text-stone-800 block">
                                        {language === "hi" ? "सुरक्षित गेटवे" : "Fee Processing"}
                                      </strong>
                                      <span className="text-[10px] font-mono text-rose-600 font-bold uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded">
                                        {language === "hi" ? "सफल भुगतान" : "GATEWAY: APPROVED"}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-stone-400">
                                      ID: TXN-SECURE-9051
                                    </span>
                                  </div>
                                );
                              case 3:
                              default:
                                return (
                                  <div className="space-y-3 flex flex-col items-center animate-scale">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-2xs">
                                      <CheckCircle className="w-8 h-8 text-emerald-600 animate-bounce" />
                                    </div>
                                    <div className="space-y-1">
                                      <strong className="text-xs text-stone-800 block">
                                        {language === "hi" ? "अंतिम प्रमाणीकरण" : "Dispatched & Certificate"}
                                      </strong>
                                      <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                                        {language === "hi" ? "सत्यापित प्रमाण पत्र" : "PDF SECURE FILE"}
                                      </span>
                                    </div>
                                    <div className="border border-emerald-200 bg-emerald-50 px-2 py-1 rounded text-[10px] text-emerald-800 font-bold">
                                      {language === "hi" ? "ट्यूटोरियल पूरा हुआ!" : "Guide Completed!"}
                                    </div>
                                  </div>
                                );
                            }
                          })()}
                        </div>

                        {/* Interactive Step Descriptor */}
                        <div className="p-2 border-t border-stone-100 bg-stone-50/70 rounded-xl text-center select-none text-[10.5px] font-serif italic text-stone-555">
                          &ldquo;{language === "hi" ? currentStepData.visualActionHi : currentStepData.visualActionEn}&rdquo;
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* Footers */}
                  <div className="p-5 md:p-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 rounded-b-3xl">
                    
                    <button
                      type="button"
                      onClick={() => setQuickApplyStep(prev => Math.max(0, prev - 1))}
                      disabled={isFirstStep}
                      className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition select-none ${
                        isFirstStep 
                          ? "bg-transparent text-stone-300 border-none cursor-not-allowed" 
                          : "bg-white border border-stone-250 text-stone-700 hover:bg-stone-100 cursor-pointer"
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> {language === "hi" ? "पिछला" : "Previous"}
                    </button>

                    <div className="hidden sm:block text-[11px] font-bold font-mono text-stone-400">
                      {language === "hi" ? "चरण प्रगति" : "Walkthrough Progress"}: {Math.round(((quickApplyStep + 1) / totalSteps) * 100)}%
                    </div>

                    {isLastStep ? (
                      <button
                        type="button"
                        onClick={() => {
                          handleMarkTutorialComplete(selectedQuickApplyService.id);
                          handleApplyClick(selectedQuickApplyService);
                          setSelectedQuickApplyService(null);
                        }}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-100/50"
                        id="quick-apply-finish-btn"
                      >
                        {language === "hi" ? "समाप्त और अधिकारिक पोर्टल पर जाएं" : "Finish & Proceed to Portal"} <CheckCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setQuickApplyStep(prev => prev + 1)}
                        className="px-5 py-2 bg-brand-coral hover:bg-brand-coral-hover text-white font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                        id="quick-apply-next-btn"
                      >
                        {language === "hi" ? "आगे बढ़ें" : "Next Milestone"} <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                  </div>

                </div>
              </div>
            );
          })()}

        </div>
      )}

    </div>
  );
}
