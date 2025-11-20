import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/authStore';
import { AppLayout } from './components/layout/AppLayout';
import { OfflineIndicator } from './components/OfflineIndicator'; // ✅ Ya importado
import { InicioPage } from './pages/InicioPage';
import { ClientesPage } from './pages/ClientesPage';
import { ClienteDetailPage } from './pages/ClienteDetailPage';
import { FincaDetailPage } from './pages/FincaDetailPage';
import { VisitasPage } from './pages/VisitasPage';
import { MapaPage } from './pages/MapaPage';
import { CalendarioPage } from './pages/CalendarioPage';
import { InformesPage } from './pages/InformesPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { FincasPage } from './pages/FincasPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <OfflineIndicator /> {/* ← AGREGAR AQUÍ (fuera del BrowserRouter) */}
      
      <BrowserRouter>
        <Routes>
          {/* Ruta pública de login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas protegidas con layout */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout>
                  <InicioPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <AppLayout>
                  <ClientesPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/clientes/:id"
            element={
              <PrivateRoute>
                <AppLayout>
                  <ClienteDetailPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/fincas"
            element={
              <PrivateRoute>
                <AppLayout>
                  <FincasPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/fincas/:id"
            element={
              <PrivateRoute>
                <AppLayout>
                  <FincaDetailPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/visitas"
            element={
              <PrivateRoute>
                <AppLayout>
                  <VisitasPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/mapa"
            element={
              <PrivateRoute>
                <AppLayout>
                  <MapaPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/calendario"
            element={
              <PrivateRoute>
                <AppLayout>
                  <CalendarioPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          <Route
            path="/informes"
            element={
              <PrivateRoute>
                <AppLayout>
                  <InformesPage />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* Ruta 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;