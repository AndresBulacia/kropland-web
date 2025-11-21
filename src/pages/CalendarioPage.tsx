import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, type View, type SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addHours } from 'date-fns';
import { es } from 'date-fns/locale';
import { useVisitas } from '../hooks/useVisitas';
import { useClientes } from '../hooks/useClientes';
import { useFincas } from '../hooks/useFincas';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarioPage.css';

// Configurar localización
const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'visita' | 'actividad';
  visitaId?: string;
  fincaId: string;
  clienteId: string;
  resource?: {
    tipo: 'visita' | 'actividad';
    estado?: string;
    notas?: string;
  };
}

export const CalendarioPage: React.FC = () => {
  const { visitas } = useVisitas();
  const { clientes } = useClientes();
  const { fincas } = useFincas();
  
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [filtroCliente, setFiltroCliente] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<'todas' | 'visitas' | 'actividades'>('todas');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [eventSeleccionado, setEventSeleccionado] = useState<CalendarEvent | null>(null);

  // Convertir visitas a eventos del calendario
  const eventos = useMemo(() => {
    const eventosCalendar: CalendarEvent[] = [];

    // Agregar visitas
    visitas.forEach(visita => {
      if (filtroCliente && visita.clienteId !== filtroCliente) return;
      if (filtroTipo === 'actividades') return;

      const fecha = new Date(visita.fecha);
      const [hora, minuto] = (visita.horaInicio || '00:00').split(':').map(Number);
      const inicio = new Date(fecha);
      inicio.setHours(hora, minuto, 0);

      let fin = new Date(inicio);
      if (visita.horaFin) {
        const [horaFin, minutoFin] = visita.horaFin.split(':').map(Number);
        fin = new Date(fecha);
        fin.setHours(horaFin, minutoFin, 0);
      } else if (visita.duracionEstimada) {
        fin = addHours(inicio, Math.ceil(visita.duracionEstimada / 60));
      } else {
        fin = addHours(inicio, 1);
      }

      const cliente = clientes.find(c => c.id === visita.clienteId);
      const finca = fincas.find(f => f.id === visita.fincaId);

      eventosCalendar.push({
        id: `visita-${visita.id}`,
        title: `📅 ${cliente?.nombre || 'Cliente'} - ${finca?.nombre || 'Finca'}`,
        start: inicio,
        end: fin,
        type: 'visita',
        visitaId: visita.id,
        fincaId: visita.fincaId,
        clienteId: visita.clienteId,
        resource: {
          tipo: 'visita',
          estado: visita.estado,
          notas: visita.notas,
        },
      });
    });

    return eventosCalendar;
  }, [visitas, clientes, fincas, filtroCliente, filtroTipo]);

  // Estilos personalizados para eventos
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#00A859';
    let borderColor = '#00A859';
    const textColor = '#FFFFFF';

    if (event.resource?.estado === 'Pendiente') {
      backgroundColor = '#FFA726';
      borderColor = '#FFA726';
    } else if (event.resource?.estado === 'Confirmada') {
      backgroundColor = '#42A5F5';
      borderColor = '#42A5F5';
    } else if (event.resource?.estado === 'Realizada') {
      backgroundColor = '#66BB6A';
      borderColor = '#66BB6A';
    } else if (event.resource?.estado === 'Cancelada') {
      backgroundColor = '#EF5350';
      borderColor = '#EF5350';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: textColor,
        border: `2px solid ${borderColor}`,
        display: 'block',
        padding: '4px 6px',
      },
    };
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setEventSeleccionado(event);
    setModalAbierto(true);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // Crear nuevo evento (opcional)
    console.log('Nuevo slot seleccionado:', slotInfo.start);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleChangeView = (newView: View) => {
    setView(newView);
  };

  // Obtener estadísticas
  const stats = useMemo(() => {
    let visitasProximas = 0;
    let visitasRealizadas = 0;
    let visitasPendientes = 0;

    const ahora = new Date();

    visitas.forEach(v => {
      const fecha = new Date(v.fecha);
      if (filtroCliente && v.clienteId !== filtroCliente) return;

      if (fecha >= ahora && v.estado !== 'Cancelada') visitasProximas++;
      if (v.estado === 'Realizada') visitasRealizadas++;
      if (v.estado === 'Pendiente') visitasPendientes++;
    });

    return { visitasProximas, visitasRealizadas, visitasPendientes };
  }, [visitas, filtroCliente]);

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <div>
          <h1>📆 Calendario Agrícola</h1>
          <p className="subtitle">Gestiona visitas y actividades en una agenda visual</p>
        </div>
        <div className="calendar-stats">
          <div className="stat">
            <span className="stat-valor">{stats.visitasProximas}</span>
            <span className="stat-label">Próximas</span>
          </div>
          <div className="stat">
            <span className="stat-valor">{stats.visitasRealizadas}</span>
            <span className="stat-label">Realizadas</span>
          </div>
          <div className="stat">
            <span className="stat-valor">{stats.visitasPendientes}</span>
            <span className="stat-label">Pendientes</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="calendar-filtros">
        <div className="filtro-grupo">
          <label>Cliente</label>
          <select
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            className="filtro-select"
          >
            <option value="">Todos los clientes</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="filtro-grupo">
          <label>Tipo de evento</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as any)}
            className="filtro-select"
          >
            <option value="todas">Todas</option>
            <option value="visitas">Solo visitas</option>
            <option value="actividades">Solo actividades</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label>Vista</label>
          <select
            value={view}
            onChange={(e) => handleChangeView(e.target.value as View)}
            className="filtro-select"
          >
            <option value="month">Mensual</option>
            <option value="week">Semanal</option>
            <option value="day">Diaria</option>
            <option value="agenda">Agenda</option>
          </select>
        </div>

        {filtroCliente && (
          <button
            className="btn-limpiar"
            onClick={() => setFiltroCliente('')}
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Leyenda */}
      <div className="calendar-leyenda">
        <div className="leyenda-item">
          <div className="leyenda-color" style={{ backgroundColor: '#FFA726' }}></div>
          <span>Pendiente</span>
        </div>
        <div className="leyenda-item">
          <div className="leyenda-color" style={{ backgroundColor: '#42A5F5' }}></div>
          <span>Confirmada</span>
        </div>
        <div className="leyenda-item">
          <div className="leyenda-color" style={{ backgroundColor: '#66BB6A' }}></div>
          <span>Realizada</span>
        </div>
        <div className="leyenda-item">
          <div className="leyenda-color" style={{ backgroundColor: '#EF5350' }}></div>
          <span>Cancelada</span>
        </div>
      </div>

      {/* Calendario */}
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 420px)', minHeight: '500px' }}
          view={view}
          onView={handleChangeView}
          date={date}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          popup
          eventPropGetter={eventStyleGetter}
          messages={{
            today: 'Hoy',
            previous: 'Anterior',
            next: 'Siguiente',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'No hay eventos en este rango',
          }}
          views={['month', 'week', 'day', 'agenda']}
        />
      </div>

      {/* Modal de evento */}
      {modalAbierto && eventSeleccionado && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del evento</h2>
              <button className="btn-cerrar" onClick={() => setModalAbierto(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="detalle-item">
                <label>Evento:</label>
                <p>{eventSeleccionado.title}</p>
              </div>

              <div className="detalle-item">
                <label>Fecha:</label>
                <p>{format(eventSeleccionado.start, "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
              </div>

              <div className="detalle-item">
                <label>Hora:</label>
                <p>
                  {format(eventSeleccionado.start, 'HH:mm')} - {format(eventSeleccionado.end, 'HH:mm')}
                </p>
              </div>

              {eventSeleccionado.resource?.estado && (
                <div className="detalle-item">
                  <label>Estado:</label>
                  <span className={`estado-badge estado-${eventSeleccionado.resource.estado.toLowerCase()}`}>
                    {eventSeleccionado.resource.estado}
                  </span>
                </div>
              )}

              {eventSeleccionado.resource?.notas && (
                <div className="detalle-item">
                  <label>Notas:</label>
                  <p>{eventSeleccionado.resource.notas}</p>
                </div>
              )}

              <div className="detalle-item">
                <label>Cliente:</label>
                <p>{clientes.find(c => c.id === eventSeleccionado.clienteId)?.nombre || 'Desconocido'}</p>
              </div>

              <div className="detalle-item">
                <label>Finca:</label>
                <p>{fincas.find(f => f.id === eventSeleccionado.fincaId)?.nombre || 'Desconocida'}</p>
              </div>

              {eventSeleccionado.type === 'visita' && eventSeleccionado.visitaId && (
                <button
                  className="btn-ir-visita"
                  onClick={() => {
                    window.location.href = '/visitas';
                  }}
                >
                  Ir a Visitas
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};