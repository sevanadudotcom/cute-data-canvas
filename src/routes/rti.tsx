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

function ToolLoading() { return <main className="min-h-screen bg-brand-cream-bg p-8 text-sm text-charcoal-500">Loading RTI guide…</main>; }

function PageToast({ message, type }: { message: string; type: "success" | "info" | "error" }) {
  const Icon = type === "success" ? CheckCircle2 : type === "error" ? AlertCircle : Info;
  return <div role="status" className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-2 rounded-md border border-border-subtle bg-brand-cream-card p-4 text-sm text-charcoal-900 shadow-xl"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-public-blue" />{message}</div>;
}