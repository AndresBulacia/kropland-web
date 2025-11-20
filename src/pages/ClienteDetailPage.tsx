import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClientes } from '../hooks/useClientes';
import { useFincas } from '../hooks/useFincas';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { FincaCard } from '../components/fincas/FincaCard';
import { Modal } from '../components/common/Modal';
import { FincaForm } from '../components/fincas/FincaForm';
import { type Finca } from '../types';
import './ClienteDetailPage.css';

export const ClienteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { obtenerCliente } = useClientes();
  const { obtenerFincasPorCliente, eliminarFinca, calcularSuperficieTotal } = useFincas();
  
  const [modalFincaAbierto, setModalFincaAbierto] = useState(false);
  const [fincaEditando, setFincaEditando] = useState<Finca | undefined>();

  const cliente = id ? obtenerCliente(id) : undefined;
  const fincas = id ? obtenerFincasPorCliente(id) : [];
  const superficieTotal = id ? calcularSuperficieTotal(id) : 0;

  if (!cliente) {
    return (
      <div className="cliente-detail-page">
        <div className="cliente-detail-page__not-found">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2>Cliente no encontrado</h2>
          <p>El cliente que buscas no existe o ha sido eliminado</p>
          <Button variant="primary" onClick={() => navigate('/clientes')}>
            Volver a Clientes
          </Button>
        </div>
      </div>
    );
  }

  const handleNuevaFinca = () => {
    setFincaEditando(undefined);
    setModalFincaAbierto(true);
  };

  const handleEditarFinca = (finca: Finca) => {
    setFincaEditando(finca);
    setModalFincaAbierto(true);
  };

  const handleEliminarFinca = (fincaId: string) => {
    eliminarFinca(fincaId);
  };

  const handleSubmitFinca = () => {
    setModalFincaAbierto(false);
    setFincaEditando(undefined);
  };

  return (
    <div className="cliente-detail-page">
      {/* Breadcrumb */}
      <div className="cliente-detail-page__breadcrumb">
        <button onClick={() => navigate('/clientes')}>Clientes</button>
        <span>/</span>
        <span>{cliente.nombre} {cliente.apellidos}</span>
      </div>

      {/* Header del cliente */}
      <Card className="cliente-detail-page__header">
        <div className="cliente-header">
          <div className="cliente-header__avatar">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <div className="cliente-header__info">
            <div className="cliente-header__title">
              <h1>{cliente.nombre} {cliente.apellidos}</h1>
              <Badge variant={cliente.activo ? 'success' : 'neutral'}>
                {cliente.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            
            <div className="cliente-header__details">
              <div className="cliente-header__detail">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                <span>{cliente.dni}</span>
              </div>
              
              <div className="cliente-header__detail">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{cliente.telefono}</span>
              </div>
              
              <div className="cliente-header__detail">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{cliente.email}</span>
              </div>
              
              <div className="cliente-header__detail">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{cliente.poblacion}, {cliente.provincia}</span>
              </div>
            </div>
          </div>

          <div className="cliente-header__actions">
            <Button
              variant="outline"
              onClick={() => navigate(`/clientes`)}
            >
              Editar Cliente
            </Button>
          </div>
        </div>
      </Card>

      {/* Estadísticas del cliente */}
      <div className="cliente-detail-page__stats">
        <Card padding="md">
          <div className="cliente-stat">
            <div className="cliente-stat__icon cliente-stat__icon--primary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="cliente-stat__info">
              <div className="cliente-stat__value">{fincas.length}</div>
              <div className="cliente-stat__label">Fincas</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="cliente-stat">
            <div className="cliente-stat__icon cliente-stat__icon--success">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
            <div className="cliente-stat__info">
              <div className="cliente-stat__value">{superficieTotal.toFixed(2)} ha</div>
              <div className="cliente-stat__label">Superficie Total</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="cliente-stat">
            <div className="cliente-stat__icon cliente-stat__icon--warning">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="cliente-stat__info">
              <div className="cliente-stat__value">0</div>
              <div className="cliente-stat__label">Visitas Pendientes</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="cliente-stat">
            <div className="cliente-stat__icon cliente-stat__icon--info">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="cliente-stat__info">
              <div className="cliente-stat__value">Cliente desde</div>
              <div className="cliente-stat__label">
                {new Date(cliente.fechaAlta).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Sección de Fincas */}
      <div className="cliente-detail-page__section">
        <div className="cliente-detail-page__section-header">
          <div>
            <h2>Fincas</h2>
            <p>Gestiona las fincas de este cliente</p>
          </div>
          <Button
            variant="primary"
            onClick={handleNuevaFinca}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Nueva Finca
          </Button>
        </div>

        {fincas.length === 0 ? (
          <Card>
            <div className="cliente-detail-page__empty">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3>No hay fincas registradas</h3>
              <p>Comienza añadiendo la primera finca de este cliente</p>
              <Button variant="primary" onClick={handleNuevaFinca}>
                Añadir primera finca
              </Button>
            </div>
          </Card>
        ) : (
          <div className="cliente-detail-page__fincas-grid">
            {fincas.map((finca) => (
              <FincaCard
                key={finca.id}
                finca={finca}
                onEdit={handleEditarFinca}
                onDelete={handleEliminarFinca}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de formulario de finca */}
      <Modal
        isOpen={modalFincaAbierto}
        onClose={() => {
          setModalFincaAbierto(false);
          setFincaEditando(undefined);
        }}
        title={fincaEditando ? 'Editar Finca' : 'Nueva Finca'}
        size="lg"
      >
        <FincaForm
          finca={fincaEditando}
          clienteId={cliente.id}
          onSubmit={handleSubmitFinca}
          onCancel={() => {
            setModalFincaAbierto(false);
            setFincaEditando(undefined);
          }}
        />
      </Modal>
    </div>
  );
};