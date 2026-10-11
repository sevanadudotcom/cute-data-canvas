import { useState } from "react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import StatusCheckModal from "@/components/StatusCheckModal";
import ServiceToolShell from "@/components/ServiceToolShell";
import { LanguageProvider, useLanguage } from "@/LanguageContext";

export const Route = createFileRoute("/status")({
  head: () => ({
    meta: [
      { title: "Service Application Status Tracker — SewaNadu" },
      { name: "description", content: "Track SewaNadu practice RTI and service references, explore application milestones, and find the correct official portal for live status." },
      { property: "og:title", content: "Service Application Status Tracker — SewaNadu" },
      { property: "og:description", content: "Review application milestones for saved practice references and sample Indian public-service cases." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StatusPage,
});

function StatusPage() {
  return <ClientOnly fallback={<ToolLoading />}><LanguageProvider><StatusWorkspace /></LanguageProvider></ClientOnly>;
}

function StatusWorkspace() {
  const { language } = useLanguage();
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const triggerToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  };

  return (
    <ServiceToolShell kind="status" title="Track a service application" description="Enter a saved practice reference or open a sample case to review its verification milestones and next steps.">
      <StatusCheckModal presentation="page" language={language} triggerToast={triggerToast} />
      {toast && <PageToast {...toast} />}
    </ServiceToolShell>
  );
}

function ToolLoading() {
  return (
    <main className="min-h-screen bg-brand-cream-bg p-6 sm:p-10 max-w-4xl mx-auto space-y-6 text-stone-800 font-sans">
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-brand-coral uppercase">
          Application Tracking & Milestones
        </span>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-stone-900">
          Service Application Status Tracker & Portal Finder
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Track practice service applications, monitor government verification milestones (Document Scrutiny, Field Verification by VAO/Patwari, Sub-Divisional Approval, Digital Dispatch), and link directly to official state e-District or central portal tracking dashboards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
          <h2 className="text-sm font-bold text-stone-900">1. Verification Milestones</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Understand standard revenue workflow stages: Application Receipt &rarr; Scrutiny by Dealing Hand &rarr; Field Enquiry Report &rarr; Competent Authority Sanction &rarr; Digitally Signed Dispatch.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
          <h2 className="text-sm font-bold text-stone-900">2. Service Level Agreement (SLA)</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Most state public services guarantee delivery within 15-30 days. If the status remains pending past the SLA, reference numbers can be escalated to state appellate authorities.
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