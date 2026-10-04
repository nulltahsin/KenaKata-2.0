# Deploying KenaKata on Vercel

The repository is configured for a Vercel monorepo deployment: Vercel builds the Vite app from `Frontend/`, serves its static files, and routes `/api/*` requests to the Express function in `api/index.js`.

## Database requirement

pgAdmin is a database administration client; it is not the database server. A PostgreSQL server running only on your computer cannot be reached by a public Vercel deployment. Create or migrate the database to a hosted PostgreSQL provider (for example, Neon, Supabase, or a managed PostgreSQL service), and use its production connection string. Apply `Backend/src/config/schema.sql` to that hosted database once. The app's startup initialization creates/updates additional customer tables and triggers.

## Vercel setup

1. Push this repository to GitHub and import it into Vercel with the repository root as the project root.
2. Add these Vercel environment variables for Production (and Preview if needed):
   - `DATABASE_URL`: hosted PostgreSQL connection string.
   - `DATABASE_SSL`: set to `true` if your provider requires TLS and the connection URL does not handle TLS itself.
   - `JWT_SECRET`: a long, random secret used to sign login tokens.
3. Deploy. The build command and output directory are defined in `vercel.json`.

## First administrator and markets

Public sign-up deliberately does not allow the `ADMIN` role. From the repository root, run `neon env pull --branch production --file .env.local`, then `npm run bootstrap:admin` in an interactive terminal. The script requires `.env.local` to identify the production branch, uses Neon's direct connection URL, asks for the first admin's details with the password hidden, and refuses to change an existing account or run if an admin already exists. It creates no public bootstrap endpoint. Keep `.env.local` private; it is Git-ignored.

Market creation requires an authenticated admin. Sign in with the first admin account, open the admin dashboard, and add the initial markets there. Vendors can then register, create shops, and add products through the site.

The frontend uses same-origin `/api/...` requests by default. Set `VITE_API_URL` only if the API is deployed on a separate domain; Vite variables are embedded at build time.

## Local development

Continue using `Backend/.env` with `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`, and `JWT_SECRET`, then run `node index.js` from the repository root. For a hosted database locally, use `DATABASE_URL` (and `DATABASE_SSL=true` when required).

Never commit database credentials or `JWT_SECRET`.
