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

function ToolLoading() { return <main className="min-h-screen bg-brand-cream-bg p-8 text-sm text-charcoal-500">Loading status tracker…</main>; }

function PageToast({ message, type }: { message: string; type: "success" | "info" | "error" }) {
  const Icon = type === "success" ? CheckCircle2 : type === "error" ? AlertCircle : Info;
  return <div role="status" className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-2 rounded-md border border-border-subtle bg-brand-cream-card p-4 text-sm text-charcoal-900 shadow-xl"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-public-blue" />{message}</div>;
}