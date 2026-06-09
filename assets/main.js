const root = document.getElementById('root');

root.innerHTML = `
  <header class="site-header">
    <nav class="nav" aria-label="Huvudmeny">
      <a class="logo" href="./">Odlai</a>
      <div class="nav-links">
        <a href="#produkter">Produkter</a>
        <a href="#guide">Guide</a>
        <a href="#kontakt">Kontakt</a>
      </div>
    </nav>
  </header>

  <main>
    <section class="hero">
      <div class="hero-content">
        <p class="eyebrow">Inomhusodling för svenska hem</p>
        <h1>Utrustning för starkare växter inomhus</h1>
        <p class="lead">Odlai samlar växtbelysning, odlingstält, ventilation, substrat och tillbehör för hobbyodlare som vill odla smartare året runt.</p>
        <div class="hero-actions">
          <a class="button primary" href="#produkter">Se produkter</a>
          <a class="button secondary" href="#guide">Läs guiden</a>
        </div>
      </div>
    </section>

    <section id="produkter" class="section">
      <div class="section-heading">
        <p class="eyebrow">Sortiment</p>
        <h2>Allt för en stabil odlingsmiljö</h2>
      </div>
      <div class="cards">
        <article class="card">
          <h3>Växtbelysning</h3>
          <p>LED-lampor och armaturer för frösådd, bladgrönt och blommande växter.</p>
        </article>
        <article class="card">
          <h3>Odlingstält</h3>
          <p>Kompakta tält för kontrollerat ljus, temperatur och luftflöde.</p>
        </article>
        <article class="card">
          <h3>Ventilation</h3>
          <p>Fläktar, filter och luftcirkulation för friskare plantor.</p>
        </article>
        <article class="card">
          <h3>Substrat & växtvård</h3>
          <p>Jord, kokos, näring och praktiska tillbehör för daglig skötsel.</p>
        </article>
      </div>
    </section>

    <section id="guide" class="split-section">
      <div>
        <p class="eyebrow">Kom igång</p>
        <h2>Bygg din odling i tre steg</h2>
      </div>
      <ol class="steps">
        <li><strong>Välj plats.</strong> Bestäm yta, höjd och hur mycket ljus växterna behöver.</li>
        <li><strong>Kontrollera klimat.</strong> Se till att luftflöde, temperatur och fuktighet är stabila.</li>
        <li><strong>Följ upp.</strong> Justera ljus, vattning och näring efter växternas utveckling.</li>
      </ol>
    </section>

    <section id="kontakt" class="cta">
      <h2>Redo att börja odla?</h2>
      <p>Utforska utrustning för en enklare, renare och mer kontrollerad inomhusodling.</p>
      <a class="button primary" href="mailto:info@odlai.se">Kontakta oss</a>
    </section>
  </main>
`;
