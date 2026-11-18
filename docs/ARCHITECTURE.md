# Architecture — browser-only edition

## Deployment boundary
Workmint is a static site hosted on GitHub Pages. There is no Workmint backend, database, serverless function, API proxy, server-side secret, account service or telemetry collector.

## Browser execution
- React + TypeScript + Vite application.
- PDF.js extracts selectable text from PDFs.
- pdf-lib merges/splits PDFs and creates simple text PDFs and image PDFs.
- Mammoth extracts text from DOCX.
- docx creates DOCX documents from text.
- Text utilities, resume heuristics, keyword retrieval, JSON formatting and JWT decoding run in the browser.
- Favourites and recent tools use browser localStorage.

## Optional local AI
- Transformers.js provides an opt-in summarization pipeline using the `Xenova/distilbart-cnn-6-6` model.
- The model is downloaded from the Hugging Face model host to the browser and cached by the browser runtime.
- Inference runs on the user's device; there is no Workmint inference server and no provider API key.
- The initial model download is large (the interface estimates approximately 300 MB). Performance and compatibility depend on browser, hardware, memory and available WASM/WebGPU support.
- If the model cannot load, deterministic extractive summarization remains available.
- The local model is currently used for summarization only. Resume review, keyword retrieval and error hints are deterministic heuristics, not generative AI.

## Privacy
Workmint does not intentionally upload selected files or submitted text to a Workmint server or inference API. Model files are downloaded from the configured model host. Browser extensions, compromised devices and other browser software remain outside Workmint's control.

## Known limitations
- Scanned PDFs require OCR; OCR is not included.
- PDF text extraction works only for selectable text.
- PDF comparison currently compares extracted text tokens/keywords, not layout or semantic meaning.
- Resume analysis and job-description matching are heuristic aids, not ATS scores or hiring predictions.
- JWT decoding does not verify signatures.
- Rule-based error hints are not AI diagnosis.
- Browser memory and device capability constrain large files.
