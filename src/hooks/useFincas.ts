import { useState, useEffect } from 'react';
import type { Finca, FiltrosFinca } from '../types';

const STORAGE_KEY = 'kropland_fincas';

export const useFincas = () => {
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFincas(parsed);
      } else {
        // Datos de ejemplo
        const fincasEjemplo: Finca[] = [
          {
            id: '1',
            clienteId: '1',
            nombre: 'El Olivar',
            cultivo: 'Olivo',
            variedad: 'Picual',
            portainjerto: 'Frantoio',
            superficie: 12.5,
            volumenCaldoPorHa: 800,
            añoPlantacion: 2015,
            tipoRiego: 'Regadío',
            ubicacion: {
              direccion: 'Camino de la Vega, Ciudad Real',
              latitud: 38.9848,
              longitud: -3.9271
            },
            notas: 'Producción en ecológico',
            fechaCreacion: '2020-01-15',
            activa: true
          },
          {
            id: '2',
            clienteId: '2',
            nombre: 'Los Almendros',
            cultivo: 'Almendro',
            variedad: 'Guara',
            superficie: 8.3,
            volumenCaldoPorHa: 600,
            añoPlantacion: 2018,
            tipoRiego: 'Secano',
            ubicacion: {
              direccion: 'Paraje Las Lomas, Jaén',
              latitud: 37.7796,
              longitud: -3.7849
            },
            fechaCreacion: '2021-03-20',
            activa: true
          },
          {
            id: '3',
            clienteId: '3',
            nombre: 'La Viña Grande',
            cultivo: 'Viña',
            variedad: 'Tempranillo',
            portainjerto: 'R110',
            superficie: 5.2,
            volumenCaldoPorHa: 400,
            añoPlantacion: 2012,
            tipoRiego: 'Regadío',
            ubicacion: {
              direccion: 'Sierra de Córdoba',
              latitud: 37.8882,
              longitud: -4.7794
            },
            notas: 'DOC Montilla-Moriles',
            fechaCreacion: '2019-11-10',
            activa: true
          }
        ];
        setFincas(fincasEjemplo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fincasEjemplo));
      }
    } catch (err) {
      setError('Error al cargar las fincas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = (fincasActualizadas: Finca[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fincasActualizadas));
      setFincas(fincasActualizadas);
    } catch (err) {
      setError('Error al guardar los cambios');
      console.error(err);
    }
  };

  const crearFinca = (nuevaFinca: Omit<Finca, 'id' | 'fechaCreacion'>) => {
    const finca: Finca = {
      ...nuevaFinca,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString().split('T')[0],
    };
    
    const fincasActualizadas = [...fincas, finca];
    saveToStorage(fincasActualizadas);
    return finca;
  };

  const actualizarFinca = (id: string, datosActualizados: Partial<Finca>) => {
    const fincasActualizadas = fincas.map(finca =>
      finca.id === id ? { ...finca, ...datosActualizados } : finca
    );
    saveToStorage(fincasActualizadas);
  };

  const eliminarFinca = (id: string) => {
    const fincasActualizadas = fincas.filter(finca => finca.id !== id);
    saveToStorage(fincasActualizadas);
  };

  const obtenerFinca = (id: string): Finca | undefined => {
    return fincas.find(finca => finca.id === id);
  };

  const obtenerFincasPorCliente = (clienteId: string): Finca[] => {
    return fincas.filter(finca => finca.clienteId === clienteId);
  };

  const filtrarFincas = (filtros: FiltrosFinca): Finca[] => {
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
  };

  const calcularSuperficieTotal = (clienteId?: string): number => {
    const fincasACalcular = clienteId 
      ? fincas.filter(f => f.clienteId === clienteId)
      : fincas;
    
    return fincasACalcular.reduce((total, finca) => total + finca.superficie, 0);
  };

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