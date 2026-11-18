const tools = [
  { name: "Document Intelligence", category: "Documents", description: "Understand, extract, and compare information across documents.", status: "Planned", icon: "▤" },
  { name: "Career Copilot", category: "Career", description: "Turn a job description and your experience into a sharper application.", status: "Planned", icon: "↗" },
  { name: "Developer Workbench", category: "Developer", description: "Explain errors, inspect logs, and transform structured data.", status: "Planned", icon: "{ }" },
  { name: "Business Desk", category: "Business", description: "Create and process everyday business documents with less busywork.", status: "Planned", icon: "▧" },
];

function App() {
  return (
    <main className="shell">
      <nav className="nav">
        <a className="brand" href="/" aria-label="Workmint AI home"><span className="brand-mark">w.</span><span>workmint<span className="brand-ai"> ai</span></span></a>
        <span className="nav-note">A practical AI toolkit</span>
        <a className="github-link" href="https://github.com/cloud-shelve-org/workmint-ai" target="_blank" rel="noreferrer">GitHub ↗</a>
      </nav>

      <section className="hero">
        <div className="eyebrow"><span className="pulse" /> BUILDING A MORE USEFUL WAY TO WORK</div>
        <h1>Less busywork.<br /><span>More meaningful work.</span></h1>
        <p className="hero-copy">Focused AI utilities that help you get real things done. No hype, no bloated workflows — just useful outcomes.</p>
        <a className="hero-cta" href="#utilities">Explore the toolkit <span>↓</span></a>
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
      </section>

      <section className="section" id="utilities">
        <div className="section-heading">
          <div><div className="eyebrow muted">THE TOOLKIT</div><h2>Small tools. <em>Big leverage.</em></h2></div>
          <span className="count">04 TOOL CATEGORIES</span>
        </div>
        <div className="tool-grid">
          {tools.map((tool, index) => (
            <article className="tool-card" key={tool.name}>
              <div className="card-top"><span className="tool-icon">{tool.icon}</span><span className="tool-number">0{index + 1}</span></div>
              <div className="tool-category">{tool.category}</div>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
              <div className="card-bottom"><span className="status-dot" /> {tool.status}<span className="card-arrow">↗</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto">
        <span className="eyebrow">OUR PRINCIPLE</span>
        <p>AI should not give you <em>more things to manage.</em><br />It should help you finish the work.</p>
      </section>
      <footer><a className="brand footer-brand" href="/"><span className="brand-mark">w.</span><span>workmint<span className="brand-ai"> ai</span></span></a><span>Practical AI. Useful outcomes.</span><span>© {new Date().getFullYear()} Workmint AI</span></footer>
    </main>
  );
}

export default App;
