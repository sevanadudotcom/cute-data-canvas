# Sevanadu → Supabase port roadmap

Sevanadu civic-services portal (uploaded zip) moved into this Supabase-connected project, Firebase replaced by Supabase.

## Tasks
- [x] Overlay Sevanadu source onto project (keep Supabase integrations + build configs)
- [x] Restore project build files (server.ts, start.ts with CSRF)
- [x] Add deps (motion, @supabase/supabase-js, @supabase/ssr); firebase already absent
- [x] DB migration: profiles, saved_services, service_feedback tables + RLS + grants + realtime
- [x] Replace Firebase in App.tsx with Supabase (auth, profiles, saved services, feedback)
- [x] Build + fix errors (dev preview renders, no runtime errors)
- [x] Verify preview renders (Playwright screenshot confirmed full portal)
- [ ] Tell user to configure Google provider in Supabase dashboard

## Open / blocked
- Google sign-in requires user to add Google Cloud OAuth credentials in Supabase Auth → Providers → Google (BYO Supabase; Lovable-managed Google not available for external Supabase).
- Pre-existing strict-TS warnings in Sevanadu's own files (LanguageContext, AdSenseUnit, ServiceDossier, SavedServices, ESevaServiceList) under this project's stricter tsconfig — do not block Vite dev/build (esbuild strips types); not in scope to fix unless asked.
