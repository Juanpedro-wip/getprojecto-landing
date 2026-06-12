// Projecto — landing "coming soon" multilingua (it/en/fr/de) + waiting list.
// SEO: una URL per lingua (/en /it /fr /de) con hreflang; la root redirige
// alla lingua del browser. POST /api/join salva il lead (data/waitlist.json)
// e, se SMTP è configurato, notifica info@getprojecto.ch.
import 'dotenv/config'
import express from 'express'
import nodemailer from 'nodemailer'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { renderPage, LOCALES, DEFAULT_LOCALE } from './render.js'
import { LOGO } from './assets.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 4000
const TO = process.env.WAITLIST_TO || 'info@getprojecto.ch'
const DATA_DIR = path.join(__dirname, 'data')
const STORE = path.join(DATA_DIR, 'waitlist.json')
fs.mkdirSync(DATA_DIR, { recursive: true })

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(express.json({ limit: '8kb' }))
app.use(express.urlencoded({ extended: false, limit: '8kb' }))

// Asset statici (css/js/immagini/robots/sitemap/manifest). Niente index.html: l'HTML è renderizzato per lingua.
app.use(express.static(path.join(__dirname, 'public'), {
  index: false, // niente index.html automatico: la root redirige per lingua
  setHeaders(res) { res.setHeader('Cache-Control', 'public, max-age=86400') },
}))

// ── Waiting list ─────────────────────────────────────────────────────────────
let transporter = null
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE) === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  })
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ── Email di benvenuto all'iscritto (localizzata) ────────────────────────────
const WELCOME_SUBJECT = {
  it: 'Sei nella waiting list di Projecto 🎉',
  en: 'You’re on the Projecto waiting list 🎉',
  fr: 'Vous êtes sur la liste d’attente de Projecto 🎉',
  de: 'Du bist auf der Projecto-Warteliste 🎉',
}
const WELCOME_LINES = {
  it: ['Ciao,', 'grazie per esserti iscritto alla <strong>waiting list di Projecto</strong> — il copilota AI per la documentazione di project management, su tutto il ciclo di vita.', 'Ti scriviamo appena apriamo l’accesso. Niente spam, promesso.', 'A presto,<br>Il team di Projecto'],
  en: ['Hi,', 'thanks for joining the <strong>Projecto waiting list</strong> — the AI copilot for project-management documentation, across the whole lifecycle.', 'We’ll reach out as soon as we open access. No spam, promised.', 'See you soon,<br>The Projecto team'],
  fr: ['Bonjour,', 'merci de vous être inscrit à la <strong>liste d’attente de Projecto</strong> — le copilote IA pour la documentation de gestion de projet, sur tout le cycle de vie.', 'Nous vous écrirons dès l’ouverture des accès. Pas de spam, promis.', 'À bientôt,<br>L’équipe Projecto'],
  de: ['Hallo,', 'danke, dass du dich für die <strong>Projecto-Warteliste</strong> angemeldet hast — der KI-Copilot für Projektmanagement-Dokumentation über den gesamten Lebenszyklus.', 'Wir melden uns, sobald wir den Zugang öffnen. Kein Spam, versprochen.', 'Bis bald,<br>Dein Projecto-Team'],
}
const stripTags = (s) => s.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
const LOGO_B64 = LOGO.split(',')[1] // base64 puro per l'allegato CID nella mail
function welcomeEmail(lang) {
  const L = ['it', 'en', 'fr', 'de'].includes(lang) ? lang : 'en'
  const lines = WELCOME_LINES[L]
  const body = lines.map((l) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.55;color:#46506f;">${l}</p>`).join('')
  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#ffffff;padding:30px 16px;"><div style="max-width:480px;margin:0 auto;background:#fcfaee;border:1px solid #e7e2d2;border-radius:14px;padding:24px 26px 28px;"><img src="cid:logo@projecto" alt="Projecto" width="190" style="display:block;margin:0 auto 14px;" />${body}<p style="margin:18px 0 0;font-size:13px;color:#8a93ad;"><a href="https://getprojecto.ch" style="color:#2f5fd0;text-decoration:none;">getprojecto.ch</a></p></div></div>`
  return { subject: WELCOME_SUBJECT[L], html, text: lines.map(stripTags).join('\n\n') + '\n\ngetprojecto.ch' }
}
app.post('/api/join', (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    if (String(req.body.company || '')) return res.json({ ok: true }) // honeypot
    if (!EMAIL_RE.test(email) || email.length > 254) return res.status(400).json({ ok: false, error: 'invalid_email' })
    let list = []
    try { list = JSON.parse(fs.readFileSync(STORE, 'utf8')) } catch { /* primo lead */ }
    if (!list.some((e) => e.email === email)) {
      list.push({ email, at: new Date().toISOString(), ip: req.ip, lang: String(req.body.lang || '') })
      fs.writeFileSync(STORE, JSON.stringify(list, null, 2))
    }
    if (transporter) {
      const FROM = process.env.SMTP_FROM || `Projecto <${process.env.SMTP_USER || TO}>`
      // 1) notifica a te
      transporter.sendMail({
        from: FROM, to: TO, replyTo: email,
        subject: 'Nuova iscrizione waiting list — Projecto',
        text: `Nuova iscrizione.\n\nEmail: ${email}\nData: ${new Date().toISOString()}`,
      }).catch((e) => console.error('[mail]', e.message))
      // 2) benvenuto all'iscritto (localizzato)
      const w = welcomeEmail(String(req.body.lang || ''))
      transporter.sendMail({ from: FROM, to: email, replyTo: TO, subject: w.subject, text: w.text, html: w.html, attachments: [{ filename: 'projecto.jpg', content: LOGO_B64, encoding: 'base64', cid: 'logo@projecto' }] })
        .catch((e) => console.error('[mail-welcome]', e.message))
    } else {
      console.warn('[waitlist] SMTP non configurato: lead salvato su file →', email)
    }
    res.json({ ok: true })
  } catch (e) {
    console.error('[join]', e); res.status(500).json({ ok: false, error: 'server' })
  }
})

// ── Routing lingue ───────────────────────────────────────────────────────────
function pickLang(header) {
  const want = String(header || '').toLowerCase().split(',').map((p) => p.split(';')[0].trim().split('-')[0])
  return want.find((l) => LOCALES.includes(l)) || DEFAULT_LOCALE
}
app.get('/', (req, res) => res.redirect(302, '/' + pickLang(req.headers['accept-language'])))
app.get('/:lang', (req, res, next) => {
  const lang = req.params.lang
  if (!LOCALES.includes(lang)) return next()
  res.set('Cache-Control', 'no-cache').type('html').send(renderPage(lang))
})
app.get('/health', (_req, res) => res.json({ ok: true }))
app.use((_req, res) => res.redirect(302, '/' + DEFAULT_LOCALE)) // fallback soft

app.listen(PORT, () => console.log(`getprojecto landing → http://localhost:${PORT}`))
