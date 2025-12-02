import React, { useState, useMemo } from 'react';
import { useVisitas } from '../hooks/useVisitas';
import { useClientes } from '../hooks/useClientes';
import { useFincas } from '../hooks/useFincas';
import type { Visita, FiltrosVisita } from '../types';
import { SearchBar } from '../components/common/SearchBar';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { VisitaFormCompleto } from '../components/visitas/VisitaForm';
import './VisitasPage.css';

export const VisitasPage: React.FC = () => {
  const {
    visitas,
    loading,
    crearVisita,
    actualizarVisita,
    eliminarVisita
  } = useVisitas();
  
  const { clientes } = useClientes();
  const { fincas } = useFincas();

  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<Visita['estado'] | 'todos'>('todos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [visitaEditando, setVisitaEditando] = useState<Visita | undefined>();

  const visitasFiltradas = useMemo(() => {
    return visitas.filter(visita => {
      const cliente = clientes.find(c => c.id === visita.clienteId);
      const finca = fincas.find(f => f.id === visita.fincaId);
      
      const cumpleBusqueda = !busqueda || 
        cliente?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente?.apellidos?.toLowerCase().includes(busqueda.toLowerCase()) ||
        finca?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        visita.notas?.toLowerCase().includes(busqueda.toLowerCase()) ||
        visita.observaciones?.toLowerCase().includes(busqueda.toLowerCase());
      
      const cumpleEstado = filtroEstado === 'todos' || visita.estado === filtroEstado;
      
      return cumpleBusqueda && cumpleEstado;
    });
  }, [visitas, clientes, fincas, busqueda, filtroEstado]);

  const handleNuevaVisita = () => {
    setVisitaEditando(undefined);
    setModalAbierto(true);
  };

  const handleEditarVisita = (visita: Visita) => {
    setVisitaEditando(visita);
    setModalAbierto(true);
  };

  const handleSubmitForm = (data: Omit<Visita, 'id' | 'fechaCreacion'>) => {
    if (visitaEditando) {
      actualizarVisita(visitaEditando.id, data);
    } else {
      crearVisita(data);
    }
    setModalAbierto(false);
    setVisitaEditando(undefined);
  };

  const handleEliminarVisita = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta visita?')) {
      eliminarVisita(id);
    }
  };

  if (loading) {
    return (
      <div className="visitas-page">
        <div className="visitas-page__loading">
          <div className="spinner spin"></div>
          <p>Cargando visitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="visitas-page">
      {/* Header */}
      <div className="visitas-page__header">
        <div className="visitas-page__title-section">
          <h1 className="visitas-page__title">Visitas Técnicas</h1>
          <p className="visitas-page__subtitle">
            Gestiona y registra las visitas a las fincas
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleNuevaVisita}
          icon={
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        >
          Nueva Visita
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <div className="visitas-page__toolbar">
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por cliente, finca u observaciones..."
          fullWidth
        />
      </div>

      {/* Filtros */}
      <div className="visitas-page__filters">
        <div className="filter-group">
          <label>Estado</label>
          <div className="filter-buttons">
            <button
              className={`filter-button ${filtroEstado === 'todos' ? 'active' : ''}`}
              onClick={() => setFiltroEstado('todos')}
            >
              Todas ({visitas.length})
            </button>
            <button
              className={`filter-button ${filtroEstado === 'Pendiente' ? 'active' : ''}`}
              onClick={() => setFiltroEstado('Pendiente')}
            >
              Pendientes ({visitas.filter(v => v.estado === 'Pendiente').length})
            </button>
            <button
              className={`filter-button ${filtroEstado === 'Confirmada' ? 'active' : ''}`}
              onClick={() => setFiltroEstado('Confirmada')}
            >
              Confirmadas ({visitas.filter(v => v.estado === 'Confirmada').length})
            </button>
            <button
              className={`filter-button ${filtroEstado === 'Realizada' ? 'active' : ''}`}
              onClick={() => setFiltroEstado('Realizada')}
            >
              Realizadas ({visitas.filter(v => v.estado === 'Realizada').length})
            </button>
            <button
              className={`filter-button ${filtroEstado === 'Cancelada' ? 'active' : ''}`}
              onClick={() => setFiltroEstado('Cancelada')}
            >
              Canceladas ({visitas.filter(v => v.estado === 'Cancelada').length})
            </button>
          </div>
        </div>
      </div>

      {/* Lista de visitas */}
      {visitasFiltradas.length === 0 ? (
        <div className="visitas-page__empty">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3>No hay visitas</h3>
          <p>
            {busqueda || filtroEstado !== 'todos'
              ? 'No se encontraron visitas con esos criterios'
              : 'Comienza programando tu primera visita'}
          </p>
          {!busqueda && filtroEstado === 'todos' && (
            <Button variant="primary" onClick={handleNuevaVisita}>
              Programar primera visita
            </Button>
          )}
        </div>
      ) : (
        <div className="visitas-page__grid">
          {visitasFiltradas
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            .map((visita) => {
              const cliente = clientes.find(c => c.id === visita.clienteId);
              const finca = fincas.find(f => f.id === visita.fincaId);
              
              return (
                <div key={visita.id} className="visita-card">
                  <div className="visita-card__header">
                    <div className="visita-card__date">
                      <div className="visita-card__date-day">
                        {new Date(visita.fecha).getDate()}
                      </div>
                      <div className="visita-card__date-month">
                        {new Date(visita.fecha).toLocaleDateString('es-ES', { month: 'short' })}
                      </div>
                    </div>
                    
                    <Badge
                      variant={
                        visita.estado === 'Realizada' ? 'success' :
                        visita.estado === 'Confirmada' ? 'info' :
                        visita.estado === 'Cancelada' ? 'error' :
                        'warning'
                      }
                    >
                      {visita.estado}
                    </Badge>
                  </div>

                  <div className="visita-card__content">
                    <h3 className="visita-card__title">
                      {cliente ? (cliente.apellidos ? `${cliente.nombre} ${cliente.apellidos}` : cliente.nombre) : 'Cliente desconocido'}
                    </h3>
                    <p className="visita-card__subtitle">
                      {finca?.nombre || 'Finca desconocida'}
                    </p>
                    
                    {visita.duracionMinutos && (
                      <div className="visita-card__info">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{visita.duracionMinutos} minutos</span>
                      </div>
                    )}
                    
                    {visita.actividadesRealizadas && visita.actividadesRealizadas.length > 0 && (
                      <div className="visita-card__actividades">
                        {visita.actividadesRealizadas.map((act, i) => (
                          <Badge key={i} variant="neutral" size="sm">
                            {act}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {visita.observaciones && (
                      <p className="visita-card__observaciones">
                        {visita.observaciones.length > 100
                          ? `${visita.observaciones.substring(0, 100)}...`
                          : visita.observaciones}
                      </p>
                    )}
                  </div>

                  <div className="visita-card__actions">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditarVisita(visita)}
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
                      onClick={() => handleEliminarVisita(visita.id)}
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
              );
            })}
        </div>
      )}

      {/* Modal de formulario */}
      <Modal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setVisitaEditando(undefined);
        }}
        title={visitaEditando ? 'Editar Visita' : 'Nueva Visita'}
        size="xl"
      >
        <VisitaFormCompleto
          visita={visitaEditando}
          clientes={clientes}
          fincas={fincas}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setModalAbierto(false);
            setVisitaEditando(undefined);
          }}
        />
      </Modal>
    </div>
  );
};