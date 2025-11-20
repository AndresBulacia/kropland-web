import React from 'react';
import type { Actividad } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import './ActividadCard.css';

interface ActividadCardProps {
  actividad: Actividad;
  onEdit: (actividad: Actividad) => void;
  onDelete: (id: string) => void;
}

const getActividadIcon = (tipo: string) => {
  const icons: Record<string, React.ReactNode> = {
    'Poda': (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
    'Pulverización': (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    'Riego': (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    'Recolección': (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    'Abonado': (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  };
  return icons[tipo] || icons['Poda'];
};

const getActividadColor = (tipo: string) => {
  const colors: Record<string, string> = {
    'Poda': '#193C1E',
    'Pulverización': '#00A859',
    'Riego': '#3B82F6',
    'Recolección': '#F59E0B',
    'Abonado': '#10B981',
    'Herbicida': '#EF4444',
    'Análisis': '#8B5CF6'
  };
  return colors[tipo] || '#00A859';
};

const getEstadoBadge = (estado: string) => {
  const variants: Record<string, any> = {
    'Completada': 'success',
    'En Proceso': 'info',
    'Planificada': 'warning',
    'Cancelada': 'error'
  };
  return variants[estado] || 'neutral';
};

export const ActividadCard: React.FC<ActividadCardProps> = ({
  actividad,
  onEdit,
  onDelete
}) => {
  return (
    <Card>
      <div className="actividad-card">
        <div className="actividad-card__header">
          <div 
            className="actividad-card__icon"
            style={{ backgroundColor: getActividadColor(actividad.tipo) }}
          >
            {getActividadIcon(actividad.tipo)}
          </div>
          
          <div className="actividad-card__info">
            <div className="actividad-card__title-row">
              <h4 className="actividad-card__tipo">{actividad.tipo}</h4>
              <Badge variant={getEstadoBadge(actividad.estado)}>
                {actividad.estado}
              </Badge>
            </div>
            <p className="actividad-card__descripcion">{actividad.descripcion}</p>
          </div>
        </div>

        <div className="actividad-card__details">
          <div className="actividad-card__detail">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(actividad.fecha).toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}</span>
          </div>

          <div className="actividad-card__detail">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="actividad-card__costo">
              {actividad.costoTotal.toFixed(2)} € 
              {actividad.costoPorHa && (
                <span className="actividad-card__costo-ha">
                  ({actividad.costoPorHa.toFixed(2)} €/ha)
                </span>
              )}
            </span>
          </div>

          {actividad.responsable && (
            <div className="actividad-card__detail">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{actividad.responsable}</span>
            </div>
          )}
        </div>

        {actividad.productos && actividad.productos.length > 0 && (
          <div className="actividad-card__productos">
            <h5>Productos aplicados:</h5>
            {actividad.productos.map((producto, index) => (
              <div key={index} className="actividad-card__producto">
                <span className="actividad-card__producto-nombre">{producto.nombre}</span>
                <span className="actividad-card__producto-dosis">
                  {producto.dosis} {producto.unidad}
                </span>
                {producto.plazoSeguridad && (
                  <span className="actividad-card__producto-plazo">
                    PS: {producto.plazoSeguridad}d
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="actividad-card__actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(actividad)}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          >
            Editar
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm('¿Eliminar esta actividad?')) {
                onDelete(actividad.id);
              }
            }}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          >
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  );
};