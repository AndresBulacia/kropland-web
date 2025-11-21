import React, { useState, useMemo } from 'react';
import { useFincas } from '../hooks/useFincas';
import { useClientes } from '../hooks/useClientes';
import { SearchBar } from '../components/common/SearchBar';
import { Button } from '../components/common/Button';
import { Select } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { FincaCard } from '../components/fincas/FincaCard';
import { FincaForm } from '../components/fincas/FincaForm';
import type { Finca, TipoCultivo, TipoRiego } from '../types';
import './FincasPage.css';

export const FincasPage: React.FC = () => {
  const { fincas, loading, eliminarFinca, filtrarFincas } = useFincas();
  const { clientes } = useClientes();
  
  const [busqueda, setBusqueda] = useState('');
  const [cultivoFiltro, setCultivoFiltro] = useState<string>('');
  const [riegoFiltro, setRiegoFiltro] = useState<string>('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [fincaEditando, setFincaEditando] = useState<Finca | undefined>();

  const fincasConClientes = useMemo(() => {
    return fincas.map(finca => {
      const cliente = clientes.find(c => c.id === finca.clienteId);
      return {
        ...finca,
        nombreCliente: cliente ? `${cliente.nombre} ${cliente.apellidos}` : 'Cliente desconocido'
      };
    });
  }, [fincas, clientes]);

  const fincasFiltradas = useMemo(() => {
    let resultado = [...fincasConClientes];

    if (busqueda) {
      const busq = busqueda.toLowerCase();
      resultado = resultado.filter(f =>
        f.nombre.toLowerCase().includes(busq) ||
        f.cultivo.toLowerCase().includes(busq) ||
        f.variedad.toLowerCase().includes(busq) ||
        f.nombreCliente.toLowerCase().includes(busq)
      );
    }

    if (cultivoFiltro) {
      resultado = resultado.filter(f => f.cultivo === cultivoFiltro);
    }

    if (riegoFiltro) {
      resultado = resultado.filter(f => f.tipoRiego === riegoFiltro);
    }

    return resultado;
  }, [fincasConClientes, busqueda, cultivoFiltro, riegoFiltro]);

  const superficieTotal = useMemo(() => {
    return fincasFiltradas.reduce((sum, f) => sum + f.superficie, 0);
  }, [fincasFiltradas]);

  const handleNuevaFinca = () => {
    if (clientes.length === 0) {
      alert('Primero debes crear al menos un cliente antes de añadir fincas');
      return;
    }
    setFincaEditando(undefined);
    setModalAbierto(true);
  };

  const handleEditarFinca = (finca: Finca) => {
    setFincaEditando(finca);
    setModalAbierto(true);
  };

  const handleEliminarFinca = (id: string) => {
    eliminarFinca(id);
  };

  const handleSubmitFinca = () => {
    setModalAbierto(false);
    setFincaEditando(undefined);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setCultivoFiltro('');
    setRiegoFiltro('');
  };

  if (loading) {
    return (
      <div className="fincas-page">
        <div className="fincas-page__loading">
          <div className="spinner spin"></div>
          <p>Cargando fincas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fincas-page">
      {/* Header */}
      <div className="fincas-page__header">
        <div className="fincas-page__title-section">
          <h1 className="fincas-page__title">Fincas</h1>
          <p className="fincas-page__subtitle">
            Gestiona todas las fincas y sus características
          </p>
        </div>

        <div className="fincas-page__actions">
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
      </div>

      {/* Filtros */}
      <div className="fincas-page__filters">
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por nombre, cultivo, variedad o cliente..."
          fullWidth
        />
        
        <div className="fincas-page__filters-row">
          <Select
            value={cultivoFiltro}
            onChange={(e) => setCultivoFiltro(e.target.value)}
            options={[
              { value: '', label: 'Todos los cultivos' },
              { value: 'Olivo', label: 'Olivo' },
              { value: 'Viña', label: 'Viña' },
              { value: 'Almendro', label: 'Almendro' },
              { value: 'Pistacho', label: 'Pistacho' },
              { value: 'Cítricos', label: 'Cítricos' },
              { value: 'Cereal', label: 'Cereal' },
              { value: 'Hortícola', label: 'Hortícola' },
              { value: 'Otro', label: 'Otro' }
            ]}
          />
          
          <Select
            value={riegoFiltro}
            onChange={(e) => setRiegoFiltro(e.target.value)}
            options={[
              { value: '', label: 'Todos los tipos' },
              { value: 'Regadío', label: 'Regadío' },
              { value: 'Secano', label: 'Secano' }
            ]}
          />

          {(busqueda || cultivoFiltro || riegoFiltro) && (
            <Button variant="ghost" onClick={limpiarFiltros}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="fincas-page__stats">
        <div className="fincas-page__stat">
          <span className="fincas-page__stat-value">{fincasFiltradas.length}</span>
          <span className="fincas-page__stat-label">
            {fincasFiltradas.length === 1 ? 'Finca' : 'Fincas'}
          </span>
        </div>
        
        <div className="fincas-page__stat">
          <span className="fincas-page__stat-value">{superficieTotal.toFixed(2)} ha</span>
          <span className="fincas-page__stat-label">Superficie Total</span>
        </div>
      </div>

      {/* Lista de fincas */}
      {fincasFiltradas.length === 0 ? (
        <div className="fincas-page__empty">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3>No hay fincas</h3>
          <p>
            {busqueda || cultivoFiltro || riegoFiltro
              ? 'No se encontraron fincas con esos criterios'
              : 'Comienza añadiendo tu primera finca'}
          </p>
          {!busqueda && !cultivoFiltro && !riegoFiltro && (
            <Button variant="primary" onClick={handleNuevaFinca}>
              Añadir primera finca
            </Button>
          )}
        </div>
      ) : (
        <div className="fincas-page__grid">
          {fincasFiltradas.map((finca) => (
            <div key={finca.id} className="fincas-page__finca-wrapper">
              <FincaCard
                finca={finca}
                onEdit={handleEditarFinca}
                onDelete={handleEliminarFinca}
              />
              <div className="fincas-page__finca-cliente">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{finca.nombreCliente}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de formulario */}
      <Modal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setFincaEditando(undefined);
        }}
        title={fincaEditando ? 'Editar Finca' : 'Nueva Finca'}
        size="lg"
      >
        <FincaForm
          finca={fincaEditando}
          clienteId={clientes[0]?.id || ''}
          onSubmit={handleSubmitFinca}
          onCancel={() => {
            setModalAbierto(false);
            setFincaEditando(undefined);
          }}
        />
      </Modal>
    </div>
  );
};