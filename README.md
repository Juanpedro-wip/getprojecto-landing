# getprojecto.ch — Landing "coming soon"

Landing multilingua (IT / EN / FR / DE) per **getprojecto.ch**, con waiting list.
Node.js + Express. **Niente build**: CSS, logo e JS sono *inline* (in `assets.js`),
così il deploy non dipende dalla cartella `public/`.

## Funzioni
- 4 lingue con URL dedicati (`/it` `/en` `/fr` `/de`) + `hreflang`; la root redirige
  alla lingua del browser.
- **Waiting list**: `POST /api/join` → salva il lead in `data/waitlist.json`, e — se l'SMTP
  è configurato — invia una **notifica** a `info@getprojecto.ch` e una **mail di benvenuto**
  all'iscritto (logo allegato via CID, testo localizzato).
- SEO: `sitemap.xml`, `robots.txt`, JSON-LD, OpenGraph.

## Sviluppo locale
```bash
npm install
npm start            # http://localhost:4000
```

## Variabili d'ambiente (`.env`)
Crea un file `.env` nella root (vedi `.env.example`). **Non è versionato** (è in `.gitignore`).
```ini
PORT=4000
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@getprojecto.ch
SMTP_PASS=la_password_della_casella
SMTP_FROM=Projecto <info@getprojecto.ch>
WAITLIST_TO=info@getprojecto.ch
```
Senza SMTP i lead vengono **solo salvati su file** (nessuna email).
⚠️ Il client SMTP si crea **all'avvio**: dopo aver creato/modificato il `.env`, **riavvia l'app**.

### Google Analytics 4
Ogni pagina include lo snippet `gtag.js` con l'ID di produzione **`G-R5QT266WNY`**
(default in `render.js` — l'ID è pubblico, compare comunque nel sorgente delle pagine).
Oltre alle `page_view` automatiche, l'iscrizione alla waiting list invia l'evento
**`generate_lead`** (con parametro `language`), da marcare come evento chiave in GA4.
`GA_MEASUREMENT_ID` nel `.env` sovrascrive il default; **vuoto** (`GA_MEASUREMENT_ID=`)
disattiva del tutto lo snippet (utile in sviluppo). Si legge all'avvio → riavvia dopo la modifica.

## Deploy (Infomaniak Node.js, via Git)
Prima installazione — nella cartella del sito, via SSH:
```bash
git clone https://github.com/Juanpedro-wip/getprojecto-landing.git .
npm install
# crea il .env con le SMTP (una volta)
```
Pannello: **Esecuzione** `npm start` · **Porta** `4000` · **Build** `npm install`.

### Aggiornamenti
```bash
git pull
npm install        # solo se sono cambiate le dipendenze
# poi: Riavvia l'app dal pannello
```
`.env`, `node_modules` e i lead **non vengono toccati**.

## Note
- `assets.js` è **generato** (CSS + logo + JS inline). Se cambiano stile/logo/JS va rigenerato.
- L'app ascolta su `process.env.PORT` (default `4000`).
- I lead sono in `data/waitlist.json` (`cat data/waitlist.json`).
