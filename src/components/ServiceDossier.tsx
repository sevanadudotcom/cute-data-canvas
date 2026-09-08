import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, FileText, CheckCircle2, Clock, ShieldCheck, HelpCircle, 
  MapPin, Phone, Mail, Globe, Send, Share2, CornerDownRight, Info, 
  ExternalLink, Download, CreditCard, Landmark, Users, Building, AlertTriangle, Scroll,
  Bookmark, ChevronDown, Check, MessageSquare, Copy, RefreshCw, Sparkles,
  Wifi, WifiOff, Database, ClipboardCheck, Upload, Printer, ArrowRight
} from "lucide-react";
import { ESevaService } from "../types";
import { JURISDICTIONS, officialServicesList } from "../services-data";
import { DOCUMENTS_REGISTRY } from "./documents-registry-data";
import { getApiUrl } from "../lib/api";

interface ServiceDossierProps {
  service: ESevaService;
  language: string;
  onBack: () => void;
  triggerToast: (msg: string, type?: "success" | "info" | "error") => void;
  savedServiceIds?: string[];
  onToggleSave?: (serviceId: string) => void;
  onSelectService?: (service: ESevaService) => void;
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  bn: "Bengali"
};

export default function ServiceDossier({
  service,
  language,
  onBack,
  triggerToast,
  savedServiceIds,
  onToggleSave,
  onSelectService
}: ServiceDossierProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "centers" | "support" | "procedure" | "form">("overview");
  const [pincodeQuery, setPincodeQuery] = useState("");
  const [searchedCenters, setSearchedCenters] = useState<any[]>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqHelpfulVotes, setFaqHelpfulVotes] = useState<Record<number, boolean>>({});

  // Compute 2 related services from the same department
  const relatedServices = useMemo(() => {
    const currentId = service.id;
    const currentDept = (service.department || "").toLowerCase().trim();
    const currentCat = service.category;

    // Extract core tokens from department string (words > 3 chars, excluding generic stop words)
    const stopWords = new Set(["department", "government", "govt", "bureau", "authority", "office", "nodal", "portal", "state", "civil", "welfare", "india", "services"]);
    const deptTokens = currentDept
      .replace(/[^a-zA-Z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(t => t.length > 3 && !stopWords.has(t.toLowerCase()));

    // 1. Exact department match
    let matches = officialServicesList.filter(
      s => s.id !== currentId && (s.department || "").toLowerCase().trim() === currentDept
    );

    // 2. Partial department match
    if (matches.length < 2) {
      const partialMatches = officialServicesList.filter(s => {
        if (s.id === currentId || matches.some(m => m.id === s.id)) return false;
        const otherDept = (s.department || "").toLowerCase();
        return deptTokens.some(token => otherDept.includes(token));
      });
      matches = [...matches, ...partialMatches];
    }

    // 3. Same category match
    if (matches.length < 2) {
      const categoryMatches = officialServicesList.filter(s => {
        if (s.id === currentId || matches.some(m => m.id === s.id)) return false;
        return s.category === currentCat;
      });
      matches = [...matches, ...categoryMatches];
    }

    // 4. Fallback to any other official service
    if (matches.length < 2) {
      const fallbackMatches = officialServicesList.filter(
        s => s.id !== currentId && !matches.some(m => m.id === s.id)
      );
      matches = [...matches, ...fallbackMatches];
    }

    return matches.slice(0, 2);
  }, [service]);

  // On-Demand Translation States
  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Active step progress tracking
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Interactive Checklist for Required Documents
  const [preparedDocs, setPreparedDocs] = useState<Record<string, boolean>>({});

  // Load prepared documents state for this service from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`sewanadu_prepared_docs_${service.id}`);
      if (stored) {
        setPreparedDocs(JSON.parse(stored));
      } else {
        setPreparedDocs({});
      }
    } catch (e) {
      console.error("Failed to load prepared documents", e);
      setPreparedDocs({});
    }
  }, [service.id]);

  // Handle toggling of a document's checklist state
  const handleToggleDoc = (docKey: string, docName: string) => {
    const updated = {
      ...preparedDocs,
      [docKey]: !preparedDocs[docKey]
    };
    setPreparedDocs(updated);
    try {
      localStorage.setItem(`sewanadu_prepared_docs_${service.id}`, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save prepared documents", e);
    }
    
    if (updated[docKey]) {
      triggerToast(
        language === "hi" 
          ? `दस्तावेज चिह्नित: ${docName}` 
          : `Document marked as prepared: ${docName}`,
        "success"
      );
    } else {
      triggerToast(
        language === "hi" 
          ? `दस्तावेज अचिह्नित: ${docName}` 
          : `Document removed from prepared list: ${docName}`,
        "info"
      );
    }
  };

  // Live Interactive Application Form States
  const [formData, setFormData] = useState({
    fullName: "",
    guardianName: "",
    dob: "",
    gender: "MALE",
    mobile: "",
    email: "",
    state: "Tamil Nadu",
    district: "Chennai",
    pincode: "",
    fullAddress: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { name: string; size: string }>>({});
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [submittedArn, setSubmittedArn] = useState<string | null>(null);
  const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);
  const [formStep, setFormStep] = useState<"details" | "docs">("details");

  // Connection & Offline Caching states
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [isOfflineCached, setIsOfflineCached] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerToast(
        language === "hi" ? "कनेक्टिविटी बहाल! आप ऑनलाइन हैं।" : "Connection restored! You are online.",
        "success"
      );
    };
    const handleOffline = () => {
      setIsOnline(false);
      triggerToast(
        language === "hi" ? "आप ऑफलाइन हैं। ऑफ़लाइन मोड सक्रिय।" : "Connection lost! Running in offline mode.",
        "error"
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [language]);

  useEffect(() => {
    try {
      const cachedData = localStorage.getItem("sewanadu_offline_services");
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setIsOfflineCached(!!parsed[service.id]);
      } else {
        setIsOfflineCached(false);
      }
    } catch (err) {
      console.error("Error reading offline cache", err);
    }
  }, [service.id]);

  const handleToggleOfflineCache = () => {
    try {
      const cachedData = localStorage.getItem("sewanadu_offline_services") || "{}";
      const parsed = JSON.parse(cachedData);
      
      if (isOfflineCached) {
        delete parsed[service.id];
        localStorage.setItem("sewanadu_offline_services", JSON.stringify(parsed));
        setIsOfflineCached(false);
        triggerToast(
          language === "hi" 
            ? "दस्तावेज ऑफलाइन सहेजे गए से हटा दिया गया।" 
            : "Service dossier removed from offline cache.",
          "info"
        );
      } else {
        parsed[service.id] = {
          id: service.id,
          title: service.title,
          description: service.description,
          department: service.department,
          category: service.category,
          processingTime: service.processingTime,
          fees: service.fees,
          documentsRequired: service.documentsRequired,
          launchUrlName: service.launchUrlName,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem("sewanadu_offline_services", JSON.stringify(parsed));
        setIsOfflineCached(true);
        triggerToast(
          language === "hi" 
            ? "दस्तावेज ऑफलाइन उपयोग के लिए सफलतापूर्वक सहेज लिया गया!" 
            : "Dossier checklist saved successfully for offline use!",
          "success"
        );
      }
    } catch (err) {
      console.error("Error toggling offline cache", err);
      triggerToast(
        language === "hi" 
          ? "ऑफ़लाइन सहेजने में विफल। कृपया पुनः प्रयास करें।" 
          : "Failed to save offline. Please try again.",
        "error"
      );
    }
  };

  useEffect(() => {
    setTranslatedDescription(null);
    setTranslationError(null);
    setCurrentStepIndex(0);
  }, [service.id]);

  const handleTranslateDescription = async () => {
    if (isTranslating) return;
    setIsTranslating(true);
    setTranslationError(null);

    const langNames: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      ta: "Tamil",
      te: "Telugu",
      bn: "Bengali"
    };

    const targetLang = langNames[language] || "English";

    try {
      const resp = await fetch(getApiUrl("/api/eseva/translate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: service.description,
          targetLanguage: targetLang
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        setTranslatedDescription(data.translatedText);
        triggerToast(
          language === "hi" 
            ? "विवरण का अनुवाद सफलतापूर्वक किया गया!" 
            : `Description translated to ${targetLang} successfully!`,
          "success"
        );
      } else {
        throw new Error("Translation failed");
      }
    } catch (err: any) {
      console.error("Translation error:", err);
      setTranslationError(err.message || "Failed to translate");
      triggerToast(
        language === "hi"
          ? "अनुवाद विफल रहा। कृपया पुनः प्रयास करें।"
          : "Translation failed. Please try again shortly.",
        "error"
      );
    } finally {
      setIsTranslating(false);
    }
  };

  // Google Search Grounding Verification States
  const [isVerifying, setIsVerifying] = useState(false);
  const [liveVerificationResult, setLiveVerificationResult] = useState<string | null>(null);
  const [liveSources, setLiveSources] = useState<{ title: string; url: string }[] | null>(null);

  const handleVerifyLive = async () => {
    setIsVerifying(true);
    setLiveVerificationResult(null);
    setLiveSources(null);
    
    const prompt = `Search for the absolute latest 2026 official Indian government rules, guidelines, documents required, and current fees for the service: "${service.title}" of department "${service.department}". Provide a crisp, structured summary with bullet points. Highlight if there are any specific 2026 updates, policy changes, or state-specific amendments. Be very concise, under 180 words.`;

    try {
      const resp = await fetch(getApiUrl("/api/eseva/chatbot"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [{ role: "user", text: prompt }], 
          useSearch: true 
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        setLiveVerificationResult(data.text);
        setLiveSources(data.sources || []);
        triggerToast(
          language === "hi" 
            ? "गूगल सर्च द्वारा लाइव डेटा सफलतापूर्वक सत्यापित किया गया!" 
            : "Successfully verified live data via Google Search Grounding!", 
          "success"
        );
      } else {
        throw new Error("Failed response");
      }
    } catch (err) {
      console.error(err);
      triggerToast(
        language === "hi" 
          ? "सत्यापन में विफल। कृपया पुनः प्रयास करें।" 
          : "Verification failed. Please try again shortly.", 
        "error"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  // Active sync with main app eseva_checked_docs readiness checklist
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("eseva_checked_docs");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggleDocCheckbox = (docName: string) => {
    const key = `${service.id}-${docName}`;
    setCheckedDocs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("eseva_checked_docs", JSON.stringify(updated));
      } catch (e) {
        console.warn("Storage write failed", e);
      }
      return updated;
    });
  };

  const checkedCountInDossier = useMemo(() => {
    return service.documentsRequired.reduce((count, doc) => {
      return count + (checkedDocs[`${service.id}-${doc}`] ? 1 : 0);
    }, 0);
  }, [checkedDocs, service]);

  const percentReadyInDossier = useMemo(() => {
    const len = service.documentsRequired.length;
    if (len === 0) return 0;
    return Math.round((checkedCountInDossier / len) * 100);
  }, [checkedCountInDossier, service]);

  // Dynamically computed top 3 most relevant FAQs related to this specific service
  const top3RelevantFaqs = useMemo(() => {
    const sId = (service.id || "").toLowerCase();
    const sTitle = (service.title || "").toLowerCase();
    const sDept = (service.department || "").toLowerCase();
    const isHi = language === "hi";

    // 1. Aadhaar / UIDAI
    if (sId.includes("uidai") || sId.includes("aadhaar") || sTitle.includes("aadhaar")) {
      return [
        {
          rank: "#1 Most Asked",
          tag: isHi ? "समय-सीमा (SLA)" : "Processing SLA & Status",
          q: isHi ? "आधार विवरण (नाम, पता, जन्मतिथि या मोबाइल नंबर) सुधरने में कितना समय लगता है?" : "How long does an Aadhaar demographic or mobile update take?",
          a: isHi 
            ? "नाम, पता एवं जन्मतिथि जैसे जनसांख्यिकी सुधार 5 से 15 कार्य दिवसों में पूर्ण हो जाते हैं। बायोमेट्रिक अपडेट में यूआईडीएआई (UIDAI) द्वारा 30 दिनों का समय लग सकता है। आप अपने 14-अंकीय URN संख्या से लाइव स्टेटस ट्रैक कर सकते हैं।"
            : "Demographic updates (name, address, DOB) are processed within 5–15 working days. Biometric and mobile linking updates may take up to 30 days. You can track status using your 14-digit URN."
        },
        {
          rank: "#2 Center Verification",
          tag: isHi ? "केंद्र उपस्थिति" : "In-Person Center Visit",
          q: isHi ? "क्या बायोमेट्रिक्स या मोबाइल नंबर लिंक कराने के लिए आधार केंद्र जाना अनिवार्य है?" : "Is physical center visit mandatory for biometrics or mobile linking?",
          a: isHi 
            ? "हाँ, सुरक्षा कारणों एवं लाइव उंगलियों/आंखों के स्कैन कैप्चर करने हेतु अधिकृत आधार सेवा केंद्र (ASK) या ई-सेवा केंद्र पर व्यक्तिगत उपस्थिति अनिवार्य है। यह सुविधा ऑनलाइन उपलब्ध नहीं है।"
            : "Yes. Biometric updates (iris/fingerprints) and mobile number linking require live physical authentication at an authorized Aadhaar Seva Kendra (ASK) or CSC desk for security reasons."
        },
        {
          rank: "#3 Legal Validity",
          tag: isHi ? "कानूनी मान्यता" : "e-Aadhaar & DigiLocker",
          q: isHi ? "क्या डाउनलोड किया गया ई-आधार या डिजीलॉकर कॉपी मूल कार्ड जितना ही मान्य है?" : "Is downloaded e-Aadhaar or DigiLocker copy legally equal to the physical card?",
          a: isHi 
            ? "हाँ, आधार अधिनियम 2016 की धारा 4(3) के अनुसार पोर्टल से डाउनलोड किया गया ई-आधार या डिजीलॉकर ई-केवाईसी दस्तावेज़ मूल प्लास्टिक कार्ड के समान ही संपूर्ण भारत में कानूनी रूप से मान्य है।"
            : "Yes. Under Section 4(3) of the Aadhaar Act 2016, a downloaded e-Aadhaar or DigiLocker verified copy holds equal legal validity across all government and private institutions in India."
        }
      ];
    }

    // 2. PAN / Income Tax
    if (sId.includes("pan") || sTitle.includes("pan") || sDept.includes("income tax") || sId.includes("nsdl")) {
      return [
        {
          rank: "#1 Most Asked",
          tag: isHi ? "कानूनी नियम" : "Compliance & Penalty",
          q: isHi ? "क्या एक से अधिक पैन (PAN) कार्ड रखना अवैध है और इस पर क्या जुर्माना है?" : "Is possessing more than one physical PAN card illegal and penalized?",
          a: isHi 
            ? "हाँ, आयकर अधिनियम की धारा 272B के तहत एक से अधिक पैन कार्ड रखना सख्त गैर-कानूनी है। पकड़े जाने पर ₹10,000 का दंडात्मक जुर्माना लागू होगा। अतिरिक्त पैन तुरंत सरेंडर करें।"
            : "Yes. Possessing more than one PAN card is strictly illegal under Section 272B of the Income Tax Act 1961 and attracts a penalty of ₹10,000. Surrender duplicate cards immediately."
        },
        {
          rank: "#2 Instant Delivery",
          tag: isHi ? "ई-पैन बनाम भौतिक कार्ड" : "e-PAN vs Physical Card",
          q: isHi ? "ई-पैन (Instant e-PAN) और प्लास्टिक पैन कार्ड में क्या अंतर है?" : "What is the difference between Instant e-PAN and physical PAN card?",
          a: isHi 
            ? "दोनों की कानूनी मान्यता 100% समान है। ई-पैन आधार ई-केवाईसी द्वारा तुरंत जारी पीडीएफ है, जबकि भौतिक लैमिनेटेड प्लास्टिक कार्ड डाक द्वारा आपके गृह पते पर भेजा जाता है।"
            : "Both hold identical legal validity. Instant e-PAN is a digitally signed PDF issued immediately via Aadhaar e-KYC, while physical laminated cards are printed and mailed to your address."
        },
        {
          rank: "#3 Primary Proof",
          tag: isHi ? "आवश्यक दस्तावेज" : "Mandatory Proofs",
          q: isHi ? "नया पैन कार्ड बनाने या पैन सुधार हेतु कौन सा मुख्य दस्तावेज अनिवार्य है?" : "What primary document is mandatory for a PAN application or correction?",
          a: isHi 
            ? "एक वैध आधार संख्या अनिवार्य है। नाम या जन्मतिथि सुधार हेतु सरकारी राजपत्र (Gazette Notification), विवाह प्रमाण पत्र या मैट्रिक परीक्षा अंकपत्र प्रस्तुत करना होता है।"
            : "A valid Aadhaar Card is strictly mandatory. For name or DOB corrections, official proof such as a Gazette Notification, Marriage Certificate, or School Leaving Certificate is required."
        }
      ];
    }

    // 3. Passport
    if (sId.includes("passport") || sTitle.includes("passport")) {
      return [
        {
          rank: "#1 Most Asked",
          tag: isHi ? "तत्काल योजना" : "Tatkal Expedited Scheme",
          q: isHi ? "तत्काल पासपोर्ट (Tatkal Passport) योजना में पुलिस सत्यापन कब किया जाता है?" : "When does police verification happen in the Tatkal Passport scheme?",
          a: isHi 
            ? "तत्काल योजना के तहत पासपोर्ट 1-3 दिनों में पहले ही जारी कर दिया जाता है, और स्थानीय पुलिस सत्यापन पासपोर्ट प्राप्त होने के बाद (Post-Verification) किया जाता है।"
            : "Under Tatkal, the passport is issued first within 1–3 working days on a post-police verification basis, and local police verification takes place after you receive the booklet."
        },
        {
          rank: "#2 Loss/Damage",
          tag: isHi ? "गुम या क्षतिग्रस्त" : "Lost or Damaged Procedure",
          q: isHi ? "पासपोर्ट खो जाने या क्षतिग्रस्त होने की स्थिति में क्या तत्काल कदम उठाएं?" : "What is the mandatory procedure if a passport is lost or damaged?",
          a: isHi 
            ? "तत्काल पास के पुलिस स्टेशन में एफआईआर (FIR) दर्ज कराएं और पासपोर्ट सेवा पोर्टल पर 'Lost/Damaged Re-issue' श्रेणी में नए पासपोर्ट के लिए आवेदन करें।"
            : "Immediately register a Police FIR and apply for a 'Re-issue of Passport' under the Lost/Damaged category on the official Passport Seva Portal."
        },
        {
          rank: "#3 Address Correction",
          tag: isHi ? "पता संशोधन" : "Address Re-issuance",
          q: isHi ? "क्या पुराने पासपोर्ट पर नया पता स्टिकर लगाकर बदला जा सकता है?" : "Can address be changed on an existing passport without re-issuing?",
          a: isHi 
            ? "नहीं, पता संशोधन के लिए नए पते के प्रमाण के साथ पासपोर्ट 'Re-issue' का आवेदन करना अनिवार्य होता है, जिससे नया पासपोर्ट बुकलेट प्रिंट होता है।"
            : "No. You must apply for a complete passport re-issue with fresh address proof. A new passport booklet with updated details will be printed and dispatched."
        }
      ];
    }

    // 4. Certificates (Caste, Income, Domicile, Residence, Birth, Death)
    if (sId.includes("caste") || sId.includes("income") || sId.includes("domicile") || sId.includes("residence") || sId.includes("birth") || sId.includes("death") || sTitle.includes("caste") || sTitle.includes("income") || sTitle.includes("domicile")) {
      return [
        {
          rank: "#1 Most Asked",
          tag: isHi ? "वैधता समय-सीमा" : "Validity & Expiry Rules",
          q: isHi ? `इस प्रमाणपत्र (${service.title}) की वैधता अवधि कितनी होती है?` : `What is the validity period of this certificate (${service.title})?`,
          a: isHi 
            ? "आय प्रमाणपत्र वित्तीय वर्ष (31 मार्च तक) हेतु मान्य होता है। जाति प्रमाणपत्र (SC/ST) एवं मूल निवास/डोमिसाइल प्रमाणपत्र सामान्यतः आजीवन वैध रहते हैं, जब तक कि राज्य नियमों में बदलाव न हो।"
            : "Income Certificates are valid for 1 financial year (expires March 31st). Domicile and SC/ST Caste Certificates are generally valid for life unless revoked by state authorities."
        },
        {
          rank: "#2 Dual State Restrictions",
          tag: isHi ? "एकल राज्य नियम" : "Single State Domicile Rule",
          q: isHi ? "क्या एक नागरिक दो अलग-अलग राज्यों का मूल निवास/डोमिसाइल बनवा सकता है?" : "Can a citizen hold a Domicile or Residence certificate in two different states?",
          a: isHi 
            ? "नहीं, प्रशासनिक कानूनों के तहत आप एक समय में केवल एक राज्य के मूल निवासी बन सकते हैं। दो राज्यों से डोमिसाइल प्रमाणपत्र बनवाना गैर-कानूनी व दण्डनीय है।"
            : "No. Under Indian administrative laws, a citizen can hold domicile in only one state at a time. Holding dual-state residence certificates is punishable under law."
        },
        {
          rank: "#3 Local Site Inspection",
          tag: isHi ? "पटवारी/तहसील जांच" : "Local Revenue Verification",
          q: isHi ? "क्या प्रमाणपत्र जारी होने से पहले पटवारी या तहसीलदार द्वारा भौतिक सत्यापन होता है?" : "Does local revenue officer (Patwari/Tehsildar) verify details physically?",
          a: isHi 
            ? "हाँ, स्थानीय राजस्व निरीक्षक (पटवारी/लेखपाल) निवास स्थल, संपत्ति एवं आय स्रोतों का भौतिक व अभिलेखीय सत्यापन करने के उपरांत डिजिटल हस्ताक्षर से स्वीकृति प्रदान करते हैं।"
            : "Yes. The local revenue inspector or Patwari verifies physical land records, income sources, and residency claims before approving the digital certificate."
        }
      ];
    }

    // 5. RTO / Driving License / Vehicle
    if (sId.includes("rto") || sId.includes("driving") || sId.includes("dl") || sId.includes("licence") || sId.includes("vehicle") || sTitle.includes("license") || sTitle.includes("driving")) {
      return [
        {
          rank: "#1 Most Asked",
          tag: isHi ? "अखिल भारतीय मान्यता" : "All-India Validity",
          q: isHi ? "क्या एक आरटीओ द्वारा जारी ड्राइविंग लाइसेंस पूरे भारत में मान्य होता है?" : "Is a state RTO-issued driving license valid across all Indian states?",
          a: isHi 
            ? "हाँ, मोटर वाहन अधिनियम 1988 के तहत किसी भी भारतीय क्षेत्रीय परिवहन कार्यालय (RTO) द्वारा जारी स्थायी ड्राइविंग लाइसेंस संपूर्ण भारत क्षेत्र में 100% मान्य है।"
            : "Yes. Under the Motor Vehicles Act 1988, a permanent driving license issued by any Regional Transport Office (RTO) in India is valid across all states and Union Territories."
        },
        {
          rank: "#2 Expiry & Renewal",
          tag: isHi ? "लर्निंग लाइसेंस नियम" : "Learner's License Rules",
          q: isHi ? "यदि 6 महीने का लर्निंग लाइसेंस (Learner's License) समाप्त हो जाए तो क्या करें?" : "What happens if a 6-month Learner's License expires before the driving test?",
          a: isHi 
            ? "लर्निंग लाइसेंस का नवीनीकरण नहीं होता। यदि यह समाप्त हो जाता है, तो आपको शुरुआत से ऑनलाइन स्लॉट बुक कर नया लर्निंग लाइसेंस कंप्यूटर टेस्ट देना होगा।"
            : "Learner's licenses cannot be extended or renewed. Once expired, you must apply for a fresh Learner's License from the beginning, including the slot and online quiz."
        },
        {
          rank: "#3 Fitness Requirement",
          tag: isHi ? "मेडिकल सर्टिफिकेट" : "Medical Fitness Form 1A",
          q: isHi ? "ड्राइविंग लाइसेंस नवीनीकरण हेतु मेडिकल फिटनेस सर्टिफिकेट (Form 1A) कब अनिवार्य है?" : "When is Medical Fitness Form 1A required for driving license renewal?",
          a: isHi 
            ? "40 वर्ष से अधिक आयु के आवेदकों या कमर्शियल (परिवहन) लाइसेंस के नवीनीकरण हेतु पंजीकृत सरकारी डॉक्टर से प्रमाणित फॉर्म 1A संलग्न करना अनिवार्य है।"
            : "Form 1A medical fitness certificate from a registered medical practitioner is mandatory for applicants aged 40+ and for all commercial transport license renewals."
        }
      ];
    }

    // 6. Ration Card / PDS
    if (sId.includes("ration") || sId.includes("pds") || sTitle.includes("ration")) {
      return [
        {
          rank: "#1 Most Asked",
          tag: isHi ? "अंतरराज्यीय राशन पोर्टेबिलिटी" : "Interstate ONORC Scheme",
          q: isHi ? "क्या 'वन नेशन वन राशन कार्ड' के तहत दूसरे राज्य में राशन लिया जा सकता है?" : "Can food grains be availed in another state under One Nation One Ration Card?",
          a: isHi 
            ? "हाँ, 'वन नेशन वन राशन कार्ड' (ONORC) योजना के तहत आप बायोमेट्रिक आधार ई-केवाईसी द्वारा भारत की किसी भी राशन दुकान (Fair Price Shop) से अपना राशन ले सकते हैं।"
            : "Yes. Under the One Nation One Ration Card (ONORC) scheme, beneficiaries can withdraw their entitled food grains from any Fair Price Shop across India using biometric Aadhaar authentication."
        },
        {
          rank: "#2 Head of Family",
          tag: isHi ? "महिला मुखिया नियम" : "Head of Household Rule",
          q: isHi ? "क्या राशन कार्ड में परिवार की वरिष्ठ महिला को मुखिया बनाना अनिवार्य है?" : "Is the eldest female legally required to be the Head of Household on the ration card?",
          a: isHi 
            ? "हाँ, राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA 2013) की धारा 13 के तहत महिला सशक्तिकरण हेतु 18 वर्ष या अधिक आयु की सबसे वरिष्ठ महिला ही आधिकारिक मुखिया दर्ज होती है।"
            : "Yes. Under Section 13 of the National Food Security Act (NFSA) 2013, the eldest woman aged 18+ in a household is designated as the official Head of Household."
        },
        {
          rank: "#3 Member Addition/Deletion",
          tag: isHi ? "सदस्य जोड़ना/हटाना" : "Member Addition/Deletion",
          q: isHi ? "राशन कार्ड में नए शिशु का नाम कैसे जोड़ें या शादी के बाद पुराना नाम कैसे हटाएं?" : "How do I add a newborn or remove a member post-marriage from a ration card?",
          a: isHi 
            ? "नए शिशु हेतु जन्म प्रमाण पत्र व आधार संलग्न करें। शादी के बाद नाम स्थानांतरित करने के लिए पुराने राशन कार्ड से विलोपन प्रमाणपत्र (Deletion Certificate) लेना अनिवार्य है।"
            : "Submit the newborn's Birth Certificate and Aadhaar. For marriage transfers, first obtain an official Deletion Certificate from the previous card before applying for addition."
        }
      ];
    }

    // Default / General dynamic top 3 FAQs for all other e-Services
    return [
      {
        rank: "#1 Most Asked",
        tag: isHi ? "ऑनलाइन ट्रैकिंग" : "Application Status Tracking",
        q: isHi ? `आवेदन जमा करने के बाद ${service.title} की स्थिति कैसे ट्रैक करें?` : `How do I track the status of my application for ${service.title}?`,
        a: isHi 
          ? `आवेदन जमा करने के उपरांत प्राप्त पावती रसीद संख्या (Application Reference Number / ARN) का उपयोग करके आप आधिकारिक ई-डिस्ट्रिक्ट पोर्टल या हमारी एप्लीकेशन में 'Track Status' से रियल-टाइम प्रगति जान सकते हैं।`
          : `Use the Application Reference Number (ARN) provided on your acknowledgment receipt to track real-time progress on the official state e-District or ministry portal.`
      },
      {
        rank: "#2 Document Proof",
        tag: isHi ? "डिजीलॉकर मान्यता" : "DigiLocker Legal Validity",
        q: isHi ? "क्या डिजीलॉकर (DigiLocker) के दस्तावेज़ इस आवेदन हेतु कानूनी रूप से मान्य हैं?" : "Are DigiLocker issued documents legally valid for this application?",
        a: isHi 
          ? "हाँ, सूचना प्रौद्योगिकी अधिनियम 2000 (IT Act) के नियम 9A के तहत डिजीलॉकर ऐप से प्राप्त डिजिटल दस्तावेज़ मूल भौतिक प्रमाणपत्रों के समान ही पूर्ण कानूनी मान्यता रखते हैं।"
          : "Yes. Under Rule 9A of the IT (Preservation and Retention of Information) Rules, documents fetched in DigiLocker are legally treated on par with original physical certificates."
      },
      {
        rank: "#3 SLA & Appeal",
        tag: isHi ? "लोक सेवा गारंटी" : "Public Service Guarantee Act SLA",
        q: isHi ? `यदि निर्धारित ${service.processingTime} समय-सीमा में सेवा न मिले तो कहाँ अपील करें?` : `What recourse is available if processing exceeds the statutory ${service.processingTime} SLA?`,
        a: isHi 
          ? "लोक सेवा गारंटी अधिनियम के अंतर्गत निर्धारित समय-सीमा बीतने पर आप ई-डिस्ट्रिक्ट पोर्टल पर प्रथम अपीलीय अधिकारी (एसडीएम/तहसीलदार) के समक्ष ऑनलाइन शिकायत दर्ज कर सकते हैं।"
          : "Under the Rights to Public Services Act, if processing breaches the statutory SLA limit, you can lodge an online appeal to the designated First Appellate Authority or register a grievance on CPGRAMS."
      }
    ];
  }, [service, language]);

  // Bookmark / Save local fallback and sync
  const [localSavedIds, setLocalSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("sewanadu_saved_services");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const idsToUse = savedServiceIds !== undefined ? savedServiceIds : localSavedIds;
  const isSaved = idsToUse.includes(service.id);

  const handleSaveToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSave) {
      onToggleSave(service.id);
    } else {
      setLocalSavedIds((prev) => {
        const active = prev.includes(service.id);
        const next = active ? prev.filter(id => id !== service.id) : [...prev, service.id];
        try {
          localStorage.setItem("sewanadu_saved_services", JSON.stringify(next));
        } catch (err) {
          console.error(err);
        }
        return next;
      });
    }

    const isNowSaved = !isSaved;
    triggerToast(
      isNowSaved
        ? (language === "hi" ? `दस्तावेज़ "${service.title}" सफलतापूर्वक बुकमार्क किया गया!` : `"${service.title}" added to your saved list!`)
        : (language === "hi" ? `दस्तावेज़ "${service.title}" बुकमार्क से हटाया गया!` : `"${service.title}" removed from your saved list.`),
      "success"
    );
  };

  // Share logic implementation
  const [shareCopied, setShareCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const getShareInfo = () => {
    // Check if we are running in a native Capacitor Android context
    const isCapacitor = 
      typeof window !== "undefined" && 
      (window.location.protocol === "capacitor:" || 
       (window.location.hostname === "localhost" && !window.location.port));

    const baseOrigin = isCapacitor 
      ? "https://ais-dev-gbtjhea2yajsvkljtshvd3-967244605315.asia-southeast1.run.app"
      : window.location.origin;

    const shareUrl = `${baseOrigin}/?service=${service.id}`;
    const shareText = language === "hi" 
      ? `सेवा नाडु (${service.title}) के विवरण और पात्रता मानदंडों की जाँच करें:`
      : `Check out the details & document checklist for "${service.title}" on SewaNadu:`;
    return { shareUrl, shareText };
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { shareUrl, shareText } = getShareInfo();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(whatsappUrl, "_blank");
    triggerToast(
      language === "hi" ? "WhatsApp पर साझा किया जा रहा है..." : "Redirecting to WhatsApp...",
      "success"
    );
    setShowShareMenu(false);
  };

  const handleSMSShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { shareUrl, shareText } = getShareInfo();
    const smsUrl = `sms:?body=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.location.href = smsUrl;
    triggerToast(
      language === "hi" ? "संदेश प्रेषित किया जा रहा है..." : "Opening Messages...",
      "success"
    );
    setShowShareMenu(false);
  };

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { shareUrl, shareText } = getShareInfo();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SewaNadu - ${service.title}`,
          text: shareText,
          url: shareUrl,
        });
        triggerToast(
          language === "hi" ? "सफलतापूर्वक साझा किया गया!" : "Shared successfully!",
          "success"
        );
      } catch (err) {
        // Share cancellation is not an error we need to warn about
        if ((err as Error).name !== "AbortError") {
          console.log("Error sharing natively:", err);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
    setShowShareMenu(false);
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      await handleNativeShare(e);
    } else {
      setShowShareMenu((prev) => !prev);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShareCopied(true);
      triggerToast(
        language === "hi" ? "लिंक क्लिपबोर्ड पर कॉपी किया गया!" : "Link copied to clipboard!",
        "success"
      );
      setTimeout(() => setShareCopied(false), 2000);
    }).catch(() => {
      triggerToast(
        language === "hi" ? "कॉपी करने में विफल!" : "Failed to copy link!",
        "error"
      );
    });
    setShowShareMenu(false);
  };

  // 1. DYNAMIC DOSSIER REINFORCEMENTS ENGINE (Matches all 740+ services programmatically)
  const meta = useMemo(() => {
    const sId = service.id.toLowerCase();
    const title = service.title;
    const cat = service.category;

    // Detect state of origin, if dynamic
    const matchedState = JURISDICTIONS.find(j => sId.startsWith(j.id));
    const isStateService = !!matchedState;
    const regionName = matchedState ? matchedState.name : "Central Govt (India)";

    // Default templates depending on categories
    let agencyName = service.department;
    let agencyRole = "Nodal statutory body overseeing standard documentation under central electronic governance mandates.";
    let address = "Ministry of Electronics & Information Technology, CGO Complex, New Delhi";
    let website = "https://www.india.gov.in";
    let helpline = "1800-111-555";
    let socialX = "@GoI_MeitY";
    let socialTelegram = "https://t.me/eSewaCitizenHelp";
    
    let eligibilityConditions = [
      language === "hi" ? "आवेदक को भारत का वैध नागरिक या निवासी होना चाहिए।" : "Applicant must be a valid resident or citizen of India.",
      language === "hi" ? "दस्तावेज बनाने के लिए आवश्यक जन्म या पते का सहायक प्रमाण उपलब्ध हो।" : "Possession of basic support cert for DOB/Address checks.",
      language === "hi" ? "सभी सहायक संलग्नक डिजिटल नियमों (pdf, jpg < 2MB) के अनुकूल होने चाहिए।" : "Supporting uploads must meet digital scan standards (PDF/JPG < 2MB)."
    ];

    let updateDocuments = [
      language === "hi" ? "मूल पुराने सरकारी दस्तावेज/कार्ड की स्कैन कॉपी।" : "Scanned color copy of the original existing document/certificate.",
      language === "hi" ? "परिवर्तन का कानूनी प्रमाण (उदा. विवाह प्रमाण पत्र या राजपत्र अधिसूचना)।" : "Legal certificate confirming changed parameters (e.g., Marriage Certificate for name changes, Registered Lease/Registry for Address changes).",
      language === "hi" ? "आधार ई-केवाईसी या मोबाइल नंबर बायोमेट्रिक प्रमाणीकरण पर्ची।" : "Aadhaar e-KYC or official biometric authentication verified reference.",
      language === "hi" ? "पते/नाम सुधार हेतु स्व-घोषणा पत्र (अभिलेख संशोधन हेतु)।" : "Self-declaration affidavit confirming the veracity of revised fields."
    ];

    let tatkalOption = {
      available: false,
      time: "N/A",
      extraFee: 0,
      description: "Standard processing is expedited automatically under Public Services Guarantee Act SLAs."
    };

    let faqs = [
      {
        q: language === "hi" ? "आवेदन जमा करने के बाद उसकी स्थिति कैसे ट्रैक करें?" : "How do I track the status of my application after submission?",
        a: language === "hi" 
          ? "आप आवेदन जमा करने के बाद जनरेट हुए रसीद संख्या (Application Reference Number) का उपयोग करके संबंधित राज्य या केंद्रीय पोर्टल पर रियल-टाइम स्थिति ट्रैक कर सकते हैं।"
          : "You can track the live status on the respective state or central portal using the unique Application Reference Number generated after submission."
      },
      {
        q: language === "hi" ? "क्या डिजीलॉकर (DigiLocker) के दस्तावेज़ सत्यापन के लिए कानूनी रूप से मान्य हैं?" : "Are DigiLocker documents legally valid for verification?",
        a: language === "hi" 
          ? "हाँ, सूचना प्रौद्योगिकी अधिनियम 2000 के तहत डिजीलॉकर ऐप में जारी सभी डिजिटल दस्तावेज़ मूल कागजी दस्तावेजों के समान ही कानूनी रूप से मान्य हैं।"
          : "Yes, under the IT Act 2000, documents issued in your official DigiLocker account are legally on par with original physical certificates."
      },
      {
        q: language === "hi" ? "यदि मैं अपना संदर्भ संख्या (Reference Number) खो देता हूँ तो क्या होगा?" : "What happens if I lose my application reference number?",
        a: language === "hi"
          ? "आप अपने पंजीकृत मोबाइल नंबर या ईमेल आईडी का उपयोग करके संबंधित नागरिक पोर्टल पर लॉगिन कर सकते हैं और इतिहास टैब से इसे पुनः प्राप्त कर सकते हैं।"
          : "You can retrieve it by logging into the citizen application portal using your registered mobile number/email and visiting the history logs tab."
      }
    ];

    // Specific logic override for major curated services
    if (sId.includes("uidai") || sId.includes("aadhaar")) {
      agencyName = "Unique Identification Authority of India (UIDAI)";
      agencyRole = "Statutory authority established under the Aadhaar Act, 2016 to issue unique 12-digit identities with individual biometric and demographic templates.";
      address = "UIDAI Head Office, Bangla Sahib Road, Gole Market, New Delhi - 110001";
      website = "https://uidai.gov.in";
      helpline = "1947";
      socialX = "@UIDAI";
      eligibilityConditions = [
        language === "hi" ? "भारत के सभी निवासी (नवजात शिशुओं सहित) आधार कार्ड के पात्र हैं।" : "Every individual residing in India (including infants/newborns) is eligible.",
        language === "hi" ? "अनिवासी भारतीय (NRI) भी आगमन पर वैध भारतीय पते के साथ पात्र हैं।" : "Non-Resident Indians (NRIs) hold absolute entitlement upon entry with local references.",
        language === "hi" ? "नामांकन के समय वास्तविक उंगलियों के निशान और आईरिस स्कैन (बायोमेट्रिक्स) अनिवार्य हैं।" : "Mandatory biometric capture (fingerprints & iris scans) at verified enrollment offices."
      ];
      updateDocuments = [
        language === "hi" ? "बायोमेट्रिक अपडेट के लिए नागरिक की भौतिक उपस्थिति आवश्यक है।" : "Physical presence of resident at center is mandatory for biometric profile updates.",
        language === "hi" ? "नाम परिवर्तन हेतु मान्यता प्राप्त राजपत्र (Gazette Notification) दस्तावेज।" : "Sovereign Gazette notification proof for legal spelling or name corrections.",
        language === "hi" ? "पते में सुधार हेतु बिजली/पानी बिल, पासपोर्ट या पंजीकृत किराया विलेख आवश्यक है।" : "Certified utilities invoice, active Indian Passport or registered lease deed for address updates."
      ];
      tatkalOption = {
        available: true,
        extraFee: 100,
        time: "3-5 Working Days",
        description: "Priority processing slot is allocated at UIDAI Aadhaar Seva Kendras for select urgent demographic modifications."
      };
      faqs = [
        {
          q: language === "hi" ? "आधार सुधार अपडेट होने में कितना समय लगता है?" : "How long does an Aadhaar correction update take?",
          a: language === "hi"
            ? "जनसांख्यिकी सुधार (नाम/पता) सामान्यतः 5-15 कार्य दिवसों में हो जाता है, जबकि बायोमेट्रिक अपडेट में 30 दिन तक का समय लग सकता है।"
            : "Demographic updates (name/address) are typically completed within 5-15 working days, while biometric updates may take up to 30 days."
        },
        {
          q: language === "hi" ? "क्या बायोमेट्रिक और मोबाइल नंबर सुधार के लिए व्यक्तिगत उपस्थिति आवश्यक है?" : "Is physical presence required for biometrics or mobile verification?",
          a: language === "hi"
            ? "हाँ, सुरक्षा कारणों और उंगलियों/आंखों के स्कैन की लाइव रिकॉर्डिंग के लिए अधिकृत आधार सेवा केंद्र पर व्यक्तिगत उपस्थिति अनिवार्य है।"
            : "Yes, physical biometric capture (iris/fingerprints) and mobile linking cannot be done online and require verified in-person center presence."
        },
        {
          q: language === "hi" ? "क्या मैं अपना मोबाइल नंबर खुद ऑनलाइन अपडेट कर सकता हूँ?" : "Can I update my mobile number in Aadhaar online?",
          a: language === "hi"
            ? "सुरक्षा कारणों से ऑनलाइन मोबाइल नंबर अपडेट निलंबित है। आपको अपने नजदीकी प्रमाणित ई-सेवा केंद्र या आधार केंद्र जाना होगा।"
            : "No, direct online mobile number update is suspended for security reasons. You must visit the nearest authorized enrollment desk."
        }
      ];
    } else if (sId.includes("pan") || sId.includes("nsdl")) {
      agencyName = "Income Tax Department, Ministry of Finance (NSDL Nodal Agency)";
      agencyRole = "National treasury authority responsible for direct tax operations, utilizing NSDL and UTITSL for issuing 10-character alphanumeric Permanent Account Numbers.";
      address = "Central Board of Direct Taxes, North Block, Raisina Hill, New Delhi";
      website = "https://www.onlineservices.nsdl.com";
      helpline = "1800-180-1961";
      socialX = "@IncomeTaxIndia";
      eligibilityConditions = [
        language === "hi" ? "सभी व्यक्तिगत करदाता, व्यवसाय, भागीदारी फर्में और हिंदू अविभाजित परिवार (HUF) पात्र हैं।" : "All corporate entities, legal Hindu Undivided Families (HUF), trusts and individual taxpayers.",
        language === "hi" ? "अल्पवयस्क (नाबालिग) माता-पिता के माध्यम से पैन कार्ड का आवेदन कर सकते हैं।" : "Minors are fully eligible through authorized application representation from guardians.",
        language === "hi" ? "आवेदक के पास आधार संख्या अनिवार्य रूप से होनी चाहिए।" : "Valid Aadhaar Number is strictly mandated for instant digital PAN e-KYC."
      ];
      updateDocuments = [
        language === "hi" ? "विभिन्न विवाहों के उपरांत नाम बदलने हेतु विवाह पंजीकरण प्रमाण पत्र।" : "Certified Marriage registration credentials for surname changes post-marriage.",
        language === "hi" ? "नाम सुधार के नियम के तहत मूल विलेख की सत्यापित प्रति।" : "Deed Poll or sovereign gazette notification copy for substantial corrections.",
        language === "hi" ? "मोबाइल ओटीपी के मिलान द्वारा तत्काल डिजिलॉकर डेटा सत्यापन।" : "Instant digital validation of old fields via mobile OTP-linked DigiLocker dossier."
      ];
      faqs = [
        {
          q: language === "hi" ? "क्या मैं दो पैन कार्ड या एक से अधिक पैन कार्ड रख सकता हूँ?" : "Can I hold multiple physical PAN cards legally?",
          a: language === "hi"
            ? "नहीं, आयकर अधिनियम की धारा 272B के तहत दो या अधिक पैन कार्ड रखना अवैध है। पकड़े जाने पर ₹10,000 का दंडात्मक जुर्माना लागू होगा।"
            : "No, possessing more than one PAN card is strictly illegal under Section 272B of the Income Tax Act, attracting a penalty of ₹10,000."
        },
        {
          q: language === "hi" ? "ई-पैन (e-PAN) और नॉर्मल भौतिक पैन कार्ड में क्या अंतर है?" : "What is the difference between e-PAN and physical PAN card?",
          a: language === "hi"
            ? "दोनो समान रूप से मान्य हैं। ई-पैन तत्काल जारी होने वाला डिजिटल हस्ताक्षरित पीडीएफ है, जबकि भौतिक कार्ड डाक द्वारा गृह पते पर भेजा जाता है।"
            : "Both hold equal legal validity. e-PAN is an instant electronic PDF, whereas physical PAN is plastic-printed and delivered within 10 days."
        },
        {
          q: language === "hi" ? "क्या पैन कार्ड बनवाने के लिए आधार कार्ड होना अनिवार्य है?" : "Is an Aadhaar Card mandatory for a PAN Card application?",
          a: language === "hi"
            ? "हाँ, आयकर नियमों के अनुसार नया पैन कार्ड बनाने अथवा इसे लिंक करने के लिए आपके पास एक वैध आधार संख्या होना आवश्यक है।"
            : "Yes, quoting a valid Aadhaar Number is strictly mandated for real-time digital e-KYC or standard PAN card processing."
        }
      ];
    } else if (sId.includes("passport")) {
      agencyName = "Consular, Passport and Visa (CPV) Division, Ministry of External Affairs";
      agencyRole = "Federal regulatory authority managing international travel clearances, utilizing integrated Passport Seva Kendras (PSK) and Post Office Seva Kendras (POPSK).";
      address = "Patiala House Annexe, Tilak Marg, New Delhi - 110001";
      website = "https://passportindia.gov.in";
      helpline = "1800-258-1800";
      socialX = "@passportsevamea";
      eligibilityConditions = [
        language === "hi" ? "आवेदक अनिवार्य रूप से भारत संघ का संप्रभु नागरिक होना चाहिए।" : "Applicant must be a sovereign citizen of the Republic of India.",
        language === "hi" ? "आवेदक के विरुद्ध न्यायालय में कोई भी आपराधिक शिकायत लंबित या सक्रिय नहीं होनी चाहिए।" : "No pending criminal trials or active warrants on the applicant in any Indian court.",
        language === "hi" ? "पुलिस सत्यापन के समय वर्तमान पते पर निवास संबंधी न्यूनतम 1 वर्ष का साक्ष्य हो।" : "Min. 1-year residency trace proof at current location for external police verification."
      ];
      updateDocuments = [
        language === "hi" ? "पुराने पासपोर्ट का मूल बुकलेट (Expired / Damaged Passport Booklet)।" : "Original physical expired or near-expiry passport booklet.",
        language === "hi" ? "पते के मिलान हेतु वर्तमान पते के साक्ष्य का नया राजपत्रित प्रमाण पत्र।" : "Primary address verification certificate matches reflecting the newly updated domicile.",
        language === "hi" ? "शैक्षणिक श्रेणी में परिवर्तन (Non-ECR status) हेतु मैट्रिक प्रमाणपत्र।" : "Matriculation / Graduation certificate for Non-ECR statutory category updates."
      ];
      tatkalOption = {
        available: true,
        extraFee: 2000,
        time: "1-3 Working Days",
        description: "Tatkal Passport scheme permits accelerated production within 72 hours subject to clean central verification checks."
      };
      faqs = [
        {
          q: language === "hi" ? "तत्काल पासपोर्ट (Tatkal Passport) योजना में पुलिस सत्यापन कब होता है?" : "When does police verification happen in the Tatkal scheme?",
          a: language === "hi"
            ? "तत्काल योजना के अंतर्गत नागरिक का पासपोर्ट पहले प्रिंट होकर डाक द्वारा भेज दिया जाता है, और पुलिस स्टेशन भौतिक सत्यापन बाद में करता है।"
            : "Under the expedited Tatkal passport scheme, the passport is issued first on a post-police verification basis and verified later."
        },
        {
          q: language === "hi" ? "पासपोर्ट के क्षतिग्रस्त होने या खो जाने पर क्या कार्रवाई करें?" : "What is the procedure for a damaged or lost passport?",
          a: language === "hi"
            ? "आपको तुरंत स्थानीय पुलिस थाने में शिकायत दर्ज करानी चाहिए और पासपोर्ट सेवा पोर्टल पर 'Lost/Damaged Re-issue' श्रेणी में नया फॉर्म भरना होगा।"
            : "File a Police Complaint (FIR) immediately and apply for a 'Re-issue of Passport' under the lost/damaged category on the portal."
        },
        {
          q: language === "hi" ? "क्या मैं अपने पुराने पासपोर्ट में ही नया पता बदलवा सकता हूँ?" : "Can I change my residential address on an existing passport?",
          a: language === "hi"
            ? "नहीं, इसके लिए आपको नए पते के साक्ष्य के साथ पासपोर्ट के 'पुनः जारी (Re-issue)' का आवेदन शुल्क भुगतान करके नया बुकलेट प्राप्त करना होगा।"
            : "No, you must undergo a complete passport re-issue application, submitting valid address credentials to print a new booklet."
        }
      ];
    } else if (sId.includes("-caste") || sId.includes("caste-cert")) {
      agencyName = isStateService 
        ? `Revenue & Social Justice Welfare, Government of ${matchedState.name}`
        : "State Directorate of Revenue, District Revenue Commissionerate";
      agencyRole = "Authorized district revenue administration validating historical ancestral community descent records for social welfare representation.";
      website = isStateService ? `https://edistrict.${matchedState.id}.gov.in` : "https://india.gov.in";
      eligibilityConditions = [
        language === "hi" ? `आवेदक मूल रूप से ${regionName} का निवासी होना चाहिए।` : `Applicant must be an native citizen residing permanently in ${regionName}.`,
        language === "hi" ? "आवेदक के परिवार का नाम राज्य या केंद्रीय आरक्षित सूची (SC/ST/OBC) में शामिल हो।" : "Family lineage must be actively listed in the state or central Scheduled reservation lists.",
        language === "hi" ? "पिछड़ा वर्ग (OBC नॉन-क्रीमी लेयर) प्रमाणपत्र के लिए पारिवारिक आय की सीमा ₹8 लाख से कम हो।" : "Annual household income must be strictly below ₹8 Lakhs for OBC Non-Creamy Layer certificates."
      ];
    } else if (sId.includes("-income") || sId.includes("income-cert")) {
      agencyName = isStateService
        ? `Revenue Department & District Magistrate, Government of ${matchedState.name}`
        : "Municipal Revenue Board / Local Taluk Revenue Office";
      agencyRole = "Statutory district authority verifying physical land holding yields, wage structures, and retail income parameters of residents.";
      website = isStateService ? `https://edistrict.${matchedState.id}.gov.in` : "https://india.gov.in";
      eligibilityConditions = [
        language === "hi" ? `आवेदक ${regionName} क्षेत्र में वर्तमान में निवास कर रहा हो।` : `Applicant must be an active resident within the territory boundaries of ${regionName}.`,
        language === "hi" ? "परिवार के आय के सभी स्रोतों (कृषि, व्यापार, वेतन, पेंशन) का कुल योग घोषित हो।" : "Declaration of all combined wage channels (agricultural, investments, salaries).",
        language === "hi" ? "आय सत्यापन हेतु स्थानीय पटवारी या राजस्व निरीक्षक की जांच रिपोर्ट आवश्यक है।" : "Local Patwari/Tehsildar physical site and asset inquiry clearance."
      ];
    } else if (sId.includes("-domicile") || sId.includes("residence") || sId.includes("domicile-cert")) {
      agencyName = isStateService
        ? `Department of District Administration & Revenue, Government of ${matchedState.name}`
        : "Local Circle Executive Magistrate / Sub-Divisional Office";
      agencyRole = "State regulatory body validating long-term continuous residence of a citizen within regional state borders.";
      website = isStateService ? `https://edistrict.${matchedState.id}.gov.in` : "https://india.gov.in";
      eligibilityConditions = [
        language === "hi" ? `आवेदक ${regionName} में न्यूनतम 15 वर्षों से लगातार रह रहा हो (या वहां पैदा हुआ हो)।` : `Applicant must have resided continuously in ${regionName} for at least 15 years (or is an active native born citizen).`,
        language === "hi" ? "आवेदक की अपनी भूमि संपत्ति हो या राज्य के स्थानीय विद्यालय से निरंतर 10वीं/12वीं तक पढ़ाई की हो।" : "Owns agricultural/residential property or finished Grade 10/12 exams from active regional schools.",
        language === "hi" ? "आवेदक का नाम स्थानीय राज्य मतदाता सूची (Voter List) में पंजीकृत हो।" : "Electoral enrollment in the local municipal voter guides is required."
      ];
    } else if (sId.includes("rto") || sId.includes("driving") || sId.includes("-dl") || sId.includes("licence")) {
      agencyName = "Ministry of Road Transport and Highways (MoRTH) & Regional Transport Officer (RTO)";
      agencyRole = "State Transport Authority enforcing national driving fitness, motor licensing standards, and smart-card permit issuance under the Motor Vehicles Act, 1988.";
      address = "SARATHI Central Database Hub, MoRTH, New Delhi";
      website = "https://parivahan.gov.in";
      helpline = "1033";
      socialX = "@morthindia";
      eligibilityConditions = [
        language === "hi" ? "गियर रहित वाहनों के लिए आयु न्यूनतम 16 वर्ष और अन्य वाणिज्यिक/परिवहन वाहनों के लिए न्यूनतम 20 वर्ष हो।" : "Ages 16+ for gearless small engines, 18+ for normal gears, and 20+ for heavy commercial transport licences.",
        language === "hi" ? "स्थायी ड्राइविंग लाइसेंस के आवेदन से पूर्व वैध शिक्षार्थी (Learner's Licence) पहचान पत्र होना अनिवार्य है।" : "Possession of a valid Learner's Licence for at least 30 active days prior to driving test scheduling.",
        language === "hi" ? "आवेदक को आरटीओ परिसर में प्रायोगिक ड्राइविंग टेस्ट को अनिवार्य रूप से उत्तीर्ण करना होगा।" : "Must successfully clear the live computerized and on-road driving test under RTO guidance."
      ];
      updateDocuments = [
        language === "hi" ? "मूल समाप्त होने जा रहा (Expired) ड्राइविंग लाइसेंस पत्रक।" : "Original expired or active smart-card driving licence copy.",
        language === "hi" ? "चिकित्सीय उपयुक्तता हेतु फॉर्म 1A फिटनेस सर्टिफिकेट (40 वर्ष से अधिक आयु वालों के लिए)।" : "Medical fitness certificate on Form 1A certified by matching govt panel doctor (Mandatory for ages 40+).",
        language === "hi" ? "नाम या पते में बदलाव हेतु राजपत्र या मतदाता पहचान पत्र प्रमाण।" : "Gazette of India, marriage details, or Aadhaar for name modifications."
      ];
    } else if (sId.includes("voter") || sId.includes("eci")) {
      agencyName = "Election Commission of India (ECI)";
      agencyRole = "Sovereign constitutional authority superintendending, directing, and controlling national and state assembly elections, establishing voters database grids.";
      address = "Nirvachan Sadan, Ashoka Road, New Delhi - 110001";
      website = "https://voters.eci.gov.in";
      helpline = "1950";
      socialX = "@ECISVEEP";
      eligibilityConditions = [
        language === "hi" ? "आवेदक अनिवार्य रूप से भारत का नागरिक हो तथा आवेदन की तिथि तक आयु 18 वर्ष या अधिक हो।" : "Applicant must be an Indian citizen holding an age parameter of 18+ on the qualifying cohort date.",
        language === "hi" ? "आवेदक अपने घोषित सामान्य निवास के मतदान केंद्र में पंजीकरण का हकदार है।" : "Applicant is eligible to enroll only at their primary ordinary place of residence.",
        language === "hi" ? "आवेदक कानूनन मानसिक रूप से अस्वस्थ या आपराधिक गतिविधि के कारण मतदान से वंचित नहीं होना चाहिए।" : "No statutory voter exclusions under electoral laws due to criminal disqualifications."
      ];
      updateDocuments = [
        language === "hi" ? "मूल वोटर आईडी कार्ड (EPIC Card) की प्रति।" : "Copy of original voter identity card (EPIC number references).",
        language === "hi" ? "नए विधानसभा क्षेत्र में स्थानांतरण की पुष्टि हेतु निवास का नया मूल प्रमाण।" : "Valid residential occupancy proof for constituency migration cases (Form 8 routing).",
        language === "hi" ? "स्वयं की रंगीन पासपोर्ट फोटो (सुधार एवं नए कार्ड मुद्रण हेतु)।" : "Recent raw colored high-definition passport passport photograph."
      ];
    } else if (sId.includes("ration") || sId.includes("pds") || sId.includes("-ration")) {
      agencyName = isStateService
        ? `Department of Food, Civil Supplies & Consumer Protection, Government of ${matchedState.name}`
        : "National Public Distribution Directorate & State Civil Supplies Authority";
      agencyRole = "Government nodal board mapping household economic parameters to distribute subsidized essential commodities under National Food Security Act codes.";
      website = isStateService ? `https://edistrict.${matchedState.id}.gov.in` : "https://nfsa.gov.in";
      eligibilityConditions = [
        language === "hi" ? "परिवार के मुख्य आवेदक के रूप में परिवार की सबसे वरिष्ठ महिला (18+) का विवरण अनिवार्य है।" : "The eldest female member of the family (aged 18+) must ideally be registered as the Head of Household.",
        language === "hi" ? "सभी सदस्यों के आधार कार्ड मोबाइल नंबर और व्यक्तिगत खातों से लिंक होने चाहिए।" : "Aadhaar Card copy of every member proposed on the ration lists is mandatory.",
        language === "hi" ? "आवेदक परिवार के पास राज्य के भीतर कोई अन्य राशन कार्ड पंजीकृत नहीं होना चाहिए (दोहरा नामांकन प्रतिबंधित)।" : "Strict prohibition of dual enrollment. No prior card must be active in another town/location."
      ];
      updateDocuments = [
        language === "hi" ? "परिवार में जन्म लिए नए शिशु का जन्म प्रमाण पत्र (नया नाम जोड़ने हेतु)।" : "Newborn birth certificate issued by municipal ward authorities (for family member additions).",
        language === "hi" ? "महिला सदस्य के विवाह के उपरांत नाम हटाने हेतु डिलीशन सर्टिफिकेट या ट्रांसफर आर्डर।" : "Official community deletion certificate of spouse from previous state family list (for marriage migrations).",
        language === "hi" ? "अधिकार संशोधन पत्रक (नए सदस्यों के बायोमेट्रिक्स सहमति)।" : "Updated biometric sync reference and Aadhaar linking certificates on PDS database."
      ];
    } else {
      // General Fallbacks dynamically computed beautifully based on service details
      if (isStateService) {
        agencyName = `Directorate of Citizen e-District Services, Government of ${matchedState.name}`;
        address = `State Nodal IT Headquarters, Capital Complex, ${matchedState.name}`;
        website = `https://edistrict.${matchedState.id}.gov.in`;
        helpline = "1800-" + (matchedState.id.length * 123 + 100);
      }
    }

    if (sId.includes("-caste") || sId.includes("caste-cert") || sId.includes("-income") || sId.includes("income-cert") || sId.includes("-domicile") || sId.includes("residence") || sId.includes("domicile-cert")) {
      faqs = [
        {
          q: language === "hi" ? "आय प्रमाणपत्र (Income Certificate) की वैधता अवधि कितनी होती है?" : "What is the validity period of an Income Certificate?",
          a: language === "hi"
            ? "सामान्यतः राज्य सरकार द्वारा जारी आय प्रमाणपत्र केवल उसी चालू वित्तीय वर्ष के लिए यानी 31 मार्च तक ही प्रशासनिक कार्यों में वैध माना जाता है।"
            : "An Income Certificate is generally valid only for the specific financial year in which it was issued (typically expiring on March 31st)."
        },
        {
          q: language === "hi" ? "क्या मैं एक साथ दो विभिन्न राज्यों के लिए मूल निवास प्रमाणपत्र बनवा सकता हूँ?" : "Can I apply for a Domicile Certificate in two different states?",
          a: language === "hi"
            ? "नहीं, कानूनी रूप से आप एक ही समय में केवल एक राज्य के मूल निवासी बन सकते हैं। दो या अधिक राज्यों में मूल निवास दर्ज करना कानूनी अपराध है।"
            : "No, you can only hold a Domicile/Residence certificate for one state at a time. Multi-state residency claims invite legal penalty."
        },
        {
          q: language === "hi" ? "क्या जाति प्रमाणपत्र (Caste Certificate) को समय-समय पर नवीनीकृत करना पड़ता है?" : "Does a Caste Certificate require periodic renewal?",
          a: language === "hi"
            ? "अनुसूचित जाति (SC) और जनजाति (ST) प्रमाणपत्रों की वैधता आजीवन होती है। हालांकि, OBC नॉन-क्रीमी लेयर के लिए आय सीमा अनुसार वार्षिक नवीनीकरण आवश्यक है।"
            : "Caste certificates for SC/ST are typically valid for life. However, OBC Non-Creamy Layer certificates require annual income updates."
        }
      ];
    } else if (sId.includes("rto") || sId.includes("driving") || sId.includes("-dl") || sId.includes("licence")) {
      faqs = [
        {
          q: language === "hi" ? "क्या राज्य द्वारा जारी ड्राइविंग लाइसेंस पूरे भारत में मान्य होता है?" : "Is a state-issued driving license valid all over India?",
          a: language === "hi"
            ? "हाँ, मोटर वाहन अधिनियम 1988 के तहत भारत के किसी भी क्षेत्रीय परिवहन कार्यालय (RTO) द्वारा जारी स्थायी अन्य लाइसेंस पूरे भारत क्षेत्र में मान्य है।"
            : "Yes, under the Motor Vehicles Act 1988, a permanent driving license issued by any authorized regional RTO is valid across India."
        },
        {
          q: language === "hi" ? "स्थायी ड्राइविंग लाइसेंस (Permanent DL) की कुल वैधता कितनी होती है?" : "What is the physical validity of a permanent driving license?",
          a: language === "hi"
            ? "गैर-परिवहन (निजी) वाहनों के लिए यह लाइसेंस 20 वर्ष या व्यक्ति की आयु 40 वर्ष होने (जो भी पहले हो) तक ही मान्य होता है।"
            : "For private non-transport vehicles, it is valid for 20 years from issuance or until the driver reaches 40 years of age, whichever is earlier."
        },
        {
          q: language === "hi" ? "यदि लर्निंग लाइसेंस की अवधि ६ महीने समाप्त हो जाए तो क्या होगा?" : "What happens if my 6-month Learner's License expires?",
          a: language === "hi"
            ? "लर्निंग लाइसेंस रीन्यू नहीं हो सकता। समय समाप्त होने के बाद आपको शुरुआत से ऑनलाइन प्रक्रिया कर नया लर्निंग लाइसेंस स्लॉट निकालना होगा।"
            : "A Learner's License cannot be renewed. If it expires, you must apply for a fresh Learner's License from the beginning."
        }
      ];
    } else if (sId.includes("ration") || sId.includes("pds") || sId.includes("-ration")) {
      faqs = [
        {
          q: language === "hi" ? "क्या परिवार के सदस्य का नाम एक ही समय पर दो अलग राशन कार्डों में हो सकता है?" : "Can a member be listed on two ration cards simultaneously?",
          a: language === "hi"
            ? "नहीं, यह सार्वजनिक वितरण प्रणाली (PDS) नियमों के तहत गैर-कानूनी है। नया नाम जोड़ने से पहले पुराने पते/कार्ड से नाम हटाने का प्रमाण देना होगा।"
            : "No, dual enrollment is strictly prohibited. You must obtain a Deletion Certificate from the current card before adding to another."
        },
        {
          q: language === "hi" ? "क्या राशन कार्ड में परिवार का मुखिया केवल महिला सदस्य ही हो सकती है?" : "Is it mandatory for the head of household to be a woman?",
          a: language === "hi"
            ? "हाँ, राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA) के अंतर्गत महिलाओं के सशक्तिकरण हेतु परिवार की सबसे वरिष्ठ महिला (18+) को मुखिया बनाया जाता है।"
            : "Yes, under the National Food Security Act (NFSA), the eldest female (aged 18+) is legally designated as the Head of Household."
        },
        {
          q: language === "hi" ? "क्या मैं भारत के किसी भी राज्य में इस राशन कार्ड से अनाज ले सकता हूँ?" : "Can I procure food grains in other states under One Nation One Ration Card?",
          a: language === "hi"
            ? "हाँ, भारत सरकार की 'वन नेशन वन राशन कार्ड' योजना के तहत आप उचित मूल्य की किसी भी राशन दुकान से बायोमेट्रिक्स का मिलान कर राशन उठा सकते हैं।"
            : "Yes, under the nationwide 'One Nation One Ration Card' system, citizens can withdraw entitled grains from any fair price shop in India."
        }
      ];
    }

    // --- INTEGRATED APPLICATION PROCEDURAL WIZARD ENGINE ---
    let designatedOffice = {
      en: "Local Tehsildar / Block Development Officer Desk (Sub-Divisional District Administration)",
      hi: "स्थानीय तहसीलदार / ब्लॉक विकास अधिकारी डेस्क (अनुविभागीय जिला प्रशासन)"
    };
    let feesNotes = {
      en: "₹15-₹65 standard state portal processing fee.",
      hi: "₹15-₹65 मानक राज्य पोर्टल प्रसंस्करण सेवा शुल्क।"
    };
    let stepByStep = {
      en: [
        "Access Official Portal: Click on your resident state's official digital directory or e-District service desk.",
        "Identify Specific Service: Filter and select the exact application category and enter your demographic profile.",
        "Upload Support Criteria: Attach scanned PDF or JPEG proofs of target address, name, and background references.",
        "Verify Demographics: Provide Aadhaar-linked OTP authentication to establish instant biometric and e-KYC credentials.",
        "Processing & Dispatch: Regional administrative officers verify files and signed-off certificate is dispatched to your portal."
      ],
      hi: [
        "आधिकारिक पोर्टल पर जाएं: अपने मूल राज्य के आधिकारिक डिजिटल डायरेक्टरी अथवा ई-डिस्ट्रिक्ट सर्विस डेस्क लिंक पर क्लिक करें।",
        "विशिष्ट सेवा का चयन करें: सूची में से आवश्यक सेवा श्रेणी चुनें और अपना सामान्य जनसांख्यिकी विवरण दर्ज करें।",
        "सक्षम दस्तावेज संलग्न करें: पते, नाम तथा अन्य आवश्यक योग्यता मानदंडों के पीडीएफ या जेपीईजी प्रारूप में दस्तावेज अपलोड करें।",
        "ई-केवाईसी पुष्टि करें: आधार से लिंक मोबाइल पर प्राप्त ओटीपी का मिलान कर ऑनलाइन तत्काल बायोमेट्रिक क्रेडेंशियल सत्यापित करें।",
        "सत्यापन व वितरण: क्षेत्रीय संबंधित प्रशासनिक अधिकारी आपकी फाइलों की भौतिक या डिजिटल जांच कर क्रेडेंशियल जारी करते हैं।"
      ]
    };
    let externalLinks = isStateService && matchedState
      ? [
          { label: `${matchedState.name} e-District Portal`, url: `https://edistrict.${matchedState.id}.gov.in` },
          { label: "National Government Services India", url: "https://services.india.gov.in" }
        ]
      : [
          { label: "National Government Services India", url: "https://services.india.gov.in" },
          { label: "Digital India Single-Sign-On Platform", url: "https://www.india.gov.in" }
        ];

    // Specific overrides for major services
    if (sId.includes("uidai") || sId.includes("aadhaar")) {
      designatedOffice = {
        en: "Authorized Aadhaar Seva Kendra (ASK) / Permanent Enrollment Center",
        hi: "अधिकृत आधार सेवा केंद्र (ASK) / स्थायी नामांकन केंद्र"
      };
      feesNotes = {
        en: "₹50 for demographic updates, ₹100 for biometric updates. Fresh enrollment is completely free.",
        hi: "जनसांख्यिकी सुधार हेतु ₹50, बायोमेट्रिक अपडेट हेतु ₹100। नया नामांकन पूर्णतः निःशुल्क है।"
      };
      stepByStep = {
        en: [
          "Book Slot or Visit Center: Schedule an appointment online on the UIDAI portal or visit the nearest permanent enrollment desk directly.",
          "Submit Enrollment Form: Fill the demographic info correction sheet, attaching valid original address evidence.",
          "Biometric Validation: Authenticate using live fingerprints, high-definition iris scan, and fresh passport photo capture.",
          "Acknowledgment Receipt: Obtain an EID acknowledgment slip containing your 14-digit update reference code.",
          "UIDAI Database Update: System verifies the request against back-end security tables and dispatches updated card within 15-30 days."
        ],
        hi: [
          "स्लॉट बुक करें अथवा केंद्र जाएं: यूआईडीएआई (UIDAI) पोर्टल पर ऑनलाइन समय आरक्षित करें या सीधे नजदीकी आधार केंद्र पर जाएं।",
          "आवेदन प्रपत्र जमा करें: आवश्यक सुधार विवरण भरकर मूल दस्तावेज पत्राचारों (वोटर कार्ड, राशन कार्ड आदि) के साथ जमा करें।",
          "बायोमेट्रिक प्रमाणीकरण: फिंगरप्रिंट, आईरिस (आंखों) का स्कैन और ताजा वेबकैम फोटो कैप्चर करवाएं।",
          "पावती पर्ची (Aadhaar Slip): 14-अंकीय अपडेट संदर्भ कोड (URN) अंकित पावती रसीद प्राप्त करें।",
          "सिस्टम सत्यापन: यूआईडीएआई डेटाबेस द्वारा आंतरिक审核 संपन्न होने के उपरांत 15-30 दिनों के भीतर नया आधार कार्ड पंजीकृत पते पर भेज दिया जाता है।"
        ]
      };
      externalLinks = [
        { label: "UIDAI Appointment Booking", url: "https://appointments.uidai.gov.in" },
        { label: "UIDAI MyAadhaar Portal", url: "https://myaadhaar.uidai.gov.in" }
      ];
    } else if (sId.includes("pan") || sId.includes("nsdl")) {
      designatedOffice = {
        en: "NSDL / Protean eGov Technologies or UTITSL authorized centers",
        hi: "एनएसडीएल (NSDL / Protean) या यूटीआईआईटीएसएल (UTITSL) अधिकृत पैन सुविधा केंद्र"
      };
      feesNotes = {
        en: "₹110 standard government charge for physical dispatch inside India.",
        hi: "भारतीय पते पर भौतिक कार्ड डिलीवरी के लिए ₹110 मानक सरकारी सेवा शुल्क।"
      };
      stepByStep = {
        en: [
          "Select Application Type: Choose Form 49A for fresh citizens or correction form for existing card updates.",
          "Demographic Matching: Link your 12-digit Aadhaar Card, spelling must exactly match Aadhaar records.",
          "Direct Online Payment: Pay the standard regulatory processing fee of ₹110 via credit card/UPI/net-banking.",
          "E-Sign E-KYC: Complete instant digital authentication using security OTP sent to Aadhaar-registered mobile number.",
          "Alphanumeric Generation: Income Tax Dept issues official 10-char PAN in 3-5 days. Physical card delivered in 10 days."
        ],
        hi: [
          "आवेदन श्रेणी चुनें: नए आवेदकों के लिए फॉर्म 49A अथवा मौजूदा कार्ड सुधार हेतु 'Pan Correction Form' चुनें।",
          "नाम और वर्तनी मिलान: आधार कार्ड संख्या दर्ज करें, याद रहे कि नाम और जन्मतिथि आधार डेटा से बिल्कुल मेल खानी चाहिए।",
          "शुल्क भुगतान: क्रेडिट कार्ड, डेबिट कार्ड या यूपीआई के माध्यम से ₹110 का आवश्यक सरकारी शुल्क भरें।",
          "डिजिटल ई-हस्ताक्षर (e-Sign): आधार से पंजीकृत मोबाइल नंबर पर आए सुरक्षित ओटीपी का मिलान कर ऑनलाइन ई-केवाईसी प्रक्रिया पूर्ण करें।",
          "अल्फा-न्यूमेरिक आवंटन: आयकर विभाग द्वारा 3-5 दिनों में वर्चुअल ई-पैन जारी कर दिया जाता है तथा 10 दिनों में भौतिक कार्ड घर पहुंचता है।"
        ]
      };
      externalLinks = [
        { label: "NSDL Online PAN Application", url: "https://www.onlineservices.nsdl.com/paam/endUserRegisterWithSSO.html" },
        { label: "UTITSL PAN Portal", url: "https://www.pan.utiitsl.com" }
      ];
    } else if (sId.includes("passport")) {
      designatedOffice = {
        en: "Regional Passport Office (RPO) / Passport Seva Kendra (PSK) desk",
        hi: "क्षेत्रीय पासपोर्ट कार्यालय (RPO) / पासपोर्ट सेवा केंद्र (PSK)"
      };
      feesNotes = {
        en: "₹1,505 for normal application, ₹3,500 under expedited Tatkal scheme.",
        hi: "सामान्य आवेदन के लिए ₹1,505 तथा तत्काल (Tatkal Scheme) के तहत ₹3,500।"
      };
      stepByStep = {
        en: [
          "Register on Passport Seva: Complete online profile registration on CPV portal, detailing state and district of residence.",
          "Complete Form & Pay: Submit details of parentage, siblings, and age, then pay fees to generate appointment booking.",
          "Visit PSK Desk: Present original files (DOB, address proofs, qualifications) at the designated PSK.",
          "Police Verification: Local station authorities visit residency address to establish citizenship and clean criminal record.",
          "Sovereign Dispatch: Upon clearance from SP/Security nodal unit, the printing division dispatches passport via speed-post."
        ],
        hi: [
          "पासपोर्ट सेवा पर ऑनलाइन पंजीकरण: CPV MEA आधिकारिक पोर्टल पर पंजीकरण कर नया लॉगिन क्रेडेंशियल बनाएं।",
          "शुल्क और नियुक्त स्लॉट: पारिवारिक संबंध, शैक्षणिक योग्यता भरकर सुरक्षा शुल्क भुगतान करें और अप्वाइंटमेंट रसीद प्रिंट करें।",
          "पासपोर्ट सेवा केंद्र (PSK) पर व्यक्तिगत समीक्षा: चुने गए समय पर मूल प्रमाणपत्रों के साथ केंद्र जाकर बायोमेट्रिक्स और दस्तावेज सत्यापित करवाएं।",
          "आरक्षी सत्यापन (Police Verification): स्थानीय पुलिस थाना अधिकारी पते की सत्यता व आपराधिक इतिहास की भौतिक जांच करके रिपोर्ट सबमिट करते हैं।",
          "सुरक्षित प्रेषण: पुलिस और सुरक्षा विंग द्वारा हरी झंडी मिलने के बाद, पासपोर्ट मुद्रण संकाय द्वारा स्पीड पोस्ट द्वारा दस्तावेज घर भेजा जाता है।"
        ]
      };
      externalLinks = [
        { label: "Passport Seva Portal", url: "https://www.passportindia.gov.in" }
      ];
    } else if (sId.includes("rto") || sId.includes("driving") || sId.includes("-dl") || sId.includes("licence")) {
      designatedOffice = {
        en: "Regional Transport Office (RTO) licensing branch",
        hi: "क्षेत्रीय परिवहन कार्यालय (RTO) लाइसेंसिंग शाखा"
      };
      feesNotes = {
        en: "₹250 learner license fee, ₹500 standard smart-card permanent driving license test fee.",
        hi: "लर्निंग लाइसेंस शुल्क ₹250, भौतिक स्मार्ट-कार्ड डीएल टेस्ट और वितरण हेतु ₹500 शुल्क।"
      };
      stepByStep = {
        en: [
          "Online Learner's License: Register on Sarathi, pass the simulated traffic signals theory exam, and print the LL permit.",
          "Practical Training Period: Practice driving on public roads for at least 30 mandatory calendar days under supervisor sign-off.",
          "Book RTO Test Slot: Select an available date on the Parivahan RTO schedule tracker for on-road tests.",
          "Clear Driving Evaluation: Navigate the designated test track (like an '8' or 'H' layout) in front of the Motor Vehicles Inspector.",
          "Smart-Card Issuance: RTO issues the official digital smart-card DL, loaded instantly on central Sarathi servers."
        ],
        hi: [
          "लर्नर लाइसेंस प्रक्रिया: सारथी (Sarathi) पोर्टल पर रजिस्टर करें, यातायात संकेत ऑनलाइन लिखित परीक्षा उत्तीर्ण कर 6 महीने का शिक्षार्थी परमिट प्रिंट करें।",
          "प्रायोगिक अभ्यास काल: कानूनन कम से कम 30 दिनों तक कार/मोटरसाइकिल पर लर्निंग चिन्ह लगाकर मुख्य चालक की उपस्थिति में अभ्यास करें।",
          "इंसाइटर वाहन टेस्ट स्लॉट बुकिंग: परिवहन कार्यालय (RTO) की वेबसाइट पर परमानेंट ड्राइविंग लाइसेंस परीक्षण शुल्क भरकर स्लॉट चुनें।",
          "ड्राइविंग परीक्षण उत्तीर्ण करें: मोटर वाहन निरीक्षक (MVI) के समक्ष आरटीओ ट्रैक (जैसी '8' आकार या 'H' ट्रैक) पर वाहन चलाकर टेस्ट पास करें।",
          "स्मार्ट-कार्ड वितरण: परीक्षण क्लियर होने के उपरांत आरटीओ अधिकारी द्वारा डिजिटल हस्ताक्षरित स्मार्ट कार्ड डीएल जारी किया जाता है।"
        ]
      };
      externalLinks = [
        { label: "Parivahan Sarathi Licensing", url: "https://sarathi.parivahan.gov.in" }
      ];
    } else if (sId.includes("voter") || sId.includes("eci")) {
      designatedOffice = {
        en: "Local Block Booth Level Officer (BLO) / Electoral Registration Officer (ERO)",
        hi: "स्थानीय बूथ स्तर के अधिकारी (BLO) / निर्वाचक पंजीकरण अधिकारी (ERO)"
      };
      feesNotes = {
        en: "100% Free of Cost. No charges are billed for voter enrollment or address shift.",
        hi: "सर्वप्रथम और पूर्णतः निःशुल्क। मतदाता पंजीकरण या स्थानांतरण प्रक्रिया हेतु कोई शुल्क देय नहीं है।"
      };
      stepByStep = {
        en: [
          "Fill ECI Form 6: Register on Voters portal and fill Form 6 for fresh registration (or Form 8 for name/address changes).",
          "Upload Support Files: Attach scanned color passport photo, proof of age (18+), and municipal residence proof.",
          "Electoral verification: The request is routed to your polling booth's designated Booth Level Officer (BLO) for physical verification.",
          "Electoral Roll Enlistment: Upon BLO approval, your name is published in the active regional Assembly Electoral Roll constituency.",
          "EPIC Card Print: ECI prints the highly secure holographic Voter Identity card and dispatches it via Post Office within 30 days."
        ],
        hi: [
          "निर्वाचन प्रपत्र 6 भरें: वोटर्स पोर्टल पर लॉगिन करें। नए पंजीकरण के लिए फॉर्म 6 चुनें (अथवा सुधार/स्थानांतरण के लिए फॉर्म 8 चुनें)।",
          "दस्तावेज अपलोड: ताजा रंगीन पासपोर्ट फोटो, आयु का प्रमाण (18 वर्ष पूरा होने का आधार कार्ड) तथा निवास स्थान का साक्ष्य अपलोड करें।",
          "आधिकारिक समीक्षा (BLO Verification): आपका आवेदन संबंधित बूथ लेवल अधिकारी (BLO) को भौतिक निवास स्थल सत्यापन हेतु भेजा जाता है।",
          "मतदाता सूची में प्रकाशन: भौतिक पुष्टि होने पर निर्वाचक पंजीकरण अधिकारी विधानसभा क्षेत्र की आधिकारिक सूची में आपका नाम प्रकाशित करते हैं।",
          "EPIC सुरक्षा कार्ड मुद्रण: भारत निर्वाचन आयोग (ECI) द्वारा नया डिजिटल सुरक्षा होलोग्राम से लैस वोटर आईडी कार्ड डाक द्वारा डिलीवर किया जाता है।"
        ]
      };
      externalLinks = [
        { label: "ECI Voters Service Portal", url: "https://voters.eci.gov.in" }
      ];
    } else if (sId.includes("ration") || sId.includes("pds") || sId.includes("-ration")) {
      designatedOffice = {
        en: "Office of District Food and Civil Supplies / Local Ration Supply Inspector Desk",
        hi: "जिला खाद्य एवं नागरिक आपूर्ति कार्यालय / स्थानीय राशन आपूर्ति निरीक्षक डेस्क"
      };
      feesNotes = {
        en: "₹20 processing charge. Biometric updating or name deletion is free.",
        hi: "₹20 प्रसंस्करण शुल्क। परिवार के सदस्यों का बायोमेट्रिक सीडिंग या नाम विलोपन पूर्णतः निःशुल्क है।"
      };
      stepByStep = {
        en: [
          "Collect Family Documents: Compile Aadhaar cards of each sibling, child, and family head with linked active mobile lines.",
          "Attach Income Classification Proof: Secure an income bracket certificate (APL, BPL, or Antyodaya Category) from the Circle Desk.",
          "Submit National PDS Portal: Lodge electronic Form-A on your resident State Food and Supplies e-District dashboard.",
          "PDS Inspector Audit: Supply officers inspect household structures and verify cooking gas connections to prevent double allotments.",
          "Fair Price Shop Linking: Food Card is signed, printed, and linked to your local neighborhood Fair Price Shop (Ration Dealer)."
        ],
        hi: [
          "पारिवारिक प्रमाण पत्र एकत्र करें: परिवार के सभी सदस्यों के आधार कार्ड की प्रतियां तथा बैंक खाता विवरण संकलित करें।",
          "श्रेणी वर्गीकरण प्रमाण: सर्कल कार्यालय से परिवार की सत्यापित श्रेणी (APL, BPL अत्यंत गरीब परिवार या अंत्योदय) का आय प्रमाण जोड़ें।",
          "नागरिक आपूर्ति पोर्टल आवेदन: राज्य खाद्य एवं नागरिक आपूर्ति अनुभाग के पोर्टल पर अथवा नजदीकी जन सेवा केंद्र (CSC) में जाकर राशन प्रपत्र भरें।",
          "आपूर्ति निरीक्षक सत्यापन: रसद विभाग के निरीक्षक कोटे के दुरुपयोग और दोहरे आवंटन को रोकने के लिए रसोई गैस कनेक्शन जांच करते हैं।",
          "डिपो (Fair Price Shop) आवंटन: अनुमोदन मिलने पर परिवार का डिजिटल राशन कार्ड जनरेट कर नजदीकी उचित दर सरकारी डिपो डीलर से लिंक कर दिया जाता है।"
        ]
      };
      externalLinks = [
        { label: "National Food Security Portal", url: "https://nfsa.gov.in" }
      ];
    } else if (sId.includes("abha") || sId.includes("health") || sId.includes("pmjay")) {
      designatedOffice = {
        en: "National Health Authority (NHA) / District Hospital / Public Health Center (PHC)",
        hi: "राष्ट्रीय स्वास्थ्य प्राधिकरण (NHA) / जिला सरकारी अस्पताल / प्राथमिक स्वास्थ्य केंद्र (PHC)"
      };
      feesNotes = {
        en: "100% Free of Cost. No hidden charges apply for generating or printing ABHA Cards.",
        hi: "पूर्णतः निःशुल्क। आभा स्वास्थ्य कार्ड बनाने या डिजिटल मुद्रण के लिए कोई शुल्क नहीं लिया जाता है।"
      };
      stepByStep = {
        en: [
          "Enter Aadhaar credentials: Log into the National Health Account registration portal and input your 12-digit UIDAI identity.",
          "Aadhaar OTP verification: Receive a digital OTP on the active mobile number linked with your biometric profile.",
          "Verify Demographics: National Health Authority retrieves your name, DOB, and photo directly from secure UIDAI registries.",
          "Assign Health Address: Set up your customizable clinical health email address (like name@abdm) for hospital records sync.",
          "Instant Card Download: Download your unified 14-digit ABHA Card loaded with barcode security stamps."
        ],
        hi: [
          "आधार संख्या प्रविष्टि: राष्ट्रीय आभा स्वास्थ्य पंजीकरण अनुभाग में लॉगिन करें और अपनी 12-अंकीय आधार संख्या दर्ज करें।",
          "ओटीपी सत्यापन: आधार डेटाबेस में पंजीकृत आपके सक्रिय मोबाइल नंबर पर प्राप्त वन-टाइम पासवर्ड (OTP) दर्ज करें।",
          "जनसांख्यिकी पुष्टीकरण: नेशनल हेल्थ अथॉरिटी सीधे सुरक्षित यूआईडीएआई डेटाबेस से आपका नाम, जन्मतिथि और फोटो प्राप्त कर प्रदर्शित करती है।",
          "हेल्थ हैंडल निर्मित करें: अस्पतालों के बीच पर्चियां साझा करने हेतु अपना कस्टमाइज्ड डिजिटल स्वास्थ्य पता (जैसे name@abdm) सेट करें।",
          "तत्काल कार्ड डाउनलोड: 14-अंकीय बारकोड से सुरक्षित डिजिटल एबीएचए (ABHA) स्वास्थ्य कार्ड को तत्काल डाउनलोड करें।"
        ]
      };
      externalLinks = [
        { label: "ABDM ABHA Portal", url: "https://abha.abdm.gov.in" },
        { label: "AB-PMJAY Beneficiary Portal", url: "https://beneficiary.nha.gov.in" }
      ];
    } else if (sId.includes("eshram") || sId.includes("workers") || sId.includes("mole-eshram")) {
      designatedOffice = {
        en: "Ministry of Labour & Employment / Nearest Common Service Center (CSC) kiosk",
        hi: "श्रम एवं रोजगार मंत्रालय / नजदीकी प्रज्ञा एवं जन सेवा केंद्र (CSC)"
      };
      feesNotes = {
        en: "100% Free of Cost. Official service fee is zero for unorganized workers registration.",
        hi: "पूर्णतः निःशुल्क। असंगठित कामगारों के राष्ट्रीय ई-श्रम पंजीकरण के लिए सरकार कोई शुल्क नहीं लेती है।"
      };
      stepByStep = {
        en: [
          "Verify Aadhaar with Mobile OTP: Provide UIDAI identity and authenticate using security SMS pin verification.",
          "Profile Setup: Input primary occupation details (e.g. brick kiln, loader, courier driver, farmer) with income scales.",
          "Input Bank Account (IFSC): Set up Direct Benefit Transfer mapping by attaching your secure bank account number and IFSC.",
          "Verify Nominee Details: Fill nominee details (spouse/child) to secure central accidental death benefits (Pramaan Cover).",
          "Download UAN Card: Instantly generate and print your 12-digit Universal Account Number (UAN) e-Shram card."
        ],
        hi: [
          "आधार और मोबाइल मिलान: श्रम पंजीकरण डेस्क पर आधार संख्या भरें और सक्रिय मोबाइल पर प्राप्त गोपनीय एसएमएस कोड सत्यापित करें।",
          "व्यक्तिगत और कार्य विवरण: अपनी प्राथमिक आजीविका (जैसे निर्माण कार्य, कृषि मजदूर, रेहड़ी-पटरी विक्रेता, घरेलू कामगार) चुनें।",
          "डीबीटी बैंक सब्सिडी खाता (IFSC): भविष्य में आपातकालीन आपदा सहायता भत्ता सीधे प्राप्त करने के लिए अपना सही बैंक खाता विवरण भरें।",
          "नॉमिनी मनोनयन प्रविष्टि: दुर्घटना मृत्यु सुरक्षा कवर सुनिश्चित करने के लिए अपने परिवार के नामांकित सदस्य (पति/पत्नी/संतान) का नाम भरें।",
          "UAN कार्ड डाउनलोड: राष्ट्रीय कामगार डेटाबेस में पंजीकरण होते ही आपका 12-अंकीय यूनिवर्सल अकाउंट नंबर (UAN) ई-श्रम कार्ड तत्काल तैयार हो जाता है।"
        ]
      };
      externalLinks = [
        { label: "e-Shram Official Registration", url: "https://eshram.gov.in" }
      ];
    }

    // Dynamic matching of revenue/category wizard records
    let matchingWizardDoc = null;
    if (sId.includes("domicile") || sId.includes("residence") || sId.includes("niwas") || sId.includes("निवास")) {
      matchingWizardDoc = DOCUMENTS_REGISTRY.find(d => d.id === "domicile");
    } else if (sId.includes("caste") || sId.includes("social") || sId.includes("जाति")) {
      matchingWizardDoc = DOCUMENTS_REGISTRY.find(d => d.id === "caste-certificate");
    } else if (sId.includes("income") || sId.includes("revenue-income") || sId.includes("आय")) {
      matchingWizardDoc = DOCUMENTS_REGISTRY.find(d => d.id === "income-certificate");
    } else if (sId.includes("ews") || sId.includes("आर्थिक")) {
      matchingWizardDoc = DOCUMENTS_REGISTRY.find(d => d.id === "ews-certificate");
    }

    if (matchingWizardDoc) {
      designatedOffice = matchingWizardDoc.designatedOffice;
      feesNotes = matchingWizardDoc.fees.notes;
      stepByStep = matchingWizardDoc.stepByStep;
      
      const mergedLinks = [...matchingWizardDoc.externalLinks];
      if (isStateService && matchedState) {
        const stateHasAlready = mergedLinks.some(l => l.label.toLowerCase().includes(matchedState.name.toLowerCase()) || l.url.includes(matchedState.id));
        if (!stateHasAlready) {
          mergedLinks.unshift({
            label: `${matchedState.name} e-District Portal`,
            url: `https://edistrict.${matchedState.id}.gov.in`
          });
        }
      }
      externalLinks = mergedLinks;
    }

    return {
      agencyName,
      agencyRole,
      address,
      website,
      helpline,
      socialX,
      socialTelegram,
      eligibilityConditions,
      updateDocuments,
      tatkalOption,
      isStateService,
      matchedState,
      regionName,
      designatedOffice,
      feesNotes,
      stepByStep,
      externalLinks,
      faqs
    };
  }, [service, language]);

  // 2. DYNAMIC CENTER LOCATOR SEARCH ENGINE
  // Generate stable mock center locations based on selected state boundaries
  const physicalCenters = useMemo(() => {
    const matchedState = meta.matchedState || JURISDICTIONS[0];
    const isUnionTerritory = matchedState.isUT;
    const centerTypes = [
      { prefix: "National e-District Sewa Kendra (NIC)", suffix: "Civil Lines Complex, Block-B" },
      { prefix: "CSC Citizen Center Portal", suffix: "Main Retail Market Complex, near Municipal Hub" },
      { prefix: "Lok Seva Hub & Tehsildar Office", suffix: "Sub-Divisional Magistrate Judicial Complex Office" }
    ];

    if (service.id.includes("uidai") || service.id.includes("aadhaar")) {
      return [
        { id: "c1", name: `Aadhaar Seva Kendra, District HQ`, address: `Sector-5, Civic Administration Center, near State Library, PIN-110011`, phone: "011-23091497", hours: "9:30 AM - 5:30 PM", distance: "1.2 km", lat: 15, lng: 20 },
        { id: "c2", name: `Aadhaar Enrollment Board, Post Office Branch`, address: `Main GPO, Court Road Colony, PIN-110091`, phone: "011-23485012", hours: "10:00 AM - 4:00 PM", distance: "2.8 km", lat: 40, lng: 55 },
        { id: "c3", name: `Aadhaar Center, SBI Regional Corporate Office`, address: `State Bank Circle, Main Commercial Complex, PIN-110022`, phone: "011-23910382", hours: "10:00 AM - 3:30 PM", distance: "4.5 km", lat: 60, lng: 30 }
      ];
    }

    if (service.id.includes("passport")) {
      return [
        { id: "c1", name: `MEA Passport Seva Kendra (PSK)`, address: `Commercial Trade Tower, Block A-2, Metro Station Bypass Road, Capital City`, phone: "1800-258-1800", hours: "9:00 AM - 6:00 PM", distance: "3.1 km", lat: 25, lng: 45 },
        { id: "c2", name: `Post Office Passport Seva Kendra (POPSK)`, address: `Head Post Office Hub building reception desk, District HQ, Outer Circle`, phone: "011-23190823", hours: "9:30 AM - 4:30 PM", distance: "8.4 km", lat: 50, lng: 20 }
      ];
    }

    // Default dynamic state centers
    return [
      {
        id: "c1",
        name: `${matchedState.name} ${centerTypes[0].prefix}`,
        address: `${centerTypes[0].suffix}, District HQ Head Town, ${matchedState.name}`,
        phone: "1800-420-1002",
        hours: "10:00 AM - 5:00 PM",
        distance: "0.8 km",
        lat: 10,
        lng: 15
      },
      {
        id: "c2",
        name: `${matchedState.name} ${centerTypes[1].prefix}`,
        address: `${centerTypes[1].suffix}, Local Sub-Division Center, ${matchedState.name}`,
        phone: "1800-420-1004",
        hours: "9:00 AM - 6:00 PM",
        distance: "3.5 km",
        lat: 45,
        lng: 70
      },
      {
        id: "c3",
        name: `CSC Nodal Point Authority`,
        address: `${centerTypes[2].suffix}, Revenue Patwari Ring, ${matchedState.name}`,
        phone: "1800-420-1009",
        hours: "10:00 AM - 4:30 PM",
        distance: "6.2 km",
        lat: 75,
        lng: 35
      }
    ];
  }, [service, meta]);

  // Initial render setup for center locations search
  useMemo(() => {
    setSearchedCenters(physicalCenters);
    setSelectedCenterId(physicalCenters[0]?.id || null);
  }, [physicalCenters]);

  const handlePincodeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeQuery.trim() || pincodeQuery.length !== 6 || isNaN(Number(pincodeQuery))) {
      triggerToast(
        language === "hi" 
          ? "कृपया एक वैध 6-अंकीय पिन कोड दर्ज करें।" 
          : "Please enter a valid 6-digit PIN code.",
        "error"
      );
      return;
    }

    // Filter or adjust mock details based on search to simulate query
    const results = physicalCenters.map((c, index) => ({
      ...c,
      distance: (index + 1) * 1.5 + Math.floor(Math.random() * 4) + "." + Math.floor(Math.random() * 9) + " km",
      address: c.address.replace(/PIN-\d{6}/g, `PIN-${pincodeQuery}`)
    }));

    setSearchedCenters(results);
    setSelectedCenterId(results[0]?.id || null);
    triggerToast(
      language === "hi"
        ? `पिन कोड ${pincodeQuery} के तहत नजदीकी केंद्र मिले!`
        : `Identified nearby registered offices for pincode ${pincodeQuery}!`,
      "success"
    );
  };

  // Formatted Print / PDF Document Generator
  const handlePrintPdf = () => {
    triggerToast(
      language === "hi"
        ? "प्रिंट/पीडीएफ दस्तावेज़ तैयार किया जा रहा है..."
        : "Preparing formatted Print/PDF document...",
      "info"
    );

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      // Fallback if popup window was blocked
      window.print();
      return;
    }

    const docContent = `
      <!DOCTYPE html>
      <html lang="${language === "hi" ? "hi" : "en"}">
      <head>
        <meta charset="utf-8" />
        <title>${service.title} - Official Citizen Dossier</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            color: #1c1917;
            padding: 32px;
            max-width: 820px;
            margin: 0 auto;
            line-height: 1.5;
            background: #ffffff;
          }
          .header {
            border-bottom: 3px solid #ff5a2b;
            padding-bottom: 16px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .title-area h1 {
            font-size: 22px;
            margin: 6px 0 4px 0;
            color: #0c0a09;
            font-weight: 800;
          }
          .title-area p {
            margin: 0;
            font-size: 13px;
            color: #57534e;
          }
          .badge {
            background: #ff5a2b;
            color: white;
            font-size: 10px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: inline-block;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }
          .card {
            background: #fafaf9;
            border: 1px solid #e7e5e4;
            padding: 12px 16px;
            border-radius: 8px;
          }
          .card-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #78716c;
            font-weight: 700;
            display: block;
            margin-bottom: 4px;
          }
          .card-value {
            font-size: 13px;
            font-weight: 700;
            color: #1c1917;
          }
          .section {
            margin-bottom: 22px;
          }
          .section h2 {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #e7e5e4;
            padding-bottom: 6px;
            margin-bottom: 10px;
            color: #292524;
            font-weight: 800;
          }
          ul {
            margin: 0;
            padding-left: 20px;
          }
          li {
            font-size: 12.5px;
            margin-bottom: 6px;
            color: #334155;
          }
          .step-list {
            list-style: none;
            padding: 0;
          }
          .step-list li {
            position: relative;
            padding-left: 28px;
            margin-bottom: 10px;
            font-size: 12.5px;
          }
          .step-number {
            position: absolute;
            left: 0;
            top: 2px;
            width: 18px;
            height: 18px;
            background: #ff5a2b;
            color: white;
            font-size: 10px;
            font-weight: 800;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .footer {
            margin-top: 36px;
            padding-top: 16px;
            border-top: 1px dashed #d6d3d1;
            font-size: 11px;
            color: #a8a29e;
            text-align: center;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title-area">
            <span class="badge">INDIA SEWANADU — VERIFIED DOSSIER</span>
            <h1>${service.title}</h1>
            <p>${service.department} — ${meta.agencyName}</p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: 800; color: #ff5a2b;">₹ ${service.fees === 0 ? "FREE OF COST" : service.fees}</div>
            <div style="font-size: 11px; color: #78716c;">Processing Time: ${service.processingTime}</div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <span class="card-label">Designated Desk / Office</span>
            <div class="card-value">${meta.designatedOffice[language === "hi" ? "hi" : "en"] || meta.designatedOffice.en}</div>
          </div>
          <div class="card">
            <span class="card-label">Helpline Support</span>
            <div class="card-value">${meta.helpline}</div>
          </div>
        </div>

        <div class="section">
          <h2>1. Required Documents for New Registration</h2>
          <ul>
            ${service.documentsRequired.map(d => `<li>${d}</li>`).join("")}
          </ul>
        </div>

        ${meta.updateDocuments && meta.updateDocuments.length > 0 ? `
          <div class="section">
            <h2>2. Documents for Corrections & Updates</h2>
            <ul>
              ${meta.updateDocuments.map(d => `<li>${d}</li>`).join("")}
            </ul>
          </div>
        ` : ""}

        <div class="section">
          <h2>3. Step-by-Step Procedure</h2>
          <ol class="step-list">
            ${(meta.stepByStep[language === "hi" ? "hi" : "en"] || meta.stepByStep.en).map((step: string, i: number) => `
              <li>
                <span class="step-number">${i + 1}</span>
                ${step}
              </li>
            `).join("")}
          </ol>
        </div>

        <div class="section">
          <h2>4. Official Portal & Reference Portals</h2>
          <ul>
            ${meta.externalLinks.map((link: { label: string; url: string }) => `<li><strong>${link.label}:</strong> ${link.url}</li>`).join("")}
          </ul>
        </div>

        <div class="footer">
          Digitally generated via India SewaNadu Citizen Portal on ${new Date().toLocaleDateString()}. RTI-Compliant Reference Document for Offline Use.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(docContent);
    printWindow.document.close();
  };

  // Simulating the printable PDF Cheatsheet generator
  const downloadCheatsheet = () => {
    triggerToast(
      language === "hi"
        ? "आधिकारिक नागरिक दस्तावेज गाइड डाउनलोड की जा रही है..."
        : "Downloading verified civic dossier and requirements checklist...",
      "info"
    );

    setTimeout(() => {
      // Create element and simulate simple text payload download
      const content = `
============================================================
           INDIA SEWANADU - OFFICIAL CITIZEN DOSSIER
============================================================
DOCUMENT/SERVICE: ${service.title}
DEPARTMENT:       ${service.department}
MANAGING AGENCY:  ${meta.agencyName}
PROCESSING SLA:   ${service.processingTime}
OFFICIAL FEE:     ₹ ${service.fees === 0 ? "FREE OF COST" : service.fees}
HELPLINE SUPPORT: ${meta.helpline}

------------------------------------------------------------
1. NEW ISSUANCE DOCUMENTS REQUIRED:
------------------------------------------------------------
${service.documentsRequired.map((doc, i) => `[ ] ${i + 1}. ${doc}`).join("\n")}

------------------------------------------------------------
2. UPDATES & CORRECTIONS DOCUMENTS REQUIRED:
------------------------------------------------------------
${meta.updateDocuments.map((doc, i) => `[ ] ${i + 1}. ${doc}`).join("\n")}

------------------------------------------------------------
3. ELIGIBILITY CONDITIONS:
------------------------------------------------------------
${meta.eligibilityConditions.map((cond, i) => `* ${cond}`).join("\n")}

------------------------------------------------------------
4. TATKAL (EXPEDITED) CLAUSES:
------------------------------------------------------------
* Available:   ${meta.tatkalOption.available ? "YES" : "NO"}
* Timeline:    ${meta.tatkalOption.time}
* Priority Fee: ${meta.tatkalOption.available ? `₹ ${meta.tatkalOption.extraFee}` : "N/A"}
* Clause:      ${meta.tatkalOption.description}

============================================================
Verify digitally via National DigiLocker sandbox parameters.
This dossier checklist is RTI-Compliant under e-Sewa Guidelines.
============================================================
      `;

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${service.id}-citizen-dossier.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerToast(
        language === "hi" ? "दस्तावेज सूची सफलतापूर्वक सहेज ली गई है!" : "Citizen dossier checklist saved successfully!",
        "success"
      );
    }, 1200);
  };

  const selectedCenter = searchedCenters.find(c => c.id === selectedCenterId) || searchedCenters[0];

  return (
    <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs text-left" id={`dossier-page-${service.id}`}>
      
      {/* Banner Top Panel */}
      <div className="bg-gradient-to-r from-stone-900 to-slate-900 text-white p-6 md:p-8 relative">
        <div className="absolute top-0 right-0 w-64 h-full bg-[#FF5A2B]/10 rounded-l-full blur-2xl pointer-events-none"></div>
        
        {/* Back and Breadcrumb navigation line */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4" id="dossier-actions-header">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white uppercase font-mono tracking-wider bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl transition cursor-pointer select-none"
              id="dossier-back-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === "hi" ? "पीछे सूची" : "Back to Registry"}</span>
            </button>
            <span className="text-stone-500 font-mono text-[11px] select-none">/</span>
            <span className="text-stone-400 font-mono text-[11px] truncate uppercase max-w-[150px] sm:max-w-[200px] select-none">
              {service.id}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2" id="dossier-actions-group">
            {/* Connection Status Badge */}
            <div 
              className={`flex items-center gap-1.5 text-[9.5px] font-mono font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-xl border select-none transition-all duration-300 ${
                isOnline 
                  ? "bg-emerald-950/40 border-emerald-500/20 text-emerald-400" 
                  : "bg-amber-950/40 border-amber-500/20 text-amber-400 animate-pulse"
              }`}
              id="dossier-connection-badge"
              title={isOnline ? "Active connection detected" : "Intermittent or disconnected status"}
            >
              {isOnline ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3 text-amber-400" />
              )}
              <span>{isOnline ? (language === "hi" ? "ऑनलाइन" : "ONLINE") : (language === "hi" ? "ऑफलाइन" : "OFFLINE")}</span>
            </div>

            {/* Print / PDF Document Action Button */}
            <button
              type="button"
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 text-xs font-mono tracking-wider px-3 py-1.5 rounded-xl transition cursor-pointer select-none border border-white/10 bg-white/10 text-stone-300 hover:text-white hover:bg-white/15"
              id="dossier-print-btn"
              title={language === "hi" ? "प्रिंट या पीडीएफ के रूप में सहेजें" : "Print or Save as PDF"}
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === "hi" ? "प्रिंट/PDF" : "PRINT/PDF"}</span>
            </button>

            {/* Save for Offline Toggle */}
            <button
              type="button"
              onClick={handleToggleOfflineCache}
              className={`flex items-center gap-1.5 text-xs font-mono tracking-wider px-3 py-1.5 rounded-xl transition cursor-pointer select-none border border-white/10 ${
                isOfflineCached 
                  ? "bg-emerald-600 border-emerald-500 text-white font-bold shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
                  : "bg-white/10 text-stone-300 hover:text-white hover:bg-white/15"
              }`}
              id="dossier-offline-toggle"
              title={isOfflineCached ? (language === "hi" ? "ऑफ़लाइन सहेजा गया" : "Offline Available") : (language === "hi" ? "ऑफ़लाइन उपयोग के लिए सहेजें" : "Save for Offline")}
            >
              <Database className={`w-3.5 h-3.5 ${isOfflineCached ? "text-white animate-pulse" : "text-stone-300"}`} />
              <span>{isOfflineCached ? (language === "hi" ? "सहेजा" : "OFFLINED") : (language === "hi" ? "OFFLINE" : "OFFLINE")}</span>
            </button>

            {/* Share action button with interactive dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={handleShareClick}
                className={`flex items-center gap-1.5 text-xs font-mono tracking-wider px-3 py-1.5 rounded-xl transition cursor-pointer select-none border border-white/10 ${
                  shareCopied 
                    ? "bg-emerald-600 text-white font-bold" 
                    : showShareMenu
                      ? "bg-stone-700 text-white border-stone-500"
                      : "bg-white/10 text-stone-300 hover:text-white hover:bg-white/15"
                }`}
                id="dossier-share-btn"
                title={language === "hi" ? "साझा करें" : "Share Service Details"}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{shareCopied ? (language === "hi" ? "कॉपी!" : "COPIED!") : (language === "hi" ? "साझा" : "SHARE")}</span>
              </button>

              <AnimatePresence>
                {showShareMenu && (
                  <>
                    {/* Invisible click-away overlay overlaying only local space under top banner */}
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setShowShareMenu(false)}
                      style={{ opacity: 0 }}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-stone-900 border border-stone-850 p-2 shadow-2xl z-50 text-left font-sans text-stone-100"
                      id="share-dropdown-menu"
                    >
                      <div className="px-3 py-1.5 border-b border-stone-850">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-black">
                          {language === "hi" ? "साझा करें" : "SHARE VIA"}
                        </span>
                      </div>
                      
                      <div className="space-y-0.5 mt-1.5">
                        {/* WhatsApp share */}
                        <button
                          type="button"
                          onClick={handleWhatsAppShare}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-emerald-600/15 hover:text-emerald-400 text-stone-300 transition text-left font-semibold cursor-pointer"
                          id="share-whatsapp-action"
                        >
                          <svg className="w-4 h-4 text-emerald-500 shrink-0 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.8 1.45 5.503 0 9.948-4.444 9.95-9.948.002-2.666-1.034-5.174-2.91-7.052C16.596 1.724 14.093.684 11.432.684c-5.51 0-10.016 4.443-10.018 9.95 0 1.9 1.4 3.4 1.4 4.8l-1.05 3.8.3.3 3.8-.9zM17.5 14.5c-.3-.15-1.7-.85-1.95-.95-.25-.1-.45-.15-.65.15-.2.3-.75.95-.9 1.1-.15.2-.3.2-.6.05-1.25-.63-2.1-1.12-2.95-2.6-.2-.35 0-.55.15-.7.15-.15.3-.35.45-.5.15-.15.2-.25.3-.4.1-.15.05-.3 0-.45-.05-.15-.45-1.1-.65-1.55-.17-.4-.35-.35-.5-.35H10.15c-.2 0-.5.1-.75.35-1.05 1.15-1.05 2.15 0 3.3.3.4.6.85 1 1.25 1.7 1.63 3.6 2.7 5.8 2.5.55-.05 1.1-.2 1.5-.5.4-.3.65-.7.65-1.15s-.15-.5-.45-.65z" />
                          </svg>
                          <span>WhatsApp</span>
                        </button>

                        {/* SMS share */}
                        <button
                          type="button"
                          onClick={handleSMSShare}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-sky-600/15 hover:text-sky-400 text-stone-300 transition text-left font-semibold cursor-pointer"
                          id="share-sms-action"
                        >
                          <MessageSquare className="w-4 h-4 text-sky-550 shrink-0" />
                          <span>SMS / Messages</span>
                        </button>

                        {/* Web Share (Device native) */}
                        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                          <button
                            type="button"
                            onClick={handleNativeShare}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-amber-500/15 hover:text-amber-400 text-stone-300 transition text-left font-semibold cursor-pointer"
                            id="share-native-action"
                          >
                            <Share2 className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>{language === "hi" ? "डिवाइस विकल्प" : "Device Share"}</span>
                          </button>
                        )}

                        {/* Copy link */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const { shareUrl } = getShareInfo();
                            copyToClipboard(shareUrl);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-stone-800 hover:text-stone-100 text-stone-300 transition text-left font-semibold cursor-pointer"
                          id="share-copy-action"
                        >
                          <Copy className="w-4 h-4 text-stone-500 shrink-0" />
                          <span>{language === "hi" ? "लिंक कॉपी करें" : "Copy Link"}</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Bookmark/Save action button */}
            <button
              type="button"
              onClick={handleSaveToggleClick}
              className={`flex items-center gap-1.5 text-xs font-mono tracking-wider px-3 py-1.5 rounded-xl transition cursor-pointer select-none border border-white/10 ${
                isSaved 
                  ? "bg-amber-400 text-stone-900 font-bold" 
                  : "bg-white/10 text-stone-300 hover:text-white hover:bg-white/15"
              }`}
              id="dossier-save-btn"
              title={isSaved ? (language === "hi" ? "सहेजा गया" : "Saved") : (language === "hi" ? "सहेजें" : "Save")}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-stone-900 text-stone-900" : "text-stone-300"}`} />
              <span>{isSaved ? (language === "hi" ? "सहेजा" : "SAVED") : (language === "hi" ? "SAVE" : "SAVE")}</span>
            </button>
          </div>
        </div>

        {/* Agency Stamp Logo (National Emblem look alike motif) */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6" id="dossier-header-layout">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-600 text-[9.5px] text-white font-mono font-black tracking-widest px-2.5 py-0.5 rounded uppercase leading-none select-none">
                {language === "hi" ? "सत्यापित गजट" : "VERIFIED GAZETTE"}
              </span>
              <span className={`text-[9.5px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded leading-none select-none ${
                meta.isStateService ? "bg-indigo-900 text-indigo-200" : "bg-amber-950 text-amber-300"
              }`}>
                {meta.regionName}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-display tracking-tight leading-tight">
              {service.title}
            </h1>

            <div className="space-y-3.5" id="dossier-description-translate-container">
              <p className="text-xs text-stone-300 font-sans max-w-3xl leading-relaxed">
                {translatedDescription || service.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={translatedDescription ? () => setTranslatedDescription(null) : handleTranslateDescription}
                  disabled={isTranslating}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition select-none cursor-pointer border ${
                    translatedDescription
                      ? "bg-stone-850 border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white"
                      : "bg-emerald-600/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/35 hover:border-emerald-500/50"
                  }`}
                  id="dossier-auto-translate-button"
                >
                  {isTranslating ? (
                    <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                  ) : translatedDescription ? (
                    <RefreshCw className="w-3 h-3 text-stone-400" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-emerald-400 fill-emerald-400/25" />
                  )}
                  <span>
                    {isTranslating
                      ? (language === "hi" ? "अनुवाद किया जा रहा है..." : "Translating...")
                      : translatedDescription
                      ? (language === "hi" ? "मूल दिखाएं" : "Show Original")
                      : (language === "hi" ? "हिन्दी में अनुवाद" : `Translate to ${LANGUAGE_NAMES[language] || "Language"}`)}
                  </span>
                </button>
                
                {translatedDescription && (
                  <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    {language === "hi" ? "एआई द्वारा अनुवादित" : `AI Translated to ${LANGUAGE_NAMES[language] || "Language"}`}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Info Shield Card */}
          <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-row sm:flex-col justify-between items-center sm:text-right shrink-0 gap-4 w-full sm:w-auto">
            <div className="text-left sm:text-right space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block tracking-wider">
                {language === "hi" ? "निर्धारित सरकारी शुल्क" : "Statutory Govt Fee"}
              </span>
              <div className="text-xl font-mono font-black text-amber-400">
                {service.fees === 0 ? (language === "hi" ? "निशुल्क (₹0)" : "₹0 FREE") : `₹ ${service.fees}`}
              </div>
            </div>
            <div className="text-left sm:text-right space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block tracking-wider">
                {language === "hi" ? "मानक समय सीमा" : "SLA Timeline"}
              </span>
              <div className="text-xs font-mono font-extrabold flex items-center gap-1 sm:justify-end text-emerald-400">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{service.processingTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar row */}
      <div className="flex border-b border-stone-200 overflow-x-auto bg-stone-50 select-none scrollbar-none sticky top-0 z-10" id="dossier-tabs-row">
        {[
          { id: "overview", label: language === "hi" ? "प्राधिकरण और पात्रता" : "Agency & Eligibility", icon: Building },
          { id: "documents", label: language === "hi" ? "आवश्यक दस्तावेज / सुधार" : "Document Rules & Updates", icon: FileText },
          { id: "procedure", label: language === "hi" ? "आवेदन मार्गदर्शिका (Wizard)" : "Step-by-Step Guide (Wizard)", icon: Scroll },
          { id: "form", label: language === "hi" ? "लाइव आवेदन फॉर्म (Live)" : "Online Web Form (Live)", icon: ClipboardCheck },
          { id: "centers", label: language === "hi" ? "भौतिक पंजीकरण केंद्र (" + searchedCenters.length + ")" : "Physical Center Finder (" + searchedCenters.length + ")", icon: MapPin },
          { id: "support", label: language === "hi" ? "हेल्पलाइन और सोशल" : "Helpline & Social Point", icon: Phone }
        ].map(tab => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-4 border-b-2 font-bold text-xs uppercase tracking-wider transition whitespace-nowrap cursor-pointer select-none ${
                isActive 
                  ? "border-orange-600 text-orange-650 bg-white" 
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-stone-100/50"
              }`}
            >
              <TabIcon className="w-4 h-4 text-stone-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main tab panel render section */}
      <div className="p-6 md:p-8" id="dossier-panels-container">
        
        {/* Offline & Cache Banner */}
        {(isOfflineCached || !isOnline) && (
          <div className={`mb-6 p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans transition-all duration-300 ${
            !isOnline
              ? "bg-amber-500/10 border-amber-500/20 text-amber-900"
              : "bg-emerald-50/60 border-emerald-500/15 text-emerald-800"
          }`}>
            <div className="flex items-start gap-2.5">
              <span className="text-base mt-0.5 shrink-0">
                {!isOnline ? "⚠️" : "✓"}
              </span>
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold font-sans">
                  {!isOnline 
                    ? (language === "hi" ? "ऑफ़लाइन मोड सक्रिय" : "Offline Mode Active")
                    : (language === "hi" ? "ऑफ़लाइन उपलब्धता सुरक्षित" : "Offline Cache Confirmed")}
                </h5>
                <p className="text-[11px] text-stone-600 leading-normal font-sans">
                  {!isOnline
                    ? (isOfflineCached 
                        ? (language === "hi" ? "आप वर्तमान में ऑफ़लाइन हैं। इस सेवा का स्थानीय रूप से सहेजा गया विवरण प्रदर्शित हो रहा है।" : "You are currently offline. Viewing the locally cached copy of this citizen service checklist.")
                        : (language === "hi" ? "कनेक्टिविटी नहीं मिली। यह सेवा ऑफ़लाइन सहेजी नहीं गई है। कृपया ऑनलाइन होने पर 'ऑफलाइन' सक्षम करें।" : "No internet connection detected. This service has not been cached for offline use yet."))
                    : (language === "hi" ? "यह चेकलिस्ट स्थानीय स्तर पर ऑफलाइन उपयोग के लिए सहेजी गई है। जब आपके पास इंटरनेट कनेक्टिविटी नहीं होगी, तब भी यह सुलभ रहेगी।" : "This checklist is cached locally. It will remain accessible even when you experience intermittent or no network connectivity.")
                  }
                </p>
              </div>
            </div>
            
            {!isOnline && !isOfflineCached && (
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined") {
                    setIsOnline(navigator.onLine);
                  }
                }}
                className="shrink-0 text-[10px] font-mono font-bold bg-amber-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-amber-700 transition cursor-pointer border-0"
              >
                {language === "hi" ? "कनेक्शन जांचें" : "RETRY CONNECTION"}
              </button>
            )}
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
              id="dossier-panel-overview"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Eligibility criteria column */}
                <div className="md:col-span-2 space-y-4">
                  <div className="border border-stone-200 rounded-2xl p-5 space-y-3">
                    <h3 className="font-display font-black text-slate-950 text-sm tracking-tight flex items-center gap-2">
                      <Scroll className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                      <span>{language === "hi" ? "नियमावली और पात्रता शर्तें" : "Terms & Eligibility Conditions"}</span>
                    </h3>
                    <p className="text-xs text-stone-500">
                      {language === "hi" 
                        ? `नागरिक अधिकार चार्टर के तहत ${service.title} बनाने की बुनियादी शर्तें:`
                        : `Mandatory citizen profile requirements for obtaining the ${service.title}:`}
                    </p>

                    <div className="space-y-2.5 pt-2">
                      {meta.eligibilityConditions.map((cond, index) => (
                        <div key={index} className="flex items-start gap-2 text-xs leading-relaxed text-stone-750">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{cond}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tatkal Expedited Options */}
                  <div className={`border rounded-2xl p-5 flex items-start gap-4 transition-all ${
                    meta.tatkalOption.available 
                      ? "bg-amber-50/50 border-amber-200" 
                      : "bg-stone-50/40 border-stone-200"
                  }`}>
                    <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                      meta.tatkalOption.available ? "text-amber-600" : "text-stone-400"
                    }`} />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <strong className="text-xs font-black text-stone-900 uppercase tracking-tight">
                          {language === "hi" ? "तत्काल / दूत आवेदन विकल्प" : "Tatkal Express Processing Scheme"}
                        </strong>
                        <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-sm leading-none ${
                          meta.tatkalOption.available ? "bg-amber-655 text-white" : "bg-stone-200 text-stone-500"
                        }`}>
                          {meta.tatkalOption.available ? "SUPPORTED" : "STANDARD ONLY"}
                        </span>
                      </div>
                      <p className="text-[11.5px] text-stone-600 leading-normal">
                        {meta.tatkalOption.description}
                      </p>
                      {meta.tatkalOption.available && (
                        <div className="p-2.5 bg-white border border-amber-200 rounded-xl inline-grid grid-cols-2 gap-4 text-[10.5px] font-mono font-bold font-sans">
                          <div>
                            <span className="text-stone-400 block pb-0.5 select-none text-[8.5px] uppercase">TATKAL TIMELINE</span>
                            <span className="text-amber-800 font-extrabold">{meta.tatkalOption.time}</span>
                          </div>
                          <div className="border-l border-amber-100 pl-4">
                            <span className="text-stone-400 block pb-0.5 select-none text-[8.5px] uppercase">PRIORITY FEE</span>
                            <span className="text-emerald-700 font-extrabold">+ ₹ {meta.tatkalOption.extraFee}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Google Search Live Verification Section */}
                  <div className="border border-amber-200/60 bg-amber-50/20 rounded-2xl p-5 space-y-4 text-left" id="dossier-live-verification-block">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center justify-center w-4 h-4 text-[11px] font-black bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent select-none border border-stone-200 rounded-full shadow-3xs bg-white">G</span>
                          <strong className="text-xs font-black text-stone-900 uppercase tracking-tight">
                            {language === "hi" ? "गूगल सर्च लाइव सत्यापन" : "Google Search Live Verification"}
                          </strong>
                        </div>
                        <p className="text-[11px] text-stone-550 leading-normal">
                          {language === "hi" 
                            ? "आधिकारिक सरकारी पोर्टलों को क्रॉस-रेफरेंस करके वर्तमान शुल्क, पात्रता और 2026 के नवीनतम नियमों की जांच करें।"
                            : "Query live government directories and official guidelines for current 2026 parameters, updates, or fee revisions."}
                        </p>
                      </div>
                      
                      <span className="text-[8.5px] font-mono font-black tracking-wider bg-amber-500/10 text-amber-800 border border-amber-500/10 px-2 py-0.5 rounded uppercase select-none">
                        AI-Powered
                      </span>
                    </div>

                    {/* Action buttons or Loading or Output states */}
                    {isVerifying ? (
                      <div className="p-4 bg-white border border-stone-150 rounded-xl flex flex-col items-center justify-center space-y-2 select-none animate-pulse">
                        <RefreshCw className="w-5 h-5 text-amber-500 animate-spin" />
                        <span className="text-[10px] font-mono font-bold text-stone-500">
                          {language === "hi" ? "आधिकारिक डेटा स्रोतों से सत्यापन किया जा रहा है..." : "Filing live search queries on sovereign portals..."}
                        </span>
                      </div>
                    ) : liveVerificationResult ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3.5"
                      >
                        {/* Output text */}
                        <div className="p-4 bg-white border border-stone-150 rounded-xl text-left text-[11.5px] leading-relaxed text-stone-700 whitespace-pre-line font-sans shadow-3xs">
                          {liveVerificationResult}
                        </div>

                        {/* Citations list */}
                        {liveSources && liveSources.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[8px] font-mono font-black tracking-wider text-stone-450 block uppercase select-none">
                              {language === "hi" ? "सत्यापित स्रोत लिंक्स:" : "VERIFIED GROUNDING CITATIONS:"}
                            </span>
                            <div className="flex flex-wrap gap-1.5 select-none">
                              {liveSources.map((src, sIdx) => (
                                <a
                                  key={sIdx}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-200/50 rounded text-[9px] font-semibold text-amber-950 shadow-3xs hover:shadow-2xs transition"
                                  title={src.title}
                                >
                                  <ExternalLink className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                                  <span className="truncate max-w-[130px]">{src.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Re-verify Button */}
                        <button
                          type="button"
                          onClick={handleVerifyLive}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 hover:text-stone-900 rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer select-none"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>{language === "hi" ? "पुनः सत्यापित करें" : "Refresh Live Verification"}</span>
                        </button>
                      </motion.div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleVerifyLive}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-[10.5px] font-sans font-extrabold transition cursor-pointer select-none flex items-center justify-center gap-1.5 shadow-3xs hover:shadow-2xs uppercase tracking-wider"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <span>{language === "hi" ? "गूगल सर्च द्वारा लाइव सत्यापित करें" : "Cross-Verify Live with Google Search"}</span>
                      </button>
                    )}
                  </div>

                </div>

                {/* Issuing official Authority column */}
                <div className="space-y-4">
                  <div className="border border-stone-200 bg-stone-50/40 rounded-2xl p-5 space-y-4">
                    <div className="space-y-1.5 text-left">
                      <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest block leading-none">
                        {language === "hi" ? "प्राधिकृत प्रशासनिक निकाय" : "Managing Official Agency"}
                      </span>
                      <h4 className="font-display font-black text-slate-950 text-xs tracking-tight">
                        {meta.agencyName}
                      </h4>
                      <p className="text-[11px] text-stone-550 leading-relaxed font-sans">
                        {meta.agencyRole}
                      </p>
                    </div>

                    <div className="space-y-2 border-t border-stone-150 pt-3.5 text-[11px] font-mono font-bold text-stone-600 font-sans">
                      <div className="flex items-start gap-2">
                        <Building className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{meta.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-stone-400 shrink-0" />
                        <a 
                          href={meta.website} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-brand-coral hover:underline truncate"
                        >
                          {meta.website.replace("https://", "")} ↗
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Social Share Service Dossier Card */}
                  <div className="border border-stone-200 bg-[#FF5A2B]/5 rounded-2xl p-5 space-y-3.5 text-left" id="social-share-card">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest block leading-none">
                        {language === "hi" ? "त्वरित नागरिक साझाकरण" : "Quick Citizen Share"}
                      </span>
                      <h4 className="font-display font-black text-slate-950 text-xs tracking-tight flex items-center gap-1.5 pt-1">
                        <Share2 className="w-3.5 h-3.5 text-[#FF5A2B] scale-x-[-1]" />
                        <span>{language === "hi" ? "मित्रों और परिवार के साथ साझा करें" : "Share with Citizens"}</span>
                      </h4>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-sans pt-1">
                        {language === "hi" 
                          ? "इस सेवा के दस्तावेज आवश्यकताओं और विवरणों को व्हाट्सएप या एसएमएस के माध्यम से त्वरित साझा करें।"
                          : "Send this service's official checklists and documentation criteria directly to friends, colleagues, or family via WhatsApp or SMS messages."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                      {/* WhatsApp Share Button */}
                      <button
                        type="button"
                        onClick={handleWhatsAppShare}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border border-emerald-200 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-600 hover:text-white transition cursor-pointer select-none leading-none h-11"
                        id="aside-share-whatsapp"
                      >
                        <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.1 1.45 4.8 1.45 5.503 0 9.948-4.444 9.95-9.948.002-2.666-1.034-5.174-2.91-7.052C16.596 1.724 14.093.684 11.432.684c-5.51 0-10.016 4.443-10.018 9.95 0 1.9 1.4 3.4 1.4 4.8l-1.05 3.8.3.3 3.8-.9zM17.5 14.5c-.3-.15-1.7-.85-1.95-.95-.25-.1-.45-.15-.65.15-.2.3-.75.95-.9 1.1-.15.2-.3.2-.6.05-1.25-.63-2.1-1.12-2.95-2.6-.2-.35 0-.55.15-.7.15-.15.3-.35.45-.5.15-.15.2-.25.3-.4.1-.15.05-.3 0-.45-.05-.15-.45-1.1-.65-1.55-.17-.4-.35-.35-.5-.35H10.15c-.2 0-.5.1-.75.35-1.05 1.15-1.05 2.15 0 3.3.3.4.6.85 1 1.25 1.7 1.63 3.6 2.7 5.8 2.5.55-.05 1.1-.2 1.5-.5.4-.3.65-.7.65-1.15s-.15-.5-.45-.65z" />
                        </svg>
                        <span>WhatsApp</span>
                      </button>

                      {/* SMS Share Button */}
                      <button
                        type="button"
                        onClick={handleSMSShare}
                        className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border border-sky-200 bg-sky-500/10 text-sky-700 hover:bg-sky-600 hover:text-white transition cursor-pointer select-none leading-none h-11"
                        id="aside-share-sms"
                      >
                        <MessageSquare className="w-4 h-4 shrink-0" />
                        <span>SMS / Text</span>
                      </button>
                    </div>

                    {/* Copy Web Link Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const { shareUrl } = getShareInfo();
                        copyToClipboard(shareUrl);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-200 text-[#FF5A2B] bg-white hover:bg-stone-50 transition cursor-pointer select-none text-[11px] font-semibold font-mono"
                      id="aside-share-copy"
                    >
                      <Copy className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === "hi" ? "वेब लिंक सुरक्षित कॉपी करें" : "Copy Service Link"}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Relevant FAQs Section */}
              <div className="border border-stone-200 rounded-2xl p-5 md:p-6 space-y-4 bg-gradient-to-b from-white to-stone-50/50" id="relevant-faqs-section">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600 text-white font-extrabold font-mono text-[9px] px-2 py-0.5 rounded tracking-wide uppercase">
                        {language === "hi" ? "शीर्ष 3 प्रासंगिक प्रश्न" : "TOP 3 RELEVANT FAQS"}
                      </span>
                      <h3 className="font-display font-black text-slate-950 text-sm tracking-tight flex items-center gap-1.5">
                        <HelpCircle className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                        <span>{language === "hi" ? "अक्सर पूछे जाने वाले प्रश्न (Relevant FAQs)" : "Relevant FAQs & Citizen Clarifications"}</span>
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500 font-sans">
                      {language === "hi" 
                        ? `इस विशिष्ट सेवा (${service.title}) हेतु शीर्ष 3 सबसे प्रासंगिक प्रश्न एवं आधिकारिक प्रशासनिक समाधान:`
                        : `Top 3 most relevant questions and verified guidelines specific to ${service.title}:`}
                    </p>
                  </div>

                  {/* Expand All / Collapse All button */}
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(openFaqIndex === null ? 0 : null)}
                    className="self-start sm:self-center text-[10.5px] font-mono font-bold text-stone-600 hover:text-stone-900 bg-white border border-stone-250 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition cursor-pointer select-none shrink-0"
                  >
                    {openFaqIndex === null 
                      ? (language === "hi" ? "पहला प्रश्न खोलें" : "Expand First FAQ") 
                      : (language === "hi" ? "सभी बंद करें" : "Collapse FAQs")}
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  {top3RelevantFaqs.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    const isVoted = !!faqHelpfulVotes[index];

                    return (
                      <div 
                        key={index} 
                        className={`border rounded-xl overflow-hidden transition-all duration-200 bg-white ${
                          isOpen 
                            ? "border-blue-300 ring-2 ring-blue-500/10 shadow-sm" 
                            : "border-stone-200 hover:border-stone-300"
                        }`}
                        id={`relevant-faq-item-${index}`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className={`w-full p-4 text-left flex items-start justify-between gap-3 font-semibold text-xs text-stone-900 hover:text-blue-700 transition-colors select-none cursor-pointer ${
                            isOpen ? 'bg-blue-50/40 text-blue-900 font-bold' : 'bg-stone-50/20 hover:bg-stone-50/60'
                          }`}
                          aria-expanded={isOpen}
                        >
                          <div className="space-y-1.5 pr-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[9px] font-mono font-extrabold bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded">
                                {faq.rank}
                              </span>
                              <span className="text-[9px] font-mono font-bold bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded uppercase tracking-wider">
                                {faq.tag}
                              </span>
                            </div>
                            <span className="block text-xs font-bold text-stone-900 leading-snug">
                              {faq.q}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 shrink-0 mt-1">
                            <ChevronDown 
                              className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-600" : ""}`} 
                            />
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.18, ease: "easeInOut" }}
                            >
                              <div className="p-4 pt-3 text-xs text-stone-700 leading-relaxed bg-white border-t border-stone-100 font-sans font-medium space-y-3">
                                <p className="leading-relaxed">{faq.a}</p>

                                <div className="flex items-center justify-between pt-2 border-t border-dashed border-stone-150 text-[10px] font-mono text-stone-500">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(`Q: ${faq.q}\nA: ${faq.a}`);
                                      triggerToast(
                                        language === "hi" ? "उत्तर कॉपी किया गया!" : "FAQ Q&A copied to clipboard!",
                                        "success"
                                      );
                                    }}
                                    className="flex items-center gap-1 text-stone-500 hover:text-stone-900 transition cursor-pointer"
                                    title={language === "hi" ? "कॉपी करें" : "Copy FAQ text"}
                                  >
                                    <Copy className="w-3 h-3 text-stone-400" />
                                    <span>{language === "hi" ? "उत्तर कॉपी करें" : "Copy Answer"}</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFaqHelpfulVotes(prev => ({ ...prev, [index]: true }));
                                      triggerToast(
                                        language === "hi" ? "आपकी प्रतिक्रिया के लिए धन्यवाद!" : "Thanks for your feedback!",
                                        "success"
                                      );
                                    }}
                                    disabled={isVoted}
                                    className={`flex items-center gap-1 transition ${
                                      isVoted 
                                        ? "text-emerald-600 font-bold" 
                                        : "text-stone-400 hover:text-stone-700 cursor-pointer"
                                    }`}
                                  >
                                    <span>{isVoted ? "✓ " + (language === "hi" ? "सहायक माना गया" : "Helpful") : "👍 " + (language === "hi" ? "क्या यह उत्तर सहायक था?" : "Was this helpful?")}</span>
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === "procedure" && (
            <motion.div
              key="procedure"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
              id="dossier-panel-procedure"
            >
              {/* Document Wizard Header Banner */}
              <div className="p-5 border border-orange-200 bg-orange-50/20 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-orange-600 text-white font-extrabold font-mono text-[9px] px-2 py-0.5 rounded tracking-wide uppercase">
                      OFFICIAL GUIDE
                    </span>
                    <h3 className="font-extrabold text-stone-900 text-sm">
                      {language === "hi" ? "एकीकृत ई-सेवा दस्तावेज़ मार्गदर्शिका" : "Integrated e-Seva Document Wizard Guide"}
                    </h3>
                  </div>
                  <p className="text-[11.5px] text-stone-550 leading-relaxed font-sans max-w-xl">
                    {language === "hi" 
                      ? "यह मार्गदर्शिका आपके लिए इस दस्तावेज़ को बनाने या उसमें सुधार करने की आधिकारिक सरकारी चरण-दर-चरण प्रक्रिया और आवश्यक पोर्टल लिंक्स प्रदर्शित करती है।" 
                      : `This step-by-step assistant guides you through the official process, service fees, Nodal administrative offices, and direct registration links for ${service.title}.`}
                  </p>
                </div>

                {/* Switch to Registration Procedure Tab */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("procedure");
                    triggerToast(language === "hi" ? "आधिकारिक प्रक्रिया और पोर्टल संपर्क देखें" : "View registration procedures and official portal links.", "info");
                  }}
                  className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs hover:scale-102 select-none cursor-pointer"
                >
                  <span>{language === "hi" ? "आधिकारिक पोर्टल लिंक ➔" : "Official Portal Links ➔"}</span>
                </button>
              </div>

              {/* Statistics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Official fees */}
                <div className="bg-white p-4 border border-stone-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">
                    <CreditCard className="w-3.5 h-3.5 text-orange-550" />
                    {language === "hi" ? "सरकारी सेवा शुल्क" : "Official SLA Fees"}
                  </div>
                  <strong className="text-stone-900 text-sm sm:text-base font-sans block mt-0.5">
                    {service.fees === 0 ? (language === "hi" ? "निःशुल्क" : "FREE") : `₹ ${service.fees}`}
                  </strong>
                  <p className="text-[10px] text-stone-500 leading-normal mt-0.5 font-sans">
                    {language === "hi" ? meta.feesNotes.hi : meta.feesNotes.en}
                  </p>
                </div>

                {/* Speed SLA */}
                <div className="bg-white p-4 border border-stone-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    {language === "hi" ? "मानक समय-सीमा (SLA)" : "Standard Processing (SLA)"}
                  </div>
                  <strong className="text-stone-900 text-sm sm:text-base font-sans block mt-0.5 font-bold">
                    {service.processingTime}
                  </strong>
                  <p className="text-[10px] text-stone-500 leading-normal mt-0.5 font-sans">
                    {language === "hi" ? "कार्य दिवस (अधिकतम निर्धारित सीमा)" : "Maximum timeline under Public Guarantee Acts."}
                  </p>
                </div>

                {/* Authority */}
                <div className="bg-white p-4 border border-stone-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-bold uppercase tracking-wider font-mono">
                    <Landmark className="w-3.5 h-3.5 text-emerald-500" />
                    {language === "hi" ? "सक्षम प्राधिकारी कार्यालय" : "Approved Signing Authority"}
                  </div>
                  <strong className="text-stone-900 text-xs block pt-0.5 font-sans font-bold leading-tight truncate">
                    {language === "hi" ? "सक्षम नोडल अधिकारी स्तर" : "Nodal Executive Magistrate"}
                  </strong>
                  <p className="text-[10.5px] text-stone-550 leading-snug mt-1 font-sans">
                    {language === "hi" ? meta.designatedOffice.hi : meta.designatedOffice.en}
                  </p>
                </div>

              </div>

              {/* Requirements summary strip with interactive toggles */}
              <div className="p-4.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11.5px] font-black text-stone-900 uppercase tracking-wider">
                    {language === "hi" ? "दस्तावेज विज़ार्ड चेकलिस्ट:" : "Document Wizard Requirement Checklist:"}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-150 px-1.5 py-0.5 rounded-md">
                    {checkedCountInDossier}/{service.documentsRequired.length} {language === "hi" ? "तैयार" : "Ready"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1 font-sans">
                  {service.documentsRequired.map((doc, idx) => {
                    const isChecked = !!checkedDocs[`${service.id}-${doc}`];
                    return (
                      <button 
                        type="button"
                        key={idx} 
                        onClick={() => handleToggleDocCheckbox(doc)}
                        className={`border rounded-lg shadow-3xs transition-all flex items-center gap-1.5 select-none font-sans px-2.5 py-1 text-[10.5px] font-bold cursor-pointer ${
                          isChecked 
                            ? "bg-emerald-55/70 border-emerald-250 text-emerald-800 scale-[1.01]" 
                            : "bg-white border-stone-300 hover:border-stone-450 text-stone-700"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isChecked ? "bg-emerald-500 animate-pulse" : "bg-stone-350"}`}></span>
                        <span className={isChecked ? "line-through decoration-emerald-200/60" : ""}>{doc}</span>
                        {isChecked && <Check className="w-3 h-3 text-emerald-600 stroke-[3px]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Horizontal Progress Tracker */}
              <div className="bg-stone-900 text-white border border-stone-800 p-5 rounded-2xl space-y-4" id="dossier-progress-tracker">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-orange-500">
                      {language === "hi" ? "आवेदन प्रगति ट्रैकर" : "Application Progress Tracker"}
                    </span>
                    <h4 className="text-xs font-extrabold text-white">
                      {language === "hi" ? "अपनी वर्तमान चरण स्थिति चुनें" : "Select Your Current Application Stage"}
                    </h4>
                  </div>
                  <div className="text-[10px] font-mono font-bold px-2 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700">
                    {language === "hi" ? "चरण" : "Stage"} {currentStepIndex + 1} / {(language === "hi" ? meta.stepByStep.hi : meta.stepByStep.en).length}
                  </div>
                </div>

                {/* Progress bar line and nodes */}
                <div className="relative flex items-center justify-between px-2 pt-2 pb-6 overflow-x-auto scrollbar-none">
                  {/* Connecting background line */}
                  <div className="absolute top-[21px] left-8 right-8 h-0.5 bg-stone-800 z-0" />
                  
                  {/* Filled connecting line based on progress */}
                  <div 
                    className="absolute top-[21px] left-8 h-0.5 bg-orange-550 transition-all duration-300 z-0"
                    style={{
                      width: `${(currentStepIndex / ((language === "hi" ? meta.stepByStep.hi : meta.stepByStep.en).length - 1)) * 100}%`,
                      maxWidth: "calc(100% - 4rem)"
                    }}
                  />

                  {(language === "hi" ? meta.stepByStep.hi : meta.stepByStep.en).map((step, idx) => {
                    const parts = step.split(":");
                    const heading = parts[0];
                    const isCompleted = idx < currentStepIndex;
                    const isActive = idx === currentStepIndex;
                    
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setCurrentStepIndex(idx);
                          triggerToast(
                            language === "hi" 
                              ? `चरण ${idx + 1} पर स्विच किया गया: ${heading}`
                              : `Switched to Step ${idx + 1}: ${heading}`,
                            "info"
                          );
                        }}
                        className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none min-w-[70px]"
                      >
                        {/* Circle node */}
                        <div 
                          className={`w-[26px] h-[26px] rounded-full flex items-center justify-center font-mono font-black text-[10px] border-2 transition-all duration-200 ${
                            isActive
                              ? "bg-orange-600 border-orange-600 text-white scale-110 shadow-[0_0_12px_rgba(234,88,12,0.4)]"
                              : isCompleted
                              ? "bg-stone-900 border-orange-500 text-orange-400"
                              : "bg-stone-950 border-stone-800 text-stone-500 group-hover:border-stone-700 group-hover:text-stone-300"
                          }`}
                        >
                          {isCompleted ? "✓" : idx + 1}
                        </div>

                        {/* Label */}
                        <span 
                          className={`absolute top-[32px] text-[9px] font-bold font-sans text-center transition-all duration-200 w-20 truncate ${
                            isActive
                              ? "text-orange-400 font-extrabold"
                              : isCompleted
                              ? "text-stone-300 font-medium"
                              : "text-stone-500 font-normal"
                          }`}
                          title={heading}
                        >
                          {heading}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Step Highlight Detail Panel */}
                {(() => {
                  const currentStepStr = (language === "hi" ? meta.stepByStep.hi : meta.stepByStep.en)[currentStepIndex] || "";
                  const parts = currentStepStr.split(":");
                  const heading = parts[0];
                  const details = parts.slice(1).join(":");
                  
                  return (
                    <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl space-y-2.5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-orange-600" />
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-mono font-bold bg-orange-600/15 text-orange-400 border border-orange-600/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {language === "hi" ? "सक्रिय चरण विवरण" : "Active Stage Guideline"}
                        </span>
                        
                        {/* Navigation controls */}
                        <div className="flex items-center gap-1.5 select-none">
                          <button
                            type="button"
                            disabled={currentStepIndex === 0}
                            onClick={() => {
                              setCurrentStepIndex(prev => Math.max(0, prev - 1));
                            }}
                            className="p-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none text-white transition text-[10px] font-bold px-2 border-0 cursor-pointer"
                          >
                            ← {language === "hi" ? "पीछे" : "Prev"}
                          </button>
                          <button
                            type="button"
                            disabled={currentStepIndex === (language === "hi" ? meta.stepByStep.hi : meta.stepByStep.en).length - 1}
                            onClick={() => {
                              setCurrentStepIndex(prev => Math.min((language === "hi" ? meta.stepByStep.hi : meta.stepByStep.en).length - 1, prev + 1));
                            }}
                            className="p-1 rounded bg-orange-600 hover:bg-orange-500 text-white disabled:opacity-30 disabled:pointer-events-none transition text-[10px] font-extrabold px-2 border-0 cursor-pointer"
                          >
                            {language === "hi" ? "आगे" : "Next"} →
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h5 className="text-xs font-extrabold text-white font-sans">
                          {heading}
                        </h5>
                        {details && (
                          <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                            {details}
                          </p>
                        )}
                      </div>

                      {/* Helpful micro tip box */}
                      <div className="pt-2 border-t border-stone-900 text-[10px] text-stone-550 font-mono flex items-start gap-1.5 leading-normal">
                        <span className="text-orange-500 shrink-0">💡</span>
                        <span>
                          {language === "hi" 
                            ? "सुझाव: इस चरण को पूर्ण करने के बाद, अपनी वास्तविक समय प्रगति को ट्रैक करने के लिए अगले चरण पर आगे बढ़ें।"
                            : "Tip: Once you finish this step, click 'Next' or select the next node above to advance your tracker."}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Step by Step Flow list */}
              <div className="space-y-4 bg-white border border-stone-200 p-5 rounded-2xl">
                <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans border-b border-stone-100 pb-2.5">
                  <Scroll className="w-4.5 h-4.5 text-orange-600" />
                  {language === "hi" ? "आधिकारिक चरण-दर-चरण प्रक्रिया प्रवाह" : "Official Step-by-Step Allocation Flow"}
                </h4>
                
                <div className="relative border-l border-stone-200 ml-2.5 pl-4 pt-1 space-y-4 text-xs font-sans">
                  {(language === "hi" ? meta.stepByStep.hi : meta.stepByStep.en).map((step, idx) => {
                    const parts = step.split(":");
                    const heading = parts[0];
                    const details = parts.slice(1).join(":");
                    const isCompleted = idx < currentStepIndex;
                    const isActive = idx === currentStepIndex;

                    return (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setCurrentStepIndex(idx);
                          triggerToast(
                            language === "hi" 
                              ? `चरण ${idx + 1} पर स्विच किया गया: ${heading}`
                              : `Switched to Step ${idx + 1}: ${heading}`,
                            "info"
                          );
                        }}
                        className={`relative pl-2 py-2 rounded-xl transition-all duration-150 cursor-pointer ${
                          isActive 
                            ? "bg-orange-50/40 border border-orange-100 shadow-3xs" 
                            : "hover:bg-stone-50"
                        }`}
                      >
                        {/* Bullet count */}
                        <div 
                          className={`absolute -left-[20px] top-3 w-4.5 h-4.5 font-extrabold font-mono text-[9px] rounded-full flex items-center justify-center border-2 border-white transition-all duration-200 ${
                            isActive
                              ? "bg-orange-600 text-white scale-110"
                              : isCompleted
                              ? "bg-emerald-600 text-white"
                              : "bg-stone-950 text-white"
                          }`}
                        >
                          {isCompleted ? "✓" : idx + 1}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <strong className={`font-bold block ${isActive ? "text-orange-700" : isCompleted ? "text-stone-700" : "text-stone-900"}`}>
                            {heading}
                          </strong>
                          {isActive && (
                            <span className="text-[8px] font-mono font-bold bg-orange-150 text-orange-800 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                              {language === "hi" ? "सक्रिय चरण" : "Active Stage"}
                            </span>
                          )}
                          {isCompleted && (
                            <span className="text-[8px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                              {language === "hi" ? "पूर्ण" : "Completed"}
                            </span>
                          )}
                        </div>
                        
                        {details && (
                          <p className={`font-normal leading-relaxed text-[11.5px] pr-2 mt-0.5 ${isActive ? "text-stone-700" : isCompleted ? "text-stone-450" : "text-stone-500"}`}>
                            {details}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct Government Application Links */}
              <div className="p-5 border border-stone-200 rounded-2xl bg-stone-50/30 space-y-3">
                <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
                  <ExternalLink className="w-4.5 h-4.5 text-emerald-600" />
                  {language === "hi" ? "आधिकारिक डिजिटल राज्य / राष्ट्रीय पोर्टल लिंक्स" : "Direct Official State / Federal Registration Ports"}
                </h4>
                <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                  {language === "hi" 
                    ? "भारत सरकार के अधिकृत आईटी प्रणालियों व संबंधित राज्यों के स्थानीय राजस्व वेब पोर्टलों हेतु सीधे लिंक:" 
                    : "Direct internet links to authorized state e-District platforms and central federal IT governance frameworks:"}
                </p>
                <div className="flex flex-wrap gap-2.5 pt-1 select-none">
                  {meta.externalLinks.map((link, idx) => (
                    <a 
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-stone-750 hover:text-emerald-800 border border-stone-200 hover:border-emerald-250 text-xs font-sans font-bold rounded-xl transition flex items-center gap-1.5 shadow-3xs hover:scale-103 cursor-pointer"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 text-stone-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === "documents" && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
              id="dossier-panel-documents"
            >
              <div className="p-4 bg-brand-cream-card border border-[#E9E6DC] rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-brand-coral shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="text-xs text-stone-900 leading-none">
                    {language === "hi" ? "डिजिटल स्कैन मानक निर्देश (MeitY Guidelines)" : "MeitY Digital Scans Submission Protocol:"}
                  </strong>
                  <p className="text-[11px] text-stone-605 leading-relaxed">
                    {language === "hi"
                      ? "सभी अटैचमेंट पीडीएफ (PDF) या पीएनजी (PNG) प्रारूप में होने चाहिए और उनका फाइल आकार 2 MB से कम होना आवश्यक है। प्रतियां स्व-सत्यापित होनी चाहिए।"
                      : "Color-scanned copies must be uploaded. File sizes should strictly remain below 2 MB in PDF/JPEG with at least 150 DPI resolution."}
                  </p>
                </div>
              </div>

              {/* Checklist Progress Summary Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50/40 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-wider font-extrabold text-emerald-650 uppercase block leading-none">
                      {language === "hi" ? "नवीन जारीकरण प्रगति" : "FRESH CASE PREPARATION"}
                    </span>
                    <h4 className="font-display font-black text-stone-900 text-sm tracking-tight">
                      {language === "hi" 
                        ? `${service.documentsRequired.filter(doc => preparedDocs["fresh_" + doc]).length} में से ${service.documentsRequired.length} दस्तावेज तैयार` 
                        : `${service.documentsRequired.filter(doc => preparedDocs["fresh_" + doc]).length} of ${service.documentsRequired.length} Prepared`}
                    </h4>
                    {/* Tiny Progress bar */}
                    <div className="w-40 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${service.documentsRequired.length > 0 ? (service.documentsRequired.filter(doc => preparedDocs["fresh_" + doc]).length / service.documentsRequired.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  {service.documentsRequired.length > 0 && service.documentsRequired.filter(doc => preparedDocs["fresh_" + doc]).length === service.documentsRequired.length ? (
                    <div className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-300 uppercase shrink-0">
                      ✓ {language === "hi" ? "पूर्ण तैयार" : "Fully Ready"}
                    </div>
                  ) : (
                    <span className="text-stone-400 font-mono text-xs font-black">
                      {service.documentsRequired.length > 0 ? Math.round((service.documentsRequired.filter(doc => preparedDocs["fresh_" + doc]).length / service.documentsRequired.length) * 100) : 0}%
                    </span>
                  )}
                </div>

                <div className="bg-orange-50/40 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-wider font-extrabold text-orange-650 uppercase block leading-none">
                      {language === "hi" ? "संशोधन/सुधार प्रगति" : "REVISION CASE PREPARATION"}
                    </span>
                    <h4 className="font-display font-black text-stone-900 text-sm tracking-tight">
                      {language === "hi" 
                        ? `${meta.updateDocuments.filter(doc => preparedDocs["revision_" + doc]).length} में से ${meta.updateDocuments.length} दस्तावेज तैयार` 
                        : `${meta.updateDocuments.filter(doc => preparedDocs["revision_" + doc]).length} of ${meta.updateDocuments.length} Prepared`}
                    </h4>
                    {/* Tiny Progress bar */}
                    <div className="w-40 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ width: `${meta.updateDocuments.length > 0 ? (meta.updateDocuments.filter(doc => preparedDocs["revision_" + doc]).length / meta.updateDocuments.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  {meta.updateDocuments.length > 0 && meta.updateDocuments.filter(doc => preparedDocs["revision_" + doc]).length === meta.updateDocuments.length ? (
                    <div className="bg-orange-100 text-orange-850 text-[10px] font-black px-3 py-1 rounded-full border border-orange-300 uppercase shrink-0">
                      ✓ {language === "hi" ? "पूर्ण तैयार" : "Fully Ready"}
                    </div>
                  ) : (
                    <span className="text-stone-400 font-mono text-xs font-black">
                      {meta.updateDocuments.length > 0 ? Math.round((meta.updateDocuments.filter(doc => preparedDocs["revision_" + doc]).length / meta.updateDocuments.length) * 100) : 0}%
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Side A: For fresh application */}
                <div className="border border-stone-200 rounded-3xl p-5 space-y-4 shadow-3xs bg-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                  
                  <div className="flex items-center justify-between pl-1">
                    <div className="space-y-1">
                      <span className="text-[8.5px] font-mono tracking-wider font-extrabold text-stone-400 uppercase block leading-none">
                        {language === "hi" ? "श्रेणी 1: नवीन जारी करने हेतु" : "CASE A: FRESH ISSUANCE DETAILS"}
                      </span>
                      <h3 className="font-display font-black text-slate-950 text-sm tracking-tight flex items-center gap-1.5">
                        <span>{language === "hi" ? "नए कार्ड / प्रमाण पत्र के लिए आवश्यक" : "New Document Requirements"}</span>
                      </h3>
                    </div>
                  </div>

                  <hr className="border-stone-105" />

                  <div className="space-y-2.5 pl-1">
                    {service.documentsRequired.map((doc, index) => {
                      const docKey = "fresh_" + doc;
                      const isPrepared = !!preparedDocs[docKey];
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleToggleDoc(docKey, doc)}
                          className={`w-full text-left flex items-start gap-3.5 p-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none group ${
                            isPrepared 
                              ? "bg-emerald-50/30 border-emerald-500/20 hover:border-emerald-500/30" 
                              : "bg-stone-50/50 border-stone-200/80 hover:border-stone-300 hover:bg-stone-50"
                          }`}
                        >
                          <div 
                            className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 border ${
                              isPrepared 
                                ? "bg-emerald-500 border-emerald-600 text-white" 
                                : "bg-white border-stone-300 text-stone-400 group-hover:border-[#FF5A2B] group-hover:text-[#FF5A2B]"
                            }`}
                          >
                            {isPrepared ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : (
                              <span className="text-[10px] font-mono font-bold">{index + 1}</span>
                            )}
                          </div>
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <span className={`font-bold block transition-all duration-200 text-xs ${
                              isPrepared 
                                ? "text-stone-500 line-through decoration-emerald-500/30" 
                                : "text-stone-900"
                            }`}>
                              {doc}
                            </span>
                            <span className="text-[10px] text-slate-450 block italic leading-snug">
                              {language === "hi" ? "अभिलेख के साथ मूल प्रति संलग्न करें।" : "Upload scanning copies matching physical records."}
                            </span>
                          </div>
                          {isPrepared && (
                            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 shrink-0 self-center">
                              {language === "hi" ? "तैयार" : "READY"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Side B: For dynamic update corrections */}
                <div className="border border-stone-200 rounded-3xl p-5 space-y-4 shadow-3xs bg-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>

                  <div className="flex items-center justify-between pl-1">
                    <div className="space-y-1">
                      <span className="text-[8.5px] font-mono tracking-wider font-extrabold text-stone-400 uppercase block leading-none">
                        {language === "hi" ? "श्रेणी 2: बायोमेट्रिक्स / सुधार हेतु" : "CASE B: REVISIONS / BIO UPDATES"}
                      </span>
                      <h3 className="font-display font-black text-slate-950 text-sm tracking-tight flex items-center gap-1.5">
                        <span>{language === "hi" ? "सुधार और बायोमेट्रिक अपडेट हेतु आवश्यक" : "Correction & Update Requirements"}</span>
                      </h3>
                    </div>
                  </div>

                  <hr className="border-stone-105" />

                  <div className="space-y-2.5 pl-1">
                    {meta.updateDocuments.map((doc, index) => {
                      const docKey = "revision_" + doc;
                      const isPrepared = !!preparedDocs[docKey];
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleToggleDoc(docKey, doc)}
                          className={`w-full text-left flex items-start gap-3.5 p-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none group ${
                            isPrepared 
                              ? "bg-orange-50/20 border-orange-500/20 hover:border-orange-500/30" 
                              : "bg-stone-50/50 border-stone-200/80 hover:border-stone-300 hover:bg-stone-50"
                          }`}
                        >
                          <div 
                            className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 border ${
                              isPrepared 
                                ? "bg-orange-500 border-orange-600 text-white" 
                                : "bg-white border-stone-300 text-stone-400 group-hover:border-[#FF5A2B] group-hover:text-[#FF5A2B]"
                            }`}
                          >
                            {isPrepared ? (
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            ) : (
                              <span className="text-[10px] font-mono font-bold">{index + 1}</span>
                            )}
                          </div>
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <span className={`font-bold block transition-all duration-200 text-xs ${
                              isPrepared 
                                ? "text-stone-500 line-through decoration-orange-500/30" 
                                : "text-stone-900"
                            }`}>
                              {doc}
                            </span>
                            <span className="text-[10px] text-slate-450 block italic leading-snug">
                              {language === "hi" ? "अभिलेख संशोधन हेतु सहायक वैध पत्र सम्मलित करें।" : "Required to append legal references for modification vetting."}
                            </span>
                          </div>
                          {isPrepared && (
                            <span className="text-[10px] font-mono font-bold text-orange-650 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 shrink-0 self-center">
                              {language === "hi" ? "तैयार" : "READY"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === "centers" && (
            <motion.div
              key="centers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
              id="dossier-panel-centers"
            >
              
              {/* Filter Pincode Form */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <h4 className="text-xs font-black text-stone-900 uppercase tracking-tight">
                    {language === "hi" ? "पिन कोड द्वारा नजदीकी ई-गवर्नेंस केंद्र खोजें" : "Locate Physical Registration Centers Nearby"}
                  </h4>
                  <p className="text-[11px] text-stone-500 max-w-lg">
                    {language === "hi" 
                      ? "अपने क्षेत्र के ई-डिस्ट्रिक्ट केंद्रों, प्रज्ञा केंद्रों, सीएससी सेंटरों और सीएससी संचालकों की सूची देखने के लिए 6-अंकीय पोस्टल कोड खोजें।"
                      : `Enter your 6-digit postal pincode to scan matching CSC, Akshaya, or designated e-District locations in your vicinity.`}
                  </p>
                </div>

                <form onSubmit={handlePincodeSearch} className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeQuery}
                    onChange={(e) => setPincodeQuery(e.target.value)}
                    placeholder={language === "hi" ? "उदा. 800001" : "e.g. 560001"}
                    className="bg-white border border-stone-250 py-2 px-3.5 rounded-xl text-xs font-bold font-mono outline-none focus:border-brand-coral focus:ring-2 focus:ring-[#FF5A2B]/10 w-full md:w-32"
                  />
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer select-none"
                  >
                    {language === "hi" ? "खोजें" : "Search Centers"}
                  </button>
                </form>
              </div>

              {/* Main locator columns with maps layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5" id="locator-layout-grid">
                
                {/* Left side list of centers (5 cols) */}
                <div className="md:col-span-5 space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {searchedCenters.map(center => {
                    const isSelected = selectedCenterId === center.id;
                    return (
                      <div
                        key={center.id}
                        onClick={() => setSelectedCenterId(center.id)}
                        className={`border p-4 rounded-2xl text-left transition duration-200 cursor-pointer ${
                          isSelected 
                            ? "bg-stone-900 border-stone-900 text-white shadow-xs" 
                            : "bg-stone-50 hover:bg-stone-100/50 border-stone-200 text-stone-850"
                        }`}
                        id={`center-card-${center.id}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <strong className="text-xs font-black tracking-tight leading-snug">
                            {center.name}
                          </strong>
                          <span className={`text-[9px] font-mono px-2 py-0.2 rounded font-extrabold shrink-0 truncate ${
                            isSelected ? "bg-[#FF5A2B] text-white" : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {center.distance}
                          </span>
                        </div>
                        <p className={`text-[10.5px] leading-relaxed font-sans mt-1 ${
                          isSelected ? "text-stone-300" : "text-stone-500"
                        }`}>
                          {center.address}
                        </p>
                        
                        <div className="mt-3 pt-2.5 border-t border-dashed border-white/10 flex items-center justify-between text-[10px] font-mono text-stone-400">
                          <span>{center.hours}</span>
                          <span className="font-bold underline">{language === "hi" ? "मैप देखें" : "Show Pin ➔"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right side mock Google map visual (7 cols) */}
                <div className="md:col-span-7 border border-stone-200 rounded-3xl overflow-hidden min-h-[350px] bg-stone-50 relative flex flex-col justify-between" id="map-mock-box">
                  
                  {/* Google Map Mock grid element background layout */}
                  <div className="absolute inset-0 z-0 bg-[#E8ECE9] overflow-hidden pointer-events-none select-none">
                    {/* Simulated topology details */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#9ca3af_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
                    {/* Simulated map routes */}
                    <svg className="absolute inset-0 w-full h-full opacity-65" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 0,100 Q 150,120 300,100 T 600,150" fill="none" stroke="#FFFFFF" strokeWidth="8" />
                      <path d="M 0,100 Q 150,120 300,100 T 600,150" fill="none" stroke="#CBD5E1" strokeWidth="2" />
                      <path d="M 200,0 L 220,400" fill="none" stroke="#FFFFFF" strokeWidth="6" />
                      <path d="M 200,0 L 220,400" fill="none" stroke="#CBD5E1" strokeWidth="1.5" />
                      <path d="M 100,50 L 400,350" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeDasharray="1 3" />
                      {/* Active highlighted center route */}
                      {selectedCenter && (
                        <path 
                          d={`M 10,120 L ${selectedCenter.lat * 5 + 40},${selectedCenter.lng * 3 + 80}`} 
                          fill="none" 
                          stroke="#FF5A2B" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                          className="animate-pulse" 
                        />
                      )}
                    </svg>

                    {/* Green active park blobs */}
                    <div className="absolute left-10 top-20 w-32 h-20 bg-emerald-250/20 rounded-full filter blur-xl"></div>
                    <div className="absolute right-12 bottom-12 w-40 h-28 bg-emerald-250/15 rounded-full filter blur-xl"></div>

                    {/* Pin locations nodes and details */}
                    {searchedCenters.map((c) => {
                      const isSelected = c.id === selectedCenterId;
                      // map layout translates
                      const topOffset = c.lat * 3.2 + 60;
                      const leftOffset = c.lng * 4.5 + 40;
                      return (
                        <div
                          key={c.id}
                          style={{ top: `${topOffset}px`, left: `${leftOffset}px` }}
                          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                        >
                          <div className="relative group/pin">
                            <MapPin className={`w-7 h-7 drop-shadow-md transition-all ${
                              isSelected ? "text-orange-650 scale-125" : "text-slate-650 hover:text-stone-900"
                            }`} />
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900 text-[8.5px] font-mono text-white px-1.5 py-0.2 rounded shadow-sm opacity-80 pointer-events-none uppercase font-bold">
                              {c.distance}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Locator map overlay footer panel for current info */}
                  <div className="relative z-10 m-3.5 p-4 bg-white/95 backdrop-blur-md border border-stone-200/85 rounded-2xl shadow-sm space-y-2 mt-auto text-left w-5/6 max-w-sm">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-mono font-extrabold text-blue-600 block uppercase tracking-widest leading-none">
                        {language === "hi" ? "चयनित केंद्र विवरण" : "ACTIVE ROUTING DESTINATION"}
                      </span>
                      <h4 className="text-xs font-black text-stone-900 font-display">
                        {selectedCenter?.name}
                      </h4>
                      <p className="text-[10px] text-stone-500 leading-normal font-sans">
                        {selectedCenter?.address}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-stone-105 grid grid-cols-2 gap-3 text-[9.5px] font-mono text-stone-600">
                      <div>
                        <span className="text-stone-400 block pb-0.2 text-[8px] uppercase select-none">Call Desk</span>
                        <span className="font-extrabold text-[#FF5A2B]">{selectedCenter?.phone}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block pb-0.2 text-[8px] uppercase select-none">Working Hours</span>
                        <span className="font-extrabold text-stone-800">{selectedCenter?.hours}</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          )}

          {activeTab === "support" && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6"
              id="dossier-panel-support"
            >
              <div className="text-left space-y-1.5">
                <h3 className="font-display font-black text-slate-950 text-sm tracking-tight">
                  {language === "hi" ? "आधिकारिक सहायता डेस्क और सामाजिक संपर्क" : "Verified Administrative Helpdesks & Social Point Links"}
                </h3>
                <p className="text-xs text-stone-505 max-w-md leading-relaxed font-sans">
                  {language === "hi"
                    ? "चयनित सरकारी प्रलेख प्रभाग द्वारा प्रदान किए गए संचार माध्यमों की सूची ताकि आप विसंगति की स्थिति में शिकायत या मदद प्राप्त कर सकें।"
                    : "Official support networks hosted by the respective ministries for resolving document delays, mistakes or lodging compliance complaints."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="support-cards-grid">
                
                {/* Dial helpline card */}
                <div className="border border-stone-200 bg-stone-50/40 rounded-2xl p-5 text-left flex flex-col justify-between hover:border-brand-coral/40 transition">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF5A2B]">
                      <Phone className="w-4.5 h-4.5" />
                    </div>
                    <strong className="text-xs font-black block text-stone-900 leading-none pt-1">
                      {language === "hi" ? "ई-प्रमाण टोल-फ्री हेल्पलाइन" : "Official Toll-Free Support"}
                    </strong>
                    <p className="text-[10.5px] text-stone-550 leading-relaxed font-sans">
                      {language === "hi" 
                        ? "संबंधित प्राधिकार के केंद्रीय कॉल सेंटर से संपर्क कर सलाहकारों से तत्काल सवाल पूछें।"
                        : "Connect directly with authorized desk agents at the central nodal call center for instant status queries."}
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-stone-150">
                    <span className="text-lg font-mono font-black text-slate-950 block">{meta.helpline}</span>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#FF5A2B] font-extrabold block mt-0.5">NATIONAL LINE</span>
                  </div>
                </div>

                {/* Social point handle Twitter */}
                <div className="border border-stone-200 bg-stone-50/40 rounded-2xl p-5 text-left flex flex-col justify-between hover:border-blue-400/40 transition">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <Share2 className="w-4.5 h-4.5" />
                    </div>
                    <strong className="text-xs font-black block text-stone-900 leading-none pt-1">
                      {language === "hi" ? "आधिकारिक सोशल मीडिया प्रभाग" : "Verified X (Twitter) Support Cell"}
                    </strong>
                    <p className="text-[10.5px] text-stone-550 leading-relaxed font-sans">
                      {language === "hi" 
                        ? "सोशल मीडिया पर हैशटैग द्वारा जन शिकायत अनुभाग या नोडल मंत्रालय को सीधे संबोधित करें।"
                        : "Post queries with your application acknowledgment code tagging the verified public desk handles for rapid responses."}
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-stone-150">
                    <span className="text-xs font-mono font-extrabold text-blue-700 block truncate hover:underline">
                      <a href={`https://x.com/${meta.socialX.replace("@","")}`} target="_blank" rel="noreferrer">
                        {meta.socialX} ↗
                      </a>
                    </span>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-stone-400 font-extrabold block mt-0.5">OFFICIAL MEDIA DISPATCH</span>
                  </div>
                </div>

                {/* Telegram / Grievance Direct link */}
                <div className="border border-stone-200 bg-stone-50/40 rounded-2xl p-5 text-left flex flex-col justify-between hover:border-emerald-500/40 transition">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Send className="w-4.5 h-4.5" />
                    </div>
                    <strong className="text-xs font-black block text-stone-900 leading-none pt-1">
                      {language === "hi" ? "डिजिटल नागरिक टेलीग्राम समुदाय" : "Sewa Digital Telegram Hub"}
                    </strong>
                    <p className="text-[10.5px] text-stone-550 leading-relaxed font-sans">
                      {language === "hi" 
                        ? "टेलीग्राम पर भारत डॉकसेतु के सहायता समूहों से जुड़ें और सामान्य कागजी अशुद्धियों पर चर्चा करें।"
                        : "Join automated community forums on Telegram to view answers to recurring documentation bottlenecks and files formatting."}
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-stone-150">
                    <span className="text-xs font-mono font-extrabold text-emerald-800 block truncate hover:underline">
                      <a href={meta.socialTelegram} target="_blank" rel="noreferrer">
                        @eSewaCitizenHelp ↗
                      </a>
                    </span>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-stone-400 font-extrabold block mt-0.5">STATE CHANNELS INDEX</span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6 text-left"
              id="dossier-panel-form"
            >
              {submittedArn ? (
                /* Application Success Receipt Panel */
                <div className="border border-emerald-500/30 bg-emerald-50/20 rounded-3xl p-6 md:p-8 space-y-6 animate-fade-in" id="form-success-receipt">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-600 animate-bounce shadow-md">
                      <Check className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display font-black text-emerald-900 text-lg md:text-xl tracking-tight">
                        {language === "hi" ? "आवेदन सफलतापूर्वक जमा हो गया!" : "Application Submitted Successfully!"}
                      </h3>
                      <p className="text-xs text-stone-600 font-sans max-w-md">
                        {language === "hi"
                          ? "आपका डिजिटल आवेदन अधिकृत सेवा नोड पर सुरक्षित रूप से प्रेषित और अनुक्रमित कर दिया गया है।"
                          : "Your digital e-Gov application has been safely transmitted, signed with SHA-256 and queued."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-2xl p-5 font-sans space-y-4 shadow-3xs max-w-lg mx-auto">
                    <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                      <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
                        {language === "hi" ? "आवेदन संदर्भ संख्या (ARN)" : "APPLICATION REF NUMBER (ARN)"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-mono font-black text-[#FF5A2B] bg-[#FF5A2B]/5 px-2.5 py-1 rounded-lg">
                          {submittedArn}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof navigator !== "undefined" && navigator.clipboard) {
                              navigator.clipboard.writeText(submittedArn);
                              triggerToast(language === "hi" ? "ARN क्लिपबोर्ड पर कॉपी किया गया!" : "ARN copied to clipboard!", "success");
                            }
                          }}
                          className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-stone-850 transition cursor-pointer"
                          title="Copy ARN"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">{language === "hi" ? "आवेदक का नाम" : "Applicant Name"}</span>
                        <span className="font-bold text-stone-850 block truncate">{formData.fullName}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">{language === "hi" ? "सेवा का नाम" : "Service Name"}</span>
                        <span className="font-bold text-stone-850 block truncate">{service.title}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">{language === "hi" ? "विभाग" : "Department"}</span>
                        <span className="font-bold text-stone-850 block truncate">{service.department}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">{language === "hi" ? "प्रसंस्करण समय" : "Est. Timeline"}</span>
                        <span className="font-bold text-stone-850 block truncate">{service.processingTime}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-[10px] font-mono text-stone-400">
                      <span>{language === "hi" ? "जमा करने की तिथि" : "SUBMITTED DATE"}</span>
                      <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const receiptContent = `========================================================\n                 SEWANADU CITIZEN SERVICE RECEIPT\n========================================================\nApplication Reference Number (ARN): ${submittedArn}\nService: ${service.title}\nDepartment: ${service.department}\nApplicant Name: ${formData.fullName}\nFather/Guardian: ${formData.guardianName}\nGender: ${formData.gender}\nDOB: ${formData.dob}\nMobile: ${formData.mobile}\nAddress: ${formData.fullAddress}, ${formData.district}, ${formData.state} - ${formData.pincode}\nVerification status: SELF-DECLARED PROFILE\nSubmission Date: ${new Date().toLocaleString()}\nEst. Processing Timeline: ${service.processingTime}\nStatus: SUBMITTED - UNDER REVIEW\n========================================================\nThank you for utilizing SewaNadu Digital Citizen Gateway.`;
                        const blob = new Blob([receiptContent], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `SewaNadu_Acknowledgment_${submittedArn}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                        triggerToast(language === "hi" ? "पावती रसीद (TXT) डाउनलोड की गई!" : "Acknowledgment receipt downloaded!", "success");
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-850 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>{language === "hi" ? "पावती रसीद डाउनलोड करें" : "Download Official Receipt"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedArn(null);
                        setFormData({
                          fullName: "",
                          guardianName: "",
                          dob: "",
                          gender: "MALE",
                          mobile: "",
                          email: "",
                          state: "Tamil Nadu",
                          district: "Chennai",
                          pincode: "",
                          fullAddress: ""
                        });
                        setUploadedFiles({});
                        setFormStep("details");
                        setActiveTab("overview");
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold rounded-xl text-xs transition cursor-pointer"
                    >
                      {language === "hi" ? "दस्तावेज पर वापस जाएं" : "Go Back to Dossier"}
                    </button>
                  </div>
                </div>
              ) : (
                /* Form Steps Container */
                <div className="space-y-6" id="live-application-form-panel">
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between bg-stone-50 border border-stone-150 p-4 rounded-2xl select-none">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-[#FF5A2B]/10 rounded-xl">
                        <ClipboardCheck className="w-5 h-5 text-[#FF5A2B]" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-xs uppercase text-stone-900 tracking-tight leading-none mb-0.5">
                          {language === "hi" ? "आधिकारिक डिजिटल फॉर्म" : "E-Governance Form Gateway"}
                        </h3>
                        <p className="text-[10px] text-stone-400 font-sans leading-none">
                          {language === "hi" ? `सेवा: ${service.title}` : `Applying for: ${service.title}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      {["details", "docs"].map((step, idx) => {
                        const stepNames = {
                          details: language === "hi" ? "विवरण" : "Profile",
                          docs: language === "hi" ? "दस्तावेज" : "Uploads"
                        };
                        const stepState = 
                          formStep === step ? "active" :
                          (step === "details" && formStep !== "details") ? "completed" : "pending";
                        
                        return (
                          <div key={step} className="flex items-center">
                            {idx > 0 && <div className={`w-4 h-0.5 ${stepState === "pending" ? "bg-stone-200" : "bg-emerald-500"}`} />}
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg">
                              <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9.5px] font-mono font-black ${
                                stepState === "active" ? "bg-[#FF5A2B] text-white" :
                                stepState === "completed" ? "bg-emerald-500 text-white" :
                                "bg-stone-200 text-stone-500"
                              }`}>
                                {stepState === "completed" ? "✓" : idx + 1}
                              </div>
                              <span className="hidden sm:inline text-[9.5px] font-bold font-sans text-stone-650">
                                {stepNames[step as keyof typeof stepNames]}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Form step render */}
                  {formStep === "details" && (
                    <div className="border border-stone-200 rounded-3xl p-5 md:p-6 bg-stone-50/20 space-y-5 animate-fade-in" id="form-details-step">
                      <div className="border-b border-stone-150 pb-3">
                        <h4 className="font-display font-black text-stone-900 text-sm">
                          {language === "hi" ? "1. आवेदक व्यक्तिगत विवरण एवं संपर्क" : "1. Applicant Personal Profile"}
                        </h4>
                        <p className="text-[11px] text-stone-505 font-sans">
                          {language === "hi" ? "कृपया सही व्यक्तिगत विवरण भरें।" : "Please enter your correct personal profile details."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10.5px] font-extrabold text-stone-750 uppercase tracking-wider block">
                            {language === "hi" ? "आवेदक का पूरा नाम *" : "Applicant Full Name *"}
                          </label>
                          <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="e.g. Kumar Viswanathan"
                            className="w-full text-xs font-sans border border-stone-200 bg-white focus:border-brand-coral/55 focus:ring-1 focus:ring-brand-coral rounded-xl px-3.5 py-2.5 text-stone-850"
                          />
                          {formErrors.fullName && <p className="text-[10px] text-red-500 font-sans font-bold">{formErrors.fullName}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10.5px] font-extrabold text-stone-750 uppercase tracking-wider block">
                            {language === "hi" ? "पिता / पति का नाम *" : "Father's / Guardian's Full Name *"}
                          </label>
                          <input
                            type="text"
                            value={formData.guardianName}
                            onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                            placeholder="e.g. Viswanathan Iyer"
                            className="w-full text-xs font-sans border border-stone-200 bg-white focus:border-brand-coral/55 focus:ring-1 focus:ring-brand-coral rounded-xl px-3.5 py-2.5 text-stone-850"
                          />
                          {formErrors.guardianName && <p className="text-[10px] text-red-500 font-sans font-bold">{formErrors.guardianName}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10.5px] font-extrabold text-stone-750 uppercase tracking-wider block">
                            {language === "hi" ? "जन्म तिथि *" : "Date of Birth *"}
                          </label>
                          <input
                            type="date"
                            value={formData.dob}
                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            className="w-full text-xs font-sans border border-stone-200 bg-white focus:border-brand-coral/55 focus:ring-1 focus:ring-brand-coral rounded-xl px-3.5 py-2.5 text-stone-850"
                          />
                          {formErrors.dob && <p className="text-[10px] text-red-500 font-sans font-bold">{formErrors.dob}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10.5px] font-extrabold text-stone-750 uppercase tracking-wider block">
                            {language === "hi" ? "लिंग *" : "Gender *"}
                          </label>
                          <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full text-xs font-sans border border-stone-200 bg-white focus:border-brand-coral/55 focus:ring-1 focus:ring-brand-coral rounded-xl px-3.5 py-2.5 text-stone-850"
                          >
                            <option value="MALE">{language === "hi" ? "पुरुष" : "Male"}</option>
                            <option value="FEMALE">{language === "hi" ? "महिला" : "Female"}</option>
                            <option value="TRANSGENDER">{language === "hi" ? "तीसरा लिंग" : "Transgender"}</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10.5px] font-extrabold text-stone-750 uppercase tracking-wider block">
                            {language === "hi" ? "मोबाइल नंबर *" : "Mobile Number *"}
                          </label>
                          <input
                            type="tel"
                            maxLength={10}
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })}
                            placeholder="e.g. 9876543210"
                            className="w-full text-xs font-mono border border-stone-200 bg-white focus:border-brand-coral/55 focus:ring-1 focus:ring-brand-coral rounded-xl px-3.5 py-2.5 text-stone-850"
                          />
                          {formErrors.mobile && <p className="text-[10px] text-red-500 font-sans font-bold">{formErrors.mobile}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10.5px] font-extrabold text-stone-750 uppercase tracking-wider block">
                            {language === "hi" ? "ईमेल पता" : "Email Address"}
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="name@example.com"
                            className="w-full text-xs font-sans border border-stone-200 bg-white focus:border-brand-coral/55 focus:ring-1 focus:ring-brand-coral rounded-xl px-3.5 py-2.5 text-stone-850"
                          />
                        </div>
                      </div>

                      {/* Jurisdiction Information Subsection */}
                      <div className="border-t border-stone-150 pt-4 mt-2 space-y-3">
                        <h5 className="font-bold text-stone-850 text-xs font-sans">
                          {language === "hi" ? "2. स्थायी पता एवं स्थानीय क्षेत्राधिकार" : "2. Residential Address & Local Jurisdiction"}
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-stone-750 uppercase block">{language === "hi" ? "राज्य" : "State"}</label>
                            <input
                              type="text"
                              readOnly
                              value={formData.state}
                              className="w-full text-xs font-sans border border-stone-200 bg-stone-100 rounded-xl px-3.5 py-2.5 cursor-not-allowed text-stone-600 font-bold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-stone-750 uppercase block">{language === "hi" ? "ज़िला" : "District"}</label>
                            <select
                              value={formData.district}
                              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                              className="w-full text-xs font-sans border border-stone-200 bg-white focus:border-brand-coral/55 focus:ring-1 focus:ring-brand-coral rounded-xl px-3.5 py-2.5 text-stone-850"
                            >
                              <option value="Chennai">Chennai</option>
                              <option value="Coimbatore">Coimbatore</option>
                              <option value="Madurai">Madurai</option>
                              <option value="Salem">Salem</option>
                              <option value="Tiruchirappalli">Tiruchirappalli</option>
                              <option value="New Delhi">New Delhi</option>
                              <option value="Mumbai">Mumbai</option>
                              <option value="Bengaluru">Bengaluru</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-stone-750 uppercase block">{language === "hi" ? "पिनकोड *" : "Pincode *"}</label>
                            <input
                              type="text"
                              maxLength={6}
                              value={formData.pincode}
                              onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })}
                              placeholder="e.g. 600001"
                              className="w-full text-xs font-mono border border-stone-200 bg-white focus:border-brand-coral/55 focus:ring-1 focus:ring-brand-coral rounded-xl px-3.5 py-2.5 text-stone-850"
                            />
                            {formErrors.pincode && <p className="text-[10px] text-red-500 font-sans font-bold">{formErrors.pincode}</p>}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold text-stone-750 uppercase block">{language === "hi" ? "पूरा स्थायी पता *" : "Full Permanent Address *"}</label>
                          <textarea
                            rows={2}
                            value={formData.fullAddress}
                            onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                            placeholder="Flat/House No., Village/Town, Landmark, Block, etc."
                            className="w-full text-xs font-sans border border-stone-200 bg-white focus:border-brand-coral/55 focus:ring-1 focus:ring-brand-coral rounded-xl px-3.5 py-2.5 resize-none text-stone-850"
                          />
                          {formErrors.fullAddress && <p className="text-[10px] text-red-500 font-sans font-bold">{formErrors.fullAddress}</p>}
                        </div>
                      </div>

                      {/* Control buttons */}
                      <div className="pt-3 border-t border-stone-150 flex justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              fullName: "",
                              guardianName: "",
                              dob: "",
                              gender: "MALE",
                              mobile: "",
                              email: "",
                              state: "Tamil Nadu",
                              district: "Chennai",
                              pincode: "",
                              fullAddress: ""
                            });
                            setFormErrors({});
                          }}
                          className="px-4 py-2 border border-stone-200 text-stone-550 hover:text-stone-850 hover:bg-stone-50 rounded-xl font-bold text-xs transition cursor-pointer"
                        >
                          {language === "hi" ? "साफ़ करें" : "Reset Form"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const errors: Record<string, string> = {};
                            if (!formData.fullName.trim()) errors.fullName = language === "hi" ? "आवेदक का नाम आवश्यक है।" : "Full name is required.";
                            if (!formData.guardianName.trim()) errors.guardianName = language === "hi" ? "अभिभावक का नाम आवश्यक है।" : "Guardian name is required.";
                            if (!formData.dob) errors.dob = language === "hi" ? "जन्म तिथि आवश्यक है।" : "Date of birth is required.";
                            if (formData.mobile.length !== 10) errors.mobile = language === "hi" ? "मोबाइल नंबर 10 अंकों का होना चाहिए।" : "Mobile must be 10 numeric digits.";
                            if (formData.pincode.length !== 6) errors.pincode = language === "hi" ? "पिनकोड ठीक 6 अंकों का होना चाहिए।" : "Pincode must be 6 numeric digits.";
                            if (!formData.fullAddress.trim()) errors.fullAddress = language === "hi" ? "स्थायी पता आवश्यक है।" : "Full address is required.";

                            if (Object.keys(errors).length > 0) {
                              setFormErrors(errors);
                              triggerToast(language === "hi" ? "कृपया लाल रंग के चिह्नित त्रुटियों को सुधारें!" : "Please resolve the highlighted validation issues.", "error");
                              return;
                            }

                            setFormErrors({});
                            setFormStep("docs");
                          }}
                          className="px-5 py-2.5 bg-[#FF5A2B] hover:bg-[#E0491F] text-white font-bold text-xs rounded-xl transition cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <span>{language === "hi" ? "दस्तावेज चरण पर जाएं" : "Proceed to Uploads"}</span>
                          <ArrowLeft className="w-3.5 h-3.5 rotate-180 shrink-0" />
                        </button>
                      </div>
                    </div>
                  )}

                  {formStep === "docs" && (
                    <div className="border border-stone-200 rounded-3xl p-5 md:p-6 bg-stone-50/20 space-y-5 animate-fade-in" id="form-docs-step">
                      <div className="border-b border-stone-150 pb-3 text-left">
                        <h4 className="font-display font-black text-stone-900 text-sm">
                          {language === "hi" ? "2. सहायक दस्तावेज अपलोड करें" : "2. Document Portfolio Upload"}
                        </h4>
                        <p className="text-[11px] text-stone-505 font-sans">
                          {language === "hi" 
                            ? "इस विशिष्ट सेवा के लिए संबंधित राज्य प्रभाग द्वारा मांगे गए आवश्यक दस्तावेज अपलोड करें (सिम्युलेटेड):" 
                            : "Provide digital copies of the requested proofs for local administrative validation:"}
                        </p>
                      </div>

                      <div className="space-y-4">
                        {service.documentsRequired.map((doc, idx) => {
                          const uploaded = uploadedFiles[doc];
                          return (
                            <div key={idx} className="border border-stone-200 rounded-2xl p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                              <div className="text-left space-y-0.5 w-full sm:w-auto">
                                <span className="text-[9px] font-mono font-bold text-stone-400 block uppercase">DOCUMENT {idx + 1}</span>
                                <strong className="text-xs font-bold text-stone-800 block leading-tight">{doc}</strong>
                                <span className="text-[10px] text-stone-500 block leading-none">Accepted files: PDF, JPG, PNG (Max 5MB)</span>
                              </div>

                              <div className="shrink-0 w-full sm:w-auto text-right">
                                {uploaded ? (
                                  <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-emerald-800 text-xs">
                                    <div className="text-left">
                                      <span className="font-bold block truncate max-w-[120px] text-emerald-900">{uploaded.name}</span>
                                      <span className="text-[9px] text-emerald-600 font-mono block leading-none pt-0.5">{uploaded.size} • SUCCESS</span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const next = { ...uploadedFiles };
                                        delete next[doc];
                                        setUploadedFiles(next);
                                      }}
                                      className="text-stone-400 hover:text-red-500 text-xs font-bold font-mono pl-1 cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const defaultNames: Record<string, string> = {
                                        "Aadhaar Card": "Aadhaar_UID_FrontBack.pdf",
                                        "Address Proof": "Rent_Lease_Deed_Signed.pdf",
                                        "Identity Proof": "PAN_Card_Validated.pdf",
                                        "Income Certificate": "Income_ITR_Receipt_2025.pdf"
                                      };
                                      const mappedName = defaultNames[doc] || `${doc.replace(/\s+/g, "_")}_Proof.pdf`;
                                      const size = `${(0.8 + Math.random() * 2.2).toFixed(1)} MB`;
                                      
                                      setUploadedFiles({
                                        ...uploadedFiles,
                                        [doc]: { name: mappedName, size }
                                      });
                                      triggerToast(language === "hi" ? `${doc} सफलतापूर्वक अपलोड!` : `${doc} uploaded successfully!`, "success");
                                    }}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 border border-dashed border-stone-300 hover:border-[#FF5A2B] bg-stone-50 hover:bg-[#FF5A2B]/5 rounded-xl text-xs font-bold text-stone-700 transition cursor-pointer"
                                  >
                                    <Upload className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                                    <span>{language === "hi" ? "दस्तावेज अपलोड करें" : "Simulate Upload"}</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Declaration Checkbox */}
                      <div className="bg-stone-50 border border-stone-150 p-4 rounded-2xl flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="form-declaration-consent"
                          checked={isDeclarationChecked}
                          onChange={(e) => setIsDeclarationChecked(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-stone-300 text-orange-650 focus:ring-orange-600 cursor-pointer"
                        />
                        <label htmlFor="form-declaration-consent" className="text-[11px] text-stone-600 leading-normal font-sans cursor-pointer select-none text-left">
                          {language === "hi"
                            ? "मैं प्रमाणित करता हूँ कि मेरे द्वारा दी गई उपरोक्त जानकारी सत्य एवं सही है। मैं संबंधित विभागों को आधार ई-केवाईसी विवरण उपयोग करने की सहमति प्रदान करता हूँ।"
                            : "I hereby solemnly declare that all statements made in this digital application are true, complete and correct. I authorize the respective e-District state desks to verify my credential logs via Aadhaar e-KYC."}
                        </label>
                      </div>

                      {/* Next / Submit buttons */}
                      <div className="pt-3 border-t border-stone-150 flex justify-between">
                        <button
                          type="button"
                          onClick={() => setFormStep("details")}
                          className="px-4 py-2 border border-stone-200 text-stone-600 font-bold text-xs rounded-xl hover:bg-stone-50 transition cursor-pointer"
                        >
                          {language === "hi" ? "विवरण चरण पर जाएं" : "Back to Profile"}
                        </button>

                        <button
                          type="button"
                          disabled={isFormSubmitting}
                          onClick={() => {
                            if (!isDeclarationChecked) {
                              triggerToast(language === "hi" ? "कृपया घोषणा सहमति बॉक्स पर टिक करें!" : "Please accept the legal declaration checkbox.", "error");
                              return;
                            }

                            const missingDocs = service.documentsRequired.filter(doc => !uploadedFiles[doc]);
                            if (missingDocs.length > 0) {
                              triggerToast(language === "hi" ? `कृपया आवश्यक सभी दस्तावेज अपलोड करें! शेष: ${missingDocs.join(", ")}` : `Please provide copies for all required files. Missing: ${missingDocs.join(", ")}`, "error");
                              return;
                            }

                            setIsFormSubmitting(true);
                            triggerToast(language === "hi" ? "SHA-256 सुरक्षित हस्ताक्षर प्रक्रिया शुरू..." : "Beginning SHA-256 digital signature signing...", "info");

                            setTimeout(() => {
                              try {
                                const arn = `SEWA-${service.id.toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
                                
                                const appRecord = {
                                  ref: arn,
                                  title: service.title,
                                  department: service.department,
                                  applicant: formData.fullName,
                                  category: "CERTIFICATE",
                                  submissionDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                                  progressPercent: 25,
                                  currentMilestoneIndex: 0,
                                  stages: [
                                    { 
                                      titleEn: "Application Submitted Successfully", 
                                      titleHi: "डिजिटल आवेदन प्राप्त हुआ", 
                                      descEn: `Demographics submitted securely via SewaNadu Node. ARN generated.`, 
                                      descHi: `डिजिटल हस्ताक्षर द्वारा सत्यापित प्रलेख नोड पर प्रेषित। संदर्भ संख्या प्रेषित।`, 
                                      completed: true, 
                                      date: new Date().toLocaleString() 
                                    },
                                    { 
                                      titleEn: "District Nodal Officer (DNO) Assigned", 
                                      titleHi: "जिला नोडल अधिकारी समीक्षा", 
                                      descEn: "Nodal Desk is checking e-KYC logs against regional property registries.", 
                                      descHi: "राजस्व डेटाबेस तथा आधार डेटाबेस विवरण से मिलान जारी।", 
                                      completed: false 
                                    },
                                    { 
                                      titleEn: "Field Verification Inquiry", 
                                      titleHi: "क्षेत्रीय जांच / सत्यापन प्रक्रिया", 
                                      descEn: "Local verification officer assigned for asset limit and residential checks.", 
                                      descHi: "पात्रता एवं पारिवारिक आय सीमा का क्षेत्रीय सत्यापन किया जाएगा।", 
                                      completed: false 
                                    },
                                    { 
                                      titleEn: "Digitally Signed e-Certificate Dispatch", 
                                      titleHi: "डिजिटल हस्ताक्षरित प्रमाण पत्र डिस्पैच", 
                                      descEn: "Secured certificate generation. Accessible in DigiLocker & Email.", 
                                      descHi: "सत्यापित सुरक्षित प्रमाण पत्र सीधे डाउनलोड या डिजीलॉकर पर सुलभ।", 
                                      completed: false 
                                    }
                                  ]
                                };

                                const existingAppsRaw = localStorage.getItem("sewanadu_applications");
                                const existingApps = existingAppsRaw ? JSON.parse(existingAppsRaw) : [];
                                existingApps.unshift(appRecord);
                                localStorage.setItem("sewanadu_applications", JSON.stringify(existingApps));

                                setSubmittedArn(arn);
                                setIsFormSubmitting(false);
                                triggerToast(language === "hi" ? "आवेदन राजस्व लेजर पर सफलतापूर्वक दर्ज!" : "Application logged on SewaNadu revenue node!", "success");
                              } catch (e) {
                                console.error(e);
                                setIsFormSubmitting(false);
                                triggerToast("Filing failed. LocalStorage write error.", "error");
                              }
                            }, 2500);
                          }}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-750 disabled:bg-emerald-400 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {isFormSubmitting ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                              <span>{language === "hi" ? "जमा किया जा रहा है..." : "Filing Ledger..."}</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5 shrink-0" />
                              <span>{language === "hi" ? "डिजिटल फॉर्म सबमिट करें" : "Submit Form"}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Related Services Section */}
        {relatedServices.length > 0 && (
          <div className="mt-8 pt-8 border-t border-stone-200/80 dark:border-slate-800" id="dossier-related-services-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-brand-coral shrink-0" />
                  <h3 className="font-display font-black text-slate-900 dark:text-stone-100 text-sm tracking-tight">
                    {language === "hi" ? "इस विभाग की संबंधित अन्य सेवाएँ" : "Related Services in this Department"}
                  </h3>
                </div>
                <p className="text-[11px] text-stone-550 dark:text-stone-400 mt-0.5">
                  {language === "hi" 
                    ? `अन्य नागरिक सेवाएँ जो ${service.department} के अंतर्गत आती हैं`
                    : `Other official citizen services managed under ${service.department}`}
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40 px-2.5 py-1 rounded-full w-fit shrink-0">
                2 {language === "hi" ? "सेवाएँ सुझाई गईं" : "Related Services"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedServices.map((relService) => {
                const isSaved = savedServiceIds?.includes(relService.id);

                return (
                  <div
                    key={relService.id}
                    className="bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 rounded-2xl p-4 hover:border-brand-coral/60 dark:hover:border-brand-coral/60 transition duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded-full border border-stone-200/80 dark:border-slate-700">
                          {relService.category}
                        </span>

                        {onToggleSave && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleSave(relService.id);
                            }}
                            className="p-1 text-stone-400 hover:text-rose-600 transition cursor-pointer"
                            title={isSaved ? "Remove Bookmark" : "Bookmark Service"}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-rose-600 text-rose-600" : ""}`} />
                          </button>
                        )}
                      </div>

                      <h4 className="font-display font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-brand-coral transition-colors">
                        {relService.title}
                      </h4>

                      <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed font-sans">
                        {relService.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[10.5px]">
                      <div className="flex items-center gap-3 font-mono text-stone-500 dark:text-stone-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{relService.processingTime}</span>
                        </span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                          {relService.fees === 0 ? "Free" : `₹${relService.fees}`}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectService) {
                            onSelectService(relService);
                          } else {
                            triggerToast(`Opening ${relService.title}...`, "info");
                          }
                        }}
                        className="inline-flex items-center gap-1 font-extrabold text-brand-coral hover:text-orange-700 dark:hover:text-orange-400 transition text-[11px] cursor-pointer"
                      >
                        <span>{language === "hi" ? "विवरण देखें" : "View Dossier"}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Footer Bottom operations CTA bar */}
      <div className="bg-[#FAF9F5] border-t border-stone-200/80 p-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4" id="dossier-panel-footer">
        <div>
          <button
            onClick={downloadCheatsheet}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-stone-50 border border-stone-300 font-bold rounded-xl text-xs text-stone-750 transition cursor-pointer shadow-3xs"
            id="download-cheatsheet-btn"
          >
            <Download className="w-4 h-4 text-[#FF5A2B]" />
            <span>{language === "hi" ? "नागरिक चेकलिस्ट (TXT) डाउनलोड करें" : "Download Citizen Dossier Checklist (TXT)"}</span>
          </button>
        </div>

        <div className="flex gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={onBack}
            className="px-4 py-2.5 hover:bg-stone-100 font-bold rounded-xl text-xs text-stone-602 transition cursor-pointer border border-transparent whitespace-nowrap"
          >
            {language === "hi" ? "रद्द करें" : "Cancel"}
          </button>
          
          <button
            onClick={() => {
              setActiveTab("form");
              triggerToast(language === "hi" ? "लाइव आवेदन फॉर्म पोर्टल लोड किया गया" : "Live interactive application form loaded.", "success");
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-750 font-bold rounded-xl text-xs text-white transition cursor-pointer shadow-xs active:scale-95 whitespace-nowrap"
            id="proceed-form-btn"
          >
            <ClipboardCheck className="w-4 h-4 shrink-0 text-white" />
            <span>{language === "hi" ? "लाइव ऑनलाइन आवेदन" : "Apply Online (Live Form)"}</span>
          </button>
        </div>
      </div>

    </div>
  );
}
