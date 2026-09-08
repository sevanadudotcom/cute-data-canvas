import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Landmark, Award, ShieldCheck, QrCode, CreditCard, Users, Download, ArrowRight, Sparkles, CheckCircle2, IndianRupee } from "lucide-react";

interface NationalFundWidgetProps {
  language: string;
  triggerToast: (msg: string, type?: "success" | "info" | "error") => void;
}

interface Contributor {
  name: string;
  amount: number;
  message: string;
  date: string;
}

export default function NationalFundWidget({ language, triggerToast }: NationalFundWidgetProps) {
  // Goals and state mapping
  const targetAmount = 1000000;
  const [currentAmount, setCurrentAmount] = useState(741250);
  const [contributors, setContributors] = useState<Contributor[]>([
    { name: "Rajesh Kumar", amount: 1000, message: "Excellent initiative for digital empowerment!", date: "2 mins ago" },
    { name: "Sneha Patel", amount: 500, message: "SewaNadu certificates saved me hours of waiting.", date: "1 hour ago" },
    { name: "Ananya Iyer", amount: 2500, message: "Proud contributor to India's rural digitization donation initiative.", date: "3 hours ago" },
  ]);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Contribution Form states
  const [donorName, setDonorName] = useState("");
  const [donorMessage, setDonorMessage] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | "custom">(500);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "net">("upi");
  
  // Last Contribution details for Certificate generator
  const [lastContribution, setLastContribution] = useState<{
    name: string;
    amount: number;
    txnId: string;
    date: string;
  } | null>(null);

  // Pre-set Tiers info
  const presetTiers = [
    { value: 100, label: language === "hi" ? "₹100 (रजत)" : "₹100 (Silver)", desc: language === "hi" ? "रजत समर्थक बैज" : "Silver Supporter Badge" },
    { value: 500, label: language === "hi" ? "₹500 (स्वर्ण)" : "₹500 (Gold)", desc: language === "hi" ? "स्वर्ण पेट्रन प्रशस्ति" : "Gold Patron Badge" },
    { value: 2500, label: language === "hi" ? "₹2500 (हीरा)" : "₹2500 (Diamond)", desc: language === "hi" ? "विशेष आमंत्रण पत्र" : "Special Invitation Badge" },
  ];

  const getActiveAmount = (): number => {
    if (selectedPreset === "custom") {
      return Number(customAmount) || 0;
    }
    return selectedPreset;
  };

  const handleOpenPayment = () => {
    setPaymentModalOpen(true);
  };

  const handleSumbitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = getActiveAmount();
    if (finalAmount < 10) {
      triggerToast(
        language === "hi" ? "कृपया योगदान के लिए कम से कम ₹10 का चयन करें।" : "Please select at least ₹10 to contribute.", 
        "error"
      );
      return;
    }

    const finalName = donorName.trim() || (language === "hi" ? "अनाम दाता" : "Generous Donor");
    const txn = "TXN" + Math.floor(Math.random() * 899999 + 100000);
    const currentDate = new Date().toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    // Update state to simulate live funding addition
    setCurrentAmount(prev => prev + finalAmount);
    setContributors(prev => [
      { 
        name: finalName, 
        amount: finalAmount, 
        message: donorMessage.trim() || (language === "hi" ? "डिजिटल इंडिया को सलाम!" : "Salute to Digital India!"), 
        date: language === "hi" ? "अभी-अभी" : "Just now" 
      },
      ...prev
    ]);

    setLastContribution({
      name: finalName,
      amount: finalAmount,
      txnId: txn,
      date: currentDate
    });

    setPaymentModalOpen(false);
    setSuccessModalOpen(true);
    triggerToast(
      language === "hi" 
        ? `योगदान प्राप्त हुआ! ₹${finalAmount} के लिए हार्दिक धन्यवाद।` 
        : `Contribution received! Heartfelt thanks for ₹${finalAmount}.`,
      "success"
    );
  };

  const handleDownloadCertificate = () => {
    if (!lastContribution) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 750;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        triggerToast(
          language === "hi" ? "कैनवास लोड करने में विफल।" : "Failed to load canvas context.",
          "error"
        );
        return;
      }

      // 1. Solid Ivory/Cream paper background
      ctx.fillStyle = "#FCFBF7";
      ctx.fillRect(0, 0, 1000, 750);

      // 2. Double border lines (Amber theme)
      ctx.strokeStyle = "#D97706"; // Amber 600
      ctx.lineWidth = 5;
      ctx.strokeRect(25, 25, 950, 700);

      ctx.strokeStyle = "#F59E0B"; // Amber 500
      ctx.lineWidth = 1.5;
      ctx.strokeRect(35, 35, 930, 680);

      // 3. Elegant corner flairs
      ctx.font = "24px Georgia, serif";
      ctx.fillStyle = "#D97706";
      ctx.fillText("❖", 50, 65);
      ctx.fillText("❖", 930, 65);
      ctx.fillText("❖", 50, 695);
      ctx.fillText("❖", 930, 695);

      // 4. Content alignment and text drawing
      ctx.textAlign = "center";
      
      // Top category
      ctx.font = "bold 13px sans-serif";
      ctx.fillStyle = "#78716C"; // Stone 500
      ctx.fillText("SEWANADU VOLUNTARY COMMUNITY SANDBOX", 500, 95);

      // Explicit non-government label to comply with guidance
      ctx.font = "9px monospace";
      ctx.fillStyle = "#EF4444"; // Red 500
      ctx.fillText(
        language === "hi" 
          ? "स्वैच्छिक दान आभार पत्र (यह भारत सरकार द्वारा प्रदत्त या अनुमोदित आधिकारिक दस्तावेज नहीं है)" 
          : "VOLUNTARY SYSTEM APPRECIATION - NOT AN OFFICIAL DOCUMENT ISSUED BY THE GOVERNMENT OF INDIA", 
        500, 120
      );

      // Certificate Title
      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = "#1C1917"; // Stone 900
      ctx.fillText(language === "hi" ? "राष्ट्रीय डिजिटल सेवा अंशदान पत्र" : "NATIONAL DIGITAL SEVA DONATION CERTIFICATE", 500, 165);

      // Middle thin split divider line
      ctx.strokeStyle = "#E7E5E4";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(350, 190);
      ctx.lineTo(650, 190);
      ctx.stroke();

      // Presentation tagline
      ctx.font = "italic 16px Georgia, serif";
      ctx.fillStyle = "#57534E"; // Stone 600
      ctx.fillText(
        language === "hi" 
          ? "यह सम्मान पत्र बड़े हर्ष एवं आभार के साथ प्रदान किया जाता है:" 
          : "This certificate of appreciation is proudly presented to:", 
        500, 235
      );

      // Contributor name
      ctx.font = "bold 32px sans-serif";
      ctx.fillStyle = "#FF5A2B"; // Brand Coral
      ctx.fillText(lastContribution.name, 500, 290);

      // Fancy gold subline
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(400, 315);
      ctx.lineTo(600, 315);
      ctx.stroke();

      // Detailed text statement wrapping helper
      const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        const words = text.split(" ");
        let line = "";
        let currentY = y;
        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + " ";
          let metrics = ctx.measureText(testLine);
          let testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + " ";
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
      };

      ctx.font = "15px sans-serif";
      ctx.fillStyle = "#44403C"; // Stone 700
      const descText = language === "hi"
        ? `जिन्होंने डिजिटल सेवा सैंडबॉक्स पहल के समर्थन में स्वेच्छा से ₹${lastContribution.amount} का दान देकर देश के ग्रामीण इलाकों में इंटरनेट साक्षरता, नागरिक प्रलेखन जागरूकता और ऑफलाइन-फर्स्ट उपकरणों के प्रसार में अपना बहुमूल्य योगदान दिया है।`
        : `In high recognition of their voluntary contribution of ₹${lastContribution.amount} to the National Digital Seva sandbox project, aiding in the development of open-source citizen documentation wizards and digital tool outreach.`;

      wrapText(descText, 500, 365, 760, 24);

      // Warning text
      ctx.font = "italic 11px sans-serif";
      ctx.fillStyle = "#78716C";
      ctx.fillText(
        language === "hi"
          ? "यह पूर्णतः स्वैच्छिक दान की सहयोग रसीद व प्रशस्ति पत्र है। प्रणाली के संचालन में सहायता के लिए हम कृतज्ञ हैं।"
          : "This is a voluntary donation acknowledgement. We appreciate your kind support to keep our sandbox servers running.",
        500, 480
      );

      // Signature & QR boundary separator line
      ctx.strokeStyle = "#E7E5E4";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(100, 530);
      ctx.lineTo(900, 530);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Draw left footer signature column
      ctx.textAlign = "left";
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = "#57534E";
      ctx.fillText("VERIFIED SANDBOX COMMUNITY CELL", 150, 575);
      
      ctx.font = "italic 14px Georgia, serif";
      ctx.fillStyle = "#FF5A2B";
      ctx.fillText("Digital Setu Team", 150, 610);

      ctx.font = "9px sans-serif";
      ctx.fillStyle = "#A8A29E";
      ctx.fillText("SewaNadu Platform - Supporting Indian Citizens", 150, 630);

      // Draw right footer transaction metadata verification column
      ctx.textAlign = "right";
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = "#57534E";
      ctx.fillText(`TRANSACTION ID: ${lastContribution.txnId}`, 850, 575);

      ctx.font = "11px sans-serif";
      ctx.fillStyle = "#78716C";
      ctx.fillText(`DATE OF CONTRIBUTION: ${lastContribution.date}`, 850, 605);

      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = "#10B981"; // Emerald
      ctx.fillText("✓ VOLUNTARY DONATION APPROVED", 850, 630);

      // Produce image download automatically
      const dataUri = canvas.toDataURL("image/png");
      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = dataUri;
      downloadAnchor.download = `sewanadu_donation_${lastContribution.txnId}.png`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);

      triggerToast(
        language === "hi"
          ? "प्रशंसा प्रमाण-पत्र सफलतापूर्वक डाउनलोड हो गया!"
          : "Appreciation certificate downloaded successfully!",
        "success"
      );
    } catch (err) {
      console.error(err);
      triggerToast(
        language === "hi" ? "डाउनलोड करने में त्रुटि आई।" : "Error downloading the certificate file.",
        "error"
      );
    }
  };

  const fundingPercentage = Math.min(100, Math.round((currentAmount / targetAmount) * 100));

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4 relative overflow-hidden" id="national-dev-fund-widget">
      {/* Decorative Warm subtle corner glow */}
      <span className="absolute -top-10 -right-10 w-24 h-24 bg-brand-coral/5 rounded-full blur-xl pointer-events-none"></span>

      {/* Header Banner info */}
      <div className="border-b border-stone-100 pb-3 flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-brand-coral shrink-0 animate-pulse fill-brand-coral" />
            <h3 className="font-extrabold text-stone-900 text-xs uppercase tracking-wider font-display">
              {language === "hi" ? "राष्ट्रीय डिजिटल सेवा दान" : "National Digital Seva Donation"}
            </h3>
          </div>
          <p className="text-[10px] text-stone-500 font-medium leading-relaxed">
            {language === "hi" 
              ? "ग्रामीण भारत में डिजिटल साक्षरता और त्वरित नागरिक संदूक सहायता टूल के संचालन में सहयोग करें।" 
              : "Support rural digital literacy, free platform sandbox development, and instant offline-first e-citizen tools."}
          </p>
        </div>
        <span className="text-[9px] font-mono font-bold bg-brand-coral/10 text-brand-coral px-2 py-0.5 rounded-full uppercase shrink-0 border border-brand-coral/15 animate-bounce">
          {language === "hi" ? "सर्वोत्तम स्थान" : "Top Choice"}
        </span>
      </div>

      {/* Progress Bar with beautiful visuals */}
      <div className="space-y-2">
        <div className="flex items-end justify-between font-mono text-[9px] font-bold text-stone-450 uppercase">
          <span>
            {language === "hi" ? "संग्रहित: " : "Collected: "}
            <span className="text-stone-900 font-extrabold">₹{currentAmount.toLocaleString()}</span>
          </span>
          <span>{fundingPercentage}%</span>
          <span>{language === "hi" ? "लक्ष्य: " : "Goal: "} ₹10L</span>
        </div>
        
        <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden flex" id="fund-progress-track">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${fundingPercentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="bg-gradient-to-r from-brand-coral via-orange-500 to-amber-500 h-full rounded-full"
          />
        </div>

        <div className="flex items-center justify-between text-[9px] text-stone-500 font-sans">
          <span className="flex items-center gap-1">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="font-medium">{contributors.length} {language === "hi" ? "सक्रिय देशभक्त" : "Generous Patrons"}</span>
          </span>
          <span className="font-semibold text-emerald-600">
            {language === "hi" ? "₹2,58,750 शेष है" : "₹2,58,750 remaining"}
          </span>
        </div>
      </div>

      {/* Immediate Preset Tiers (One-tap contribution trigger) */}
      <div className="grid grid-cols-3 gap-2">
        {presetTiers.map((tier) => (
          <button
            key={tier.value}
            onClick={() => {
              setSelectedPreset(tier.value);
              handleOpenPayment();
            }}
            className="flex flex-col items-center justify-center p-2.5 bg-brand-cream-card hover:bg-white border border-stone-200 rounded-xl transition hover:border-brand-coral hover:shadow-2xs text-left cursor-pointer group"
          >
            <span className="text-xs font-black text-stone-900 group-hover:text-brand-coral transition">₹{tier.value}</span>
            <span className="text-[8px] text-stone-450 font-medium truncate mt-0.5 max-w-full text-center">{tier.desc}</span>
          </button>
        ))}
      </div>

      {/* Main Unified Contribution Action CTA */}
      <button
        onClick={() => {
          setSelectedPreset(500);
          handleOpenPayment();
        }}
        className="w-full py-2.5 bg-gradient-to-r from-[#FF5A2B] to-[#FF7B47] hover:from-[#E0461C] hover:to-[#FF5A2B] text-white font-sans font-extrabold text-[11px] rounded-xl shadow-xs transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider"
        id="open-nation-fund-modal-btn"
      >
        <Landmark className="w-3.5 h-3.5 animate-bounce" />
        <span>{language === "hi" ? "स्वैच्छिक सहायता दान करें" : "Contribute & Get platform Certificate"}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Mini Roll of Honor (Displays latest contributors in extremely neat styling) */}
      <div className="bg-stone-50/70 border border-stone-150 rounded-xl p-3 space-y-2">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-stone-500" />
          <p className="text-[9px] font-mono font-bold text-stone-605 uppercase tracking-widest pl-0.5">
            {language === "hi" ? "लाइव दानदाता सम्मान पट:" : "Roll of Honor:"}
          </p>
        </div>

        <div className="space-y-2 max-h-24 overflow-y-auto scrollbar-none" id="donor-bulletin-board">
          {contributors.map((contrib, idx) => (
            <div key={idx} className="text-[9.5px] border-b border-stone-105 pb-1.5 last:border-0 last:pb-0 font-sans flex items-start justify-between gap-1.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-stone-900 truncate max-w-[125px]">{contrib.name}</span>
                  <span className="text-[8px] bg-amber-500/10 text-amber-700 px-1 rounded font-mono font-bold shrink-0">
                    ₹{contrib.amount}
                  </span>
                </div>
                <p className="text-[8.5px] text-stone-500 italic truncate" title={contrib.message}>
                  "{contrib.message}"
                </p>
              </div>
              <span className="text-[8px] text-stone-400 font-mono whitespace-nowrap pt-0.5">{contrib.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog overlay for checkout simulation */}
      <AnimatePresence>
        {paymentModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs select-none">
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-stone-200 p-5 space-y-4"
              id="payment-simulator-modal"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-brand-coral" />
                  <h3 className="text-xs font-display font-black text-stone-900 uppercase tracking-wide">
                    {language === "hi" ? "सुरक्षित पेमेंट गेटवे (सिम्युलेटर)" : "Secured Platform Gateway (Simulator)"}
                  </h3>
                </div>
                <button
                  onClick={() => setPaymentModalOpen(false)}
                  className="p-1 px-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 font-bold text-xs cursor-pointer transition border-0 outline-none"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSumbitPayment} className="space-y-3">
                {/* Donor details */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-stone-500 uppercase block">
                    {language === "hi" ? "दानदाता का पूरा नाम" : "Contributor Full Name"}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={32}
                    placeholder={language === "hi" ? "उदा. रमेश शर्मा" : "e.g. Ramesh Sharma"}
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-250 py-2 px-3 rounded-xl text-xs font-sans outline-none focus:border-brand-coral focus:bg-white text-stone-850"
                  />
                </div>

                {/* Optional Message */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-stone-500 uppercase block">
                    {language === "hi" ? "संदेश / विचार (वैकल्पिक)" : "Support Message (Optional)"}
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    placeholder={language === "hi" ? "डिजिटल इंडिया के उज्ज्वल भविष्य के लिए..." : "For a better digital tomorrow..."}
                    value={donorMessage}
                    onChange={(e) => setDonorMessage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-250 py-2 px-3 rounded-xl text-xs font-sans outline-none focus:border-brand-coral focus:bg-white text-stone-850"
                  />
                </div>

                {/* Contribution amount block */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-stone-500 uppercase block">
                    {language === "hi" ? "योगदान की राशि (INR)" : "Contribution Amount (INR)"}
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[100, 500, 2500].map((amount) => (
                      <button
                        type="button"
                        key={amount}
                        onClick={() => setSelectedPreset(amount)}
                        className={`py-1.5 text-center text-xs font-bold rounded-lg border transition cursor-pointer ${
                          selectedPreset === amount
                            ? "bg-brand-coral/15 border-brand-coral text-brand-coral"
                            : "bg-stone-50 border-stone-200 text-stone-705 hover:bg-stone-100"
                        }`}
                      >
                        ₹{amount}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSelectedPreset("custom")}
                      className={`py-1.5 text-center text-[10.5px] font-bold rounded-lg border transition cursor-pointer ${
                        selectedPreset === "custom"
                          ? "bg-brand-coral/15 border-brand-coral text-brand-coral"
                          : "bg-stone-50 border-stone-200 text-stone-705 hover:bg-stone-100"
                      }`}
                    >
                      {language === "hi" ? "अन्य राशि" : "Custom"}
                    </button>
                  </div>

                  {selectedPreset === "custom" && (
                    <div className="pt-2">
                      <input
                        type="number"
                        min="10"
                        max="100000"
                        required
                        placeholder={language === "hi" ? "राशि दर्ज करें (उदा. १५००)" : "Enter amount (e.g. 1500)"}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-250 py-2 px-3 rounded-xl text-xs font-sans outline-none focus:border-brand-coral focus:bg-white text-stone-850 placeholder:text-stone-400"
                      />
                    </div>
                  )}
                </div>

                {/* Simulated Payment Mode selects */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold text-stone-500 uppercase block">
                    {language === "hi" ? "भुगतान विधि का चयन करें" : "Select Payment Gateway"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition cursor-pointer ${
                        paymentMethod === "upi"
                          ? "bg-brand-coral/10 border-brand-coral text-brand-coral"
                          : "bg-stone-50 border-stone-200 text-stone-605"
                      }`}
                    >
                      <QrCode className="w-4 h-4 shrink-0" />
                      <span className="text-[9px] font-extrabold font-mono mt-1">UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition cursor-pointer ${
                        paymentMethod === "card"
                          ? "bg-brand-coral/10 border-brand-coral text-brand-coral"
                          : "bg-stone-50 border-stone-200 text-stone-605"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 shrink-0" />
                      <span className="text-[9px] font-extrabold font-mono mt-1">CARD</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("net")}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition cursor-pointer ${
                        paymentMethod === "net"
                          ? "bg-brand-coral/10 border-brand-coral text-brand-coral"
                          : "bg-stone-50 border-stone-200 text-stone-605"
                      }`}
                    >
                      <Landmark className="w-4 h-4 shrink-0" />
                      <span className="text-[9px] font-extrabold font-mono mt-1">BANK</span>
                    </button>
                  </div>
                </div>

                {/* If UPI option is chosen, show a dynamic QR mockup */}
                {paymentMethod === "upi" && (
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col items-center space-y-2 animate-fadeIn select-none">
                    <div className="w-24 h-24 bg-white border border-stone-150 p-2 rounded-lg relative flex items-center justify-center shadow-3xs">
                      <QrCode className="w-full h-full text-slate-800" />
                      <div className="absolute inset-0 flex items-center justify-center bg-stone-900/5 backdrop-blur-xs rounded-lg">
                        <span className="text-[7.5px] font-black text-white bg-slate-900 px-1 py-0.5 rounded shadow">
                          NPCI APPROVED
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-stone-600">
                      Amount: <span className="text-stone-900 font-extrabold">₹{getActiveAmount()}</span>
                    </span>
                    <p className="text-[7.5px] text-stone-400 font-sans text-center leading-tight">
                      Scan QR safely with BHIM, GPay, PhonePe, or Paytm simulator.
                    </p>
                  </div>
                )}

                {/* Secure Badge */}
                <div className="flex items-center gap-1.5 justify-center text-[9px] text-emerald-600 font-mono font-bold bg-emerald-50/50 border border-emerald-100 py-1.5 rounded-xl">
                  <ShieldCheck className="w-3.5 h-3.5 fill-emerald-100" />
                  <span>ISO 27001 PLATFORM SECURED TRANSACTIONS</span>
                </div>

                {/* Confirm Pay Button */}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-sans font-extrabold text-xs rounded-xl shadow-xs transition active:scale-[0.98] cursor-pointer text-center"
                >
                  {language === "hi" 
                    ? `₹${getActiveAmount()} सुरक्षित भुगतान करें` 
                    : `Pay ₹${getActiveAmount()} to Contribute`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success certificate module popup */}
      <AnimatePresence>
        {successModalOpen && lastContribution && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs select-none overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-200 p-6 space-y-4"
              id="success-certificate-modal"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <h3 className="text-xs font-display font-black text-stone-900 uppercase tracking-wider">
                    {language === "hi" ? "स्वैच्छिक आभार पत्र" : "Voluntary Appreciation Certificate"}
                  </h3>
                </div>
                <button
                  onClick={() => setSuccessModalOpen(false)}
                  className="p-1 px-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 font-bold text-xs cursor-pointer transition border-0 outline-none"
                >
                  ✕
                </button>
              </div>

              {/* Certificate Template */}
              <div className="p-5 border-4 border-double border-amber-600 bg-[#FCFBF7] rounded-2xl relative text-center space-y-4 shadow-inner min-h-[300px]">
                {/* Vintage Corner decorations */}
                <span className="absolute top-2 left-2 text-amber-600 font-mono text-[8px] select-none">❖</span>
                <span className="absolute top-2 right-2 text-amber-600 font-mono text-[8px] select-none">❖</span>
                <span className="absolute bottom-2 left-2 text-amber-600 font-mono text-[8px] select-none">❖</span>
                <span className="absolute bottom-2 right-2 text-amber-600 font-mono text-[8px] select-none">❖</span>

                <div className="space-y-1">
                  <p className="text-[8px] font-mono text-stone-400 font-extrabold uppercase tracking-widest leading-none">
                    SEWANADU VOLUNTARY COMMUNITY SANDBOX
                  </p>
                  <p className="text-[7.5px] font-mono text-red-500 font-bold uppercase tracking-tight bg-red-50 border border-red-100 p-1 rounded inline-block">
                    {language === "hi" 
                      ? "विशेष सूचना: यह भारत सरकार का प्रमाणपत्र नहीं है" 
                      : "NOTICE: NOT A GOVERNMENT ISSUED CERTIFICATE"}
                  </p>
                  <h4 className="font-display font-black text-stone-900 text-xs tracking-tight uppercase">
                    SEWANADU VOLUNTARY DIRECTORY
                  </h4>
                  <div className="w-8 h-px bg-stone-300 mx-auto"></div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-sans text-stone-505 italic">
                    {language === "hi" ? "यह सम्मान पत्र बड़े हर्ष एवं आभार के साथ प्रदान किया जाता है:" : "This certificate of appreciation is proudly presented to:"}
                  </p>
                  <p className="font-display font-black text-lg text-brand-coral tracking-tight">
                    {lastContribution.name}
                  </p>
                  <div className="w-20 h-px bg-amber-200 mx-auto"></div>
                </div>

                <p className="text-[10.5px] font-sans text-stone-605 max-w-xs mx-auto leading-relaxed">
                  {language === "hi" 
                    ? `जिन्होंने राष्ट्रीय डिजिटल सेवा दान में ₹${lastContribution.amount} का स्वेच्छा से योगदान देकर ग्रामीण भारत को डिजिटल रूप से साक्षर और सुदृढ़ बनाने के संकल्प में अतुल्य भूमिका निभाई है।`
                    : `In deep appreciation of their voluntary contribution of ₹${lastContribution.amount} to the National Digital Seva Sandbox initiative, supporting rural documentation awareness and digital tools.`}
                </p>

                {/* Footer Signature and QR verification */}
                <div className="grid grid-cols-2 gap-4 items-end pt-3 border-t border-dashed border-stone-200">
                  <div className="text-left space-y-1">
                    <p className="text-[8px] font-mono text-stone-450 uppercase leading-none">
                      VERIFIED SANDBOX COMMUNITY CELL
                    </p>
                    <div className="h-6 flex items-center">
                      <span className="font-mono text-[9px] text-[#FF5A2B] font-extrabold rotate-3 italic">
                        Digital Setu Team
                      </span>
                    </div>
                    <p className="text-[7.5px] font-sans text-stone-500 leading-none">
                      SewaNadu Platform Initiative
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-1 select-none">
                    <div className="w-12 h-12 bg-white border p-1 rounded-sm">
                      <QrCode className="w-full h-full text-stone-900" />
                    </div>
                    <span className="text-[7px] font-mono text-stone-400">
                      ID: {lastContribution.txnId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleDownloadCertificate}
                  className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-655 hover:from-amber-600 hover:to-amber-500 text-white font-sans font-extrabold text-[11px] uppercase tracking-wider rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center justify-center gap-1 border-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === "hi" ? "डाउनलोड प्रमाण-पत्र (PNG)" : "Download Certificate (PNG)"}</span>
                </button>
                <button
                  onClick={() => setSuccessModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-705 font-bold text-xs rounded-xl transition cursor-pointer border-0"
                >
                  {language === "hi" ? "वापस" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
