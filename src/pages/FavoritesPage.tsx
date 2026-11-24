import { Link } from 'react-router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'
import { PROPERTIES } from '@/data/properties'
import { useApp } from '@/lib/i18n'

export default function FavoritesPage() {
  const { t, favorites } = useApp()
  const list = PROPERTIES.filter((p) => favorites.includes(p.id))
  return (
    <div className="min-h-dvh bg-[#F8F7F4]">
      <Header />
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 pt-8 pb-24">
        <span className="kicker">Seanest</span>
        <h1 className="font-display text-[40px] md:text-[52px] mt-3">{t('favorites')}</h1>
        {list.length === 0 ? (
          <div className="mt-14 text-center py-20 border border-dashed border-[#0e2b46]/20">
            <p className="text-[17px] text-[#3A4A57]/80 max-w-[48ch] mx-auto">{t('fav_empty')}</p>
            <Link to="/catalog/sale" className="btn-gold mt-6 inline-flex">{t('hero_cta_catalog')}</Link>
          </div>
        ) : (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
