# Workmint AI

**Practical AI. Useful outcomes.**

Workmint AI is a modular suite of focused AI-powered utilities. Each utility should solve a concrete user problem, provide a genuinely useful free experience, and have a clear path to sustainable monetization.

## Product principles
- Utility before novelty: build tools people return to.
- Useful without an account where practical.
- Privacy-first: explain what is processed, stored, and sent to AI providers.
- Cost-aware by design: quotas, rate limits, caching, and usage metering from day one.
- Modular: utilities can evolve independently without fragmenting the platform.
- Measurable: instrument activation, successful outcomes, retention, and unit economics.

## Planned architecture
- `apps/web` — React + TypeScript user interface.
- `workers/api` — server-side API boundary; provider secrets never belong in the browser.
- `packages/shared` — shared types, schemas, and utility contracts.
- `docs` — product decisions, architecture, security, and operating guides.
- `infrastructure` — deployment configuration, introduced when the hosting target is selected.

The initial development environment is local/GitHub-based. Cloudflare deployment will be added in a later phase.

## Getting started
The application workspace is being bootstrapped. Setup instructions will be added with the first runnable implementation.

## Repository status
Early foundation. No production services, AI provider integrations, authentication, billing, or user data storage are configured yet.
