import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientes } from '../hooks/useClientes';
import type { Cliente } from '../types';
import { SearchBar } from '../components/common/SearchBar';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ClienteCard } from '../components/clientes/ClienteCard';
import { ClienteForm } from '../components/clientes/ClienteForm';
import './ClientesPage.css';

export const ClientesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    clientes,
    loading,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    importarDesdeCSV
  } = useClientes();

  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'Activo' | 'Potencial'>('todos');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activos' | 'inactivos'>('todos');
  const [filtroTecnico, setFiltroTecnico] = useState<string>('todos');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | undefined>();
  const [mostrarImportar, setMostrarImportar] = useState(false);

  // Obtener lista unica de tecnicos asignados
  const tecnicos = useMemo(() => {
    const tecnicosUnicos = new Set<string>();
    clientes.forEach(c => {
      if (c.tecnicoAsignado) {
        tecnicosUnicos.add(c.tecnicoAsignado);
      }
    });
    return Array.from(tecnicosUnicos).sort();
  }, [clientes]);

  // Filtrar clientes basado en búsqueda, tipo y estado
  const clientesFiltrados = useMemo(() => {
    return clientes.filter(cliente => {
      const cumpleBusqueda = 
        cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (cliente.apellidos?.toLowerCase().includes(busqueda.toLowerCase()) || false) ||
        cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.telefono.includes(busqueda) ||
        cliente.dni.toLowerCase().includes(busqueda.toLowerCase());
      
      const cumpleEstado = 
        filtroEstado === 'todos' || 
        (filtroEstado === 'activos' && cliente.activo) ||
        (filtroEstado === 'inactivos' && !cliente.activo);
      
      const cumpleTipo = filtroTipo === 'todos' || cliente.tipo === filtroTipo;

      const cumpleTecnico =
      filtroTecnico === 'todos' ||
      (filtroTecnico === 'sin-asignar' && !cliente.tecnicoAsignado) ||
      cliente.tecnicoAsignado === filtroTecnico;
      
      return cumpleBusqueda && cumpleEstado && cumpleTipo && cumpleTecnico;
    });
  }, [clientes, busqueda, filtroEstado, filtroTipo, filtroTecnico]);

  const handleNuevoCliente = () => {
    setClienteEditando(undefined);
    setModalAbierto(true);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setModalAbierto(true);
  };

  const handleVerDetalle = (cliente: Cliente) => {
    navigate(`/clientes/${cliente.id}`);
  }

  const handleSubmitForm = (data: Omit<Cliente, 'id' | 'fechaAlta'>) => {
    if (clienteEditando) {
      actualizarCliente(clienteEditando.id, data);
    } else {
      crearCliente(data);
    }
    setModalAbierto(false);
    setClienteEditando(undefined);
  };

  const handleImportarCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target?.result as string;
      const resultado = importarDesdeCSV(csvData);
      
      alert(`Importación completa:\n${resultado.exito} clientes importados\n${resultado.errores} errores`);
      setMostrarImportar(false);
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="clientes-page">
        <div className="clientes-page__loading">
          <div className="spinner spin"></div>
          <p>Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="clientes-page">
      {/* Header */}
      <div className="clientes-page__header">
        <div className="clientes-page__title-section">
          <h1 className="clientes-page__title">Clientes</h1>
          <p className="clientes-page__subtitle">
            Gestiona tus clientes y su información de contacto
          </p>
        </div>

        <div className="clientes-page__actions">
          <Button
            variant="outline"
            onClick={() => setMostrarImportar(!mostrarImportar)}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            }
          >
            <span className="hide-mobile">Importar CSV</span>
          </Button>
          
          <Button
            variant="primary"
            onClick={handleNuevoCliente}
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Importar CSV */}
      {mostrarImportar && (
        <div className="clientes-page__import">
          <div className="clientes-page__import-content">
            <h3>Importar clientes desde CSV</h3>
            <p>El archivo CSV debe tener las siguientes columnas:</p>
            <code>Nombre, Apellidos, DNI, Teléfono, Email, Población, Provincia, Comunidad Autónoma, CP, Dirección, Notas</code>
            
            <input
              type="file"
              accept=".csv"
              onChange={handleImportarCSV}
              className="clientes-page__file-input"
            />
          </div>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="clientes-page__toolbar">
        <SearchBar
          value={busqueda}
          onChange={setBusqueda}
          placeholder="Buscar por nombre, DNI, email o teléfono..."
          fullWidth
        />
      </div>

      {/* Filtros */}
      <div className="clientes-page__filters">
        <div className="filter-group">
          <label>Tipo de Cliente</label>
          <div className="filter-buttons">
            <button
              className={`filter-button ${filtroTipo === 'todos' ? 'active' : ''}`}
              onClick={() => setFiltroTipo('todos')}
            >
              Todos ({clientes.length})
            </button>
            <button
              className={`filter-button ${filtroTipo === 'Activo' ? 'active' : ''}`}
              onClick={() => setFiltroTipo('Activo')}
            >
              Activos ({clientes.filter(c => c.tipo === 'Activo').length})
            </button>
            <button
              className={`filter-button ${filtroTipo === 'Potencial' ? 'active' : ''}`}
              onClick={() => setFiltroTipo('Potencial')}
            >
              Potenciales ({clientes.filter(c => c.tipo === 'Potencial').length})
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>Estado</label>
          <div className="filter-buttons">
            <button
              className={`filter-button ${filtroEstado === 'todos' ? 'active' : ''}`}
              onClick={() => setFiltroEstado('todos')}
            >
              Todos
            </button>
            <button
              className={`filter-button ${filtroEstado === 'activos' ? 'active' : ''}`}
              onClick={() => setFiltroEstado('activos')}
            >
              Activos
            </button>
            <button
              className={`filter-button ${filtroEstado === 'inactivos' ? 'active' : ''}`}
              onClick={() => setFiltroEstado('inactivos')}
            >
              Inactivos
            </button>
          </div>
        </div>

        {/* Filtro por técnico */}
        <div className="filter-group">
          <label>Técnico Asignado</label>
          <div className="filter-buttons">
            <button
              className={`filter-button ${filtroTecnico === 'todos' ? 'active' : ''}`}
              onClick={() => setFiltroTecnico('todos')}
            >
              Todos
            </button>

            <button
              className={`filter-button ${filtroTecnico === 'sin-asignar' ? 'active' : ''}`}
              onClick={() => setFiltroTecnico('sin-asignar')}
            >
              Sin asignar ({clientes.filter(c => !c.tecnicoAsignado).length})
            </button>
            {tecnicos.map(tecnico => (
              <button
                key={tecnico}
                className={`filter-button ${filtroTecnico === tecnico ? 'active' : ''}`}
                onClick={() => setFiltroTecnico(tecnico)}
              >
                {tecnico} ({clientes.filter(c => c.tecnicoAsignado === tecnico).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="clientes-page__stats">
        <div className="clientes-page__stat">
          <span className="clientes-page__stat-value">{clientesFiltrados.length}</span>
          <span className="clientes-page__stat-label">
            {clientesFiltrados.length === 1 ? 'Cliente encontrado' : 'Clientes encontrados'}
          </span>
        </div>
      </div>

      {/* Lista de clientes */}
      {clientesFiltrados.length === 0 ? (
        <div className="clientes-page__empty">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3>No hay clientes</h3>
          <p>
            {busqueda || filtroTipo !== 'todos' || filtroEstado !== 'todos'
              ? 'No se encontraron clientes con esos criterios'
              : 'Comienza añadiendo tu primer cliente'}
          </p>
          {!busqueda && filtroTipo === 'todos' && filtroEstado === 'todos' && (
            <Button variant="primary" onClick={handleNuevoCliente}>
              Añadir primer cliente
            </Button>
          )}
        </div>
      ) : (
        <div className="clientes-page__grid">
          {clientesFiltrados.map((cliente) => (
            <ClienteCard
              key={cliente.id}
              cliente={cliente}
              onEdit={handleEditarCliente}
              onDelete={eliminarCliente}
              onView={handleVerDetalle}
            />
          ))}
        </div>
      )}

      {/* Modal de formulario */}
      <Modal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setClienteEditando(undefined);
        }}
        title={clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}
        size="lg"
      >
        <ClienteForm
          cliente={clienteEditando}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setModalAbierto(false);
            setClienteEditando(undefined);
          }}
        />
      </Modal>
    </div>
  );
};