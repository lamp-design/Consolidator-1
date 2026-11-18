# Consolidator – Fault Management Edition

A refreshed project based on the original `Chaitanyadurgeshweb/Consolidator` application. The original SHM processing and Excel consolidation engine is retained in `index.html`.

## Included
- Original SHM processor, station map, fault consolidation and Excel report generation.
- Original embedded catalogue, also supplied as `faults-seed.json`.
- Supabase live fault classifications loaded before a processing run.
- Admin page with sign-in, search, add/edit/reclassify, soft delete and restore.
- Static Vercel configuration.

## Setup
1. Create/use a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Create an admin user in Supabase Authentication.
4. Add that user's UUID to `public.admin_users` using the SQL comment at the bottom of the schema.
5. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `config.js`. Use only the anon/publishable key in browser code. Never expose the service-role key.
6. Open `admin.html`, sign in, and click **Import original catalogue**.
7. Deploy the repository root to Vercel as a static site; no build command is needed.

## Classification rules
Categories are Critical, Normal, Additional, Ignore and Repeated. The original processing rules remain in the original engine. Supabase overrides are refreshed before the processing button runs; if Supabase is unavailable, the original embedded catalogue remains the fallback. Soft deletion suppresses a code from processing while retaining a Restore option in the admin page.
