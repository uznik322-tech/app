import { useState } from 'react'
import { Instagram, Send, MessageCircle, Phone, Music2, CheckCircle2, ArrowUp } from 'lucide-react'
import { useApp, trackEvent } from '@/lib/i18n'

export default function Footer() {
  const { t, lang } = useApp()
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [msg, setMsg] = useState('')
  const [way, setWay] = useState('whatsapp')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState(false)

  const ways = [
    { id: 'whatsapp', label: 'WhatsApp' },
    { id: 'phone', label: lang === 'ru' ? 'Телефон' : 'Phone' },
    { id: 'telegram', label: 'Telegram' },
  ]

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) { setErr(true); return }
    trackEvent('lead_submitted', { name, contact, msg, way, kind: 'contact', url: window.location.href, ts: new Date().toISOString() })
    setSent(true)
  }

  const inputCls =
    'w-full bg-transparent border border-[#1a1a1a]/60 px-4 py-3.5 text-[15px] text-[#1a1a1a] placeholder:text-[#1a1a1a]/45 outline-none focus:border-[#1a1a1a] transition-colors rounded-sm'

  return (
    <footer>
      {/* Contact section */}
      <section id="contact" className="bg-[#7EAFF6] py-16 md:py-20">
        <div className="mx-auto max-w-[1160px] px-4 md:px-8">
          <h2 className="text-[30px] md:text-[36px] font-bold text-center text-[#1a1a1a]">
            {lang === 'ru' ? 'Свяжитесь с нами' : 'Contact Us'}
          </h2>
          <p className="mt-4 text-center text-[17px] text-[#1a1a1a]/85 max-w-[52ch] mx-auto">
            {lang === 'ru'
              ? 'Позвоните или напишите нам в мессенджеры — проконсультируем и поможем подобрать недвижимость.'
              : 'Get in touch with us by phone or via messengers for a consultation and help choosing the right property.'}
          </p>

          <div className="mt-12 grid md:grid-cols-2 gap-12">
            <div className="text-[#1a1a1a]">
              <a href="tel:+995557326104" className="block text-[24px] md:text-[28px] font-light hover:opacity-70">+995 557 326 104</a>
              <a href="mailto:hello@seanest.ge" className="block text-[24px] md:text-[28px] font-light mt-1 hover:opacity-70 break-all">hello@seanest.ge</a>
              <p className="mt-5 text-[16px]">Georgia, Batumi</p>
              <div className="flex gap-3 mt-5">
                {[
                  { href: 'https://t.me/seanest_batumi', icon: Send, label: 'Telegram' },
                  { href: 'https://wa.me/995557326104', icon: MessageCircle, label: 'WhatsApp' },
                  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
                  { href: 'https://tiktok.com', icon: Music2, label: 'TikTok' },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                    className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center hover:bg-[#333] transition-colors">
                    <s.icon size={17} />
                  </a>
                ))}
              </div>
            </div>

            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-8 text-[#1a1a1a]">
                <CheckCircle2 size={48} />
                <h3 className="text-[24px] font-bold mt-4">{t('form_ok_t')}</h3>
                <p className="mt-2">{t('form_ok_d')}</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4" noValidate>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('form_name')} aria-label={t('form_name')} className={inputCls} />
                <div>
                  <div className="text-[15px] text-[#1a1a1a] mb-2">{lang === 'ru' ? 'Удобный способ связи' : 'Preferred Way to Contact You'}</div>
                  <div className="flex flex-wrap gap-2">
                    {ways.map((w) => (
                      <button key={w.id} type="button" onClick={() => setWay(w.id)}
                        className={`flex items-center gap-2 px-4 py-2 border text-[14px] rounded-sm cursor-pointer transition-colors ${
                          way === w.id ? 'border-[#1a1a1a] bg-white/25 text-[#1a1a1a]' : 'border-transparent text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
                        }`}>
                        {w.id === 'phone' ? <Phone size={14} /> : w.id === 'whatsapp' ? <MessageCircle size={14} /> : <Send size={14} />}
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>
                <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t('form_contact')} aria-label={t('form_contact')} className={inputCls} />
                <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder={t('form_msg')} aria-label={t('form_msg')} rows={4} className={`${inputCls} resize-none`} />
                {err && <p className="text-[13px] text-[#8a2b1d]">{t('form_err')}</p>}
                <div>
                  <button type="submit" className="btn-dark">{lang === 'ru' ? 'Написать нам' : 'Talk to Us'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* bottom strip */}
      <div className="bg-white border-t border-[#1a1a1a]/10">
        <div className="mx-auto max-w-[1360px] px-4 md:px-8 py-5 flex items-center justify-between text-[13px] font-semibold text-[#1a1a1a]">
          <span>© Seanest</span>
          <span>{t('footer_tag')}</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-1 cursor-pointer hover:opacity-70" aria-label="Back to top">
            {new Date().getFullYear()} <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}
