import React, { useState, useMemo, useCallback } from "react";
import {
  CheckCircle2,
  Circle,
  Check,
  FileText,
  Sparkles,
  Copy,
  Printer,
  RotateCcw,
  Search,
  Filter,
  Info,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Layers,
  FileCheck2,
  AlertCircle,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ESevaService } from "../types";
import { Switch } from "@/components/ui/switch";

interface ServiceDocumentChecklistProps {
  service: ESevaService;
  language: string;
  checkedDocs: Record<string, boolean>;
  onToggleDoc: (docName: string) => void;
  onBulkSetDocs?: (serviceId: string, docNames: string[], status: boolean) => void;
  triggerToast: (msg: string, type?: "success" | "info" | "error") => void;
  variant?: "overview" | "full";
  onNavigateToTab?: (tab: string) => void;
  updateDocuments?: string[];
}

function detectDocumentCategory(docName: string): {
  category: "IDENTITY" | "ADDRESS" | "FINANCE" | "EDUCATION" | "LAND" | "PHOTO" | "GENERAL";
  labelEn: string;
  labelHi: string;
  isDigiLocker: boolean;
  tipEn: string;
  tipHi: string;
} {
  const lower = docName.toLowerCase();

  if (lower.includes("aadhaar") || lower.includes("आधार")) {
    return {
      category: "IDENTITY",
      labelEn: "Identity Proof",
      labelHi: "पहचान प्रमाण",
      isDigiLocker: true,
      tipEn: "Digital masked copy or e-Aadhaar from DigiLocker / UIDAI is fully accepted.",
      tipHi: "डिजिलॉकर या यूआईडीएआई से डिजिटल मास्क ई-आधार पूर्णतः मान्य है।",
    };
  }
  if (lower.includes("pan") || lower.includes("पैन")) {
    return {
      category: "FINANCE",
      labelEn: "Tax & Finance",
      labelHi: "आय / कर प्रमाण",
      isDigiLocker: true,
      tipEn: "Instant e-PAN or physical PAN card copy. Accessible via DigiLocker.",
      tipHi: "डिजिटल ई-पैन या भौतिक पैन कार्ड प्रतिलिपि। डिजिलॉकर पर उपलब्ध।",
    };
  }
  if (lower.includes("ration") || lower.includes("राशन")) {
    return {
      category: "ADDRESS",
      labelEn: "Family / Food Supply",
      labelHi: "राशन / परिवार रिकॉर्ड",
      isDigiLocker: true,
      tipEn: "NFSA / State Public Distribution Smart Ration Card copy.",
      tipHi: "राष्ट्रीय खाद्य सुरक्षा (NFSA) / राज्य राशन कार्ड प्रति।",
    };
  }
  if (lower.includes("voter") || lower.includes("epic") || lower.includes("मतदाता")) {
    return {
      category: "IDENTITY",
      labelEn: "Electoral ID",
      labelHi: "मतदाता पहचान",
      isDigiLocker: true,
      tipEn: "Election Commission e-EPIC download or physical voter card.",
      tipHi: "निर्वाचन आयोग ई-एपिक डाउनलोड अथवा मूल वोटर कार्ड।",
    };
  }
  if (lower.includes("passport") || lower.includes("पासपोर्ट")) {
    return {
      category: "IDENTITY",
      labelEn: "Passport / Photo",
      labelHi: "पासपोर्ट / फोटो",
      isDigiLocker: false,
      tipEn: "Recent passport photograph (white background) or valid passport copy.",
      tipHi: "सफेद पृष्ठभूमि वाली हालिया पासपोर्ट आकार फोटो अथवा वैध पासपोर्ट।",
    };
  }
  if (lower.includes("photo") || lower.includes("फोटो") || lower.includes("तस्वीर")) {
    return {
      category: "PHOTO",
      labelEn: "Passport Photo",
      labelHi: "पासपोर्ट साइज फोटो",
      isDigiLocker: false,
      tipEn: "Clear recent color passport-size photograph with plain white or light background.",
      tipHi: "साफ पृष्ठभूमि के साथ हालिया रंगीन पासपोर्ट साइज फोटोग्राफ।",
    };
  }
  if (
    lower.includes("income") ||
    lower.includes("salary") ||
    lower.includes("आय") ||
    lower.includes("वेतन")
  ) {
    return {
      category: "FINANCE",
      labelEn: "Income Proof",
      labelHi: "आय प्रमाण",
      isDigiLocker: true,
      tipEn: "Tehsildar issued Income Certificate, Salary slip, or Form 16.",
      tipHi: "तहसीलदार द्वारा जारी आय प्रमाण पत्र या वेतन पर्ची।",
    };
  }
  if (
    lower.includes("bank") ||
    lower.includes("passbook") ||
    lower.includes("खाता") ||
    lower.includes("पासबुक")
  ) {
    return {
      category: "FINANCE",
      labelEn: "Banking Details",
      labelHi: "बैंक विवरण",
      isDigiLocker: false,
      tipEn: "First page of bank passbook or cancelled cheque displaying IFSC & A/C number.",
      tipHi: "बैंक पासबुक का प्रथम पृष्ठ या रद्द चेक जिसमें खाता संख्या व IFSC स्पष्ट हो।",
    };
  }
  if (
    lower.includes("land") ||
    lower.includes("khasra") ||
    lower.includes("khatauni") ||
    lower.includes("patta") ||
    lower.includes("survey") ||
    lower.includes("जमीन") ||
    lower.includes("खसरा")
  ) {
    return {
      category: "LAND",
      labelEn: "Land Record",
      labelHi: "भू-अभिलेख / खसरा",
      isDigiLocker: false,
      tipEn: "Recent certified RoR (Record of Rights), Khasra/Khatauni copy from Bhulekh portal.",
      tipHi: "भूलेख पोर्टल से प्रमाणित खतौनी / खसरा या अधिकार अभिलेख प्रति।",
    };
  }
  if (
    lower.includes("mark") ||
    lower.includes("board") ||
    lower.includes("school") ||
    lower.includes("college") ||
    lower.includes("प्रमाण") ||
    lower.includes("अंकसूची")
  ) {
    return {
      category: "EDUCATION",
      labelEn: "Academic Document",
      labelHi: "शैक्षणिक प्रमाण",
      isDigiLocker: true,
      tipEn: "Board mark sheet, migration or transfer certificate (fetchable via DigiLocker).",
      tipHi: "बोर्ड अंकतालिका या स्थानांतरण प्रमाण पत्र (डिजिलॉकर से प्राप्त किया जा सकता है)।",
    };
  }
  if (lower.includes("birth") || lower.includes("जन्म")) {
    return {
      category: "IDENTITY",
      labelEn: "Birth Record",
      labelHi: "जन्म प्रमाण",
      isDigiLocker: true,
      tipEn: "Municipal Corporation / Panchayat issued digital Birth Certificate.",
      tipHi: "नगर निगम या ग्राम पंचायत द्वारा जारी डिजिटल जन्म प्रमाण पत्र।",
    };
  }
  if (
    lower.includes("electricity") ||
    lower.includes("bill") ||
    lower.includes("gas") ||
    lower.includes("water") ||
    lower.includes("बिजली")
  ) {
    return {
      category: "ADDRESS",
      labelEn: "Utility / Address",
      labelHi: "उपयोगिता बिल / पता",
      isDigiLocker: false,
      tipEn: "Latest utility bill not older than 3 months showing applicant / head of family name.",
      tipHi: "3 माह से कम पुराना बिजली, पानी या गैस बिल।",
    };
  }

  return {
    category: "GENERAL",
    labelEn: "Supporting Document",
    labelHi: "सहायक दस्तावेज",
    isDigiLocker: false,
    tipEn: "Legible self-attested original scan copy (PDF or JPEG format under 2MB).",
    tipHi: "स्पष्ट स्व-प्रमाणित मूल स्कैन प्रति (PDF या JPEG 2MB से कम)।",
  };
}

export default function ServiceDocumentChecklist({
  service,
  language,
  checkedDocs,
  onToggleDoc,
  onBulkSetDocs,
  triggerToast,
  variant = "full",
  onNavigateToTab,
  updateDocuments = [],
}: ServiceDocumentChecklistProps) {
  const isHi = language === "hi";

  // Tab switch within checklist for fresh vs revision case
  const [caseType, setCaseType] = useState<"fresh" | "revision">("fresh");
  const [filterStatus, setFilterStatus] = useState<"all" | "have" | "needed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activeDocList = useMemo(() => {
    if (caseType === "revision" && updateDocuments.length > 0) {
      return updateDocuments;
    }
    return service.documentsRequired || [];
  }, [caseType, updateDocuments, service.documentsRequired]);

  // Document key prefix for separation
  const getKey = useCallback(
    (docName: string) => {
      return caseType === "fresh" ? `${service.id}-${docName}` : `${service.id}-revision-${docName}`;
    },
    [caseType, service.id],
  );

  // Stats calculation
  const totalCount = activeDocList.length;
  const haveCount = activeDocList.filter((doc) => !!checkedDocs[getKey(doc)]).length;
  const neededCount = totalCount - haveCount;
  const percentComplete = totalCount > 0 ? Math.round((haveCount / totalCount) * 100) : 0;
  const isAllReady = totalCount > 0 && haveCount === totalCount;

  // Filtered list based on search and status
  const filteredDocs = useMemo(() => {
    return activeDocList.filter((doc) => {
      const isChecked = !!checkedDocs[getKey(doc)];
      if (filterStatus === "have" && !isChecked) return false;
      if (filterStatus === "needed" && isChecked) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const catInfo = detectDocumentCategory(doc);
        const matchesName = doc.toLowerCase().includes(q);
        const matchesCategory =
          catInfo.labelEn.toLowerCase().includes(q) || catInfo.labelHi.toLowerCase().includes(q);
        return matchesName || matchesCategory;
      }
      return true;
    });
  }, [activeDocList, filterStatus, searchQuery, checkedDocs, getKey]);

  // Bulk handlers
  const handleMarkAll = (status: boolean) => {
    if (onBulkSetDocs) {
      const keys = activeDocList.map((doc) =>
        caseType === "fresh" ? doc : `revision-${doc}`,
      );
      onBulkSetDocs(service.id, keys, status);
    } else {
      activeDocList.forEach((doc) => {
        const key = getKey(doc);
        if (!!checkedDocs[key] !== status) {
          onToggleDoc(caseType === "fresh" ? doc : `revision-${doc}`);
        }
      });
    }

    triggerToast(
      status
        ? isHi
          ? `सभी ${totalCount} दस्तावेज "तैयार" चिह्नित किए गए`
          : `All ${totalCount} documents marked as ready in hand!`
        : isHi
          ? "चेकलिस्ट रीसेट कर दी गई"
          : "Checklist reset to uncollected.",
      status ? "success" : "info",
    );
  };

  // Copy checklist to clipboard
  const handleCopyChecklist = () => {
    const lines = [
      `📋 ${isHi ? "दस्तावेज चेकलिस्ट" : "Document Checklist"}: ${service.title}`,
      `🏢 ${isHi ? "विभाग" : "Department"}: ${service.department}`,
      `📊 ${isHi ? "तैयारी स्थिति" : "Readiness"}: ${haveCount}/${totalCount} (${percentComplete}%)`,
      "----------------------------------------",
      ...activeDocList.map((doc, idx) => {
        const isChecked = !!checkedDocs[getKey(doc)];
        return `${isChecked ? "[✓]" : "[ ]"} ${idx + 1}. ${doc} ${isChecked ? (isHi ? "(तैयार)" : "(Have)") : (isHi ? "(आवश्यक)" : "(Needed)")}`;
      }),
      "----------------------------------------",
      isHi
        ? "SewaNadu ई-सेवा नागरिक पोर्टल द्वारा जनरेटेड"
        : "Generated via SewaNadu Citizen e-Gov Portal",
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    triggerToast(
      isHi
        ? "चेकलिस्ट क्लिपबोर्ड पर कॉपी हो गई है!"
        : "Checklist copied to clipboard with current progress!",
      "success",
    );
  };

  // Print checklist
  const handlePrintChecklist = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      triggerToast(
        isHi
          ? "प्रिंट विंडो खोलने की अनुमति दें"
          : "Please allow pop-ups to print the checklist",
        "error",
      );
      return;
    }

    const itemsHtml = activeDocList
      .map((doc, idx) => {
        const isChecked = !!checkedDocs[getKey(doc)];
        const catInfo = detectDocumentCategory(doc);
        return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px; width: 40px; text-align: center; font-size: 16px;">
            ${isChecked ? "☑" : "☐"}
          </td>
          <td style="padding: 10px;">
            <div style="font-weight: bold; font-size: 14px; color: ${isChecked ? "#047857" : "#0f172a"};">
              ${idx + 1}. ${doc}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 3px;">
              ${isHi ? catInfo.labelHi : catInfo.labelEn} • ${isHi ? catInfo.tipHi : catInfo.tipEn}
            </div>
          </td>
          <td style="padding: 10px; width: 120px; text-align: right;">
            <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: ${isChecked ? "#dcfce7" : "#f1f5f9"}; color: ${isChecked ? "#166534" : "#475569"};">
              ${isChecked ? (isHi ? "तैयार / पास में है" : "READY IN HAND") : (isHi ? "एकत्र करना शेष" : "STILL NEEDED")}
            </span>
          </td>
        </tr>
      `;
      })
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${service.title} - Document Checklist</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; color: #0f172a; line-height: 1.5; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
            .progress-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0 0 5px 0; font-size: 20px;">${service.title}</h1>
            <p style="margin: 0; color: #64748b; font-size: 13px;">${service.department} • Official Civic Document Checklist</p>
          </div>
          <div class="progress-box">
            <strong>${isHi ? "तैयारी स्थिति" : "Preparation Progress"}:</strong> 
            ${haveCount} of ${totalCount} Documents Collected (${percentComplete}% Ready)
          </div>
          <table>
            <thead>
              <tr style="background: #f1f5f9; text-align: left; font-size: 12px; text-transform: uppercase;">
                <th style="padding: 8px;">Status</th>
                <th style="padding: 8px;">Required Document Name & Guidelines</th>
                <th style="padding: 8px; text-align: right;">State</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <p style="margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center;">
            Printed via SewaNadu Portal • Keep physical originals ready for counter verification.
          </p>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Compact variant for the Overview tab
  if (variant === "overview") {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4 font-sans">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-150 pb-3.5">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h4 className="font-display font-black text-stone-900 text-sm tracking-tight">
                {isHi ? "दस्तावेज तैयारी चेकलिस्ट" : "Required Documents Checklist"}
              </h4>
            </div>
            <p className="text-[11px] text-stone-500 leading-snug">
              {isHi
                ? "टॉगल करके चिह्नित करें कि आपके पास कौन से दस्तावेज पहले से उपलब्ध हैं।"
                : "Toggle each document you already have in hand to track your filing readiness."}
            </p>
          </div>

          {/* Readiness Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-xs font-mono font-black px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
                isAllReady
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : haveCount > 0
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-stone-100 border-stone-250 text-stone-600"
              }`}
            >
              {isAllReady ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  {isHi ? "पूर्णतः तैयार (100%)" : "100% Ready"}
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                  {haveCount}/{totalCount} {isHi ? "तैयार" : "Ready"} ({percentComplete}%)
                </>
              )}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px] text-stone-550 font-medium">
            <span>
              {isAllReady
                ? isHi
                  ? "✓ आपके पास सभी अनिवार्य दस्तावेज उपलब्ध हैं!"
                  : "✓ All required documents collected and ready!"
                : isHi
                  ? `${neededCount} और दस्तावेज एकत्र करने शेष हैं`
                  : `${neededCount} document(s) remaining to gather`}
            </span>
            <span className="font-mono font-bold text-stone-800">{percentComplete}%</span>
          </div>
          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isAllReady
                  ? "bg-emerald-500"
                  : percentComplete > 50
                    ? "bg-blue-600"
                    : "bg-orange-500"
              }`}
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Dynamic Checklist Items */}
        <div className="space-y-2 pt-1">
          {service.documentsRequired.map((doc, idx) => {
            const isChecked = !!checkedDocs[`${service.id}-${doc}`];
            const catInfo = detectDocumentCategory(doc);

            return (
              <div
                key={idx}
                onClick={() => onToggleDoc(doc)}
                className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 select-none ${
                  isChecked
                    ? "bg-emerald-50/40 border-emerald-250 hover:bg-emerald-50/60"
                    : "bg-stone-50/60 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
                      isChecked
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "bg-white border-stone-300 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-bold leading-tight ${
                          isChecked
                            ? "text-stone-600 line-through decoration-emerald-500/40"
                            : "text-stone-900"
                        }`}
                      >
                        {doc}
                      </span>
                      {catInfo.isDigiLocker && (
                        <span className="text-[9px] font-mono font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                          DigiLocker
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-500 block leading-tight truncate">
                      {isHi ? catInfo.tipHi : catInfo.tipEn}
                    </span>
                  </div>
                </div>

                {/* Simple Toggle Switch & Pill */}
                <div
                  className="flex items-center gap-2 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block ${
                      isChecked ? "text-emerald-700" : "text-stone-400"
                    }`}
                  >
                    {isChecked ? (isHi ? "मेरे पास है" : "I Have This") : isHi ? "शेष है" : "Needed"}
                  </span>
                  <Switch
                    checked={isChecked}
                    onCheckedChange={() => onToggleDoc(doc)}
                    aria-label={`Toggle ${doc}`}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Quick Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleMarkAll(!isAllReady)}
              className="text-[11px] font-bold text-stone-600 hover:text-stone-900 underline underline-offset-2 cursor-pointer"
            >
              {isAllReady
                ? isHi
                  ? "सभी अचिह्नित करें"
                  : "Unmark All"
                : isHi
                  ? "सभी को 'मेरे पास है' चिह्नित करें"
                  : "Mark All as Have"}
            </button>
            <span className="text-stone-300">•</span>
            <button
              type="button"
              onClick={handleCopyChecklist}
              className="text-[11px] font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3 text-stone-400" />
              <span>{isHi ? "कॉपी" : "Copy"}</span>
            </button>
          </div>

          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab("documents")}
              className="text-[11px] font-bold text-orange-650 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <span>{isHi ? "विस्तृत स्कैन गाइड देखें" : "View Full Scan Guidelines"}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Full detailed variant for the Documents tab
  return (
    <div className="space-y-6 font-sans" id="full-service-document-checklist">
      {/* Top Banner: Digital Standard Info */}
      <div className="p-4 bg-brand-cream-card border border-[#E9E6DC] rounded-2xl flex items-start gap-3.5">
        <Info className="w-5 h-5 text-brand-coral shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-xs text-stone-900 leading-none block font-bold">
            {isHi
              ? "डिजिटल स्कैन व संलग्नक निर्देश (MeitY Guidelines)"
              : "MeitY Digital Scans Submission Protocol:"}
          </strong>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            {isHi
              ? "सभी संलग्नक रंगीन मूल प्रति से स्कैन किए जाने चाहिए। फाइल साइज 2 MB से कम और प्रारूप PDF या JPEG होना चाहिए। सत्यापन के समय मूल दस्तावेज साथ रखें।"
              : "Scanned color copies must be uploaded. File sizes should strictly remain below 2 MB in PDF/JPEG format with at least 150 DPI resolution. Keep physical originals ready for counter verification."}
          </p>
        </div>
      </div>

      {/* Case Switcher: Fresh Case vs Revision Case */}
      {updateDocuments.length > 0 && (
        <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-2xl w-fit border border-stone-200">
          <button
            type="button"
            onClick={() => {
              setCaseType("fresh");
              setFilterStatus("all");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              caseType === "fresh"
                ? "bg-white text-stone-900 shadow-xs border border-stone-200"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHi ? "नवीन आवेदन (Fresh Application)" : "Fresh Case Issuance"}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 font-bold">
              {service.documentsRequired.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCaseType("revision");
              setFilterStatus("all");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              caseType === "revision"
                ? "bg-white text-stone-900 shadow-xs border border-stone-200"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
            <span>{isHi ? "संशोधन / सुधार (Correction / Update)" : "Correction & Revision"}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 font-bold">
              {updateDocuments.length}
            </span>
          </button>
        </div>
      )}

      {/* Dynamic Summary Card with Progress */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {caseType === "fresh"
                  ? isHi
                    ? "नवीन मामला"
                    : "FRESH CASE"
                  : isHi
                    ? "संशोधन मामला"
                    : "REVISION CASE"}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 font-medium">
                {isHi ? "दस्तावेज ट्रैकिंग विज़ार्ड" : "Document Readiness Wizard"}
              </span>
            </div>
            <h3 className="font-display font-black text-stone-900 text-base sm:text-lg tracking-tight">
              {isHi
                ? `${haveCount} में से ${totalCount} आवश्यक दस्तावेज तैयार हैं`
                : `${haveCount} of ${totalCount} Required Documents Ready in Hand`}
            </h3>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleMarkAll(!isAllReady)}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>
                {isAllReady
                  ? isHi
                    ? "रीसेट करें"
                    : "Reset All"
                  : isHi
                    ? "सभी को 'तैयार' चिह्नित करें"
                    : "Mark All Have"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCopyChecklist}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              title="Copy checklist text"
            >
              <Copy className="w-3.5 h-3.5 text-stone-500" />
              <span>{isHi ? "कॉपी" : "Copy"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintChecklist}
              className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-3xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isHi ? "प्रिंट / PDF" : "Print Checklist"}</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-stone-700">
              {isAllReady
                ? isHi
                  ? "🎉 बधाई! आप आवेदन प्रक्रिया शुरू करने के लिए 100% तैयार हैं।"
                  : "🎉 Great news! You have all required documents in hand to proceed."
                : isHi
                  ? `आवेदन दाखिल करने से पूर्व ${neededCount} दस्तावेज एकत्र करना आवश्यक है।`
                  : `Please arrange the remaining ${neededCount} document(s) before applying.`}
            </span>
            <span className="font-mono font-extrabold text-stone-900 text-sm">
              {percentComplete}%
            </span>
          </div>
          <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isAllReady
                  ? "bg-emerald-500"
                  : percentComplete > 50
                    ? "bg-blue-600"
                    : "bg-orange-500"
              }`}
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-stone-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterStatus === "all"
                  ? "bg-stone-900 text-white shadow-3xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {isHi ? "सभी दस्तावेज" : "All Documents"} ({totalCount})
            </button>

            <button
              type="button"
              onClick={() => setFilterStatus("needed")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filterStatus === "needed"
                  ? "bg-orange-600 text-white shadow-3xs"
                  : "bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/60"
              }`}
            >
              <Circle className="w-3 h-3 text-current" />
              <span>{isHi ? "एकत्र करना शेष" : "Still Needed"}</span> ({neededCount})
            </button>

            <button
              type="button"
              onClick={() => setFilterStatus("have")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                filterStatus === "have"
                  ? "bg-emerald-600 text-white shadow-3xs"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60"
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-current" />
              <span>{isHi ? "तैयार / पास में है" : "Already Have"}</span> ({haveCount})
            </button>
          </div>

          {/* Quick Search inside document list */}
          {totalCount > 3 && (
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHi ? "दस्तावेज खोजें..." : "Filter documents..."}
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium outline-none focus:border-stone-400 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Checklist Cards */}
      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
            <Info className="w-6 h-6 text-stone-400 mx-auto" />
            <h4 className="text-xs font-bold text-stone-800">
              {isHi ? "कोई दस्तावेज मेल नहीं खाता" : "No documents match this filter"}
            </h4>
            <p className="text-[11px] text-stone-500">
              {isHi
                ? "कृपया फिल्टर बदलें या सर्च क्वेरी हटाएं।"
                : "Try clearing your search query or selecting 'All Documents'."}
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterStatus("all");
                setSearchQuery("");
              }}
              className="text-xs font-bold text-orange-650 hover:underline pt-1 cursor-pointer"
            >
              {isHi ? "फिल्टर रीसेट करें" : "Reset Filters"}
            </button>
          </div>
        ) : (
          filteredDocs.map((doc, index) => {
            const key = getKey(doc);
            const isChecked = !!checkedDocs[key];
            const catInfo = detectDocumentCategory(doc);

            return (
              <div
                key={index}
                onClick={() => onToggleDoc(caseType === "fresh" ? doc : `revision-${doc}`)}
                className={`p-4 sm:p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none group ${
                  isChecked
                    ? "bg-emerald-50/30 border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-50/50 shadow-3xs"
                    : "bg-white border-stone-200/90 hover:border-stone-300 hover:bg-stone-50/50 shadow-3xs"
                }`}
              >
                {/* Left section: Checkbox + Info */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Custom animated checkbox */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-all duration-200 ${
                      isChecked
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-3xs"
                        : "bg-stone-50 border-stone-300 text-stone-400 group-hover:border-stone-400 group-hover:bg-white"
                    }`}
                  >
                    {isChecked ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span className="text-[10px] font-mono font-bold">{index + 1}</span>
                    )}
                  </div>

                  {/* Document Name and Metadata */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-sm font-bold leading-tight transition-colors ${
                          isChecked
                            ? "text-stone-600 line-through decoration-emerald-500/40"
                            : "text-stone-900"
                        }`}
                      >
                        {doc}
                      </h4>

                      {/* Category Badge */}
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                        {isHi ? catInfo.labelHi : catInfo.labelEn}
                      </span>

                      {/* DigiLocker Pill */}
                      {catInfo.isDigiLocker && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>DigiLocker</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-stone-500 leading-snug">
                      {isHi ? catInfo.tipHi : catInfo.tipEn}
                    </p>
                  </div>
                </div>

                {/* Right section: Toggle Switch with Status Badge */}
                <div
                  className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold block ${
                        isChecked ? "text-emerald-700" : "text-stone-600"
                      }`}
                    >
                      {isChecked
                        ? isHi
                          ? "✓ मेरे पास है"
                          : "✓ Ready in Hand"
                        : isHi
                          ? "एकत्र करना शेष"
                          : "Still Needed"}
                    </span>
                    <span className="text-[10px] text-stone-400 block font-sans">
                      {isChecked
                        ? isHi
                          ? "सत्यापित प्रति तैयार"
                          : "Marked as prepared"
                        : isHi
                          ? "टॉगल करके चिह्नित करें"
                          : "Click toggle when ready"}
                    </span>
                  </div>

                  <Switch
                    checked={isChecked}
                    onCheckedChange={() =>
                      onToggleDoc(caseType === "fresh" ? doc : `revision-${doc}`)
                    }
                    aria-label={`Toggle status of ${doc}`}
                    className="data-[state=checked]:bg-emerald-600 scale-110"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Completion Banner with Action to Procedure */}
      {isAllReady && onNavigateToTab && (
        <div className="p-5 bg-emerald-500 text-white rounded-3xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display font-black text-sm tracking-tight flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>
                {isHi
                  ? "सभी दस्तावेज तैयार हैं! अब आवेदन प्रक्रिया पर बढ़ें"
                  : "All Documents Ready! Proceed to Step-by-Step Procedure"}
              </span>
            </h4>
            <p className="text-xs text-emerald-100">
              {isHi
                ? "आपके पास ऑनलाइन ई-सेवा या भौतिक केंद्र पर जमा करने के सभी कागजात मौजूद हैं।"
                : "You have verified and arranged every mandatory attachment required by the department."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToTab("procedure")}
            className="px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>{isHi ? "आवेदन चरण देखें" : "View Step-by-Step Procedure"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
