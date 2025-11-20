import type { Cliente, Finca, Visita } from '../types';

// Datos demo realistas
const MOCK_DATA = {
  clientes: [
    { id: '1', nombre: 'José Anastasi', email: 'jose@example.com', telefono: '123456789', rol: 'productor', createdAt: new Date().toISOString() },
    { id: '2', nombre: 'María López', email: 'maria@example.com', telefono: '987654321', rol: 'productor', createdAt: new Date().toISOString() },
    { id: '3', nombre: 'Carlos Ruiz', email: 'carlos@example.com', telefono: '555666777', rol: 'productor', createdAt: new Date().toISOString() },
    { id: '4', nombre: 'Ana García', email: 'ana@example.com', telefono: '111222333', rol: 'productor', createdAt: new Date().toISOString() },
    { id: '5', nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '444555666', rol: 'productor', createdAt: new Date().toISOString() },
  ] as Cliente[],
  
  fincas: [
    { id: '1', nombre: 'Finca El Paraíso', clienteId: '1', cultivo: 'Maíz', hectareas: 150, ubicacion: 'Buenos Aires', createdAt: new Date().toISOString() },
    { id: '2', nombre: 'Finca Los Andes', clienteId: '2', cultivo: 'Soja', hectareas: 200, ubicacion: 'Córdoba', createdAt: new Date().toISOString() },
    { id: '3', nombre: 'Finca Verde', clienteId: '3', cultivo: 'Trigo', hectareas: 100, ubicacion: 'Entre Ríos', createdAt: new Date().toISOString() },
    { id: '4', nombre: 'Finca Esperanza', clienteId: '4', cultivo: 'Girasol', hectareas: 120, ubicacion: 'La Pampa', createdAt: new Date().toISOString() },
    { id: '5', nombre: 'Finca Dorada', clienteId: '5', cultivo: 'Algodón', hectareas: 180, ubicacion: 'Misiones', createdAt: new Date().toISOString() },
  ] as Finca[],
  
  visitas: [
    { id: '1', clienteId: '1', fincaId: '1', fecha: new Date().toISOString(), estado: 'Realizada', nota: 'Revisar riego', tecnico: 'Admin', createdAt: new Date().toISOString() },
    { id: '2', clienteId: '2', fincaId: '2', fecha: new Date(Date.now() + 86400000).toISOString(), estado: 'Confirmada', nota: 'Análisis de suelo', tecnico: 'Admin', createdAt: new Date().toISOString() },
    { id: '3', clienteId: '3', fincaId: '3', fecha: new Date(Date.now() - 86400000).toISOString(), estado: 'Realizada', nota: 'Control de plagas', tecnico: 'Admin', createdAt: new Date().toISOString() },
  ] as Visita[],
};

// Simular delay de red
const NETWORK_DELAY = 300; // ms

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simular errores ocasionales
const maybeError = () => {
  if (Math.random() > 0.95) {
    throw new Error('Simulated network error');
  }
};

// API Endpoints
export const mockApi = {
  // CLIENTES
  getClientes: async (): Promise<Cliente[]> => {
    await delay(NETWORK_DELAY);
    maybeError();
    return MOCK_DATA.clientes;
  },

  getCliente: async (id: string): Promise<Cliente | null> => {
    await delay(NETWORK_DELAY);
    maybeError();
    return MOCK_DATA.clientes.find(c => c.id === id) || null;
  },

  createCliente: async (data: Omit<Cliente, 'id' | 'createdAt'>): Promise<Cliente> => {
    await delay(NETWORK_DELAY);
    maybeError();
    const newCliente: Cliente = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    MOCK_DATA.clientes.push(newCliente);
    console.log('✅ Cliente creado en servidor:', newCliente);
    return newCliente;
  },

  updateCliente: async (id: string, data: Partial<Cliente>): Promise<Cliente> => {
    await delay(NETWORK_DELAY);
    maybeError();
    const index = MOCK_DATA.clientes.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Cliente no encontrado');
    MOCK_DATA.clientes[index] = { ...MOCK_DATA.clientes[index], ...data };
    console.log('✅ Cliente actualizado en servidor:', MOCK_DATA.clientes[index]);
    return MOCK_DATA.clientes[index];
  },

  deleteCliente: async (id: string): Promise<void> => {
    await delay(NETWORK_DELAY);
    maybeError();
    const index = MOCK_DATA.clientes.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Cliente no encontrado');
    MOCK_DATA.clientes.splice(index, 1);
    console.log('✅ Cliente eliminado del servidor:', id);
  },

  // FINCAS
  getFincas: async (): Promise<Finca[]> => {
    await delay(NETWORK_DELAY);
    maybeError();
    return MOCK_DATA.fincas;
  },

  getFinca: async (id: string): Promise<Finca | null> => {
    await delay(NETWORK_DELAY);
    maybeError();
    return MOCK_DATA.fincas.find(f => f.id === id) || null;
  },

  createFinca: async (data: Omit<Finca, 'id' | 'createdAt'>): Promise<Finca> => {
    await delay(NETWORK_DELAY);
    maybeError();
    const newFinca: Finca = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    MOCK_DATA.fincas.push(newFinca);
    console.log('✅ Finca creada en servidor:', newFinca);
    return newFinca;
  },

  updateFinca: async (id: string, data: Partial<Finca>): Promise<Finca> => {
    await delay(NETWORK_DELAY);
    maybeError();
    const index = MOCK_DATA.fincas.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Finca no encontrada');
    MOCK_DATA.fincas[index] = { ...MOCK_DATA.fincas[index], ...data };
    console.log('✅ Finca actualizada en servidor:', MOCK_DATA.fincas[index]);
    return MOCK_DATA.fincas[index];
  },

  deleteFinca: async (id: string): Promise<void> => {
    await delay(NETWORK_DELAY);
    maybeError();
    const index = MOCK_DATA.fincas.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Finca no encontrada');
    MOCK_DATA.fincas.splice(index, 1);
    console.log('✅ Finca eliminada del servidor:', id);
  },

  // VISITAS
  getVisitas: async (): Promise<Visita[]> => {
    await delay(NETWORK_DELAY);
    maybeError();
    return MOCK_DATA.visitas;
  },

  getVisita: async (id: string): Promise<Visita | null> => {
    await delay(NETWORK_DELAY);
    maybeError();
    return MOCK_DATA.visitas.find(v => v.id === id) || null;
  },

  createVisita: async (data: Omit<Visita, 'id' | 'createdAt'>): Promise<Visita> => {
    await delay(NETWORK_DELAY);
    maybeError();
    const newVisita: Visita = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    MOCK_DATA.visitas.push(newVisita);
    console.log('✅ Visita creada en servidor:', newVisita);
    return newVisita;
  },

  updateVisita: async (id: string, data: Partial<Visita>): Promise<Visita> => {
    await delay(NETWORK_DELAY);
    maybeError();
    const index = MOCK_DATA.visitas.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Visita no encontrada');
    MOCK_DATA.visitas[index] = { ...MOCK_DATA.visitas[index], ...data };
    console.log('✅ Visita actualizada en servidor:', MOCK_DATA.visitas[index]);
    return MOCK_DATA.visitas[index];
  },

  deleteVisita: async (id: string): Promise<void> => {
    await delay(NETWORK_DELAY);
    maybeError();
    const index = MOCK_DATA.visitas.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Visita no encontrada');
    MOCK_DATA.visitas.splice(index, 1);
    console.log('✅ Visita eliminada del servidor:', id);
  },
};

export default mockApi;