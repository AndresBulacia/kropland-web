import type { Cliente, Finca, Visita } from '../types';

const MOCK_DATA = {
  clientes: [
    {
      id: '1',
      tipoCliente: 'Particular',
      nombre: 'José',
      apellidos: 'Hernandez',
      dni: '12345678A',
      telefono: '123456789',
      email: 'jose@example.com',
      poblacion: 'Sevilla',
      provincia: 'Sevilla',
      comunidadAutonoma: 'Andalucía',
      codigoPostal: '41001',
      direccion: 'Calle Principal, 123',
      notas: 'Cliente prioritario',
      tecnicoAsignado: 'Raquel Romero Peces',
      fechaAlta: new Date().toISOString(),
      activo: true,
      tipo: 'Activo',
    },
    {
      id: '2',
      tipoCliente: 'Empresa',
      nombre: 'Agrícola Los Olivos S.L.',
      dni: 'B12345678',
      telefono: '987654321',
      email: 'info@agricolaolivos.com',
      poblacion: 'Córdoba',
      provincia: 'Córdoba',
      comunidadAutonoma: 'Andalucía',
      codigoPostal: '14001',
      direccion: 'Polígono Industrial, Nave 5',
      tecnicoAsignado: 'Juan Jose Vilar Llido',
      fechaAlta: new Date().toISOString(),
      activo: true,
      tipo: 'Activo',
    },
    {
      id: '3',
      tipoCliente: 'Empresa',
      nombre: 'Citricola Las Naranjas S.L.',
      dni: '34567890C',
      telefono: '555666777',
      email: 'carlos@example.com',
      poblacion: 'Barcelona',
      provincia: 'Barcelona',
      comunidadAutonoma: 'Cataluña',
      codigoPostal: '2000',
      direccion: 'Calle cataluña 890',
      tecnicoAsignado: 'Javier Lengua Alvaro',
      fechaAlta: new Date().toISOString(),
      activo: true,
      tipo: 'Potencial',
    },
    {
      id: '4',
      tipoCliente: 'Particular',
      nombre: 'Ana',
      apellidos: 'García',
      dni: '45678901D',
      telefono: '111222333',
      email: 'ana@example.com',
      poblacion: 'Madrid',
      provincia: 'Madrid',
      comunidadAutonoma: 'Comunidad de Madrid',
      codigoPostal: '5500',
      direccion: 'Av. España 234',
      tecnicoAsignado: 'Daniel Gonzalez Romera',
      fechaAlta: new Date().toISOString(),
      activo: true,
      tipo: 'Potencial',
    },
    {
      id: '5',
      tipoCliente: 'Particular',
      nombre: 'Juan',
      apellidos: 'Pérez',
      dni: '56789012E',
      telefono: '444555666',
      email: 'juan@example.com',
      poblacion: 'Valencia',
      provincia: 'Valencia',
      comunidadAutonoma: 'País Vasco',
      codigoPostal: '3300',
      direccion: 'Ruta Nacional 12 Km 45',
      tecnicoAsignado: 'Javier Lengua Alvaro',
      fechaAlta: new Date().toISOString(),
      activo: true,
      tipo: 'Activo',
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
      tecnicoAsignado: 'Raquel Romero Peces',
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
      tecnicoAsignado: 'Juan Jose Vilar Llido',
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
      tecnicoAsignado: 'Javier Lengua Alvaro',
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
      tecnicoAsignado: 'Daniel Gonzalez Romera',
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
      tecnicoAsignado: 'Javier Lengua Alvaro',
      activa: true,
    },
  ] as Finca[],

  visitas: [
    {
      id: '1',
      clienteId: '1',
      fincaId: '1',
      fecha: new Date('2025-11-22').toISOString(),
      duracionMinutos: 120,
      tecnicoId: '1',
      estado: 'Confirmada',
      observaciones: 'Revisión del sistema de riego. Se detectaron algunas boquillas obstruidas en el sector 3.',
      actividadesRealizadas: ['Inspección', 'Mantenimiento'],
      climaObservado: 'Soleado, 22°C',
      estadoCultivo: 'Buen desarrollo vegetativo',
      notas: 'Cliente solicita presupuesto para renovación de filtros',
      fechaCreacion: new Date('2025-11-15').toISOString(),
    },
    {
      id: '2',
      clienteId: '2',
      fincaId: '3',
      fecha: new Date('2025-11-25').toISOString(),
      duracionMinutos: 90,
      tecnicoId: '1',
      estado: 'Pendiente',
      observaciones: 'Visita programada para evaluación de tratamiento preventivo',
      actividadesRealizadas: [],
      fechaCreacion: new Date('2025-11-18').toISOString(),
    },
    {
      id: '3',
      clienteId: '3',
      fincaId: '4',
      fecha: new Date('2025-11-20').toISOString(),
      duracionMinutos: 150,
      tecnicoId: '2',
      estado: 'Realizada',
      observaciones: 'Aplicación de tratamiento contra mosca del olivo. Se realizó pulverización completa del sector norte.',
      actividadesRealizadas: ['Pulverización', 'Tratamiento'],
      climaObservado: 'Nublado, 18°C, sin viento',
      estadoCultivo: 'Presencia leve de mosca en trampas',
      plagasDetectadas: 'Mosca del olivo (Bactrocera oleae) - nivel bajo',
      recomendaciones: 'Repetir tratamiento en 15 días si persiste actividad en trampas',
      productosAplicados: [
        {
          tipo: 'Fitosanitario',
          nombre: 'Lambda Cihalotrin 2.5%',
          dosis: '0.3',
          unidad: 'L/ha'
        }
      ],
      fechaCreacion: new Date('2025-11-19').toISOString(),
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