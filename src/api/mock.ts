import type { Cliente, Finca, Visita } from '../types';

// Datos demo realistas con tipos correctos
const MOCK_DATA = {
  clientes: [
    {
      id: '1',
      nombre: 'José',
      apellidos: 'Anastasi',
      dni: '12345678A',
      telefono: '123456789',
      email: 'jose@example.com',
      poblacion: 'Buenos Aires',
      provincia: 'Buenos Aires',
      comunidadAutonoma: 'Buenos Aires',
      codigoPostal: '1000',
      direccion: 'Av. Corrientes 1234',
      notas: 'Cliente prioritario',
      fechaAlta: new Date().toISOString(),
      activo: true,
    },
    {
      id: '2',
      nombre: 'María',
      apellidos: 'López',
      dni: '23456789B',
      telefono: '987654321',
      email: 'maria@example.com',
      poblacion: 'Córdoba',
      provincia: 'Córdoba',
      comunidadAutonoma: 'Córdoba',
      codigoPostal: '5000',
      direccion: 'Av. San Martín 567',
      fechaAlta: new Date().toISOString(),
      activo: true,
    },
    {
      id: '3',
      nombre: 'Carlos',
      apellidos: 'Ruiz',
      dni: '34567890C',
      telefono: '555666777',
      email: 'carlos@example.com',
      poblacion: 'Rosario',
      provincia: 'Santa Fe',
      comunidadAutonoma: 'Santa Fe',
      codigoPostal: '2000',
      direccion: 'Calle Sarmiento 890',
      fechaAlta: new Date().toISOString(),
      activo: true,
    },
    {
      id: '4',
      nombre: 'Ana',
      apellidos: 'García',
      dni: '45678901D',
      telefono: '111222333',
      email: 'ana@example.com',
      poblacion: 'Mendoza',
      provincia: 'Mendoza',
      comunidadAutonoma: 'Mendoza',
      codigoPostal: '5500',
      direccion: 'Av. Las Heras 234',
      fechaAlta: new Date().toISOString(),
      activo: true,
    },
    {
      id: '5',
      nombre: 'Juan',
      apellidos: 'Pérez',
      dni: '56789012E',
      telefono: '444555666',
      email: 'juan@example.com',
      poblacion: 'Posadas',
      provincia: 'Misiones',
      comunidadAutonoma: 'Misiones',
      codigoPostal: '3300',
      direccion: 'Ruta Nacional 12 Km 45',
      fechaAlta: new Date().toISOString(),
      activo: true,
    },
  ] as Cliente[],

  fincas: [
    {
      id: '1',
      clienteId: '1',
      nombre: 'Finca El Paraíso',
      cultivo: 'Olivo',
      variedad: 'Arbequina',
      superficie: 150,
      volumenCaldoPorHa: 800,
      añoPlantacion: 2015,
      tipoRiego: 'Regadío',
      ubicacion: {
        direccion: 'Ruta 9 Km 123, Buenos Aires',
        latitud: -34.6037,
        longitud: -58.3816,
      },
      notas: 'Finca principal del cliente',
      fechaCreacion: new Date().toISOString(),
      activa: true,
    },
    {
      id: '2',
      clienteId: '2',
      nombre: 'Finca Los Andes',
      cultivo: 'Viña',
      variedad: 'Malbec',
      superficie: 200,
      volumenCaldoPorHa: 600,
      añoPlantacion: 2010,
      tipoRiego: 'Regadío',
      ubicacion: {
        direccion: 'Valle de Uco, Mendoza',
        latitud: -31.4201,
        longitud: -64.1888,
      },
      fechaCreacion: new Date().toISOString(),
      activa: true,
    },
    {
      id: '3',
      clienteId: '3',
      nombre: 'Finca Verde',
      cultivo: 'Almendro',
      variedad: 'Marcona',
      superficie: 100,
      volumenCaldoPorHa: 700,
      añoPlantacion: 2018,
      tipoRiego: 'Secano',
      ubicacion: {
        direccion: 'Entre Ríos',
        latitud: -31.7333,
        longitud: -60.5297,
      },
      fechaCreacion: new Date().toISOString(),
      activa: true,
    },
    {
      id: '4',
      clienteId: '4',
      nombre: 'Finca Esperanza',
      cultivo: 'Pistacho',
      variedad: 'Kerman',
      superficie: 120,
      volumenCaldoPorHa: 750,
      añoPlantacion: 2016,
      tipoRiego: 'Regadío',
      ubicacion: {
        direccion: 'La Pampa',
        latitud: -36.6167,
        longitud: -64.2833,
      },
      fechaCreacion: new Date().toISOString(),
      activa: true,
    },
    {
      id: '5',
      clienteId: '5',
      nombre: 'Finca Dorada',
      cultivo: 'Cítricos',
      variedad: 'Naranja Valencia',
      superficie: 180,
      volumenCaldoPorHa: 850,
      añoPlantacion: 2012,
      tipoRiego: 'Regadío',
      ubicacion: {
        direccion: 'Ruta 12, Misiones',
        latitud: -27.3671,
        longitud: -55.8969,
      },
      fechaCreacion: new Date().toISOString(),
      activa: true,
    },
  ] as Finca[],

  visitas: [
    {
      id: '1',
      clienteId: '1',
      fincaId: '1',
      tecnicoId: 'admin-1',
      fecha: new Date().toISOString(),
      estado: 'Realizada',
      notas: 'Revisar sistema de riego - todo funcionando correctamente',
      horaInicio: '09:00',
      horaFin: '11:30',
      duracionEstimada: 150,
      ubicacionGPS: {
        latitud: -34.6037,
        longitud: -58.3816,
      },
      clima: {
        temperatura: 22,
        humedad: 65,
        viento: 'Moderado del este',
      },
      fechaCreacion: new Date().toISOString(),
    },
    {
      id: '2',
      clienteId: '2',
      fincaId: '2',
      tecnicoId: 'admin-1',
      fecha: new Date(Date.now() + 86400000).toISOString(),
      estado: 'Confirmada',
      notas: 'Análisis de suelo programado - traer kit de muestras',
      horaInicio: '10:00',
      duracionEstimada: 120,
      fechaCreacion: new Date().toISOString(),
    },
    {
      id: '3',
      clienteId: '3',
      fincaId: '3',
      tecnicoId: 'admin-1',
      fecha: new Date(Date.now() - 86400000).toISOString(),
      estado: 'Realizada',
      notas: 'Control de plagas - se detectó presencia leve de mosca del olivo',
      horaInicio: '08:30',
      horaFin: '10:00',
      duracionEstimada: 90,
      tareasPendientes: [
        {
          id: '1',
          descripcion: 'Aplicar tratamiento preventivo',
          tipo: 'Pulverización',
          costo: 5500,
          fechaLimite: new Date(Date.now() + 7 * 86400000).toISOString(),
          completada: false,
        },
      ],
      fechaCreacion: new Date().toISOString(),
    },
  ] as Visita[],
};

// Simular delay de red
const NETWORK_DELAY = 300; // ms

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simular errores ocasionales (5% de probabilidad)
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

  createCliente: async (data: Omit<Cliente, 'id' | 'fechaAlta'>): Promise<Cliente> => {
    await delay(NETWORK_DELAY);
    maybeError();
    const newCliente: Cliente = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      fechaAlta: new Date().toISOString(),
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

  createFinca: async (data: Omit<Finca, 'id' | 'fechaCreacion'>): Promise<Finca> => {
    await delay(NETWORK_DELAY);
    maybeError();
    const newFinca: Finca = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      fechaCreacion: new Date().toISOString(),
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

  createVisita: async (data: Omit<Visita, 'id' | 'fechaCreacion'>): Promise<Visita> => {
    await delay(NETWORK_DELAY);
    maybeError();
    const newVisita: Visita = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      fechaCreacion: new Date().toISOString(),
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