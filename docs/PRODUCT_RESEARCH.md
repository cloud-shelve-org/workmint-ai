# Workmint AI — product direction and validation plan

## Product thesis
Workmint is a browser-first utility workspace for people who regularly handle documents, job applications, writing and technical tasks. The product should make common workflows faster without requiring desktop installation or a Workmint-operated backend.

## Product areas
1. PDF Intelligence — extract, summarize, search/retrieve, compare, merge and split PDFs.
2. Document Studio — transform common document formats and create outputs locally.
3. Career Intelligence — resume structure review, job-description keyword coverage and application drafting.
4. Text Intelligence — summarize, clean, count and transform text.
5. Developer Utilities — inspect structured data and diagnose common error patterns.

## Differentiation hypotheses
- A unified, searchable workspace is more convenient than a directory of unrelated single-purpose websites.
- Browser-side processing can be a meaningful privacy and trust benefit.
- Reliable file handling, useful workflows and transparent limitations matter more than attaching an AI label to every tool.
- Optional local generative models may add value for selected tasks, but model download size, device support, inference latency and output quality must be validated first.

These are hypotheses, not proven market advantages.

## Current release reality
The current release contains browser-side document processing and deterministic tools. Extractive summaries, keyword retrieval, resume checklists and rule-based error hints are not generative AI. The product must describe them accurately. There is no Workmint backend or remote inference endpoint.

## Validation plan
1. Recruit 15–20 people who frequently handle PDFs, resumes, documents or text.
2. Observe them completing real tasks using the browser app.
3. Measure task completion, time, errors, repeat usage and trust in local processing.
4. Identify the three most frequently used workflows and improve those before adding breadth.
5. Test local-model AI separately with a small opt-in cohort and record device/browser compatibility, model download size, latency and output quality.

## Initial success gates (hypotheses)
- At least 70% of test users complete their target task without assistance.
- At least 40% return within 14 days.
- At least 80% of supported file operations complete without a processing error on supported browsers.
- Users can correctly explain which operations are deterministic and which, if any, use generative AI.

## Risks
- Browser memory limits and mobile device performance constrain large files.
- Scanned PDFs need OCR; OCR is not currently included.
- Local models may be too large or slow for many phones and older laptops.
- Heuristic resume analysis is not a genuine ATS score or hiring prediction.
- Feature breadth can create a shallow product; prioritize repeat workflows over catalog size.
- Privacy claims must remain precise: files are processed in the browser, but the browser environment and device are not under Workmint's control.
