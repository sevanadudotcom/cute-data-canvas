import { useState } from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import RtiFilingModal from "@/components/RtiFilingModal";
import ServiceToolShell from "@/components/ServiceToolShell";
import { LanguageProvider, useLanguage } from "@/LanguageContext";

export const Route = createFileRoute("/rti")({
  head: () => ({
    meta: [
      { title: "RTI Filing Guide & Simulator — SewaNadu" },
      { name: "description", content: "Prepare an RTI request, understand the ₹10 fee and BPL exemption, and generate a practice acknowledgement before filing on an official portal." },
      { property: "og:title", content: "RTI Filing Guide & Simulator — SewaNadu" },
      { property: "og:description", content: "A guided practice flow for preparing a Right to Information request in India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RtiPage,
});

function RtiPage() {
  return <ClientOnly fallback={<ToolLoading />}><LanguageProvider><RtiWorkspace /></LanguageProvider></ClientOnly>;
}

function RtiWorkspace() {
  const { language } = useLanguage();
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const triggerToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  };

  return (
    <ServiceToolShell kind="rti" title="Prepare an RTI request" description="Build a clear Right to Information request, review the fee or BPL exemption path, and save a practice reference for the status tracker.">
      <RtiFilingModal presentation="page" language={language} triggerToast={triggerToast} />
      {toast && <PageToast {...toast} />}
    </ServiceToolShell>
  );
}

function ToolLoading() {
  return (
    <main className="min-h-screen bg-brand-cream-bg p-6 sm:p-10 max-w-4xl mx-auto space-y-6 text-stone-800 font-sans">
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-brand-coral uppercase">
          Statutory Transparency Simulator
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-stone-900">
          Right to Information (RTI) Filing Guide & Application Simulator
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Prepare an unambiguous RTI application under Section 6(1) of the Right to Information Act 2005. Understand the ₹10 statutory application fee, Below Poverty Line (BPL) fee waiver provisions, First Appeal under Section 19(1), and generate a compliant practice draft before submitting on rtionline.gov.in.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
          <h2 className="text-sm font-bold text-stone-900">1. Statutory Timelines</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Standard queries must be resolved within 30 days. Queries concerning life and personal liberty require responses within 48 hours under Section 7(1).
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
          <h2 className="text-sm font-bold text-stone-900">2. Application Fee & BPL Exemption</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Central Government RTI requests require a ₹10 fee. Citizens holding Below Poverty Line (BPL) cards are completely exempt under Section 7(5).
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
          <h2 className="text-sm font-bold text-stone-900">3. Drafting Best Practices</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Ask for recorded documents, inspection of files, or certified material samples. Do not ask for opinions, interpretations, or hypothetical justifications.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
          <h2 className="text-sm font-bold text-stone-900">4. First & Second Appeals</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            If no reply is received in 30 days, file a First Appeal before the First Appellate Authority (FAA) under Section 19(1). Subsequent escalations proceed to the Central/State Information Commission.
          </p>
        </div>
      </div>
    </main>
  );
}

function PageToast({ message, type }: { message: string; type: "success" | "info" | "error" }) {
  const Icon = type === "success" ? CheckCircle2 : type === "error" ? AlertCircle : Info;
  return <div role="status" className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-2 rounded-md border border-border-subtle bg-brand-cream-card p-4 text-sm text-charcoal-900 shadow-xl"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-public-blue" />{message}</div>;
}