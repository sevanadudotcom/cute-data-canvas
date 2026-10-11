import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, ShieldCheck, CheckCircle2, AlertCircle, Info } from "lucide-react";
import CitizenKnowledgeBase from "@/components/CitizenKnowledgeBase";
import { LanguageProvider, useLanguage } from "@/LanguageContext";
import { CITIZEN_GUIDES } from "@/data/citizen-guides";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Citizen Editorial Guides & Administrative Handbooks — SewaNadu" },
      {
        name: "description",
        content:
          "In-depth statutory guides and operational handbooks for Indian citizen e-services: Aadhaar MBU updates, PAN-Aadhaar linkage, RTI filing manual, DigiLocker validity, and Parivahan DL protocols.",
      },
      { property: "og:title", content: "Citizen Editorial Guides & Handbooks — SewaNadu" },
      {
        property: "og:description",
        content:
          "Exhaustive reference manuals detailing statutory acts, application workflows, SLA timelines, alternative proofs, and RTI escalation paths.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuidesPage,
});

function GuidesPage() {
  return (
    <ClientOnly fallback={<GuidesSSRPreRender />}>
      <LanguageProvider>
        <GuidesWorkspace />
      </LanguageProvider>
    </ClientOnly>
  );
}

function GuidesWorkspace() {
  const { language } = useLanguage();
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-dvh bg-brand-cream-bg text-charcoal-900 font-sans flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-border-subtle bg-white/90 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 font-display font-black text-stone-900 text-base">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-coral to-orange-500 text-white shadow-xs">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>SewaNadu</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 hidden sm:inline">
              Citizen Guides
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to Directory</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Guides Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <CitizenKnowledgeBase language={language} triggerToast={triggerToast} />
        {toast && <PageToast {...toast} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-brand-cream-card py-8 text-xs text-charcoal-500 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© 2026 SewaNadu. Independent Citizen e-Governance Reference & Educational Guide.</p>
          <div className="flex justify-center gap-4 text-stone-600 font-medium">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/disclaimer" className="hover:underline">Disclaimer</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PageToast({ message, type }: { message: string; type: "success" | "info" | "error" }) {
  const Icon = type === "success" ? CheckCircle2 : type === "error" ? AlertCircle : Info;
  return (
    <div
      role="status"
      className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-2.5 rounded-xl border border-border-subtle bg-brand-cream-card p-4 text-xs font-semibold text-charcoal-900 shadow-xl"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-public-blue" />
      <span>{message}</span>
    </div>
  );
}

function GuidesSSRPreRender() {
  return (
    <main className="min-h-screen bg-brand-cream-bg p-8 max-w-5xl mx-auto space-y-6 text-stone-800 font-sans">
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-brand-coral uppercase">Editorial Knowledge Base</span>
        <h1 className="text-3xl font-display font-black text-stone-900">
          Indian Citizen e-Service Manuals & Statutory Handbooks
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Comprehensive, statutory-grounded reference handbooks detailing legal acts, application procedures, SLA deadlines, alternative proofs, and RTI escalation paths.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CITIZEN_GUIDES.map((guide) => (
          <article key={guide.id} className="p-5 bg-white rounded-2xl border border-stone-200 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase text-brand-coral">{guide.categoryLabel}</span>
            <h2 className="text-base font-bold text-stone-900">{guide.title}</h2>
            <p className="text-xs text-stone-600">{guide.summary}</p>
            <p className="text-[11px] font-mono text-stone-400">Statutory Basis: {guide.statutoryBasis}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
