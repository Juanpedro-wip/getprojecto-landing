// Rendering della landing per lingua (SEO: una URL per lingua + hreflang).
import { CSS, LOGO, JS } from './assets.js' // CSS + logo + JS inline (deploy senza dipendere da public/)
export const LOCALES = ['en', 'it', 'fr', 'de']
export const DEFAULT_LOCALE = 'en'
const BASE = 'https://getprojecto.ch'
// Google Analytics 4: ID della proprietà getprojecto.ch (pubblico, visibile nel sorgente).
// Override via GA_MEASUREMENT_ID nel .env; stringa vuota ("GA_MEASUREMENT_ID= ") per disattivare.
const GA_ID = (process.env.GA_MEASUREMENT_ID ?? 'G-R5QT266WNY').trim()
const GA_SNIPPET = GA_ID
  ? `  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA_ID}')</script>`
  : ''
const ASSET_V = '4' // cache-busting: bump quando cambiano css/logo/og/favicon
const OG_LOCALE = { en: 'en', it: 'it_IT', fr: 'fr_FR', de: 'de_DE' }
const LANG_LABEL = { en: 'EN', it: 'IT', fr: 'FR', de: 'DE' }

// ── Traduzioni ───────────────────────────────────────────────────────────────
export const T = {
  en: {
    title: 'Projecto — AI project-management documentation, across the lifecycle',
    desc: 'Projecto is the AI copilot that generates project-management documentation — from discovery and planning to execution, monitoring and closing. Source-grounded, methodology-aware (PMI, HERMES, PRINCE2, Agile), localized for Switzerland. Join the waiting list.',
    eyebrow: 'Coming soon',
    h1a: 'AI-driven project documentation,',
    h1b: 'across the whole lifecycle.',
    lead: 'Projecto interviews you and generates source-grounded charters, plans and deliverables in your chosen methodology — <strong>PMI, HERMES, PRINCE2, Agile</strong> — from discovery and planning to execution, monitoring and closing. Localized for Switzerland, built to scale.',
    placeholder: 'you@company.com',
    cta: 'Join the waiting list',
    joining: 'Joining…',
    added: 'Added ✓',
    success: "You're on the list — we'll be in touch. Thank you!",
    invalid: 'Please enter a valid email address.',
    error: 'Something went wrong. Please try again or email us.',
    network: 'Network error. Please try again or email us.',
    prefer: 'Prefer email?',
    location: 'Ticino, Switzerland',
  },
  it: {
    title: "Projecto — Documentazione di project management con l'AI, su tutto il ciclo di vita",
    desc: "Projecto è il copilota AI che genera la documentazione di project management — dalla discovery e pianificazione all'esecuzione, monitoraggio e chiusura. Ancorato a fonti citate, multi-metodologia (PMI, HERMES, PRINCE2, Agile), localizzato per la Svizzera. Iscriviti alla waiting list.",
    eyebrow: 'Prossimamente',
    h1a: "Documentazione di progetto con l'AI,",
    h1b: 'su tutto il ciclo di vita.',
    lead: "Projecto ti intervista e genera charter, piani e deliverable ancorati a fonti, nella metodologia che scegli — <strong>PMI, HERMES, PRINCE2, Agile</strong> — dalla discovery alla chiusura. Localizzato per la Svizzera, pensato per scalare.",
    placeholder: 'tu@azienda.com',
    cta: 'Iscriviti alla waiting list',
    joining: 'Invio…',
    added: 'Aggiunto ✓',
    success: 'Sei nella lista — ti scriveremo presto. Grazie!',
    invalid: 'Inserisci un indirizzo email valido.',
    error: 'Qualcosa è andato storto. Riprova o scrivici.',
    network: 'Errore di rete. Riprova o scrivici.',
    prefer: "Preferisci l'email?",
    location: 'Ticino, Svizzera',
  },
  fr: {
    title: "Projecto — Documentation de gestion de projet par l'IA, sur tout le cycle de vie",
    desc: "Projecto est le copilote IA qui génère la documentation de gestion de projet — de la découverte et la planification à l'exécution, au suivi et à la clôture. Ancré à des sources citées, multi-méthodologies (PMI, HERMES, PRINCE2, Agile), localisé pour la Suisse. Inscrivez-vous à la liste d'attente.",
    eyebrow: 'Bientôt disponible',
    h1a: "Documentation de projet par l'IA,",
    h1b: 'sur tout le cycle de vie.',
    lead: "Projecto vous interviewe et génère chartes, plans et livrables ancrés à des sources, dans la méthodologie de votre choix — <strong>PMI, HERMES, PRINCE2, Agile</strong> — de la découverte à la clôture. Localisé pour la Suisse, conçu pour passer à l'échelle.",
    placeholder: 'vous@entreprise.com',
    cta: "Rejoindre la liste d'attente",
    joining: 'Envoi…',
    added: 'Ajouté ✓',
    success: 'Vous êtes sur la liste — nous vous contacterons. Merci !',
    invalid: 'Veuillez saisir une adresse e-mail valide.',
    error: 'Une erreur est survenue. Réessayez ou écrivez-nous.',
    network: 'Erreur réseau. Réessayez ou écrivez-nous.',
    prefer: "Vous préférez l'e-mail ?",
    location: 'Tessin, Suisse',
  },
  de: {
    title: 'Projecto — KI-gestützte Projektmanagement-Dokumentation über den gesamten Lebenszyklus',
    desc: 'Projecto ist der KI-Copilot, der Projektmanagement-Dokumentation erstellt — von Discovery und Planung bis Ausführung, Monitoring und Abschluss. Quellenbasiert, methodenbewusst (PMI, HERMES, PRINCE2, Agile), lokalisiert für die Schweiz. Trag dich in die Warteliste ein.',
    eyebrow: 'Demnächst',
    h1a: 'KI-gestützte Projektdokumentation,',
    h1b: 'über den gesamten Lebenszyklus.',
    lead: 'Projecto interviewt dich und erstellt quellenbasierte Charters, Pläne und Deliverables in deiner gewählten Methodik — <strong>PMI, HERMES, PRINCE2, Agile</strong> — von Discovery bis Abschluss. Lokalisiert für die Schweiz, gebaut zum Skalieren.',
    placeholder: 'du@firma.com',
    cta: 'In die Warteliste eintragen',
    joining: 'Senden…',
    added: 'Hinzugefügt ✓',
    success: 'Du bist auf der Liste — wir melden uns. Danke!',
    invalid: 'Bitte gib eine gültige E-Mail-Adresse ein.',
    error: 'Etwas ist schiefgelaufen. Bitte erneut versuchen oder schreib uns.',
    network: 'Netzwerkfehler. Bitte erneut versuchen oder schreib uns.',
    prefer: 'Lieber per E-Mail?',
    location: 'Tessin, Schweiz',
  },
}

const jsel = (s) => String(s).replace(/</g, '\\u003c') // safe per <script> JSON

export function renderPage(lang) {
  const t = T[lang] || T[DEFAULT_LOCALE]
  const url = `${BASE}/${lang}`
  const alternates = LOCALES.map(
    (l) => `  <link rel="alternate" hreflang="${l}" href="${BASE}/${l}" />`
  ).join('\n')
  const switcher = LOCALES.map(
    (l) => `<a href="/${l}"${l === lang ? ' class="on" aria-current="true"' : ''} hreflang="${l}">${LANG_LABEL[l]}</a>`
  ).join('<span class="sep">·</span>')
  const i18n = jsel(JSON.stringify({
    joining: t.joining, added: t.added, success: t.success, invalid: t.invalid, error: t.error, network: t.network,
  }))

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="theme-color" content="#FCFAEE" />

  <title>${t.title}</title>
  <meta name="description" content="${t.desc}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="${url}" />
${alternates}
  <link rel="alternate" hreflang="x-default" href="${BASE}/${DEFAULT_LOCALE}" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Projecto" />
  <meta property="og:title" content="${t.title}" />
  <meta property="og:description" content="${t.desc}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${BASE}/og-image.png?v=${ASSET_V}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="${OG_LOCALE[lang]}" />
${LOCALES.filter((l) => l !== lang).map((l) => `  <meta property="og:locale:alternate" content="${OG_LOCALE[l]}" />`).join('\n')}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${t.title}" />
  <meta name="twitter:description" content="${t.desc}" />
  <meta name="twitter:image" content="${BASE}/og-image.png?v=${ASSET_V}" />

  <link rel="icon" type="image/png" href="/favicon.png?v=${ASSET_V}" />
  <link rel="apple-touch-icon" href="/favicon.png?v=${ASSET_V}" />
  <link rel="manifest" href="/site.webmanifest" />
  <style>${CSS}</style>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": "${BASE}/#org", "name": "Projecto", "url": "${BASE}/", "email": "info@getprojecto.ch", "logo": "${BASE}/logo.png?v=${ASSET_V}", "areaServed": ["CH", "EU", "Worldwide"] },
      { "@type": "WebSite", "@id": "${BASE}/#website", "url": "${BASE}/", "name": "Projecto", "inLanguage": "${lang}", "publisher": { "@id": "${BASE}/#org" } },
      { "@type": "SoftwareApplication", "name": "Projecto", "applicationCategory": "BusinessApplication", "operatingSystem": "Web", "url": "${url}", "inLanguage": "${lang}", "description": "${t.desc}", "publisher": { "@id": "${BASE}/#org" } }
    ]
  }
  </script>
  <script>window.I18N=${i18n}</script>
${GA_SNIPPET}
</head>
<body>
  <div class="bg-grid" aria-hidden="true"></div>
  <nav class="langs" aria-label="Language">${switcher}</nav>

  <main class="wrap">
    <header class="brand">
      <img class="logo" src="${LOGO}" width="480" height="480" alt="Projecto" fetchpriority="high" />
    </header>

    <p class="eyebrow">${t.eyebrow}</p>
    <h1>${t.h1a}<br /><span class="accent">${t.h1b}</span></h1>
    <p class="lead">${t.lead}</p>

    <section class="cta" aria-label="${t.cta}">
      <form id="join-form" novalidate>
        <label class="sr-only" for="email">Email</label>
        <input id="email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="${t.placeholder}" required />
        <input class="hp" type="text" name="company" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <button type="submit">${t.cta}</button>
      </form>
      <p id="msg" class="msg" role="status" aria-live="polite"></p>
      <p class="alt">${t.prefer} <a href="mailto:info@getprojecto.ch?subject=Waiting%20list%20-%20Projecto">info@getprojecto.ch</a></p>
    </section>

    <footer class="foot">
      <span>© <span id="y">2026</span> Projecto</span><span class="dot">·</span>
      <span>${t.location}</span><span class="dot">·</span>
      <a href="mailto:info@getprojecto.ch">info@getprojecto.ch</a>
    </footer>
  </main>

  <script>${JS}</script>
</body>
</html>`
}
