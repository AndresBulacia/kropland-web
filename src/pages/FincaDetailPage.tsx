import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFincas } from '../hooks/useFincas';
import { useClientes } from '../hooks/useClientes';
import { useVisitas } from '../hooks/useVisitas';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import './FincaDetailPage.css';

export const FincaDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fincas } = useFincas();
  const { clientes } = useClientes();
  const { visitas } = useVisitas();

  const finca = fincas.find(f => f.id === id);
  const cliente = finca ? clientes.find(c => c.id === finca.clienteId) : undefined;
  const visitasFinca = visitas.filter(v => v.fincaId === id);

  if (!finca) {
    return (
      <div className="finca-detail-page">
        <div className="finca-detail-page__not-found">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2>Finca no encontrada</h2>
          <p>La finca que buscas no existe o ha sido eliminada</p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="finca-detail-page">
      {/* Breadcrumb */}
      <div className="finca-detail-page__breadcrumb">
        <button onClick={() => navigate('/clientes')}>Clientes</button>
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
              <Badge variant="success">{finca.cultivo}</Badge>
              {finca.variedad && (
                <Badge variant="neutral">{finca.variedad}</Badge>
              )}
              {!finca.activa && (
                <Badge variant="error">Inactiva</Badge>
              )}
            </div>
            
            <div className="finca-header__details">
              <div className="finca-header__detail">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>
                  {cliente ? (cliente.apellidos ? `${cliente.nombre} ${cliente.apellidos}` : cliente.nombre) : 'Cliente desconocido'}
                </span>
              </div>
              
              {finca.tecnicoAsignado && (
                <div className="finca-header__detail">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span><strong>Técnico:</strong> {finca.tecnicoAsignado}</span>
                </div>
              )}
              
              <div className="finca-header__detail">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>{finca.superficie.toFixed(2)} ha</span>
              </div>
              
              {finca.tipoRiego && (
                <div className="finca-header__detail">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>{finca.tipoRiego}</span>
                </div>
              )}
            </div>
          </div>

          <div className="finca-header__actions">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Volver
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="finca-stat__info">
              <div className="finca-stat__value">{visitasFinca.length}</div>
              <div className="finca-stat__label">Visitas Registradas</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="finca-stat">
            <div className="finca-stat__icon finca-stat__icon--success">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="finca-stat__info">
              <div className="finca-stat__value">
                {visitasFinca.filter(v => v.estado === 'Realizada').length}
              </div>
              <div className="finca-stat__label">Visitas Realizadas</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="finca-stat">
            <div className="finca-stat__icon finca-stat__icon--warning">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="finca-stat__info">
              <div className="finca-stat__value">
                {visitasFinca.filter(v => v.estado === 'Pendiente' || v.estado === 'Confirmada').length}
              </div>
              <div className="finca-stat__label">Visitas Pendientes</div>
            </div>
          </div>
        </Card>

        {finca.volumenCaldoPorHa && (
          <Card padding="md">
            <div className="finca-stat">
              <div className="finca-stat__icon finca-stat__icon--info">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="finca-stat__info">
                <div className="finca-stat__value">{finca.volumenCaldoPorHa} L/ha</div>
                <div className="finca-stat__label">Volumen de Caldo</div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Registro de Visitas */}
      <div className="finca-detail-page__section">
        <div className="finca-detail-page__section-header">
          <div>
            <h2>Registro de Visitas</h2>
            <p>Historial de visitas técnicas realizadas a esta finca</p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/visitas')}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Nueva Visita
          </Button>
        </div>

        {visitasFinca.length === 0 ? (
          <Card>
            <div className="finca-detail-page__empty">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3>No hay visitas registradas</h3>
              <p>Comienza añadiendo la primera visita a esta finca</p>
              <Button variant="primary" onClick={() => navigate('/visitas')}>
                Programar visita
              </Button>
            </div>
          </Card>
        ) : (
          <div className="finca-detail-page__visitas">
            {visitasFinca
              .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
              .map((visita) => (
                <Card key={visita.id} hoverable>
                  <div className="visita-item">
                    <div className="visita-item__date">
                      <div className="visita-item__date-day">
                        {new Date(visita.fecha).getDate()}
                      </div>
                      <div className="visita-item__date-month">
                        {new Date(visita.fecha).toLocaleDateString('es-ES', { month: 'short' })}
                      </div>
                      <div className="visita-item__date-year">
                        {new Date(visita.fecha).getFullYear()}
                      </div>
                    </div>

                    <div className="visita-item__content">
                      <div className="visita-item__header">
                        <h4>Visita Técnica</h4>
                        <Badge
                          variant={
                            visita.estado === 'Realizada' ? 'success' :
                            visita.estado === 'Confirmada' ? 'info' :
                            visita.estado === 'Cancelada' ? 'error' :
                            'warning'
                          }
                          size="sm"
                        >
                          {visita.estado}
                        </Badge>
                      </div>

                      {visita.horaInicio && (
                        <div className="visita-item__time">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{visita.horaInicio}</span>
                          {visita.duracionEstimada && (
                            <span className="visita-item__duration">
                              ({visita.duracionEstimada} min)
                            </span>
                          )}
                        </div>
                      )}

                      {visita.notas && (
                        <p className="visita-item__notes">{visita.notas}</p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate('/visitas')}
                    >
                      Ver detalles
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Cronograma de Actividades (placeholder por ahora) */}
      <div className="finca-detail-page__section">
        <div className="finca-detail-page__section-header">
          <div>
            <h2>Cronograma de Actividades</h2>
            <p>Línea temporal de actividades programadas y realizadas</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/visitas')}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Nueva Actividad
          </Button>
        </div>

        <Card>
          <div className="finca-detail-page__cronograma-placeholder">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3>Cronograma tipo Gantt</h3>
            <p>Visualización temporal de actividades próximamente</p>
          </div>
        </Card>
      </div>
    </div>
  );
};