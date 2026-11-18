# Local setup

Requirements: Node.js 20+ and npm 10+.

```bash
npm install
npm run dev:web
```

Build and verify:

```bash
npm run typecheck
npm run build
```

## Deployment
The GitHub Actions Pages workflow builds the Vite frontend and publishes `apps/web/dist` to the project Pages URL:

https://cloud-shelve-org.github.io/workmint-ai/

No backend credentials or infrastructure are required.

## Browser AI
The current release is browser-only and uses deterministic local processing. Do not add shared provider API keys to source code or Vite environment variables. A future optional local-model runtime must download models to the user's device and be opt-in, with clear size, compatibility and privacy disclosures.
