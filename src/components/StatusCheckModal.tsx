import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Search, Sparkles, ClipboardCheck, Clock, CheckCircle2, 
  UserCheck, HeartHandshake, AlertTriangle, ChevronRight, HelpCircle 
} from "lucide-react";

interface StatusCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  triggerToast: (msg: string, type?: "success" | "info" | "error") => void;
}

interface ApplicationStatus {
  ref: string;
  title: string;
  department: string;
  applicant: string;
  category: "RTI" | "CERTIFICATE" | "SUBSIDY";
  submissionDate: string;
  progressPercent: number;
  currentMilestoneIndex: number;
  stages: {
    titleEn: string;
    titleHi: string;
    descEn: string;
    descHi: string;
    completed: boolean;
    date?: string;
    officer?: string;
  }[];
}

const STATIC_SAMPLERS: Record<string, ApplicationStatus> = {
  "SEWA-REVENUE-2026-77A": {
    ref: "SEWA-REVENUE-2026-77A",
    title: "Caste & Income Certificate",
    department: "State Revenue Administration Department",
    applicant: "Kumar Viswanathan",
    category: "CERTIFICATE",
    submissionDate: "June 10, 2026",
    progressPercent: 50,
    currentMilestoneIndex: 1,
    stages: [
      { titleEn: "Application Submitted", titleHi: "आवेदन प्राप्त हुआ", descEn: "Demographics filed and encrypted on state nodes.", descHi: "जनसांख्यिकी विवरण दर्ज किया गया और जिला सर्वर पर भेजा गया।", completed: true, date: "June 10, 2026 11:30 AM" },
      { titleEn: "Assigned to Circle Revenue Officer", titleHi: "राजस्व निरीक्षक समीक्षा", descEn: "SDM designated Circle Officer Rajesh Sharma for assessment.", descHi: "अधिकारी राजेश शर्मा को भौतिक व पात्रता दस्तावेजों की समीक्षा सौंपी गई।", completed: true, date: "June 12, 2026 04:15 PM", officer: "Rajesh Sharma (Circle Revenue Inspector)" },
      { titleEn: "Field Inquiry or Asset Check", titleHi: "क्षेत्रीय जांच / सत्यापन", descEn: "Verification of household land holding ledger limits under process.", descHi: "पारिवारिक आय तथा भूमि धारण विवरण का सत्यापन किया जा रहा है।", completed: false },
      { titleEn: "Digitally Signed Certificate Issued", titleHi: "प्रमाण पत्र जारी हुआ", descEn: "Secured asymmetric key seal attached for direct download.", descHi: "डिजिटल हस्ताक्षर युक्त प्रमाण पत्र डाउनलोड और डिजीलॉकर हेतु सहेजें।", completed: false }
    ]
  },
  "SEWA-MORT-2026-88B": {
    ref: "SEWA-MORT-2026-88B",
    title: "Learner's Driving Licence (RTO)",
    department: "Ministry of Road Transport and Highways (MoRTH)",
    applicant: "Ananya Iyer",
    category: "CERTIFICATE",
    submissionDate: "June 08, 2026",
    progressPercent: 75,
    currentMilestoneIndex: 2,
    stages: [
      { titleEn: "Enrollment Registered", titleHi: "पंजीकरण दर्ज हुआ", descEn: "Aadhaar e-KYC verified; fees of ₹250 accepted.", descHi: "आधार ई-केवाईसी सत्यापित; ₹250 का शुल्क स्वीकार किया गया।", completed: true, date: "June 08, 2026 09:12 AM" },
      { titleEn: "Medical Self-Cert Clearance", titleHi: "चिकित्सा प्रमाण पत्र स्वीकृति", descEn: "Self declaration fitness form cleared by motor licensing authority.", descHi: "परिवहन प्राधिकरण द्वारा चिकित्सा फिटनेस स्व-घोषणा स्वीकृत की गई।", completed: true, date: "June 08, 2026 10:45 AM", officer: "Dr. Sandip Roy (Certified MD)" },
      { titleEn: "Slot Selected / Evaluation Scheduled", titleHi: "आरटीओ वाहन परीक्षण स्लॉट", descEn: "Computer test cleared. Live driving assessment booked for June 22.", descHi: "प्रारंभिक कंप्यूटर परीक्षा उत्तीर्ण। सड़क परीक्षण 22 जून हेतु आरक्षित।", completed: true, date: "June 11, 2026 02:00 PM" },
      { titleEn: "Approved & licence Dispatched", titleHi: "लाइसेंस स्वीकृत और प्रेषित", descEn: "Hardcopy card will be delivered by Speed Post with tracking.", descHi: "डाक स्पीड पोस्ट विवरण के साथ भौतिक कार्ड घर भेज दिया जाएगा।", completed: false }
    ]
  },
  "SEWA-UID-2026-55C": {
    ref: "SEWA-UID-2026-55C",
    title: "Aadhaar Card Demographics Update",
    department: "Unique Identification Authority of India (UIDAI)",
    applicant: "Pooja Deshmukh",
    category: "CERTIFICATE",
    submissionDate: "June 15, 2026",
    progressPercent: 25,
    currentMilestoneIndex: 0,
    stages: [
      { titleEn: "Request Registered (Update Portal)", titleHi: "संशोधन अनुरोध प्राप्त", descEn: "Address validation rent lease submitted online.", descHi: "ऑनलाइन पता सत्यापन किरायानामा विवरण जमा किया गया।", completed: true, date: "June 15, 2026 08:30 PM" },
      { titleEn: "UIDAI Data Validation", titleHi: "यूआईडीएआई डेटा जांच", descEn: "Verifying rent receipt signature match against regional property registry.", descHi: "संपत्ति रजिस्ट्री से किराया रसीद मिलान तथा पते की प्रामाणिकता जांच जारी।", completed: false },
      { titleEn: "Biometric Consensus Check", titleHi: "बायोमेट्रिक मिलान निरूपण", descEn: "Validating thumb impressions matching the original enrollment registry.", descHi: "मूल पंजीकरण फिंगरप्रिंट तथा बायोमेट्रिक रिकॉर्ड से सुरक्षा समीक्षा।", completed: false },
      { titleEn: "Aadhaar XML Record Updated", titleHi: "डेटाबेस अपडेट सफल", descEn: "New EAadhaar letter PDF available via instant digital OTP retrieval.", descHi: "सत्यापित संशोधित नया ई-आधार वेब डाउनलोड हेतु उपलब्ध।", completed: false }
    ]
  }
};

export default function StatusCheckModal({
  isOpen,
  onClose,
  language,
  triggerToast
}: StatusCheckModalProps) {
  const [searchRef, setSearchRef] = useState("");
  const [currentApp, setCurrentApp] = useState<ApplicationStatus | null>(null);
  const [localRtis, setLocalRtis] = useState<any[]>([]);
  const [localApps, setLocalApps] = useState<any[]>([]);
  const [isEscalating, setIsEscalating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem("sewanadu_rtis");
        if (stored) {
          setLocalRtis(JSON.parse(stored));
        }
        const storedApps = localStorage.getItem("sewanadu_applications");
        if (storedApps) {
          setLocalApps(JSON.parse(storedApps));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isHi = language === "hi";

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanRef = searchRef.trim().toUpperCase();
    if (!cleanRef) {
      triggerToast(isHi ? "कृपया संदर्भांक या नाम खोजें!" : "Please enter a valid application reference!", "error");
      return;
    }

    // 1. Check static samplers
    if (STATIC_SAMPLERS[cleanRef]) {
      setCurrentApp(STATIC_SAMPLERS[cleanRef]);
      triggerToast(isHi ? "आवेदन विवरण मिल गया।" : "Application record loaded.", "success");
      return;
    }

    // 2. Check local RTI filings
    const matchedRti = localRtis.find(r => r.id.toUpperCase() === cleanRef);
    if (matchedRti) {
      // Map local RTI object onto full status structure
      const formattedApp: ApplicationStatus = {
        ref: matchedRti.id,
        title: `RTI: ${matchedRti.query.slice(0, 35)}...`,
        department: matchedRti.auth.toUpperCase() + " Department Office",
        applicant: matchedRti.name,
        category: "RTI",
        submissionDate: matchedRti.date.split(",")[0],
        progressPercent: matchedRti.feesPaid === 0 ? 50 : 25,
        currentMilestoneIndex: matchedRti.feesPaid === 0 ? 1 : 0,
        stages: [
          { 
            titleEn: "RTI Request Filed", 
            titleHi: "RTI आवेदन प्राप्त हुआ", 
            descEn: "Form registered securely. Fees validation successful.", 
            descHi: "सूचना का अधिकार आवेदन सुरक्षित रूप से दर्ज। शुल्क पुष्टि सफल।", 
            completed: true, 
            date: matchedRti.date 
          },
          { 
            titleEn: "Assigned to Public Information Officer (PIO)", 
            titleHi: "लोक सूचना अधिकारी (PIO) नियुक्त", 
            descEn: "Assigned to nodal officer representing authority board under Sec 5(1).", 
            descHi: "लोक प्राधिकारी बोर्ड के सक्षम अधिकारी को समीक्षा हेतु सुपुर्द।", 
            completed: matchedRti.feesPaid === 0, 
            date: matchedRti.feesPaid === 0 ? matchedRti.date : undefined,
            officer: "Officer K.L. Nair (CPIO Nodal Node)" 
          },
          { 
            titleEn: "Information Harvesting", 
            titleHi: "संबंधित प्रभाग से सूचना का संकलन", 
            descEn: "Preparing official documentation files as solicited.", 
            descHi: "मांगे गए दस्तावेजों का संकलन एवं विभागीय कार्यालय से निकासी जारी।", 
            completed: false 
          },
          { 
            titleEn: "Information Despatch Issued", 
            titleHi: "सूचना का निपटान पूरा", 
            descEn: "Response uploaded digitally. Copy sent via registered speed post.", 
            descHi: "आरटीआई प्रत्युत्तर वेब-पोर्टल पर अपलोड तथा पंजीकृत डाक द्वारा प्रेषित।", 
            completed: false 
          }
        ]
      };
      setCurrentApp(formattedApp);
      triggerToast(isHi ? "आपकी हाल ही में दर्ज RTI मिल गई!" : "Your matching RTI record has been loaded!", "success");
      return;
    }

    // 3. Check local service applications
    const matchedApp = localApps.find(app => app.ref.toUpperCase() === cleanRef);
    if (matchedApp) {
      setCurrentApp(matchedApp);
      triggerToast(isHi ? "आपका सेवा आवेदन विवरण मिल गया!" : "Your matching service application record has been loaded!", "success");
      return;
    }

    triggerToast(
      isHi 
        ? "कोई आवेदन नहीं मिला। कृपया नमूना संदर्भों में से किसी एक पर क्लिक करें।" 
        : "No active reference found. Try clicking one of the interactive sample cards below.", 
      "info"
    );
  };

  const handleSelectSample = (refKey: string) => {
    setSearchRef(refKey);
    setTimeout(() => {
      if (STATIC_SAMPLERS[refKey]) {
        setCurrentApp(STATIC_SAMPLERS[refKey]);
        triggerToast(isHi ? "नमूना रिकॉर्ड लोड हुआ।" : "Sample record loaded successfully.", "success");
      }
    }, 50);
  };

  const handleSpeedUpApp = () => {
    if (!currentApp) return;
    setIsEscalating(true);
    
    setTimeout(() => {
      setIsEscalating(false);
      // Create copy and transition all stages to complete
      const upgradedStages = currentApp.stages.map(step => ({
        ...step,
        completed: true,
        date: new Date().toLocaleString()
      }));

      const updatedApp = {
        ...currentApp,
        progressPercent: 100,
        currentMilestoneIndex: 3,
        stages: upgradedStages
      };

      setCurrentApp(updatedApp);

      // Save back to localApps if it exists
      const isLocalApp = localApps.some(app => app.ref === currentApp.ref);
      if (isLocalApp) {
        const nextApps = localApps.map(app => app.ref === currentApp.ref ? updatedApp : app);
        setLocalApps(nextApps);
        localStorage.setItem("sewanadu_applications", JSON.stringify(nextApps));
      }

      triggerToast(
        isHi 
          ? "नागरिक अपील स्वीकृत! जिला कलेक्टर न्यायालय द्वारा सीधे त्वरित अनुमोदन।" 
          : "Administrative Appeal Approved! Direct speed clearance approved by District Collector's desk.", 
        "success"
      );
    }, 2200);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/80 dark:bg-slate-950/95 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[88vh]"
        id="status-check-modal-wrapper"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-150 dark:border-stone-850 flex items-center justify-between bg-stone-50 dark:bg-stone-900/60 shrink-0 select-none">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-coral/10 rounded-xl">
              <ClipboardCheck className="w-5 h-5 text-brand-coral" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-extrabold tracking-wider bg-orange-100 dark:bg-orange-950/50 text-orange-850 dark:text-orange-400 px-1.5 py-0.5 rounded uppercase">
                {isHi ? "सत्यापन एवं ट्रैक" : "Tracking & Verification"}
              </span>
              <h3 className="font-display font-black text-sm text-stone-900 dark:text-white mt-0.5">
                {isHi ? "नागरिक सेवा आवेदन स्थिति जांच" : "National Application Tracker"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition cursor-pointer text-stone-400 hover:text-stone-700 dark:text-stone-300 border-0 bg-transparent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Tracking Search Input Form */}
          <form onSubmit={handleSearch} className="space-y-3 shrink-0">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase text-stone-500 dark:text-stone-400 font-mono tracking-wider">
                {isHi ? "आवेदन संदर्भ संख्या (REF ID) दर्ज करें" : "Enter Application Reference Number"}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={searchRef}
                    onChange={(e) => setSearchRef(e.target.value)}
                    placeholder={isHi ? "जैसे: SEWA-REVENUE-2026-77A" : "e.g. SEWA-REVENUE-2026-77A"}
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-mono border border-stone-250 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-850 dark:text-white uppercase tracking-wider focus:ring-1 focus:ring-brand-coral outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-orange-500 dark:hover:bg-orange-400 text-white dark:text-neutral-950 font-display font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer select-none"
                >
                  {isHi ? "स्थिति जांचें" : "Track Status"}
                </button>
              </div>
            </div>

            {/* Quick Helper Sample Shortcuts */}
            <div className="text-[10px] leading-relaxed text-stone-550 dark:text-stone-400">
              <span className="font-extrabold block text-stone-700 dark:text-stone-300 mb-1">
                {isHi ? "त्वरित जांच हेतु परीक्षण संदर्भ चुनें:" : "Test instantly with simulated cases:"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(STATIC_SAMPLERS).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectSample(key)}
                    className="px-2 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-450 border border-stone-200 dark:border-stone-750 text-stone-600 dark:text-stone-300 rounded font-mono text-[9px] transition cursor-pointer select-none"
                  >
                    {key} ({STATIC_SAMPLERS[key].title.split(" ")[0]})
                  </button>
                ))}

                {localRtis.map((r, idx) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectSample(r.id)}
                    className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-400 border border-amber-500/20 rounded font-mono text-[9px] transition cursor-pointer select-none"
                  >
                    {r.id} ({isHi ? "मेरी आरटीआई" : "My Filed RTI"})
                  </button>
                ))}

                {localRtis.length === 0 && (
                  <span className="text-[9.5px] text-stone-400 font-normal italic">
                    {isHi ? "(कोई हालिया RTI दर्ज नहीं है)" : "(No live RTIs filed yet. Create one via 'RTI Filing' first!)"}
                  </span>
                )}
              </div>
            </div>
          </form>

          {/* APP STATUS TIMELINE VIEW */}
          <AnimatePresence mode="wait">
            {currentApp ? (
              <motion.div
                key={currentApp.ref}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4"
              >
                {/* Visual Header of active application under check */}
                <div className="p-4 bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/15 rounded-2xl flex items-start justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono uppercase font-black text-brand-coral">
                      {currentApp.category} • REF: {currentApp.ref}
                    </span>
                    <h4 className="font-display font-black text-sm text-stone-900 dark:text-white leading-tight">
                      {currentApp.title}
                    </h4>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 font-sans">
                      {currentApp.department}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[9.5px] font-mono text-stone-450 block uppercase leading-none">
                      {isHi ? "कुल प्रगति" : "Total Progress"}
                    </span>
                    <span className="text-xl font-display font-black text-slate-900 dark:text-white block mt-1">
                      {currentApp.progressPercent}%
                    </span>
                  </div>
                </div>

                {/* Simulated Administrative Appeal Escalator Card */}
                {currentApp.progressPercent < 100 && (
                  <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-stone-850 dark:to-stone-800 border border-amber-250 dark:border-stone-750 text-stone-800 dark:text-stone-250 rounded-2xl flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                    <div className="flex-1 space-y-1">
                      <h5 className="text-[11.5px] font-sans font-extrabold text-amber-950 dark:text-amber-400">
                        {isHi ? "सुविधा: तत्काल प्रशासनिक गति बढ़ाएं" : "Escalation: Fast-Track Administrative Clearance?"}
                      </h5>
                      <p className="text-[10px] leading-relaxed text-stone-600 dark:text-stone-400">
                        {isHi 
                          ? "क्या यह समीक्षा विभाग में लंबित लग रही है? क्षेत्रीय जिला मजिस्ट्रेट अपील मंच के तहत फाइल को तत्काल बाईपास एवं अनुमोदित करने के लिए दबाएं।" 
                          : "Tired of regular bureaucratic delay? Simulate an immediate citizen appeal filing to the District Collector's desk to bypass verify this record."}
                      </p>
                      
                      <button
                        type="button"
                        onClick={handleSpeedUpApp}
                        disabled={isEscalating}
                        className="mt-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-200 text-neutral-950 text-[10px] font-black uppercase tracking-wider rounded-lg shadow-2xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1 leading-none select-none"
                      >
                        {isEscalating ? (
                          <span className="flex items-center gap-1.5 font-mono">
                            <span className="w-2.5 h-2.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></span>
                            {isHi ? "फाइल बाईपास की जा रही है..." : "Bypassing Red-Tape..."}
                          </span>
                        ) : (
                          <>
                            <HeartHandshake className="w-3 h-3 text-neutral-950" />
                            <span>{isHi ? "कलेक्टर अपील बाईपास - तत्काल स्वीकृत करें" : "DM Court Appeal - Secure Instant Approval"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Timeline Progress Line & Milestones */}
                <div className="space-y-4 pt-1">
                  <h5 className="text-[10px] font-black font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400 border-b border-stone-100 dark:border-stone-850 pb-2 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{isHi ? "लॉजिस्टिक ट्रैकिंग माइलस्टोन्स" : "Statutory Verification Milestones"}</span>
                  </h5>

                  <div className="relative pl-6 space-y-5.5">
                    {/* Vertical timeline trunk connector */}
                    <div className="absolute left-2.5 top-2.5 bottom-2.5 w-0.5 bg-stone-150 dark:bg-stone-800"></div>

                    {currentApp.stages.map((stage, idx) => {
                      const isActive = idx === currentApp.currentMilestoneIndex;
                      const isPast = idx < currentApp.currentMilestoneIndex;
                      const isComplete = stage.completed;

                      return (
                        <div key={idx} className="relative flex items-start gap-3.5 text-left leading-normal text-xs font-sans">
                          {/* Node Icon */}
                          <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border-2 shrink-0 z-10 transition-colors ${
                            isComplete 
                              ? "bg-emerald-500 border-emerald-500 text-white" 
                              : isActive 
                                ? "bg-amber-500 border-amber-500 text-neutral-950 stroke-[3]" 
                                : "bg-white dark:bg-stone-900 border-stone-250 dark:border-stone-750 text-stone-400"
                          }`}>
                            {isComplete ? (
                              <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                            ) : isActive ? (
                              <div className="w-1.5 h-1.5 bg-neutral-950 rounded-full animate-ping"></div>
                            ) : (
                              <div className="w-1.5 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full"></div>
                            )}
                          </div>

                          <div className="flex-1 space-y-0.5">
                            <span className={`text-[12.5px] font-extrabold flex items-center gap-1.5 ${
                              isComplete ? "text-stone-900 dark:text-white" : isActive ? "text-amber-600 dark:text-amber-500" : "text-stone-400"
                            }`}>
                              {isHi ? stage.titleHi : stage.titleEn}
                              {isComplete && (
                                <span className="text-[8px] font-mono uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-1 rounded font-bold">
                                  {isHi ? "पूर्ण" : "COMPLETED"}
                                </span>
                              )}
                              {isActive && !isComplete && (
                                <span className="text-[8px] font-mono uppercase bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-1 rounded font-bold animate-pulse">
                                  {isHi ? "सक्रिय" : "PENDING EVALUATION"}
                                </span>
                              )}
                            </span>
                            <p className={`text-[10.5px] leading-relaxed ${isComplete || isActive ? "text-stone-600 dark:text-stone-350" : "text-stone-400"}`}>
                              {isHi ? stage.descHi : stage.descEn}
                            </p>

                            {(stage.date || stage.officer) && (
                              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[9px] text-stone-400">
                                {stage.date && (
                                  <span className="flex items-center gap-0.5">
                                    <Clock className="w-2.5 h-2.5" />
                                    {stage.date}
                                  </span>
                                )}
                                {stage.officer && (
                                  <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400">
                                    <UserCheck className="w-2.5 h-2.5" />
                                    {stage.officer}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center border border-stone-150 dark:border-stone-850 bg-stone-50/50 dark:bg-stone-900/40 rounded-2xl flex flex-col items-center justify-center space-y-3"
              >
                <HelpCircle className="w-8 h-8 text-stone-300 dark:text-stone-750" />
                <div className="space-y-1 max-w-sm">
                  <h5 className="text-[12.5px] font-sans font-extrabold text-stone-900 dark:text-white">
                    {isHi ? "कोई सक्रिय स्थिति क्वेरी लोड नहीं" : "No Active Tracking Session Loaded"}
                  </h5>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-normal font-sans">
                    {isHi 
                      ? "उपरोक्त पाठ क्षेत्र में अपना रसीद संदर्भांक कोड भरें या स्थिति प्रलेखन का परीक्षण करने के लिए किसी एक उदाहरण संदर्भ पत्र पर क्लिक करें।" 
                      : "Type an application reference key above or select one of our prepackaged e-Sewa sample cases below to test current status checks and appeal workflows."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}
