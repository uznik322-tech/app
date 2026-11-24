import { useState } from 'react'
import { Link } from 'react-router'
import { Heart, ChevronLeft, ChevronRight, BedDouble, Ruler, Building2 } from 'lucide-react'
import type { Property } from '@/types'
import { useApp, trackEvent } from '@/lib/i18n'

export function priceSuffix(p: Property, t: (k: 'per_month' | 'per_day') => string) {
  if (p.deal !== 'rent') return ''
  return p.rentTerm === 'daily' ? t('per_day') : t('per_month')
}

export default function PropertyCard({ p }: { p: Property }) {
  const { t, lang, formatPrice, isFav, toggleFavorite } = useApp()
  const [i, setI] = useState(0)
  const fav = isFav(p.id)

  const tags: string[] = []
  if (p.exclusive) tags.push(t('tag_exclusive'))
  if (p.urgent) tags.push(t('tag_urgent'))
  if (p.seaView) tags.push(t('tag_sea'))
  else if (p.mountainView) tags.push(t('tag_mountains'))
  if (p.petsAllowed) tags.push(t('tag_pets'))
  if (p.installment) tags.push(t('tag_installment'))
  if (p.docsChecked) tags.push(t('tag_docs'))

  const next = (e: React.MouseEvent, d: number) => {
    e.preventDefault()
    setI((i + d + p.photos.length) % p.photos.length)
  }

  return (
    <Link to={`/property/${p.slug}`} className="prop-card block bg-white border border-[#0e2b46]/10 overflow-hidden group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={p.photos[i]} alt={p.title[lang]} loading="lazy" className="w-full h-full object-cover" />
        <span className="watermark">Seanest</span>
        <span className="absolute top-3 right-3 bg-[#0e2b46]/80 text-white text-[11px] px-2 py-1 rounded backdrop-blur">
          {i + 1} / {p.photos.length}
        </span>
        {p.photos.length > 1 && (
          <>
            <button onClick={(e) => next(e, -1)} aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 text-[#0e2b46] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button onClick={(e) => next(e, 1)} aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 text-[#0e2b46] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggleFavorite(p.id); trackEvent('favorite_toggle', { id: p.id, fav: !fav }) }}
          aria-label={t('favorites')} aria-pressed={fav}
          className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            fav ? 'bg-[#cea84e] text-white scale-105' : 'bg-white/85 text-[#0e2b46] hover:bg-white'
          }`}
        >
          <Heart size={17} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <div className="font-display text-[24px] leading-none text-[#0e2b46]">
            {formatPrice(p.priceUSD)}<span className="text-[14px] text-[#3A4A57]/60">{priceSuffix(p, t)}</span>
          </div>
          {p.deal !== 'rent' && (
            <div className="text-[12px] text-[#3A4A57]/60 whitespace-nowrap">{formatPrice(Math.round(p.priceUSD / p.area))}/{t('m2')}</div>
          )}
        </div>
        <div className="mt-2 font-medium text-[#0e2b46] leading-snug line-clamp-1">{p.title[lang]}</div>
        <div className="mt-1 text-[13px] text-[#3A4A57]/70 line-clamp-1">{p.address[lang]} · {p.complex !== '—' ? p.complex : p.district}</div>

        <div className="mt-4 flex items-center gap-4 text-[13px] text-[#3A4A57]/80">
          <span className="flex items-center gap-1.5"><BedDouble size={15} className="text-[#cea84e]" /> {p.layout === 'studio' ? (lang === 'ru' ? 'Студия' : 'Studio') : `${p.layout}+1`}</span>
          <span className="flex items-center gap-1.5"><Ruler size={15} className="text-[#cea84e]" /> {p.area} {t('m2')}</span>
          <span className="flex items-center gap-1.5"><Building2 size={15} className="text-[#cea84e]" /> {p.floor}/{p.floorsTotal}</span>
        </div>

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-[10.5px] uppercase tracking-wide px-2 py-1 bg-[#0e2b46]/6 text-[#0e2b46] border border-[#0e2b46]/10">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
