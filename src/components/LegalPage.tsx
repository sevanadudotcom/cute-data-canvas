import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export interface LegalSection {
  heading: string;
  body: React.ReactNode;
}

interface LegalPageProps {
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
}

const NAV = [
  { to: "/about", label: "About" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
  { to: "/cookies", label: "Cookies" },
  { to: "/disclaimer", label: "Disclaimer" },
  { to: "/contact", label: "Contact" },
] as const;

export default function LegalPage({ title, subtitle, updated, sections }: LegalPageProps) {
  return (
    <div className="min-h-dvh bg-[#FCFBF7] text-stone-800 font-sans flex flex-col">
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <Link
            to="/"
            className="flex min-w-0 items-center gap-2 font-display font-black text-stone-900 text-base"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-coral to-orange-500 text-white">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="truncate">SewaNadu</span>
          </Link>
          <Link
            to="/"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to portal
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 sm:px-6 py-8 sm:py-12">
        <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-brand-coral">
          Legal &amp; Policy
        </p>
        <h1 className="mt-2 font-display text-2xl sm:text-4xl font-black tracking-tight text-stone-900">
          {title}
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-stone-600">{subtitle}</p>
        <p className="mt-2 text-xs font-mono uppercase tracking-wide text-stone-400">
          Last updated: {updated}
        </p>

        <div className="mt-8 space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-stone-900">
                {s.heading}
              </h2>
              <div className="mt-2 space-y-3 text-sm sm:text-[15px] leading-relaxed text-stone-600 [&_a]:text-brand-coral [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-6">
          <nav aria-label="Legal pages" className="flex flex-wrap gap-x-4 gap-y-2">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-xs font-bold text-stone-500 underline-offset-4 hover:text-brand-coral hover:underline"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <p className="mt-4 text-[11px] leading-relaxed text-stone-400">
            SewaNadu is an independent, non-governmental information portal. It is not affiliated
            with, endorsed by, or representing the Government of India or any State Government.
            Always verify details on the official portal before applying.
          </p>
        </div>
      </footer>
    </div>
  );
}
