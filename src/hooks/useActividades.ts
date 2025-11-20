import { useState, useEffect } from 'react';
import type { Actividad, TipoActividad } from '../types';

const STORAGE_KEY = 'kropland_actividades';

export const useActividades = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setActividades(parsed);
      } else {
        // Datos de ejemplo
        const actividadesEjemplo: Actividad[] = [
          {
            id: '1',
            fincaId: '1',
            tipo: 'Poda',
            descripcion: 'Poda de formación en olivos',
            fecha: '2025-10-15',
            costoTotal: 450,
            costoPorHa: 36,
            responsable: 'Técnico Agrónomo',
            estado: 'Completada',
            fechaCreacion: '2025-10-15'
          },
          {
            id: '2',
            fincaId: '1',
            tipo: 'Pulverización',
            descripcion: 'Tratamiento fitosanitario preventivo',
            fecha: '2025-11-05',
            costoTotal: 280,
            costoPorHa: 22.4,
            responsable: 'María López',
            productos: [
              {
                nombre: 'Cobre',
                dosis: '200',
                unidad: 'gr/hl',
                plazoSeguridad: 21,
                tipo: 'Fitosanitario'
              }
            ],
            estado: 'Completada',
            fechaCreacion: '2025-11-05'
          },
          {
            id: '3',
            fincaId: '2',
            tipo: 'Riego',
            descripcion: 'Riego de apoyo',
            fecha: '2025-11-10',
            costoTotal: 120,
            costoPorHa: 14.5,
            estado: 'Completada',
            fechaCreacion: '2025-11-10'
          }
        ];
        setActividades(actividadesEjemplo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(actividadesEjemplo));
      }
    } catch (err) {
      setError('Error al cargar las actividades');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = (actividadesActualizadas: Actividad[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(actividadesActualizadas));
      setActividades(actividadesActualizadas);
    } catch (err) {
      setError('Error al guardar los cambios');
      console.error(err);
    }
  };

  const crearActividad = (nuevaActividad: Omit<Actividad, 'id' | 'fechaCreacion' | 'costoPorHa'>, superficieFinca: number) => {
    const costoPorHa = superficieFinca > 0 ? nuevaActividad.costoTotal / superficieFinca : 0;
    
    const actividad: Actividad = {
      ...nuevaActividad,
      id: Date.now().toString(),
      costoPorHa: Math.round(costoPorHa * 100) / 100,
      fechaCreacion: new Date().toISOString().split('T')[0],
    };
    
    const actividadesActualizadas = [...actividades, actividad];
    saveToStorage(actividadesActualizadas);
    return actividad;
  };

  const actualizarActividad = (id: string, datosActualizados: Partial<Actividad>) => {
    const actividadesActualizadas = actividades.map(actividad =>
      actividad.id === id ? { ...actividad, ...datosActualizados } : actividad
    );
    saveToStorage(actividadesActualizadas);
  };

  const eliminarActividad = (id: string) => {
    const actividadesActualizadas = actividades.filter(actividad => actividad.id !== id);
    saveToStorage(actividadesActualizadas);
  };

  const obtenerActividad = (id: string): Actividad | undefined => {
    return actividades.find(actividad => actividad.id === id);
  };

  const obtenerActividadesPorFinca = (fincaId: string): Actividad[] => {
    return actividades
      .filter(actividad => actividad.fincaId === fincaId)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  };

  const calcularCostosTotales = (fincaId: string) => {
    const actividadesFinca = actividades.filter(a => a.fincaId === fincaId);
    const total = actividadesFinca.reduce((sum, a) => sum + a.costoTotal, 0);
    
    const porTipo: { [key in TipoActividad]?: number } = {};
    actividadesFinca.forEach(a => {
      porTipo[a.tipo] = (porTipo[a.tipo] || 0) + a.costoTotal;
    });

    return { total, porTipo };
  };

  const obtenerActividadesPorMes = (fincaId: string, año: number, mes: number): Actividad[] => {
    return actividades.filter(a => {
      if (a.fincaId !== fincaId) return false;
      const fecha = new Date(a.fecha);
      return fecha.getFullYear() === año && fecha.getMonth() === mes;
    });
  };

  return {
    actividades,
    loading,
    error,
    crearActividad,
    actualizarActividad,
    eliminarActividad,
    obtenerActividad,
    obtenerActividadesPorFinca,
    calcularCostosTotales,
    obtenerActividadesPorMes
  };
};