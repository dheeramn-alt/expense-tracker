# Nammude Veedu

A mobile-first house building income and expense tracker built with Next.js, Tailwind CSS, Recharts, React Hook Form, Zod, and Supabase.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Without environment variables the app runs in preview mode with demo transactions saved in the browser.

## Connect Supabase

1. Create a Supabase project.
2. Apply `supabase/migrations/20260704170000_initial_schema.sql` with the Supabase CLI or SQL Editor.
3. Copy `.env.example` to `.env.local` and add the project URL and public anon key.
4. Create the Dheeraj and Deepika accounts in Supabase Authentication.
5. Restart the app.

Only the public anon key belongs in browser configuration. Never expose the service role key.

## Deployment

Import the repository in Vercel and add the same two environment variables. The included proxy protects application routes whenever Supabase is configured.

## Git sync

This repository includes a local post-commit hook that pushes commits made on `main` to `origin`. Enable it after cloning with:

```bash
git config core.hooksPath .githooks
```
