import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFincas } from '../hooks/useFincas';
import { useClientes } from '../hooks/useClientes';
import { useActividades } from '../hooks/useActividades';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ActividadCard } from '../components/actividades/ActividadCard';
import { Modal } from '../components/common/Modal';
import { ActividadForm } from '../components/actividades/ActividadForm';
import type { Actividad } from '../types';
import './FincaDetailPage.css';

export const FincaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { obtenerFinca } = useFincas();
  const { obtenerCliente } = useClientes();
  const { obtenerActividadesPorFinca, eliminarActividad, calcularCostosTotales } = useActividades();
  
  const [modalActividadAbierto, setModalActividadAbierto] = useState(false);
  const [actividadEditando, setActividadEditando] = useState<Actividad | undefined>();

  const finca = id ? obtenerFinca(id) : undefined;
  const cliente = finca ? obtenerCliente(finca.clienteId) : undefined;
  const actividades = id ? obtenerActividadesPorFinca(id) : [];
  const costos = id ? calcularCostosTotales(id) : { total: 0, porTipo: {} };

  const actividadesPorMes = useMemo(() => {
    const meses: Record<string, Actividad[]> = {};
    actividades.forEach(act => {
      const fecha = new Date(act.fecha);
      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      if (!meses[key]) meses[key] = [];
      meses[key].push(act);
    });
    return meses;
  }, [actividades]);

  if (!finca) {
    return (
      <div className="finca-detail-page">
        <div className="finca-detail-page__not-found">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2>Finca no encontrada</h2>
          <p>La finca que buscas no existe o ha sido eliminada</p>
          <Button variant="primary" onClick={() => navigate('/fincas')}>
            Volver a Fincas
          </Button>
        </div>
      </div>
    );
  }

  const handleNuevaActividad = () => {
    setActividadEditando(undefined);
    setModalActividadAbierto(true);
  };

  const handleEditarActividad = (actividad: Actividad) => {
    setActividadEditando(actividad);
    setModalActividadAbierto(true);
  };

  const handleEliminarActividad = (actividadId: string) => {
    eliminarActividad(actividadId);
  };

  const handleSubmitActividad = () => {
    setModalActividadAbierto(false);
    setActividadEditando(undefined);
  };

  return (
    <div className="finca-detail-page">
      {/* Breadcrumb */}
      <div className="finca-detail-page__breadcrumb">
        <button onClick={() => navigate('/fincas')}>Fincas</button>
        <span>/</span>
        {cliente && (
          <>
            <button onClick={() => navigate(`/clientes/${cliente.id}`)}>
              {cliente.nombre} {cliente.apellidos}
            </button>
            <span>/</span>
          </>
        )}
        <span>{finca.nombre}</span>
      </div>

      {/* Header de la finca */}
      <Card className="finca-detail-page__header">
        <div className="finca-header">
          <div className="finca-header__icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>

          <div className="finca-header__info">
            <div className="finca-header__title">
              <h1>{finca.nombre}</h1>
              <Badge variant={finca.activa ? 'success' : 'neutral'}>
                {finca.activa ? 'Activa' : 'Inactiva'}
              </Badge>
            </div>
            
            <div className="finca-header__details">
              <div className="finca-header__detail">
                <span className="finca-header__detail-label">Cultivo:</span>
                <span className="finca-header__detail-value">{finca.cultivo} - {finca.variedad}</span>
              </div>
              
              {finca.portainjerto && (
                <div className="finca-header__detail">
                  <span className="finca-header__detail-label">Portainjerto:</span>
                  <span className="finca-header__detail-value">{finca.portainjerto}</span>
                </div>
              )}
              
              <div className="finca-header__detail">
                <span className="finca-header__detail-label">Cliente:</span>
                <span className="finca-header__detail-value">
                  {cliente ? `${cliente.nombre} ${cliente.apellidos}` : 'Desconocido'}
                </span>
              </div>
            </div>
          </div>

          <div className="finca-header__actions">
            <Button variant="outline" onClick={() => navigate(`/clientes/${finca.clienteId}`)}>
              Editar Finca
            </Button>
          </div>
        </div>
      </Card>

      {/* Estadísticas */}
      <div className="finca-detail-page__stats">
        <Card padding="md">
          <div className="finca-stat">
            <div className="finca-stat__icon finca-stat__icon--primary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <div className="finca-stat__info">
              <div className="finca-stat__value">{finca.superficie} ha</div>
              <div className="finca-stat__label">Superficie</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="finca-stat">
            <div className="finca-stat__icon finca-stat__icon--success">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="finca-stat__info">
              <div className="finca-stat__value">{actividades.length}</div>
              <div className="finca-stat__label">Actividades</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="finca-stat">
            <div className="finca-stat__icon finca-stat__icon--warning">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="finca-stat__info">
              <div className="finca-stat__value">{costos.total.toFixed(0)} €</div>
              <div className="finca-stat__label">Costos Totales</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="finca-stat">
            <div className="finca-stat__icon finca-stat__icon--info">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="finca-stat__info">
              <div className="finca-stat__value">
                {finca.añoPlantacion || 'N/A'}
              </div>
              <div className="finca-stat__label">Año Plantación</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Información adicional */}
      <div className="finca-detail-page__grid">
        <Card title="Características">
          <div className="finca-info">
            <div className="finca-info__item">
              <span className="finca-info__label">Tipo de riego:</span>
              <span className="finca-info__value">{finca.tipoRiego}</span>
            </div>
            
            {finca.volumenCaldoPorHa && (
              <div className="finca-info__item">
                <span className="finca-info__label">Volumen de caldo:</span>
                <span className="finca-info__value">{finca.volumenCaldoPorHa} L/ha</span>
              </div>
            )}
            
            {finca.ubicacion.direccion && (
              <div className="finca-info__item">
                <span className="finca-info__label">Ubicación:</span>
                <span className="finca-info__value">{finca.ubicacion.direccion}</span>
              </div>
            )}
            
            {finca.ubicacion.latitud && finca.ubicacion.longitud && (
              <div className="finca-info__item">
                <span className="finca-info__label">GPS:</span>
                <span className="finca-info__value">
                  {finca.ubicacion.latitud.toFixed(4)}, {finca.ubicacion.longitud.toFixed(4)}
                </span>
              </div>
            )}
            
            {finca.notas && (
              <div className="finca-info__item">
                <span className="finca-info__label">Notas:</span>
                <span className="finca-info__value">{finca.notas}</span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Resumen de Costos">
          <div className="finca-costos">
            {Object.entries(costos.porTipo).length > 0 ? (
              <>
                {Object.entries(costos.porTipo).map(([tipo, costo]) => (
                  <div key={tipo} className="finca-costos__item">
                    <span className="finca-costos__tipo">{tipo}</span>
                    <span className="finca-costos__valor">{costo.toFixed(2)} €</span>
                  </div>
                ))}
                <div className="finca-costos__total">
                  <span>Total</span>
                  <span>{costos.total.toFixed(2)} €</span>
                </div>
              </>
            ) : (
              <p className="finca-costos__empty">No hay actividades registradas</p>
            )}
          </div>
        </Card>
      </div>

      {/* Actividades */}
      <div className="finca-detail-page__section">
        <div className="finca-detail-page__section-header">
          <div>
            <h2>Actividades</h2>
            <p>Historial de actividades realizadas en la finca</p>
          </div>
          <Button
            variant="primary"
            onClick={handleNuevaActividad}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Nueva Actividad
          </Button>
        </div>

        {actividades.length === 0 ? (
          <Card>
            <div className="finca-detail-page__empty">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h3>No hay actividades registradas</h3>
              <p>Comienza registrando la primera actividad de esta finca</p>
              <Button variant="primary" onClick={handleNuevaActividad}>
                Añadir primera actividad
              </Button>
            </div>
          </Card>
        ) : (
          <div className="finca-detail-page__actividades">
            {actividades.map((actividad) => (
              <ActividadCard
                key={actividad.id}
                actividad={actividad}
                onEdit={handleEditarActividad}
                onDelete={handleEliminarActividad}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de actividad */}
      <Modal
        isOpen={modalActividadAbierto}
        onClose={() => {
          setModalActividadAbierto(false);
          setActividadEditando(undefined);
        }}
        title={actividadEditando ? 'Editar Actividad' : 'Nueva Actividad'}
        size="lg"
      >
        <ActividadForm
          actividad={actividadEditando}
          fincaId={finca.id}
          superficieFinca={finca.superficie}
          onSubmit={handleSubmitActividad}
          onCancel={() => {
            setModalActividadAbierto(false);
            setActividadEditando(undefined);
          }}
        />
      </Modal>
    </div>
  );
};