# Workmint AI

**Practical AI. Useful outcomes.**

Workmint AI is a modular suite of focused AI-powered utilities. Our first product is **Workmint Developer**, a developer workbench with an AI Error & Log Explainer plus private, browser-local utilities.

## First release
- **AI Error & Log Explainer** — submit a stack trace or log and receive evidence-aware root-cause hypotheses and debugging steps. Requires a configured server-side AI provider.
- **JSON Formatter** — format and validate JSON locally in the browser.
- **JWT Decoder** — decode a token's header and payload locally. It does not verify signatures.

## Tech stack
- React, TypeScript, Vite
- Cloudflare Worker API (deployment deferred)
- Cloudflare D1 usage accounting
- OpenAI-compatible chat completions API

## Local development
See [docs/SETUP.md](docs/SETUP.md). Node.js 20+ and npm 10+ are required.

## Product and architecture
- [Architecture](docs/ARCHITECTURE.md)
- [Product principles](docs/PRODUCT_PRINCIPLES.md)
- [Launch checklist](docs/LAUNCH_CHECKLIST.md)

## Security
Never commit API keys or place them in browser-exposed environment variables. The AI explainer sends submitted text to the configured AI provider after best-effort credential redaction. Do not submit secrets, customer data, or regulated information. JSON and JWT tools run locally.

## Status
Early MVP implementation. Production AI service, provider credentials, Cloudflare database provisioning, testing, legal pages, and deployment are not yet complete.
