# PDF Studio feature roadmap

Reference scope reviewed on 18 November 2026: Sejda's official PDF tool catalogue and product pages. This is a capability benchmark, not an assertion that Workmint has implemented every feature. See https://www.sejda.com/en/index.html and https://www.sejda.in/tools.

## Available in current Workmint release
- Merge PDF files (two at a time in current UI)
- Split by selected page ranges
- Extract selected pages
- Delete selected pages
- Rotate all pages
- Add simple page numbers
- Text watermark
- PDF to selectable text
- PDF to JPG and PNG (page-by-page download)
- JPG/PNG to PDF (one image per operation)
- PDF text extraction and keyword passage retrieval
- Extractive and optional local-model PDF summarization
- Text to PDF and DOCX to text
- Compare documents using a basic unique-word comparison

## PDF capability benchmark / planned work

### Organise and combine
- Visual page thumbnails, drag/drop page reorder
- Merge multiple PDFs and images in one job
- Alternate and mix pages from multiple documents
- Split by bookmarks, file size, text occurrence and two-page scan halves
- Extract, delete, duplicate, insert, rotate, flip and reorder individual pages
- N-up printing and resize page dimensions

### Edit, annotate and sign
- Edit existing PDF text and images
- Add text, images, links and shapes
- Highlight, underline, strikeout, comments and freehand annotations
- Find and replace text; whiteout content
- Draw, type and upload signatures
- Fill AcroForms and create fillable form fields
- Add headers, footers and Bates numbering
- Add image or text watermark
- Edit PDF metadata
- Flatten annotations and form fields

### Convert
- PDF to Word/DOCX
- PDF to Excel/XLSX/CSV
- PDF to PowerPoint/PPTX
- PDF to JPG/PNG/TIFF
- PDF to text
- Word, Excel, PowerPoint, HTML and images to PDF
- Batch image format conversion

### Compress, optimise and repair
- Lossless and quality-based PDF compression
- Image downsampling and recompression
- Web linearization/fast web view
- Repair damaged PDFs
- Deskew scanned pages
- Crop and resize page boxes

### OCR and scan tools
- OCR to searchable PDF
- OCR to text
- Multi-language OCR and selectable output language
- Scan deskew and image cleanup

### Security
- Password-protect and encrypt PDF
- Unlock files when the user has the password or is authorised to remove restrictions
- Permanently redact content (not merely draw a black rectangle)
- Remove annotations and metadata
- Grayscale conversion

## Engineering and privacy constraints
Workmint remains a static GitHub Pages app. File operations should run locally in the browser. Some capabilities require substantial client-side engines:
- OCR: Tesseract.js or another audited browser OCR engine plus language packs.
- Office conversions: robust format fidelity requires dedicated parsers/renderers; simple text extraction is not equivalent to faithful conversion.
- PDF editing: existing text replacement requires font embedding, glyph positioning and content-stream rewriting; drawing a white box over text is not true editing.
- Compression/repair: quality and recovery need real PDF object and image optimisation, not just re-saving with pdf-lib.
- Redaction: must remove underlying content from the document, not visually cover it.
- Encryption: use a vetted implementation and verify output with independent PDF readers.

## Delivery order
1. Finish core page operations: thumbnails, drag/drop reorder, multi-file merge, rotate selected pages, split/extract/delete.
2. Complete everyday conversion: PDF to DOCX and DOCX to PDF with explicit layout-fidelity caveats; PDF images and image-to-PDF batch.
3. Add compression, crop, watermark image, headers/footers, metadata and flatten.
4. Add OCR and scanned-document workflows.
5. Add annotations, forms, signatures and true text/image editing.
6. Add advanced split modes, repair, encryption and permanent redaction after security testing.

Do not show planned capabilities as available until they have a working implementation and tests.
