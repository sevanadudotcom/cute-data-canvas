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

export default function ServiceToolShell({
  kind,
  title,
  description,
  children,
}: ServiceToolShellProps) {
  const isRti = kind === "rti";

  return (
    <main className="institutional-theme min-h-screen bg-brand-cream-bg font-sans text-charcoal-900">
      <div className="flex h-1 select-none" aria-hidden="true">
        <span className="w-1/3 bg-[#FF671F]" title="Tiranga Kesari" />
        <span className="w-1/3 bg-white border-y border-stone-200/50" title="Tiranga White" />
        <span className="w-1/3 bg-[#046A38]" title="Tiranga Green" />
      </div>
      <header className="border-b border-border-subtle bg-brand-cream-card">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5"
            aria-label="SewaNadu services home"
          >
            <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0A2E5C] to-[#061F3F] text-amber-300 shadow-xs ring-1 ring-[#0A2E5C]/20 dark:ring-white/10">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <line
                    key={deg}
                    x1="12"
                    y1="12"
                    x2={12 + 9 * Math.cos((deg * Math.PI) / 180)}
                    y2={12 + 9 * Math.sin((deg * Math.PI) / 180)}
                    stroke="currentColor"
                    strokeWidth="0.8"
                  />
                ))}
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-[#E85D04] ring-2 ring-white dark:ring-slate-900 text-[7px] text-white font-black">
                ✓
              </span>
            </span>
            <span className="min-w-0">
              <span className="block font-display text-base font-bold">
                SewaNadu <span className="text-xs font-bold text-[#E85D04]">सेवानाडु</span>
              </span>
              <span className="block truncate text-[10px] font-bold uppercase text-stone-700 dark:text-slate-300">
                Independent citizen service guide
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Service tools">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/">
                <ArrowLeft /> Services
              </Link>
            </Button>
            <Button
              variant={isRti ? "default" : "ghost"}
              asChild
              className={isRti ? "bg-public-blue text-on-primary hover:bg-public-blue-hover" : ""}
            >
              <Link to="/rti">
                <Scale />
                <span className="hidden sm:inline">RTI filing</span>
              </Link>
            </Button>
            <Button
              variant={!isRti ? "default" : "ghost"}
              asChild
              className={!isRti ? "bg-public-blue text-on-primary hover:bg-public-blue-hover" : ""}
            >
              <Link to="/status">
                <ClipboardCheck />
                <span className="hidden sm:inline">Track status</span>
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="border-b border-border-subtle bg-public-blue-soft">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 text-xs text-charcoal-700 sm:px-6 lg:px-8">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-public-blue" />
          <p>
            <strong>Guidance and simulation only.</strong> This independent portal does not submit
            to, receive payments for, or retrieve live records from government systems.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="mb-2 font-mono text-xs font-bold uppercase text-public-blue">
            Citizen support tool
          </p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl text-charcoal-900">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-charcoal-700 sm:text-base">{description}</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          {children}
          <aside className="space-y-5 border-t border-border-subtle pt-6 lg:sticky lg:top-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div>
              <h2 className="font-display text-base font-bold text-charcoal-900">Before you continue</h2>
              <ul className="mt-3 space-y-3 text-sm leading-5 text-charcoal-700">
                {isRti ? (
                  <>
                    <li>
                      Write one focused request and identify the records or date range you need.
                    </li>
                    <li>
                      Use the official RTI Online portal for a real central-government filing.
                    </li>
                    <li>State departments may use their own RTI portal or offline process.</li>
                  </>
                ) : (
                  <>
                    <li>Use the reference number shown on your acknowledgement or receipt.</li>
                    <li>
                      This tracker reads simulations saved on this device and the sample records
                      shown.
                    </li>
                    <li>Use the issuing department’s official portal for live status.</li>
                  </>
                )}
              </ul>
            </div>
            <a
              href={isRti ? "https://rtionline.gov.in/" : "https://services.india.gov.in/"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-public-blue hover:text-public-blue-hover"
            >
              Open official government portal <ExternalLink className="h-4 w-4" />
            </a>
          </aside>
        </div>
      </div>
    </main>
  );
}
