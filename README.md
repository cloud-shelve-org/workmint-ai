# Workmint AI

Browser-first PDF and document workspace with a light interface.

## Working PDF tools in this release
- Merge two PDFs
- Split/extract/delete selected page ranges
- Rotate all pages or selected pages
- Duplicate pages and reverse page order
- Crop pages (fixed inset) and resize pages to A4
- Create 2-up layouts
- Export rasterised grayscale PDFs
- Set or remove basic PDF metadata
- Add page numbers and text watermarks
- Convert PDF pages to JPG or PNG (downloaded individually)
- Convert JPG/PNG to PDF
- Extract PDF text, keyword search and summarization
- Compare documents using a basic unique-word comparison
- Text to PDF

## Other utilities
DOCX text extraction, text to DOCX, resume checklist, job-description keyword coverage, cover-letter starter, text utilities, JSON formatter, JWT decoder and rule-based error hints.

## Important conversion limitations
Advanced conversions are implemented as browser-side, best-effort workflows. They do not promise faithful Office-document conversion: PDF to DOCX extracts selectable text; PDF to XLSX heuristically splits text rows; PDF to PPTX creates image-based slides; DOCX/XLSX/PPTX/HTML to PDF creates text-focused PDFs and does not preserve all layout, charts, images, formulas or animations. Scanned PDF OCR is not included. OCR, true text editing, image-based watermarking, genuine compression, permanent redaction, digital signatures, advanced PDF form editing, and faithful Office conversion are not implemented yet. Grayscale export rasterises pages; crop uses a fixed inset; resize uses A4.

See [PDF Studio roadmap](docs/PDF_STUDIO_ROADMAP.md) for the full Sejda-benchmarked scope and staged implementation plan.

## Architecture
- Static GitHub Pages hosting
- React + TypeScript + Vite
- Browser-side PDF.js, pdf-lib, Mammoth, docx and optional Transformers.js local summarization
- No Workmint backend, database, API key or server-side file uploads

## Local development
Node.js 22+ and npm 10+:

```bash
npm install
npm run dev:web
npm run typecheck
npm run build
```

Live site: https://cloud-shelve-org.github.io/workmint-ai/
