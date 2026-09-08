import React, { useState, useEffect, useRef } from "react";
import { 
  Building2, Landmark, FolderCheck, Megaphone, Bot, User, 
  MapPin, LogOut, CheckCircle2, RefreshCw, BookmarkCheck, FileCheck2, 
  Handshake, ArrowRight, ShieldCheck, CreditCard, ExternalLink, Globe, Award,
  Zap, Plus, Search, LayoutGrid, FileText, HelpCircle,
  Bell, BellRing, Volume2, VolumeX, Star, Sun, Moon, Share2, AlertTriangle,
  ArrowUp, Home, ChevronRight, Scale, ClipboardCheck, Users, LogIn
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser 
} from "firebase/auth";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  addDoc 
} from "firebase/firestore";
import { auth, db, googleProvider, handleFirestoreError, OperationType } from "./lib/firebase";

// Local types and Components
import { ESevaService, GrievanceRecord, ChatMessage } from "./types";
import ESevaServiceList from "./components/ESevaServiceList";
import ESevaSupportChatbot from "./components/ESevaSupportChatbot";
import EligibilityChecker from "./components/EligibilityChecker";
import ESevaFaq from "./components/ESevaFaq";
import AdSenseUnit from "./components/AdSenseUnit";
import { useLanguage } from "./LanguageContext";
import NationalFundWidget from "./components/NationalFundWidget";
import LegalPortal from "./components/LegalPortal";
import SitemapCatalog from "./components/SitemapCatalog";
import ServiceDossier from "./components/ServiceDossier";
import SavedServices from "./components/SavedServices";
import ConsentDialog from "./components/ConsentDialog";
import CookieConsentBanner from "./components/CookieConsentBanner";
import { openCookieSettings } from "@/lib/cookie-consent";
import StateGovernanceNewsWidget from "./components/StateGovernanceNewsWidget";
import RtiFilingModal from "./components/RtiFilingModal";
import StatusCheckModal from "./components/StatusCheckModal";
import VerifiedDiscussions from "./components/VerifiedDiscussions";
import VoiceSearch from "./components/VoiceSearch";
import { getApiUrl } from "./lib/api";

export default function App() {
  const { 
    language, 
    setLanguage, 
    t, 
    translateService, 
    translateDoc, 
    translateApplication, 
    translateGrievance 
  } = useLanguage();

  const [hasConsentAccepted, setHasConsentAccepted] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sewanadu_legal_consent_accepted") === "true";
    } catch {
      return false;
    }
  });

  // Tab states
  const [activeTab, setActiveTab] = useState<"services" | "eligibility" | "lockers" | "chatbot" | "faq" | "legal-hub" | "sitemap" | "discussions">(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      const validTabs = ["services", "eligibility", "lockers", "chatbot", "faq", "legal-hub", "sitemap", "discussions"];
      if (tabParam && validTabs.includes(tabParam)) {
        return tabParam as any;
      }
    } catch (e) {
      console.error(e);
    }
    return "services";
  });
  const [legalHubDefaultSection, setLegalHubDefaultSection] = useState<"privacy" | "terms" | "rules" | "about" | "cookies" | "disclaimer">("about");
  const [logoPulse, setLogoPulse] = useState(false);
  const [isRtiOpen, setIsRtiOpen] = useState(false);
  const [isStatusCheckOpen, setIsStatusCheckOpen] = useState(false);

  // Citizen Profile (Interactive details - matched to metadata where applicable or pre-seeded dynamically for India)
  const [citizenName, setCitizenName] = useState("Shahrukh Khan");
  const [citizenEmail, setCitizenEmail] = useState("khanshaharukh378@gmail.com");
  const [citizenAadhaar, setCitizenAadhaar] = useState("129034803780"); 
  const [citizenState, setCitizenState] = useState("Karnataka");

  // DB States
  const [services, setServices] = useState<ESevaService[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedInput, setFocusedInput] = useState<"desktop" | "launcher" | "mobile" | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Auto-suggest matches helper
  const getAutoSuggestions = () => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return services.filter((service) => {
      const ts = translateService(service);
      return (
        ts.title.toLowerCase().includes(q) ||
        service.title.toLowerCase().includes(q) ||
        (ts.department && ts.department.toLowerCase().includes(q)) ||
        (service.department && service.department.toLowerCase().includes(q)) ||
        (ts.description && ts.description.toLowerCase().includes(q))
      );
    });
  };

  // Selection states
  const [selectedService, setSelectedService] = useState<ESevaService | null>(null);
  const [activeDossier, setActiveDossier] = useState<ESevaService | null>(null);

  // Centralized saved services state
  const [savedServiceIds, setSavedServiceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("sewanadu_saved_services");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Firebase Auth state
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user) {
        if (user.displayName) setCitizenName(user.displayName);
        if (user.email) setCitizenEmail(user.email);
        
        // Save user profile document in Firestore
        const userRef = doc(db, "users", user.uid);
        try {
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.error("Error creating user profile in Firestore:", err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync saved services with Firestore when logged in
  useEffect(() => {
    if (!authUser) return;

    const path = `users/${authUser.uid}/savedServices`;
    const savedRef = collection(db, "users", authUser.uid, "savedServices");
    
    const unsubscribe = onSnapshot(savedRef, (snapshot) => {
      const ids: string[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.serviceId) {
          ids.push(data.serviceId);
        }
      });
      if (ids.length > 0) {
        setSavedServiceIds(ids);
        try {
          localStorage.setItem("sewanadu_saved_services", JSON.stringify(ids));
        } catch (err) {
          console.error(err);
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [authUser]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      triggerToast(
        language === "hi" ? "Google से सफलतापूर्वक लॉगिन किया गया!" : "Signed in with Google successfully!", 
        "success"
      );
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      triggerToast(
        language === "hi" ? "लॉगिन विफल हुआ। कृपया पुनः प्रयास करें।" : "Google sign in failed. Please try again.", 
        "error"
      );
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
      triggerToast(
        language === "hi" ? "सफलतापूर्वक लॉगआउट किया गया।" : "Signed out successfully.", 
        "info"
      );
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  };

  const handleToggleSave = async (serviceId: string) => {
    const matchedService = services.find(s => s.id === serviceId);
    const isCurrentlySaved = savedServiceIds.includes(serviceId);

    setSavedServiceIds((prev) => {
      const next = isCurrentlySaved ? prev.filter(id => id !== serviceId) : [...prev, serviceId];
      try {
        localStorage.setItem("sewanadu_saved_services", JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });

    if (authUser && matchedService) {
      const docRef = doc(db, "users", authUser.uid, "savedServices", serviceId);
      const path = `users/${authUser.uid}/savedServices/${serviceId}`;
      try {
        if (isCurrentlySaved) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, {
            id: serviceId,
            userId: authUser.uid,
            serviceId: serviceId,
            serviceTitle: matchedService.title || "",
            department: matchedService.department || "",
            savedAt: new Date().toISOString()
          });
        }
      } catch (err) {
        handleFirestoreError(err, isCurrentlySaved ? OperationType.DELETE : OperationType.WRITE, path);
      }
    }
  };

  // Status Loaders
  const [loading, setLoading] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);

  // UI Toast notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  // Dark mode state with low-light high-contrast compatibility
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("sewanadu_dark_mode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("sewanadu_dark_mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("sewanadu_dark_mode", "false");
    }
  }, [darkMode]);

  // Small compliance disclaimer notification state
  const [showSewaNaduDisclaimer, setShowSewaNaduDisclaimer] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSewaNaduDisclaimer(false);
    }, 10000); // appears briefly for 10 seconds on load
    return () => clearTimeout(timer);
  }, []);

  // Back to Top button state
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Quick-Start Launcher & AdSense compliance states
  const [showLauncher, setShowLauncher] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isSavedServicesOpen, setIsSavedServicesOpen] = useState(false);
  const [policyModal, setPolicyModal] = useState<"privacy" | "terms" | "cookie" | "about" | null>(null);
  
  // Portal Feedback states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackService, setFeedbackService] = useState<any>(null);

  // Card Issue Reporting states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportService, setReportService] = useState<any>(null);
  const [reportIssueType, setReportIssueType] = useState<string>("incorrect_info");
  const [reportDetails, setReportDetails] = useState("");
  const [reportEmail, setReportEmail] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  // Browser Notification Simulator states
  interface SimulatedNotification {
    id: string;
    title: string;
    body: string;
    arn: string;
    appName: string;
    receivedAt: string;
  }
  
  const [notiPermission, setNotiPermission] = useState<"default" | "granted" | "denied">(() => {
    return (localStorage.getItem("sewanadu_noti_perm") as any) || "default";
  });
  const [notiSoundEnabled, setNotiSoundEnabled] = useState(true);
  const [activeSystemNotifications, setActiveSystemNotifications] = useState<SimulatedNotification[]>([]);
  

  // Plays satisfying high-tech dual ding
  const playNotificationSound = () => {
    if (!notiSoundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(start);
        osc.stop(start + duration);
      };
      
      playTone(587.33, ctx.currentTime, 0.35); // D5
      playTone(783.99, ctx.currentTime + 0.1, 0.45); // G5
    } catch (e) {
      console.warn("Digital synthesizer feedback restriction or failure:", e);
    }
  };



  const handleRequestNotiPermission = () => {
    if ("Notification" in window) {
      window.Notification.requestPermission().then(permission => {
        setNotiPermission(permission);
        localStorage.setItem("sewanadu_noti_perm", permission);
        triggerToast(
          language === "hi" 
            ? `सिस्टम सूचना अनुमति: ${permission === "granted" ? "स्वीकृत" : permission === "denied" ? "अस्वीकृत" : "डिफ़ॉल्ट"}`
            : `System notification permission status: ${permission.toUpperCase()}`,
          permission === "granted" ? "success" : "info"
        );
      }).catch(err => {
        // Fallback for sandboxes where promise rejects or fails
        setNotiPermission("granted");
        localStorage.setItem("sewanadu_noti_perm", "granted");
        triggerToast(
          language === "hi" ? "सिस्टम सूचना प्रणाली स्वीकृत!" : "System simulated notification approved!",
          "success"
        );
      });
    } else {
      setNotiPermission("granted");
      localStorage.setItem("sewanadu_noti_perm", "granted");
      triggerToast(
        language === "hi" ? "सिस्टम सूचना प्रणाली स्वीकृत (सिम्युलेटर मोड)!" : "System simulated notification approved (simulator mode)!",
        "success"
      );
    }
  };

  const INDIAN_LANGUAGES = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
    { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" }
  ];

  // Trigger brief alert banner
  const triggerToast = (msg: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast(null);
    }, 5500);
  };

  // ----------------------------------------------------------------
  // BACKEND INTEGRATION READERS
  // ----------------------------------------------------------------

  const fetchServices = async () => {
    try {
      const resp = await fetch(getApiUrl("/api/eseva/services"));
      if (resp.ok) {
        const data = await resp.json();
        setServices(data);
      }
    } catch (err) {
      console.error("Error fetching services directory:", err);
    }
  };

  const loadInitialData = async () => {
    setLoading(true);
    await Promise.all([
      fetchServices()
    ]);
    setLoading(false);
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackRating === 0) {
      triggerToast(language === "hi" ? "कृपया 1 से 5 स्टार रेटिंग चुनें।" : "Please select a star rating between 1 and 5.", "error");
      return;
    }
    setSubmittingFeedback(true);
    try {
      const payloadComment = feedbackService
        ? `[Service Feedback: ${feedbackService.title}] ${feedbackComment}`
        : feedbackComment;

      // Save to Firestore serviceFeedbacks collection if configured
      const feedbackPath = "serviceFeedbacks";
      const fbId = "fb-" + Date.now();
      try {
        await addDoc(collection(db, "serviceFeedbacks"), {
          id: fbId,
          userId: authUser ? authUser.uid : "anonymous",
          userName: authUser ? (authUser.displayName || "Citizen") : "Anonymous Citizen",
          serviceId: feedbackService ? feedbackService.id : "portal-general",
          rating: feedbackRating,
          comment: payloadComment.slice(0, 1000),
          createdAt: new Date().toISOString()
        });
      } catch (fErr) {
        console.warn("Firestore feedback save info:", fErr);
      }

      const response = await fetch(getApiUrl("/api/eseva/feedback"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: feedbackRating, comment: payloadComment }),
      });
      if (response.ok) {
        triggerToast(
          language === "hi" 
            ? "फ़ीडबैक सबमिट करने के लिए धन्यवाद!" 
            : "Thank you for your valuable feedback!", 
          "success"
        );
        setShowFeedbackModal(false);
        setFeedbackRating(0);
        setFeedbackComment("");
        setFeedbackService(null);
      } else {
        const errData = await response.json();
        triggerToast(errData.error || "Failed to submit feedback", "error");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
      triggerToast("Server connection error when transferring review logs.", "error");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleSendReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportService) return;
    if (!reportDetails.trim()) {
      triggerToast(
        language === "hi" 
          ? "कृपया समस्या का शिकायत विवरण दर्ज करें।" 
          : "Please describe the issue details with accurate specifics.", 
        "error"
      );
      return;
    }
    setSubmittingReport(true);
    try {
      const response = await fetch(getApiUrl("/api/eseva/report"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: reportService.id,
          serviceTitle: reportService.title,
          issueType: reportIssueType,
          details: reportDetails,
          email: reportEmail || citizenEmail || "anonymous@sewanadu.gov.in"
        })
      });
      if (response.ok) {
        triggerToast(
          language === "hi" 
            ? "रिपोर्ट दर्ज हो गई है! डेवलपर टीम इसकी शीघ्र जांच करेगी।" 
            : "The issue has been reported successfully! Developers will inspect this gateway.", 
          "success"
        );
        setShowReportModal(false);
        setReportDetails("");
        setReportService(null);
      } else {
        const errData = await response.json();
        triggerToast(errData.error || "Failed to log issue report", "error");
      }
    } catch (err) {
      console.error("Error logging issue:", err);
      triggerToast("Server connection error when transferring issue report.", "error");
    } finally {
      setSubmittingReport(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Deep-link support for shared e-service cards
  useEffect(() => {
    if (services && services.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const serviceId = params.get("service");
      if (serviceId) {
        const matched = services.find(s => s.id === serviceId);
        if (matched) {
          setActiveDossier(matched);
          setActiveTab("services");
        }
      }
    }
  }, [services]);





  // Action: Chat with AI Nodal Helper
  const handleSendChat = async (text: string, useSearch: boolean = false) => {
    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setLoadingChat(true);

    try {
      const resp = await fetch(getApiUrl("/api/eseva/chatbot"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, language, useSearch }) // Pass language context and useSearch toggle!
      });

      if (resp.ok) {
        const data = await resp.json();
        const modelMsg: ChatMessage = {
          id: "model-" + Date.now(),
          role: "model",
          text: data.text,
          sources: data.sources, // Store the search grounding sources if present
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory([...newHistory, modelMsg]);
      } else {
        triggerToast(t("toast.chatbot_busy"), "info");
      }
    } catch (err) {
      console.error(err);
      triggerToast(t("toast.chatbot_error"), "error");
    } finally {
      setLoadingChat(false);
    }
  };

  const handleClearChatHistory = () => {
    setChatHistory([]);
    triggerToast(t("toast.reset_chat"), "info");
  };

  return (
    <div className="min-h-screen bg-brand-cream-bg flex flex-col font-sans selection:bg-brand-coral selection:text-white pb-6 text-stone-900">
      
      {/* 1. Tricolor Top Visual Accent Strip */}
      <div className="h-[3px] w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 select-none"></div>

      {/* Public Service Notice & Disclaimer Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900/40 py-2 px-4 text-center text-[10px] sm:text-xs select-none">
        <p className="font-semibold text-amber-800 dark:text-amber-400">
          {language === "hi" 
            ? "🇮🇳 जन सामान्य हेतु सूचना: SewaNadu एक गैर-सरकारी मंच है, जिसे एक भारतीय द्वारा भारतीयों के लिए AI की सहायता से विकसित किया गया है। यह पूरी तरह से मुफ्त निर्देशिका (directory) है - कोई सरकारी संबद्धता नहीं है, और न ही किसी पंजीकरण या लॉगिन की आवश्यकता है।"
            : "🇮🇳 Public Service Notice: SewaNadu is a non-governmental platform developed by an Indian citizen for Indians with AI help. This is a free e-Sewa directory — no government affiliation, no logins, and no user registration required."
          }
        </p>
      </div>

      {/* 2. SewaNadu Brand Header */}
      <header className="bg-gradient-to-b from-brand-cream-bg to-stone-50 border-b border-stone-200/85 shrink-0 relative shadow-xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 sm:gap-4 flex-nowrap">
          
          {/* Logo Brand Emblems: Orange coral circle, :: white dots layout and "SewaNadu" */}
          <motion.div 
            animate={logoPulse ? {
              scale: [1, 1.08, 0.96, 1.04, 1],
              boxShadow: [
                "0 0 0 rgba(239, 68, 68, 0)",
                "0 0 20px 4px rgba(255, 90, 43, 0.6)",
                "0 0 10px 2px rgba(255, 90, 43, 0.3)",
                "0 0 0 rgba(255, 90, 43, 0)"
              ],
              backgroundColor: [
                "rgba(255, 255, 255, 0)",
                "rgba(255, 90, 43, 0.08)",
                "rgba(255, 90, 43, 0.03)",
                "rgba(255, 255, 255, 0)"
              ]
            } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onClick={() => { 
              setActiveTab("services"); 
              setSelectedService(null); 
              setSearchQuery(""); 
              triggerToast(
                language === "hi" 
                  ? "SewaNadu एकीकृत प्रविष्टि पोर्टल पुनः प्रारंभ हुआ!" 
                  : "SewaNadu integrated citizen gateway restarted! Showing all services.", 
                "success"
              ); 
            }}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0 hover:scale-[1.02] active:scale-95 hover:bg-stone-100/60 p-1 sm:p-1.5 rounded-2xl transition duration-200 group border border-transparent hover:border-stone-200/40"
            title={language === "hi" ? "मुखपृष्ठ / पुनः प्रारंभ" : "Click to Start / Reset Portal"}
            id="website-logo-start-button"
          >
            {/* Beautiful Orange-accent launch emblem */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-brand-coral to-orange-500 rounded-xl flex items-center justify-center p-1.5 shadow-2xs group-hover:rotate-6 transition-transform duration-300">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-1 h-1 rounded-full bg-white"></div>
                <div className="w-1 h-1 rounded-full bg-white"></div>
                <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
                <div className="w-1 h-1 rounded-full bg-white"></div>
                <div className="w-1 h-1 rounded-full bg-white"></div>
                <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-0.5 text-left">
              <div className="flex items-center gap-1 md:gap-1.5 leading-none">
                <span className="font-display font-black text-stone-900 text-sm sm:text-[17px] tracking-tight">
                  SewaNadu
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[8px] font-bold uppercase tracking-wider border border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
                  {language === "hi" ? "आरंभ" : "START"}
                </span>
              </div>
              <span className="text-[7.5px] font-bold text-stone-400 tracking-wider leading-none uppercase font-mono hidden sm:block">
                {t("app.logo_subtext") || "National Gateway"}
              </span>
            </div>
          </motion.div>

          {/* Premium Middle search box (Desktop only) */}
          <div className="hidden lg:flex items-center max-w-sm w-full gap-2 shrink-0" id="desktop-search-container">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 font-bold animate-pulse" />
              <input 
                type="text" 
                placeholder={t("app.search_placeholder") || "Search a service (e.g. Aadhaar, PAN, Passport)"}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveTab("services");
                  setSelectedService(null);
                }}
                onFocus={() => setFocusedInput("desktop")}
                onBlur={() => setTimeout(() => setFocusedInput(null), 250)}
                className="w-full bg-white border border-stone-250 py-1.5 pl-9 pr-14 rounded-xl text-[11px] font-sans outline-none focus:border-brand-coral focus:ring-3 focus:ring-brand-coral/10 hover:border-stone-300 transition text-stone-850 shadow-3xs"
              />
              
              {/* Keyboard visual shortcut element */}
              <div className="absolute right-3.5 flex items-center gap-0.5 pointer-events-none select-none text-stone-400 font-sans text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded-md">
                <span>⌘</span>
                <span>K</span>
              </div>

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-12 p-0.5 rounded-md text-stone-400 hover:text-stone-700 transition cursor-pointer border-0 bg-transparent"
                  title="Clear Search"
                >
                  <span className="text-[10px] font-bold">✕</span>
                </button>
              )}

              {/* Live Autocomplete suggestions dropdown */}
              {focusedInput === "desktop" && getAutoSuggestions().length > 0 && (
                <div 
                  className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-white/10 rounded-xl shadow-xl max-h-72 overflow-y-auto z-50 p-1 divide-y divide-stone-100 dark:divide-white/5 animate-fadeIn select-none"
                  id="desktop-autosuggest-dropdown"
                >
                  {getAutoSuggestions().slice(0, 7).map((service) => {
                    const sTrans = translateService(service);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input from losing focus immediately
                          setActiveTab("services");
                          setActiveDossier(service);
                          setSearchQuery("");
                        }}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-amber-500/10 dark:hover:bg-amber-500/10 first:rounded-t-lg last:rounded-b-lg flex flex-col gap-0.5 transition cursor-pointer text-stone-800 dark:text-stone-250 border-0 outline-none"
                      >
                        <span className="text-[10px] font-extrabold text-stone-900 dark:text-white leading-tight font-sans flex items-center justify-between">
                          <span>{sTrans.title}</span>
                          <span className="text-[8.5px] font-mono text-brand-coral opacity-80 shrink-0 font-bold ml-1.5">Launch →</span>
                        </span>
                        <span className="text-[8.5px] font-mono text-stone-450 dark:text-slate-400 tracking-wide uppercase">
                          {sTrans.department}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <VoiceSearch
              currentLanguage={language}
              onSpeechResult={(text) => {
                setSearchQuery(text);
                setActiveTab("services");
                setSelectedService(null);
              }}
              triggerToast={triggerToast}
              className="h-8 w-8 shrink-0 shadow-3xs"
              iconSize={14}
            />
          </div>

          {/* Right Header Navigation Controls  */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto sm:ml-0 flex-nowrap py-1 relative min-w-0 max-w-full overflow-x-auto overscroll-x-contain scrollbar-none">
            
            {/* Extra Top Nav Buttons for Medium+ screens (beautifully customized icons) */}
            <div className="hidden md:flex items-center gap-1">
              {/* All Services Tab Link */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setActiveTab("services"); setSelectedService(null); setSearchQuery(""); }}
                className={`relative p-2 rounded-xl transition cursor-pointer select-none shrink-0 ${
                  activeTab === "services" ? "text-brand-coral bg-orange-500/10 border border-brand-coral/20" : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/60 border border-transparent"
                }`}
                title={t("menu.all_services") || "All Services"}
              >
                <FolderCheck className="w-4 h-4" />
              </motion.button>

              {/* Compare / Eligibility Tab Link */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setActiveTab("eligibility"); setSelectedService(null); }}
                className={`relative p-2 rounded-xl transition cursor-pointer select-none shrink-0 ${
                  activeTab === "eligibility" ? "text-brand-coral bg-orange-500/10 border border-brand-coral/20" : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/60 border border-transparent"
                }`}
                title={t("menu.compare") || "Compare"}
              >
                <Award className="w-4 h-4" />
              </motion.button>


            </div>

            {/* Indian Language Selection Dropdown (Perfect fit on Mobile/Desktop) */}
            <div className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 border border-stone-250 bg-white hover:border-stone-300 hover:bg-stone-50 text-stone-700 font-extrabold rounded-full text-[10.5px] sm:text-[11.5px] transition shadow-3xs shrink-0 select-none cursor-pointer">
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-400 shrink-0" />
              <select
                id="language-picker"
                value={language}
                onChange={(e) => {
                  const newLang = e.target.value as any;
                  setLanguage(newLang);
                  const langName = INDIAN_LANGUAGES.find(l => l.code === newLang)?.name;
                  triggerToast(`Language switched to ${langName} successfully.`, "info");
                }}
                className="bg-transparent border-none outline-none font-black pr-0.5 cursor-pointer text-stone-850 text-[10px] sm:text-[10.5px] focus:ring-0"
              >
                {INDIAN_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-stone-900 font-bold">
                     {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Saved Services Bookmark Trigger */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSavedServicesOpen(true)}
              className="relative flex items-center justify-center p-1.5 sm:p-2 rounded-full border border-stone-250 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 shadow-3xs cursor-pointer select-none transition shrink-0"
              title={language === "hi" ? "पसंदीदा सेवाएँ" : "Saved Services"}
              id="saved-services-trigger"
            >
              <BookmarkCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-coral" />
              {savedServiceIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-brand-coral text-white text-[8.5px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 leading-none">
                  {savedServiceIds.length}
                </span>
              )}
            </motion.button>

            {/* Quick Actions Desktop Row */}
            <div className="hidden md:flex items-center gap-1 px-1.5 py-1 border border-stone-250 bg-stone-50/55 dark:bg-stone-900/60 rounded-full select-none shrink-0" id="header-quick-actions-row">
              <span className="text-[7.5px] font-mono font-black text-stone-450 dark:text-stone-400 uppercase tracking-widest pl-1 leading-none">
                {language === "hi" ? "त्वरित:" : "Quick:"}
              </span>
              
              {/* RTI Filing Button */}
              <button
                type="button"
                onClick={() => setIsRtiOpen(true)}
                className="flex items-center gap-1 px-2 py-0.5 text-[9.5px] sm:text-[10px] font-bold text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-white rounded-full transition border-0 bg-transparent cursor-pointer whitespace-nowrap"
                title={language === "hi" ? "सूचना का अधिकार (RTI) दायर करें" : "File an Online RTI Application Request"}
              >
                <Scale className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600 dark:text-amber-500 shrink-0" />
                <span>{language === "hi" ? "RTI दाखिला" : "RTI Filing"}</span>
              </button>

              <div className="w-px h-2.5 bg-stone-250 dark:bg-stone-800"></div>

              {/* Status Check Button */}
              <button
                type="button"
                onClick={() => setIsStatusCheckOpen(true)}
                className="flex items-center gap-1 px-2 py-0.5 text-[9.5px] sm:text-[10px] font-bold text-stone-700 hover:text-stone-950 dark:text-stone-300 dark:hover:text-white rounded-full transition border-0 bg-transparent cursor-pointer whitespace-nowrap"
                title={language === "hi" ? "आवेदन की स्थिति जांचें" : "Track Citizen Application Status"}
              >
                <ClipboardCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-coral shrink-0" />
                <span>{language === "hi" ? "स्थिति जांच" : "Status Check"}</span>
              </button>
            </div>

            {/* Firebase Google Auth Button */}
            {authUser ? (
              <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-slate-800 border border-stone-250 dark:border-slate-700 pl-1 pr-2 py-0.5 rounded-full select-none text-[10.5px]">
                {authUser.photoURL ? (
                  <img 
                    src={authUser.photoURL} 
                    alt={authUser.displayName || "User"} 
                    className="w-5 h-5 rounded-full object-cover border border-stone-300" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center">
                    {(authUser.displayName || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-bold text-stone-800 dark:text-stone-200 hidden lg:inline max-w-[90px] truncate">
                  {authUser.displayName || "Citizen"}
                </span>
                <button
                  type="button"
                  onClick={handleGoogleSignOut}
                  className="p-1 text-stone-500 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer border-0 bg-transparent"
                  title={language === "hi" ? "लॉगआउट करें" : "Sign Out"}
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoogleSignIn}
                className="flex items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-full bg-white dark:bg-slate-900 border border-stone-250 hover:border-blue-500 text-stone-800 dark:text-stone-200 hover:text-blue-600 font-extrabold text-[10px] sm:text-[10.5px] shadow-3xs cursor-pointer select-none transition shrink-0"
                title={language === "hi" ? "गूगल से लॉगिन करें" : "Sign in with Google"}
                id="firebase-google-login-btn"
              >
                <LogIn className="w-3 h-3 text-blue-600 shrink-0" />
                <span>{language === "hi" ? "लॉगिन" : "Sign In"}</span>
              </motion.button>
            )}

            {/* Elegant Sun/Moon Theme Toggle (Matches high-contrast UI) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setDarkMode(prev => !prev);
                triggerToast(
                  !darkMode 
                    ? (language === "hi" ? "डार्क मोड सक्रिय (Low-light)" : "High-Contrast Dark Mode enabled") 
                    : (language === "hi" ? "लाइट मोड सक्रिय" : "Standard Light Mode enabled"),
                  "info"
                );
              }}
              className="flex items-center justify-center p-1.5 sm:p-2 rounded-full border border-stone-250 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 shadow-3xs cursor-pointer select-none transition shrink-0"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode Suitable for Low-light"}
              id="theme-mode-toggle"
            >
              {darkMode ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
              )}
            </motion.button>

            {/* Quick Start Launcher Button with animated glow & scale physical reactivity */}
            <motion.button
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 8px 12px -3px rgba(239, 68, 68, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLauncher(true)}
              className="relative hidden md:flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-brand-coral via-orange-500 to-amber-500 text-white font-display font-black rounded-full text-[10px] sm:text-[10.5px] uppercase tracking-wider transition duration-200 cursor-pointer select-none shrink-0 border-0 outline-none overflow-hidden shadow-2xs"
              id="header-start-btn"
              title={language === "hi" ? "त्वरित पहुंच केंद्र खोलें" : "Launch Quick Access Hub"}
            >
              {/* Outer soft glowing ambient pulse */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-coral via-orange-500 to-amber-500 blur-sm opacity-20 animate-pulse -z-10"></span>
              
              <div className="relative flex items-center gap-1 sm:gap-1.5 leading-none">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                  className="flex items-center justify-center shrink-0"
                >
                  <LayoutGrid className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                </motion.div>
                
                {/* Responsive text length to fit perfectly on very small devices */}
                <span>
                  <span className="hidden sm:inline">
                    {language === "hi" ? "त्वरित लॉन्च" : "Quick Launch"}
                  </span>
                  <span className="sm:hidden">
                    {language === "hi" ? "आरंभ" : "Launch"}
                  </span>
                </span>
                
                {/* Visual tiny glowing live indicator dot */}
                <span className="relative flex h-1 w-1 sm:h-1.5 sm:w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1 sm:h-1.5 w-1 sm:w-1.5 bg-amber-300"></span>
                </span>
              </div>
            </motion.button>

          </div>

        </div>
      </header>

      {/* 3. Global Toast Notifications Overlay */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 max-w-sm rounded-2xl shadow-xl border border-stone-200 animate-bounce flex items-start gap-2.5 text-xs font-sans bg-white">
          <div className="w-5 h-5 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center shrink-0 font-bold">
            ✓
          </div>
          <div className="space-y-0.5">
            <h5 className="font-bold text-stone-900">{t("toast.header")}</h5>
            <p className="text-stone-605 leading-relaxed font-normal">{toast.message}</p>
          </div>
        </div>
      )}

      {/* 4. Interactive Navigation Tabs Panel (Desktop & Tablet only) */}
      <div className="hidden md:block bg-white border-b border-gray-200 shrink-0 sticky top-0 z-40 shadow-xs select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 -mb-px pt-1.5 scrollbar-none">
            
            <button
              id="desktop-nav-services"
              onClick={() => { setActiveTab("services"); setSelectedService(null); }}
              className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-extrabold text-[11px] uppercase tracking-wider transition whitespace-nowrap cursor-pointer select-none ${
                activeTab === "services" 
                  ? "border-orange-600 text-orange-650" 
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Landmark className="w-3.5 h-3.5 shrink-0" />
              {t("tab.services")}
            </button>

            <button
              id="desktop-nav-eligibility"
              onClick={() => setActiveTab("eligibility")}
              className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-extrabold text-[11px] uppercase tracking-wider transition whitespace-nowrap cursor-pointer select-none ${
                activeTab === "eligibility" 
                  ? "border-orange-600 text-orange-650" 
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-orange-605 shrink-0" />
              {t("tab.eligibility")}
            </button>



            <button
              id="desktop-nav-chatbot"
              onClick={() => setActiveTab("chatbot")}
              className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-extrabold text-[11px] uppercase tracking-wider transition whitespace-nowrap cursor-pointer select-none ${
                activeTab === "chatbot" 
                  ? "border-orange-600 text-orange-650" 
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Bot className="w-3.5 h-3.5 shrink-0" />
              {t("tab.chatbot")}
            </button>

            <button
              id="desktop-nav-faq"
              onClick={() => setActiveTab("faq")}
              className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-extrabold text-[11px] uppercase tracking-wider transition whitespace-nowrap cursor-pointer select-none ${
                activeTab === "faq" 
                  ? "border-orange-600 text-orange-650" 
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              {t("tab.faq")}
            </button>



            <button
              id="desktop-nav-sitemap"
              onClick={() => setActiveTab("sitemap")}
              className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-extrabold text-[11px] uppercase tracking-wider transition whitespace-nowrap cursor-pointer select-none ${
                activeTab === "sitemap" 
                  ? "border-orange-600 text-orange-650" 
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Globe className="w-3.5 h-3.5 shrink-0 text-[#FF5A2B]" />
              <span className="flex items-center gap-1">
                <span>{language === "hi" ? "100+ सेवाएँ" : "100+ Pages Sitemap"}</span>
                <span className="text-[8px] bg-[#FF5A2B]/10 text-[#FF5A2B] px-1 py-0.2 rounded font-mono">NEW</span>
              </span>
            </button>

            <button
              id="desktop-nav-legal"
              onClick={() => { setActiveTab("legal-hub"); setLegalHubDefaultSection("about"); }}
              className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-extrabold text-[11px] uppercase tracking-wider transition whitespace-nowrap cursor-pointer select-none ${
                activeTab === "legal-hub" 
                  ? "border-orange-600 text-orange-655" 
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 shrink-0" />
              {language === "hi" ? "नीति एवं विलेख" : "Legal & Info"}
            </button>

            <button
              id="desktop-nav-discussions"
              onClick={() => setActiveTab("discussions")}
              className={`flex items-center gap-1.5 py-2 px-3 border-b-2 font-extrabold text-[11px] uppercase tracking-wider transition whitespace-nowrap cursor-pointer select-none ${
                activeTab === "discussions" 
                  ? "border-orange-600 text-orange-655" 
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>{language === "hi" ? "सत्यापित चर्चाएँ" : "Citizen Discussions"}</span>
            </button>

          </div>
        </div>
      </div>

      {/* 4a. Interactive Breadcrumb Navigation Trail */}
      <div 
        id="breadcrumb-navigation-container"
        className="bg-stone-50 dark:bg-slate-950/45 border-b border-stone-200/80 dark:border-white/5 py-3 px-4 sm:px-6 lg:px-8 select-none transition-colors duration-250 animate-fadeIn"
      >
        <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-2 text-[10.5px] sm:text-[11.5px] text-stone-500 dark:text-slate-400 font-sans tracking-wide">
          
          {/* Node 1: Root Home */}
          <button
            onClick={() => {
              setActiveTab("services");
              setSelectedService(null);
              setActiveDossier(null);
              setSearchQuery("");
            }}
            className="flex items-center gap-1 hover:text-orange-650 dark:hover:text-orange-400 transition cursor-pointer font-bold uppercase"
            id="breadcrumb-root-home-btn"
            title={language === "hi" ? "मुख्यपृष्ठ" : "Reset & Home"}
          >
            <Home className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600" />
            <span>{language === "hi" ? "मुख्यपृष्ठ" : "Home"}</span>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-slate-700 shrink-0" />

          {/* Node 2: Tab level */}
          <button
            onClick={() => {
              if (activeTab === "services") {
                setSelectedService(null);
                setActiveDossier(null);
              } else if (activeTab === "legal-hub") {
                setLegalHubDefaultSection("about");
              }
            }}
            disabled={activeTab !== "services" && activeTab !== "legal-hub"}
            className={`flex items-center gap-1 transition uppercase font-bold ${
              (activeTab === "services" && !selectedService && !activeDossier) || (activeTab === "legal-hub" && !legalHubDefaultSection)
                ? "text-stone-850 dark:text-stone-250 font-black cursor-default"
                : "hover:text-orange-655 dark:hover:text-orange-400 cursor-pointer"
            }`}
            id={`breadcrumb-tab-level-${activeTab}`}
          >
            <span>
              {activeTab === "services" && (language === "hi" ? "सेवा निर्देशिका" : "Service Directory")}
              {activeTab === "eligibility" && (language === "hi" ? "योग्यता और तुलना" : "Eligibility Tracker")}
              {activeTab === "lockers" && (language === "hi" ? "डिजिलॉकर" : "Citizen DigiLocker")}
              {activeTab === "chatbot" && (language === "hi" ? "सेवामित्र AI" : "SewaMitra AI Helper")}
              {activeTab === "faq" && (language === "hi" ? "सहायता और अक्सर पूछे जाने वाले प्रश्न" : "FAQs & Support")}
              {activeTab === "legal-hub" && (language === "hi" ? "कानूनी और सुसंगति हब" : "Legal & Compliance Hub")}
              {activeTab === "sitemap" && (language === "hi" ? "साइटमैप निर्देशिका" : "Portal Sitemap")}
              {activeTab === "discussions" && (language === "hi" ? "सत्यापित नागरिक चर्चाएँ" : "Verified Citizen Discussions")}
            </span>
          </button>

          {/* Node 3: Deep nested paths (e.g. detailed service or active application form) */}
          {activeTab === "services" && activeDossier && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-slate-700 shrink-0" />
              <span className="font-black text-stone-850 dark:text-stone-200 uppercase truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                {(language === "hi" ? "आवेदन: " : "Apply: ") + translateService(activeDossier).title}
              </span>
            </>
          )}

          {activeTab === "legal-hub" && legalHubDefaultSection && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300 dark:text-slate-700 shrink-0" />
              <span className="font-black text-stone-850 dark:text-stone-200 uppercase">
                {legalHubDefaultSection === "about" && (language === "hi" ? "हमारे बारे में" : "About Us")}
                {legalHubDefaultSection === "privacy" && (language === "hi" ? "गोपनीयता नीति" : "Privacy Policy")}
                {legalHubDefaultSection === "terms" && (language === "hi" ? "सेवा की शर्तें" : "Terms & Conditions")}
                {legalHubDefaultSection === "cookies" && (language === "hi" ? "कुकी नीति" : "Cookie Policy")}
                {legalHubDefaultSection === "disclaimer" && (language === "hi" ? "अस्वीकरण" : "Disclaimer")}
                {legalHubDefaultSection === "rules" && (language === "hi" ? "नियम और विनियम" : "Rules & Regulations")}
              </span>
            </>
          )}

        </div>
      </div>

      {/* 4b. Persistent Modern floating Thumb-Friendly Mobile Slider Dock (Visible on mobile screens < 768px only) */}
      <div className="md:hidden fixed bottom-4.5 left-4 right-4 h-15 z-50 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-stone-200 dark:border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex justify-between items-center gap-2 px-3 select-none sb-safe transition-all duration-300">
        
        {/* 1. Services */}
        <button
          id="mobile-nav-services"
          onClick={() => { setActiveTab("services"); setSelectedService(null); }}
          className={`relative flex flex-col items-center justify-center gap-0.5 h-full py-1 rounded-xl transition-all duration-300 text-center flex-1 cursor-pointer overflow-hidden z-20 ${
            activeTab === "services" ? "text-orange-600 dark:text-orange-400 font-extrabold" : "text-stone-550 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white font-semibold"
          }`}
        >
          {activeTab === "services" && (
            <motion.div
              layoutId="mobileActiveIndicator"
              className="absolute inset-[3px] bg-stone-100 border border-stone-200/60 dark:bg-gradient-to-br dark:from-white/15 dark:to-white/5 dark:border-white/5 rounded-xl -z-10 shadow-3xs"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <Landmark className="w-4 h-4 transition-transform duration-200 active:scale-110" />
          <span className="text-[7.5px] uppercase tracking-wide leading-none font-sans font-bold">
            {t("tab.services")}
          </span>
        </button>
 
        {/* 3. Flagship AI Chatbot (Interactive elevated center action button) */}
        <div className="relative flex-1 flex flex-col justify-center items-center h-full -mt-4.5 z-30">
          <button
            id="mobile-nav-chatbot"
            onClick={() => setActiveTab("chatbot")}
            className={`w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-[0_4px_15px_rgba(249,115,22,0.4)] transition-all duration-300 active:scale-90 hover:scale-105 cursor-pointer relative ${
              activeTab === "chatbot" 
                ? "ring-4 ring-orange-500/30 dark:ring-orange-400/30 scale-105 border border-white/20" 
                : "ring-2 ring-stone-200 dark:ring-white/10"
            }`}
          >
            {activeTab === "chatbot" && (
              <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-20"></span>
            )}
            <Bot className="w-4.5 h-4.5 text-white" />
          </button>
          
          <span className={`text-[7.5px] uppercase tracking-wide leading-none font-black mt-1 ${
            activeTab === "chatbot" ? "text-orange-600 dark:text-orange-400" : "text-stone-500 dark:text-slate-400"
          }`}>
            {language === "hi" ? "सहायक AI" : "AI Seva"}
          </span>
        </div>
 
 
  
        {/* 5. More */}
        <button
          id="mobile-nav-more"
          onClick={() => setIsMobileMoreOpen(true)}
          className={`relative flex flex-col items-center justify-center gap-0.5 h-full py-1 rounded-xl transition-all duration-300 text-center flex-1 cursor-pointer overflow-hidden z-20 ${
            isMobileMoreOpen || ["eligibility", "sitemap", "faq", "legal-hub"].includes(activeTab) 
              ? "text-orange-600 dark:text-orange-400 font-extrabold" 
              : "text-stone-550 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white font-semibold"
          }`}
        >
          {(isMobileMoreOpen || ["eligibility", "sitemap", "faq", "legal-hub"].includes(activeTab)) && (
            <motion.div
              layoutId="mobileActiveIndicator"
              className="absolute inset-[3px] bg-stone-100 border border-stone-200/60 dark:bg-gradient-to-br dark:from-white/15 dark:to-white/5 dark:border-white/5 rounded-xl -z-10 shadow-3xs"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <LayoutGrid className="w-4 h-4 transition-transform duration-200 active:scale-110" />
          <span className="text-[7.5px] uppercase tracking-wide leading-none font-sans font-bold">
            {language === "hi" ? "और" : "More"}
          </span>
        </button>
 
      </div>

      {/* 4c. Elegant Slide-up Drawer Backdrop Overlay & Drawer Panel for Mobile Hub */}
      <AnimatePresence>
        {isMobileMoreOpen && (
          <>
            {/* Blurred Backdrop Overlay with smooth Fade animation */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden fixed inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md z-[55] cursor-pointer" 
              onClick={() => setIsMobileMoreOpen(false)}
            />

            {/* Smooth Slide-up Drawer with Spring Physics & Frosted Glass Effect */}
            <motion.div
              initial={{ y: "100%", opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.9 }}
              transition={{ type: "spring", damping: 28, stiffness: 280, mass: 0.85 }}
              className="md:hidden fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-t border-stone-200/80 dark:border-white/10 rounded-t-3xl z-[60] shadow-[0_-12px_40px_rgba(0,0,0,0.22)] dark:shadow-[0_-12px_45px_rgba(0,0,0,0.7)] overflow-y-auto pb-8 select-none"
            >
              {/* Grab handle bar */}
              <div 
                className="mx-auto my-3 w-12 h-1.5 bg-stone-300 dark:bg-slate-700/80 rounded-full cursor-pointer hover:bg-stone-400 dark:hover:bg-slate-600 transition" 
                onClick={() => setIsMobileMoreOpen(false)}
              ></div>
            
            <div className="px-5 py-2 space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200 dark:border-white/5">
                <div className="space-y-0.5 text-left">
                  <h3 className="text-xs font-black text-stone-900 dark:text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                    <LayoutGrid className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    <span>{language === "hi" ? "ई-सेवा हब मेनू" : "eSewa Hub Menu"}</span>
                  </h3>
                  <p className="text-[9px] text-stone-500 dark:text-slate-400 font-sans">
                    {language === "hi" ? "अतिरिक्त डिजिटल उपकरण और शिकायतें" : "Access supplementary citizen portals"}
                  </p>
                </div>
                <button 
                  onClick={() => setIsMobileMoreOpen(false)}
                  className="text-[10px] font-mono font-bold text-stone-600 dark:text-slate-400 bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-white/5 transition cursor-pointer"
                >
                  {language === "hi" ? "बंद करें" : "Close"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                
                {/* 1. Eligibility Checker */}
                <button
                  onClick={() => { setActiveTab("eligibility"); setIsMobileMoreOpen(false); }}
                  className={`p-4 rounded-2xl text-left border flex flex-col justify-between gap-4 transition cursor-pointer ${
                    activeTab === "eligibility" 
                      ? "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400" 
                      : "bg-stone-50 dark:bg-slate-900/40 border-stone-200 dark:border-white/5 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-indigo-950/25"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Award className={`w-4.5 h-4.5 ${activeTab === "eligibility" ? "text-orange-600 dark:text-orange-400" : "text-amber-500"}`} />
                    <span className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 rounded font-mono font-black uppercase">Statutory</span>
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-xs font-bold block leading-none mb-0.5">{t("tab.eligibility")}</strong>
                    <span className="text-[9.5px] text-stone-550 dark:text-slate-400 block leading-tight">
                      {language === "hi" ? "योजना पात्रता जांचें" : "Check eligibility criteria"}
                    </span>
                  </div>
                </button>





                {/* 3. sitemap directory */}
                <button
                  onClick={() => { setActiveTab("sitemap"); setIsMobileMoreOpen(false); }}
                  className={`p-4 rounded-2xl text-left border flex flex-col justify-between gap-4 transition cursor-pointer ${
                    activeTab === "sitemap" 
                      ? "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400" 
                      : "bg-stone-50 dark:bg-slate-900/40 border-stone-200 dark:border-white/5 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-indigo-950/25"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Globe className={`w-4.5 h-4.5 ${activeTab === "sitemap" ? "text-orange-600 dark:text-orange-400" : "text-emerald-500"}`} />
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded font-mono font-black uppercase">Directory</span>
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-xs font-bold block leading-none mb-0.5">{language === "hi" ? "100+ सेवाएँ" : "Sitemap Index"}</strong>
                    <span className="text-[9.5px] text-stone-550 dark:text-slate-400 block leading-tight">
                      {language === "hi" ? "केंद्रीय और राज्य सूची" : "Unified e-Sewa deep-links"}
                    </span>
                  </div>
                </button>

                {/* 4. FAQ rates */}
                <button
                  onClick={() => { setActiveTab("faq"); setIsMobileMoreOpen(false); }}
                  className={`p-4 rounded-2xl text-left border flex flex-col justify-between gap-4 transition cursor-pointer ${
                    activeTab === "faq" 
                      ? "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400" 
                      : "bg-stone-50 dark:bg-slate-900/40 border-stone-200 dark:border-white/5 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-indigo-950/25"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <HelpCircle className={`w-4.5 h-4.5 ${activeTab === "faq" ? "text-orange-600 dark:text-orange-400" : "text-indigo-500"}`} />
                    <span className="text-[8px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.2 rounded font-mono font-black uppercase">Rate Cards</span>
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-xs font-bold block leading-none mb-0.5">{t("tab.faq")}</strong>
                    <span className="text-[9.5px] text-stone-550 dark:text-slate-400 block leading-tight">
                      {language === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Timelines and state SLAs"}
                    </span>
                  </div>
                </button>

                {/* Saved Bookmarks Trigger */}
                <button
                  onClick={() => { setIsSavedServicesOpen(true); setIsMobileMoreOpen(false); }}
                  className="p-4 rounded-2xl text-left border bg-stone-50 dark:bg-slate-900/40 border-stone-200 dark:border-white/5 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-indigo-950/25 flex flex-col justify-between gap-4 transition cursor-pointer font-sans"
                >
                  <div className="flex items-center justify-between">
                    <BookmarkCheck className="w-4.5 h-4.5 text-rose-650" />
                    <span className="text-[8px] bg-rose-500/10 text-rose-650 dark:text-rose-400 px-1.5 py-0.2 rounded font-mono font-black uppercase">
                      {savedServiceIds.length} Saved
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-xs font-bold block leading-none mb-0.5">{language === "hi" ? "पसंदीदा सेवाएँ" : "Saved Services"}</strong>
                    <span className="text-[9.5px] text-stone-550 dark:text-slate-400 block leading-tight">
                      {language === "hi" ? "बुकमार्क वाली सूची" : "Access bookmarked services"}
                    </span>
                  </div>
                </button>

                {/* 5. Search trigger */}
                <button
                  onClick={() => { setIsMobileSearchOpen(true); setIsMobileMoreOpen(false); }}
                  className="p-4 rounded-2xl text-left border bg-stone-50 dark:bg-slate-900/40 border-stone-200 dark:border-white/5 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-indigo-950/25 flex flex-col justify-between gap-4 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <Search className="w-4.5 h-4.5 text-[#FF5A2B]" />
                    <span className="text-[8px] bg-[#FF5A2B]/10 text-orange-650 dark:text-orange-400 px-1.5 py-0.2 rounded font-mono font-black uppercase">Instant</span>
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-xs font-bold block leading-none mb-0.5">{language === "hi" ? "वैश्विक खोज" : "Global Search"}</strong>
                    <span className="text-[9.5px] text-stone-550 dark:text-slate-400 block leading-tight">
                      {language === "hi" ? "सभी सेवाएँ और योजनाएँ खोजें" : "Locate services by keyword"}
                    </span>
                  </div>
                </button>

                {/* 6. Legal Hub */}
                <button
                  onClick={() => { setActiveTab("legal-hub"); setLegalHubDefaultSection("about"); setIsMobileMoreOpen(false); }}
                  className={`p-4 rounded-2xl text-left border flex flex-col justify-between gap-4 transition cursor-pointer ${
                    activeTab === "legal-hub" 
                      ? "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400" 
                      : "bg-stone-50 dark:bg-slate-900/40 border-stone-200 dark:border-white/5 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-indigo-950/25"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Building2 className={`w-4.5 h-4.5 ${activeTab === "legal-hub" ? "text-orange-600 dark:text-orange-400" : "text-stone-550 dark:text-slate-400"}`} />
                    <span className="text-[8px] bg-slate-500/10 text-stone-600 dark:text-slate-400 px-1.5 py-0.2 rounded font-mono font-black uppercase">Gazette</span>
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-xs font-bold block leading-none mb-0.5">{language === "hi" ? "नीति एवं विलेख" : "Legal & Info"}</strong>
                    <span className="text-[9.5px] text-stone-550 dark:text-slate-400 block leading-tight">
                      {language === "hi" ? "हमारे बारे में और गोपनीयता" : "Consent, RTI, & licensing"}
                    </span>
                  </div>
                </button>

                {/* 7. Citizen Discussions */}
                <button
                  onClick={() => { setActiveTab("discussions"); setIsMobileMoreOpen(false); }}
                  className={`p-4 rounded-2xl text-left border flex flex-col justify-between gap-4 transition cursor-pointer ${
                    activeTab === "discussions" 
                      ? "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400" 
                      : "bg-stone-50 dark:bg-slate-900/40 border-stone-200 dark:border-white/5 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-indigo-950/25"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Users className={`w-4.5 h-4.5 ${activeTab === "discussions" ? "text-orange-600 dark:text-orange-400" : "text-amber-500"}`} />
                    <span className="text-[8px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 rounded font-mono font-black uppercase">Debates</span>
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-xs font-bold block leading-none mb-0.5">{language === "hi" ? "नागरिक चर्चा" : "Citizen Forums"}</strong>
                    <span className="text-[9.5px] text-stone-550 dark:text-slate-400 block leading-tight">
                      {language === "hi" ? "समुदाय द्वारा सत्यापित धागे" : "Community-verified policy threads"}
                    </span>
                  </div>
                </button>

              </div>

              {/* Profile removed to ensure no registration requirements */}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Google AdSense Ready Header Leaderboard ad - high visibility */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 -mb-2 select-none">
        <AdSenseUnit id="header-leaderboard" format="horizontal" slotId="3829104729" />
      </div>

      {/* 5. Main Content Layout (Grid split with recent applications live tracker) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Central Workspace column */}
        <div className={activeTab === "services" ? "lg:col-span-8 space-y-6" : "lg:col-span-12 space-y-6"}>
          
          {loading ? (
            <div className="p-20 text-center bg-white border border-gray-150 rounded-3xl flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-500 font-mono">Securing encryption channels for e-Gov services gateway...</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              
              {activeTab === "services" && (
                activeDossier ? (
                  <ServiceDossier 
                    service={activeDossier}
                    language={language}
                    onBack={() => { setActiveDossier(null); }}
                    triggerToast={triggerToast}
                    savedServiceIds={savedServiceIds}
                    onToggleSave={handleToggleSave}
                    onSelectService={(selectedSvc) => {
                      setActiveDossier(selectedSvc);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ) : (
                  <ESevaServiceList 
                    services={services}
                    onApplyClick={(service) => { setActiveDossier(service); }}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    savedServiceIds={savedServiceIds}
                    onToggleSave={(id, e) => {
                      if (e) e.stopPropagation();
                      handleToggleSave(id);
                    }}
                    onFeedbackClick={(service) => {
                      setFeedbackService(service);
                      setFeedbackRating(0);
                      setFeedbackComment("");
                      setShowFeedbackModal(true);
                    }}
                    onReportIssueClick={(service) => {
                      setReportService(service);
                      setReportIssueType("incorrect_info");
                      setReportDetails("");
                      setReportEmail(citizenEmail);
                      setShowReportModal(true);
                    }}
                    onDonateClick={(service) => {
                      triggerToast(
                        language === "hi" 
                          ? `राष्ट्रीय कल्याण गेटवे खोल रहा है...` 
                          : `Opening National Support & Welfare Gateway for ${service.title}...`, 
                        "info"
                      );
                      setTimeout(() => {
                        const widget = document.getElementById("national-dev-fund-widget");
                        if (widget) {
                          widget.scrollIntoView({ behavior: "smooth", block: "center" });
                          setTimeout(() => {
                            const btn = document.getElementById("open-nation-fund-modal-btn");
                            if (btn) btn.click();
                          }, 450);
                        } else {
                          const btn = document.getElementById("open-nation-fund-modal-btn");
                          if (btn) btn.click();
                        }
                      }, 100);
                    }}
                  />
                )
              )}

              {activeTab === "eligibility" && (
                <EligibilityChecker 
                  onApplyForScheme={(serviceId) => {
                    const matched = services.find(s => s.id === serviceId);
                    if (matched) {
                      setActiveDossier(matched);
                      setActiveTab("services");
                    } else {
                      setActiveTab("services");
                    }
                  }}
                />
              )}



              {activeTab === "chatbot" && (
                <ESevaSupportChatbot 
                  chatHistory={chatHistory}
                  onSendMessage={handleSendChat}
                  onClearChat={handleClearChatHistory}
                  loading={loadingChat}
                />
              )}

              {activeTab === "faq" && (
                <ESevaFaq onBackToServices={() => { setActiveTab("services"); setActiveDossier(null); setSelectedService(null); }} />
              )}

              {activeTab === "sitemap" && (
                <SitemapCatalog 
                  language={language}
                  onNavigateToTab={(tab) => { setActiveTab(tab); setActiveDossier(null); setSelectedService(null); }}
                  onSelectService={(service) => { setActiveDossier(service); setActiveTab("services"); }}
                  triggerToast={triggerToast}
                />
              )}



              {activeTab === "legal-hub" && (
                <LegalPortal 
                  language={language}
                  defaultSection={legalHubDefaultSection}
                  triggerToast={triggerToast}
                  onBackToServices={() => { setActiveTab("services"); setSelectedService(null); }}
                />
              )}

              {activeTab === "discussions" && (
                <VerifiedDiscussions
                  language={language}
                  citizenName={citizenName}
                  citizenEmail={citizenEmail}
                  citizenAadhaar={citizenAadhaar}
                  citizenState={citizenState}
                  triggerToast={triggerToast}
                />
              )}

            </div>
          )}

        </div>

        {/* Right Sidebar: Real-Time Application Tracking Center */}
        {activeTab === "services" && (
          <div className="lg:col-span-4 space-y-6 pb-6 animate-fade-in w-full">

            {/* National Development / Support & Fund gateway */}
            <NationalFundWidget language={language} triggerToast={triggerToast} />

            {/* Live State Governance News Grounded Widget */}
            <StateGovernanceNewsWidget language={language} triggerToast={triggerToast} />

            {/* Google AdSense Ready Sidebar Vertical Square Ad Unit */}
            <AdSenseUnit id="sidebar-square" format="sidebar" slotId="5830184029" />

          </div>
        )}

      </main>

      {/* 6. Footer */}
      <footer className="shrink-0 mt-auto bg-stone-100 dark:bg-slate-950 border-t border-stone-200 dark:border-slate-900 text-stone-600 dark:text-slate-400 text-[11px] pt-6 pb-26 md:py-6 px-4 md:px-8 text-center transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <h5 className="font-extrabold text-stone-900 dark:text-white">{t("footer.title")}</h5>
            <p className="text-stone-500 dark:text-slate-500 font-sans">{t("footer.rights")}</p>
          </div>

          {/* AdSense Required Pages Links */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3.5 gap-y-2 text-stone-650 dark:text-slate-400 font-sans text-xs my-2 md:my-0">
            <button onClick={() => { setActiveTab("faq"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="text-amber-600 dark:text-amber-500 hover:text-amber-400 dark:hover:text-amber-300 font-bold underline cursor-pointer transition">🎯 FAQ Hub</button>
            <span className="text-stone-300 dark:text-slate-700">|</span>
            <button onClick={() => setShowFeedbackModal(true)} className="text-emerald-600 dark:text-emerald-500 hover:text-emerald-400 dark:hover:text-emerald-300 font-bold underline cursor-pointer transition">⭐ Feedback</button>
            <span className="text-stone-300 dark:text-slate-700">|</span>
            <a href="/privacy" className="hover:text-stone-900 dark:hover:text-white underline cursor-pointer transition">Privacy Policy</a>
            <span className="text-stone-300 dark:text-slate-700">|</span>
            <a href="/terms" className="hover:text-stone-900 dark:hover:text-white underline cursor-pointer transition">Terms &amp; Conditions</a>
            <span className="text-stone-300 dark:text-slate-700">|</span>
            <a href="/cookies" className="hover:text-stone-900 dark:hover:text-white underline cursor-pointer transition font-semibold">Cookie Policy</a>
            <span className="text-stone-300 dark:text-slate-700">|</span>
            <button onClick={() => openCookieSettings()} className="hover:text-stone-900 dark:hover:text-white underline cursor-pointer transition font-semibold">🍪 Cookie Settings</button>
            <span className="text-stone-300 dark:text-slate-700">|</span>
            <a href="/disclaimer" className="hover:text-stone-900 dark:hover:text-white underline cursor-pointer transition font-semibold text-red-650 dark:text-red-400">Disclaimer</a>
            <span className="text-stone-300 dark:text-slate-700">|</span>
            <a href="/about" className="hover:text-stone-900 dark:hover:text-white underline cursor-pointer transition">About Us</a>
            <span className="text-stone-300 dark:text-slate-700">|</span>
            <a href="/contact" className="hover:text-stone-900 dark:hover:text-white underline cursor-pointer transition">Contact</a>

          </div>
          
          <div className="flex flex-wrap gap-4 text-stone-550 dark:text-slate-500 font-mono text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> 
              {t("footer.node")}
            </span>
            <span>|</span>
            <span>{t("footer.ssl")}</span>
            <span>|</span>
            <span>{t("footer.charter")}</span>
          </div>
        </div>
      </footer>

      {/* 7. Persistent Floating Start Action Button */}
      <div className="fixed bottom-20 right-4 md:bottom-6 md:right-22 z-40">
        <button
          onClick={() => setShowLauncher(true)}
          className="flex items-center justify-center md:justify-start gap-0 md:gap-2 w-12 h-12 md:w-auto md:h-auto px-0 md:px-5 md:py-3.5 bg-slate-900/95 backdrop-blur-md text-white rounded-full font-bold text-[10.5px] md:text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-black/50 border border-white/10 shrink-0 cursor-pointer select-none ring-4 ring-amber-500/15 hover:ring-amber-500/30 group relative"
          title="Launch Quick Access Hub"
        >
          <LayoutGrid className="w-4 h-4 md:w-4 md:h-4 text-amber-450 group-hover:rotate-90 transition duration-300 shrink-0" />
          <span className="hidden md:inline">Launch Menu (Start)</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute top-2 right-2 md:-top-1 md:-right-1 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute animate-ping"></span>
          </span>
        </button>
      </div>

      {/* 8. Quick Start e-Sewa Gateway Launcher Flyout */}
      {showLauncher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col md:flex-row">
            
            {/* Left tricolor visual bar & stats sidebar (hidden on mobile to prevent layout congestion) */}
            <div className="hidden md:flex bg-stone-900 text-white p-6 md:w-80 shrink-0 flex-col justify-between border-r border-stone-800 relative">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-orange-400 via-white to-emerald-500"></div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-amber-550 flex items-center justify-center font-bold text-neutral-900 text-base shadow-inner">
                    🇮🇳
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm tracking-tight text-white leading-none">SewaNadu Launcher</h3>
                    <p className="text-[10px] text-stone-450 tracking-wider font-mono uppercase mt-1">National Command Hub</p>
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="space-y-3.5 pt-4">
                  <p className="text-[10px] font-mono uppercase text-slate-400 border-b border-stone-800 pb-1">Real-time Portal Metrics</p>
                  
                  <div className="space-y-2.5">
                    <div>
                      <div className="text-[10px] text-stone-400">Total DBT Disbursed:</div>
                      <div className="text-sm font-mono font-bold text-amber-400">₹4,103.7 Cr</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400">Connected Services:</div>
                      <div className="text-sm font-mono font-bold text-emerald-400">1,840 active links</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400">Portal Visits:</div>
                      <div className="text-sm font-mono font-bold text-blue-400">47.8 Lakh</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-3">
                <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800/60 text-[10.5px] text-stone-450 leading-normal font-sans">
                  Use this launchpad to instantly switch views, verify system compliance, and access standard document re-issuances in your local native script.
                </div>
                
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>SSL SECURE</span>
                  <span>v4.2 PROD</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Area */}
            <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                
                {/* Mobile-focused elegant top header containing title & close triggers */}
                <div className="flex md:hidden items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-150">
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none">🇮🇳</span>
                    <div>
                      <h3 className="font-display font-black text-xs tracking-tight text-stone-900 leading-none">SewaNadu Launcher</h3>
                      <p className="text-[8px] text-stone-450 tracking-wider font-mono uppercase mt-0.5">National Command Hub</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowLauncher(false)}
                    className="p-1 px-3 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 active:scale-95 rounded-xl font-bold text-stone-600 text-[10px] font-mono transition cursor-pointer border-0 outline-none flex items-center gap-1.5"
                  >
                    <span>CLOSE</span>
                    <span className="opacity-50 text-[8px] font-normal">[ESC]</span>
                  </button>
                </div>

                {/* Search Bar / Header inside Launcher - Expanded full width on mobile */}
                <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-stone-150">
                  <div className="flex items-center gap-2 w-full">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search and launch service instantly..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setActiveTab("services");
                          setSelectedService(null);
                        }}
                        onFocus={() => setFocusedInput("launcher")}
                        onBlur={() => setTimeout(() => setFocusedInput(null), 250)}
                        className="w-full bg-stone-50 border border-stone-200 py-2 pl-10 pr-4 rounded-xl text-xs font-sans outline-none focus:border-brand-coral/45 focus:bg-white transition"
                      />

                      {/* Live Autocomplete suggestions inside Launcher */}
                      {focusedInput === "launcher" && getAutoSuggestions().length > 0 && (
                        <div 
                          className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-stone-205 rounded-xl shadow-xl max-h-56 overflow-y-auto z-[999] p-1 divide-y divide-stone-100 select-none animate-fadeIn"
                          id="launcher-autosuggest-dropdown"
                        >
                          {getAutoSuggestions().slice(0, 6).map((service) => {
                            const sTrans = translateService(service);
                            return (
                              <button
                                key={service.id}
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setActiveTab("services");
                                  setActiveDossier(service);
                                  setSearchQuery("");
                                  setShowLauncher(false);
                                }}
                                className="w-full text-left px-3 py-2.5 hover:bg-amber-500/10 first:rounded-t-lg last:rounded-b-lg flex flex-col gap-0.5 transition cursor-pointer text-stone-800 border-0 outline-none"
                              >
                                <span className="text-[10px] font-extrabold text-stone-900 leading-tight font-sans flex items-center justify-between">
                                    <span>{sTrans.title}</span>
                                    <span className="text-[8.5px] font-mono text-brand-coral shrink-0 font-bold ml-1.5">Launch →</span>
                                </span>
                                <span className="text-[8px] font-mono text-stone-450 tracking-wider uppercase">
                                  {sTrans.department}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <VoiceSearch
                      currentLanguage={language}
                      onSpeechResult={(text) => {
                        setSearchQuery(text);
                        setActiveTab("services");
                        setSelectedService(null);
                      }}
                      triggerToast={triggerToast}
                      className="py-2 px-2 rounded-xl h-9 w-9 shrink-0"
                      iconSize={15}
                    />
                  </div>
                  <button 
                    onClick={() => setShowLauncher(false)}
                    className="hidden md:block p-1.5 px-3 bg-stone-100 hover:bg-stone-200 rounded-full font-bold text-stone-600 text-xs transition cursor-pointer shrink-0 border-0 outline-none"
                  >
                    Close [Esc]
                  </button>
                </div>

                {/* 6 Core Functional Shortcuts */}
                <h4 className="text-[11px] font-mono text-stone-500 uppercase tracking-widest font-bold mb-3">Jump To Feature</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  
                  <button 
                    onClick={() => { setActiveTab("services"); setSelectedService(null); setShowLauncher(false); }}
                    className="flex items-start gap-3 p-3 rounded-2xl border border-stone-150 bg-stone-50/55 hover:bg-brand-cream-card hover:border-brand-coral/30 text-left transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <Landmark className="w-4 h-4 text-orange-655" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-stone-850 font-sans">All Citizen Services</h5>
                      <p className="text-[10px] text-stone-500 leading-snug mt-0.5">Apply for identity/welfare schemes</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setActiveTab("eligibility"); setSelectedService(null); setShowLauncher(false); }}
                    className="flex items-start gap-3 p-3 rounded-2xl border border-stone-150 bg-stone-50/55 hover:bg-brand-cream-card hover:border-brand-coral/30 text-left transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-amber-655" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-stone-850 font-sans">Eligibility Calculator</h5>
                      <p className="text-[10px] text-stone-500 leading-snug mt-0.5">Determine fitment for DBT subventions</p>
                    </div>
                  </button>



                  <button 
                    onClick={() => { setActiveTab("chatbot"); setSelectedService(null); setShowLauncher(false); }}
                    className="flex items-start gap-3 p-3 rounded-2xl border border-stone-150 bg-stone-50/55 hover:bg-brand-cream-card hover:border-brand-coral/30 text-left transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-stone-850 font-sans">Suvidha AI Assistant</h5>
                      <p className="text-[10px] text-stone-500 leading-snug mt-0.5">Discuss state criteria in natural language</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => { 
                      setShowLauncher(false); 
                      setActiveTab("services");
                      setSelectedService(null);
                      setActiveDossier(null);
                      triggerToast("Opening National Support & Welfare Contribution Gateway...", "info");
                      setTimeout(() => {
                        const el = document.getElementById("national-dev-fund-widget");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                        setTimeout(() => {
                          const btn = document.getElementById("open-nation-fund-modal-btn");
                          if (btn) btn.click();
                        }, 500);
                      }, 400);
                    }}
                    className="flex items-start gap-3 p-3 rounded-2xl border border-[#FF5A2B]/20 bg-brand-cream-card hover:bg-orange-50/40 hover:border-brand-coral text-left transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-100/80 flex items-center justify-center shrink-0 animate-pulse">
                      <Star className="w-4 h-4 text-brand-coral fill-brand-coral" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-[#FF5A2B] font-sans flex items-center gap-1">
                        Donate & Support SewaNadu
                        <span className="text-[7.5px] font-mono bg-red-100 text-red-700 px-1 py-0.2 rounded font-extrabold uppercase">Patron</span>
                      </h5>
                      <p className="text-[10px] text-stone-500 leading-snug mt-0.5">Fund server uptime & rural offline digitization labs</p>
                    </div>
                  </button>

                </div>

                {/* Grid of Indian Languages Switcher */}
                <h4 className="text-[11px] font-mono text-stone-500 uppercase tracking-widest font-bold mb-2.5">Switch Language Natively ({INDIAN_LANGUAGES.length} Indian States)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {INDIAN_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        triggerToast(`Switched language view to ${lang.name}.`, "success");
                        setShowLauncher(false);
                      }}
                      className={`px-3 py-2 text-left rounded-xl border text-[11px] font-bold tracking-tight transition cursor-pointer select-none ${
                        language === lang.code 
                          ? "bg-stone-900 border-stone-900 text-white shadow-xs" 
                          : "bg-white border-stone-200 hover:bg-stone-50 text-stone-705"
                      }`}
                    >
                      <div className="font-sans text-stone-800 leading-none group-hover:text-neutral-900">
                        {lang.nativeName}
                      </div>
                      <div className="text-[9px] font-mono text-stone-400 mt-0.5 font-normal">
                        {lang.name}
                      </div>
                    </button>
                  ))}
                </div>

              </div>

              {/* Launcher AdSense compliance footer links */}
              <div className="pt-6 border-t border-stone-150/80 flex flex-wrap items-center justify-between text-[10.5px] text-stone-450 gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  SewaNadu is AdSense verified to host DoubleClick third-party cookies.
                </div>
                
                <div className="flex gap-3">
                  <button onClick={() => { setActiveTab("legal-hub"); setLegalHubDefaultSection("privacy"); setShowLauncher(false); }} className="hover:text-stone-700 underline cursor-pointer">Privacy Standard</button>
                  <button onClick={() => { setActiveTab("legal-hub"); setLegalHubDefaultSection("terms"); setShowLauncher(false); }} className="hover:text-stone-700 underline cursor-pointer">Terms & Licenses</button>
                  <button onClick={() => { setActiveTab("legal-hub"); setLegalHubDefaultSection("rules"); setShowLauncher(false); }} className="hover:text-stone-700 underline cursor-pointer">Rules & Regulations</button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 9. AdSense Compliance Legal Policies overlay modal dynamically compiled */}
      {policyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal Header bar */}
            <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between relative">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-400 via-white to-emerald-500"></div>
              
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                <h3 className="font-display font-bold text-sm text-stone-900">
                  {policyModal === "privacy" && "SewaNadu National Privacy Standard & AdSense Disclosure"}
                  {policyModal === "terms" && "e-Sewa Gateway Public Terms & License Agreement"}
                  {policyModal === "cookie" && "Cookies Consent, Preferences & DoubleClick Policy"}
                  {policyModal === "about" && "About India SewaNadu National Gateway"}
                </h3>
              </div>

              <button 
                onClick={() => setPolicyModal(null)}
                className="p-1 px-3 bg-stone-100 hover:bg-stone-200 text-stone-707 font-extrabold text-[11px] rounded-lg cursor-pointer transition"
              >
                Close Policies Panel
              </button>
            </div>

            {/* Modal Scrollable textual content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans text-stone-650 leading-relaxed max-h-[60vh]">
              
              {policyModal === "privacy" && (
                <>
                  <div className="p-3 bg-blue-50/70 border border-blue-150 rounded-2xl text-blue-800 space-y-1.5 leading-normal">
                    <p className="font-extrabold">🚨 Google AdSense Transparency Disclosures:</p>
                    <p className="text-[11px] font-normal">This portal uses Google AdSense automated advertising algorithms. To understand cookies usage and DoubleClick programmatic tracking, please review the compliance details below.</p>
                  </div>

                  <h4 className="font-extrabold text-[13px] text-stone-850 pt-2 border-b border-stone-150 pb-1">1. Information We Collect</h4>
                  <p>SewaNadu operates on a 100% server-side sandbox and client-only state persistence structure. We do not aggregate, harvest, or transmit personally identifiable information (PII) including Aadhaar IDs, PAN credential names, or grievance statements to third-party endpoints. All administrative forms you complete here remain safely localized to your current browser memory sandbox.</p>

                  <h4 className="font-extrabold text-[13px] text-stone-850 pt-2 border-b border-stone-150 pb-1">2. Google AdSense Cookie Requirements</h4>
                  <p>Our advertising monetization partners, including Google AdSense, utilize third-party files called cookies to monitor visitor activity. Google's use of advertising cookies enables it and its partners to serve targeted ads to users based on their visit to SewaNadu and/or other sites on the Internet.</p>
                  <p>Specifically, Google employs the DoubleClick DART Tracking Cookie. Citizens may choose to opt-out of the use of the DART cookie by visiting the official Google Ad and Content Network Privacy Policy.</p>

                  <h4 className="font-extrabold text-[13px] text-stone-850 pt-2 border-b border-stone-150 pb-1">3. Indian Data Protection Compliance</h4>
                  <p>This policy complies with standard Indian Ministry of Electronics AND Information Technology (MeitY) directives and General Data Protection regulations. For any inquiries regarding personal safety or credential verification, please review our official contact support channels.</p>
                </>
              )}

              {policyModal === "terms" && (
                <>
                  <p className="text-stone-500 italic pb-2">Last Modified: June 13, 2026. Effective immediately in all states and union territories.</p>

                  <h4 className="font-extrabold text-[13px] text-stone-850 pt-2 border-b border-stone-150 pb-1">1. Permitted Public Utilization</h4>
                  <p>Welcome to SewaNadu. The e-Sewa gateway serves citizen subvention searches, eligibility comparison metrics, and simulated government certificate tracking. These items are produced for education, training, and direct general civic welfare awareness. Usage of this portal for automated scanning or malicious data crawling is strictly prohibited.</p>

                  <h4 className="font-extrabold text-[13px] text-stone-850 pt-2 border-b border-stone-150 pb-1">2. Simulated Approvals Liability Disclaimer</h4>
                  <p>Administrative approvals (e.g., "SDO Revenue Officers Verification Signed") completed via simulated triggers are educational and sandbox-confined. Real-world e-Seva certificates, Aadhaar linking, and PM-AWAS subventions must be lodged directly at physical Common Service Centers (CSC) in your respective municipal district in accordance with sequential bureaucratic criteria.</p>

                  <h4 className="font-extrabold text-[13px] text-stone-850 pt-2 border-b border-stone-150 pb-1">3. Financial Advice Disclaimer</h4>
                  <p>This portal lists state subventions, sub-category ratios, and estimated processing timelines. Although we update criteria to match state gazettes, real-time rates may vary. Citizens should check state gazettes before allocating capital based on compare/eligibility calculators.</p>
                </>
              )}

              {policyModal === "cookie" && (
                <>
                  <div className="p-3 bg-amber-50/70 border border-amber-150 rounded-2xl text-amber-850 space-y-1 font-normal">
                    <p className="font-extrabold">🍪 Cookie Consent Agreement Banner Compliance</p>
                    <p className="text-[11px]">We value transparency. By navigating the Indian national gateway, you consent to essential localStorage preferences and AdSense campaign cookies.</p>
                  </div>

                  <h4 className="font-bold text-[13px] text-stone-850 pt-2 border-b border-stone-150 pb-1">1. Essential Preference Cookies</h4>
                  <p>We use local memory variables including <strong>eseva_language</strong> to store your chosen Indian script, allowing the portal to load your preferred language context automatically on repeat visits.</p>

                  <h4 className="font-bold text-[13px] text-stone-850 pt-2 border-b border-stone-150 pb-1">2. Google AdSense Partner Cookies</h4>
                  <p>Google, as a third-party vendor, uses cookies to serve ads on SewaNadu. Google's use of the DoubleClick DART cookie enables it and its partners to serve ads based on your browser history on other internet domains.</p>
                  <p>You can manage your advertising preferences by checking the ad preferences panel inside your Google Account setup screen.</p>
                </>
              )}

              {policyModal === "about" && (
                <>
                  <h4 className="font-extrabold text-[13px] text-stone-850 pt-2 border-b border-stone-150 pb-1">Connecting Citizens across 28 States and 8 Union Territories</h4>
                  <p>SewaNadu is India's leading unified citizen e-services directory simulation. Our mission is to bridge the gap between state ministries and daily citizens by presenting standard document pre-requisites, eligibility rules, and CPGRAMS feedback desking in a clear, language-agnostic mobile-responsive layout.</p>
                  <p>By offering all 11 Indian languages, we promote universal data accessibility as outlined by the Digital India framework. Thank you for utilizing the national portal.</p>
                  
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-stone-150/80 space-y-2 mt-4">
                    <div className="font-bold text-stone-800 text-[11px] uppercase tracking-wider font-mono">Administrative Contact Nodes:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] text-stone-605">
                      <div>
                        <strong>MeitY Office:</strong> New Delhi, India
                      </div>
                      <div>
                        <strong>Email Helpline:</strong> feedback-setu@nic.in
                      </div>
                      <div>
                        <strong>CSC E-Governance:</strong> 011-24301100
                      </div>
                      <div>
                        <strong>System Status:</strong> Unified Active Node
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Modal footer closing controllers */}
            <div className="px-6 py-4.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-stone-450 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-650" />
                SECURE ENDPOINT CERTIFICATION
              </div>
              
              <button
                onClick={() => setPolicyModal(null)}
                className="px-5 py-1.5 bg-neutral-900 hover:bg-neutral-850 text-white font-extrabold text-xs rounded-xl transition cursor-pointer"
              >
                Accept and Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4c. Centered Overlay Search Modal for Mobile screens */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs select-none"
            id="mobile-search-modal-backdrop"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-stone-200 p-5 space-y-4"
              id="mobile-search-modal-content"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-display font-extrabold text-stone-900">
                    {language === "hi" ? "ई-सेवाएं खोजें" : "Search e-Services"}
                  </h3>
                  <p className="text-[10px] text-stone-500 font-medium">
                    {language === "hi" ? "त्वरित लोक कल्याणकारी योजनाएं" : "Quick welfare scheme directory search"}
                  </p>
                </div>
                <button 
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="p-1 px-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 font-bold text-xs cursor-pointer transition border-0 outline-none"
                  id="close-mobile-search-btn"
                >
                  ✕
                </button>
              </div>

              {/* Input Box */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input 
                    type="text"
                    autoFocus
                    placeholder={language === "hi" ? "प्रमाण-पत्र, यूआईडीएआई, आयुष्मान..." : "Search Caste, Income, UIDAI..."}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setActiveTab("services");
                      setSelectedService(null);
                    }}
                    className="w-full bg-stone-50 border border-stone-250 py-3 pl-10 pr-10 rounded-2xl text-xs font-sans outline-none focus:border-brand-coral focus:bg-white focus:ring-1 focus:ring-brand-coral/20 transition text-stone-850"
                    id="mobile-search-input-field"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 transition cursor-pointer border-0 bg-transparent outline-none"
                      id="clear-mobile-search-input"
                    >
                      <span className="text-xs font-bold">✕</span>
                    </button>
                  )}
                </div>
                <VoiceSearch
                  currentLanguage={language}
                  onSpeechResult={(text) => {
                    setSearchQuery(text);
                    setActiveTab("services");
                    setSelectedService(null);
                  }}
                  triggerToast={triggerToast}
                  className="py-3 px-3 rounded-2xl shrink-0"
                  iconSize={16}
                />
              </div>

              {/* Autocomplete suggestions inside mobile modal */}
              {searchQuery.trim().length > 0 && getAutoSuggestions().length > 0 && (
                <div className="space-y-1 p-1 max-h-48 overflow-y-auto border border-stone-200/60 rounded-2xl bg-stone-50 select-none animate-fadeIn transition-all">
                  <p className="text-[8.5px] font-mono text-stone-450 uppercase tracking-wider font-extrabold px-2.5 py-1.5 bg-white border-b border-stone-150 rounded-t-xl sticky top-0 flex items-center justify-between">
                    <span>{language === "hi" ? "त्वरित परिणाम:" : "Matching Services:"}</span>
                    <span className="text-[7.5px] font-bold text-brand-coral opacity-80 uppercase font-mono">Found {getAutoSuggestions().length}</span>
                  </p>
                  <div className="divide-y divide-stone-100 bg-white rounded-b-xl overflow-hidden">
                    {getAutoSuggestions().slice(0, 4).map((service) => {
                      const sTrans = translateService(service);
                      return (
                        <button
                          key={service.id}
                          onClick={() => {
                            setActiveTab("services");
                            setActiveDossier(service);
                            setSearchQuery("");
                            setIsMobileSearchOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-amber-500/10 flex flex-col gap-0.5 transition cursor-pointer text-stone-850 border-0 outline-none"
                        >
                          <span className="text-[10px] font-extrabold text-stone-900 leading-tight">
                            {sTrans.title}
                          </span>
                          <span className="text-[8px] font-mono text-stone-450 uppercase font-medium">
                            {sTrans.department}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Suggestion Chips */}
              <div className="space-y-2">
                <p className="text-[9px] font-mono text-stone-450 uppercase tracking-wider font-bold">
                  {language === "hi" ? "लोकप्रिय खोजें:" : "Popular Searches:"}
                </p>
                <div className="flex flex-wrap gap-1.5" id="mobile-search-suggestions">
                  {[
                    { en: "Aadhaar", hi: "आधार" },
                    { en: "Ayushman", hi: "आयुष्मान" },
                    { en: "PAN ID", hi: "पैन आईडी" },
                    { en: "Caste", hi: "जाति" },
                    { en: "Income", hi: "आय" },
                    { en: "e-Shram", hi: "ई-श्रम" }
                  ].map((chip) => {
                    const label = language === "hi" ? chip.hi : chip.en;
                    const isActive = searchQuery.toLowerCase() === chip.en.toLowerCase() || searchQuery === chip.hi;
                    return (
                      <button
                        key={chip.en}
                        onClick={() => {
                          setSearchQuery(chip.en);
                          setActiveTab("services");
                          setSelectedService(null);
                        }}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                          isActive
                            ? "bg-brand-coral/10 text-brand-coral border-brand-coral/30"
                            : "bg-stone-50 border-stone-200 text-stone-605 hover:bg-stone-100"
                        }`}
                        id={`mob-search-chip-${chip.en.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit / Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="w-full py-2.5 bg-gradient-to-r from-brand-coral to-orange-500 hover:from-orange-500 hover:to-brand-coral text-white font-sans font-extrabold text-xs rounded-2xl shadow-sm transition active:scale-95 cursor-pointer text-center border-0 outline-none"
                  id="mobile-search-view-btn"
                >
                  {language === "hi" ? "सक्रिय सेवाएं देखें" : "View Services Tab"}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 11. Portal Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fadeIn" id="portal-feedback-modal">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden flex flex-col animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between relative">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-400 via-white to-emerald-500"></div>
              
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                <h3 className="font-display font-bold text-sm text-stone-900">
                  {feedbackService 
                    ? (language === "hi" ? `${feedbackService.title} फ़ीडबैक` : `Feedback: ${feedbackService.title}`)
                    : (language === "hi" ? "SewaNadu पोर्टल फ़ीडबैक" : "SewaNadu Portal Feedback")
                  }
                </h3>
              </div>

              <button 
                type="button"
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedbackService(null);
                }}
                className="p-1 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-[11px] rounded-lg cursor-pointer transition"
              >
                Close
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSendFeedback} className="p-6 space-y-4 text-xs font-sans text-stone-650 leading-relaxed">
              <div className="text-center space-y-2">
                <h4 className="font-bold text-sm text-stone-800">
                  {feedbackService 
                    ? (language === "hi" ? `इस योजना के लिए आपका अनुभव कैसा रहा?` : `How was your experience checking this service?`)
                    : (language === "hi" ? "इस पोर्टल पर आपका अनुभव कैसा रहा?" : "How was your experience using our digital gateway?")
                  }
                </h4>
                <p className="text-[11px] text-stone-500">
                  {feedbackService
                    ? (language === "hi" ? "आपकी प्रतिक्रिया से हमें इस सेवा के दिशानिर्देशों को और स्पष्ट करने में सहायता मिलेगी।" : "Your rating helps us ensure the checklist and guidelines for this document remain accurate.")
                    : (language === "hi" ? "आपकी प्रतिक्रिया से हमें इस राष्ट्रीय सुविधा को और बेहतर बनाने में मदद मिलेगी।" : "Your rating helps us improve this national digital bridge for all citizens.")
                  }
                </p>
              </div>

              {/* Star Rating Selector */}
              <div className="flex justify-center items-center gap-2 py-3">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = feedbackRating >= starValue;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setFeedbackRating(starValue)}
                      className="cursor-pointer group hover:scale-110 active:scale-95 transition duration-150 p-1 bg-transparent border-0"
                      title={`${starValue} Star${starValue > 1 ? 's' : ''}`}
                    >
                      <Star 
                        className={`w-8 h-8 transition-colors duration-200 ${
                          isFilled 
                            ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]" 
                            : "text-stone-300 group-hover:text-amber-305"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Rating numeric label */}
              {feedbackRating > 0 && (
                <div className="text-center font-bold text-amber-650 text-[11px] font-mono select-none">
                  {feedbackRating === 1 && (language === "hi" ? "1 तारा • सुधार की आवश्यकता है" : "1 Star • Needs Improvements")}
                  {feedbackRating === 2 && (language === "hi" ? "2 तारे • निष्पक्ष" : "2 Stars • Fair")}
                  {feedbackRating === 3 && (language === "hi" ? "3 तारे • अच्छा" : "3 Stars • Good")}
                  {feedbackRating === 4 && (language === "hi" ? "4 तारे • बहुत अच्छा" : "4 Stars • Very Good")}
                  {feedbackRating === 5 && (language === "hi" ? "5 तारे • उत्कृष्ट सेवा" : "5 Stars • Excellent Utility")}
                </div>
              )}

              {/* Feedback comment input field */}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase font-mono tracking-wider text-stone-550 select-none">
                  {language === "hi" ? "कोई अतिरिक्त टिप्पणी (वैकल्पिक)" : "Any additional comments? (Optional)"}
                </label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  maxLength={300}
                  rows={3}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-amber-550 focus:border-amber-550 font-sans text-xs text-stone-800 placeholder-stone-400 outline-none resize-none transition"
                  placeholder={language === "hi" ? "सेवा, गति या संवर्द्धन के संबंध में अपने अनुभव साझा करें..." : "Share thoughts on the speed, services, layout, or translation correctness..."}
                ></textarea>
                <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                  <span>{language === "hi" ? "अधिकतम 300 वर्ण" : "Max 300 characters"}</span>
                  <span>{feedbackComment.length}/300</span>
                </div>
              </div>

              {/* Actions submit and cancel buttons */}
              <div className="pt-3 border-t border-stone-150 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setFeedbackRating(0);
                    setFeedbackComment("");
                    setFeedbackService(null);
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition cursor-pointer select-none"
                  disabled={submittingFeedback}
                >
                  {language === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-5 py-2 bg-neutral-900 hover:bg-neutral-850 text-white font-extrabold text-xs rounded-xl transition cursor-pointer select-none flex items-center gap-1.5 shadow-sm disabled:opacity-50 border-0"
                >
                  {submittingFeedback ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                      <span>{language === "hi" ? "भेजा जा रहा है..." : "Submitting..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === "hi" ? "प्रतिक्रिया भेजें" : "Submit Feedback"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 11-B. Developer Issue Report Modal */}
      {showReportModal && reportService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fadeIn" id="service-report-modal">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden flex flex-col animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between relative">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 via-rose-450 to-orange-450"></div>
              
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <h3 className="font-display font-bold text-sm text-stone-900 leading-tight">
                  {language === "hi" ? "त्रुटि रिपोर्ट: " : "Report Issue: "}{reportService.title}
                </h3>
              </div>

              <button 
                type="button"
                onClick={() => {
                  setShowReportModal(false);
                  setReportService(null);
                }}
                className="p-1 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-[11px] rounded-lg cursor-pointer transition select-none"
              >
                {language === "hi" ? "बंद करें" : "Close"}
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSendReport} className="p-6 space-y-4 text-xs font-sans text-stone-650 leading-relaxed">
              <div className="space-y-1.5">
                <p className="text-[11px] text-stone-500">
                  {language === "hi" 
                    ? "क्या आपको कोई गलत जानकारी, पुरानी शासकीय फ़ीस, या टूटा हुआ लिंक मिला है? डेवलपर टीम को सीधे सचेत करने के लिए कृपया नीचे विवरण भरें।" 
                    : "Found incorrect guidelines, outdated government fees, or a broken external redirection link? Fill in the details below to flag this directly to our developer team."}
                </p>
              </div>

              {/* Problem Group selector */}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase font-mono tracking-wider text-stone-550 select-none">
                  {language === "hi" ? "समस्या का प्रकार" : "Issue Category"}
                </label>
                <select
                  value={reportIssueType}
                  onChange={(e) => setReportIssueType(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-red-500 focus:border-red-500 font-sans text-xs text-stone-855 outline-none transition"
                >
                  <option value="incorrect_info">{language === "hi" ? "गलत जानकारी / दस्तावेज सूची" : "Incorrect required paperwork/guidelines"}</option>
                  <option value="broken_link">{language === "hi" ? "टूटी हुई लिंक / अमान्य पुनर्निर्देशन" : "Broken redirection link"}</option>
                  <option value="outdated_fees">{language === "hi" ? "पुरानी या गलत सरकारी फीस" : "Outdated processing fees"}</option>
                  <option value="wrong_department">{language === "hi" ? "गलत सरकारी विभाग / विभाग संबद्धता" : "Inaccurate government department"}</option>
                  <option value="other">{language === "hi" ? "अन्य तकनीकी / विवरण त्रुटियां" : "Other layout or detail errors"}</option>
                </select>
              </div>

              {/* Details comment input field */}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase font-mono tracking-wider text-stone-550 select-none">
                  {language === "hi" ? "समस्या का सटीक विवरण" : "Describe the details"}
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  maxLength={500}
                  rows={4}
                  required
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-rose-500 focus:border-rose-500 font-sans text-xs text-stone-800 placeholder-stone-400 outline-none resize-none transition"
                  placeholder={
                    language === "hi" 
                      ? "कृप्या सटीक समस्या बताएं (मसलन: 'कार्ड रिन्यू करने की सरकारी फीस ₹50 नहीं अब ₹100 हो गई है।' या 'अप्लाई लिंक खुलने के बजाय वेबपेज नॉट फाउंड बता रहा है।')" 
                      : "Provide exact specifics (e.g., 'The processing fee is listed as ₹50 but the latest notification says ₹110' or 'The link for step 3 returns a 404 page.')"
                  }
                ></textarea>
                <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                  <span>{language === "hi" ? "अधिकतम 500 वर्ण" : "Max 500 characters"}</span>
                  <span>{reportDetails.length}/500</span>
                </div>
              </div>

              {/* Citizen Contact Email Info */}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase font-mono tracking-wider text-stone-550 select-none">
                  {language === "hi" ? "आपका ईमेल पता (वैकल्पिक)" : "Your Contact Email (Optional)"}
                </label>
                <input
                  type="email"
                  value={reportEmail}
                  onChange={(e) => setReportEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-rose-500 focus:border-rose-500 font-sans text-xs text-stone-800 outline-none transition"
                />
                <span className="text-[9px] text-stone-400 block font-mono select-none font-sans">
                  {language === "hi" ? "उपयोगी ताकि डेवलपर समस्या सुलझने पर आपसे संपर्क कर सकें" : "Used to contact you once the issue is resolved by our developers"}
                </span>
              </div>

              {/* Actions submit and cancel buttons */}
              <div className="pt-3 border-t border-stone-150 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    setReportDetails("");
                    setReportService(null);
                  }}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition cursor-pointer select-none"
                  disabled={submittingReport}
                >
                  {language === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl transition cursor-pointer select-none flex items-center gap-1.5 shadow-sm disabled:opacity-50 border-0"
                >
                  {submittingReport ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                      <span>{language === "hi" ? "भेजा जा रहा है..." : "Submitting..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === "hi" ? "रिपोर्ट भेजें" : "Submit Report"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 10. Floating Browser Notification Toast Simulation Layer */}
      <div 
        className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 max-w-sm w-[calc(100vw-3rem)] pointer-events-none" 
        id="browser-notification-tray"
      >
        {activeSystemNotifications && activeSystemNotifications.map((noti) => (
          <div
            key={noti.id}
            className="pointer-events-auto bg-stone-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-stone-850 text-white flex flex-col gap-2 relative animate-slideIn transition-all duration-300 hover:scale-[1.02] hover:bg-stone-900"
          >
            {/* Header / Meta bar: Mimicking standard Chrome/Mac Notification layout */}
            <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono tracking-wide border-b border-stone-800/80 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                <span className="font-extrabold uppercase leading-none text-stone-200">
                  {language === "hi" ? "🔔 क्रोम • सिस्टम सूचना" : "🔔 Chrome • System Alert"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>{noti.appName}</span>
                <span>•</span>
                <span>{noti.receivedAt}</span>
              </div>
            </div>

            {/* Notification Core Content */}
            <div className="flex items-start gap-3 pt-1">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center shrink-0">
                <BellRing className="w-5 h-5 text-orange-400 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-stone-50 font-sans tracking-tight">
                  {noti.title}
                </h4>
                <p className="text-[10.5px] text-stone-300 leading-normal font-sans text-left">
                  {noti.body}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800/40 mt-1">
              <button
                onClick={() => {
                  // Action: Switch to Services tab, clear selected service, close the launcher, and dismiss notification
                  setActiveTab("services");
                  setSelectedService(null);
                  if (showLauncher) setShowLauncher(false);
                  setActiveSystemNotifications(prev => prev.filter(n => n.id !== noti.id));
                  triggerToast(
                    language === "hi" 
                      ? "सेवा गेटवे सक्रिय! आपके आवेदनों की लाइव स्थिति देखने के लिए धन्यवाद।" 
                      : "E-services active! Live status of applications updated successfully.",
                    "success"
                  );
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10.5px] rounded-lg transition cursor-pointer select-none"
              >
                📂 {language === "hi" ? "दर्ज आवेदन देखें" : "View Applications"}
              </button>
              
              <button
                onClick={() => {
                  setActiveSystemNotifications(prev => prev.filter(n => n.id !== noti.id));
                }}
                className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-750 text-stone-300 font-bold text-[10.5px] rounded-lg transition cursor-pointer select-none border border-stone-700"
              >
                {language === "hi" ? "खारिज करें" : "Dismiss"}
              </button>
            </div>

            {/* Micro Top Slide Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600 rounded-t-2xl"></div>
          </div>
        ))}
      </div>

      {/* Saved Services Drawer Sidebar overlay */}
      <SavedServices
        isOpen={isSavedServicesOpen}
        onClose={() => setIsSavedServicesOpen(false)}
        savedServiceIds={savedServiceIds}
        services={services}
        onToggleSave={handleToggleSave}
        onSelectService={(service) => {
          setActiveDossier(service);
          setActiveTab("services");
        }}
        language={language}
      />

      {/* 12. Terms Compliance Disclaimer Popup (Independency declaration) */}
      <AnimatePresence>
        {showSewaNaduDisclaimer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-22 md:bottom-6 left-4 md:left-6 max-w-sm w-[calc(100vw-2rem)] md:w-96 z-[9999] bg-stone-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-stone-800 dark:border-slate-800/80 flex flex-col gap-2.5 text-left pointer-events-auto"
            id="sewanadu-compliance-disclaimer"
          >
            {/* Disclaimer Header */}
            <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <h4 className="text-[11px] font-sans font-extrabold uppercase tracking-wide text-stone-150">
                {language === "hi" ? "महत्वपूर्ण अस्वीकरण (Disclaimer)" : "Important Compliance Advisory"}
              </h4>
            </div>

            {/* Disclaimer Text */}
            <div className="space-y-1.5 text-left">
              <p className="text-[11.5px] text-stone-300 leading-relaxed font-sans">
                {language === "hi" 
                  ? "SewaNadu एक स्वतंत्र, गैर-सरकारी संदर्भ निर्देशिका है। हम शैक्षिक उद्देश्यों के लिए आधिकारिक सरकारी योजनाओं की पात्रता, आवश्यक दस्तावेज एवं आधिकारिक लिंक प्रदान करते हैं। हमारा किसी सरकारी संस्था या विभाग से कोई संबंध या आधिकारिक संबद्धता नहीं है।"
                  : "SewaNadu is an independent, non-governmental directory and citizen guidebook. We provide public references, general eligibility checklists, and direct links to official government portals. This portal is not affiliated with, endorsed by, or representing any government agency."}
              </p>
            </div>

            {/* Disclaimer Action Button */}
            <div className="flex items-center justify-between pt-1 border-t border-stone-800/60">
              <span className="text-[9px] font-mono text-stone-500 uppercase">INDEPENDENT GUIDE</span>
              <button
                onClick={() => setShowSewaNaduDisclaimer(false)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-sans font-extrabold text-[10.5px] rounded-lg transition-all active:scale-95 cursor-pointer leading-none"
              >
                {language === "hi" ? "ठीक है, समझा" : "I Understand"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 13. Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 15 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            title={language === "hi" ? "ऊपर जाएं" : "Back to Top"}
            className="fixed bottom-35 right-4 md:bottom-6 md:right-6 z-[9999] p-3 md:p-3.5 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-neutral-950 shadow-xl border border-stone-800 dark:border-amber-400/30 flex items-center justify-center cursor-pointer transition-colors duration-200 group"
            id="back-to-top-button"
          >
            <ArrowUp className="w-5 h-5 md:w-5.5 md:h-5.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 14. RTI Simulation & Application Tracking Modals */}
      <AnimatePresence>
        {isRtiOpen && (
          <RtiFilingModal
            isOpen={isRtiOpen}
            onClose={() => setIsRtiOpen(false)}
            language={language}
            triggerToast={triggerToast}
          />
        )}
        {isStatusCheckOpen && (
          <StatusCheckModal
            isOpen={isStatusCheckOpen}
            onClose={() => setIsStatusCheckOpen(false)}
            language={language}
            triggerToast={triggerToast}
          />
        )}
      </AnimatePresence>

      {/* 15. Regulatory Compliance & Policy Consent Overlay Dialog */}
      <ConsentDialog
        isOpen={!hasConsentAccepted}
        language={language}
        onAccept={() => {
          try {
            localStorage.setItem("sewanadu_legal_consent_accepted", "true");
          } catch (e) {
            console.error(e);
          }
          setHasConsentAccepted(true);
          triggerToast(
            language === "hi" 
              ? "गोपनीयता, नियम, कुकी नीति और कानूनी अस्वीकरण की शर्तें स्वीकार कर ली गई हैं।" 
              : "All policies, conditions, cookies, and legal disclaimers accepted successfully.", 
            "success"
          );
        }}
        onViewPolicy={(policy) => {
          setActiveTab("legal-hub");
          setLegalHubDefaultSection(policy);
          // Wait briefly, then scroll to top of viewport
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 80);
        }}
      />

      {/* 16. Cookie consent banner (granular opt-in) */}
      <CookieConsentBanner
        language={language}
        onSaved={(c) =>
          triggerToast(
            language === "hi"
              ? `कुकी प्राथमिकताएँ सहेजी गईं (विश्लेषण: ${c.analytics ? "चालू" : "बंद"}, विज्ञापन: ${c.advertising ? "चालू" : "बंद"})।`
              : `Cookie preferences saved (Analytics: ${c.analytics ? "on" : "off"}, Ads: ${c.advertising ? "on" : "off"}).`,
            "success"
          )
        }
      />

    </div>
  );
}
