import type { Cliente, Finca, Visita } from '../types';

export const DEMO_CLIENTES: Cliente[] = [
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
    activo: true,
    tipo: 'Activo'
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
    activo: true,
    tipo: 'Activo'
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
    activo: true,
    tipo: 'Potencial'
  }
];

export const DEMO_FINCAS: Finca[] = [
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

export const DEMO_VISITAS: Visita[] = [
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