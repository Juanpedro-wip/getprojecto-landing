# Projecto — landing "coming soon" (getprojecto.ch)

Pagina Node.js (Express) con waiting list e SEO completa.

## Avvio locale
```bash
npm install
npm run dev      # con auto-reload, oppure: npm start
# → http://localhost:3000
```

## Come funziona la waiting list
- Il bottone invia l'email a `POST /api/join`.
- L'indirizzo viene **salvato in `data/waitlist.json`** (dedupe) — funziona anche senza email.
- Se configuri lo **SMTP** in `.env`, arriva anche una **notifica a `info@getprojecto.ch`**.

### Configurare l'email (consigliato)
Copia `.env.example` in `.env` e compila i campi SMTP. Provider facili:
- **Resend** / **Postmark** / **Mailgun** (SMTP dedicato, ottima deliverability)
- **Infomaniak** (svizzero) o l'SMTP del provider del dominio getprojecto.ch
```
SMTP_HOST=smtp.tuoprovider.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM="Projecto <noreply@getprojecto.ch>"
```

## Logo
La pagina usa `public/logo.png` (hero) e `public/favicon.png` + `public/og-image.png`.
Ho messo come default il **logo bussola** pulito (navy/ambra, trasparente).
👉 Per usare il **tuo** logo: sovrascrivi `public/logo.png` (consigliato PNG trasparente, ~360×120 o quadrato),
e se vuoi rigenera `public/og-image.png` (1200×630) con la tua grafica.

## SEO già pronta
- `<title>`, description, keywords, canonical, robots, theme-color
- **Open Graph** + **Twitter Card** (immagine `og-image.png`)
- **JSON-LD** schema.org: Organization + WebSite + SoftwareApplication
- `robots.txt` + `sitemap.xml` + `site.webmanifest` + favicon
- HTML semantico, mobile-first, leggera e veloce (no font esterni) → buoni Core Web Vitals

### Dopo il deploy (per posizionarsi)
1. Verifica il dominio su **Google Search Console** e **Bing Webmaster Tools**, invia `sitemap.xml`.
2. Assicurati che il sito risponda in **HTTPS** (certificato) e su `https://getprojecto.ch` (con redirect da www).
3. La SEO tecnica è perfetta, ma il **ranking alto richiede contenuti + tempo + backlink**: una coming-soon
   indicizza subito ma sale di posizione man mano che aggiungi pagine/contenuti reali.

## Deploy
Serve un host che esegua Node (per l'endpoint `/api/join`):
- **Render** / **Railway** / **Fly.io** (Node, free tier): build `npm install`, start `npm start`.
- Poi punta il dominio: record **A/CNAME** di `getprojecto.ch` verso l'host (DNS dal registrar).
- In alternativa solo-statico (senza Node): pubblica `public/` su Netlify/Vercel e usa un form-service
  (Netlify Forms / Formspree) al posto di `/api/join`.

I lead sono in `data/waitlist.json` (e/o via email). Fai backup di quel file.
