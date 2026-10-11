import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, ShieldCheck, UserCheck, AlertCircle, Plus, 
  Send, RefreshCw, Filter, CheckCircle2, Award, Landmark, 
  Users, Info, ChevronDown, ChevronUp, Lock, Check, CheckSquare
} from "lucide-react";
import { getApiUrl } from "../lib/api";

interface DiscussionComment {
  id: string;
  commenterName: string;
  commenterStatus: string;
  text: string;
  timestamp: string;
}

interface DiscussionThread {
  id: string;
  title: string;
  policyArea: string;
  content: string;
  postedBy: string;
  profileStatus: string;
  verificationCount: number;
  verifiedCitizens: string[];
  comments: DiscussionComment[];
  timestamp: string;
  status: "PROPOSED" | "COMMUNITY_VERIFIED" | "FLAGGED";
}

interface VerifiedDiscussionsProps {
  language: string;
  citizenName: string;
  citizenEmail: string;
  citizenAadhaar: string;
  citizenState: string;
  triggerToast: (msg: string, type?: "success" | "info" | "error") => void;
}

export default function VerifiedDiscussions({
  language,
  citizenName,
  citizenEmail,
  citizenAadhaar,
  citizenState,
  triggerToast
}: VerifiedDiscussionsProps) {
  // Local profile verification states (persisted locally)
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sewanadu_citizen_verified") === "true";
    } catch {
      return false;
    }
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [submittingOtp, setSubmittingOtp] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState("");

  const [discussions, setDiscussions] = useState<DiscussionThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterArea, setFilterArea] = useState<string>("ALL");
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);

  // New discussion form states
  const [showPostForm, setShowPostForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("WELFARE");
  const [formContent, setFormContent] = useState("");
  const [submittingThread, setSubmittingThread] = useState(false);

  // Comment input state per thread
  const [commentsInputs, setCommentsInputs] = useState<Record<string, string>>({});
  const [submittingCommentId, setSubmittingCommentId] = useState<string | null>(null);

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const resp = await fetch(getApiUrl("/api/eseva/discussions"));
      if (resp.ok) {
        const data = await resp.json();
        setDiscussions(data.discussions || []);
      }
    } catch (err) {
      console.error("Failed to load discussions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handleStartVerification = () => {
    if (isVerified) return;
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(generated);
    setOtpSent(true);
    triggerToast(
      language === "hi" 
        ? `सिम्युलेटेड आधार ओटीपी आपके पंजीकृत नंबर पर भेजा गया: ${generated}` 
        : `Simulated Aadhaar OTP dispatched to linked mobile: ${generated}`, 
      "info"
    );
  };

  const handleVerifyOtp = () => {
    setSubmittingOtp(true);
    setTimeout(() => {
      if (otpValue === simulatedOtp) {
        setIsVerified(true);
        try {
          localStorage.setItem("sewanadu_citizen_verified", "true");
        } catch (e) {
          console.error(e);
        }
        setOtpSent(false);
        setOtpValue("");
        triggerToast(
          language === "hi" 
            ? "आधार नागरिक प्रोफाइल सफलतापूर्वक सत्यापित!" 
            : "Aadhaar citizen profile verified successfully!", 
          "success"
        );
      } else {
        triggerToast(
          language === "hi" 
            ? "अमान्य सिम्युलेटेड ओटीपी दर्ज किया गया।" 
            : "Invalid simulated OTP entered.", 
          "error"
        );
      }
      setSubmittingOtp(false);
    }, 600);
  };

  const handlePostThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      triggerToast(
        language === "hi" 
          ? "कृपया शीर्षक और सामग्री भरें।" 
          : "Please complete the title and content fields.", 
        "error"
      );
      return;
    }

    setSubmittingThread(true);
    try {
      const resp = await fetch(getApiUrl("/api/eseva/discussions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          policyArea: formCategory,
          content: formContent,
          postedBy: citizenName,
          profileStatus: isVerified ? "Aadhaar Verified" : "Unverified Citizen"
        })
      });

      if (resp.ok) {
        setFormTitle("");
        setFormContent("");
        setShowPostForm(false);
        triggerToast(
          language === "hi" 
            ? "चर्चा थ्रेड सफलतापूर्वक पोस्ट किया गया!" 
            : "Discussion thread posted successfully!", 
          "success"
        );
        fetchDiscussions();
      }
    } catch (err) {
      console.error(err);
      triggerToast(
        language === "hi" ? "थ्रेड पोस्ट करने में विफल।" : "Failed to post discussion thread.", 
        "error"
      );
    } finally {
      setSubmittingThread(false);
    }
  };

  const handleVerifyThread = async (threadId: string) => {
    if (!isVerified) {
      triggerToast(
        language === "hi" 
          ? "सह-हस्ताक्षर करने के लिए कृपया पहले अपना नागरिक आधार प्रोफाइल सत्यापित करें।" 
          : "Please verify your Aadhaar citizen profile first to co-sign policy changes.", 
        "error"
      );
      return;
    }

    try {
      const resp = await fetch(getApiUrl(`/api/eseva/discussions/${threadId}/verify`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizenName,
          profileStatus: "Aadhaar Verified"
        })
      });

      if (resp.ok) {
        triggerToast(
          language === "hi" 
            ? "नीति परिवर्तन थ्रेड सफलतापूर्वक सत्यापित और सह-हस्ताक्षरित!" 
            : "Policy change thread successfully verified and co-signed!", 
          "success"
        );
        fetchDiscussions();
      } else {
        const errData = await resp.json();
        triggerToast(errData.error || "Failed to verify", "error");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (threadId: string) => {
    const text = commentsInputs[threadId] || "";
    if (!text.trim()) return;

    setSubmittingCommentId(threadId);
    try {
      const resp = await fetch(getApiUrl(`/api/eseva/discussions/${threadId}/comment`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          commenterName: citizenName,
          commenterStatus: isVerified ? "Aadhaar Verified" : "Unverified Citizen"
        })
      });

      if (resp.ok) {
        setCommentsInputs(prev => ({ ...prev, [threadId]: "" }));
        triggerToast(
          language === "hi" ? "टिप्पणी जोड़ी गई!" : "Comment added successfully!", 
          "success"
        );
        fetchDiscussions();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingCommentId(null);
    }
  };

  const filteredDiscussions = discussions.filter(d => {
    if (filterArea === "ALL") return true;
    return d.policyArea === filterArea;
  });

  const getCategoryColor = (area: string) => {
    switch (area) {
      case "IDENTITY": return "bg-blue-50 text-blue-700 border-blue-200/50";
      case "FINANCE": return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "HEALTH": return "bg-teal-50 text-teal-700 border-teal-200/50";
      case "LABOUR": return "bg-purple-50 text-purple-700 border-purple-200/50";
      case "LAND": return "bg-amber-50 text-amber-700 border-amber-200/50";
      case "WELFARE": return "bg-orange-50 text-orange-700 border-orange-200/50";
      default: return "bg-stone-50 text-stone-700 border-stone-200/50";
    }
  };

  return (
    <div id="verified-discussions-root" className="space-y-6 font-sans">
      
      {/* 1. Citizen Profile Verification Ribbon */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-3xs relative overflow-hidden" id="citizen-discussion-profile-card">
        <span className="absolute -top-12 -right-12 w-32 h-32 bg-orange-500/5 rounded-full blur-xl pointer-events-none"></span>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 text-left">
            <span className="text-[9px] font-mono font-black tracking-widest text-stone-400 block uppercase">
              {language === "hi" ? "सक्रिय नागरिक भागीदारी प्रोफाइल" : "ACTIVE CITIZEN PARTICIPATION PROFILE"}
            </span>
            <div className="flex items-center gap-2.5">
              <strong className="text-sm font-extrabold text-stone-900">{citizenName}</strong>
              
              <AnimatePresence mode="wait">
                {isVerified ? (
                  <motion.span 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[9px] font-bold font-sans uppercase"
                    id="profile-badge-verified"
                  >
                    <UserCheck className="w-3 h-3 text-emerald-500" />
                    <span>{language === "hi" ? "आधार सत्यापित नागरिक" : "Aadhaar Verified Citizen"}</span>
                  </motion.span>
                ) : (
                  <motion.span 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[9px] font-bold font-sans uppercase"
                    id="profile-badge-unverified"
                  >
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    <span>{language === "hi" ? "स्व-घोषित (असत्यापित)" : "Self-Declared (Unverified)"}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            
            <p className="text-[10.5px] text-stone-500 max-w-xl leading-relaxed">
              {language === "hi" 
                ? "स्थानीय नीति परिवर्तनों, शुल्क संशोधनों, और नए नियमों पर समुदाय द्वारा सत्यापित धागे पोस्ट करने के लिए नागरिक प्रोफाइल को सुरक्षित रूप से आधार डेटा से जोड़ें।" 
                : "Your verified status co-signs and authorizes local policy updates. Connect your state credentials securely to unlock community voting and formal declarations."}
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2 min-w-[200px]" id="verification-action-container">
            {isVerified ? (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-150 text-left space-y-1">
                <div className="flex items-center gap-1 text-[9.5px] font-black text-stone-600 uppercase tracking-tight">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === "hi" ? "योग्यताएं अनलॉक" : "Privileges Unlocked"}</span>
                </div>
                <p className="text-[9.5px] text-stone-500 leading-tight">
                  {language === "hi" 
                    ? "✓ सत्यापित थ्रेड पोस्ट करना\n✓ नीति संशोधनों को सह-हस्ताक्षरित करना" 
                    : "✓ Posting Verified Threads\n✓ Co-signing policy revisions"}
                </p>
              </div>
            ) : otpSent ? (
              <div className="space-y-1.5 p-3.5 bg-amber-50/50 border border-amber-200/60 rounded-xl text-left">
                <label className="text-[9px] font-mono font-bold text-amber-800 block uppercase">
                  {language === "hi" ? "सिम्युलेटेड ओटीपी दर्ज करें" : "Enter Simulated OTP:"}
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 1234"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-white border border-stone-300 py-1 px-2 rounded-lg text-xs text-center font-mono focus:border-amber-500 outline-none"
                    id="verification-otp-input"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={submittingOtp}
                    className="px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center shrink-0"
                  >
                    {submittingOtp ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Verify"}
                  </button>
                </div>
                <span className="text-[8px] text-amber-700 font-sans block leading-tight">
                  {language === "hi" ? `परीक्षण ओटीपी कोड: ${simulatedOtp}` : `Test OTP Code is: ${simulatedOtp}`}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartVerification}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[10.5px] font-extrabold transition shadow-3xs flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                id="start-profile-verification-btn"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === "hi" ? "आधार से सत्यापित करें" : "Verify with Aadhaar"}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Controls Bar (New Post Button, Filter, Search) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 border border-stone-200 p-3 rounded-2xl" id="discussions-control-bar">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5" id="discussions-category-filters">
          {[
            { id: "ALL", labelEn: "All Topics", labelHi: "सभी विषय" },
            { id: "WELFARE", labelEn: "Welfare", labelHi: "कल्याण" },
            { id: "IDENTITY", labelEn: "Identity", labelHi: "पहचान" },
            { id: "FINANCE", labelEn: "Finance", labelHi: "वित्त" },
            { id: "HEALTH", labelEn: "Health", labelHi: "स्वास्थ्य" },
            { id: "LAND", labelEn: "Land/Licence", labelHi: "भूमि/लाइसेंस" }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilterArea(opt.id)}
              className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition cursor-pointer select-none ${
                filterArea === opt.id
                  ? "bg-stone-900 border-stone-900 text-white"
                  : "bg-white border-stone-200 text-stone-600 hover:bg-stone-100/60"
              }`}
            >
              {language === "hi" ? opt.labelHi : opt.labelEn}
            </button>
          ))}
        </div>

        {/* Post Button */}
        <button
          type="button"
          onClick={() => setShowPostForm(!showPostForm)}
          className={`px-4 py-2 rounded-xl text-[10.5px] font-bold transition cursor-pointer select-none flex items-center justify-center gap-1.5 shrink-0 ${
            showPostForm 
              ? "bg-stone-200 hover:bg-stone-300 text-stone-800" 
              : "bg-brand-coral hover:bg-brand-coral/90 text-white shadow-3xs"
          }`}
          id="toggle-post-form-btn"
        >
          {showPostForm ? (
            <>
              <span>{language === "hi" ? "रद्द करें" : "Cancel"}</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>{language === "hi" ? "नया थ्रेड पोस्ट करें" : "Post Policy Change"}</span>
            </>
          )}
        </button>
      </div>

      {/* 3. New Policy Thread Posting Form */}
      <AnimatePresence>
        {showPostForm && (
          <motion.form
            onSubmit={handlePostThread}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left space-y-4"
            id="new-discussion-post-form"
          >
            <h3 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider font-display flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-brand-coral" />
              <span>{language === "hi" ? "नया नीति परिवर्तन थ्रेड" : "Post a New Policy Change Thread"}</span>
            </h3>

            {!isVerified && (
              <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl flex gap-2 items-start text-[10px] text-amber-800 leading-normal">
                <Info className="w-3.5 h-3.5 shrink-0 text-amber-500 mt-0.5" />
                <p>
                  {language === "hi" 
                    ? "चेतावनी: चूंकि आपकी नागरिक प्रोफाइल सत्यापित नहीं है, इसलिए आपका थ्रेड अस्थायी रूप से 'अपुष्ट' (Unverified) के रूप में टैग किया जाएगा। पोस्ट करने से पहले ऊपर 'आधार से सत्यापित करें' पर क्लिक करने की दृढ़ता से सिफारिश की जाती है।" 
                    : "Notice: Since your citizen profile is unverified, your thread will temporarily bear an 'Unverified Poster' advisory badge. We strongly recommend verifying with Aadhaar first to establish sovereign credibility."}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              <div className="md:col-span-8 space-y-1">
                <label className="text-[9px] font-mono font-bold text-stone-500 block uppercase">
                  {language === "hi" ? "चर्चा का शीर्षक" : "Discussion Title:"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === "hi" ? "उदा. उत्तर प्रदेश राशन कार्ड पात्रता संशोधन 2026" : "e.g. Karnataka Caste Certificate Income Limit Raised to 8 Lakhs"}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-xs text-stone-900 focus:border-brand-coral outline-none"
                  id="new-thread-title-field"
                />
              </div>

              <div className="md:col-span-4 space-y-1">
                <label className="text-[9px] font-mono font-bold text-stone-500 block uppercase">
                  {language === "hi" ? "नीति क्षेत्र" : "Policy Area / Category:"}
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-white border border-stone-200 px-3 py-2 rounded-xl text-xs text-stone-800 focus:border-brand-coral outline-none cursor-pointer"
                  id="new-thread-category-select"
                >
                  <option value="WELFARE">{language === "hi" ? "WELFARE (कल्याण)" : "WELFARE (Welfare)"}</option>
                  <option value="IDENTITY">{language === "hi" ? "IDENTITY (पहचान)" : "IDENTITY (Identity)"}</option>
                  <option value="FINANCE">{language === "hi" ? "FINANCE (वित्त)" : "FINANCE (Finance)"}</option>
                  <option value="HEALTH">{language === "hi" ? "HEALTH (स्वास्थ्य)" : "HEALTH (Health)"}</option>
                  <option value="LABOUR">{language === "hi" ? "LABOUR (श्रम)" : "LABOUR (Labour)"}</option>
                  <option value="LAND">{language === "hi" ? "LAND/LICENCE (भूमि)" : "LAND/LICENCE (Land)"}</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono font-bold text-stone-500 block uppercase">
                {language === "hi" ? "नीति विवरण और साक्ष्य लिंक" : "Policy Details & Verification Sources:"}
              </label>
              <textarea
                required
                rows={4}
                placeholder={language === "hi" ? "कृपया नीति परिवर्तन के विवरण, शुल्क राशि परिवर्तन, या प्रमाणिक सरकारी वेबसाइट/शासनादेश का लिंक प्रदान करें।" : "Provide the exact description of the policy change, revisions in timelines or costs, and links to the official circular or gazette notification if available."}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="w-full bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-xs text-stone-900 focus:border-brand-coral outline-none font-sans"
                id="new-thread-content-field"
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={submittingThread}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-950 text-white rounded-xl text-[10.5px] font-bold transition flex items-center gap-1.5 shadow-3xs cursor-pointer"
                id="new-thread-submit-btn"
              >
                {submittingThread ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === "hi" ? "चर्चा प्रकाशित करें" : "Publish Discussion"}</span>
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* 4. Discussions List / Bulletins */}
      {loading ? (
        <div className="py-12 text-center flex flex-col items-center justify-center space-y-3 bg-white border border-stone-250 rounded-2xl" id="discussions-loading-card">
          <RefreshCw className="w-6 h-6 text-brand-coral animate-spin" />
          <span className="text-xs font-mono text-stone-500">
            {language === "hi" ? "सत्यापित चर्चाओं को लोड किया जा रहा है..." : "Synchronizing community discussion index..."}
          </span>
        </div>
      ) : filteredDiscussions.length === 0 ? (
        <div className="py-12 text-center bg-stone-50 border border-stone-200 rounded-2xl space-y-2 select-none" id="discussions-empty-card">
          <MessageSquare className="w-8 h-8 text-stone-300 mx-auto" />
          <p className="text-xs font-semibold text-stone-600">
            {language === "hi" ? "इस श्रेणी में कोई सत्यापित नीति थ्रेड नहीं मिला।" : "No discussions found matching this policy sector."}
          </p>
          <button
            type="button"
            onClick={() => setShowPostForm(true)}
            className="text-[10px] text-brand-coral font-bold hover:underline cursor-pointer"
          >
            {language === "hi" ? "पहला धागा पोस्ट करें!" : "Be the first to post a policy update!"}
          </button>
        </div>
      ) : (
        <div className="space-y-4" id="discussions-thread-list">
          {filteredDiscussions.map((thread) => {
            const hasSigned = thread.verifiedCitizens.includes(citizenName);
            const isExpanded = expandedThreadId === thread.id;

            return (
              <div 
                key={thread.id} 
                className="bg-white border border-stone-200 rounded-2xl shadow-3xs hover:shadow-2xs transition-all duration-200 text-left overflow-hidden"
              >
                {/* Header Content */}
                <div className="p-4 sm:p-5 space-y-3">
                  
                  {/* Category and verification badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 border rounded text-[9px] font-mono font-bold uppercase select-none ${getCategoryColor(thread.policyArea)}`}>
                        {thread.policyArea}
                      </span>
                      
                      {thread.status === "COMMUNITY_VERIFIED" ? (
                        <span className="inline-flex items-center gap-0.5 bg-emerald-500/10 text-emerald-800 border border-emerald-500/10 px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold uppercase select-none">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{language === "hi" ? "समुदाय-सत्यापित" : "Community-Verified"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 bg-amber-500/10 text-amber-800 border border-amber-500/10 px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold uppercase select-none">
                          <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
                          <span>{language === "hi" ? "प्रस्तावित परिवर्तन" : "Proposed Change"}</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(thread.timestamp).toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>

                  {/* Title and Body */}
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-stone-900 text-sm leading-snug hover:text-brand-coral transition cursor-pointer" onClick={() => setExpandedThreadId(isExpanded ? null : thread.id)}>
                      {thread.title}
                    </h3>
                    <p className="text-[11px] text-stone-550 leading-relaxed font-sans font-medium whitespace-pre-wrap">
                      {thread.content}
                    </p>
                  </div>

                  {/* Author information & Co-signature panel */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-stone-100">
                    <div className="flex items-center gap-1.5 select-none">
                      <span className="w-5 h-5 bg-stone-100 rounded-full text-[10px] font-extrabold text-stone-600 flex items-center justify-center uppercase">
                        {thread.postedBy[0]}
                      </span>
                      <span className="text-[10px] font-bold text-stone-700">{thread.postedBy}</span>
                      <span className="text-[8.5px] bg-stone-100 text-stone-500 border border-stone-150 px-1.5 py-0.2 rounded font-sans font-semibold">
                        {thread.profileStatus}
                      </span>
                    </div>

                    {/* Co-sign Interaction area */}
                    <div className="flex items-center gap-3">
                      
                      {/* Voting gauge */}
                      <div className="flex items-center gap-1 select-none">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span className="text-[10px] font-mono font-black text-stone-800">
                          {thread.verificationCount}
                        </span>
                        <span className="text-[9px] text-stone-500">
                          {language === "hi" ? "नागरिकों ने पुष्टि की" : "co-signatures"}
                        </span>
                      </div>

                      {/* Vote trigger */}
                      {hasSigned ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-xl text-[10px] font-bold select-none">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{language === "hi" ? "पुष्टि की गई" : "Verified By You"}</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleVerifyThread(thread.id)}
                          className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-800 hover:text-white border border-amber-500/20 hover:border-amber-500 rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer select-none"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>{language === "hi" ? "सत्यापित करें / सह-हस्ताक्षर" : "Co-Sign / Verify"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Section (Comments Area) */}
                <div className="bg-stone-50/50 border-t border-stone-150 p-4 space-y-4 text-left">
                  <div className="flex items-center justify-between select-none">
                    <button
                      type="button"
                      onClick={() => setExpandedThreadId(isExpanded ? null : thread.id)}
                      className="text-[10.5px] font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{language === "hi" ? `टिप्पणियाँ (${thread.comments.length})` : `Comments (${thread.comments.length})`}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3"
                    >
                      {/* Comments Feed */}
                      {thread.comments.length > 0 ? (
                        <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                          {thread.comments.map((comment) => (
                            <div 
                              key={comment.id} 
                              className="bg-white border border-stone-150 p-2.5 rounded-xl space-y-1 text-left"
                            >
                              <div className="flex items-center justify-between gap-2 select-none">
                                <div className="flex items-center gap-1">
                                  <span className="text-[9.5px] font-bold text-stone-800">{comment.commenterName}</span>
                                  <span className="text-[7.5px] font-mono font-bold uppercase bg-stone-100 text-stone-500 px-1 rounded">
                                    {comment.commenterStatus}
                                  </span>
                                </div>
                                <span className="text-[8px] text-stone-400 font-mono">
                                  {new Date(comment.timestamp).toLocaleTimeString(language === "hi" ? "hi-IN" : "en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })}
                                </span>
                              </div>
                              <p className="text-[10.5px] text-stone-600 font-sans leading-relaxed">
                                {comment.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-stone-400 font-sans py-1">
                          {language === "hi" ? "इस थ्रेड पर कोई टिप्पणी नहीं है। बातचीत शुरू करें!" : "No comments yet. Start the conversation!"}
                        </p>
                      )}

                      {/* Add Comment Bar */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder={language === "hi" ? "अपनी टिप्पणी या अतिरिक्त सत्यापन साक्ष्य लिखें..." : "Add your opinion or policy update verification evidence..."}
                          value={commentsInputs[thread.id] || ""}
                          onChange={(e) => setCommentsInputs(prev => ({ ...prev, [thread.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(thread.id);
                          }}
                          className="flex-1 bg-white border border-stone-200 px-3.5 py-1.5 rounded-xl text-[10.5px] text-stone-900 focus:border-brand-coral outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(thread.id)}
                          disabled={submittingCommentId === thread.id}
                          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-950 text-white rounded-xl text-[10px] font-bold transition shrink-0 flex items-center justify-center gap-1 cursor-pointer select-none"
                        >
                          {submittingCommentId === thread.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <Send className="w-2.5 h-2.5" />
                              <span>Comment</span>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
