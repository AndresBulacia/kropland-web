import { useState, useEffect } from 'react';
import type { Visita, FiltrosVisita } from '../types';

const STORAGE_KEY = 'kropland_visitas';

export const useVisitas = () => {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setVisitas(JSON.parse(stored));
      } else {
        // Datos de ejemplo iniciales
        const visitasEjemplo: Visita[] = [
          {
            id: '1',
            clienteId: '1',
            fincaId: '1',
            tecnicoId: 'tecnico1',
            fecha: '2025-11-20',
            horaInicio: '16:00',
            estado: 'Confirmada',
            notas: 'Revisión general del olivar, evaluar necesidad de poda',
            duracionEstimada: 90,
            fechaCreacion: '2025-11-12'
          },
          {
            id: '2',
            clienteId: '2',
            fincaId: '2',
            tecnicoId: 'tecnico1',
            fecha: '2025-11-21',
            horaInicio: '10:00',
            estado: 'Pendiente',
            notas: 'Verificar estado de almendros tras última lluvia',
            duracionEstimada: 60,
            fechaCreacion: '2025-11-13'
          },
          {
            id: '3',
            clienteId: '3',
            fincaId: '3',
            tecnicoId: 'tecnico1',
            fecha: '2025-11-15',
            horaInicio: '11:30',
            horaFin: '13:00',
            estado: 'Realizada',
            notas: 'Inspección completa realizada. Todo correcto.',
            duracionEstimada: 90,
            fechaCreacion: '2025-11-10'
          }
        ];
        setVisitas(visitasEjemplo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visitasEjemplo));
      }
      setLoading(false);
    } catch (err) {
      setError('Error al cargar visitas');
      setLoading(false);
    }
  }, []);

  // Guardar en localStorage
  const guardarVisitas = (nuevasVisitas: Visita[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevasVisitas));
    setVisitas(nuevasVisitas);
  };

  // Crear visita
  const crearVisita = (visita: Omit<Visita, 'id' | 'fechaCreacion'>) => {
    const nuevaVisita: Visita = {
      ...visita,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    guardarVisitas([...visitas, nuevaVisita]);
    return nuevaVisita;
  };

  // Actualizar visita
  const actualizarVisita = (id: string, datos: Partial<Visita>) => {
    const actualizado = visitas.map(v => v.id === id ? { ...v, ...datos } : v);
    guardarVisitas(actualizado);
  };

  // Eliminar visita
  const eliminarVisita = (id: string) => {
    guardarVisitas(visitas.filter(v => v.id !== id));
  };

  // Cambiar estado de visita
  const cambiarEstado = (id: string, estado: Visita['estado']) => {
    actualizarVisita(id, { estado });
  };

  // Filtrar visitas
  const filtrarVisitas = (filtros: FiltrosVisita) => {
    return visitas.filter(v => {
      // Por cliente
      if (filtros.clienteId && v.clienteId !== filtros.clienteId) return false;
      // Por finca
      if (filtros.fincaId && v.fincaId !== filtros.fincaId) return false;
      // Por técnico
      if (filtros.tecnicoId && v.tecnicoId !== filtros.tecnicoId) return false;
      // Por estado
      if (filtros.estado && v.estado !== filtros.estado) return false;
      // Por rango de fechas
      if (filtros.fechaDesde && v.fecha < filtros.fechaDesde) return false;
      if (filtros.fechaHasta && v.fecha > filtros.fechaHasta) return false;
      return true;
    });
  };

  // Obtener visitas por cliente
  const obtenerPorCliente = (clienteId: string) => {
    return visitas.filter(v => v.clienteId === clienteId);
  };

  // Obtener visitas por finca
  const obtenerPorFinca = (fincaId: string) => {
    return visitas.filter(v => v.fincaId === fincaId);
  };

  // Obtener visitas por técnico
  const obtenerPorTecnico = (tecnicoId: string) => {
    return visitas.filter(v => v.tecnicoId === tecnicoId);
  };

  // Obtener visitas proximas
  const obtenerProximas = (dias: number = 30) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const limite = new Date(hoy.getTime() + dias * 24 * 60 * 60 * 1000);
    return visitas
      .filter(v => {
        const fecha = new Date(v.fecha);
        fecha.setHours(0, 0, 0, 0);
        return fecha >= hoy && fecha <= limite;
      })
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  };

  // Obtener visitas realizadas
  const obtenerRealizadas = () => {
    return visitas.filter(v => v.estado === 'Realizada');
  };

  // Obtener visitas pendientes
  const obtenerPendientes = () => {
    return visitas.filter(v => v.estado === 'Pendiente');
  };

  // Buscar visitas
  const buscar = (termino: string) => {
    const terminoLower = termino.toLowerCase();
    return visitas.filter(v =>
      v.notas.toLowerCase().includes(terminoLower) ||
      v.estado.toLowerCase().includes(terminoLower)
    );
  };

  return {
    visitas,
    loading,
    error,
    crearVisita,
    actualizarVisita,
    eliminarVisita,
    cambiarEstado,
    filtrarVisitas,
    obtenerPorCliente,
    obtenerPorFinca,
    obtenerPorTecnico,
    obtenerProximas,
    obtenerRealizadas,
    obtenerPendientes,
    buscar
  };
};