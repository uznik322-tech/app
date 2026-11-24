import { useState } from 'react'
import { Link } from 'react-router'
import { Star, Send } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeadModal, { type LeadKind } from '@/components/LeadModal'
import { HERO_IMAGES, BUILDING_IMAGES as B } from '@/data/properties'
import { useApp, trackEvent } from '@/lib/i18n'

export default function Home() {
  const { t, lang } = useApp()
  const [lead, setLead] = useState<LeadKind | null>(null)
  const ru = lang === 'ru'

  const stats = [
    { v: '2000+', l: ru ? 'Активных объектов в нашей базе' : 'Active listings in our database' },
    { v: '73%', l: ru ? 'клиентов возвращаются к нам после первой сделки' : 'of clients return to us after their first deal' },
    { v: '400+', l: ru ? 'закрытых сделок за последние два года' : 'Closed transactions in the past two years' },
  ]

  const services = [
    { img: B.commercial, h: 'h-[300px] md:h-[320px]', title: ru ? 'Коммерческая недвижимость' : 'Commercial Property', text: ru ? 'Ваш бизнес начинается с правильной локации — найдём идеальный офис, торговое помещение или склад.' : 'Your business starts with the right location — we’ll find the perfect office, retail space, or warehouse.', to: '/catalog/sale' },
    { img: B.newdev, h: 'h-[300px] md:h-[520px]', title: ru ? 'Новостройки' : 'New Developments', text: ru ? 'Ваш дом XXI века — продуманный дизайн, современный комфорт и функциональность.' : 'Your 21st-century home — smart design, modern comfort, and functionality.', to: '/catalog/new' },
    { img: B.country, h: 'h-[300px] md:h-[320px]', title: ru ? 'Загородная недвижимость' : 'Country Real Estate', text: ru ? 'Жизнь в гармонии с природой — дома и участки вдали от городской суеты.' : 'Live in harmony with nature — houses and plots away from the city bustle.', to: '/catalog/sale' },
    { img: B.ready, h: 'h-[300px] md:h-[340px]', title: ru ? 'Готовые к заселению квартиры' : 'Ready-to-Move Apartments', text: ru ? 'Квартиры, в которые можно заехать уже завтра.' : 'Homes you can move into tomorrow.', to: '/catalog/sale' },
    { img: B.rent, h: 'h-[300px] md:h-[340px]', title: ru ? 'Аренда квартир' : 'Apartment Rentals', text: ru ? 'Большая база актуальных объектов — быстро, безопасно и без лишних хлопот.' : 'A large database of up-to-date listings — fast, safe, and hassle-free.', to: '/catalog/rent' },
    { img: B.invest, h: 'h-[300px] md:h-[340px]', title: ru ? 'Инвестиционная недвижимость' : 'Investment Property', text: ru ? 'Инвестиционные квартиры и отельные комплексы с гарантированным пассивным доходом.' : 'Investment apartments and hotel complexes with guaranteed passive income.', to: '/catalog/new' },
  ]

  const why = [
    { title: ru ? 'Опытное агентство недвижимости' : 'Experienced Real Estate Agency', text: ru ? 'Многолетняя экспертиза рынка недвижимости Батуми.' : 'Years of expertise in the Batumi property market.' },
    { title: ru ? 'Прямые партнёрства с проверенными застройщиками' : 'Direct Partnerships with Trusted Developers', text: ru ? 'Без посредников — только проверенные объекты и надёжные условия.' : 'No intermediaries — only verified properties and reliable terms.' },
    { title: ru ? 'Доступ к эксклюзивным и ранним предложениям' : 'Access to Exclusive and Early-Stage Offers', text: ru ? 'Лучшие варианты до выхода на открытый рынок.' : 'Get the best deals before they hit the market.' },
    { title: ru ? 'Репутация, подтверждённая реальными отзывами' : 'Reputation Backed by Real Client Reviews', text: ru ? 'Наши клиенты доверяют нам — и их отзывы говорят сами за себя.' : 'Our clients trust us — and their feedback speaks for itself.' },
  ]

  const articles = [
    { img: B.art1, title: ru ? 'Инвестиционный потенциал Грузии: растущий рынок' : 'Investment Potential of Georgia: A Growing Market', text: t('art1') },
    { img: B.art2, title: ru ? 'Туризм, природа и культура Грузии как драйверы цен на недвижимость' : 'Tourism, Nature, and Culture of Georgia as Drivers of Property Prices', text: t('art2') },
    { img: B.art3, title: ru ? 'Правовой статус и налогообложение при покупке недвижимости в Грузии' : 'Legal Status and Taxation When Buying Property in Georgia', text: t('art3') },
    { img: B.art4, title: ru ? 'Другие полезные статьи на нашем сайте' : 'Other Useful Articles on Our Website', text: t('art_all') },
  ]

  const projects = [
    { img: B.cta1, title: ru ? 'Квартиры у моря в зелёных районах' : 'Seaside Apartments in Green Areas', text: t('cta1') },
    { img: B.cta2, title: ru ? 'Премиальные комплексы с доходностью от 10%' : 'Premium Complexes with Returns from 10%', text: t('cta2') },
    { img: B.cta3, title: ru ? 'Квартиры с прямым видом на море' : 'Apartments with Direct Sea Views', text: t('cta3') },
  ]

  return (
    <div className="min-h-dvh bg-white text-[#222]">
      <Header />

      {/* ===== HERO ===== */}
      <section className="relative h-[82dvh] min-h-[600px] overflow-hidden" aria-label="Hero">
        {HERO_IMAGES.map((src, i) => (
          <div key={src} className="kb-slide" style={{ animationDelay: `${i * 6}s` }}>
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative h-full flex flex-col items-center justify-start pt-14 md:pt-20 px-4 text-center">
          <h1 className="text-white text-[30px] md:text-[42px] font-bold leading-tight max-w-[22ch]">
            {ru ? 'Квартиры у моря в Батуми' : 'Apartments by the Sea in Batumi'}
          </h1>
          <p className="mt-6 text-white/90 text-[16px] md:text-[19px] font-light max-w-[46ch]">
            {ru ? 'Мы — профессиональное агентство недвижимости в Батуми' : 'We are a professional real estate agency based in Batumi'}
          </p>
          <p className="mt-2 text-white/90 text-[16px] md:text-[19px] font-light max-w-[46ch]">
            {ru ? 'Полное сопровождение на каждом этапе сделки — быстро, безопасно и комфортно' : 'Full support at every stage of the transaction — fast, secure, and comfortable'}
          </p>
        </div>
        <div className="absolute left-0 right-0 bottom-32 md:bottom-24 px-6">
          <div className="mx-auto max-w-[1160px] grid grid-cols-3 gap-5 md:gap-10">
            {stats.map((s) => (
              <div key={s.v} className="text-white">
                <div className="text-[26px] sm:text-[32px] md:text-[68px] font-bold leading-none">{s.v}</div>
                <div className="border-t border-white/50 mt-4 md:mt-6 pt-3 text-[11px] md:text-[15px] font-light text-white/90 max-w-[30ch]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <Link to="/catalog/sale" className="btn-gold !px-10 !py-3.5 uppercase !text-[13px] tracking-wide"
            onClick={() => trackEvent('cta_catalog', { source: 'hero' })}>
            {ru ? 'Подобрать квартиру' : 'Find an apartment'}
          </Link>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="bg-[#7EAFF6] py-16 md:py-24">
        <div className="mx-auto max-w-[1160px] px-4 md:px-8 grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-2xl p-8 md:p-12 md:-mr-16 relative z-10 shadow-sm">
            <h2 className="text-[26px] md:text-[34px] font-bold leading-tight">
              {ru ? 'Ваш надёжный гид по недвижимости' : 'Your Trusted Real Estate Guide'}
            </h2>
            <div className="w-14 h-[3px] bg-[#7CA8EE] mt-5" />
            <p className="mt-6 text-[16px] leading-[1.7] text-[#333]">{t('about_text')}</p>
            <p className="mt-4 text-[16px] leading-[1.7] text-[#333]">{t('about_text2')}</p>
          </div>
          <div className="rounded-2xl overflow-hidden h-[300px] md:h-[500px]">
            <img src={B.about} alt={ru ? 'Интерьер квартиры в Батуми' : 'Apartment interior in Batumi'} loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="bg-[#7EAFF6] pb-16 md:pb-24">
        <div className="mx-auto max-w-[960px] px-4 flex items-center gap-5">
          <div className="flex-1 h-[3px] bg-[#1a1a1a]" />
          <Star size={18} className="text-[#1a1a1a]" fill="#1a1a1a" />
          <div className="flex-1 h-[3px] bg-[#1a1a1a]" />
        </div>
        <h2 className="text-center text-[22px] md:text-[28px] font-medium leading-snug mt-6 px-4 text-[#1a1a1a]">
          {ru ? 'Решим ваши вопросы с недвижимостью' : 'We’ll Help You Solve Your Real Estate Needs'}<br />
          {ru ? 'быстро и без комиссии' : 'Quickly and Commission-Free'}
        </h2>

        <div className="mx-auto max-w-[1400px] px-4 md:px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* left column */}
          <div className="flex flex-col gap-4 md:gap-5">
            {[services[0], services[3]].map((s) => <ServiceCard key={s.title} s={s} />)}
          </div>
          {/* middle tall */}
          <div className="flex flex-col gap-4 md:gap-5">
            <ServiceCard s={services[1]} />
            <ServiceCard s={services[4]} />
          </div>
          <div className="flex flex-col gap-4 md:gap-5">
            {[services[2], services[5]].map((s) => <ServiceCard key={s.title} s={s} />)}
          </div>
        </div>
      </section>

      {/* ===== ALL APARTMENTS / TELEGRAM ===== */}
      <section className="bg-[#F5F5F5] py-16 md:py-24 overflow-hidden">
        <div className="mx-auto max-w-[1160px] px-4 md:px-8">
          <h2 className="text-center text-[28px] md:text-[38px] font-bold">
            {ru ? 'Все квартиры в одном месте' : 'All apartments in one place'}
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-[46ch]">
              <p className="text-[17px] md:text-[19px] leading-[1.65] text-[#333]">
                {ru
                  ? 'Мы регулярно обновляем базу, чтобы каждая квартира в каталоге действительно была доступна'
                  : 'We regularly update our listings to make sure every apartment you see in our catalog is truly available'}
              </p>
              <Link to="/catalog/sale" className="btn-gold mt-7 !px-8">{ru ? 'Открыть каталог' : 'Open catalog'}</Link>
              <p className="mt-6 text-[14px] text-[#777] max-w-[42ch]">
                {ru
                  ? 'Напишите нам, и мы бесплатно поможем найти вашу идеальную квартиру.'
                  : 'Message us, and we’ll help you find your perfect apartment — free of charge.'}
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <a href="https://t.me/seanest_batumi" target="_blank" rel="noreferrer" aria-label="Telegram Seanest"
                onClick={() => trackEvent('contact_click', { via: 'telegram', source: 'home_circle' })}
                className="w-[220px] h-[220px] md:w-[400px] md:h-[400px] rounded-full bg-[#29A9DB] flex items-center justify-center hover:bg-[#1f96c5] transition-colors">
                <Send className="text-white w-[90px] h-[90px] md:w-[170px] md:h-[170px] -ml-3" strokeWidth={1.2} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY ===== */}
      <section id="why" className="bg-[#7EAFF6] py-16 md:py-24">
        <div className="mx-auto max-w-[1160px] px-4 md:px-8">
          <h2 className="text-center text-[28px] md:text-[38px] font-bold text-[#1a1a1a]">
            {ru ? 'Почему выбирают нас?' : 'Why Choose Us?'}
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {why.map((w) => (
              <div key={w.title} className="text-[#1a1a1a]">
                <h3 className="text-[20px] md:text-[22px] font-bold leading-snug min-h-[3.2em]">{w.title}</h3>
                <div className="h-[3px] bg-[#1a1a1a] mt-4" />
                <p className="mt-4 text-[15px] leading-[1.65] text-[#1a1a1a]/85">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ARTICLES ===== */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-[1160px] px-4 md:px-8">
          <h2 className="text-center text-[26px] md:text-[36px] font-bold leading-tight">
            {ru ? 'Рынок недвижимости Батуми — аналитика и рекомендации' : 'Batumi Real Estate Market — Analysis and Recommendations'}
          </h2>
          <p className="mt-6 text-center text-[16px] md:text-[18px] text-[#333] max-w-[62ch] mx-auto leading-[1.7]">
            {ru
              ? 'Мы внимательно следим за изменениями рынка и делимся актуальными данными. Цены, тренды и районы с растущей доходностью — всё, что нужно для правильного решения.'
              : 'We closely monitor all market changes and share up-to-date data with you. Prices, trends, and neighborhoods with growing profitability — everything you need to make the right decision.'}
          </p>
          <p className="mt-4 text-center text-[16px] md:text-[18px] text-[#333] max-w-[62ch] mx-auto leading-[1.7]">
            {ru
              ? 'С нами покупка квартиры в Батуми становится стратегически выгодной инвестицией.'
              : 'With us, buying an apartment in Batumi becomes a strategically sound investment.'}
          </p>

          <div className="mt-12 grid md:grid-cols-2 gap-x-10 gap-y-12">
            {articles.map((a, i) => (
              <article key={a.title}>
                <div className="rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[1/1] max-h-[480px]">
                  <img src={a.img} alt={a.title} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <h3 className="mt-5 text-[21px] md:text-[24px] font-bold leading-snug">{a.title}</h3>
                <p className="mt-3 text-[15px] md:text-[16px] text-[#555] leading-[1.65]">{a.text}</p>
                <button onClick={() => { setLead('free'); trackEvent('article_cta', { i }) }}
                  className="btn-gold mt-4 !py-2 !px-5 !text-[11px] uppercase tracking-wider">
                  {i === 3 ? t('art_all') : t('art_read')}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROJECTS / CTA CARDS ===== */}
      <section className="bg-[#EAF1FA] py-16 md:py-24">
        <div className="mx-auto max-w-[1160px] px-4 md:px-8">
          <h2 className="text-center text-[26px] md:text-[36px] font-bold leading-tight">
            {ru ? 'Более 50 текущих проектов от проверенных застройщиков' : 'Over 50 Ongoing Projects from Trusted Developers'}
          </h2>
          <p className="mt-6 text-center text-[16px] md:text-[18px] text-[#333] max-w-[58ch] mx-auto leading-[1.7]">
            {ru
              ? 'Покупаете для себя или инвестируете — подберём подходящий объект. В нашей базе новостройки Батуми, вторичная недвижимость, инвестиционные квартиры и апартаменты с видом на море.'
              : 'Whether you’re buying for yourself or investing — we’ll find the right property for you. Our database includes new developments in Batumi, resale properties, investment apartments, and sea-view flats.'}
          </p>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {projects.map((c) => (
              <div key={c.title} className="rounded-2xl overflow-hidden bg-[#FFA384] flex flex-col">
                <div className="h-[200px] md:h-[230px]">
                  <img src={c.img} alt={c.title} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 md:p-7 flex flex-col flex-1 text-[#1a1a1a]">
                  <h3 className="text-[19px] md:text-[20px] font-bold leading-snug">{c.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-[1.6] text-[#1a1a1a]/85 flex-1">{c.text}</p>
                  <button onClick={() => setLead('free')} className="btn-outline mt-6 self-start">
                    {ru ? 'Связаться' : 'Contact us'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      {lead && <LeadModal kind={lead} onClose={() => setLead(null)} />}
    </div>
  )
}

function ServiceCard({ s }: { s: { img: string; h: string; title: string; text: string; to: string } }) {
  return (
    <Link to={s.to} className={`relative block overflow-hidden rounded-xl group ${s.h}`}>
      <img src={s.img} alt={s.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-white text-[21px] md:text-[23px] font-bold leading-snug">{s.title}</h3>
        <p className="mt-2 text-white/85 text-[14px] leading-[1.55] max-w-[36ch]">{s.text}</p>
      </div>
    </Link>
  )
}
