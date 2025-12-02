import React from 'react';
import { useNavigate } from 'react-router-dom';
import { type Finca } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import './FincaCard.css';

interface FincaCardProps {
  finca: Finca;
  onEdit: (finca: Finca) => void;
  onDelete?: (id: string) => void;
  onView?: (finca: Finca) => void;
}

export const FincaCard: React.FC<FincaCardProps> = ({
  finca,
  onEdit,
  onDelete
}) => {
  const navigate = useNavigate();

  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(finca);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de eliminar la finca "${finca.nombre}"?`)) {
      onDelete(finca.id);
    }
  };
  
  const handleCardClick = () => {
    navigate(`/fincas/${finca.id}`);
  };
  
  const getCultivoColor = (cultivo: string) => {
    const colors: Record<string, string> = {
      'Olivo': '#193C1E',
      'Viña': '#8B5CF6',
      'Almendro': '#F59E0B',
      'Pistacho': '#10B981',
      'Cítricos': '#F97316',
      'Cereal': '#EAB308'
    };
    return colors[cultivo] || '#00A859';
  };

  return (
    <Card hoverable onClick={handleCardClick}>
      <div className="finca-card">
        {/* Header con icono de cultivo */}
        <div className="finca-card__header">
          <div 
            className="finca-card__icon"
            style={{ backgroundColor: getCultivoColor(finca.cultivo) }}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          
          <div className="finca-card__info">
            <h3 className="finca-card__name">{finca.nombre}</h3>
            <div className="finca-card__badges">
              <Badge variant='info' size='sm'>
                {finca.cultivo}
              </Badge>
              {finca.variedad && (
                <Badge variant='info' size='sm'>
                  {finca.variedad}
                </Badge>
              )}
            </div>
          </div>
          
          <Badge variant={finca.activa ? 'success' : 'neutral'}>
            {finca.activa ? 'Activa' : 'Inactiva'}
          </Badge>
        </div>
        <div className="finca-card__header">
          {finca.tecnicoAsignado && (
            <div className="finca-card__detail finca-card__detail--highlight">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span><strong>Técnico:</strong> {finca.tecnicoAsignado}</span>
            </div>
          )}
        </div>

        {/* Detalles principales */}
        <div className="finca-card__details">
          <div className="finca-card__detail">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span>{finca.superficie.toFixed(2)} ha</span>
          </div>

          {finca.tipoRiego && (
            <div className="finca-card__detail">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>{finca.tipoRiego}</span>
            </div>
          )}
          
          {finca.añoPlantacion && (
            <div className="finca-card__detail">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Plantación: {finca.añoPlantacion}</span>
            </div>
          )}

          {finca.volumenCaldoPorHa && (
            <div className="finca-card__detail">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span>{finca.volumenCaldoPorHa} L/ha</span>
            </div>
          )}
        </div>

        {/* Ubicación */}
        {finca.ubicacion?.direccion && (
            <div className="finca-card__detail">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{finca.ubicacion.direccion}</span>
            </div>
          )}

        {/* Acciones */}
        <div className="finca-card__actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
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
            onClick={handleDelete}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          >
            Eliminar
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/fincas/${finca.id}`);
            }}
          >
            Ver detalles
          </Button>
        </div>
      </div>
    </Card>
  );
};