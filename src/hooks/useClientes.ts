import { useCallback, useEffect, useState } from 'react';
import { addToSyncQueue, deleteItem, getData, initDB, putItem, saveData } from '../lib/db';
import { DEMO_CLIENTES } from '../lib/demoData';
import { type Cliente, type FiltrosCliente } from '../types';

const STORAGE_KEY = 'kropland_clientes';

const persistUIFallback = (clientesActualizados: Cliente[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clientesActualizados));
};

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const cargarClientes = async () => {
      try {
        setLoading(true);
        await initDB();
        let data = await getData('clientes');

        if (data.length === 0) {
          data = DEMO_CLIENTES;
          await saveData('clientes', data);
        }

        if (mounted) {
          setClientes(data);
          persistUIFallback(data);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError('Error al cargar los clientes');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void cargarClientes();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (clientesActualizados: Cliente[]) => {
    await saveData('clientes', clientesActualizados);
    persistUIFallback(clientesActualizados);
  }, []);

  const crearCliente = useCallback(async (nuevoCliente: Omit<Cliente, 'id' | 'fechaAlta'>) => {
    const cliente: Cliente = {
      ...nuevoCliente,
      id: crypto.randomUUID(),
      fechaAlta: new Date().toISOString().split('T')[0],
    };

    const clientesActualizados = [...clientes, cliente];
    await persist(clientesActualizados);
    await putItem('cliente', cliente);

    if (!navigator.onLine) {
      await addToSyncQueue('create', 'clientes', cliente);
    }
    return cliente;
  }, [clientes, persist]);

  // Actualizar cliente
  const actualizarCliente = useCallback(async (id: string, datosActualizados: Partial<Cliente>) => {
    const clientesActualizados = clientes.map(cliente => cliente.id === id ? {...cliente, ...datosActualizados}: cliente);

    await persist(clientesActualizados);

    const clienteActualizado = clientesActualizados.find(c => c.id === id);

    if (clienteActualizado) {
      await putItem('clientes', clienteActualizado);
    }

    if (!navigator.onLine) {
      await addToSyncQueue('update', 'clientes', {id, cambios: datosActualizados});
    }
  }, [clientes, persist]);


  // Eliminar cliente
  const eliminarCliente = useCallback(async (id: string) => {
    const clientesActualizados = clientes.filter(cliente => cliente.id === id);

    await persist(clientesActualizados);
    await deleteItem('clientes', id);

    if (!navigator.onLine) {
      await addToSyncQueue('delete', 'clientes', {id});
    }
  }, [clientes, persist]);

  // Obtener cliente por ID
  const obtenerCliente = useCallback((id: string): Cliente | undefined => {
    return clientes.find(cliente => cliente.id === id);
  }, [clientes]);

  // Filtrar clientes
  const filtrarClientes = useCallback((filtros: FiltrosCliente): Cliente[] => {
    let resultado = [...clientes];

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(cliente =>
        cliente.nombre.toLowerCase().includes(busqueda) ||
        cliente.apellidos.toLowerCase().includes(busqueda) ||
        cliente.dni.toLowerCase().includes(busqueda) ||
        cliente.email.toLowerCase().includes(busqueda) ||
        cliente.telefono.includes(busqueda)
      );
    }

    if (filtros.provincia) {
      resultado = resultado.filter(cliente =>
        cliente.provincia === filtros.provincia
      );
    }

    if (filtros.activo !== undefined) {
      resultado = resultado.filter(cliente => cliente.activo === filtros.activo);
    }

    return resultado;
  }, [clientes]);

  // Importar desde CSV
  const importarDesdeCSV = useCallback((csvData: string): { exito: number; errores: number } => {
    try {
      const lineas = csvData.split('\n');
      const clientesNuevos: Cliente[] = [];
      let errores = 0;

      for (let i = 1; i < lineas.length; i++) {
        const linea = lineas[i].trim();
        if (!linea) continue;

        const columnas = linea.split(',').map(col => col.trim());

        if (columnas.length >= 7) {
          try {
            const cliente: Cliente = {
              id: `${Date.now()}-${i}`,
              nombre: columnas[0],
              apellidos: columnas[1],
              dni: columnas[2],
              telefono: columnas[3],
              email: columnas[4],
              poblacion: columnas[5],
              provincia: columnas[6],
              comunidadAutonoma: columnas[7] || '',
              codigoPostal: columnas[8],
              direccion: columnas[9],
              notas: columnas[10],
              fechaAlta: new Date().toISOString().split('T')[0],
              activo: true
            };
            clientesNuevos.push(cliente);
          } catch {
            errores++;
          }
        } else {
          errores++;
        }
      }

      if (clientesNuevos.length > 0) {
        const clientesActualizados = [...clientes, ...clientesNuevos];
        void persist(clientesActualizados);
      }

      return { exito: clientesNuevos.length, errores };
    } catch (err) {
      console.error('Error al importar CSV:', err);
      return { exito: 0, errores: 1 };
    }
  }, [clientes, persist]);

  return {
    clientes,
    loading,
    error,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerCliente,
    filtrarClientes,
    importarDesdeCSV,
  };
};