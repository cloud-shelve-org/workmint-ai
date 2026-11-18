# Local setup

Requirements: Node.js 20+ and npm 10+.

1. Clone the repository.
2. Run `npm install` from the repository root.
3. Copy `workers/api/.dev.vars.example` to `workers/api/.dev.vars` and add a valid AI provider key.
4. Create a local D1 database with Wrangler: `npx wrangler d1 execute workmint-usage --local --file=workers/api/migrations/0001_usage.sql`.
5. Start the API in one terminal: `npm run dev --workspace @workmint/api`.
6. Start the frontend in another terminal: `npm run dev --workspace @workmint/web`.
7. Open the Vite URL shown in the terminal.

The Vite development server proxies `/api` to Wrangler at `http://localhost:8787`.

Do not commit `.dev.vars`. Do not put provider keys in Vite variables, React code, GitHub Pages, or any `VITE_*` variable.

## Cloudflare deployment (later phase)
1. Create a D1 database named `workmint-usage`.
2. Replace the placeholder `database_id` in `workers/api/wrangler.toml`.
3. Apply migrations remotely.
4. Set `OPENAI_API_KEY` with `wrangler secret put OPENAI_API_KEY`.
5. Set optional `OPENAI_BASE_URL` as a Worker secret if using another compatible provider.
6. Set `ALLOWED_ORIGIN` to the exact production origin.
7. Deploy the Worker.
8. Deploy the static frontend and route `/api/*` to the Worker on the same origin.
9. Verify quotas, provider errors, CORS/origin behavior, and secret handling before announcing the tool.

Cloudflare account creation, D1 provisioning, provider credentials, billing settings, and production deployment require the account owner to perform the relevant authorization steps.
