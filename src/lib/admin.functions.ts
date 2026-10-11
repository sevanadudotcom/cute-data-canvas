import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type CitizenRecord = {
  userId: string;
  email: string;
  displayName: string;
  photoUrl: string;
  joinedAt: string | null;
  lastActiveAt: string | null;
  saved: { serviceId: string; title: string; department: string; savedAt: string }[];
  feedback: { id: string; serviceId: string; rating: number; comment: string; createdAt: string }[];
};

export const getCitizenReview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) return { allowed: false as const, citizens: [] as CitizenRecord[], anonymousFeedback: 0 };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [profiles, saved, feedback] = await Promise.all([
      supabaseAdmin.from("profiles").select("user_id,email,display_name,photo_url,created_at,updated_at").order("updated_at", { ascending: false }),
      supabaseAdmin.from("saved_services").select("user_id,service_id,service_title,department,saved_at").order("saved_at", { ascending: false }),
      supabaseAdmin.from("service_feedback").select("id,user_id,service_id,rating,comment,created_at").order("created_at", { ascending: false }),
    ]);
    if (profiles.error || saved.error || feedback.error) throw new Error("Could not load citizen records");

    const map = new Map<string, CitizenRecord>();
    for (const p of profiles.data ?? []) {
      map.set(p.user_id, {
        userId: p.user_id, email: p.email, displayName: p.display_name, photoUrl: p.photo_url,
        joinedAt: p.created_at, lastActiveAt: p.updated_at, saved: [], feedback: [],
      });
    }
    const ensure = (id: string) => {
      if (!map.has(id)) map.set(id, { userId: id, email: "", displayName: "", photoUrl: "", joinedAt: null, lastActiveAt: null, saved: [], feedback: [] });
      return map.get(id)!;
    };
    for (const s of saved.data ?? []) ensure(s.user_id).saved.push({ serviceId: s.service_id, title: s.service_title, department: s.department, savedAt: s.saved_at });
    let anonymousFeedback = 0;
    for (const f of feedback.data ?? []) {
      if (!f.user_id) { anonymousFeedback++; continue; }
      ensure(f.user_id).feedback.push({ id: f.id, serviceId: f.service_id, rating: f.rating, comment: f.comment, createdAt: f.created_at });
    }
    return { allowed: true as const, citizens: [...map.values()], anonymousFeedback };
  });
