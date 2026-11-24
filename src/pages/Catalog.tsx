import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router'
import { Search, SlidersHorizontal, Share2, X } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'
import MapView from '@/components/MapView'
import { PROPERTIES, DISTRICTS, COMPLEXES, DEVELOPERS } from '@/data/properties'
import type { Property, DealType, Layout } from '@/types'
import { useApp, GEL_RATE, trackEvent } from '@/lib/i18n'

const TABS: { id: DealType | 'map'; key: 'tab_map' | 'tab_rent' | 'tab_sale' | 'tab_new' }[] = [
  { id: 'map', key: 'tab_map' },
  { id: 'rent', key: 'tab_rent' },
  { id: 'sale', key: 'tab_sale' },
  { id: 'new', key: 'tab_new' },
]
const LAYOUTS: Layout[] = ['studio', '1', '2', '3', '4+']
const PAGE = 9

const selectCls =
  'bg-white border border-[#0e2b46]/15 px-3 py-2.5 text-[14px] text-[#0e2b46] outline-none focus:border-[#cea84e] transition-colors w-full cursor-pointer'
const inputCls =
  'bg-white border border-[#0e2b46]/15 px-3 py-2.5 text-[14px] text-[#0e2b46] outline-none focus:border-[#cea84e] transition-colors w-full'
const labelCls = 'block text-[11px] uppercase tracking-[.14em] text-[#3A4A57]/70 mb-1.5'
const chkCls = 'flex items-center gap-2 text-[14px] text-[#0e2b46] cursor-pointer select-none'

export default function Catalog() {
  const { tab = 'sale' } = useParams()
  const navigate = useNavigate()
  const [sp, setSp] = useSearchParams()
  const { t, lang, currency } = useApp()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [visible, setVisible] = useState(PAGE)
  const [copied, setCopied] = useState(false)
  const [suggests, setSuggests] = useState<string[]>([])
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null)
  const sentinel = useRef<HTMLDivElement>(null)

  const q = sp.get('q') || ''
  const deal: DealType | 'map' = (TABS.some((x) => x.id === tab) ? tab : 'sale') as DealType | 'map'

  const setParam = useCallback((k: string, v: string | null) => {
    setSp((prev) => {
      const n = new URLSearchParams(prev)
      if (v === null || v === '') n.delete(k)
      else n.set(k, v)
      return n
    }, { replace: true })
    setVisible(PAGE)
  }, [setSp])

  const filtered = useMemo(() => {
    let list = PROPERTIES.slice()
    if (deal !== 'map') list = list.filter((p) => p.deal === deal)
    if (q) {
      const s = q.toLowerCase()
      list = list.filter((p) =>
        [p.complex, p.district, p.address.ru, p.address.en, p.title.ru, p.title.en].join(' ').toLowerCase().includes(s))
    }
    const num = (k: string) => (sp.get(k) ? Number(sp.get(k)) : null)
    const pMin = num('pmin'), pMax = num('pmax'), aMin = num('amin'), fMin = num('fmin')
    const m2min = num('m2min'), m2max = num('m2max')
    if (pMin != null) list = list.filter((p) => p.priceUSD >= pMin)
    if (pMax != null) list = list.filter((p) => p.priceUSD <= pMax)
    if (m2min != null) list = list.filter((p) => p.priceUSD / p.area >= m2min)
    if (m2max != null) list = list.filter((p) => p.priceUSD / p.area <= m2max)
    if (aMin != null) list = list.filter((p) => p.area >= aMin)
    if (fMin != null) list = list.filter((p) => p.floor >= fMin)
    const dist = sp.get('district'), comp = sp.get('complex'), lay = sp.get('layout')
    const cond = sp.get('condition'), term = sp.get('term'), dev = sp.get('developer')
    if (dist) list = list.filter((p) => p.district === dist)
    if (comp) list = list.filter((p) => p.complex === comp)
    if (lay) list = list.filter((p) => p.layout === lay)
    if (cond) list = list.filter((p) => p.condition === cond)
    if (term) list = list.filter((p) => p.rentTerm === term)
    if (dev) list = list.filter((p) => p.developer === dev)
    if (sp.get('sea') === '1') list = list.filter((p) => p.seaView)
    if (sp.get('pets') === '1') list = list.filter((p) => p.petsAllowed)
    if (sp.get('docs') === '1') list = list.filter((p) => p.docsChecked)
    if (sp.get('inst') === '1') list = list.filter((p) => p.installment)
    switch (sp.get('sort')) {
      case 'price_asc': list.sort((a, b) => a.priceUSD - b.priceUSD); break
      case 'price_desc': list.sort((a, b) => b.priceUSD - a.priceUSD); break
      case 'area': list.sort((a, b) => b.area - a.area); break
      default: list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }
    return list
  }, [deal, q, sp])

  // autocomplete
  useEffect(() => {
    if (!q || q.length < 2) { setSuggests([]); return }
    const s = q.toLowerCase()
    const pool = [...COMPLEXES, ...DISTRICTS]
    const hits = pool.filter((x) => x.toLowerCase().includes(s) && x.toLowerCase() !== s).slice(0, 6)
    setSuggests(hits)
  }, [q])

  // infinite scroll
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const ob = new IntersectionObserver((es) => {
      if (es[0].isIntersecting) setVisible((v) => v + PAGE)
    }, { rootMargin: '400px' })
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      trackEvent('share_selection', { url: window.location.href })
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  const reset = () => { setSp({}, { replace: true }); setVisible(PAGE) }
  const openProp = useCallback((p: Property) => navigate(`/property/${p.slug}`), [navigate])
  const onSuggest = (s: string) => {
    setParam('q', s)
    const hit = PROPERTIES.find((p) => p.complex === s || p.district === s)
    if (hit) setFlyTo({ lat: hit.lat, lng: hit.lng })
  }

  const showPriceM2 = deal === 'sale' || deal === 'new'
  const shown = filtered.slice(0, visible)

  const filtersBlock = (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div>
        <label className={labelCls}>{deal === 'rent' ? t('price_month') : t('price')}, $</label>
        <div className="flex gap-2">
          <input className={inputCls} placeholder={t('price_from')} inputMode="numeric" value={sp.get('pmin') || ''} onChange={(e) => setParam('pmin', e.target.value.replace(/\D/g, ''))} />
          <input className={inputCls} placeholder={t('price_to')} inputMode="numeric" value={sp.get('pmax') || ''} onChange={(e) => setParam('pmax', e.target.value.replace(/\D/g, ''))} />
        </div>
      </div>
      {showPriceM2 && (
        <div>
          <label className={labelCls}>{t('price_m2')}, $</label>
          <div className="flex gap-2">
            <input className={inputCls} placeholder={t('price_from')} inputMode="numeric" value={sp.get('m2min') || ''} onChange={(e) => setParam('m2min', e.target.value.replace(/\D/g, ''))} />
            <input className={inputCls} placeholder={t('price_to')} inputMode="numeric" value={sp.get('m2max') || ''} onChange={(e) => setParam('m2max', e.target.value.replace(/\D/g, ''))} />
          </div>
        </div>
      )}
      <div>
        <label className={labelCls}>{t('district')}</label>
        <select className={selectCls} value={sp.get('district') || ''} onChange={(e) => setParam('district', e.target.value)}>
          <option value="">—</option>
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>{t('complex')}</label>
        <select className={selectCls} value={sp.get('complex') || ''} onChange={(e) => setParam('complex', e.target.value)}>
          <option value="">—</option>
          {COMPLEXES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {deal === 'new' && (
        <div>
          <label className={labelCls}>{t('developer')}</label>
          <select className={selectCls} value={sp.get('developer') || ''} onChange={(e) => setParam('developer', e.target.value)}>
            <option value="">—</option>
            {DEVELOPERS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className={labelCls}>{t('layout')}</label>
        <select className={selectCls} value={sp.get('layout') || ''} onChange={(e) => setParam('layout', e.target.value)}>
          <option value="">—</option>
          {LAYOUTS.map((l) => <option key={l} value={l}>{l === 'studio' ? (lang === 'ru' ? 'Студия' : 'Studio') : `${l}+1`}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>{t('area')}, {t('m2')} · {t('floor')}</label>
        <div className="flex gap-2">
          <input className={inputCls} placeholder={`${t('m2')} ${t('price_from')}`} inputMode="numeric" value={sp.get('amin') || ''} onChange={(e) => setParam('amin', e.target.value.replace(/\D/g, ''))} />
          <input className={inputCls} placeholder={t('floor')} inputMode="numeric" value={sp.get('fmin') || ''} onChange={(e) => setParam('fmin', e.target.value.replace(/\D/g, ''))} />
        </div>
      </div>
      {deal === 'rent' && (
        <div>
          <label className={labelCls}>{t('rent_term')}</label>
          <select className={selectCls} value={sp.get('term') || ''} onChange={(e) => setParam('term', e.target.value)}>
            <option value="">—</option>
            <option value="daily">{lang === 'ru' ? 'Посуточно' : 'Daily'}</option>
            <option value="monthly">{lang === 'ru' ? 'Помесячно' : 'Monthly'}</option>
            <option value="yearly">{lang === 'ru' ? 'Длительно' : 'Long term'}</option>
          </select>
        </div>
      )}
      {deal !== 'map' && (
        <div>
          <label className={labelCls}>{t('condition')}</label>
          <select className={selectCls} value={sp.get('condition') || ''} onChange={(e) => setParam('condition', e.target.value)}>
            <option value="">—</option>
            <option value="renovated">{t('cond_renovated')}</option>
            <option value="white">{t('cond_white')}</option>
            <option value="black">{t('cond_black')}</option>
            <option value="good">{t('cond_good')}</option>
          </select>
        </div>
      )}
      <div className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-wrap gap-x-6 gap-y-2 pt-1">
        <label className={chkCls}><input type="checkbox" checked={sp.get('sea') === '1'} onChange={(e) => setParam('sea', e.target.checked ? '1' : null)} className="accent-[#b08d3e] w-4 h-4" /> {t('sea_view')}</label>
        {deal === 'rent' && <label className={chkCls}><input type="checkbox" checked={sp.get('pets') === '1'} onChange={(e) => setParam('pets', e.target.checked ? '1' : null)} className="accent-[#b08d3e] w-4 h-4" /> {t('pets')}</label>}
        <label className={chkCls}><input type="checkbox" checked={sp.get('docs') === '1'} onChange={(e) => setParam('docs', e.target.checked ? '1' : null)} className="accent-[#b08d3e] w-4 h-4" /> {t('docs')}</label>
        {deal === 'new' && <label className={chkCls}><input type="checkbox" checked={sp.get('inst') === '1'} onChange={(e) => setParam('inst', e.target.checked ? '1' : null)} className="accent-[#b08d3e] w-4 h-4" /> {t('installment')}</label>}
      </div>
    </div>
  )

  const searchBlock = (
    <div className="relative flex-1 min-w-0">
      <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3A4A57]/50 pointer-events-none" />
      <input
        value={q}
        onChange={(e) => setParam('q', e.target.value)}
        placeholder={t('search_ph')}
        aria-label={t('search_ph')}
        className="w-full bg-white border border-[#0e2b46]/15 pl-10 pr-9 py-3 text-[15px] outline-none focus:border-[#cea84e] transition-colors"
      />
      {q && (
        <button onClick={() => setParam('q', null)} aria-label="Clear" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3A4A57]/50 hover:text-[#0e2b46] cursor-pointer">
          <X size={16} />
        </button>
      )}
      {suggests.length > 0 && (
        <ul className="absolute z-20 top-full mt-1 left-0 right-0 bg-white border border-[#0e2b46]/15 shadow-lg" role="listbox">
          {suggests.map((s) => (
            <li key={s}>
              <button onClick={() => onSuggest(s)} role="option" aria-selected="false"
                className="w-full text-left px-4 py-2.5 text-[14px] text-[#0e2b46] hover:bg-[#F8F7F4] cursor-pointer">
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  const tabsBar = (
    <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-[#0e2b46]/10">
      {TABS.map((tb) => (
        <Link
          key={tb.id}
          to={`/catalog/${tb.id}?${sp.toString()}`}
          className={`shrink-0 px-5 py-3 text-[13px] uppercase tracking-[.14em] font-medium transition-colors border-b-2 -mb-px ${
            deal === tb.id ? 'border-[#cea84e] text-[#0e2b46]' : 'border-transparent text-[#3A4A57]/60 hover:text-[#0e2b46]'
          }`}
        >
          {t(tb.key)}
        </Link>
      ))}
    </div>
  )

  // ======= MAP TAB =======
  if (deal === 'map') {
    return (
      <div className="min-h-dvh bg-[#F8F7F4] flex flex-col">
        <Header />
        <div className="pt-4 flex flex-col flex-1">
          <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8 pt-4">{tabsBar}</div>
          <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8 py-3 flex gap-3">
            {searchBlock}
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn-gold !py-2.5 !px-4" aria-expanded={filtersOpen}>
              <SlidersHorizontal size={15} /> {t('filters')}
            </button>
          </div>
          {filtersOpen && <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8 pb-4">{filtersBlock}</div>}
          <div className="relative h-[calc(100dvh-230px)] min-h-[440px]">
            <MapView properties={filtered} currency={currency} rate={GEL_RATE} onOpen={openProp} flyTo={flyTo} />
            {/* mobile bottom list */}
            <div className="md:hidden absolute bottom-0 left-0 right-0 p-3 flex gap-3 overflow-x-auto no-scrollbar bg-gradient-to-t from-[#0e2b46]/30 to-transparent">
              {filtered.slice(0, 12).map((p) => (
                <Link key={p.id} to={`/property/${p.slug}`} className="shrink-0 w-[240px] bg-white border border-[#0e2b46]/10 p-3 flex gap-3">
                  <img src={p.photos[0]} alt="" className="w-[72px] h-[72px] object-cover" />
                  <div className="min-w-0">
                    <div className="font-display text-[17px] text-[#0e2b46]">{currency === 'USD' ? '$' : '₾'}{(currency === 'USD' ? p.priceUSD : Math.round(p.priceUSD * GEL_RATE)).toLocaleString()}</div>
                    <div className="text-[12px] text-[#3A4A57]/75 truncate">{p.title[lang]}</div>
                    <div className="text-[11px] text-[#3A4A57]/60">{p.area} {t('m2')} · {p.district}</div>
                  </div>
                </Link>
              ))}
            </div>
            {/* desktop side list */}
            <div className="hidden md:block absolute top-4 left-4 bottom-4 w-[340px] overflow-y-auto bg-white/95 backdrop-blur border border-[#0e2b46]/10 p-3 space-y-3">
              <div className="text-[12px] uppercase tracking-[.14em] text-[#3A4A57]/70 px-1 pt-1">{filtered.length} {t('results')}</div>
              {filtered.map((p) => (
                <Link key={p.id} to={`/property/${p.slug}`} className="flex gap-3 p-2 hover:bg-[#F8F7F4] transition-colors border border-transparent hover:border-[#0e2b46]/10">
                  <img src={p.photos[0]} alt="" className="w-[92px] h-[76px] object-cover" loading="lazy" />
                  <div className="min-w-0">
                    <div className="font-display text-[18px] text-[#0e2b46] leading-tight">{currency === 'USD' ? '$' : '₾'}{(currency === 'USD' ? p.priceUSD : Math.round(p.priceUSD * GEL_RATE)).toLocaleString()}</div>
                    <div className="text-[13px] text-[#0e2b46] truncate">{p.title[lang]}</div>
                    <div className="text-[12px] text-[#3A4A57]/65">{p.area} {t('m2')} · {p.floor}/{p.floorsTotal} · {p.district}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ======= LIST TABS =======
  return (
    <div className="min-h-dvh bg-[#F8F7F4]">
      <Header />
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 pt-8 pb-20">
        {tabsBar}

        <div className="mt-5 flex flex-wrap gap-3 items-start">
          {searchBlock}
          <select
            className={`${selectCls} !w-auto`} aria-label="Sort"
            value={sp.get('sort') || ''} onChange={(e) => setParam('sort', e.target.value)}
          >
            <option value="">{t('sort_new')}</option>
            <option value="price_asc">{t('sort_price_asc')}</option>
            <option value="price_desc">{t('sort_price_desc')}</option>
            <option value="area">{t('sort_area')}</option>
          </select>
          <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn-gold !py-3" aria-expanded={filtersOpen}>
            <SlidersHorizontal size={15} /> {t('filters')}
          </button>
          <button onClick={share} className="border border-[#0e2b46]/20 text-[#0e2b46] px-5 py-3 text-[13px] uppercase tracking-[.14em] hover:bg-white transition-colors inline-flex items-center gap-2 cursor-pointer">
            <Share2 size={15} /> {copied ? t('copied') : t('share')}
          </button>
          <button onClick={reset} className="text-[13px] uppercase tracking-[.14em] text-[#3A4A57]/60 hover:text-[#0e2b46] px-2 py-3 cursor-pointer">
            {t('reset')}
          </button>
        </div>

        {filtersOpen && <div className="mt-5 bg-[#ede9e2]/50 border border-[#0e2b46]/10 p-5">{filtersBlock}</div>}

        <div className="mt-8 text-[13px] uppercase tracking-[.14em] text-[#3A4A57]/70">
          {filtered.length} {t('results')}
        </div>

        {shown.length === 0 ? (
          <div className="mt-16 text-center py-20 border border-dashed border-[#0e2b46]/20">
            <p className="text-[17px] text-[#3A4A57]/80 max-w-[46ch] mx-auto">{t('empty')}</p>
            <button onClick={reset} className="btn-gold mt-6">{t('reset')}</button>
          </div>
        ) : (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        )}
        <div ref={sentinel} />
        {visible < filtered.length && (
          <div className="mt-10 text-center">
            <button onClick={() => setVisible((v) => v + PAGE)} className="btn-gold">{t('load_more')}</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
