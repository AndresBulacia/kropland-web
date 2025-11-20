import { useCallback, useEffect, useState } from 'react';
import { addToSyncQueue, deleteItem, getData, initDB, putItem, saveData } from '../lib/db';
import { DEMO_FINCAS } from '../lib/demoData';
import type { Finca, FiltrosFinca } from '../types';

const STORAGE_KEY = 'kropland_fincas';

const persistUIFallback = (fincasActualizadas: Finca[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fincasActualizadas));
};

export const useFincas = () => {
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const cargarFincas = async () => {
      try {
        setLoading(true);
        await initDB();
        let data = await getData('fincas');

        if (data.length === 0) {
          data = DEMO_FINCAS;
          await saveData('fincas', data);
        }

        if (mounted) {
          setFincas(data);
          persistUIFallback(data);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError('Error al cargar las fincas');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void cargarFincas();

    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (fincasActualizadas: Finca[]) => {
    await saveData('fincas', fincasActualizadas);
    setFincas(fincasActualizadas);
    persistUIFallback(fincasActualizadas);
  }, []);

  const crearFinca = useCallback(async (nuevaFinca: Omit<Finca, 'id' | 'fechaCreacion'>) => {
    const finca: Finca = {
      ...nuevaFinca,
      id: crypto.randomUUID(),
      fechaCreacion: new Date().toISOString().split('T')[0],
    };
    
    const fincasActualizadas = [...fincas, finca];
    await persist(fincasActualizadas);
    await putItem('fincas', finca);

    if (!navigator.onLine) {
      await addToSyncQueue('create', 'fincas', finca);
    }

    return finca;
  }, [fincas, persist]);

  const actualizarFinca = useCallback(async (id: string, datosActualizados: Partial<Finca>) => {
    const fincasActualizadas = fincas.map(finca =>
      finca.id === id ? { ...finca, ...datosActualizados } : finca
    );

    await persist(fincasActualizadas);

    const fincaActualizada = fincasActualizadas.find(f => f.id === id);
    if (fincaActualizada) {
      await putItem('fincas', fincaActualizada);
    }

    if (!navigator.onLine) {
      await addToSyncQueue('update', 'fincas', { id, cambios: datosActualizados });
    }
  }, [fincas, persist]);

  const eliminarFinca = useCallback(async (id: string) => {
    const fincasActualizadas = fincas.filter(finca => finca.id !== id);

    await persist(fincasActualizadas);
    await deleteItem('fincas', id);

    if (!navigator.onLine) {
      await addToSyncQueue('delete', 'fincas', { id });
    }
  }, [fincas, persist]);

  const obtenerFinca = useCallback((id: string): Finca | undefined => {
    return fincas.find(finca => finca.id === id);
  }, [fincas]);

  const obtenerFincasPorCliente = useCallback((clienteId: string): Finca[] => {
    return fincas.filter(finca => finca.clienteId === clienteId);
  
  }, [fincas]);

  const filtrarFincas = useCallback((filtros: FiltrosFinca): Finca[] => {
    let resultado = [...fincas];

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(finca =>
        finca.nombre.toLowerCase().includes(busqueda) ||
        finca.cultivo.toLowerCase().includes(busqueda) ||
        finca.variedad.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.cultivo) {
      resultado = resultado.filter(finca => finca.cultivo === filtros.cultivo);
    }

    if (filtros.tipoRiego) {
      resultado = resultado.filter(finca => finca.tipoRiego === filtros.tipoRiego);
    }

    if (filtros.superficieMin !== undefined) {
      resultado = resultado.filter(finca => finca.superficie >= filtros.superficieMin!);
    }

    if (filtros.superficieMax !== undefined) {
      resultado = resultado.filter(finca => finca.superficie <= filtros.superficieMax!);
    }

    return resultado;
  }, [fincas]);

  const calcularSuperficieTotal = useCallback((clienteId?: string): number => {
    const fincasACalcular = clienteId
      ? fincas.filter(f => f.clienteId === clienteId)
      : fincas;
    
    return fincasACalcular.reduce((total, finca) => total + finca.superficie, 0);
  }, [fincas]);

  return {
    fincas,
    loading,
    error,
    crearFinca,
    actualizarFinca,
    eliminarFinca,
    obtenerFinca,
    obtenerFincasPorCliente,
    filtrarFincas,
    calcularSuperficieTotal
  };
};