# Local setup

Requirements: Node.js 20+ and npm 10+.

1. Clone the repository.
2. Run `npm install` from the repository root.
3. Copy `workers/api/.dev.vars.example` to `workers/api/.dev.vars` and add a valid AI provider key.
4. Initialize the local D1 schema: `npm run db:migrate:local --workspace @workmint/api`.
5. Start the API in one terminal: `npm run dev --workspace @workmint/api`.
6. Start the frontend in another terminal: `npm run dev --workspace @workmint/web`.
7. Open the Vite URL shown in the terminal.

The Vite development server proxies `/api` to Wrangler at `http://localhost:8787`. Run the API command from the workspace so Wrangler loads `workers/api/wrangler.toml` and `workers/api/.dev.vars`.

Do not commit `.dev.vars`. Do not put provider keys in Vite variables, React code, GitHub Pages, or any `VITE_*` variable.

## Cloudflare deployment (later phase)
1. Create a D1 database named `workmint-usage`.
2. Replace the placeholder `database_id` in `workers/api/wrangler.toml`.
3. Apply the migration remotely from the API workspace: `npm run db:migrate:remote --workspace @workmint/api`.
4. Set `OPENAI_API_KEY` with `npx wrangler secret put OPENAI_API_KEY` from `workers/api`.
5. Set `ALLOWED_ORIGIN` to the exact production origin in the Worker environment.
6. Deploy the Worker from the API workspace: `npm run deploy --workspace @workmint/api`.
7. Deploy the static frontend and route `/api/*` to the Worker on the same origin.
8. Verify quotas, provider errors, origin behavior, and secret handling before announcing the tool.

Cloudflare account creation, D1 provisioning, provider credentials, billing settings, and production deployment require the account owner to perform the relevant authorization steps.
