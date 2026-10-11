import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  FileText,
  Scale,
  ExternalLink,
  ChevronRight,
  Printer,
  Sparkles,
  HelpCircle,
  Clock,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronDown,
} from "lucide-react";
import { CITIZEN_GUIDES, ESEVA_GLOSSARY, CitizenGuide, GlossaryTerm } from "@/data/citizen-guides";
import { Button } from "@/components/ui/button";

interface CitizenKnowledgeBaseProps {
  language: string;
  triggerToast?: (msg: string, type?: "success" | "info" | "error") => void;
  onNavigateToService?: (serviceId: string) => void;
  initialGuideId?: string | null;
}

export default function CitizenKnowledgeBase({
  language,
  triggerToast,
  onNavigateToService,
  initialGuideId,
}: CitizenKnowledgeBaseProps) {
  const isHi = language === "hi";

  const [activeView, setActiveView] = useState<"guides" | "glossary">("guides");
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(initialGuideId || CITIZEN_GUIDES[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [glossaryLetter, setGlossaryLetter] = useState<string>("ALL");

  const selectedGuide = useMemo(() => {
    return CITIZEN_GUIDES.find((g) => g.id === selectedGuideId) || CITIZEN_GUIDES[0];
  }, [selectedGuideId]);

  const categories = useMemo(() => {
    const list = [
      { id: "ALL", label: isHi ? "सभी विषय" : "All Topics" },
      { id: "IDENTITY", label: isHi ? "पहचान एवं जनसांख्यिकी" : "Identity & Aadhaar" },
      { id: "TAX_FINANCE", label: isHi ? "कर एवं वित्त" : "Taxes & PAN" },
      { id: "LEGAL_RTI", label: isHi ? "आरटीआई एवं कानूनी अधिकार" : "RTI & Legal" },
      { id: "REVENUE", label: isHi ? "राजस्व एवं प्रमाण पत्र" : "Revenue & Certificates" },
      { id: "TRANSPORT", label: isHi ? "परिवहन एवं ड्राइविंग" : "Transport & DL" },
      { id: "WELFARE", label: isHi ? "कृषि एवं कल्याण" : "Welfare & PM-Kisan" },
      { id: "GRIEVANCE", label: isHi ? "जन शिकायत निवारण" : "Grievance & CPGRAMS" },
    ];
    return list;
  }, [isHi]);

  const filteredGuides = useMemo(() => {
    return CITIZEN_GUIDES.filter((g) => {
      if (selectedCategory !== "ALL" && g.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = g.title.toLowerCase().includes(q) || g.titleHi.toLowerCase().includes(q);
        const inSummary = g.summary.toLowerCase().includes(q) || g.summaryHi.toLowerCase().includes(q);
        const inStatutory = g.statutoryBasis.toLowerCase().includes(q);
        return inTitle || inSummary || inStatutory;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const glossaryLetters = useMemo(() => {
    const letters = new Set<string>();
    ESEVA_GLOSSARY.forEach((item) => {
      const firstChar = item.term.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) letters.add(firstChar);
    });
    return ["ALL", ...Array.from(letters).sort()];
  }, []);

  const filteredGlossary = useMemo(() => {
    return ESEVA_GLOSSARY.filter((item) => {
      if (glossaryLetter !== "ALL") {
        if (!item.term.toUpperCase().startsWith(glossaryLetter)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.term.toLowerCase().includes(q) ||
          item.termHi.toLowerCase().includes(q) ||
          item.definition.toLowerCase().includes(q) ||
          item.definitionHi.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [glossaryLetter, searchQuery]);

  const handleCopyGuideSummary = (guide: CitizenGuide) => {
    const text = `${guide.title}\nStatutory Basis: ${guide.statutoryBasis}\nPortal: ${guide.officialPortal}\nSummary: ${guide.summary}`;
    navigator.clipboard.writeText(text);
    triggerToast?.(isHi ? "गाइड सारांश कॉपी किया गया" : "Guide summary copied to clipboard", "success");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in" id="citizen-knowledge-base-root">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-br from-[#0A2540] via-[#0E3A73] to-[#06182E] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#164E8A]/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#E85D04]/10 via-[#046A38]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/95 border border-white/15 text-xs font-mono font-medium">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>{isHi ? "आधिकारिक नागरिक ज्ञान केंद्र" : "CITIZEN EDITORIAL KNOWLEDGE BASE"}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
            {isHi
              ? "विस्तृत प्रशासनिक एवं ई-सेवा नागरिक मार्गदर्शिका"
              : "In-Depth Administrative & Citizen e-Service Manuals"}
          </h2>

          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-sans">
            {isHi
              ? "कानूनी अधिनियमों, समयसीमा (SLA), आवश्यक दस्तावेजों और पोर्टल प्रक्रियाओं के साथ तैयार की गई प्रामाणिक संदर्भ सामग्रियां — किसी भी सरकारी दफ्तर जाने से पहले पूरा विवरण समझें।"
              : "Exhaustive, statutory-grounded reference handbooks detailing legal acts, application procedures, SLA deadlines, alternative proofs, and RTI escalation paths."}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-blue-100">
            <span className="flex items-center gap-1.5 text-amber-200 font-semibold">
              <Scale className="w-3.5 h-3.5 text-brand-coral" />
              {isHi ? "सत्यता जांची गई" : "Statutorily Verified"}
            </span>
            <span className="hidden sm:inline text-blue-200/60">•</span>
            <span className="flex items-center gap-1.5 text-emerald-200 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {isHi ? "अद्यतन: सितंबर 2026" : "Updated: September 2026"}
            </span>
            <span className="hidden sm:inline text-blue-200/60">•</span>
            <span className="flex items-center gap-1.5 text-sky-200 font-semibold">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              {isHi ? "10+ विस्तृत पुस्तिकाएं व शब्दावली" : "10+ Comprehensive Guides & Legal Glossary"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Switcher: Guides vs Glossary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2 p-1 bg-brand-cream-card rounded-xl border border-border-subtle shadow-xs">
          <Button
            variant={activeView === "guides" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveView("guides")}
            className={`text-xs font-bold gap-2 ${
              activeView === "guides"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-charcoal-600 hover:text-stone-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            {isHi ? "मार्गदर्शिका पुस्तिकाएं" : "Citizen Handbooks"}
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {CITIZEN_GUIDES.length}
            </span>
          </Button>

          <Button
            variant={activeView === "glossary" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveView("glossary")}
            className={`text-xs font-bold gap-2 ${
              activeView === "glossary"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-charcoal-600 hover:text-stone-900"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            {isHi ? "प्रशासनिक शब्दावली कोष" : "Legal & Revenue Glossary"}
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {ESEVA_GLOSSARY.length}
            </span>
          </Button>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeView === "guides"
                ? isHi
                  ? "हस्तपुस्तिकाओं में खोजें..."
                  : "Search guides by keyword or Act..."
                : isHi
                  ? "प्रशासनिक शब्द खोजें (पट्टा, खसरा, NCL)..."
                  : "Search term (e.g. Patta, Khasra, NCL)..."
            }
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border-subtle bg-brand-cream-card text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-stone-700 bg-stone-100 rounded-full px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: GUIDES */}
      {activeView === "guides" && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 ${
                  selectedCategory === cat.id
                    ? "bg-brand-coral text-white shadow-xs font-bold"
                    : "bg-brand-cream-card border border-border-subtle text-charcoal-600 hover:bg-stone-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Guide Selector Column */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-mono font-bold text-stone-500 uppercase tracking-wider px-1">
                {isHi ? "उपलब्ध मार्गदर्शिकाएं" : "GUIDE DIRECTORY"} ({filteredGuides.length})
              </div>

              <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
                {filteredGuides.map((guide) => {
                  const isSelected = guide.id === selectedGuide.id;
                  return (
                    <div
                      key={guide.id}
                      onClick={() => setSelectedGuideId(guide.id)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-stone-900/10"
                          : "bg-brand-cream-card border-border-subtle hover:border-stone-400 hover:shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-white/15 text-white"
                              : "bg-brand-coral-soft text-brand-coral"
                          }`}
                        >
                          {isHi ? guide.categoryLabelHi : guide.categoryLabel}
                        </span>
                        <span
                          className={`text-[10px] font-mono flex items-center gap-1 font-semibold ${
                            isSelected ? "text-slate-200" : "text-stone-700 dark:text-slate-300"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {guide.readTime}
                        </span>
                      </div>

                      <h4
                        className={`text-xs font-bold leading-snug line-clamp-2 ${
                          isSelected ? "text-white" : "text-stone-900 dark:text-white"
                        }`}
                      >
                        {isHi ? guide.titleHi : guide.title}
                      </h4>

                      <p
                        className={`mt-1.5 text-[11.5px] leading-relaxed line-clamp-2 ${
                          isSelected ? "text-slate-200" : "text-stone-750 dark:text-slate-200"
                        }`}
                      >
                        {isHi ? guide.summaryHi : guide.summary}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-[10px] font-medium pt-2 border-t border-white/10 dark:border-stone-800">
                        <span className={isSelected ? "text-slate-200" : "text-stone-700 dark:text-slate-300 font-mono font-semibold"}>
                          {guide.statutoryBasis.split("&")[0].trim().slice(0, 32)}...
                        </span>
                        <ChevronRight
                          className={`w-3.5 h-3.5 transition-transform ${
                            isSelected ? "text-amber-400 translate-x-0.5" : "text-stone-600 dark:text-slate-300"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}

                {filteredGuides.length === 0 && (
                  <div className="p-8 text-center bg-brand-cream-card border border-dashed border-border-subtle rounded-2xl text-charcoal-500 text-xs">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-charcoal-400" />
                    {isHi ? "कोई मार्गदर्शिका नहीं मिली।" : "No guides matched your query."}
                  </div>
                )}
              </div>
            </div>

            {/* Guide Reader Column */}
            <div className="lg:col-span-8 bg-brand-cream-card rounded-3xl border border-border-subtle p-6 sm:p-8 shadow-xs space-y-6">
              {/* Reader Header */}
              <div className="border-b border-border-subtle pb-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md bg-stone-900 text-white">
                      {isHi ? selectedGuide.categoryLabelHi : selectedGuide.categoryLabel}
                    </span>
                    <span className="text-xs font-mono text-stone-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedGuide.readTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyGuideSummary(selectedGuide)}
                      className="h-8 text-xs font-semibold gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {isHi ? "कॉपी सारांश" : "Copy Summary"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      className="h-8 text-xs font-semibold gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      {isHi ? "प्रिंट" : "Print"}
                    </Button>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-display font-black text-stone-900 tracking-tight">
                  {isHi ? selectedGuide.titleHi : selectedGuide.title}
                </h1>

                {/* Statutory Basis Box */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 flex items-start gap-3">
                  <Scale className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <strong className="font-bold block text-amber-900">
                      {isHi ? "वैधानिक एवं कानूनी आधार:" : "Statutory Authority & Legal Basis:"}
                    </strong>
                    <span>{selectedGuide.statutoryBasis}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-sans">
                  {isHi ? selectedGuide.summaryHi : selectedGuide.summary}
                </p>

                {/* Direct Official Link CTA */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-stone-700 dark:text-slate-300 font-medium">
                    {isHi ? "आधिकारिक पोर्टल:" : "Official Nodal Portal:"}{" "}
                    <strong className="text-stone-900 dark:text-white font-bold">{selectedGuide.officialPortalName}</strong>
                  </div>
                  <a
                    href={selectedGuide.officialPortal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-coral hover:underline"
                  >
                    <span>{isHi ? "आधिकारिक पोर्टल खोलें" : "Open Government Portal"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Sections Breakdown */}
              <div className="space-y-6">
                {selectedGuide.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="space-y-3 pt-2 border-b border-border-subtle pb-6 last:border-b-0 last:pb-0"
                  >
                    <h3 className="text-base font-display font-black text-stone-900 tracking-tight flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-brand-coral rounded-full" />
                      {isHi ? sec.headingHi : sec.heading}
                    </h3>

                    <div className="space-y-2 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                      {sec.content.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>

                    {/* Operational Tips */}
                    {sec.tips && sec.tips.length > 0 && (
                      <div className="space-y-1.5 bg-blue-50/70 border border-blue-200/70 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                          <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                          <span>{isHi ? "महत्वपूर्ण प्रशासनिक निर्देश" : "Statutory Pro-Tip / Crucial Directive"}</span>
                        </div>
                        <ul className="space-y-1 text-xs text-blue-950 pl-5 list-disc">
                          {sec.tips.map((tip, tIdx) => (
                            <li key={tIdx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Checklist Requirements */}
                    {sec.checklist && sec.checklist.length > 0 && (
                      <div className="space-y-2 bg-emerald-50/60 border border-emerald-200/70 rounded-2xl p-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{isHi ? "अनिवार्य दस्तावेज सत्यापन चेकलिस्ट" : "Mandatory Verification Checklist"}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-950">
                          {sec.checklist.map((item, cIdx) => (
                            <div key={cIdx} className="flex items-start gap-2 bg-white/70 rounded-xl p-2 border border-emerald-100">
                              <span className="text-emerald-700 font-bold shrink-0">✓</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Guide-Specific FAQs */}
              {selectedGuide.faqs && selectedGuide.faqs.length > 0 && (
                <div className="pt-6 border-t border-border-subtle space-y-4">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-coral" />
                    <h3 className="text-sm font-bold text-stone-900 uppercase font-mono tracking-wider">
                      {isHi ? "सामान्य प्रश्नोत्तरी (FAQ)" : "FREQUENTLY ASKED QUESTIONS"}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {selectedGuide.faqs.map((faq, fIdx) => (
                      <div
                        key={fIdx}
                        className="rounded-2xl border border-border-subtle bg-white/80 p-4 space-y-1.5"
                      >
                        <h4 className="text-xs font-bold text-stone-900 flex items-start gap-2">
                          <span className="font-mono text-brand-coral font-bold shrink-0">Q:</span>
                          <span>{isHi ? faq.questionHi : faq.question}</span>
                        </h4>
                        <p className="text-xs text-charcoal-700 pl-4 leading-relaxed">
                          {isHi ? faq.answerHi : faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: GLOSSARY */}
      {activeView === "glossary" && (
        <div className="space-y-6">
          {/* Alphabet Index */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
            {glossaryLetters.map((letter) => (
              <button
                key={letter}
                onClick={() => setGlossaryLetter(letter)}
                className={`w-8 h-8 rounded-lg text-xs font-bold shrink-0 transition-all ${
                  glossaryLetter === letter
                    ? "bg-stone-900 text-white shadow-xs"
                    : "bg-brand-cream-card border border-border-subtle text-charcoal-600 hover:bg-stone-100"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((item, idx) => (
              <div
                key={idx}
                className="bg-brand-cream-card rounded-2xl border border-border-subtle p-5 space-y-2.5 shadow-xs hover:border-stone-400 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                    {item.category}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white font-display">
                    {item.term} <span className="text-stone-600 dark:text-slate-400 font-semibold">({item.termHi})</span>
                  </h4>
                </div>

                <p className="text-xs text-charcoal-700 dark:text-slate-300 leading-relaxed font-sans">
                  {isHi ? item.definitionHi : item.definition}
                </p>

                <div className="pt-2 border-t border-border-subtle flex items-start gap-2 text-[10px] text-stone-700 dark:text-slate-300 font-mono font-medium">
                  <Scale className="w-3 h-3 text-brand-coral shrink-0 mt-0.5" />
                  <span>{item.statutoryContext}</span>
                </div>
              </div>
            ))}

            {filteredGlossary.length === 0 && (
              <div className="col-span-full p-12 text-center bg-brand-cream-card border border-dashed border-border-subtle rounded-3xl text-charcoal-500 text-xs">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-charcoal-400" />
                {isHi ? "कोई प्रशासनिक शब्द नहीं मिला।" : "No glossary terms matched your query."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
