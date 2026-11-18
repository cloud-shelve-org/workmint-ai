# Launch checklist

## Completed in repository
- [x] Product direction selected: developer productivity.
- [x] Initial AI utility UI implemented.
- [x] Local JSON formatter and JWT decoder implemented.
- [x] Server-side AI provider integration scaffolded.
- [x] Input limits, best-effort secret redaction, and daily quota scaffolded.
- [x] Architecture and setup documentation added.

## Required before public launch
- [ ] Install dependencies and run build/typecheck.
- [ ] Configure a real AI provider key as a server-side secret.
- [ ] Provision D1 and apply migrations.
- [ ] Replace non-atomic quota increment with an atomic/transactional limiter.
- [ ] Add Turnstile or equivalent abuse protection.
- [ ] Add privacy policy, terms, retention disclosures, and contact details.
- [ ] Add provider spend alerts and operational monitoring.
- [ ] Test with representative Java, Spring, Kafka, Docker, Kubernetes, and SQL errors.
- [ ] Add automated tests for validation, redaction, quotas, and provider failures.
- [ ] Complete Cloudflare account setup and production deployment.
- [ ] Validate product demand with target developers before adding more tools.

## Commercial validation
Interview 10-15 working developers. Measure repeat usage, whether the suggested fix helps, and willingness to pay. Do not assume that a generic AI wrapper has defensibility.
