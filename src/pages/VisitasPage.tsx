import React, { useState, useMemo } from 'react';
import { useVisitas } from '../hooks/useVisitas';
import { useClientes } from '../hooks/useClientes';
import { useFincas } from '../hooks/useFincas';
import type { Visita } from '../types';
import './VisitasPage.css';

interface FiltrosUI {
  cliente: string;
  finca: string;
  estado: string;
  busqueda: string;
  periodo: 'proximas' | 'todas' | 'realizadas';
}

export const VisitasPage: React.FC = () => {
  const { visitas, crearVisita, actualizarVisita, eliminarVisita, cambiarEstado } = useVisitas();
  const { clientes } = useClientes();
  const { fincas } = useFincas();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [visitaEditando, setVisitaEditando] = useState<Visita | null>(null);
  const [filtros, setFiltros] = useState<FiltrosUI>({
    cliente: '',
    finca: '',
    estado: '',
    busqueda: '',
    periodo: 'proximas'
  });

  // Filtrar visitas según criterios
  const visitasFiltrando = useMemo(() => {
    let resultado = visitas;

    // Filtro por período
    if (filtros.periodo === 'proximas') {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const limite = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);
      resultado = resultado.filter(v => {
        const fecha = new Date(v.fecha);
        fecha.setHours(0, 0, 0, 0);
        return fecha >= hoy && fecha <= limite;
      });
    } else if (filtros.periodo === 'realizadas') {
      resultado = resultado.filter(v => v.estado === 'Realizada');
    }

    // Filtro por cliente
    if (filtros.cliente) {
      resultado = resultado.filter(v => v.clienteId === filtros.cliente);
    }

    // Filtro por finca
    if (filtros.finca && filtros.cliente) {
      resultado = resultado.filter(v => v.fincaId === filtros.finca);
    }

    // Filtro por estado
    if (filtros.estado) {
      resultado = resultado.filter(v => v.estado === filtros.estado);
    }

    // Búsqueda
    if (filtros.busqueda) {
      const termino = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(v =>
        v.notas?.toLowerCase().includes(termino)
      );
    }

    return resultado.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [visitas, filtros]);

  // Fincas del cliente seleccionado
  const fincasDelCliente = filtros.cliente
    ? fincas.filter(f => f.clienteId === filtros.cliente)
    : [];

  const handleAbrirModalNueva = () => {
    setVisitaEditando(null);
    setModalAbierto(true);
  };

  const handleAbrirModalEditar = (visita: Visita) => {
    setVisitaEditando(visita);
    setModalAbierto(true);
  };

  const handleGuardar = (datosFormulario: any) => {
    if (visitaEditando) {
      actualizarVisita(visitaEditando.id, datosFormulario);
    } else {
      crearVisita(datosFormulario);
    }
    setModalAbierto(false);
    setVisitaEditando(null);
  };

  const handleEliminar = (id: string) => {
    if (confirm('¿Confirmar eliminación de la visita?')) {
      eliminarVisita(id);
    }
  };

  const handleCambiarEstado = (id: string, nuevoEstado: Visita['estado']) => {
    cambiarEstado(id, nuevoEstado);
  };

  const estadosDisponibles: Visita['estado'][] = ['Pendiente', 'Confirmada', 'Realizada', 'Cancelada'];

  return (
    <div className="visitas-page">
      <div className="visitas-header">
        <div>
          <h1>📅 Visitas Técnicas</h1>
          <p className="subtitle">Gestiona y planifica las visitas a las fincas</p>
        </div>
        <button className="btn-nueva-visita" onClick={handleAbrirModalNueva}>
          + Nueva Visita
        </button>
      </div>

      {/* Filtros */}
      <div className="visitas-filtros">
        <div className="filtro-grupo">
          <label>Período</label>
          <select
            value={filtros.periodo}
            onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value as any })}
            className="filtro-select"
          >
            <option value="proximas">Próximas (30 días)</option>
            <option value="todas">Todas</option>
            <option value="realizadas">Realizadas</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label>Cliente</label>
          <select
            value={filtros.cliente}
            onChange={(e) => setFiltros({ ...filtros, cliente: e.target.value, finca: '' })}
            className="filtro-select"
          >
            <option value="">Todos los clientes</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        {filtros.cliente && (
          <div className="filtro-grupo">
            <label>Finca</label>
            <select
              value={filtros.finca}
              onChange={(e) => setFiltros({ ...filtros, finca: e.target.value })}
              className="filtro-select"
            >
              <option value="">Todas las fincas</option>
              {fincasDelCliente.map(f => (
                <option key={f.id} value={f.id}>{f.nombre}</option>
              ))}
            </select>
          </div>
        )}

        <div className="filtro-grupo">
          <label>Estado</label>
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            className="filtro-select"
          >
            <option value="">Todos</option>
            {estadosDisponibles.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <div className="filtro-grupo">
          <label>Buscar en notas</label>
          <input
            type="text"
            placeholder="Buscar..."
            value={filtros.busqueda}
            onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
            className="filtro-input"
          />
        </div>
      </div>

      {/* Lista de visitas */}
      <div className="visitas-lista">
        {visitasFiltrando.length === 0 ? (
          <div className="vacio">
            <p>No hay visitas que mostrar</p>
          </div>
        ) : (
          <div className="grid-visitas">
            {visitasFiltrando.map(visita => {
              const cliente = clientes.find(c => c.id === visita.clienteId);
              const finca = fincas.find(f => f.id === visita.fincaId);

              return (
                <div key={visita.id} className={`visita-card estado-${visita.estado.toLowerCase()}`}>
                  <div className="visita-header">
                    <div>
                      <h3>{cliente?.nombre || 'Cliente desconocido'}</h3>
                      <p className="finca-nombre">{finca?.nombre || 'Finca desconocida'}</p>
                    </div>
                    <span className={`estado-badge estado-${visita.estado.toLowerCase()}`}>
                      {visita.estado}
                    </span>
                  </div>

                  <div className="visita-detalles">
                    <div className="detalle-item">
                      <span className="label">📅 Fecha:</span>
                      <span className="valor">{visita.fecha}</span>
                    </div>
                    <div className="detalle-item">
                      <span className="label">🕐 Hora:</span>
                      <span className="valor">{visita.horaInicio}</span>
                    </div>
                    {visita.duracionEstimada && (
                      <div className="detalle-item">
                        <span className="label">⏱️ Duración:</span>
                        <span className="valor">{visita.duracionEstimada} min</span>
                      </div>
                    )}
                  </div>

                  <div className="visita-notas">
                    <p>{visita.notas}</p>
                  </div>

                  <div className="visita-acciones">
                    {visita.estado !== 'Realizada' && (
                      <select
                        value={visita.estado}
                        onChange={(e) => handleCambiarEstado(visita.id, e.target.value as any)}
                        className="select-estado"
                      >
                        {estadosDisponibles.map(e => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    )}

                    <button
                      className="btn-editar"
                      onClick={() => handleAbrirModalEditar(visita)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminar(visita.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalAbierto && (
        <VisitaModal
          visita={visitaEditando}
          clientes={clientes}
          fincas={fincas}
          onGuardar={handleGuardar}
          onCerrar={() => {
            setModalAbierto(false);
            setVisitaEditando(null);
          }}
        />
      )}
    </div>
  );
};

// Componente Modal
interface VisitaModalProps {
  visita: Visita | null;
  clientes: any[];
  fincas: any[];
  onGuardar: (datos: any) => void;
  onCerrar: () => void;
}

const VisitaModal: React.FC<VisitaModalProps> = ({ visita, clientes, fincas, onGuardar, onCerrar }) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(visita?.clienteId || '');
  const [form, setForm] = useState({
    fincaId: visita?.fincaId || '',
    fecha: visita?.fecha || '',
    horaInicio: visita?.horaInicio || '',
    horaFin: visita?.horaFin || '',
    duracionEstimada: visita?.duracionEstimada || 60,
    notas: visita?.notas || '',
    tecnicoId: visita?.tecnicoId || 'tecnico1',
    estado: visita?.estado || 'Pendiente'
  });

  const fincasDelCliente = fincas.filter(f => f.clienteId === clienteSeleccionado);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSeleccionado || !form.fincaId || !form.fecha || !form.horaInicio) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    onGuardar({
      clienteId: clienteSeleccionado,
      ...form
    });
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{visita ? 'Editar Visita' : 'Nueva Visita'}</h2>
          <button className="btn-cerrar" onClick={onCerrar}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="visita-form">
          <div className="form-grupo">
            <label>Cliente *</label>
            <select
              value={clienteSeleccionado}
              onChange={(e) => {
                setClienteSeleccionado(e.target.value);
                setForm(prev => ({ ...prev, fincaId: '' }));
              }}
              required
            >
              <option value="">Selecciona un cliente</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          {clienteSeleccionado && (
            <div className="form-grupo">
              <label>Finca *</label>
              <select
                value={form.fincaId}
                onChange={(e) => handleChange('fincaId', e.target.value)}
                required
              >
                <option value="">Selecciona una finca</option>
                {fincasDelCliente.map(f => (
                  <option key={f.id} value={f.id}>{f.nombre}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-grupo">
            <label>Fecha *</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => handleChange('fecha', e.target.value)}
              required
            />
          </div>

          <div className="form-fila">
            <div className="form-grupo">
              <label>Hora inicio *</label>
              <input
                type="time"
                value={form.horaInicio}
                onChange={(e) => handleChange('horaInicio', e.target.value)}
                required
              />
            </div>
            <div className="form-grupo">
              <label>Hora fin</label>
              <input
                type="time"
                value={form.horaFin}
                onChange={(e) => handleChange('horaFin', e.target.value)}
              />
            </div>
          </div>

          <div className="form-grupo">
            <label>Duración estimada (minutos)</label>
            <input
              type="number"
              value={form.duracionEstimada}
              onChange={(e) => handleChange('duracionEstimada', parseInt(e.target.value))}
              min="15"
              step="15"
            />
          </div>

          <div className="form-grupo">
            <label>Notas</label>
            <textarea
              value={form.notas}
              onChange={(e) => handleChange('notas', e.target.value)}
              placeholder="Observaciones, puntos a revisar, etc..."
              rows={4}
            />
          </div>

          <div className="form-grupo">
            <label>Estado</label>
            <select
              value={form.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Realizada">Realizada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          <div className="form-acciones">
            <button type="button" className="btn-cancelar" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar">
              {visita ? 'Actualizar' : 'Crear'} Visita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};