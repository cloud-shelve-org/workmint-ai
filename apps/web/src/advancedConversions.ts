import * as pdfjs from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import mammoth from "mammoth";
import { Document, Packer, Paragraph, TextRun } from "docx";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const read = (file: File) => file.arrayBuffer();
const save = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
const safeName = (name: string) => name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/gi, "-").slice(0, 70) || "workmint";

async function makePdf(text: string, name: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const margin = 42, size = 9, lineHeight = 13;
  let page = pdf.addPage(), y = page.getHeight() - margin;
  const maxWidth = page.getWidth() - margin * 2;
  for (const paragraph of text.replace(/\r/g, "").split("\n")) {
    const words = paragraph.split(/\s+/);
    let line = "";
    for (const word of words) {
      const next = line ? line + " " + word : word;
      if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
        if (y < margin) { page = pdf.addPage(); y = page.getHeight() - margin; }
        page.drawText(line, { x: margin, y, size, font, color: rgb(.12,.16,.2) }); y -= lineHeight; line = word;
      } else line = next;
    }
    if (line) {
      if (y < margin) { page = pdf.addPage(); y = page.getHeight() - margin; }
      page.drawText(line.slice(0, 300), { x: margin, y, size, font, color: rgb(.12,.16,.2) }); y -= lineHeight;
    }
    y -= 5;
  }
  const bytes = await pdf.save();
  save(new Blob([bytes], { type: "application/pdf" }), name);
}
async function getPdfText(file: File) {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await read(file)) }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((item: any) => "str" in item ? item.str : "").join(" "));
  }
  return { pages, text: pages.join("\n\n") };
}
function pdfLinesToRows(text: string) {
  return text.split("\n").map(line => line.trim()).filter(Boolean).map(line => {
    const cells = line.split(/\s{2,}|\t+/).map(x => x.trim()).filter(Boolean);
    return cells.length > 1 ? cells : [line];
  });
}
export async function runAdvancedConversion(tool: string, file: File): Promise<string> {
  const base = safeName(file.name);
  if (tool === "PDF to Word") {
    const { text } = await getPdfText(file);
    if (!text.trim()) throw new Error("This PDF has no selectable text. OCR is required for scanned PDFs.");
    const paragraphs = text.split(/\n{2,}/).flatMap(p => p.split("\n").map(line => new Paragraph({ children: [new TextRun(line)] })));
    const doc = new Document({ sections: [{ children: paragraphs }] });
    save(await Packer.toBlob(doc), base + ".docx");
    return "Created a DOCX from selectable PDF text. Complex layouts, tables, columns, fonts and images are not reconstructed; review the document before use.";
  }
  if (tool === "PDF to Excel") {
    const { text } = await getPdfText(file);
    if (!text.trim()) throw new Error("This PDF has no selectable text. OCR is required for scanned PDFs.");
    const XLSX: any = await import("xlsx");
    const rows = pdfLinesToRows(text);
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Extracted data");
    const bytes = XLSX.write(book, { bookType: "xlsx", type: "array" });
    save(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), base + ".xlsx");
    return "Extracted selectable PDF text into spreadsheet rows. This is a best-effort text-layout heuristic, not reliable table reconstruction. Check columns and values.";
  }
  if (tool === "PDF to PowerPoint") {
    const { pages } = await getPdfText(file);
    const doc = await pdfjs.getDocument({ data: new Uint8Array(await read(file)) }).promise;
    const PptxGenJS: any = (await import("pptxgenjs")).default;
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 1.35 });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is unavailable.");
      await page.render({ canvas, canvasContext: ctx, viewport } as any).promise;
      const slide = pptx.addSlide();
      slide.addImage({ data: canvas.toDataURL("image/jpeg", .88), x: 0, y: 0, w: 13.333, h: 7.5 });
      canvas.width = 0; canvas.height = 0;
    }
    const blob = await pptx.write({ outputType: "blob" }) as Blob;
    save(blob, base + ".pptx");
    return "Created a PowerPoint with one full-page image per PDF page. Slides preserve appearance but their content is not individually editable.";
  }
  if (tool === "Word to PDF") {
    const result = await mammoth.convertToHtml({ arrayBuffer: await read(file) });
    const parsed = new DOMParser().parseFromString(result.value, "text/html");
    const text = parsed.body.innerText || parsed.body.textContent || "";
    if (!text.trim()) throw new Error("No readable text was found in this DOCX.");
    await makePdf(text, base + ".pdf");
    return "Created a text-focused PDF from DOCX content. Original page layout, tables, images and advanced formatting may not be preserved.";
  }
  if (tool === "Excel to PDF") {
    const XLSX: any = await import("xlsx");
    const book = XLSX.read(await read(file), { type: "array" });
    const parts = book.SheetNames.map((name: string) => {
      const rows = XLSX.utils.sheet_to_json(book.Sheets[name], { header: 1, raw: false }) as unknown[][];
      return "SHEET: " + name + "\n" + rows.map(row => row.map(v => String(v ?? "")).join(" | ")).join("\n");
    });
    await makePdf(parts.join("\n\n"), base + ".pdf");
    return "Created a text-focused PDF from workbook sheets. Charts, formulas as live objects, cell styling and print layouts are not preserved.";
  }
  if (tool === "PowerPoint to PDF") {
    const JSZip: any = (await import("jszip")).default;
    const zip = await JSZip.loadAsync(await read(file));
    const slideNames = Object.keys(zip.files).filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name)).sort((a,b) => Number(a.match(/slide(\d+)/)?.[1]) - Number(b.match(/slide(\d+)/)?.[1]));
    if (!slideNames.length) throw new Error("No readable slides were found in this PowerPoint file.");
    const slides: string[] = [];
    for (const name of slideNames) {
      const xml = await zip.files[name].async("text");
      const parsed = new DOMParser().parseFromString(xml, "application/xml");
      slides.push(Array.from(parsed.getElementsByTagName("a:t")).map(node => node.textContent || "").join(" "));
    }
    await makePdf(slides.map((s, i) => "SLIDE " + (i + 1) + "\n" + s).join("\n\n"), base + ".pdf");
    return "Created a text-only PDF from slide text. Images, charts, SmartArt, animations, speaker notes and slide positioning are not preserved.";
  }
  if (tool === "HTML to PDF") {
    const html = await file.text();
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const text = parsed.body.innerText || parsed.body.textContent || "";
    if (!text.trim()) throw new Error("No readable body text was found in this HTML file.");
    await makePdf(text, base + ".pdf");
    return "Created a text-focused PDF from HTML body content. CSS layout, images, scripts and interactive content are not rendered.";
  }
  throw new Error("Unsupported conversion.");
}
