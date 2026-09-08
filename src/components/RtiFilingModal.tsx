import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Scale, ArrowRight, ShieldCheck, CreditCard, Check, 
  HelpCircle, Sparkles, Building2, User, FileText, LayoutList 
} from "lucide-react";

interface RtiFilingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  triggerToast: (msg: string, type?: "success" | "info" | "error") => void;
}

const PUBLIC_AUTHORITIES = [
  { id: "dopt", en: "Department of Personnel & Training", hi: "कार्मिक और प्रशिक्षण विभाग" },
  { id: "uidai", en: "Unique Identification Authority of India (UIDAI)", hi: "भारतीय विशिष्ट पहचान प्राधिकरण (UIDAI)" },
  { id: "mha", en: "Ministry of Home Affairs", hi: "गृह मंत्रालय" },
  { id: "mor", en: "Ministry of Railways", hi: "रेल मंत्रालय" },
  { id: "mhrd", en: "Ministry of Education (formerly MHRD)", hi: "शिक्षा मंत्रालय" },
  { id: "revenue", en: "Department of Revenue", hi: "राजस्व विभाग" },
  { id: "eci", en: "Election Commission of India (ECI)", hi: "भारत निर्वाचन आयोग" }
];

export default function RtiFilingModal({
  isOpen,
  onClose,
  language,
  triggerToast
}: RtiFilingModalProps) {
  const [step, setStep] = useState<"form" | "payment" | "receipt">("form");
  const [auth, setAuth] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [query, setQuery] = useState("");
  const [isBplExempt, setIsBplExempt] = useState(false);
  const [bplCardNo, setBplCardNo] = useState("");
  const [paymentMode, setPaymentMode] = useState<"upi" | "netbanking" | "card">("upi");
  const [upiId, setUpiId] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  
  // Last generated receipt
  const [receipt, setReceipt] = useState<{
    id: string;
    auth: string;
    name: string;
    query: string;
    date: string;
    feesPaid: number;
    bplNo?: string;
  } | null>(null);

  if (!isOpen) return null;

  const isHi = language === "hi";

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      triggerToast(isHi ? "कृपया सार्वजनिक प्राधिकरण चुनें।" : "Please select a Public Authority.", "error");
      return;
    }
    if (!name || !email || !query) {
      triggerToast(isHi ? "कृपया सभी आवश्यक फ़ील्ड भरें।" : "Please fill in all mandatory fields.", "error");
      return;
    }
    if (isBplExempt && !bplCardNo) {
      triggerToast(isHi ? "कृपया बीपीएल कार्ड संख्या दर्ज करें।" : "Please enter your BPL card number.", "error");
      return;
    }

    if (isBplExempt) {
      // Direct receipt generation (no fees)
      const receiptId = `RTI-SEWA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const completedReceipt = {
        id: receiptId,
        auth,
        name,
        query,
        date: new Date().toLocaleString(),
        feesPaid: 0,
        bplNo: bplCardNo
      };
      setReceipt(completedReceipt);
      saveFilingLocally(completedReceipt);
      setStep("receipt");
      triggerToast(isHi ? "RTI आवेदन सफलतापूर्वक दर्ज किया गया।" : "RTI Request submitted successfully under BPL category.", "success");
    } else {
      setStep("payment");
    }
  };

  const handlePayAndSubmit = () => {
    if (paymentMode === "upi" && !upiId) {
      triggerToast(isHi ? "कृपया अपनी UPI आईडी दर्ज करें।" : "Please enter your UPI ID.", "error");
      return;
    }
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      const receiptId = `RTI-SEWA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const completedReceipt = {
        id: receiptId,
        auth,
        name,
        query,
        date: new Date().toLocaleString(),
        feesPaid: 10
      };
      setReceipt(completedReceipt);
      saveFilingLocally(completedReceipt);
      setStep("receipt");
      triggerToast(
        isHi 
          ? "भुगतान सफल! ₹10 प्राप्त हुए। RTI दर्ज की गई।" 
          : "Payment Successful! ₹10 charged. RTI filed successfully.", 
        "success"
      );
    }, 2000);
  };

  const saveFilingLocally = (item: any) => {
    try {
      const existing = localStorage.getItem("sewanadu_rtis");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(item);
      localStorage.setItem("sewanadu_rtis", JSON.stringify(list));
    } catch (e) {
      console.error("Local Storage error:", e);
    }
  };

  const getAuthName = (id: string) => {
    const found = PUBLIC_AUTHORITIES.find(p => p.id === id);
    if (!found) return id;
    return isHi ? found.hi : found.en;
  };

  return (
    <div className="fixed inset-0 bg-stone-900/80 dark:bg-slate-950/95 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        id="rti-filing-modal-container"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-150 dark:border-stone-850 flex items-center justify-between bg-stone-50 dark:bg-stone-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 rounded-xl">
              <Scale className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-extrabold tracking-wider bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 px-1.5 py-0.5 rounded uppercase">
                  {isHi ? "सूचना का अधिकार" : "RTI Portal"}
                </span>
                <span className="text-[9px] font-mono text-stone-400">Section 6(1)</span>
              </div>
              <h3 className="font-display font-black text-sm text-stone-900 dark:text-white mt-0.5">
                {isHi ? "स्वतंत्र सूचना का अधिकार प्रपत्र" : "Online RTI Application Simulator"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition cursor-pointer text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 border-0 bg-transparent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic content scroll area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: FORM */}
            {step === "form" && (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleNextToPayment}
                className="space-y-4"
              >
                {/* Warning Card */}
                <div className="p-3.5 bg-amber-500/5 border border-amber-500/15 text-amber-950 rounded-2xl flex gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                  <div className="text-[11px] leading-relaxed text-amber-900 dark:text-amber-400">
                    {isHi
                      ? "नागरिक सुगमता हेतु विकसित इस शैक्षिक RTI सिमुलेटर द्वारा आप केंद्रीय अथवा राज्य लोक अधिकारियों से वैधानिक प्रारूप में सूचना मांग सकते हैं। इसकी सरकारी आवेदन शुल्क ₹10 निर्धारित है।"
                      : "File an electronic RTI request with central departments. Complete requirements, write your specific query parameters, and pay the ₹10 statutory fee or apply for a BPL exemption."}
                  </div>
                </div>

                {/* Authority Field */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black uppercase text-stone-500 dark:text-stone-400 font-mono tracking-wider">
                    {isHi ? "लोक प्राधिकारी (Public Authority) *" : "Select Public Authority *"}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <select
                      value={auth}
                      onChange={(e) => setAuth(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-xs font-sans border border-stone-250 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-850 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none cursor-pointer"
                    >
                      <option value="">{isHi ? "-- विभाग चुनें --" : "-- Select Department --"}</option>
                      {PUBLIC_AUTHORITIES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {isHi ? p.hi : p.en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Personal Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase text-stone-500 dark:text-stone-400 font-mono tracking-wider">
                      {isHi ? "आवेदक का पूरा नाम *" : "Applicant Full Name *"}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder={isHi ? "जैसे: राजेश कुमार" : "e.g. Rajesh Kumar"}
                        className="w-full pl-10 pr-4 py-2.5 text-xs font-sans border border-stone-250 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-850 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase text-stone-500 dark:text-stone-400 font-mono tracking-wider">
                      {isHi ? "ईमेल विवरण (Email Verified) *" : "Verify Email Address *"}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="e.g. citizen@gov.in"
                      className="w-full px-4 py-2.5 text-xs font-sans border border-stone-250 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-850 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* Phone & BPL Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black uppercase text-stone-500 dark:text-stone-400 font-mono tracking-wider">
                      {isHi ? "मोबाइल क्रमांक (SMS Updates)" : "Mobile Number (SMS Updates)"}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 9999900000"
                      className="w-full px-4 py-2.5 text-xs font-sans border border-stone-250 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-850 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2.5 p-3 scroll-py-1 bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-850 rounded-xl cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isBplExempt}
                        onChange={(e) => setIsBplExempt(e.target.checked)}
                        className="w-4 h-4 text-amber-500 border-stone-300 rounded focus:ring-amber-500 dark:focus:ring-amber-400"
                      />
                      <div>
                        <span className="text-[11px] font-bold text-stone-900 dark:text-white block">
                          {isHi ? "क्या आप गरीबी रेखा के नीचे हैं? (BPL Exemption)" : "BPL Cardholder Exemption"}
                        </span>
                        <span className="text-[9.5px] text-stone-500 dark:text-stone-400 block font-normal">
                          {isHi ? "RTI शुल्क (₹10) पूरी तरह माफ" : "No filing fee. Requires valid BPL Card."}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* BPL Card Number field */}
                {isBplExempt && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-1.5 p-3 bg-stone-50 border border-stone-150 rounded-xl"
                  >
                    <label className="block text-[9.5px] font-black uppercase text-stone-600 font-mono tracking-wider">
                      {isHi ? "बीपीएल राशन कार्ड नंबर *" : "Exemption BPL Card Number *"}
                    </label>
                    <input
                      type="text"
                      value={bplCardNo}
                      onChange={(e) => setBplCardNo(e.target.value)}
                      required
                      placeholder={isHi ? "जैसे: BPL/UP/8921A" : "e.g. BPL/DL/58219"}
                      className="w-full px-4 py-2.5 text-xs font-sans border border-stone-250 rounded-lg bg-white focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </motion.div>
                )}

                {/* Query details */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black uppercase text-stone-500 dark:text-stone-400 font-mono tracking-wider">
                      {isHi ? "RTI सूचना अनुरोध (विवरण दर्ज करें) *" : "Specific Information Solicited *"}
                    </label>
                    <span className="text-[9.5px] font-mono text-stone-400">{query.length}/1200 chars</span>
                  </div>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value.slice(0, 1200))}
                      required
                      rows={4}
                      placeholder={
                        isHi 
                          ? "कार्यालय का स्पष्ट संदर्भ दें और पूछे जाने वाले प्रश्न सटीक लिखें। (जैसे: 'कृपया वर्ष 2025-26 के दौरान वार्ड क्रमांक 12 में सड़कों के डामरीकरण हेतु स्वीकृत आवंटन तथा व्यय की प्रति उपलब्ध करवाएं।')" 
                          : "Provide transparent query criteria. (e.g. 'Kindly furnish the complete copy of certified expenditure audits regarding development grants disbursed to administrative blocks of our regional district municipal office between April 2025 and March 2026.')"
                      }
                      className="w-full pl-10 pr-4 py-2.5 text-xs font-sans border border-stone-250 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-850 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-5 rounded-xl font-display font-black text-xs uppercase tracking-wider text-neutral-900 bg-amber-500 hover:bg-amber-400 shadow-sm active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isBplExempt ? (isHi ? "RTI सबमिट करें" : "Submit RTI Request") : (isHi ? "भुगतान एवं सबमिट करें" : "Proceed to Fee Payment")}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </motion.form>
            )}

            {/* STEP 2: FEE PAYMENT PORTAL */}
            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-5"
              >
                <div className="p-4 bg-stone-50 dark:bg-stone-850/60 rounded-2xl border border-stone-150 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-[11px] font-mono text-stone-500 uppercase tracking-wider font-extrabold">
                      {isHi ? "प्राधिकरण" : "Department"}
                    </h5>
                    <p className="text-xs font-sans font-black text-stone-850 dark:text-white mt-0.5">
                      {getAuthName(auth)}
                    </p>
                  </div>
                  <div className="text-right">
                    <h5 className="text-[11px] font-mono text-stone-500 uppercase tracking-wider font-extrabold">
                      {isHi ? "कार्यालय शुल्क" : "Statutory Fee"}
                    </h5>
                    <p className="text-base font-display font-black text-amber-600 dark:text-amber-500 mt-0.5">
                      ₹10.00
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="block text-[10px] font-black uppercase text-stone-500 font-mono tracking-wider">
                    {isHi ? "भुगतान विधि चुनें" : "Select Payment Gateway Mode"}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMode("upi")}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                        paymentMode === "upi" 
                          ? "border-amber-500 bg-amber-500/10 text-amber-950 dark:text-amber-400" 
                          : "border-stone-150 hover:border-stone-300 text-stone-600 hover:text-stone-900 bg-white dark:bg-stone-850 dark:text-white select-none"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span className="text-[10px] font-extrabold">BHIM UPI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode("netbanking")}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                        paymentMode === "netbanking" 
                          ? "border-amber-500 bg-amber-500/10 text-amber-950 dark:text-amber-400" 
                          : "border-stone-150 hover:border-stone-300 text-stone-600 hover:text-stone-900 bg-white dark:bg-stone-850 dark:text-white select-none"
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span className="text-[10px] font-extrabold">{isHi ? "नेट बैंकिंग" : "NetBanking"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode("card")}
                      className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                        paymentMode === "card" 
                          ? "border-amber-500 bg-amber-500/10 text-amber-950 dark:text-amber-400" 
                          : "border-stone-150 hover:border-stone-300 text-stone-600 hover:text-stone-900 bg-white dark:bg-stone-850 dark:text-white select-none"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-purple-500" />
                      <span className="text-[10px] font-extrabold">{isHi ? "डेबिट/क्रेडिट कार्ड" : "Card Payment"}</span>
                    </button>
                  </div>
                </div>

                {paymentMode === "upi" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5 p-4 bg-stone-50 dark:bg-stone-850 border border-stone-150 dark:border-stone-800 rounded-2xl"
                  >
                    <label className="block text-[9.5px] font-black uppercase text-stone-600 dark:text-stone-300 font-mono tracking-wider">
                      {isHi ? "अपनी UPI आईडी दर्ज करें *" : "Enter Virtual UPI Address *"}
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. rajesh@okaxis"
                      className="w-full px-4 py-2.5 text-xs font-mono border border-stone-250 dark:border-stone-750 rounded-xl bg-white dark:bg-stone-900 dark:text-white focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </motion.div>
                )}

                {paymentMode !== "upi" && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-stone-50 dark:bg-stone-850 border border-stone-150 dark:border-stone-800 rounded-2xl text-center text-stone-550 dark:text-stone-400 text-[11px]"
                  >
                    {isHi 
                      ? "लॉन्च के समय सुरक्षित e-Treasury गेटवे पुनर्निर्देशित किया जाएगा।" 
                      : "Clicking submit will redirect you securely to the national integrated e-Treasury system."}
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    disabled={isPaying}
                    className="flex-1 py-3 px-4 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-600 dark:text-stone-300 text-xs font-black uppercase tracking-wider hover:bg-stone-50 dark:hover:bg-stone-850 select-none block transition shrink-0 cursor-pointer text-center"
                  >
                    {isHi ? "पीछे जाएँ" : "Modify Details"}
                  </button>

                  <button
                    type="button"
                    disabled={isPaying}
                    onClick={handlePayAndSubmit}
                    className="flex-1 py-3 px-4 rounded-xl font-display font-black text-xs uppercase tracking-wider text-neutral-900 bg-amber-500 hover:bg-amber-400 active:scale-98 shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isPaying ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
                        <span>{isHi ? "प्रक्रिया जारी..." : "Authorizing..."}</span>
                      </div>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-neutral-950 shrink-0" />
                        <span>{isHi ? "लॉगिन और ₹10 का भुगतान" : "Authenticate & Pay ₹10"}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SUCCESS APPLICATION RECEIPT */}
            {step === "receipt" && receipt && (
              <motion.div
                key="receipt"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-400 rounded-2xl flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-xl shrink-0">
                    <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-500 stroke-[3]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-emerald-900 dark:text-emerald-300">
                      {isHi ? "RTI सबमिशन सफलतापूर्वक दायर किया गया" : "RTI Subvention Request Registered!"}
                    </h5>
                    <p className="text-[10.5px] leading-relaxed text-emerald-800 dark:text-emerald-400 mt-1">
                      {isHi 
                        ? `आवेदक ${receipt.name}। आपका भारतीय सूचना का कानून (RTI Act, 2005) के तहत आवेदन दर्ज किया गया है। कृपया त्वरित निपटान या आगे की प्रगति पर नजर रखने के लिए आवेदन संदर्भ कुंजी नोट करें।`
                        : `Applicant ${receipt.name}. Your formal request under the Right to Information Act, 2005 has been registered. Copy your Application Reference Key below to track verification milestones.`}
                    </p>
                  </div>
                </div>

                {/* Receipt Card Graphic */}
                <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs font-sans text-stone-800 dark:text-stone-300">
                  <div className="p-4 bg-stone-50 dark:bg-stone-850/60 border-b border-stone-150 dark:border-stone-800 flex items-center justify-between pr-2">
                    <div className="flex items-center gap-1.5">
                      <LayoutList className="w-4 h-4 text-stone-400" />
                      <span className="text-[10.5px] font-mono tracking-wider font-extrabold uppercase text-stone-500">
                        {isHi ? "आधिकारिक रसीद" : "Official Acknowledgement Slip"}
                      </span>
                    </div>
                    <span className="text-[9.5px] font-mono font-black text-amber-600 dark:text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded animate-pulse">
                      STATUS: SUBMITTED
                    </span>
                  </div>

                  <div className="p-4 space-y-3.5 bg-white dark:bg-stone-900 leading-normal text-xs divide-y divide-stone-100 dark:divide-stone-850">
                    <div className="grid grid-cols-2 gap-4 pb-1">
                      <div>
                        <span className="text-[9px] font-mono text-stone-450 uppercase block">Reference Number (REF)</span>
                        <strong className="text-[12px] font-mono text-stone-900 dark:text-white block mt-0.5">
                          {receipt.id}
                        </strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-stone-450 uppercase block">Submission Date</span>
                        <span className="font-mono text-[10.5px] text-stone-800 dark:text-stone-200 block mt-0.5">
                          {receipt.date}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3">
                      <span className="text-[9px] font-mono text-stone-450 uppercase block">Authority Addressed</span>
                      <p className="font-sans font-black text-stone-900 dark:text-white mt-1">
                        {getAuthName(receipt.auth)}
                      </p>
                    </div>

                    <div className="pt-3">
                      <span className="text-[9px] font-mono text-stone-450 uppercase block">Applicant Coordinates</span>
                      <p className="font-sans font-bold text-stone-800 dark:text-stone-200 mt-1">
                        {receipt.name} ({email})
                      </p>
                    </div>

                    <div className="pt-3 max-h-32 overflow-y-auto">
                      <span className="text-[9px] font-mono text-stone-450 uppercase block">Soliciated Query Copy</span>
                      <p className="font-sans font-normal italic text-stone-650 dark:text-stone-400 mt-1 bg-stone-50 dark:bg-stone-850 p-2.5 rounded-xl border border-stone-150 dark:border-stone-800 leading-relaxed text-[10.5px]">
                        "{receipt.query}"
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3.5 leading-none">
                      <div>
                        <span className="text-[9px] font-mono text-stone-450 uppercase block">Statutory Act Reference</span>
                        <span className="text-[10px] font-mono text-stone-950 dark:text-stone-200 block mt-1">
                          RTI Act Sec 6(1)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-stone-450 uppercase block">Fees Transaction</span>
                        <span className="text-[10.5px] font-sans font-black text-amber-600 dark:text-amber-500 block mt-1">
                          {receipt.feesPaid > 0 ? `₹${receipt.feesPaid}.00 (SUCCESS)` : `EXEMPTED (${receipt.bplNo})`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50 dark:bg-stone-850 border-t border-stone-150 dark:border-stone-800 text-[10px] text-stone-500 text-center font-mono">
                    {isHi 
                      ? "सूचना का प्रकटन नियमानुसार 30 दिनों के भीतर किया जाएगा।" 
                      : "Expected response date: within 30 days of registration."}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setAuth("");
                      setQuery("");
                      onClose();
                    }}
                    className="w-full py-3 px-4 rounded-xl font-display font-black text-xs uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 shadow-sm active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isHi ? "पंजीकरण समाप्त करें" : "Return to Dashboard"}</span>
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}
