import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle, ArrowLeft, BadgeCheck, CalendarClock, CheckCircle2, FileText,
  IndianRupee, ListOrdered, Loader2, MapPin, Scale, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JURISDICTIONS } from "@/services-data";
import { getAiServiceAdvice, type AdvisorResult } from "@/lib/advisor.functions";

export const Route = createFileRoute("/advisor")({
  head: () => ({
    meta: [
      { title: "AI Service Advisor — SewaNadu" },
      { name: "description", content: "Describe your situation in your own words and get AI-recommended Indian government services with the documents, fees and next steps explained." },
      { property: "og:title", content: "AI Service Advisor — SewaNadu" },
      { property: "og:description", content: "Describe your situation and get AI-recommended government services with clear next steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdvisorPage,
});

const EXAMPLES = [
  "I just moved to Karnataka for work and need proof of local address for my bank",
  "I am a small farmer in Maharashtra and need a loan for the next sowing season",
  "My daughter is changing schools from Uttar Pradesh to Delhi — what papers do we need?",
  "I lost my job in Tamil Nadu and want to know what government support exists",
];

function jurisdictionLabel(id: string): string {
  if (id === "central") return "Central Government";
  return JURISDICTIONS.find((j) => j.id === id)?.name ?? id;
}

function AdvisorPage() {
  const [situation, setSituation] = useState("");
  const [stateId, setStateId] = useState("all");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvisorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ask = async () => {
    const text = situation.trim();
    if (text.length < 10 || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const advice = await getAiServiceAdvice({ data: { situation: text, stateId } });
      setResult(advice);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="institutional-theme min-h-screen bg-brand-cream-bg font-sans text-charcoal-900">
      <div className="flex h-1" aria-hidden="true">
        <span className="w-1/3 bg-orange-500" />
        <span className="w-1/3 bg-brand-cream-card" />
        <span className="w-1/3 bg-emerald-600" />
      </div>
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
            <Button variant="default" asChild className="bg-public-blue text-on-primary hover:bg-public-blue-hover">
              <Link to="/advisor"><Sparkles /><span className="hidden sm:inline">AI advisor</span></Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="border-b border-border-subtle bg-public-blue-soft">
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3 text-xs text-charcoal-700 sm:px-6 lg:px-8">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-public-blue" />
          <p><strong>AI guidance, not official advice.</strong> Recommendations come from an AI model over the SewaNadu catalogue. Always confirm requirements and fees on the issuing department's official portal before you apply.</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="mb-2 font-mono text-xs font-bold uppercase text-public-blue">Citizen support tool</p>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Tell us your situation — we'll find the service</h1>
          <p className="mt-3 text-sm leading-6 text-charcoal-500 sm:text-base">
            Describe what you need in your own words — a document, a scheme, a life event. The AI advisor matches it against the pan-India catalogue and explains the next steps.
          </p>
        </div>

        <section className="rounded-lg border border-border-subtle bg-brand-cream-card p-5 sm:p-6">
          <label htmlFor="situation" className="block font-display text-base font-bold">What is your situation?</label>
          <textarea
            id="situation"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={5}
            maxLength={1200}
            placeholder="e.g. I live in Bihar and need a domicile certificate for my son's college admission outside the state…"
            className="mt-3 w-full rounded-md border border-border-subtle bg-brand-cream-bg p-3 text-sm leading-6 text-charcoal-900 outline-none focus:border-public-blue focus:ring-3 focus:ring-public-blue/10"
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="sm:w-64">
              <label htmlFor="state" className="block text-xs font-bold uppercase text-charcoal-500">State / UT (optional)</label>
              <select
                id="state"
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-border-subtle bg-brand-cream-bg px-2 text-sm font-bold text-charcoal-900 outline-none focus:border-public-blue"
              >
                <option value="all">Anywhere in India</option>
                {JURISDICTIONS.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
              </select>
            </div>
            <Button
              onClick={ask}
              disabled={loading || situation.trim().length < 10}
              className="h-10 bg-public-blue text-on-primary hover:bg-public-blue-hover sm:ml-auto"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {loading ? "Analyzing…" : "Find matching services"}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setSituation(ex)}
                disabled={loading}
                className="rounded-full border border-border-subtle bg-brand-cream-bg px-3 py-1.5 text-left text-xs font-semibold text-charcoal-700 transition hover:border-public-blue hover:text-public-blue disabled:opacity-50"
              >
                {ex}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <div className="mt-8 space-y-3" aria-live="polite">
            <div className="h-5 w-72 animate-pulse rounded bg-border-subtle" />
            <div className="h-20 animate-pulse rounded-lg bg-border-subtle/60" />
            <div className="h-40 animate-pulse rounded-lg bg-border-subtle/60" />
          </div>
        )}

        {error && (
          <div role="alert" className="mt-8 flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {result && !loading && <AdviceResult result={result} />}
      </div>
    </main>
  );
}

function AdviceResult({ result }: { result: AdvisorResult }) {
  return (
    <section className="mt-8 space-y-6" aria-live="polite">
      {result.note && (
        <p className="rounded-md border border-border-subtle bg-public-blue-soft px-4 py-2 text-xs font-semibold text-charcoal-700">{result.note}</p>
      )}

      <div className="rounded-lg border border-border-subtle bg-brand-cream-card p-5 sm:p-6">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-1 h-4 w-4 shrink-0 text-public-blue" />
          <div>
            <h2 className="font-display text-lg font-bold">Advisor summary</h2>
            <p className="mt-1.5 text-sm leading-6 text-charcoal-700">{result.summary}</p>
          </div>
        </div>
        {result.nextSteps.length > 0 && (
          <div className="mt-5 border-t border-border-subtle pt-4">
            <h3 className="flex items-center gap-1.5 font-display text-sm font-bold"><ListOrdered className="h-4 w-4 text-public-blue" /> Next steps</h3>
            <ol className="mt-3 space-y-2.5">
              {result.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-6 text-charcoal-700">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-public-blue text-[11px] font-bold text-on-primary">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-bold">Recommended services</h2>
        <div className="space-y-4">
          {result.matches.map((match) => (
            <article key={match.id} className="rounded-lg border border-border-subtle bg-brand-cream-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-display text-base font-bold leading-snug">{match.title}</h3>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-600/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" /> {match.fit}% fit
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-charcoal-700">{match.why}</p>
              <dl className="mt-4 grid gap-3 text-xs text-charcoal-500 sm:grid-cols-3">
                <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-public-blue" /><div><dt className="sr-only">Where it applies</dt><dd className="font-semibold text-charcoal-700">{jurisdictionLabel(match.jurisdiction)}</dd></div></div>
                <div className="flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-public-blue" /><div><dt className="sr-only">Fee</dt><dd className="font-semibold text-charcoal-700">{match.fees === 0 ? "No fee" : `₹${match.fees}`}</dd></div></div>
                <div className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-public-blue" /><div><dt className="sr-only">Processing time</dt><dd className="font-semibold text-charcoal-700">{match.processingTime}</dd></div></div>
              </dl>
              <p className="mt-3 text-xs text-charcoal-500"><span className="font-bold uppercase">Issued by</span> · {match.department}</p>
              {match.documentsRequired.length > 0 && (
                <div className="mt-3 border-t border-border-subtle pt-3">
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase text-charcoal-500"><FileText className="h-3.5 w-3.5" /> Documents usually needed</p>
                  <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                    {match.documentsRequired.map((doc, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs leading-5 text-charcoal-700"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
