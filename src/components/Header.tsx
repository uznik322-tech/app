import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Heart, Instagram, Send, MessageCircle, Menu, X } from 'lucide-react'
import { useApp, trackEvent } from '@/lib/i18n'
import LeadModal from '@/components/LeadModal'
import type { Lang, Currency } from '@/types'

const LANGS: Lang[] = ['ru', 'en', 'ka']
const CURS: Currency[] = ['USD', 'GEL']

export default function Header() {
  const { t, lang, setLang, currency, setCurrency, favorites } = useApp()
  const [open, setOpen] = useState(false)
  const [lead, setLead] = useState(false)
  const loc = useLocation()
  const navigate = useNavigate()

  const goAnchor = (id: string) => {
    setOpen(false)
    if (loc.pathname !== '/') navigate(`/#${id}`)
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const navCls = 'text-[13px] md:text-[14px] font-semibold tracking-wide text-[#1a1a1a] uppercase hover:opacity-70 transition-opacity cursor-pointer'

  return (
    <>
      <header className="relative z-50 bg-[#7EAFF6]">
        {/* top row */}
        <div className="mx-auto max-w-[1360px] px-4 md:px-8 pt-4 md:pt-6">
          <div className="hidden md:grid grid-cols-3 items-center">
            <nav className="flex gap-8" aria-label="Main left">
              <Link to="/catalog/sale" className={navCls}>{lang === 'ru' ? 'Объекты' : 'Listings'}</Link>
              <button onClick={() => goAnchor('about')} className={navCls}>{lang === 'ru' ? 'О нас' : 'About us'}</button>
            </nav>
            <Link to="/" className="justify-self-center flex flex-col items-center -mt-2" aria-label="Seanest home">
              <svg width="46" height="52" viewBox="0 0 46 52" fill="none" aria-hidden="true">
                <path d="M8 6h30l-3 14H11L8 6Z" fill="#1a1a1a"/>
                <path d="M11 22h24l-3 26a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2l-3-26Z" fill="#1a1a1a"/>
                <path d="M6 2h34" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round"/>
                <path d="M23 28c3.3 0 5 2.4 5 5 0 3.6-5 8-5 8s-5-4.4-5-8c0-2.6 1.7-5 5-5Z" fill="#7EAFF6"/>
              </svg>
              <span className="text-[24px] font-bold text-[#1a1a1a] leading-none mt-1 tracking-tight">seanest</span>
            </Link>
            <nav className="flex gap-8 justify-self-end" aria-label="Main right">
              <button onClick={() => goAnchor('why')} className={navCls}>{lang === 'ru' ? 'Как мы работаем' : 'Our process'}</button>
              <button onClick={() => goAnchor('contact')} className={navCls}>{lang === 'ru' ? 'Контакты' : 'Contact us'}</button>
            </nav>
          </div>

          {/* second row */}
          <div className="hidden md:flex items-center justify-center gap-10 mt-5 pb-5 relative">
            <div className="flex items-center gap-5 text-[#1a1a1a]">
              <a href="https://t.me/seanest_batumi" target="_blank" rel="noreferrer" aria-label="Telegram" className="hover:opacity-70"><Send size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:opacity-70"><Instagram size={21} /></a>
              <a href="https://wa.me/995557326104" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="hover:opacity-70"><MessageCircle size={21} /></a>
            </div>
            <button onClick={() => { setLead(true); trackEvent('lead_open', { kind: 'free', source: 'header' }) }} className="btn-salmon">
              {lang === 'ru' ? 'Бесплатная подборка недвижимости' : 'Get Your Free Property Match'}
            </button>
            <div className="absolute right-0 flex items-center gap-5 text-[#1a1a1a]">
              <Link to="/favorites" aria-label={t('favorites')} className="relative hover:opacity-70">
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#F5907A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{favorites.length}</span>
                )}
              </Link>
              <span className="flex gap-1.5 text-[14px] font-semibold">
                {LANGS.map((l) => (
                  <button key={l} onClick={() => setLang(l)}
                    className={`uppercase cursor-pointer ${lang === l ? 'opacity-100' : 'opacity-45 hover:opacity-80'}`}>{l}</button>
                ))}
              </span>
              <span className="flex gap-1.5 text-[12px] font-semibold border-l border-[#1a1a1a]/30 pl-4">
                {CURS.map((c) => (
                  <button key={c} onClick={() => setCurrency(c)}
                    className={`cursor-pointer ${currency === c ? 'opacity-100' : 'opacity-45 hover:opacity-80'}`}>{c}</button>
                ))}
              </span>
            </div>
          </div>

          {/* mobile */}
          <div className="md:hidden flex items-center justify-between pb-4">
            <Link to="/" className="flex items-center gap-2" aria-label="Seanest home">
              <span className="text-[24px] font-bold text-[#1a1a1a] tracking-tight">seanest</span>
            </Link>
            <div className="flex items-center gap-4 text-[#1a1a1a]">
              <Link to="/favorites" aria-label={t('favorites')} className="relative">
                <Heart size={20} />
                {favorites.length > 0 && <span className="absolute -top-2 -right-2 bg-[#F5907A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{favorites.length}</span>}
              </Link>
              <button onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open} className="cursor-pointer">
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div className="md:hidden bg-[#7EAFF6] border-t border-[#1a1a1a]/10 px-5 py-4 flex flex-col gap-1">
            <Link to="/catalog/map" onClick={() => setOpen(false)} className="py-3 text-[15px] font-semibold text-[#1a1a1a] uppercase">{t('tab_map')}</Link>
            <Link to="/catalog/rent" onClick={() => setOpen(false)} className="py-3 text-[15px] font-semibold text-[#1a1a1a] uppercase">{t('nav_rent')}</Link>
            <Link to="/catalog/sale" onClick={() => setOpen(false)} className="py-3 text-[15px] font-semibold text-[#1a1a1a] uppercase">{t('nav_sale')}</Link>
            <Link to="/catalog/new" onClick={() => setOpen(false)} className="py-3 text-[15px] font-semibold text-[#1a1a1a] uppercase">{t('nav_new')}</Link>
            <button onClick={() => goAnchor('about')} className="py-3 text-left text-[15px] font-semibold text-[#1a1a1a] uppercase cursor-pointer">{lang === 'ru' ? 'О нас' : 'About us'}</button>
            <button onClick={() => goAnchor('contact')} className="py-3 text-left text-[15px] font-semibold text-[#1a1a1a] uppercase cursor-pointer">{lang === 'ru' ? 'Контакты' : 'Contact us'}</button>
            <button onClick={() => { setOpen(false); setLead(true) }} className="btn-salmon mt-2 justify-center">
              {lang === 'ru' ? 'Бесплатная подборка' : 'Free Property Match'}
            </button>
            <div className="flex items-center justify-between pt-4">
              <div className="flex gap-2 text-[13px] text-[#1a1a1a] font-semibold">
                {LANGS.map((l) => (
                  <button key={l} onClick={() => setLang(l)} className={`uppercase px-2.5 py-1.5 rounded cursor-pointer ${lang === l ? 'bg-[#1a1a1a] text-white' : 'bg-white/40'}`}>{l}</button>
                ))}
              </div>
              <div className="flex gap-2 text-[13px] text-[#1a1a1a] font-semibold">
                {CURS.map((c) => (
                  <button key={c} onClick={() => setCurrency(c)} className={`px-2.5 py-1.5 rounded cursor-pointer ${currency === c ? 'bg-[#F5907A] text-white' : 'bg-white/40'}`}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
      {lead && <LeadModal kind="free" onClose={() => setLead(false)} />}
    </>
  )
}
