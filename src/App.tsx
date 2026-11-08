import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import AppShell from '@/components/AppShell';
import HomePage from '@/pages/HomePage';
import MapPage from '@/pages/MapPage';
import BazarPage from '@/pages/BazarPage';
import FirmePage from '@/pages/FirmePage';
import FirmaPage from '@/pages/FirmaPage';
import AjutorPage from '@/pages/AjutorPage';
import SesizariPage from '@/pages/SesizariPage';
import ArhivaPage from '@/pages/ArhivaPage';
import PremiiPage from '@/pages/PremiiPage';
import ContPage from '@/pages/ContPage';
import AdminPage from '@/pages/AdminPage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/harta" element={<MapPage />} />
            <Route path="/bazar" element={<BazarPage />} />
            <Route path="/firme" element={<FirmePage />} />
            <Route path="/firme/:id" element={<FirmaPage />} />
            <Route path="/ajutor" element={<AjutorPage />} />
            <Route path="/sesizari" element={<SesizariPage />} />
            <Route path="/arhiva" element={<ArhivaPage />} />
            <Route path="/premii" element={<PremiiPage />} />
            <Route path="/cont" element={<ContPage />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
