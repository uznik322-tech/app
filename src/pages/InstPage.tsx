import { useState } from 'react'
import { Link } from 'react-router'
import { Map, LayoutGrid, Sparkles, Handshake, MessageCircle, Send, Globe, Building2 } from 'lucide-react'
import LeadModal, { type LeadKind } from '@/components/LeadModal'
import { HERO_IMAGES } from '@/data/properties'
import { useApp, trackEvent } from '@/lib/i18n'

export default function InstPage() {
  const { t } = useApp()
  const [lead, setLead] = useState<LeadKind | null>(null)

  const btn =
    'w-full bg-white/95 text-[#0e2b46] py-4 px-5 flex items-center gap-3 text-[15px] font-medium tracking-wide hover:bg-white transition-colors cursor-pointer'

  return (
    <div className="min-h-dvh relative">
      <img src={HERO_IMAGES[0]} alt="" className="fixed inset-0 w-full h-full object-cover" />
      <div className="fixed inset-0 bg-[#0e2b46]/65" />
      <div className="relative mx-auto max-w-[420px] px-5 py-14 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#cea84e] flex items-center justify-center font-display text-[34px] text-white border-2 border-white/70">S</div>
        <h1 className="font-display text-[34px] !text-white mt-4">Seanest</h1>
        <p className="text-white/80 text-[14px] mt-1">{t('footer_tag')}</p>

        <div className="w-full mt-10 space-y-3">
          <Link to="/catalog/sale?utm_source=instagram" className={btn} onClick={() => trackEvent('inst_click', { to: 'catalog' })}>
            <LayoutGrid size={18} className="text-[#b08d3e]" /> {t('inst_catalog')}
          </Link>
          <Link to="/catalog/map?utm_source=instagram" className={btn} onClick={() => trackEvent('inst_click', { to: 'map' })}>
            <Map size={18} className="text-[#b08d3e]" /> {t('inst_map')}
          </Link>
          <button className={btn} onClick={() => { setLead('free'); trackEvent('inst_click', { to: 'free' }) }}>
            <Sparkles size={18} className="text-[#b08d3e]" /> {t('form_free')}
          </button>
          <button className={btn} onClick={() => { setLead('sell'); trackEvent('inst_click', { to: 'sell' }) }}>
            <Building2 size={18} className="text-[#b08d3e]" /> {t('form_sell')}
          </button>
          <button className={btn} onClick={() => { setLead('coop'); trackEvent('inst_click', { to: 'coop' }) }}>
            <Handshake size={18} className="text-[#b08d3e]" /> {t('inst_coop')}
          </button>
          <a href="https://wa.me/995557326104?utm_source=instagram" target="_blank" rel="noreferrer" className={btn}
            onClick={() => trackEvent('contact_click', { via: 'whatsapp', source: 'instagram' })}>
            <MessageCircle size={18} className="text-[#2e7d5b]" /> WhatsApp
          </a>
          <a href="https://t.me/seanest_batumi" target="_blank" rel="noreferrer" className={btn}
            onClick={() => trackEvent('contact_click', { via: 'telegram', source: 'instagram' })}>
            <Send size={18} className="text-[#0e2b46]" /> Telegram
          </a>
          <Link to="/?utm_source=instagram" className={btn}>
            <Globe size={18} className="text-[#b08d3e]" /> {t('inst_site')}
          </Link>
        </div>

        <p className="mt-10 text-white/50 text-[12px]">© {new Date().getFullYear()} Seanest · Batumi, Georgia</p>
      </div>
      {lead && <LeadModal kind={lead} onClose={() => setLead(null)} />}
    </div>
  )
}
