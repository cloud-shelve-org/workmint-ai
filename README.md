# Workmint AI

**One workspace. Useful tools. Browser-first by design.**

Workmint AI is a static, browser-based workspace for PDF intelligence, document conversion, career tools, text processing and developer utilities.

## Product areas
- **PDF Intelligence:** extract selectable PDF text, summarize PDFs, retrieve relevant passages, compare, merge and split PDFs, and convert images to PDF.
- **Document Studio:** PDF/DOCX text extraction and text-to-PDF/DOCX conversion.
- **Career Intelligence:** resume structure review, job-description keyword coverage and cover-letter starter.
- **Text Intelligence:** local-model summarization (opt-in), extractive fallback, word counts, text cleanup, case conversion and duplicate-line removal.
- **Developer Utilities:** JSON formatting, JWT decoding (without signature verification) and rule-based error hints.

## AI execution
The optional summarization model runs in the browser using Transformers.js. The user explicitly loads the model; model files are downloaded to the browser and cached there. Inference runs on the user's device using available browser runtimes. First download is large (the UI estimates approximately 300 MB). Device memory, browser support and performance vary.

The default fallback is deterministic extractive summarization. Resume analysis, keyword retrieval and developer error hints remain heuristic/rule-based, not generative AI.

## Hosting and architecture
- GitHub Pages static hosting.
- React, TypeScript and Vite.
- Browser-side PDF.js, pdf-lib, Mammoth and docx.
- No Workmint backend, database, server-side API key or telemetry service.
- No user-supplied AI API key is required.

## Local development
Requirements: Node.js 20+ and npm 10+.

```bash
npm install
npm run dev:web
npm run typecheck
npm run build
```

## Privacy and limitations
Selected files and entered text are processed locally by the app. The optional model files are downloaded from the model host; submitted document text is processed by the local model, not sent to an inference API. This does not protect data from browser extensions, compromised devices or other software running on the user's device. Scanned-PDF OCR, exact semantic document comparison and cryptographic JWT signature verification are not included.

## Deployment
Push to `main`. GitHub Actions builds `apps/web` and deploys the static output to:

https://cloud-shelve-org.github.io/workmint-ai/
