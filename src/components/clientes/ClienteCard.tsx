import React from 'react';
import { useNavigate } from 'react-router-dom';
import { type Cliente } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import './ClienteCard.css';

interface ClienteCardProps {
  cliente: Cliente;
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: string) => void;
  onView?: (cliente: Cliente) => void;
}

export const ClienteCard: React.FC<ClienteCardProps> = ({
  cliente,
  onEdit,
  onDelete,
  onView
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onView) {
      onView(cliente);
    } else {
      navigate(`/clientes/${cliente.id}`);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(cliente);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nombreCompleto = cliente.apellidos
    ? `${cliente.nombre} ${cliente.apellidos}`
    : cliente.nombre;
    if (window.confirm(`¿Estás seguro de eliminar a ${nombreCompleto}?`)) {
      onDelete(cliente.id);
    }
  };

  const handleVerDetalles = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/clientes/${cliente.id}`);
  };

  return (
    <Card hoverable onClick={handleCardClick}>
      <div className="cliente-card">
        {/* Avatar y nombre */}
        <div className="cliente-card__header">
          <div className="cliente-card__avatar">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <div className="cliente-card__info">
            <h3 className="cliente-card__name">
              {cliente.nombre} {cliente.apellidos}
            </h3>
            <p className="cliente-card__dni">{cliente.dni}</p>
            
            {/* NUEVO - Badges de tipo y estado */}
            <div className="cliente-card__badges">
              <Badge 
                variant={cliente.tipo === 'Activo' ? 'success' : 'warning'}
                size="sm"
              >
                {cliente.tipo === 'Activo' ? 'Activo' : 'Potencial'}
              </Badge>
              
              {!cliente.activo && (
                <Badge variant="error" size="sm">
                  Inactivo
                </Badge>
              )}

              {cliente.tipoCliente === 'Empresa' && (
                <Badge variant='info' size='sm'>
                  Empresa
                </Badge>
              )}

              {cliente.tipoCliente === 'Particular' && (
                <Badge variant='info' size='sm'>
                  Particular
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="cliente-card__details">
          {cliente.tecnicoAsignado && (
            <div className="cliente-card__detail cliente-card__detail--highlight">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span><strong>Técnico:</strong> {cliente.tecnicoAsignado}</span>
            </div>
          )}
          <div className="cliente-card__detail">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{cliente.email}</span>
          </div>
          
          <div className="cliente-card__detail">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{cliente.telefono}</span>
          </div>
          
          <div className="cliente-card__detail">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{cliente.poblacion}, {cliente.provincia}</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="cliente-card__actions">
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
            onClick={handleVerDetalles}
          >
            Ver detalles
          </Button>
        </div>
      </div>
    </Card>
  );
};