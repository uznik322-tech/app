import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Lang, Currency } from '@/types'

export const GEL_RATE = 2.71 // last saved NBG rate fallback (updated daily on backend)

const dict = {
  // header
  nav_home: { ru: 'Главная', en: 'Home', ka: 'მთავარი' },
  nav_catalog: { ru: 'Каталог', en: 'Catalog', ka: 'კატალოგი' },
  nav_map: { ru: 'На карте', en: 'Map', ka: 'რუკა' },
  nav_rent: { ru: 'Аренда', en: 'Rent', ka: 'ქირა' },
  nav_sale: { ru: 'Продажа', en: 'Sale', ka: 'გაყიდვა' },
  nav_new: { ru: 'Новостройки', en: 'New builds', ka: 'ახალი კორპუსები' },
  favorites: { ru: 'Избранное', en: 'Favorites', ka: 'რჩეული' },
  // hero
  hero_kicker: { ru: 'Агентство недвижимости · Батуми', en: 'Real estate agency · Batumi', ka: 'უძრავი ქონების სააგენტო · ბათუმი' },
  hero_title: { ru: 'Квартиры у моря в Батуми', en: 'Apartments by the sea in Batumi', ka: 'ბინები ზღვასთან ბათუმში' },
  hero_sub: {
    ru: 'Полное сопровождение на каждом этапе сделки — быстро, безопасно и комфортно',
    en: 'Full support at every stage of the transaction — fast, secure, and comfortable',
    ka: 'სრული მხარდაჭერა გარიგების ყველა ეტაპზე',
  },
  hero_cta_catalog: { ru: 'Смотреть каталог', en: 'Browse catalog', ka: 'კატალოგის ნახვა' },
  hero_cta_map: { ru: 'Объекты на карте', en: 'View on map', ka: 'რუკაზე ნახვა' },
  // stats
  stat_1_v: { ru: '2000+', en: '2000+', ka: '2000+' },
  stat_1_l: { ru: 'активных объектов в базе', en: 'active listings in our database', ka: 'აქტიური განცხადება ბაზაში' },
  stat_2_v: { ru: '73%', en: '73%', ka: '73%' },
  stat_2_l: { ru: 'клиентов возвращаются после первой сделки', en: 'of clients return after their first deal', ka: 'კლიენტი ბრუნდება' },
  stat_3_v: { ru: '400+', en: '400+', ka: '400+' },
  stat_3_l: { ru: 'закрытых сделок за два года', en: 'closed transactions in two years', ka: 'დახურული გარიგება' },
  // about
  about_kicker: { ru: 'О нас', en: 'About us', ka: 'ჩვენს შესახებ' },
  about_title: { ru: 'Ваш надёжный гид по недвижимости', en: 'Your trusted real estate guide', ka: 'თქვენი სანდო გზამკვლევი' },
  about_text: {
    ru: 'Seanest — агентство недвижимости в Батуми, работающее с клиентами со всего мира. Мы говорим на русском, английском и грузинском. Помогаем найти недвижимость у моря в Грузии — для жизни, отдыха или пассивного дохода.',
    en: 'Seanest is a real estate agency in Batumi working with clients from all over the world. We speak Russian, English, and Georgian. We help you find seaside property in Georgia — for living, vacation, or passive income.',
    ka: 'Seanest — ბათუმის უძრავი ქონების სააგენტო.',
  },
  about_text2: {
    ru: 'Прозрачно, профессионально и с фокусом на клиента — мы делаем покупку недвижимости понятной и комфортной.',
    en: 'Transparent, professional, and client-focused — we make buying property a clear and comfortable experience.',
    ka: 'გამჭვირვალე და პროფესიონალური.',
  },
  // services
  services_kicker: { ru: 'Услуги', en: 'Services', ka: 'სერვისები' },
  services_title: { ru: 'Чем мы можем помочь', en: 'How we can help', ka: 'როგორ შეგვიძლია დაგეხმაროთ' },
  svc1_t: { ru: 'Коммерческая недвижимость', en: 'Commercial property', ka: 'კომერციული ფართი' },
  svc1_d: {
    ru: 'Ваш бизнес начинается с правильной локации — найдём идеальный офис, торговое помещение или склад.',
    en: 'Your business starts with the right location — we will find the perfect office, retail space, or warehouse.',
    ka: 'თქვენი ბიზნესი იწყება სწორი ლოკაციით.',
  },
  svc2_t: { ru: 'Аренда квартир', en: 'Apartment rentals', ka: 'ბინების ქირა' },
  svc2_d: {
    ru: 'Большая база актуальных объектов — быстро, безопасно и без лишних хлопот.',
    en: 'A large database of up-to-date listings — fast, safe, and hassle-free.',
    ka: 'აქტუალური განცხადებების დიდი ბაზა.',
  },
  svc3_t: { ru: 'Новостройки', en: 'New developments', ka: 'ახალი კორპუსები' },
  svc3_d: {
    ru: 'Ваш дом XXI века — продуманный дизайн, современный комфорт и функциональность.',
    en: 'Your 21st-century home — smart design, modern comfort, and functionality.',
    ka: 'თქვენი XXI საუკუნის სახლი.',
  },
  // featured
  feat_kicker: { ru: 'Каталог', en: 'Catalog', ka: 'კატალოგი' },
  feat_title: { ru: 'Свежие объекты', en: 'Latest listings', ka: 'ბოლო განცხადებები' },
  feat_text: {
    ru: 'Мы регулярно обновляем базу, чтобы каждая квартира в каталоге действительно была доступна.',
    en: 'We regularly update our listings to make sure every apartment you see is truly available.',
    ka: 'ჩვენ რეგულარულად ვაახლებთ განცხადებებს.',
  },
  feat_all: { ru: 'Весь каталог', en: 'Full catalog', ka: 'სრული კატალოგი' },
  // why
  why_kicker: { ru: 'Преимущества', en: 'Why us', ka: 'რატომ ჩვენ' },
  why_title: { ru: 'Почему выбирают Seanest', en: 'Why clients choose Seanest', ka: 'რატომ ირჩევენ Seanest-ს' },
  why1_t: { ru: 'Опытное агентство', en: 'Experienced agency', ka: 'გამოცდილი სააგენტო' },
  why1_d: { ru: 'Многолетняя экспертиза рынка недвижимости Батуми.', en: 'Years of expertise in the Batumi property market.', ka: 'მრავალწლიანი გამოცდილება.' },
  why2_t: { ru: 'Прямые партнёрства с застройщиками', en: 'Direct developer partnerships', ka: 'პირდაპირი პარტნიორობა' },
  why2_d: { ru: 'Без посредников — только проверенные объекты и надёжные условия.', en: 'No intermediaries — only verified properties and reliable terms.', ka: 'შუამავლების გარეშე.' },
  why3_t: { ru: 'Доступ к эксклюзивным предложениям', en: 'Exclusive early-stage offers', ka: 'ექსკლუზიური შეთავაზებები' },
  why3_d: { ru: 'Лучшие варианты до выхода на открытый рынок.', en: 'Get the best deals before they hit the market.', ka: 'საუკეთესო შეთავაზებები.' },
  why4_t: { ru: 'Репутация, подтверждённая отзывами', en: 'Reputation backed by reviews', ka: 'რეპუტაცია' },
  why4_d: { ru: 'Наши клиенты доверяют нам — и их отзывы говорят сами за себя.', en: 'Our clients trust us — and their feedback speaks for itself.', ka: 'კლიენტები ენდობიან.' },
  // articles
  art_kicker: { ru: 'Журнал', en: 'Journal', ka: 'ჟურნალი' },
  art_title: { ru: 'Статьи о недвижимости в Грузии', en: 'Articles about property in Georgia', ka: 'სტატიები' },
  art1: {
    ru: 'Почему Грузия становится всё привлекательнее для инвесторов — цифры, факты и реальные примеры роста цен.',
    en: 'Why Georgia is becoming increasingly attractive to investors — numbers, facts, and real examples of price growth.',
    ka: 'რატომ ხდება საქართველო მიმზიდველი ინვესტორებისთვის.',
  },
  art2: {
    ru: 'Как образ жизни и туристический поток влияют на доходность и спрос на недвижимость.',
    en: 'How Georgia’s lifestyle and tourist flow impact profitability and demand for real estate.',
    ka: 'ტურისტული ნაკადის გავლენა მომგებიანობაზე.',
  },
  art3: {
    ru: 'Гражданство не требуется, низкие налоги и простые процедуры — как законодательство Грузии делает покупку безопасной.',
    en: 'No citizenship required, low taxes, simple procedures — how Georgian law makes buying secure.',
    ka: 'დაბალი გადასახადები და მარტივი პროცედურები.',
  },
  art_read: { ru: 'Читать', en: 'Read', ka: 'წაკითხვა' },
  art_all: { ru: 'Все статьи', en: 'All articles', ka: 'ყველა სტატია' },
  // cta cards
  cta1: { ru: 'Спокойная жизнь у моря — в окружении природы и тишины', en: 'A peaceful lifestyle by the sea — surrounded by nature and tranquility', ka: 'მშვიდი ცხოვრება ზღვასთან' },
  cta2: { ru: 'Для тех, кто ищет недвижимость в Батуми со стабильным доходом и ростом капитала', en: 'For those seeking Batumi real estate with stable income and capital growth', ka: 'სტაბილური შემოსავლისთვის' },
  cta3: { ru: 'Просыпайтесь под шум волн — квартира с панорамными окнами на побережье', en: 'Wake up to the sound of the waves — a flat with panoramic windows on the coast', ka: 'გაიღვიძეთ ტალღების ხმაურით' },
  cta_btn: { ru: 'Связаться', en: 'Contact us', ka: 'კონტაქტი' },
  // footer
  footer_tag: { ru: 'Недвижимость в Батуми: продажа и аренда', en: 'Real estate in Batumi: sale and rent', ka: 'უძრავი ქონება ბათუმში' },
  footer_contact: { ru: 'Контакты', en: 'Contacts', ka: 'კონტაქტი' },
  // catalog
  search_ph: { ru: 'Поиск по ЖК, улице или району…', en: 'Search by complex, street or district…', ka: 'ძებნა...' },
  tab_map: { ru: 'На карте', en: 'Map', ka: 'რუკა' },
  tab_rent: { ru: 'Аренда', en: 'Rent', ka: 'ქირა' },
  tab_sale: { ru: 'Продажа', en: 'Sale', ka: 'გაყიდვა' },
  tab_new: { ru: 'Новостройки', en: 'New builds', ka: 'ახალი' },
  filters: { ru: 'Фильтры', en: 'Filters', ka: 'ფილტრები' },
  reset: { ru: 'Сбросить', en: 'Reset', ka: 'გასუფთავება' },
  share: { ru: 'Поделиться подборкой', en: 'Share selection', ka: 'გაზიარება' },
  copied: { ru: 'Ссылка скопирована', en: 'Link copied', ka: 'ბმული დაკოპირდა' },
  sort_new: { ru: 'Сначала новые', en: 'Newest first', ka: 'ახალი' },
  sort_price_asc: { ru: 'Цена: по возрастанию', en: 'Price: low to high', ka: 'ფასი: ზრდა' },
  sort_price_desc: { ru: 'Цена: по убыванию', en: 'Price: high to low', ka: 'ფასი: კლება' },
  sort_area: { ru: 'Площадь', en: 'Area', ka: 'ფართი' },
  price: { ru: 'Цена', en: 'Price', ka: 'ფასი' },
  price_from: { ru: 'от', en: 'from', ka: '-დან' },
  price_to: { ru: 'до', en: 'to', ka: '-მდე' },
  price_m2: { ru: 'Цена за м²', en: 'Price per m²', ka: 'მ² ფასი' },
  price_month: { ru: 'Цена в месяц', en: 'Price per month', ka: 'თვიური ფასი' },
  district: { ru: 'Район', en: 'District', ka: 'უბანი' },
  complex: { ru: 'ЖК', en: 'Complex', ka: 'კომპლექსი' },
  layout: { ru: 'Планировка', en: 'Layout', ka: 'გეგმარება' },
  area: { ru: 'Площадь', en: 'Area', ka: 'ფართი' },
  floor: { ru: 'Этаж', en: 'Floor', ka: 'სართული' },
  rent_term: { ru: 'Срок аренды', en: 'Rent term', ka: 'ვადა' },
  pets: { ru: 'Можно с животными', en: 'Pets allowed', ka: 'ცხოველებით' },
  condition: { ru: 'Состояние', en: 'Condition', ka: 'მდგომარეობა' },
  sea_view: { ru: 'Вид на море', en: 'Sea view', ka: 'ზღვის ხედი' },
  docs: { ru: 'Документы проверены', en: 'Docs verified', ka: 'დოკუმენტები' },
  developer: { ru: 'Застройщик', en: 'Developer', ka: 'დეველოპერი' },
  completion: { ru: 'Срок сдачи', en: 'Completion', ka: 'დასრულება' },
  installment: { ru: 'Рассрочка', en: 'Installment', ka: 'განვადება' },
  results: { ru: 'объектов найдено', en: 'properties found', ka: 'განცხადება' },
  empty: { ru: 'По вашему запросу ничего не найдено. Попробуйте изменить фильтры.', en: 'Nothing found. Try adjusting the filters.', ka: 'ვერაფერი მოიძებნა.' },
  load_more: { ru: 'Показать ещё', en: 'Load more', ka: 'მეტი' },
  // card
  m2: { ru: 'м²', en: 'm²', ka: 'მ²' },
  per_month: { ru: '/мес', en: '/mo', ka: '/თვე' },
  per_day: { ru: '/сутки', en: '/day', ka: '/დღე' },
  tag_exclusive: { ru: 'Эксклюзив', en: 'Exclusive', ka: 'ექსკლუზივი' },
  tag_urgent: { ru: 'Срочно', en: 'Urgent', ka: 'სასწრაფო' },
  tag_docs: { ru: 'Документы проверены', en: 'Docs verified', ka: 'დოკუმენტები' },
  tag_sea: { ru: 'Вид на море', en: 'Sea view', ka: 'ზღვა' },
  tag_mountains: { ru: 'Вид на горы', en: 'Mountain view', ka: 'მთები' },
  tag_pets: { ru: 'Можно с животными', en: 'Pets ok', ka: 'ცხოველი' },
  tag_mgmt: { ru: 'Есть УК', en: 'Management co.', ka: 'მმართველი' },
  tag_remote: { ru: 'Дистанционная сделка', en: 'Remote deal', ka: 'დისტანციური' },
  tag_gas: { ru: 'Газифицирован', en: 'Gasified', ka: 'გაზი' },
  tag_installment: { ru: 'Рассрочка', en: 'Installment', ka: 'განვადება' },
  cond_renovated: { ru: 'С ремонтом', en: 'Renovated', ka: 'რემონტით' },
  cond_white: { ru: 'Белый каркас', en: 'White frame', ka: 'თეთრი' },
  cond_black: { ru: 'Чёрный каркас', en: 'Black frame', ka: 'შავი' },
  cond_good: { ru: 'Хорошее', en: 'Good', ka: 'კარგი' },
  // property page
  details: { ru: 'Характеристики', en: 'Details', ka: 'დეტალები' },
  deposit: { ru: 'Депозит', en: 'Deposit', ka: 'დეპოზიტი' },
  utilities: { ru: 'Коммунальные включены', en: 'Utilities included', ka: 'კომუნალური' },
  support_title: { ru: 'Сопровождение сделки', en: 'Transaction support', ka: 'გარიგების მხარდაჭერა' },
  support_text: {
    ru: 'Проверка документов, юридическое сопровождение, переводчик на сделке и помощь с регистрацией права собственности — всё включено.',
    en: 'Document verification, legal support, a translator at the closing, and help with ownership registration — all included.',
    ka: 'დოკუმენტების შემოწმება და იურიდიული მხარდაჭერა.',
  },
  your_agent: { ru: 'Ваш агент', en: 'Your agent', ka: 'თქვენი აგენტი' },
  call: { ru: 'Позвонить', en: 'Call', ka: 'ზარი' },
  share_btn: { ru: 'Поделиться', en: 'Share', ka: 'გაზიარება' },
  similar: { ru: 'Похожие объекты', en: 'Similar properties', ka: 'მსგავსი' },
  pick_similar: { ru: 'Подобрать похожие', en: 'Find similar', ka: 'მსგავსის პოვნა' },
  location: { ru: 'Расположение', en: 'Location', ka: 'მდებარეობა' },
  back: { ru: 'Назад к каталогу', en: 'Back to catalog', ka: 'უკან' },
  // forms
  form_free: { ru: 'Бесплатная подборка', en: 'Free selection', ka: 'უფასო შერჩევა' },
  form_sell: { ru: 'Продать или сдать недвижимость', en: 'Sell or rent out your property', ka: 'გაყიდვა/გაქირავება' },
  form_coop: { ru: 'Сотрудничество', en: 'Partnership', ka: 'თანამშრომლობა' },
  form_name: { ru: 'Ваше имя', en: 'Your name', ka: 'სახელი' },
  form_contact: { ru: 'Телефон, WhatsApp или Telegram', en: 'Phone, WhatsApp or Telegram', ka: 'ტელეფონი' },
  form_msg: { ru: 'Комментарий (необязательно)', en: 'Message (optional)', ka: 'კომენტარი' },
  form_send: { ru: 'Отправить заявку', en: 'Send request', ka: 'გაგზავნა' },
  form_ok_t: { ru: 'Заявка отправлена!', en: 'Request sent!', ka: 'გაიგზავნა!' },
  form_ok_d: { ru: 'Мы свяжемся с вами в течение часа в рабочее время.', en: 'We will contact you within an hour during business hours.', ka: 'ჩვენ დაგიკავშირდებით.' },
  form_err: { ru: 'Заполните имя и контакт', en: 'Please fill in name and contact', ka: 'შეავსეთ ველები' },
  // favorites page
  fav_empty: { ru: 'Пока пусто. Нажимайте на сердечко на карточках, чтобы сохранить объекты.', en: 'Empty so far. Tap the heart on cards to save properties.', ka: 'ცარიელია.' },
  // inst page
  inst_catalog: { ru: 'Каталог объектов', en: 'Property catalog', ka: 'კატალოგი' },
  inst_map: { ru: 'Объекты на карте', en: 'Properties on the map', ka: 'რუკა' },
  inst_site: { ru: 'Сайт Seanest', en: 'Seanest website', ka: 'საიტი' },
  inst_coop: { ru: 'Сотрудничество для риелторов', en: 'Partnership for realtors', ka: 'თანამშრომლობა' },
} as const

export type DictKey = keyof typeof dict

interface I18nCtx {
  lang: Lang
  setLang: (l: Lang) => void
  currency: Currency
  setCurrency: (c: Currency) => void
  t: (k: DictKey) => string
  formatPrice: (usd: number, opts?: { suffix?: string }) => string
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFav: (id: string) => boolean
}

const Ctx = createContext<I18nCtx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('sn-lang') as Lang) || 'ru')
  const [currency, setCurrency] = useState<Currency>(() => (localStorage.getItem('sn-cur') as Currency) || 'USD')
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('sn-fav') || '[]') } catch { return [] }
  })

  useEffect(() => { localStorage.setItem('sn-lang', lang) }, [lang])
  useEffect(() => { localStorage.setItem('sn-cur', currency) }, [currency])
  useEffect(() => { localStorage.setItem('sn-fav', JSON.stringify(favorites)) }, [favorites])

  const t = (k: DictKey) => dict[k][lang] ?? dict[k].ru
  const formatPrice = (usd: number, opts?: { suffix?: string }) => {
    const v = currency === 'USD' ? usd : Math.round(usd * GEL_RATE)
    const s = v.toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US')
    return `${currency === 'USD' ? '$' : '₾'}${s}${opts?.suffix ?? ''}`
  }
  const toggleFavorite = (id: string) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  const isFav = (id: string) => favorites.includes(id)

  return (
    <Ctx.Provider value={{ lang, setLang, currency, setCurrency, t, formatPrice, favorites, toggleFavorite, isFav }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp outside provider')
  return ctx
}

export function trackEvent(name: string, payload?: Record<string, unknown>) {
  // analytics hook: GA4 / Meta Pixel / CRM events plug in here
  console.info('[analytics]', name, payload ?? {})
}
