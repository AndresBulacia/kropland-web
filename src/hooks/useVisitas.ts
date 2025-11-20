import { useCallback, useEffect, useState } from 'react';
import { addToSyncQueue, deleteItem, getData, initDB, putItem, saveData } from '../lib/db';
import { DEMO_VISITAS } from '../lib/demoData';
import type { Visita, FiltrosVisita } from '../types';

const STORAGE_KEY = 'kropland_visitas';

const persistUIFallback = (visitasActualizadas: Visita[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visitasActualizadas));
};

export const useVisitas = () => {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar desde localStorage
  useEffect(() => {
    let mounted = true;

    const cargarVisitas = async () => {
      try {
        setLoading(true);
        await initDB();
        let data = await getData('visitas');

        if (data.length === 0) {
          data = DEMO_VISITAS;
          await saveData('visitas', data);
        }

        if (mounted) {
          setVisitas(data);
          persistUIFallback(data);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError('Error al cargar visitas');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void cargarVisitas();

    return () => {
      mounted = false;
    };
  }, []);

  // Guardar en localStorage
  const persist = useCallback(async (visitasActualizadas: Visita[]) => {
    await saveData('visitas', visitasActualizadas);
    setVisitas(visitasActualizadas);
    persistUIFallback(visitasActualizadas);
  }, []);

  // Crear visita
  const crearVisita = useCallback(async (visita: Omit<Visita, 'id' | 'fechaCreacion'>) => {
    const nuevaVisita: Visita = {
      ...visita,

      id: crypto.randomUUID(),
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    const actualizadas = [...visitas, nuevaVisita];
    await persist(actualizadas);
    await putItem('visitas', nuevaVisita);

    if (!navigator.onLine) {
      await addToSyncQueue('create', 'visitas', nuevaVisita);
    }

    return nuevaVisita;
  }, [visitas, persist]);

  // Actualizar visita
  const actualizarVisita = useCallback(async (id: string, datos: Partial<Visita>) => {
    const actualizado = visitas.map(v => v.id === id ? { ...v, ...datos } : v);
    await persist(actualizado);

  // Eliminar visita
    const visitaActualizada = actualizado.find(v => v.id === id);
    if (visitaActualizada) {
      await putItem('visitas', visitaActualizada);
    }

  // Cambiar estado de visita
    if (!navigator.onLine) {
      await addToSyncQueue('update', 'visitas', { id, cambios: datos });
    }
  }, [visitas, persist]);

  // Filtrar visitas
  const eliminarVisita = useCallback(async (id: string) => {
    const actualizadas = visitas.filter(v => v.id !== id);
    await persist(actualizadas);
    await deleteItem('visitas', id);

    if (!navigator.onLine) {
      await addToSyncQueue('delete', 'visitas', { id });
    }
  }, [visitas, persist]);

  const cambiarEstado = useCallback(async (id: string, estado: Visita['estado']) => {
    await actualizarVisita(id, { estado });
  }, [actualizarVisita]);

  const filtrarVisitas = useCallback((filtros: FiltrosVisita) => {
    return visitas.filter(v => {
      // Por cliente
      if (filtros.cliente && v.clienteId !== filtros.cliente) return false;
      // Por finca
      if (filtros.finca && v.fincaId !== filtros.fincaId) return false;
      // Por técnico
      if (filtros.tecnico && v.tecnicoId !== filtros.tecnico) return false;
      // Por estado
      if (filtros.estado && v.estado !== filtros.estado) return false;
      // Por rango de fechas
      if (filtros.fechaDesde && v.fecha < filtros.fechaDesde) return false;
      if (filtros.fechaHasta && v.fecha > filtros.fechaHasta) return false;
      return true;
    });
  }, [visitas]);

  // Obtener visitas por cliente
  const obtenerPorCliente = useCallback((clienteId: string) => {
    return visitas.filter(v => v.clienteId === clienteId);
  }, [visitas]);

  // Obtener visitas por finca
  const obtenerPorFinca = useCallback((fincaId: string) => {
    return visitas.filter(v => v.fincaId === fincaId);
  }, [visitas]);

  // Obtener visitas por técnico
  const obtenerPorTecnico = useCallback((tecnicoId: string) => {
    return visitas.filter(v => v.tecnicoId === tecnicoId);
  }, [visitas]);

  // Obtener visitas proximas
  const obtenerProximas = useCallback((dias: number = 30) => {
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
  }, [visitas]);

  // Obtener visitas realizadas
  const obtenerRealizadas = useCallback(() => {
    return visitas.filter(v => v.estado === 'Realizada');
  }, [visitas]);

  // Obtener visitas pendientes
  const obtenerPendientes = useCallback(() => {
    return visitas.filter(v => v.estado === 'Pendiente');
  }, [visitas]);

  // Buscar visitas
  const buscar = useCallback((termino: string) => {
    const terminoLower = termino.toLowerCase();
    return visitas.filter(v =>
      (v.notas || '').toLowerCase().includes(terminoLower) ||
      v.estado.toLowerCase().includes(terminoLower)
    );
  }, [visitas]);

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