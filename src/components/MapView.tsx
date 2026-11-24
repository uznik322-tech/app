import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Property } from '@/types'

const STYLE: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    carto: {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: '© Esri © OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'carto', type: 'raster', source: 'carto' }],
}

function priceShort(usd: number, currency: 'USD' | 'GEL', rate: number) {
  const v = currency === 'USD' ? usd : usd * rate
  const sym = currency === 'USD' ? '$' : '₾'
  if (v >= 1000) {
    const k = v / 1000
    return `${sym}${k % 1 === 0 ? k : k.toFixed(1)}K`
  }
  return `${sym}${Math.round(v)}`
}

export default function MapView({
  properties,
  currency,
  rate,
  onOpen,
  flyTo,
  single,
}: {
  properties: Property[]
  currency: 'USD' | 'GEL'
  rate: number
  onOpen: (p: Property) => void
  flyTo?: { lat: number; lng: number } | null
  single?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return
    const map = new maplibregl.Map({
      container: ref.current,
      style: STYLE,
      center: [41.63, 41.64],
      zoom: single ? 14 : 12,
      attributionControl: { compact: true },
      canvasContextAttributes: { preserveDrawingBuffer: true },
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const buildData = () => {
      map.addSource('props', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: properties.map((p) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
            properties: {
              id: p.id,
              deal: p.deal,
              price: priceShort(p.priceUSD, currency, rate),
            },
          })),
        },
        cluster: true,
        clusterRadius: 60,
        clusterMaxZoom: 15,
      })

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'props',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#0e2b46',
          'circle-radius': ['step', ['get', 'point_count'], 18, 5, 22, 15, 27],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      })
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'props',
        filter: ['has', 'point_count'],
        layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 13 },
        paint: { 'text-color': '#ffffff' },
      })
      map.addLayer({
        id: 'point-dot',
        type: 'circle',
        source: 'props',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-radius': 7,
          'circle-color': [
            'match', ['get', 'deal'],
            'rent', '#2e7d5b',
            'new', '#b08d3e',
            '#0e2b46',
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        },
      })
      map.addLayer({
        id: 'point-price',
        type: 'symbol',
        source: 'props',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'text-field': ['get', 'price'],
          'text-size': 12,
          'text-offset': [0, 1.3],
          'text-font': ['Open Sans Semibold'],
          'text-optional': true,
        },
        paint: {
          'text-color': [
            'match', ['get', 'deal'],
            'rent', '#2e7d5b',
            'new', '#b08d3e',
            '#0e2b46',
          ],
          'text-halo-color': '#ffffff',
          'text-halo-width': 2,
        },
      })

      map.on('click', 'clusters', async (e: maplibregl.MapLayerMouseEvent) => {
        const feats = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
        const clusterId = feats[0]?.properties?.cluster_id
        if (clusterId == null) return
        const src = map.getSource('props') as maplibregl.GeoJSONSource
        const zoom = await src.getClusterExpansionZoom(clusterId)
        map.easeTo({ center: (feats[0].geometry as import('geojson').Point).coordinates as [number, number], zoom })
      })
      map.on('click', 'point-dot', (e: maplibregl.MapLayerMouseEvent) => {
        const f = e.features?.[0]
        if (!f) return
        const id = f.properties?.id
        const p = properties.find((x) => x.id === id)
        if (!p) return
        const coords = (f.geometry as import('geojson').Point).coordinates.slice() as [number, number]
        while (Math.abs(e.lngLat.lng - coords[0]) > 180) coords[0] += e.lngLat.lng > coords[0] ? 360 : -360
        popupRef.current?.remove()
        const node = document.createElement('div')
        node.style.cssText = 'width:230px;font-family:Jost,sans-serif'
        const img = document.createElement('img')
        img.src = p.photos[0]; img.alt = ''
        img.style.cssText = 'width:100%;height:120px;object-fit:cover;display:block'
        const body = document.createElement('div')
        body.style.cssText = 'padding:12px 14px'
        body.innerHTML = `<div style="font-family:'EB Garamond',serif;font-size:19px;color:#0e2b46">${priceShort(p.priceUSD, currency, rate)}</div>
          <div style="font-size:12px;color:#3A4A57;margin-top:2px">${p.area} m² · ${p.floor}/${p.floorsTotal} fl · ${p.district}</div>`
        const btn = document.createElement('button')
        btn.textContent = 'Подробнее →'
        btn.style.cssText =
          'margin-top:10px;background:#cea84e;color:#fff;border:none;padding:8px 14px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;width:100%'
        btn.onclick = () => onOpen(p)
        body.appendChild(btn)
        node.appendChild(img)
        node.appendChild(body)
        popupRef.current = new maplibregl.Popup({ closeButton: true, maxWidth: '250px' })
          .setLngLat(coords)
          .setDOMContent(node)
          .addTo(map)
      })
      const cursor = (v: string) => () => { map.getCanvas().style.cursor = v }
      map.on('mouseenter', 'clusters', cursor('pointer'))
      map.on('mouseleave', 'clusters', cursor(''))
      map.on('mouseenter', 'point-dot', cursor('pointer'))
      map.on('mouseleave', 'point-dot', cursor(''))
    }

    if (map.isStyleLoaded()) {
      if (map.getSource('props')) {
        ;(map.getSource('props') as maplibregl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: properties.map((p) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
            properties: { id: p.id, deal: p.deal, price: priceShort(p.priceUSD, currency, rate) },
          })),
        })
      } else buildData()
    } else {
      map.once('load', buildData)
    }

    if (single && properties[0]) {
      map.once('load', () => map.jumpTo({ center: [properties[0].lng, properties[0].lat], zoom: 14 }))
    }
  }, [properties, currency, rate, onOpen, single])

  useEffect(() => {
    if (flyTo && mapRef.current) {
      mapRef.current.flyTo({ center: [flyTo.lng, flyTo.lat], zoom: 14, duration: 900 })
    }
  }, [flyTo])

  return <div ref={ref} className="w-full h-full" role="application" aria-label="Property map" />
}
