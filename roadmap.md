# Sevanadu → Supabase port roadmap

Sevanadu civic-services portal (uploaded zip) moved into this Supabase-connected project, Firebase replaced by Supabase.

## Tasks
- [x] Overlay Sevanadu source onto project (keep Supabase integrations + build configs)
- [x] Restore project build files (server.ts, start.ts with CSRF)
- [ ] Add deps (motion) / remove firebase; keep recharts already present
- [ ] DB migration: profiles, saved_services, service_feedback tables + RLS + grants + realtime
- [ ] Replace Firebase in App.tsx with Supabase (auth, profiles, saved services, feedback)
- [ ] Build + fix errors
- [ ] Verify preview renders
- [ ] Tell user to configure Google provider in Supabase dashboard

## Open / blocked
- Google sign-in requires user to add Google Cloud OAuth credentials in Supabase Auth → Providers → Google (BYO Supabase; Lovable-managed Google not available for external Supabase).
