import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEstadisticas } from '../hooks/useEstadisticas';
import { StatCard } from '../components/common/StatCard';
import { SimpleChart, SimplePieChart } from '../components/common/SimpleChart';
import { ActivityList } from '../components/common/ActivityList';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import './InicioPage.css';

export const InicioPage: React.FC = () => {
  const navigate = useNavigate();
  const { estadisticas, loading } = useEstadisticas();
  const [userName] = useState('Usuario Admin'); // Después lo obtienes del contexto de auth

  // Actividades recientes simuladas
  const actividadesRecientes = [
    {
      id: '1',
      type: 'visita' as const,
      title: 'Visita programada',
      description: 'Visita a la finca "El Olivar" de Juan García',
      time: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
      user: 'Técnico Agrónomo'
    },
    {
      id: '2',
      type: 'actividad' as const,
      title: 'Tratamiento aplicado',
      description: 'Pulverización fitosanitaria en finca "Los Almendros"',
      time: new Date(Date.now() - 7200000).toISOString(), // 2h ago
      user: 'María López'
    },
    {
      id: '3',
      type: 'cliente' as const,
      title: 'Nuevo cliente registrado',
      description: 'Pedro Fernández - Córdoba',
      time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      user: 'Sistema'
    },
    {
      id: '4',
      type: 'alerta' as const,
      title: 'Alerta meteorológica',
      description: 'Riesgo de heladas en zona de Ciudad Real',
      time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      user: 'KropSens'
    }
  ];

  // Datos de actividades por tipo
  const actividadesPorTipo = [
    { label: 'Poda', value: 12, color: '#193C1E' },
    { label: 'Riego', value: 25, color: '#3B82F6' },
    { label: 'Tratamiento', value: 18, color: '#00A859' },
    { label: 'Recolección', value: 8, color: '#F59E0B' },
    { label: 'Análisis', value: 5, color: '#8B5CF6' }
  ];

  // Datos de cultivos
  const cultivosDistribucion = [
    { label: 'Olivo', value: 45, color: '#193C1E' },
    { label: 'Almendro', value: 25, color: '#00A859' },
    { label: 'Viña', value: 20, color: '#8B5CF6' },
    { label: 'Pistacho', value: 10, color: '#F59E0B' }
  ];

  // Próximas visitas simuladas
  const [proximasVisitas] = useState([
    {
      id: '1',
      cliente: 'Juan García',
      finca: 'El Olivar',
      fecha: 'Hoy, 16:00',
      estado: 'Confirmada'
    },
    {
      id: '2',
      cliente: 'María López',
      finca: 'Los Almendros',
      fecha: 'Mañana, 10:00',
      estado: 'Pendiente'
    },
    {
      id: '3',
      cliente: 'Pedro Fernández',
      finca: 'La Viña Grande',
      fecha: '08 Nov, 11:30',
      estado: 'Confirmada'
    }
  ]);

  if (loading) {
    return (
      <div className="inicio-page">
        <div className="inicio-page__loading">
          <div className="spinner spin"></div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inicio-page">
      {/* Bienvenida */}
      <div className="inicio-page__welcome">
        <div>
          <h1 className="inicio-page__title">
            ¡Bienvenido, {userName}! 👋
          </h1>
          <p className="inicio-page__subtitle">
            Aquí tienes un resumen de tu actividad agrícola
          </p>
        </div>
        
        <div className="inicio-page__date">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="inicio-page__stats">
        <StatCard
          title="Total Clientes"
          value={estadisticas.totalClientes}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color="primary"
          onClick={() => navigate('/clientes')}
        />

        <StatCard
          title="Total Fincas"
          value={estadisticas.totalFincas}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          }
          color="secondary"
        />

        <StatCard
          title="Superficie Total"
          value={`${estadisticas.superficieTotal} ha`}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          }
          color="success"
          onClick={() => navigate('/mapa')}
        />

        <StatCard
          title="Visitas Pendientes"
          value={estadisticas.visitasPendientes}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
          color="warning"
          onClick={() => navigate('/visitas')}
          trend={estadisticas.visitasPendientes > 0 ? { value: 12, isPositive: false } : undefined}
        />
      </div>

      {/* Fila de gráficos y actividad */}
      <div className="inicio-page__content">
        {/* Columna izquierda */}
        <div className="inicio-page__main">
          {/* Actividades por tipo */}
          <SimpleChart
            title="Actividades Este Mes"
            data={actividadesPorTipo}
            height={280}
          />

          {/* Próximas visitas */}
          <Card title="Próximas Visitas" padding="none">
            <div className="inicio-page__visitas">
              {proximasVisitas.map((visita) => (
                <div key={visita.id} className="visita-item">
                  <div className="visita-item__info">
                    <div className="visita-item__header">
                      <h4>{visita.cliente}</h4>
                      <Badge 
                        variant={visita.estado === 'Confirmada' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {visita.estado}
                      </Badge>
                    </div>
                    <p className="visita-item__finca">{visita.finca}</p>
                    <span className="visita-item__fecha">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {visita.fecha}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate('/visitas')}
                  >
                    Ver
                  </Button>
                </div>
              ))}
              
              <div className="inicio-page__visitas-footer">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => navigate('/visitas')}
                >
                  Ver todas las visitas
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Columna derecha */}
        <div className="inicio-page__sidebar">
          {/* Resumen económico */}
          <Card title="Resumen Mensual" padding="md">
            <div className="resumen-economico">
              <div className="resumen-economico__item">
                <span className="resumen-economico__label">Actividades</span>
                <span className="resumen-economico__value resumen-economico__value--primary">
                  {estadisticas.actividadesEsteMes}
                </span>
              </div>
              
              <div className="resumen-economico__item">
                <span className="resumen-economico__label">Gastos</span>
                <span className="resumen-economico__value resumen-economico__value--error">
                  {estadisticas.gastosEsteMes.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </span>
              </div>
              
              <div className="resumen-economico__item">
                <span className="resumen-economico__label">Alertas activas</span>
                <span className="resumen-economico__value resumen-economico__value--warning">
                  {estadisticas.alertasActivas}
                </span>
              </div>
            </div>
            
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate('/informes')}
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              Ver Informes Completos
            </Button>
          </Card>

          {/* Distribución de cultivos */}
          <SimplePieChart
            title="Distribución de Cultivos"
            data={cultivosDistribucion}
          />

          {/* Actividad reciente */}
          <ActivityList activities={actividadesRecientes} />
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="inicio-page__quick-actions">
        <h3>Accesos Rápidos</h3>
        <div className="inicio-page__actions-grid">
          <button
            className="quick-action-card"
            onClick={() => navigate('/clientes')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Nuevo Cliente</span>
          </button>

          <button
            className="quick-action-card"
            onClick={() => navigate('/visitas')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nueva Visita</span>
          </button>

          <button
            className="quick-action-card"
            onClick={() => navigate('/calendario')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Ver Calendario</span>
          </button>

          <button
            className="quick-action-card"
            onClick={() => navigate('/mapa')}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>Ver Mapa</span>
          </button>
        </div>
      </div>
    </div>
  );
};