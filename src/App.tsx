import { Routes, Route, Navigate } from 'react-router'
import { AppProvider } from '@/lib/i18n'
import Home from '@/pages/Home'
import Catalog from '@/pages/Catalog'
import PropertyPage from '@/pages/PropertyPage'
import FavoritesPage from '@/pages/FavoritesPage'
import InstPage from '@/pages/InstPage'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Navigate to="/catalog/sale" replace />} />
        <Route path="/catalog/:tab" element={<Catalog />} />
        <Route path="/property/:slug" element={<PropertyPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/inst" element={<InstPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}
