import { ChangeEvent, useMemo, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import mammoth from "mammoth";
import { Document, Packer, Paragraph, TextRun } from "docx";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

type Tool = "pdf" | "convert" | "resume" | "text" | "developer";
const fmtBytes = (n: number) => n < 1024 ? n + " B" : n < 1048576 ? (n / 1024).toFixed(1) + " KB" : (n / 1048576).toFixed(2) + " MB";
const download = (blob: Blob, name: string) => { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); };
const readFile = (file: File) => new Promise<ArrayBuffer>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result as ArrayBuffer); r.onerror = () => reject(new Error("Could not read this file.")); r.readAsArrayBuffer(file); });
const words = (s: string) => s.trim() ? s.trim().split(/\s+/).length : 0;
const sentences = (s: string) => s.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(x => x.trim()).filter(Boolean) || [];
const stop = new Set("a an the and or but if then of to in on at for from with by is are was were be been being this that these those it its as into about over under after before we you your our their they them he she his her i me my mine can could should would will may might not no yes".split(" "));
function extractiveSummary(text: string, max = 5) {
  const ss = sentences(text); if (ss.length <= max) return ss.join("\n\n");
  const freq = new Map<string, number>();
  for (const w of text.toLowerCase().match(/[a-z0-9][a-z0-9+#.-]{2,}/g) || []) if (!stop.has(w)) freq.set(w, (freq.get(w) || 0) + 1);
  const scored = ss.map((s, i) => ({ s, i, score: (s.toLowerCase().match(/[a-z0-9][a-z0-9+#.-]{2,}/g) || []).reduce((n, w) => n + (freq.get(w) || 0), 0) / Math.max(8, words(s)) }));
  return scored.sort((a,b) => b.score-a.score).slice(0,max).sort((a,b)=>a.i-b.i).map(x=>x.s).join("\n\n");
}
async function pdfText(file: File) {
  const data = new Uint8Array(await readFile(file)); const doc = await pdfjs.getDocument({ data }).promise; let result = "";
  for (let i=1;i<=doc.numPages;i++){const page=await doc.getPage(i);const c=await page.getTextContent();result += c.items.map((x:any)=>"str" in x?x.str:"").join(" ")+"\n";}
  return { text: result, pages: doc.numPages };
}
async function docxText(file: File) { const r=await mammoth.extractRawText({arrayBuffer:await readFile(file)}); return r.value; }
async function textPdf(text: string, filename: string) {
  const doc=await PDFDocument.create(); const font=await doc.embedFont(StandardFonts.Helvetica); const page=doc.addPage(); const size=10; const margin=42; const width=page.getWidth()-margin*2; let y=page.getHeight()-margin;
  const lines: string[]=[]; for(const para of text.split("\n")){let line="";for(const word of para.split(/\s+/)){const next=line?line+" "+word:word;if(font.widthOfTextAtSize(next,size)>width){lines.push(line);line=word;}else line=next;}lines.push(line);lines.push("");}
  let current=page; for(const line of lines){if(y<margin){current=doc.addPage();y=current.getHeight()-margin;}current.drawText(line,{x:margin,y,size,font,color:rgb(.12,.16,.15)});y-=14;}
  const bytes=await doc.save(); const safeBytes=new Uint8Array(bytes.length); safeBytes.set(bytes); download(new Blob([safeBytes.buffer],{type:"application/pdf"}),filename);
}
const nav: {id:Tool;label:string;icon:string;desc:string;tools:string[]}[]=[
 {id:"pdf",label:"PDF Intelligence",icon:"▤",desc:"Understand, search and work with PDF files.",tools:["Chat with a PDF","Summarize a PDF","Compare documents","Merge PDFs","Extract PDF text"]},
 {id:"convert",label:"Document Studio",icon:"⇄",desc:"Convert and transform documents in your browser.",tools:["PDF to text","DOCX to text","Text to PDF","Text to DOCX"]},
 {id:"resume",label:"Career Intelligence",icon:"✳",desc:"Improve resumes and prepare stronger applications.",tools:["Resume analyzer","Job description match","Cover letter draft"]},
 {id:"text",label:"Text Intelligence",icon:"T",desc:"Summarize, clean and transform text.",tools:["Text summarizer","Word counter","Tone and case tools","Duplicate line remover"]},
 {id:"developer",label:"Developer Utilities",icon:"⌘",desc:"Small utilities for everyday engineering work.",tools:["JSON formatter","JWT decoder","Error explainer"]},
];
export default function App(){
 const [active,setActive]=useState<Tool>("pdf"); const [tool,setTool]=useState("Summarize a PDF"); const [file,setFile]=useState<File|null>(null); const [second,setSecond]=useState<File|null>(null);
 const [text,setText]=useState(""); const [context,setContext]=useState(""); const [output,setOutput]=useState(""); const [busy,setBusy]=useState(false); const [notice,setNotice]=useState(""); const [query,setQuery]=useState(""); const [jwt,setJwt]=useState("");
 const [resume,setResume]=useState(""); const [job,setJob]=useState("");
 const [favorites,setFavorites]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem("wm-favs")||"[]")}catch{return[]}});
 const [recent,setRecent]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem("wm-recent")||"[]")}catch{return[]}});
 const [pdfMeta,setPdfMeta]=useState("");
 const section=nav.find(x=>x.id===active)!;
 const filtered=useMemo(()=>nav.flatMap(n=>n.tools.map(t=>({tool:t,section:n}))).filter(x=>(x.tool+" "+x.section.label).toLowerCase().includes(query.toLowerCase())),[query]);
 function choose(id:Tool,t:string){setActive(id);setTool(t);setOutput("");setNotice("");setFile(null);setSecond(null);setText("");}
 function remember(t:string){const next=[t,...recent.filter(x=>x!==t)].slice(0,5);setRecent(next);localStorage.setItem("wm-recent",JSON.stringify(next));}
 function toggleFav(t:string){const next=favorites.includes(t)?favorites.filter(x=>x!==t):[...favorites,t];setFavorites(next);localStorage.setItem("wm-favs",JSON.stringify(next));}
 async function onFile(e:ChangeEvent<HTMLInputElement>,which:"first"|"second"="first"){const f=e.target.files?.[0]||null;if(which==="first")setFile(f);else setSecond(f);setOutput("");setNotice("");}
 async function run(){
  setBusy(true);setOutput("");setNotice("");
  try{
   if(tool==="Summarize a PDF"||tool==="Chat with a PDF"||tool==="Extract PDF text"||tool==="PDF to text"){
    if(!file)throw new Error("Choose a PDF file first.");const r=await pdfText(file);setPdfMeta(r.pages+" pages · "+fmtBytes(file.size));
    if(tool==="Summarize a PDF")setOutput(r.text.trim()?extractiveSummary(r.text,7):"No selectable text was found. This may be a scanned PDF; OCR is not included yet.");
    else if(tool==="Chat with a PDF"){if(!context.trim())throw new Error("Enter a question about the document.");const terms=context.toLowerCase().match(/[a-z0-9]{3,}/g)||[];const chunks=r.text.split(/(?<=[.!?])\s+/);const matches=chunks.map(s=>({s,score:terms.filter(w=>!stop.has(w)&&s.toLowerCase().includes(w)).length})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,8);setOutput(matches.length?("Relevant passages (keyword retrieval, not generative AI):\n\n"+matches.map(x=>x.s).join("\n\n")):"No matching passages found. Try different keywords.");}
    else setOutput(r.text.trim()||"No selectable text found. Scanned PDFs need OCR.");
   } else if(tool==="Compare documents"){if(!file||!second)throw new Error("Choose both documents.");const a=file.name.toLowerCase().endsWith(".pdf")?(await pdfText(file)).text:await docxText(file);const b=second.name.toLowerCase().endsWith(".pdf")?(await pdfText(second)).text:await docxText(second);const aa=new Set(a.toLowerCase().match(/[a-z0-9]+/g)||[]),bb=new Set(b.toLowerCase().match(/[a-z0-9]+/g)||[]);const added=[...bb].filter(x=>!aa.has(x));const removed=[...aa].filter(x=>!bb.has(x));setOutput("Document comparison (unique words)\n\nWords in first: "+aa.size+"\nWords in second: "+bb.size+"\nAdded terms: "+added.slice(0,100).join(", ")+"\n\nTerms only in first: "+removed.slice(0,100).join(", "));}
   else if(tool==="Merge PDFs"){if(!file||!second)throw new Error("Choose two PDF files.");const a=await PDFDocument.load(await readFile(file));const b=await PDFDocument.load(await readFile(second));const out=await PDFDocument.create();for(const src of [a,b]){const pages=await out.copyPages(src,src.getPageIndices());pages.forEach(p=>out.addPage(p));}const merged=await out.save();const mergedBytes=new Uint8Array(merged.length);mergedBytes.set(merged);download(new Blob([mergedBytes.buffer],{type:"application/pdf"}),"workmint-merged.pdf");setOutput("Merged "+a.getPageCount()+" + "+b.getPageCount()+" pages. Your file has been downloaded.");}
   else if(tool==="Text to PDF"){if(!text.trim())throw new Error("Enter text to convert.");await textPdf(text,"workmint-document.pdf");setOutput("Your PDF has been generated and downloaded.");}
   else if(tool==="Text to DOCX"){if(!text.trim())throw new Error("Enter text to convert.");const doc=new Document({sections:[{children:text.split("\n").map(line=>new Paragraph({children:[new TextRun(line)]}))}]});download(await Packer.toBlob(doc),"workmint-document.docx");setOutput("Your DOCX has been generated and downloaded.");}
   else if(tool==="DOCX to text"){if(!file)throw new Error("Choose a DOCX file.");setOutput(await docxText(file));}
   else if(tool==="Resume analyzer"||tool==="Job description match"||tool==="Cover letter draft"){const source=resume.trim();if(!source)throw new Error("Paste your resume text or extract it from a PDF/DOCX first.");const tokens=source.toLowerCase().match(/[a-z][a-z0-9+#.-]{1,}/g)||[];const unique=[...new Set(tokens)];const checks=[["Contact details",/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/i.test(source)],["Experience",/experience|employment|work history/i.test(source)],["Skills",/skills|technologies|competencies/i.test(source)],["Education",/education|university|degree|college/i.test(source)],["Achievements",/increased|reduced|improved|delivered|achieved|saved|built|led/i.test(source)],["Quantified impact",/\b\d+\s*(%|percent|x|years|months|users|clients|million|k\b)/i.test(source)]];if(tool==="Resume analyzer")setOutput("RESUME READINESS REVIEW\n\n"+checks.map(([n,ok])=>(ok?"✓ ":"○ ")+n).join("\n")+"\n\nKeyword diversity: "+unique.length+" unique terms\nWord count: "+words(source)+"\n\nSuggestions:\n"+(!checks[4][1]?"• Add achievement bullets that show outcomes.\n":"")+(!checks[5][1]?"• Quantify impact with metrics where truthful.\n":"")+"• Tailor the summary and skills to each role.\n• Use clear section headings and consistent dates.\n• This is a heuristic checklist, not an ATS score or hiring prediction.");
    else if(tool==="Job description match"){if(!job.trim())throw new Error("Paste the job description.");const terms=[...new Set((job.toLowerCase().match(/[a-z][a-z0-9+#.-]{2,}/g)||[]).filter(w=>!stop.has(w)))];const found=terms.filter(w=>source.toLowerCase().includes(w));const missing=terms.filter(w=>!source.toLowerCase().includes(w));setOutput("KEYWORD COVERAGE (not an ATS score)\n\nMatched terms ("+found.length+"): "+found.join(", ")+"\n\nTerms to review ("+missing.length+"): "+missing.slice(0,80).join(", ")+"\n\nOnly add missing terms when they accurately describe your experience.");}
    else setOutput("COVER LETTER STARTER\n\nDear Hiring Manager,\n\nI am writing to express my interest in the role. My experience includes "+source.slice(0,500).replace(/\s+/g," ").trim()+". I would welcome the opportunity to discuss how my background could contribute to your team.\n\nThank you for your consideration.\n\nSincerely,\n[Your name]\n\nThis is a template. Personalize it with the company, role and specific achievements before using it.");}
   else if(tool==="Text summarizer")setOutput(extractiveSummary(text,6)||"Enter some text first.");
   else if(tool==="Word counter"){setOutput("Words: "+words(text)+"\nCharacters: "+text.length+"\nCharacters (excluding spaces): "+text.replace(/\s/g,"").length+"\nSentences: "+sentences(text).length+"\nParagraphs: "+text.split(/\n\s*\n/).filter(x=>x.trim()).length+"\nEstimated reading time: "+Math.max(1,Math.ceil(words(text)/220))+" min");}
   else if(tool==="Tone and case tools"){setOutput("UPPERCASE\n"+text.toUpperCase()+"\n\n lowercase\n"+text.toLowerCase()+"\n\nTitle Case\n"+text.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())+"\n\nCleaned whitespace\n"+text.replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim());}
   else if(tool==="Duplicate line remover"){setOutput([...new Set(text.split("\n").map(x=>x.trim()).filter(Boolean))].join("\n"));}
   else if(tool==="JSON formatter"){setOutput(JSON.stringify(JSON.parse(text),null,2));}
   else if(tool==="JWT decoder"){const p=jwt.trim().split(".");if(p.length!==3)throw new Error("JWT must have three parts.");const dec=(s:string)=>JSON.stringify(JSON.parse(decodeURIComponent(Array.from(atob(s.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(s.length/4)*4,"="))).map(c=>"%"+c.charCodeAt(0).toString(16).padStart(2,"0")).join(""))),null,2);setOutput("HEADER\n"+dec(p[0])+"\n\nPAYLOAD\n"+dec(p[1])+"\n\nSignature is NOT verified.");}
   else if(tool==="Error explainer"){const s=text.toLowerCase();const hints=[["OutOfMemory / OOMKilled",/outofmemory|oomkilled|heap space|137/.test(s),"Inspect memory limits, heap sizing, allocation spikes and recent deployments."],["Connection / timeout",/timeout|connection refused|econnrefused|timed out/.test(s),"Check service reachability, DNS, ports, connection pools, downstream latency and timeout configuration."],["Authentication / authorization",/unauthorized|forbidden|401|403|invalid token/.test(s),"Check token expiry, issuer/audience, scopes, credentials and service identity."],["Dependency injection",/nosuchbeandefinition|beancreationexception|unsatisfieddependency/.test(s),"Check component scanning, bean conditions, profiles and constructor dependencies."],["Kafka",/kafka|consumer|rebalance|offset|partition/.test(s),"Inspect consumer group state, partition assignment, lag, broker reachability and processing time."]];const found=hints.filter(x=>x[1]);setOutput("RULE-BASED DIAGNOSTIC HINTS\n\n"+(found.length?found.map(x=>x[0]+": "+x[2]).join("\n\n"):"No known pattern matched. Capture the full exception chain, timestamp, environment and recent changes.")+"\n\nThese are diagnostic starting points, not AI-generated root-cause conclusions.");}
   remember(tool);
  }catch(e){setNotice(e instanceof Error?e.message:"Something went wrong while processing this file.");}
  finally{setBusy(false);}
 }
 async function extractResume(){if(!file)throw new Error("Choose a resume PDF or DOCX first.");const t=file.name.toLowerCase().endsWith(".pdf")?(await pdfText(file)).text:await docxText(file);setResume(t);setNotice("Resume text extracted locally. Review it before analysis.");}
 const isFileTool=["Summarize a PDF","Chat with a PDF","Extract PDF text","PDF to text","DOCX to text"].includes(tool);
 const isTwo=["Compare documents","Merge PDFs"].includes(tool);
 const isResume=["Resume analyzer","Job description match","Cover letter draft"].includes(tool);
 const isText=["Text summarizer","Word counter","Tone and case tools","Duplicate line remover"].includes(tool);
 const isDev=["JSON formatter","JWT decoder","Error explainer"].includes(tool);
 const isConverter=["Text to PDF","Text to DOCX"].includes(tool);
 return <div className="app-shell">
  <aside className="sidebar"><a className="brand" href="#"><span className="brand-mark">w.</span><span>workmint<span className="brand-ai"> ai</span></span></a><div className="side-label">WORKSPACE</div>
   {nav.map(n=><button key={n.id} className={"nav-item "+(active===n.id?"selected":"")} onClick={()=>{setActive(n.id);setTool(n.tools[0]);setOutput("");setNotice("");setFile(null);setSecond(null);}}><span className="nav-icon">{n.icon}</span>{n.label}</button>)}
   <div className="side-label side-tools">YOUR SPACE</div><button className="nav-item" onClick={()=>setQuery(" ")}><span className="nav-icon">☆</span>Explore utilities</button>
   <div className="sidebar-bottom"><div className="privacy-chip"> <span/> Browser-first processing</div><a href="https://github.com/cloud-shelve-org/workmint-ai" target="_blank" rel="noreferrer">Open source repository ↗</a></div>
  </aside>
  <main className="main-area"><header className="topbar"><div className="breadcrumb">Workspace <span>/</span> {section.label}</div><div className="top-actions"><span className="local-indicator">● LOCAL-FIRST</span><a href="https://github.com/cloud-shelve-org/workmint-ai" target="_blank" rel="noreferrer">GitHub ↗</a></div></header>
   <div className="content"><section className="welcome"><div><div className="eyebrow"><span className="pulse"/> YOUR EVERYDAY WORKBENCH</div><h1>Make work move<br/><em>smarter.</em></h1><p>Thoughtful utilities for documents, careers, writing and development. Process files on your device, without sending them to a Workmint server.</p></div><div className="welcome-art"><div className="art-ring ring-a"/><div className="art-ring ring-b"/><div className="art-core">w.</div><span className="art-star star-a">✳</span><span className="art-star star-b">✦</span></div></section>
   <div className="search-row"><div className="searchbox"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a utility — PDF, resume, summarize..."/></div><span className="version-tag">EARLY ACCESS · BROWSER EDITION</span></div>
   {query.trim()?<section className="search-results"><div className="section-kicker">SEARCH RESULTS · {filtered.length}</div><div className="tool-grid">{filtered.map(x=><button className="tool-card" key={x.tool} onClick={()=>choose(x.section.id,x.tool)}><span className="tool-category">{x.section.label}</span><strong>{x.tool}</strong><span className="card-open">Open utility ↗</span></button>)}</div></section>:<><section className="category-intro"><div><div className="section-kicker">YOUR TOOLBOX</div><h2>{section.label}</h2><p>{section.desc}</p></div><button className={"favorite-button "+(favorites.includes(tool)?"favorited":"")} onClick={()=>toggleFav(tool)}>{favorites.includes(tool)?"★ Saved":"☆ Save current tool"}</button></section>
   <div className="tool-layout"><section className="tool-list"><div className="section-kicker">TOOLS IN THIS SPACE</div>{section.tools.map(t=><button key={t} className={"tool-choice "+(tool===t?"active":"")} onClick={()=>{setTool(t);setOutput("");setNotice("");}}><span>{t}</span><span>↗</span></button>)}
    {favorites.length>0&&<><div className="section-kicker list-gap">FAVOURITES</div>{favorites.map(t=><button key={t} className="tool-choice" onClick={()=>{const n=nav.find(x=>x.tools.includes(t));if(n)choose(n.id,t);}}>{t}<span>★</span></button>)}</>}
    {recent.length>0&&<><div className="section-kicker list-gap">RECENTLY USED</div>{recent.map(t=><button key={t} className="recent-choice" onClick={()=>{const n=nav.find(x=>x.tools.includes(t));if(n)choose(n.id,t);}}>{t}</button>)}</>}
   </section>
   <section className="work-panel"><div className="work-panel-head"><div><div className="section-kicker">WORKMINT UTILITY</div><h3>{tool}</h3><p>{tool==="Chat with a PDF"?"Retrieve relevant passages from a PDF using local keyword search.":tool==="Summarize a PDF"?"Create an extractive summary from selectable PDF text.":tool==="Resume analyzer"?"Review structure, completeness and measurable impact in your resume.":tool==="Job description match"?"Compare resume terms with a job description.":tool==="Merge PDFs"?"Combine two PDF files locally in your browser.":"Run this utility locally in your browser."}</p></div><span className="local-pill">ON-DEVICE</span></div>
    {isFileTool||isTwo||tool==="Text to PDF"||tool==="Text to DOCX"?<div className="file-drop"><label className="drop-target"><span className="upload-symbol">↑</span><strong>{file?file.name:"Choose a file"}</strong><small>{file?fmtBytes(file.size):"PDF or DOCX · processed in this browser"}</small><input type="file" accept={tool==="DOCX to text"?".docx":".pdf,.docx"} onChange={e=>onFile(e)}/></label>{isTwo&&<label className="drop-target"><span className="upload-symbol">＋</span><strong>{second?second.name:"Choose second file"}</strong><small>{second?fmtBytes(second.size):"Select another PDF or DOCX"}</small><input type="file" accept=".pdf,.docx" onChange={e=>onFile(e,"second")}/></label>}</div>:null}
    {isResume&&<><div className="field-head"><label>RESUME CONTENT</label><button onClick={()=>extractResume().catch(e=>setNotice(e.message))}>Extract from selected PDF/DOCX</button></div><textarea className="large-input" value={resume} onChange={e=>setResume(e.target.value)} placeholder="Paste your resume text here, or select a PDF/DOCX above and extract it."/><label className="field-head simple-label">JOB DESCRIPTION {tool==="Job description match"?"(REQUIRED)":"(OPTIONAL)"}</label><textarea className="small-input" value={job} onChange={e=>setJob(e.target.value)} placeholder="Paste the target job description..."/></>}
    {isText&&<><label className="field-head simple-label">YOUR TEXT</label><textarea className="large-input" value={text} onChange={e=>setText(e.target.value)} placeholder="Paste or type your text here..."/><div className="input-stats">{words(text)} words · {text.length} characters</div></>}
    {isDev&&tool==="JSON formatter"&&<><label className="field-head simple-label">JSON INPUT</label><textarea className="large-input code-input" value={text} onChange={e=>setText(e.target.value)} placeholder='{"hello":"world"}'/></>}
    {isDev&&tool==="JWT decoder"&&<><label className="field-head simple-label">JWT TOKEN</label><textarea className="small-input code-input" value={jwt} onChange={e=>setJwt(e.target.value)} placeholder="Paste a three-part JWT..."/></>}
    {isDev&&tool==="Error explainer"&&<><label className="field-head simple-label">ERROR OR LOG OUTPUT</label><textarea className="large-input code-input" value={text} onChange={e=>setText(e.target.value)} placeholder="Paste stack trace or error output..."/></>}
    {tool==="Chat with a PDF"&&<><label className="field-head simple-label">YOUR QUESTION</label><input className="text-input" value={context} onChange={e=>setContext(e.target.value)} placeholder="What are the payment terms?"/></>}
    {isConverter&&<><label className="field-head simple-label">TEXT CONTENT</label><textarea className="large-input" value={text} onChange={e=>setText(e.target.value)} placeholder="Enter document content..."/></>}
    {notice&&<div className="notice">{notice}</div>}
    <div className="action-row"><button className="run-button" disabled={busy} onClick={run}>{busy?"Processing…": "Run "+tool} <span>→</span></button><span className="processing-note">Files stay in this browser session</span></div>
    {output&&<div className="output-panel"><div className="output-head"><span>RESULT {pdfMeta&&"· "+pdfMeta}</span><div><button onClick={()=>download(new Blob([output],{type:"text/plain;charset=utf-8"}),"workmint-result.txt")}>Download</button><button onClick={()=>navigator.clipboard.writeText(output)}>Copy</button></div></div><pre>{output}</pre></div>}
    <div className="disclaimer"><span>ⓘ</span> Workmint currently uses local parsing, retrieval and heuristics for these utilities. It does not claim generative AI reasoning. Scanned PDF OCR and signature verification are not supported.</div>
   </section></div></>}
   <footer className="app-footer"><span>workmint ai · Practical tools, thoughtful processing.</span><span>Built for the browser · No Workmint backend</span></footer>
  </div></main>
 </div>;
}
