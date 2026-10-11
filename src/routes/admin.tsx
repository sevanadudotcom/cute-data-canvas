import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, BookmarkCheck, MessageSquare, Search, ShieldCheck, Star, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCitizenReview, type CitizenRecord } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Citizen Accounts Review — SewaNadu Admin" },
      { name: "description", content: "Admin-only review of SewaNadu citizen accounts, their saved services and feedback." },
      { property: "og:title", content: "Citizen Accounts Review — SewaNadu Admin" },
      { property: "og:description", content: "Admin-only review of citizen accounts, saved services and feedback." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
  errorComponent: () => <Shell><p className="text-sm text-destructive">The admin page could not load. Please refresh.</p></Shell>,
  notFoundComponent: () => <Shell><p className="text-sm text-muted-foreground">Not found.</p></Shell>,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="institutional-theme min-h-screen bg-brand-cream-bg px-4 py-10 font-sans text-charcoal-900 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-charcoal-500 hover:text-charcoal-900">
          <ArrowLeft className="h-4 w-4" /> Back to SewaNadu
        </Link>
        {children}
      </div>
    </main>
  );
}

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—");

function AdminPage() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => data.subscription.unsubscribe();
  }, []);

  const fetchReview = useServerFn(getCitizenReview);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-citizens"],
    queryFn: () => fetchReview(),
    enabled: signedIn === true,
  });

  if (signedIn === null || (signedIn && isLoading)) return <Shell><p className="text-sm text-charcoal-500">Checking access…</p></Shell>;
  if (!signedIn) return <Shell><Notice title="Sign in required" body="Sign in with your administrator account on the home page, then come back here." /></Shell>;
  if (isError) return <Shell><Notice title="Couldn't load records" body="Please refresh the page." /></Shell>;
  if (!data?.allowed) return <Shell><Notice title="Administrators only" body="Your account doesn't have administrator access to this page." /></Shell>;

  return <Shell><Review citizens={data.citizens} anonymousFeedback={data.anonymousFeedback} /></Shell>;
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-brand-cream-card p-8 text-center">
      <ShieldCheck className="mx-auto h-8 w-8 text-public-blue" />
      <h1 className="mt-3 font-display text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-charcoal-500">{body}</p>
    </div>
  );
}

function Review({ citizens, anonymousFeedback }: { citizens: CitizenRecord[]; anonymousFeedback: number }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? citizens.filter((c) => `${c.email} ${c.displayName}`.toLowerCase().includes(s)) : citizens;
  }, [citizens, q]);
  const totalSaved = citizens.reduce((n, c) => n + c.saved.length, 0);
  const totalFb = citizens.reduce((n, c) => n + c.feedback.length, 0);

  return (
    <>
      <header className="mb-6">
        <p className="font-mono text-xs font-bold uppercase text-public-blue">Admin</p>
        <h1 className="font-display text-3xl font-bold">Citizen accounts</h1>
        <p className="mt-2 text-sm text-charcoal-500">Every registered citizen with the services they saved and the feedback they left.</p>
      </header>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Stat icon={<Users className="h-4 w-4" />} label="Citizens" value={citizens.length} />
        <Stat icon={<BookmarkCheck className="h-4 w-4" />} label="Saved services" value={totalSaved} />
        <Stat icon={<MessageSquare className="h-4 w-4" />} label="Feedback" value={`${totalFb} (+${anonymousFeedback} anonymous)`} />
      </div>
      <label className="mb-4 flex items-center gap-2 rounded-md border border-border-subtle bg-brand-cream-card px-3">
        <Search className="h-4 w-4 text-charcoal-500" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email" className="h-11 w-full bg-transparent text-sm outline-none" />
      </label>
      {list.length === 0 ? (
        <p className="rounded-lg border border-border-subtle bg-brand-cream-card p-6 text-sm text-charcoal-500">No citizen accounts yet.</p>
      ) : (
        <ul className="divide-y divide-border-subtle overflow-hidden rounded-lg border border-border-subtle bg-brand-cream-card">
          {list.map((c) => (
            <li key={c.userId}>
              <button onClick={() => setOpen(open === c.userId ? null : c.userId)} className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 text-left hover:bg-public-blue-soft" aria-expanded={open === c.userId}>
                <span className="min-w-0">
                  <span className="block font-semibold">{c.displayName || "Unnamed citizen"}</span>
                  <span className="block truncate text-xs text-charcoal-500">{c.email || c.userId}</span>
                </span>
                <span className="flex gap-4 text-xs text-charcoal-500">
                  <span>{c.saved.length} saved</span><span>{c.feedback.length} feedback</span><span>Active {fmt(c.lastActiveAt)}</span>
                </span>
              </button>
              {open === c.userId && (
                <div className="grid gap-6 border-t border-border-subtle px-4 py-4 md:grid-cols-2">
                  <section>
                    <h2 className="mb-2 text-xs font-bold uppercase text-charcoal-500">Saved services</h2>
                    {c.saved.length === 0 ? <p className="text-sm text-charcoal-500">None.</p> : (
                      <ul className="space-y-2 text-sm">{c.saved.map((s) => (
                        <li key={s.serviceId}><span className="font-medium">{s.title || s.serviceId}</span><span className="block text-xs text-charcoal-500">{s.department} · {fmt(s.savedAt)}</span></li>
                      ))}</ul>
                    )}
                  </section>
                  <section>
                    <h2 className="mb-2 text-xs font-bold uppercase text-charcoal-500">Feedback</h2>
                    {c.feedback.length === 0 ? <p className="text-sm text-charcoal-500">None.</p> : (
                      <ul className="space-y-3 text-sm">{c.feedback.map((f) => (
                        <li key={f.id}>
                          <span className="flex items-center gap-1 font-medium"><Star className="h-3.5 w-3.5 text-saffron" />{f.rating}/5 · {f.serviceId}</span>
                          {f.comment && <p className="text-charcoal-700">{f.comment}</p>}
                          <span className="text-xs text-charcoal-500">{fmt(f.createdAt)}</span>
                        </li>
                      ))}</ul>
                    )}
                  </section>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-brand-cream-card p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-charcoal-500">{icon}{label}</div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
