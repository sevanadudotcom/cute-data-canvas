import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, BookmarkCheck, MessageSquare, Users, ArrowLeft } from "lucide-react";
import { getWeeklyReport, type WeeklyRow } from "@/lib/reports.functions";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Weekly Activity Report — SewaNadu" },
      {
        name: "description",
        content:
          "Weekly SewaNadu activity: services saved by citizens, feedback submitted and citizen sign-ins, with a CSV export.",
      },
      { property: "og:title", content: "Weekly Activity Report — SewaNadu" },
      {
        property: "og:description",
        content: "Track saved services, citizen feedback and sign-ins week by week, and export the numbers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReportsPage,
  errorComponent: () => (
    <Shell>
      <p className="text-sm text-red-700">This report could not be loaded right now. Please refresh.</p>
    </Shell>
  ),
  notFoundComponent: () => (
    <Shell>
      <p className="text-sm text-stone-600">Report not found.</p>
    </Shell>
  ),
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#FCFBF7] px-4 py-10 sm:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900">
          <ArrowLeft className="h-4 w-4" /> Back to SewaNadu
        </Link>
        {children}
      </div>
    </main>
  );
}

function toCsv(weeks: WeeklyRow[]) {
  const head = "Week starting,Services saved,Feedback submitted,Citizen sign-ins";
  const body = weeks
    .map((w) => [w.weekStart, w.savedServices, w.feedback, w.signIns].join(","))
    .join("\n");
  return `${head}\n${body}\n`;
}

function ReportsPage() {
  const fetchReport = useServerFn(getWeeklyReport);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["weekly-report"],
    queryFn: () => fetchReport(),
  });

  const weeks = data?.weeks ?? [];
  const totals = weeks.reduce(
    (acc, w) => ({
      savedServices: acc.savedServices + w.savedServices,
      feedback: acc.feedback + w.feedback,
      signIns: acc.signIns + w.signIns,
    }),
    { savedServices: 0, feedback: 0, signIns: 0 },
  );

  const handleExport = () => {
    const blob = new Blob([toCsv(weeks)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sewanadu-weekly-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Shell>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Weekly activity report</h1>
          <p className="mt-2 text-sm text-stone-600">
            Last 8 weeks of citizen activity across the portal. Weeks start on Monday (UTC).
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={weeks.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </header>

      {isLoading && <p className="text-sm text-stone-500">Loading the latest numbers…</p>}
      {isError && <p className="text-sm text-red-700">Could not load the report. Please refresh.</p>}

      {!isLoading && !isError && (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <SummaryCard icon={<BookmarkCheck className="h-5 w-5" />} label="Services saved" value={totals.savedServices} />
            <SummaryCard icon={<MessageSquare className="h-5 w-5" />} label="Feedback submitted" value={totals.feedback} />
            <SummaryCard icon={<Users className="h-5 w-5" />} label="Citizen sign-ins" value={totals.signIns} />
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Week starting</th>
                  <th className="px-4 py-3 font-semibold">Services saved</th>
                  <th className="px-4 py-3 font-semibold">Feedback submitted</th>
                  <th className="px-4 py-3 font-semibold">Citizen sign-ins</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map((w) => (
                  <tr key={w.weekStart} className="border-t border-stone-100">
                    <td className="px-4 py-3 font-medium text-stone-800">{w.label}</td>
                    <td className="px-4 py-3 text-stone-700">{w.savedServices}</td>
                    <td className="px-4 py-3 text-stone-700">{w.feedback}</td>
                    <td className="px-4 py-3 text-stone-700">{w.signIns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.generatedAt && (
            <p className="mt-4 text-xs text-stone-500">
              Generated {new Date(data.generatedAt).toLocaleString("en-IN")}
            </p>
          )}
        </>
      )}
    </Shell>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-center gap-2 text-stone-500">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-bold text-stone-900">{value}</p>
    </div>
  );
}
