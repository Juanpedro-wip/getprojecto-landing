// Waiting list (messaggi localizzati via window.I18N iniettato dal server).
const T = window.I18N || {}
const yEl = document.getElementById('y')
if (yEl) yEl.textContent = new Date().getFullYear()

const form = document.getElementById('join-form')
const msg = document.getElementById('msg')
const btn = form.querySelector('button')
const input = document.getElementById('email')

function show(text, ok) {
  msg.textContent = text
  msg.className = 'msg ' + (ok ? 'ok' : 'err')
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = input.value.trim()
  const company = form.company.value // honeypot
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    show(T.invalid || 'Please enter a valid email address.', false)
    input.focus()
    return
  }
  btn.disabled = true
  const original = btn.textContent
  btn.textContent = T.joining || 'Joining…'
  try {
    const r = await fetch('/api/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, company, lang: document.documentElement.lang }),
    })
    const data = await r.json().catch(() => ({}))
    if (r.ok && data.ok) {
      form.reset()
      show(T.success || "You're on the list. Thank you!", true)
      btn.textContent = T.added || 'Added ✓'
      return
    }
    show(T.error || 'Something went wrong.', false)
    btn.disabled = false
    btn.textContent = original
  } catch {
    show(T.network || 'Network error.', false)
    btn.disabled = false
    btn.textContent = original
  }
})
