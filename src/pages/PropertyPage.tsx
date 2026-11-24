import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import {
  ArrowLeft, Heart, Share2, X, ChevronLeft, ChevronRight, Phone, MessageCircle, Send,
  BedDouble, Ruler, Building2, ShieldCheck, Waves, Mountain, PawPrint, Landmark, Flame, CalendarClock,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard, { priceSuffix } from '@/components/PropertyCard'
import MapView from '@/components/MapView'
import LeadModal from '@/components/LeadModal'
import { getProperty, getAgent, similarTo } from '@/data/properties'
import { useApp, GEL_RATE, trackEvent } from '@/lib/i18n'

export default function PropertyPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const { t, lang, currency, formatPrice, isFav, toggleFavorite } = useApp()
  const p = getProperty(slug)
  const [idx, setIdx] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [lead, setLead] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => { window.scrollTo(0, 0); setIdx(0) }, [slug])
  useEffect(() => { if (p) trackEvent('property_view', { id: p.id, slug }) }, [slug])

  const agent = p ? getAgent(p.agentId) : null
  const similar = useMemo(() => (p ? similarTo(p) : []), [p])

  if (!p || !agent) {
    return (
      <div className="min-h-dvh bg-[#F8F7F4]">
        <Header />
        <div className="pt-[140px] pb-32 text-center px-4">
          <h1 className="font-display text-[40px]">404</h1>
          <Link to="/catalog/sale" className="btn-gold mt-6 inline-flex">{t('back')}</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const pageUrl = typeof window !== 'undefined' ? window.location.href : ''
  const waMsg = encodeURIComponent(`${p.title[lang]} — ${pageUrl}`)
  const waLink = `https://wa.me/${agent.whatsapp}?text=${waMsg}`
  const tgLink = `https://t.me/${agent.telegram}?text=${waMsg}`

  const specs: { icon?: React.ElementType; label: string; value: string }[] = [
    { icon: BedDouble, label: t('layout'), value: p.layout === 'studio' ? (lang === 'ru' ? 'Студия' : 'Studio') : `${p.layout}+1` },
    { icon: Ruler, label: t('area'), value: `${p.area} ${t('m2')}` },
    { icon: Building2, label: t('floor'), value: `${p.floor} / ${p.floorsTotal}` },
    { label: t('condition'), value: t(`cond_${p.condition}` as 'cond_good') },
    { label: t('district'), value: p.district },
    { label: t('complex'), value: p.complex },
  ]
  if (p.deal === 'rent') {
    if (p.depositUSD != null) specs.push({ icon: Landmark, label: t('deposit'), value: formatPrice(p.depositUSD) })
    specs.push({ icon: CalendarClock, label: t('rent_term'), value: p.rentTerm === 'daily' ? (lang === 'ru' ? 'Посуточно' : 'Daily') : p.rentTerm === 'yearly' ? (lang === 'ru' ? 'Длительно' : 'Long term') : (lang === 'ru' ? 'Помесячно' : 'Monthly') })
    specs.push({ icon: PawPrint, label: t('pets'), value: p.petsAllowed ? '✓' : '—' })
    if (p.utilitiesIncluded) specs.push({ label: t('utilities'), value: '✓' })
  }
  if (p.deal === 'new') {
    if (p.developer) specs.push({ label: t('developer'), value: p.developer })
    if (p.completionDate) specs.push({ icon: CalendarClock, label: t('completion'), value: p.completionDate })
    if (p.installment) specs.push({ label: t('installment'), value: '✓' })
  }

  const flags = [
    p.seaView && { icon: Waves, l: t('tag_sea') },
    p.mountainView && { icon: Mountain, l: t('tag_mountains') },
    p.petsAllowed && { icon: PawPrint, l: t('tag_pets') },
    p.docsChecked && { icon: ShieldCheck, l: t('tag_docs') },
    p.gasified && { icon: Flame, l: t('tag_gas') },
  ].filter(Boolean) as { icon: React.ElementType; l: string }[]

  const share = async () => {
    const data = { title: p.title[lang], text: p.title[lang], url: pageUrl }
    if (navigator.share) {
      try { await navigator.share(data); trackEvent('share', { id: p.id, via: 'native' }); return } catch { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(pageUrl)
      setCopied(true); trackEvent('share', { id: p.id, via: 'clipboard' })
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  return (
    <div className="min-h-dvh bg-[#F8F7F4]">
      <Header />
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 pt-8 pb-24">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[.14em] text-[#3A4A57]/70 hover:text-[#0e2b46] cursor-pointer">
          <ArrowLeft size={15} /> {t('back')}
        </button>

        <div className="mt-5 grid lg:grid-cols-3 gap-8">
          {/* gallery */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[16/10] bg-[#ede9e2] overflow-hidden group">
              <img src={p.photos[idx]} alt={p.title[lang]} className="w-full h-full object-cover cursor-zoom-in" onClick={() => setLightbox(true)} />
              <span className="watermark">Seanest</span>
              <span className="absolute top-3 right-3 bg-[#0e2b46]/80 text-white text-[11px] px-2 py-1 rounded backdrop-blur">{idx + 1} / {p.photos.length}</span>
              <button onClick={() => setIdx((idx - 1 + p.photos.length) % p.photos.length)} aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 text-[#0e2b46] flex items-center justify-center cursor-pointer opacity-90 hover:opacity-100"><ChevronLeft size={18} /></button>
              <button onClick={() => setIdx((idx + 1) % p.photos.length)} aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 text-[#0e2b46] flex items-center justify-center cursor-pointer opacity-90 hover:opacity-100"><ChevronRight size={18} /></button>
            </div>
            <div className="mt-3 grid grid-cols-6 gap-2">
              {p.photos.map((src, i) => (
                <button key={src + i} onClick={() => setIdx(i)} aria-label={`Photo ${i + 1}`}
                  className={`aspect-square overflow-hidden cursor-pointer border-2 transition-colors ${i === idx ? 'border-[#cea84e]' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="font-display text-[30px]">{t('details')}</h2>
              <div className="mt-5 grid sm:grid-cols-2 gap-x-8">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-3 border-b border-[#0e2b46]/10">
                    <span className="text-[14px] text-[#3A4A57]/75 flex items-center gap-2">{s.icon && <s.icon size={15} className="text-[#cea84e]" />}{s.label}</span>
                    <span className="text-[15px] font-medium text-[#0e2b46] text-right">{s.value}</span>
                  </div>
                ))}
              </div>
              {flags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {flags.map((f) => (
                    <span key={f.l} className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-wide px-2.5 py-1.5 bg-[#0e2b46]/6 text-[#0e2b46] border border-[#0e2b46]/10">
                      <f.icon size={13} className="text-[#b08d3e]" /> {f.l}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10">
              <h2 className="font-display text-[30px]">{lang === 'ru' ? 'Описание' : 'Description'}</h2>
              <p className="mt-4 text-[16.5px] leading-[1.75] max-w-[68ch]">{p.description[lang]}</p>
            </div>

            <div className="mt-10 bg-[#0e2b46] text-white p-8">
              <h2 className="font-display text-[28px] !text-white">{t('support_title')}</h2>
              <p className="mt-3 text-white/80 max-w-[60ch]">{t('support_text')}</p>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-[30px]">{t('location')}</h2>
              <div className="mt-4 h-[340px] border border-[#0e2b46]/10">
                <MapView properties={[p]} currency={currency} rate={GEL_RATE} onOpen={() => {}} single />
              </div>
              <p className="mt-3 text-[14px] text-[#3A4A57]/75">{p.address[lang]}{p.complex !== '—' ? ` · ${p.complex}` : ''} · {p.district}</p>
            </div>
          </div>

          {/* sidebar */}
          <aside className="lg:sticky lg:top-6 self-start space-y-6">
            <div className="bg-white border border-[#0e2b46]/10 p-6">
              <h1 className="font-display text-[27px] leading-tight">{p.title[lang]}</h1>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-[38px] text-[#0e2b46]">{formatPrice(p.priceUSD)}</span>
                <span className="text-[15px] text-[#3A4A57]/60">{priceSuffix(p, t)}</span>
              </div>
              {p.deal !== 'rent' && (
                <div className="text-[14px] text-[#3A4A57]/70">{formatPrice(Math.round(p.priceUSD / p.area))} / {t('m2')}</div>
              )}
              <div className="mt-3 text-[14px] text-[#3A4A57]/80">{p.address[lang]}{p.complex !== '—' ? ` · ${p.complex}` : ''}</div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => { toggleFavorite(p.id); trackEvent('favorite_toggle', { id: p.id }) }}
                  className={`flex-1 border px-3 py-3 text-[12px] uppercase tracking-[.12em] inline-flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    isFav(p.id) ? 'bg-[#cea84e] border-[#cea84e] text-white' : 'border-[#0e2b46]/20 text-[#0e2b46] hover:bg-[#F8F7F4]'
                  }`}
                >
                  <Heart size={15} fill={isFav(p.id) ? 'currentColor' : 'none'} /> {t('favorites')}
                </button>
                <button onClick={share}
                  className="flex-1 border border-[#0e2b46]/20 text-[#0e2b46] px-3 py-3 text-[12px] uppercase tracking-[.12em] inline-flex items-center justify-center gap-2 hover:bg-[#F8F7F4] cursor-pointer transition-colors">
                  <Share2 size={15} /> {copied ? t('copied') : t('share_btn')}
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#0e2b46]/10 p-6">
              <div className="kicker">{t('your_agent')}</div>
              <div className="mt-4 flex items-center gap-4">
                <img src={agent.photo} alt={agent.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#cea84e]" />
                <div>
                  <div className="font-medium text-[#0e2b46] text-[17px]">{agent.name}</div>
                  <div className="text-[13px] text-[#3A4A57]/70">{agent.role}</div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-2.5">
                <a href={waLink} target="_blank" rel="noreferrer" onClick={() => trackEvent('contact_click', { via: 'whatsapp', id: p.id })}
                  className="flex items-center justify-center gap-2 bg-[#2e7d5b] text-white py-3.5 text-[13px] uppercase tracking-[.12em] hover:opacity-90 transition-opacity">
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <a href={tgLink} target="_blank" rel="noreferrer" onClick={() => trackEvent('contact_click', { via: 'telegram', id: p.id })}
                  className="flex items-center justify-center gap-2 bg-[#0e2b46] text-white py-3.5 text-[13px] uppercase tracking-[.12em] hover:opacity-90 transition-opacity">
                  <Send size={16} /> Telegram
                </a>
                <a href={`tel:${agent.phone}`} onClick={() => trackEvent('contact_click', { via: 'phone', id: p.id })}
                  className="flex items-center justify-center gap-2 border border-[#0e2b46]/25 text-[#0e2b46] py-3.5 text-[13px] uppercase tracking-[.12em] hover:bg-[#F8F7F4] transition-colors">
                  <Phone size={16} /> {t('call')}
                </a>
                <button onClick={() => setLead(true)} className="btn-gold justify-center !py-3.5">
                  {t('pick_similar')}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* similar */}
        <section className="mt-20">
          <span className="kicker">{t('feat_kicker')}</span>
          <h2 className="font-display text-[34px] md:text-[42px] mt-3">{t('similar')}</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((s) => <PropertyCard key={s.id} p={s} />)}
          </div>
        </section>
      </div>

      <Footer />

      {lead && <LeadModal kind="similar" context={p.title[lang]} onClose={() => setLead(false)} />}

      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-[#0e2b46]/95 flex items-center justify-center" role="dialog" aria-modal="true"
          onClick={(e) => e.target === e.currentTarget && setLightbox(false)}>
          <button onClick={() => setLightbox(false)} aria-label="Close" className="absolute top-4 right-4 text-white/80 hover:text-white p-2 cursor-pointer"><X size={28} /></button>
          <button onClick={() => setIdx((idx - 1 + p.photos.length) % p.photos.length)} aria-label="Previous"
            className="absolute left-4 text-white/80 hover:text-white p-2 cursor-pointer"><ChevronLeft size={36} /></button>
          <img src={p.photos[idx]} alt={p.title[lang]} className="max-h-[85dvh] max-w-[92vw] object-contain" />
          <button onClick={() => setIdx((idx + 1) % p.photos.length)} aria-label="Next"
            className="absolute right-4 text-white/80 hover:text-white p-2 cursor-pointer"><ChevronRight size={36} /></button>
          <div className="absolute bottom-5 text-white/70 text-[13px]">{idx + 1} / {p.photos.length}</div>
        </div>
      )}
    </div>
  )
}

