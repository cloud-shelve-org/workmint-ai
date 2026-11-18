# Architecture — browser-only edition

## Deployment boundary
Workmint is a static site hosted on GitHub Pages. There is no Workmint backend, database, serverless function, API proxy, server-side secret, account service or telemetry collector.

## Browser execution
- React + TypeScript + Vite application.
- PDF.js extracts selectable text from PDFs.
- pdf-lib merges PDFs and creates simple text PDFs.
- Mammoth extracts text from DOCX.
- docx creates DOCX documents from text.
- Text utilities, resume heuristics, keyword retrieval, JSON formatting and JWT decoding run in the browser.
- Files are held in page memory during processing. Favourites and recent tools use browser localStorage.

## AI capability boundary
The shipped utilities currently use deterministic parsing, keyword matching, extractive summarization and heuristics. They are not generative AI. A local LLM can only be added as a separate optional browser runtime after validating supported browsers, WebGPU/WASM fallback, model size, download UX, memory use, licensing and output quality. No provider API key may be embedded in this public static application.

## Privacy
Workmint does not intentionally upload selected files or text to a Workmint server. Processing occurs in the user's browser. Browser extensions, device compromise and external browser services remain outside Workmint's control.

## Known limitations
- Scanned PDFs require OCR; OCR is not included.
- PDF text extraction works only for selectable text.
- PDF comparison currently compares extracted text tokens/keywords, not layout or semantic meaning.
- Resume analysis and job-description matching are heuristic aids, not ATS scores or hiring predictions.
- JWT decoding does not verify signatures.
- Rule-based error hints are not AI diagnosis.
- Browser memory and device capability constrain large files.
