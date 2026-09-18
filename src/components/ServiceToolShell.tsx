import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ClipboardCheck, ExternalLink, Info, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceToolShellProps {
  kind: "rti" | "status";
  title: string;
  description: string;
  children: ReactNode;
}

export default function ServiceToolShell({ kind, title, description, children }: ServiceToolShellProps) {
  const isRti = kind === "rti";

  return (
    <main className="institutional-theme min-h-screen bg-brand-cream-bg font-sans text-charcoal-900">
      <div className="h-1 bg-gradient-to-r from-orange-500 via-brand-cream-card to-emerald-600" aria-hidden="true" />
      <header className="border-b border-border-subtle bg-brand-cream-card">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-2.5" aria-label="SewaNadu services home">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-public-blue text-on-primary">
              <Scale className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-base font-bold">SewaNadu</span>
              <span className="block truncate text-[10px] font-semibold uppercase text-charcoal-500">Independent citizen service guide</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Service tools">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/"><ArrowLeft /> Services</Link>
            </Button>
            <Button variant={isRti ? "default" : "ghost"} asChild className={isRti ? "bg-public-blue text-on-primary hover:bg-public-blue-hover" : ""}>
              <Link to="/rti"><Scale /><span className="hidden sm:inline">RTI filing</span></Link>
            </Button>
            <Button variant={!isRti ? "default" : "ghost"} asChild className={!isRti ? "bg-public-blue text-on-primary hover:bg-public-blue-hover" : ""}>
              <Link to="/status"><ClipboardCheck /><span className="hidden sm:inline">Track status</span></Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="border-b border-border-subtle bg-public-blue-soft">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 text-xs text-charcoal-700 sm:px-6 lg:px-8">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-public-blue" />
          <p><strong>Guidance and simulation only.</strong> This independent portal does not submit to, receive payments for, or retrieve live records from government systems.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="mb-2 font-mono text-xs font-bold uppercase text-public-blue">Citizen support tool</p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-charcoal-500 sm:text-base">{description}</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          {children}
          <aside className="space-y-5 border-t border-border-subtle pt-6 lg:sticky lg:top-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div>
              <h2 className="font-display text-base font-bold">Before you continue</h2>
              <ul className="mt-3 space-y-3 text-sm leading-5 text-charcoal-500">
                {isRti ? (
                  <>
                    <li>Write one focused request and identify the records or date range you need.</li>
                    <li>Use the official RTI Online portal for a real central-government filing.</li>
                    <li>State departments may use their own RTI portal or offline process.</li>
                  </>
                ) : (
                  <>
                    <li>Use the reference number shown on your acknowledgement or receipt.</li>
                    <li>This tracker reads simulations saved on this device and the sample records shown.</li>
                    <li>Use the issuing department’s official portal for live status.</li>
                  </>
                )}
              </ul>
            </div>
            <a href={isRti ? "https://rtionline.gov.in/" : "https://services.india.gov.in/"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-public-blue hover:text-public-blue-hover">
              Open official government portal <ExternalLink className="h-4 w-4" />
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}