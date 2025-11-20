import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError('');
    setLoading(true);

    try {
      const password = demoEmail.includes('admin') 
        ? 'admin123' 
        : demoEmail.includes('tecnico') 
        ? 'tecnico123' 
        : 'cliente123';

      await login(demoEmail, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="logo">🌾</div>
            <h1>Kropland</h1>
            <p className="subtitle">Plataforma de Gestión Agrícola</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <div className="error-message">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <div className="form-grupo">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="usuario@kropland.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="form-grupo">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn-login"
              disabled={loading || !email || !password}
            >
              {loading ? '⏳ Iniciando sesión...' : '🔓 Iniciar Sesión'}
            </button>
          </form>

          {/* Demos */}
          <div className="demo-section">
            <div className="divider">o usa una cuenta demo</div>

            <div className="demo-buttons">
              <button
                type="button"
                className="btn-demo btn-admin"
                onClick={() => handleDemoLogin('admin@kropland.com')}
                disabled={loading}
              >
                <span className="role-icon">👤</span>
                <span className="role-text">
                  <strong>Admin</strong>
                  <small>admin123</small>
                </span>
              </button>

              <button
                type="button"
                className="btn-demo btn-tecnico"
                onClick={() => handleDemoLogin('tecnico@kropland.com')}
                disabled={loading}
              >
                <span className="role-icon">🔧</span>
                <span className="role-text">
                  <strong>Técnico</strong>
                  <small>tecnico123</small>
                </span>
              </button>

              <button
                type="button"
                className="btn-demo btn-cliente"
                onClick={() => handleDemoLogin('cliente@kropland.com')}
                disabled={loading}
              >
                <span className="role-icon">👨‍🌾</span>
                <span className="role-text">
                  <strong>Cliente</strong>
                  <small>cliente123</small>
                </span>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="login-info">
            <p>💡 <strong>Modo Desarrollo:</strong> Usa cualquiera de las cuentas demo arriba</p>
            <p>🔒 En producción, conectaremos a un backend real con autenticación segura</p>
          </div>
        </div>

        {/* Side panel */}
        <div className="login-side">
          <div className="side-content">
            <h2>¿Qué es Kropland?</h2>
            <p>Una plataforma moderna de gestión agrícola para técnicos, productores y administradores.</p>

            <div className="features">
              <div className="feature">
                <span className="icon">📊</span>
                <h3>Gestión Completa</h3>
                <p>Clientes, fincas, visitas y actividades en un solo lugar</p>
              </div>

              <div className="feature">
                <span className="icon">🗺️</span>
                <h3>Visualización Espacial</h3>
                <p>Mapas interactivos con ubicación de tus fincas</p>
              </div>

              <div className="feature">
                <span className="icon">📅</span>
                <h3>Planificación Avanzada</h3>
                <p>Calendario interactivo para organizar tu trabajo</p>
              </div>

              <div className="feature">
                <span className="icon">📱</span>
                <h3>Acceso Multiplataforma</h3>
                <p>Funciona en web, tablet y mobile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};