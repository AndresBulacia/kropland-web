import { useState, useEffect } from 'react';
import { type Cliente, type FiltrosCliente } from '../types';

const STORAGE_KEY = 'kropland_clientes';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar clientes del localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setClientes(parsed);
      } else {
        // Datos de ejemplo para desarrollo
        const clientesEjemplo: Cliente[] = [
          {
            id: '1',
            nombre: 'Juan',
            apellidos: 'García Martínez',
            dni: '12345678A',
            telefono: '600123456',
            email: 'juan.garcia@email.com',
            poblacion: 'Ciudad Real',
            provincia: 'Ciudad Real',
            comunidadAutonoma: 'Castilla-La Mancha',
            codigoPostal: '13001',
            direccion: 'Calle Principal 123',
            notas: 'Cliente desde 2020',
            fechaAlta: '2020-01-15',
            activo: true
          },
          {
            id: '2',
            nombre: 'María',
            apellidos: 'López Sánchez',
            dni: '87654321B',
            telefono: '600234567',
            email: 'maria.lopez@email.com',
            poblacion: 'Jaén',
            provincia: 'Jaén',
            comunidadAutonoma: 'Andalucía',
            codigoPostal: '23001',
            direccion: 'Avenida Andalucía 45',
            fechaAlta: '2021-03-20',
            activo: true
          },
          {
            id: '3',
            nombre: 'Pedro',
            apellidos: 'Fernández Ruiz',
            dni: '11223344C',
            telefono: '600345678',
            email: 'pedro.fernandez@email.com',
            poblacion: 'Córdoba',
            provincia: 'Córdoba',
            comunidadAutonoma: 'Andalucía',
            codigoPostal: '14001',
            notas: 'Prefiere comunicación por email',
            fechaAlta: '2019-11-10',
            activo: true
          }
        ];
        setClientes(clientesEjemplo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clientesEjemplo));
      }
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Guardar en localStorage cuando cambian los clientes
  const saveToStorage = (clientesActualizados: Cliente[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clientesActualizados));
      setClientes(clientesActualizados);
    } catch (err) {
      setError('Error al guardar los cambios');
      console.error(err);
    }
  };

  // Crear cliente
  const crearCliente = (nuevoCliente: Omit<Cliente, 'id' | 'fechaAlta'>) => {
    const cliente: Cliente = {
      ...nuevoCliente,
      id: Date.now().toString(),
      fechaAlta: new Date().toISOString().split('T')[0],
    };
    
    const clientesActualizados = [...clientes, cliente];
    saveToStorage(clientesActualizados);
    return cliente;
  };

  // Actualizar cliente
  const actualizarCliente = (id: string, datosActualizados: Partial<Cliente>) => {
    const clientesActualizados = clientes.map(cliente =>
      cliente.id === id ? { ...cliente, ...datosActualizados } : cliente
    );
    saveToStorage(clientesActualizados);
  };

  // Eliminar cliente
  const eliminarCliente = (id: string) => {
    const clientesActualizados = clientes.filter(cliente => cliente.id !== id);
    saveToStorage(clientesActualizados);
  };

  // Obtener cliente por ID
  const obtenerCliente = (id: string): Cliente | undefined => {
    return clientes.find(cliente => cliente.id === id);
  };

  // Filtrar clientes
  const filtrarClientes = (filtros: FiltrosCliente): Cliente[] => {
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
  };

  // Importar desde CSV
  const importarDesdeCSV = (csvData: string): { exito: number; errores: number } => {
    try {
      const lineas = csvData.split('\n');
      const clientesNuevos: Cliente[] = [];
      let errores = 0;

      // Saltar la primera línea (headers)
      for (let i = 1; i < lineas.length; i++) {
        const linea = lineas[i].trim();
        if (!linea) continue;

        const columnas = linea.split(',').map(col => col.trim());
        
        if (columnas.length >= 7) {
          try {
            const cliente: Cliente = {
              id: Date.now().toString() + i,
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
        saveToStorage(clientesActualizados);
      }

      return { exito: clientesNuevos.length, errores };
    } catch (err) {
      console.error('Error al importar CSV:', err);
      return { exito: 0, errores: 1 };
    }
  };

  return {
    clientes,
    loading,
    error,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerCliente,
    filtrarClientes,
    importarDesdeCSV
  };
};