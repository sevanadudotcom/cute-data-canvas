import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Scale, 
  BookOpen, 
  Info, 
  Download, 
  FileText, 
  AlertTriangle, 
  Building2, 
  Globe2, 
  MapPin, 
  UserCheck, 
  HelpCircle,
  FileCheck2,
  Lock,
  Eye,
  Scroll,
  Handshake,
  CheckCircle2,
  Printer
} from "lucide-react";

interface LegalPortalProps {
  language: string;
  defaultSection?: "privacy" | "terms" | "rules" | "about" | "cookies" | "disclaimer";
  triggerToast: (msg: string, type?: "success" | "info" | "error") => void;
  onBackToServices?: () => void;
}

export default function LegalPortal({
  language,
  defaultSection = "about",
  triggerToast,
  onBackToServices
}: LegalPortalProps) {
  const [activeSection, setActiveSection] = useState<"privacy" | "terms" | "rules" | "about" | "cookies" | "disclaimer">(defaultSection);

  useEffect(() => {
    if (defaultSection) {
      setActiveSection(defaultSection);
    }
  }, [defaultSection]);

  const handlePrint = () => {
    triggerToast(
      language === "hi" 
        ? "दस्तावेज़ प्रिटिंग डायलॉग तैयार किया जा रहा है..." 
        : "Preparing printer-friendly document layout...",
      "info"
    );
    window.print();
  };

  const tabs = [
    {
      id: "about" as const,
      label_en: "About & Vision",
      label_hi: "हमारे बारे में",
      icon: Info,
      color: "text-blue-600 bg-blue-100/50"
    },
    {
      id: "privacy" as const,
      label_en: "Privacy Policy",
      label_hi: "गोपनीयता नीति",
      icon: Shield,
      color: "text-emerald-600 bg-emerald-100/50"
    },
    {
      id: "terms" as const,
      label_en: "Terms & Conditions",
      label_hi: "नियम एवं शर्तें",
      icon: Handshake,
      color: "text-amber-600 bg-amber-100/50"
    },
    {
      id: "cookies" as const,
      label_en: "Cookie Policy",
      label_hi: "कुकी नीति",
      icon: FileText,
      color: "text-purple-600 bg-purple-100/50"
    },
    {
      id: "disclaimer" as const,
      label_en: "Disclaimer",
      label_hi: "अस्वीकरण",
      icon: AlertTriangle,
      color: "text-red-600 bg-red-100/50"
    },
    {
      id: "rules" as const,
      label_en: "Rules & Regulations",
      label_hi: "नियम और विनियम",
      icon: Scroll,
      color: "text-stone-600 bg-stone-100/60"
    }
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-3xl shadow-xs overflow-hidden" id="national-legal-hub-page">
      {/* Visual Identity banner */}
      <div className="bg-stone-900 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#FF5A2B] via-white to-emerald-500"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                {language === "hi" ? "विकासक द्वारा लिखित एवं सरकारी नियमानुसार" : "Developer Curated & Govt Compliant"}
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                MeitY Compliant Standards
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black font-display tracking-tight text-white">
              {language === "hi" ? "प्रशासनिक नियमावली एवं प्रलेखन नीति केंद्र" : "Administrative Rules & Program Policies"}
            </h1>
            <p className="text-xs text-stone-400 max-w-xl font-sans leading-relaxed">
              {language === "hi"
                ? "यह संपूर्ण नियम, गोपनीयता नीति, विज्ञापन शर्तें और नियमावली हमारे विकासक (Developer) द्वारा स्वतंत्र रूप से विकसित की गई हैं, न कि सरकार द्वारा। हम नागरिकों की सुविधा के लिए सभी प्रासंगिक सरकारी नियमों, कानूनों और ई-सेवा शुल्कों का पूर्णतः पालन करते हैं।"
                : "This framework, privacy protocols, and digital terms have been fully drafted and maintained by our platform Developer (not the government). To ensure premium safety and precise simulation, we carefully conform to all relevant central and state government service guidelines."}
            </p>
          </div>

          <div className="flex flex-row gap-2 shrink-0">
            {onBackToServices && (
              <button
                onClick={onBackToServices}
                className="px-4 py-2 text-xs font-bold text-stone-300 hover:text-white hover:bg-white/10 uppercase tracking-wider rounded-xl transition border border-white/15 cursor-pointer"
              >
                {language === "hi" ? "वापस सेवा पर" : "Back to Services"}
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 border border-white/15 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              {language === "hi" ? "प्रिंट लें" : "Print Copy"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        {/* Sidebar Tabs - 3 Cols */}
        <div className="md:col-span-3 bg-stone-50/70 p-4 border-r border-stone-200 justify-between flex flex-col gap-6">
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest pl-2 block">
              {language === "hi" ? "दस्तावेज़ अनुभाग" : "DOCUMENT INDEX"}
            </span>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? "bg-white border-stone-200 shadow-xs text-[#FF5A2B] font-extrabold" 
                        : "bg-transparent border-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 font-semibold"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${tab.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs tracking-tight font-sans text-stone-800">
                      {language === "hi" ? tab.label_hi : tab.label_en}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-stone-100/90 rounded-2xl border border-stone-200 p-3 text-center space-y-1">
            <Building2 className="w-5 h-5 text-emerald-600 mx-auto" />
            <span className="text-[9px] font-extrabold text-stone-700 uppercase block tracking-wider">
              {language === "hi" ? "विकासक सत्यापित" : "Developer Secured"}
            </span>
            <span className="text-[8px] font-mono text-stone-500 block">
              Civic Literacy Initiative
            </span>
          </div>
        </div>

        {/* Content Page - 9 Cols */}
        <div className="md:col-span-9 p-6 sm:p-8 space-y-6">

          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-150 pb-4">
            <div className="flex items-center gap-2">
              {activeSection === "about" && <Info className="w-5 h-5 text-blue-600" />}
              {activeSection === "privacy" && <Shield className="w-5 h-5 text-emerald-600" />}
              {activeSection === "terms" && <Handshake className="w-5 h-5 text-amber-600" />}
              {activeSection === "cookies" && <FileText className="w-5 h-5 text-purple-600" />}
              {activeSection === "disclaimer" && <AlertTriangle className="w-5 h-5 text-red-650" />}
              {activeSection === "rules" && <Scroll className="w-5 h-5 text-stone-600" />}
              
              <h2 className="font-display font-black text-lg text-stone-900">
                {activeSection === "about" && (language === "hi" ? "हमारे बारे में" : "About India SewaNadu (Vision & Concepts)")}
                {activeSection === "privacy" && (language === "hi" ? "गोपनीयता नीति (Privacy Policy)" : "Privacy Policy (Standard Safe Protocols)")}
                {activeSection === "terms" && (language === "hi" ? "नियम और शर्तें (Terms & Conditions)" : "Terms & Conditions (User License Agreement)")}
                {activeSection === "cookies" && (language === "hi" ? "कुकी नीति (Cookie Policy)" : "Cookie Policy (Local Storage & Transparency)")}
                {activeSection === "disclaimer" && (language === "hi" ? "वेबसाइट अस्वीकरण (Disclaimer)" : "Website Disclaimer (Legal Liability Limits)")}
                {activeSection === "rules" && (language === "hi" ? "नियम और विनियम" : "Rules & Regulations (SLA & Standards)")}
              </h2>
            </div>
          </div>

          <div className="space-y-5 text-xs text-stone-600 leading-relaxed font-sans font-normal">
            
            {/* 1. ABOUT US PAGE */}
            {activeSection === "about" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-[#FF5A2B]/5 rounded-2xl border border-[#FF5A2B]/15 space-y-2">
                  <h4 className="font-extrabold text-stone-900 text-[13px] flex items-center gap-1.5 animate-fadeIn">
                    <Globe2 className="w-4 h-4 text-[#FF5A2B]" />
                    {language === "hi" ? "हमारा विजन: स्वतंत्र नागरिक कल्याण एवं दिशा-निर्देश" : "Our Vision: Independent Citizen Guidance & Education"}
                  </h4>
                  <p className="leading-relaxed text-stone-600">
                    {language === "hi"
                      ? "SewaNadu नागरिक ई-सेवा गाइड और प्रशासनिक सिमुलेशन मंच है। इस पोर्टल पर उपलब्ध सभी सामग्री, दिशानिर्देश और विशेषताएं हमारे स्वतंत्र विकासक (Developer) द्वारा बनाई और प्रबंधित की गई हैं, न कि सरकार द्वारा। हालाँकि, हम डिजिटल इंडिया के राष्ट्रीय मूल्यों का सम्मान करते हुए नागरिकों को जागरूक बनाने के लिए सभी प्रासंगिक राज्य एवं केंद्रीय सरकारी मानदंडों और दिशा-निर्देशों का अक्षरशः पालन करते हैं।"
                      : "SewaNadu is an independent citizen e-services directory and directory simulator. This platform and its digital capabilities are designed, maintained, and operated solely by the site developer, not by any government portal. In our effort to promote administrative literacy, we ensure full compliance with official guidelines to create a high-fidelity civic learning-oriented environment."}
                  </p>
                </div>

                <h3 className="font-extrabold text-[#FF5A2B] text-xs uppercase tracking-wider font-mono border-b border-stone-150 pb-1.5 pt-3">
                  {language === "hi" ? "डिजिटल साक्षरता और विकासक प्रतिबद्धता" : "Digital Literacy & Developer Compliance"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "हम स्पष्ट करना चाहते हैं कि यह मंच स्वतंत्र रूप से काम करता है। हमारे द्वारा प्रदान किए जाने वाले डेटा संसाधन और पात्रता कैलकुलेटर नागरिकों को सही कानूनों, आवश्यक फाइलों और समय-सीमाओं को समझने में मदद करना है। हम सरकार द्वारा निर्धारित शुल्क दिशानिर्देशों (जैसे मुफ़्त पंजीकरण योजनाएं) का पूरी तरह से प्रचार करते हैं ताकि बिचौलियों द्वारा नागरिकों के शोषण को रोका जा सके।"
                    : "To ensure absolute clarity: this application is managed exclusively by its technical developer (and does not represent the central government). We simulate data workflows solely to empower everyday citizens, helping them secure official criteria checklists, processing durations, and legitimate rate caps easily before they visit standard government centers."}
                </p>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "इस वेब पोर्टल पर एकीकृत विज्ञापन सेटिंग्स, विज्ञापन कोड और AdSense आंकड़े केवल विकासक के व्यक्तिगत प्रबंधन के लिए सहेजे और देखे जा सकते हैं। इस पोर्टल का कोई भी उपयोग या मुद्रीकरण विवरण विकासक के निजी प्रोजेक्ट के संधारण के लिए है।"
                    : "The implementation of monetized blocks, ad networks, and developer codes represents system configurations created strictly for the developer's upkeep and server maintenance, completely separate from general citizen usage."}
                </p>
              </div>
            )}

            {/* 2. PRIVACY POLICY */}
            {activeSection === "privacy" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-3 bg-emerald-50 text-emerald-850 rounded-2xl border border-emerald-150 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-[12px] text-emerald-900">{language === "hi" ? "विकासक द्वारा डेटा संरक्षण एवं मुद्रीकरण नियम" : "Developer Curated Information & Ads Security Policies"}</h5>
                    <p className="text-[11px] leading-relaxed font-normal text-emerald-800 mt-1">
                      {language === "hi"
                        ? "यह गोपनीयता नीति स्वतंत्र रूप से हमारे विकासक द्वारा तैयार की गई है, सरकारी विभाग द्वारा नहीं। हम भारत सरकार के गोपनीयता दिशा-निर्देशों और ग्राहक हितों का पूर्ण सम्मान करते हैं। इस पोर्टल पर उपयोग की जाने वाली विज्ञापन प्रणालियाँ (जैसे Google AdSense) और उनके विवरण केवल विकासक (Developer) के प्रोजेक्ट परीक्षण, अनुसंधान एवं मुद्रीकरण उद्देश्यों के लिए हैं; ये पोर्टल के आम उपयोगकर्ताओं के लिए नहीं हैं।"
                        : "Please note that this privacy policy is drafted entirely by the platform developer and not by any official government agency. However, we meticulously conform to all legal consumer privacy expectations. Important Ad Notice: All Google AdSense options, tracking configurations, and analytical scripts on this site are configured exclusively for the developer's testing and project sustenance. They do not constitute services or configurations for the portal's general users."}
                    </p>
                  </div>
                </div>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  1. {language === "hi" ? "डेटा संग्रहण की सीमाएं (स्थानीय और सुरक्षित)" : "Strict Personal Privacy Controls"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "SewaNadu किसी भी केंद्रीय डेटाबेस या बाहरी सर्वर पर उपयोगकर्ता का निजी डेटा अपलोड नहीं करता है। सभी नाम, काल्पनिक आधार नंबर, या शिकायत करेटेंशियल पूरी तरह से आपके ब्राउज़र के 'localStorage' में क्लाइंट-साइड स्तर पर संग्रहीत हैं। यह गोपनीयता अनुकूलन हमारे विकासक द्वारा विकसित किया गया है ताकि आपका डेटा पूरी तरह निजी बना रहे।"
                    : "SewaNadu operates on a client-side architecture. We never collect or transmit 12-digit Aadhaar simulation inputs, family earnings, or grievance summaries to external cloud servers. All simulated registrations are processed locally in your browser's private localStorage environment. This architecture was designed specifically by the developer to safeguard personal metadata."}
                </p>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  2. {language === "hi" ? "विज्ञापन नीति (केवल विकासक उपयोग हेतु)" : "AdSense and Analytics Declarations (Developer Utility)"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "Google AdSense द्वारा प्रयुक्त कुकीज़, विश्लेषणात्मक विवरण, स्लॉट विवरण और कोड विशुद्ध रूप से विकासक (Developer) के उपयोग, कोडिंग परीक्षण और डायग्नोस्टिक्स के लिए निर्धारित हैं। यह व्यवस्था विकासक के निजी डैशबोर्ड और मुद्रीकरण नियंत्रण के अंतर्गत आती है तथा इस साइट पर आने वाले बाह्य नागरिकों या उपयोगकर्ताओं के उपयोग या वित्तीय सेटअप के लिए उपलब्ध नहीं है।"
                    : "The runtime rendering of promotional assets or double-click cookies powered by Google AdSense behaves strictly as a developer utility for diagnostic feedback, hosting maintenance, and layout testing. These monetization statistics, configurations, and scripts belong solely to the administrator/developer account settings, with zero operational involvement or access permissions from portal end-users."}
                </p>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  3. {language === "hi" ? "आईटी अधिनियम (IT Act) अनुपालन" : "Standard IT Act (India) Regulatory Conformance"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "हालाँकि यह नीति विकासक द्वारा तैयार की गई है, हम कानून के अनुसार नागरिकों के व्यक्तिगत डेटा की सुरक्षा के लिए भारतीय सूचना प्रौद्योगिकी अधिनियम (IT Act 2000) की धारा 43A और उपभोक्ता अधिकारों के प्रत्येक सरकारी प्रावधान का पूर्णतः अनुकूलन व अनुपालन करते हैं।"
                    : "Our regional privacy framework, authored entirely by the developer, strictly conforms to Section 43A of the Indian Information Technology Act (2000) and associated statutory user safety regulations."}
                </p>
              </div>
            )}

            {/* 3. TERMS & CONDITIONS */}
            {activeSection === "terms" && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-stone-500 italic pb-2 border-b border-stone-150">
                  {language === "hi" ? "अंतिम संशोधन: 15 जून, 2026. विकासक द्वारा अनुमोदित प्रलेख।" : "Last Modified: June 15, 2026. Developer Curated for Educational Simulations."}
                </p>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  1. {language === "hi" ? "नियमों का विकासक घोषणापत्र" : "Aesthetic Standard & Portal Operational Limits"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "ये नियम और शर्तें स्वतंत्र रूप से हमारे मंच के विकासक द्वारा विकसित की गई हैं, और किसी भी सरकारी संगठन का सीधे प्रतिनिधित्व नहीं करती हैं। हम नागरिकों के कल्याण के लिए सरकारी कानूनों और आधिकारिक कार्यालय आवश्यकताओं का सावधानीपूर्वक सम्मान व अनुपालन करते हैं। इस पोर्टल का उपयोग केवल शैक्षणिक, जागरूकता और सूचनात्मक अनुभवों के लिए करने की अनुमति है।"
                    : "These terms of & conditions are written and maintained by the developer, not by any government ministry. To facilitate a constructive environment, we follow standard government guidelines, but note that the features provided are exclusively for educational simulations and preparatory checklists."}
                </p>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5 text-amber-900 my-2.5">
                  <span className="font-extrabold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    {language === "hi" ? "अस्वीकरण और सरकारी नियमों का अनुपालन:" : "Disclaimer & Official Regulation Alignment:"}
                  </span>
                  <p className="text-[10.5px] leading-relaxed text-amber-800">
                    {language === "hi"
                      ? "SewaNadu पर प्रस्तुत सभी सिमुलेशन गतिविधियां (जैसे डिजिटल लॉकर और शिकायत निवारण) केवल जानकारी को सुलभ बनाने के लिए हैं। किसी भी प्रमाणपत्र के वास्तविक आवेदन, सरकारी शुल्क भुगतान और सरकारी मुहरों के आधिकारिक सत्यापन के लिए नागरिकों को अपने संबंधित जिला ब्लॉक कार्यालय (तहसील) या अधिकृत नागरिक सेवा केंद्रों (CSC) पर आवेदन करना चाहिए।"
                      : "The credential previews, SDO verifications, and digital lockers on this platform are client-side simulations crafted by the developer. Official, legal certificates or real-world citizen financial grants must be secured through authentic state platforms or CSC local centers."}
                  </p>
                </div>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  2. {language === "hi" ? "विज्ञापन प्रतिबंध एवं AdSense सीमा (केवल विकासक उपयोग)" : "Advertising Controls & AdSense Limitation Details"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "इस वेब पोर्टल पर एकीकृत विज्ञापन सेटिंग्स, विज्ञापन कोड, एनालिटिक्स क्रेडेंशियल और AdSense आंकड़े केवल विकासक (Developer) के व्यक्तिगत प्रबंधन के लिए सहेजे और देखे जा सकते हैं। इस पोर्टल का कोई भी नागरिक उपयोगकर्ता विज्ञापन अभियान चलाने, अर्निंग टैब को ट्रैक करने, या वित्तीय व्यवस्था में सीधे बदलाव करने का हकदार नहीं है।"
                    : "The implementation of monetized blocks, ad networks, and developer codes represents system configurations created strictly for the developer's upkeep. General portal users retain zero permissions to inspect, modify, or control these developer monetization statistics."}
                </p>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  3. {language === "hi" ? "सुरक्षित उपयोग और स्पैम निषेध" : "Fair Use and Prohibited Spamming"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "इस वेब पोर्टल का उपयोग केवल व्यक्तिगत, गैर-व्यावसायिक, शैक्षणिक उद्देश्यों और जन कल्याण जागरूकता के लिए करने की अनुमति है। अनधिकृत बोट स्कैनिंग, संचलन क्रेडेंशियल चोरी, या दुर्भावनापूर्ण स्पैमिंग सख्त वर्जित है।"
                    : "By accessing this portal, you register agreement with our educational service guidelines. SewaNadu maintains directories, criteria checks, and credential simulations designed solely for civic training and eligibility previews. Malicious scrapers, brute-force form injections, or robotic traffic are strictly prohibited."}
                </p>
              </div>
            )}

            {/* 3.1 COOKIE POLICY */}
            {activeSection === "cookies" && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-stone-500 italic pb-2 border-b border-stone-150">
                  {language === "hi" ? "अंतिम संशोधन: 15 जून, 2026. कुकी पारदर्शिता नीति।" : "Last Modified: June 15, 2026. Cookie Transparency Policy."}
                </p>

                <div className="p-3 bg-purple-55 bg-indigo-50/50 text-indigo-950 rounded-2xl border border-indigo-150 flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-[12px] text-indigo-900">{language === "hi" ? "कुकीज़ और स्थानीय भंडारण (Local Storage) का विवरण" : "Detailed Cookies & Client Local Storage Transparency"}</h5>
                    <p className="text-[11px] leading-relaxed font-normal text-indigo-800 mt-1">
                      {language === "hi"
                        ? "हम इस वेबसाइट पर नागरिक सुविधा, सेटिंग्स को याद रखने और सेवाओं को कस्टमाइज़ करने के लिए आवश्यक कुकीज़ और ब्राउज़र लोकल स्टोरेज (localStorage) तकनीकों का उपयोग करते हैं। ये डेटा आपके डिवाइस तक ही सीमित रहता है और कभी भी किसी अनधिकृत बाहरी सर्वर पर अपलोड नहीं किया जाता।"
                        : "We use essential cookies and browser storage solutions (localStorage/sessionStorage) on this website to improve your user experience, retain language preferences (English/Hindi), track simulated grievance tickets, and remember your session data. This information stays on your local device and is never shared with third parties."}
                    </p>
                  </div>
                </div>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  1. {language === "hi" ? "स्थानीय भंडारण (Client-Side LocalStorage)" : "Essential Client-Side Storage"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "हमारे पोर्टल के अधिकांश हिस्से – जैसे 'डिजिटल लॉकर' और 'शिकायत सिमुलेटर' – आपके द्वारा भरे गए विवरणों को याद रखने के लिए ब्राउज़र के लोकल स्टोरेज का उपयोग करते हैं। इससे आपको बार-बार समान दस्तावेज़ अपलोड करने या फॉर्म भरने की आवश्यकता नहीं होती है। आप इसे अपने ब्राउज़र की सेटिंग्स में जाकर किसी भी समय पूरी तरह साफ (Clear) कर सकते हैं।"
                    : "The interactive portions of SewaNadu such as the 'DigiLocker Simulator' and 'Grievance Dashboard' rely heavily on browser-native localStorage. This temporary storage secures your simulated certificates and profile values locally, preventing tedious form re-inputs. You can clear this storage anytime through your browser's application settings."}
                </p>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  2. {language === "hi" ? "तृतीय-पक्ष कुकीज़ और विज्ञापन नेटवर्क (Mock AdSense & Analytics)" : "Third-Party & Marketing Cookies (Mock Analytics & Ads)"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "वेबसाइट को मुद्रीकृत करने, विश्लेषणात्मक विवरण दर्ज करने और लेआउट प्रदर्शन जांच के लिए Google AdSense या समान विज्ञापन कुकीज़ का परीक्षण किया जा सकता है। ये विश्लेषणात्मक कुकीज़ अनाम डेटा जैसे विज़िट की संख्या और बाउंस दर रिकॉर्ड करती हैं, जिससे हमें वेबसाइट को बेहतर बनाने में सहायता मिलती है।"
                    : "For testing server scaling configurations and visual layout performance, we may inspect mockup advertising cookies (including AdSense trackers or analytics web-beacons). These cookies capture non-personally identifiable browser metadata to analyze traffic trends and assure responsive rendering across mobile and desktop interfaces."}
                </p>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  3. {language === "hi" ? "कुकीज़ को नियंत्रित और निष्क्रिय करना" : "How to Manage & Disable Cookies"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "आप अपनी व्यक्तिगत प्राथमिकताओं के अनुसार अपने वेब ब्राउज़र की सेटिंग्स (Settings > Privacy) में जाकर इन कुकीज़ को ब्लॉक, अक्षम (Disable) या डिलीट कर सकते हैं। कृपया ध्यान दें कि कुकीज़ को अक्षम करने से पोर्टल के कुछ इंटरैक्टिव सिमुलेटर सुचारू रूप से कार्य नहीं कर पाएंगे।"
                    : "You can exercise your right to control cookies by adjusting your internet browser's privacy controls (usually located within the 'Settings' or 'Privacy' menu). Remember that blocklisting or deleting cookies entirely may cause certain simulated state layers (such as saving local grievance progress) to reset or operate incorrectly."}
                </p>
              </div>
            )}

            {/* 3.2 DISCLAIMER FOR THIS WEBSITE */}
            {activeSection === "disclaimer" && (
              <div className="space-y-4 animate-fadeIn">
                <p className="text-stone-500 italic pb-2 border-b border-stone-150">
                  {language === "hi" ? "अंतिम संशोधन: 15 जून, 2026. आधिकारिक वेबसाइट कानूनी अस्वीकरण।" : "Last Modified: June 15, 2026. Official Website Legal Disclaimer."}
                </p>

                <div className="p-3 bg-red-50 text-red-950 rounded-2xl border border-red-150 flex items-start gap-2.5 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-red-650 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-[12px] text-red-950">{language === "hi" ? "महत्वपूर्ण कानूनी सूचना एवं अस्वीकरण" : "CRITICAL INDEPENDENT STATUS DECLARATION"}</h5>
                    <p className="text-[11px] leading-relaxed font-normal text-red-800 mt-1">
                      {language === "hi"
                        ? "SewaNadu एक स्वतंत्र शैक्षिक सिमुलेशन और नागरिक ई-निर्देशिका सेवा है। इस मंच का किसी भी सरकारी विनियामक निकाय, केंद्रीय/राज्य प्रशासनिक प्राधिकरण, या सरकारी विभाग के साथ कोई सीधा वित्तीय, कानूनी या प्रशासनिक संबंध या संबद्धता नहीं है।"
                        : "SewaNadu is an independent portal simulator and educational directory. This platform maintains NO official partnership, financial agreement, endorsement, or direct association with any central ministry, state governance, or legal administrative body of the Republic of India."}
                    </p>
                  </div>
                </div>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  1. {language === "hi" ? "अनाधिकारिक सिमुलेशन की घोषणा" : "Non-Official Simulated Workflows"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "इस प्रलेख केंद्र और SewaNadu के सभी इंटरैक्टिव टूल (जैसे शिकायत सिमुलेटर, प्रलेख सत्यापन चक्र और डिजिटल लॉकर) नागरिकों को वास्तविक प्रशासनिक प्रक्रियाओं से परिचित कराने और सहायता करने के लिए विकासक द्वारा स्व-विकसित किए गए हैं। इस पोर्टल द्वारा उत्पन्न कोई भी प्रमाण पत्र, अनुमोदन पर्ची, या शिकायत रसीद वास्तविक दुनिया में कानूनी रूप से मान्य नहीं है।"
                    : "All mock approvals, virtual certificate generations, and digital locker states represent visual client-side simulations. These features are programmed solely for community awareness and educational prep work. They do not hold official legal authority, cannot be submitted as absolute proofs, and do not represent legally recognized government credentials."}
                </p>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  2. {language === "hi" ? "सटीकता और सूचनात्मक उद्देश्य" : "Information Accuracy & Sourcing Limits"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "यद्यपि हम इस वेबसाइट पर दी गई सभी सूचनाओं, पात्रता नियमों, सरकारी शुल्कों और समय-सीमाओं को आधिकारिक सरकारी दिशा-निर्देशों के अनुसार पूरी तरह अद्यतन और सटीक रखने का सर्वोत्तम प्रयास करते हैं, फिर भी किसी अप्रत्याशित बदलाव या त्रुटियों के प्रति हम कोई कानूनी जिम्मेदारी नहीं लेते। उपयोगकर्ताओं को सलाह दी जाती है कि किसी भी वित्तीय लेन-देन या औपचारिक सरकारी आवेदन के लिए आधिकारिक वेबसाइट या स्थानीय जिला block केंद्र (CSC) की अधिकारिक जानकारी को ही अंतिम मानें।"
                    : "While the site developer exerts maximum diligence to ensure that simulated fee schedules, required files lists, and processing durations are derived accurately from lawful statutory mandates, we offer no warranties regarding the ongoing real-time currency or completeness of the database. Users should independently cross-verify critical policy rules via official state sites before embarking on real filings."}
                </p>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  3. {language === "hi" ? "दायित्व की सीमा (No Liability)" : "Absolute Limitation of Liability"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "इस सिमुलेशन मंच के उपयोग से होने वाले किसी भी प्रत्यक्ष, अकस्मात या परिणामस्वरूप होने वाले नुकसान, असुविधा या वित्तीय व्यथा के लिए विकासक (Developer) या इसके सहयोगियों को कानूनी रूप से उत्तरदायी नहीं ठहराया जा सकता है। उपयोगकर्ता अपने विवेक पर इस शैक्षिक सेवा का उपयोग करने के लिए सहमत हैं।"
                    : "Under no legal theories or statutory laws will the site developer or any associated contributors be held liable for any direct, indirect, incidental, or consequential damage, loss of opportunities, or financial inconvenience stemming from the usage, reliance on, or inability to retrieve simulation features from SewaNadu."}
                </p>
              </div>
            )}

            {/* 4. RULES & REGULATIONS */}
            {activeSection === "rules" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-3.5 bg-purple-50 text-purple-900 border border-purple-150 rounded-2xl space-y-1.5 leading-normal">
                  <span className="font-extrabold flex items-center gap-1.5 text-[12px] text-purple-950">
                    <FileCheck2 className="w-4 h-4 text-purple-700 shrink-0" />
                    {language === "hi" ? "सरकारी सेवा विनियम - विकासक संकलन और अनुपालन" : "Central Digital Services Regulations - Curated Compilation"}
                  </span>
                  <p className="text-[11px] leading-relaxed font-normal text-purple-800">
                    {language === "hi"
                      ? "यह नियमावली पूर्णतः हमारे स्वतंत्र डेवलपर्स द्वारा सरकारी मानकों के आधार पर लिखी गई है ताकि नागरिकों को उनके लोक अधिकारों और आधिकारिक शुल्कों के बारे में शिक्षित किया जा सके।"
                      : "This regulatory compendium was drafted and organized by our team developer, not by any government ministry. However, we accurately present official government rules, processing time limits, and standard fee protocols to help citizens recognize operational transparency."}
                  </p>
                </div>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  1. {language === "hi" ? "आधिकारिक सामान्य सेवा केंद्र (CSC) सेवा शुल्क की मर्यादा नियमों का अनुपालन" : "CSC Service Fee Regulation Compliance"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "हम इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय (MeitY) के कानूनों का पूरा पालन करते हैं। सरकारी योजनाओं (जैसे आभा कार्ड, ई-श्रम, आयुष्मान भारत) के लिए अतिरिक्त शुल्क वसूलना प्रतिबंधित है। हमारे पोर्टल में शामिल प्रत्येक योजना का सिमुलेशन इसी शुल्क मर्यादा को ध्यान में रखकर विकासक द्वारा बनाया गया है।"
                    : "Under direct guidelines issued by MeitY, service caps for registering identity cards (like ABHA ID cards, UAN registrations) are regulated strictly. Our simulator perfectly abides by these consumer guidelines to educate you against administrative overpricing or deceptive fee structures."}
                </p>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  2. {language === "hi" ? "पारदर्शी प्रशासन और शिकायत समय-सीमा (SLA)" : "Official Administrative Turnaround Agreement (SLA)"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "प्रशासनिक नियमों में नागरिक चार्टर के अनुसार प्रत्येक प्रमाणपत्र (जाति, आय, निवास) को स्वीकृत/निरस्त करने के लिए तहसीलदार कार्यालय को 7 से 15 दिनों की समय-सीमा दी गई है। यह नियम वास्तविक तहसील प्रणालियों में पारदर्शिता सुनिश्चित करने के लिए है, जिसका विवरण हमारे पोर्टल में विकासक द्वारा समझाया गया है।"
                    : "We strictly guide users in conforming with central citizens' charters, which stipulate timelines from 7 to 15 days for standard certificate approvals (such as Caste or Income certificates). In compliance with government standards, our portal visualizes these timelines realistically to instruct citizens on their constitutional rights."}
                </p>

                <h3 className="font-bold text-[13px] text-stone-900 border-b border-stone-200 pb-1">
                  3. {language === "hi" ? "विज्ञापन एवं AdSense विशेषाधिकार" : "Developer Monetization and Administration Code"}
                </h3>
                <p className="text-stone-600">
                  {language === "hi"
                    ? "इस प्रलेखन के तहत यह अनिवार्य है कि Google AdSense और मुद्रीकरण से संबंधित सभी विज्ञापन कोड, नियंत्रण नीतियां और वित्तीय लाभ विकल्प केवल मूल विकासक (Developer) के लिए अनन्य रूप से आरक्षित हैं। पोर्टल का कोई भी उपभोक्ता या तृतीय-पक्ष इन परिसंपत्तियों या मुद्रीकरण सुविधाओं का उपभोग नहीं कर सकता है।"
                    : "All AdSense features, marketing placements, and testing properties embedded within this domain remain exclusively owned and utilized by the developer for platform diagnostic analytics. No external user or client holds rights to manage or access these publisher credentials or assets."}
                </p>
              </div>
            )}

          </div>

          {/* Interactive footer checklist confirming user understands policy rules */}
          <div className="bg-slate-50 border border-stone-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
            <div className="space-y-1 text-left">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {language === "hi" ? "नागरिक घोषणा" : "CITIZEN ATTESTATION COMPLETED"}
              </span>
              <p className="text-[10.5px] text-stone-600 leading-snug">
                {language === "hi"
                  ? "मैंने डॉक्टरसेतु नागरिक मार्गदर्शिका के नियमों, गोपनीयता शर्तों और विकासक अस्वीकरणों को पढ़ और समझ लिया है।"
                  : "I declare that I have reviewed the national directory parameters, AdSense transparency statements, and developer-crafted terms of service."}
              </p>
            </div>
            <button
              onClick={() => {
                triggerToast(
                  language === "hi" 
                    ? "घोषणा स्वीकार की गई! आधिकारिक नियमों के लिए नागरिक धन्यवाद।" 
                    : "Attestation recorded! Thank you for complying with the citizen code.",
                  "success"
                );
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-750 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer self-start sm:self-auto shadow-xs"
            >
              {language === "hi" ? "मंजूर करें" : "Accept & Comply"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
