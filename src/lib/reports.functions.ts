import { createServerFn } from "@tanstack/react-start";

export type WeeklyRow = {
  weekStart: string; // ISO date (Monday)
  label: string;
  savedServices: number;
  feedback: number;
  signIns: number;
};

function mondayOf(d: Date): Date {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = (x.getUTCDay() + 6) % 7; // 0 = Monday
  x.setUTCDate(x.getUTCDate() - day);
  return x;
}

export const getWeeklyReport = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ weeks: WeeklyRow[]; generatedAt: string }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const now = new Date();
    const firstMonday = mondayOf(now);
    firstMonday.setUTCDate(firstMonday.getUTCDate() - 7 * 7); // 8 weeks window
    const since = firstMonday.toISOString();

    const [saved, feedback, profiles] = await Promise.all([
      supabaseAdmin.from("saved_services").select("saved_at").gte("saved_at", since),
      supabaseAdmin.from("service_feedback").select("created_at").gte("created_at", since),
      supabaseAdmin.from("profiles").select("updated_at").gte("updated_at", since),
    ]);

    const buckets = new Map<string, WeeklyRow>();
    for (let i = 0; i < 8; i++) {
      const d = new Date(firstMonday);
      d.setUTCDate(d.getUTCDate() + i * 7);
      const key = d.toISOString().slice(0, 10);
      buckets.set(key, {
        weekStart: key,
        label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" }),
        savedServices: 0,
        feedback: 0,
        signIns: 0,
      });
    }

    const add = (iso: string | null | undefined, field: keyof Omit<WeeklyRow, "weekStart" | "label">) => {
      if (!iso) return;
      const key = mondayOf(new Date(iso)).toISOString().slice(0, 10);
      const row = buckets.get(key);
      if (row) row[field] += 1;
    };

    (saved.data ?? []).forEach((r) => add(r.saved_at, "savedServices"));
    (feedback.data ?? []).forEach((r) => add(r.created_at, "feedback"));
    (profiles.data ?? []).forEach((r) => add(r.updated_at, "signIns"));

    return { weeks: [...buckets.values()], generatedAt: new Date().toISOString() };
  },
);
