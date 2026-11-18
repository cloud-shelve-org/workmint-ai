# Architecture

## Current MVP
- React + TypeScript + Vite frontend in `apps/web`.
- Cloudflare Worker API in `workers/api` (deployment is intentionally deferred).
- Cloudflare D1 schema for daily usage accounting.
- AI provider credentials exist only as Worker secrets, never in frontend code.

## Request flow
Browser -> same-origin `POST /api/explain` -> input validation -> secret redaction -> per-IP daily quota in D1 -> configured OpenAI-compatible chat-completions endpoint -> structured analysis returned to browser.

## Security controls
- Server-side API key only.
- Strict method/path/body-size/input-length checks.
- Same-origin by default; optional exact origin allowlist.
- Daily hashed-IP quota with fail-closed database behavior.
- No raw IP stored in the usage table.
- Common credential patterns redacted before provider submission.
- No request/response body logging by the Worker.
- AI instructions treat log content as untrusted input.

## Important limitations before public production
The initial quota check is not an atomic increment under high concurrency. Replace it with a transactional/atomic limiter before meaningful public scale. Add Turnstile, account-level quotas, provider spend alerts, retention policy, and abuse monitoring before opening access widely. Secret redaction is best-effort, not a guarantee; users must still remove sensitive data.
