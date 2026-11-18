# Launch checklist — browser-only Workmint

## Current static release
- [x] Product expanded into PDF, document, career, text and developer utility spaces.
- [x] GitHub Pages static deployment workflow.
- [x] Browser-side PDF text extraction and PDF merge.
- [x] Browser-side DOCX text extraction and DOCX generation.
- [x] Text-to-PDF generation.
- [x] Resume structure checklist and job-description keyword coverage.
- [x] Extractive text/PDF summarization and keyword passage retrieval.
- [x] JSON formatting, JWT decoding and rule-based error hints.
- [x] Removed the Worker, D1 and server API integration from the application workspace.

## Before promoting beyond early access
- [ ] Confirm latest GitHub Actions build and Pages deployment succeed.
- [ ] Manually test PDF/DOCX operations on Safari iOS, Chrome desktop and Firefox.
- [ ] Test large-file behavior and gracefully handle memory exhaustion.
- [ ] Add automated unit tests for document parsing, keyword matching and conversion.
- [ ] Add OCR for scanned PDFs if a suitable fully client-side engine is selected.
- [ ] Add accessible progress, cancellation and error states for long-running operations.
- [ ] Add privacy policy, terms, support/contact information and clear file-size limits.
- [ ] Add local-model AI runtime only after measuring model download size, browser compatibility, device memory and output quality.
- [ ] Audit licenses and model/data redistribution terms before enabling any model.

## Capability truthfulness
Current summaries are extractive. PDF question answering is keyword retrieval. Resume analysis is heuristic. Developer error hints are rule-based. These are not generative AI and must not be marketed as such. JWT decoding does not verify signatures. Scanned-PDF OCR is not included.

## Product validation
Observe users completing real document, resume and text tasks. Measure task completion, repeat usage, processing failures and willingness to recommend. Expand based on evidence, not feature count.
