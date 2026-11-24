export type DealType = 'rent' | 'sale' | 'new'
export type Layout = 'studio' | '1' | '2' | '3' | '4+'
export type Lang = 'ru' | 'en' | 'ka'
export type Currency = 'USD' | 'GEL'

export interface Agent {
  id: string
  name: string
  role: string
  phone: string
  whatsapp: string
  telegram: string
  photo: string
}

export interface Property {
  id: string
  slug: string
  deal: DealType
  title: Record<Lang, string>
  description: Record<Lang, string>
  priceUSD: number // base price, no rounding accumulation
  area: number // m²
  floor: number
  floorsTotal: number
  layout: Layout
  rooms: number
  district: string
  complex: string // ЖК
  address: Record<Lang, string>
  lat: number
  lng: number
  photos: string[]
  videoUrl?: string
  condition: 'renovated' | 'white' | 'black' | 'good'
  seaView: boolean
  mountainView: boolean
  petsAllowed: boolean
  hasManagement: boolean // есть УК
  remoteDeal: boolean
  gasified: boolean
  installment: boolean
  exclusive: boolean
  urgent: boolean
  docsChecked: boolean
  // rent-only
  depositUSD?: number
  rentTerm?: 'daily' | 'monthly' | 'yearly'
  utilitiesIncluded?: boolean
  // new-only
  developer?: string
  completionDate?: string
  agentId: string
  createdAt: string
  views: number
}
