# Workmint AI

**One workspace. Useful tools. Browser-first by design.**

Workmint AI is a static, browser-based workspace for document intelligence, file conversion, career tools, text processing and developer utilities.

## Product areas
- **PDF Intelligence:** extract selectable PDF text, create extractive summaries, retrieve relevant passages by keyword, compare documents and merge PDFs.
- **Document Studio:** PDF/DOCX text extraction and text-to-PDF/DOCX conversion.
- **Career Intelligence:** resume structure review, job-description keyword coverage and cover-letter starter.
- **Text Intelligence:** extractive summarization, word counts, text cleanup, case conversion and duplicate-line removal.
- **Developer Utilities:** JSON formatting, JWT decoding (without signature verification) and rule-based error hints.

## Hosting and architecture
- GitHub Pages static hosting.
- React, TypeScript and Vite.
- File processing and utilities execute in the user's browser.
- No Workmint backend, database, server-side API key or telemetry service.
- PDF.js, pdf-lib, Mammoth and docx provide browser-side document operations.

## Important AI transparency
The current public build uses local parsing, keyword retrieval, extractive summaries and transparent heuristics. These are **not generative AI** and must not be represented as model-generated reasoning. A browser-local generative model runtime is a separate capability that requires model downloads, compatible hardware and dedicated validation before it is enabled.

## Local development
Requirements: Node.js 20+ and npm 10+.

```bash
npm install
npm run dev:web
```

Build and typecheck:

```bash
npm run typecheck
npm run build
```

## Privacy and limitations
Files are processed in the browser and are not uploaded to a Workmint server. This does not protect data from browser extensions, compromised devices, or other software running on the user's device. Scanned-PDF OCR, exact semantic document comparison, generative AI and cryptographic JWT signature verification are not included in the current build.

## Deployment
Push to `main`. GitHub Actions builds `apps/web` and deploys the static output to GitHub Pages at:

https://cloud-shelve-org.github.io/workmint-ai/
