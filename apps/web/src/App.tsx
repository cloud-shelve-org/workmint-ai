import { useMemo, useState } from "react";

type ToolId = "explainer" | "json" | "jwt";
const examples = [
  { label: "Spring Boot", value: "org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'paymentService': Unsatisfied dependency expressed through constructor parameter 0; nested exception is NoSuchBeanDefinitionException: No qualifying bean of type 'com.example.PaymentGateway' available" },
  { label: "Kafka", value: "org.apache.kafka.common.errors.TimeoutException: Expiring 3 record(s) for orders-0: 30000 ms has passed since batch creation" },
  { label: "Docker", value: "Error response from daemon: driver failed programming external connectivity on endpoint api (abc123): Bind for 0.0.0.0:8080 failed: port is already allocated" },
  { label: "Kubernetes", value: "Back-off restarting failed container api in pod api-7d9f8c6b5-x2k4m. Last State: Terminated, Reason: OOMKilled, Exit Code: 137" },
];

function App() {
  const [active, setActive] = useState<ToolId>("explainer");
  const [log, setLog] = useState("");
  const [context, setContext] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [jsonInput, setJsonInput] = useState('{"workmint":"useful","tools":["json","jwt"]}');
  const [jsonOutput, setJsonOutput] = useState("");
  const [jwtInput, setJwtInput] = useState("");
  const [jwtOutput, setJwtOutput] = useState("");

  const jsonStats = useMemo(() => {
    try { return { valid: true, bytes: new TextEncoder().encode(jsonInput).length }; }
    catch { return { valid: false, bytes: 0 }; }
  }, [jsonInput]);

  async function explain() {
    setError(""); setAnalysis("");
    if (log.trim().length < 12) { setError("Paste a little more detail so the analysis has something useful to work with."); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/explain", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log, context }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "The analysis request failed.");
      setAnalysis(payload.analysis);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to reach the analysis service.");
    } finally { setBusy(false); }
  }

  function formatJson() {
    try { setJsonOutput(JSON.stringify(JSON.parse(jsonInput), null, 2)); }
    catch (e) { setJsonOutput("Invalid JSON: " + (e instanceof Error ? e.message : "Could not parse input")); }
  }

  function decodeJwt() {
    try {
      const parts = jwtInput.trim().split(".");
      if (parts.length !== 3) throw new Error("A JWT must contain three dot-separated parts.");
      const decode = (part: string) => {
        const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.stringify(JSON.parse(decodeURIComponent(Array.from(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="))).map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join(""))), null, 2);
      };
      setJwtOutput("HEADER\n" + decode(parts[0]) + "\n\nPAYLOAD\n" + decode(parts[1]) + "\n\nSignature is not verified. Never treat decoded claims as trusted.");
    } catch (e) { setJwtOutput("Unable to decode: " + (e instanceof Error ? e.message : "Invalid token")); }
  }

  return <main className="shell">
    <nav className="nav">
      <a className="brand" href="#"><span className="brand-mark">w.</span><span>workmint<span className="brand-ai"> ai</span></span></a>
      <span className="nav-note">A practical AI toolkit</span>
      <a className="github-link" href="https://github.com/cloud-shelve-org/workmint-ai" target="_blank" rel="noreferrer">GitHub ↗</a>
    </nav>
    <section className="hero compact">
      <div className="eyebrow"><span className="pulse" /> BUILT FOR PEOPLE WHO BUILD</div>
      <h1>Make hard problems<br/><span>easier to untangle.</span></h1>
      <p className="hero-copy">A growing workbench of practical developer utilities. Start with the error, leave with a plan.</p>
    </section>
    <section className="workspace">
      <div className="section-heading"><div><div className="eyebrow muted">WORKMINT DEVELOPER</div><h2>Your <em>toolbox.</em></h2></div><span className="count">EARLY ACCESS · V0.1</span></div>
      <div className="tabs" role="tablist" aria-label="Developer utilities">
        <button className={active === "explainer" ? "tab active" : "tab"} onClick={() => setActive("explainer")}>✳ AI Error Explainer <span className="new-tag">AI</span></button>
        <button className={active === "json" ? "tab active" : "tab"} onClick={() => setActive("json")}>{"{ }"} JSON Formatter</button>
        <button className={active === "jwt" ? "tab active" : "tab"} onClick={() => setActive("jwt")}>◈ JWT Decoder</button>
      </div>

      {active === "explainer" && <div className="tool-panel">
        <div className="panel-intro"><div><h3>Understand the error. Find your next move.</h3><p>Paste a stack trace, log message, or runtime error. Get a structured debugging plan.</p></div><span className="ai-pill">AI POWERED</span></div>
        <div className="examples"><span>Try an example</span>{examples.map(item => <button key={item.label} onClick={() => setLog(item.value)}>{item.label}</button>)}</div>
        <label className="field-label" htmlFor="log-input">ERROR OR LOG OUTPUT</label>
        <textarea id="log-input" value={log} onChange={e => setLog(e.target.value)} placeholder="Paste your stack trace, exception, or log output here..." maxLength={12000} />
        <div className="field-meta"><span>Remove passwords, tokens and customer data before submitting.</span><span>{log.length.toLocaleString()} / 12,000</span></div>
        <label className="field-label context-label" htmlFor="context-input">OPTIONAL CONTEXT</label>
        <input id="context-input" value={context} onChange={e => setContext(e.target.value)} maxLength={500} placeholder="e.g. Java 17, Spring Boot 3.4, running in Kubernetes" />
        {error && <div className="error-box" role="alert">{error}</div>}
        <button className="primary-button" onClick={explain} disabled={busy}>{busy ? <><span className="spinner"/> Analysing...</> : <>Explain this error <span>→</span></>}</button>
        {analysis && <section className="result"><div className="result-heading"><span className="eyebrow">ANALYSIS</span><button onClick={() => navigator.clipboard.writeText(analysis)}>Copy result ↗</button></div><pre>{analysis}</pre></section>}
        <p className="privacy-note">Your input is sent to the configured AI provider for processing. Do not submit secrets, credentials, personal data, or regulated information.</p>
      </div>}

      {active === "json" && <div className="tool-panel">
        <div className="panel-intro"><div><h3>Make JSON readable.</h3><p>Format and validate JSON locally in your browser. Your data is not uploaded.</p></div><span className="local-pill">LOCAL · PRIVATE</span></div>
        <label className="field-label" htmlFor="json-input">JSON INPUT</label><textarea id="json-input" value={jsonInput} onChange={e => setJsonInput(e.target.value)} spellCheck={false}/>
        <div className="field-meta"><span>{jsonStats.bytes.toLocaleString()} bytes · processed locally</span><span>Input is never sent to a server</span></div>
        <button className="primary-button" onClick={formatJson}>Format JSON <span>→</span></button>
        {jsonOutput && <section className="result"><div className="result-heading"><span className="eyebrow">FORMATTED OUTPUT</span><button onClick={() => navigator.clipboard.writeText(jsonOutput)}>Copy output ↗</button></div><pre>{jsonOutput}</pre></section>}
      </div>}

      {active === "jwt" && <div className="tool-panel">
        <div className="panel-intro"><div><h3>Inspect a JWT without sending it anywhere.</h3><p>Decode the header and payload locally. This tool does not verify signatures.</p></div><span className="local-pill">LOCAL · PRIVATE</span></div>
        <label className="field-label" htmlFor="jwt-input">JWT TOKEN</label><textarea id="jwt-input" value={jwtInput} onChange={e => setJwtInput(e.target.value)} placeholder="Paste your three-part JWT here..." spellCheck={false}/>
        <div className="field-meta"><span>Decoded entirely in your browser</span><span>Never paste a live production credential into an untrusted site</span></div>
        <button className="primary-button" onClick={decodeJwt}>Decode token <span>→</span></button>
        {jwtOutput && <section className="result"><div className="result-heading"><span className="eyebrow">DECODED CONTENT</span><button onClick={() => navigator.clipboard.writeText(jwtOutput)}>Copy output ↗</button></div><pre>{jwtOutput}</pre></section>}
      </div>}
    </section>
    <section className="manifesto"><span className="eyebrow">THE WORKMINT STANDARD</span><p>Useful by default. <em>Thoughtful with your data.</em><br/>Built to make the work move forward.</p></section>
    <footer><a className="brand footer-brand" href="#"><span className="brand-mark">w.</span><span>workmint<span className="brand-ai"> ai</span></span></a><span>Practical AI. Useful outcomes.</span><span>© {new Date().getFullYear()} Workmint AI</span></footer>
  </main>;
}

export default App;
