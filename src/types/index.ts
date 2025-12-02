// src/types/index.ts

export type RolUsuario = 'admin' | 'tecnico' | 'cliente';

export interface Usuario {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  rol: RolUsuario;
  password?: string;
  fechaCreacion: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  apellidos?: string;
  tipoCliente?: 'Particular' | 'Empresa';
  dni: string;
  telefono: string;
  email: string;
  poblacion: string;
  provincia: string;
  comunidadAutonoma: string;
  codigoPostal?: string;
  direccion?: string;
  notas?: string;
  tecnicoAsignado?: string;
  fechaAlta: string;
  activo: boolean;
  tipo: 'Activo' | 'Potencial';
}

export type TipoCultivo = 
  | 'Olivo'
  | 'Viña'
  | 'Almendro'
  | 'Pistacho'
  | 'Cítricos'
  | 'Cereal'
  | 'Hortícola'
  | 'Otro';

export type TipoRiego = 'Regadío' | 'Secano';

export interface Finca {
  id: string;
  clienteId: string;
  nombre: string;
  cultivo: TipoCultivo;
  variedad: string;
  portainjerto?: string;
  superficie: number;
  volumenCaldoPorHa?: number;
  añoPlantacion?: number;
  tipoRiego: TipoRiego;
  ubicacion: {
    direccion?: string;
    latitud?: number;
    longitud?: number;
  };
  notas?: string;
  fechaCreacion: string;
  activa: boolean;
  tecnicoAsignado?: string;
}

export type TipoActividad = 
  | 'Poda'
  | 'Pulverización'
  | 'Herbicida'
  | 'Recolección'
  | 'Abonado'
  | 'Riego'
  | 'Análisis'
  | 'Siembra'
  | 'Otro';

export interface Actividad {
  id: string;
  fincaId: string;
  tipo: TipoActividad;
  descripcion: string;
  fecha: string;
  costoTotal: number;
  costoPorHa?: number;
  responsable?: string;
  notas?: string;
  productos?: ProductoAplicado[];
  estado: 'Planificada' | 'En Proceso' | 'Completada' | 'Cancelada';
  fechaCreacion: string;
}

export interface ProductoAplicado {
  nombre: string;
  dosis: string;
  unidad: string;
  plazoSeguridad?: number;
  tipo: 'Fitosanitario' | 'Nutricional' | 'Herbicida' | 'Otro';
}

export interface Visita {
  id: string;
  clienteId: string;
  fincaId: string;
  tecnicoId: string;
  fecha: string;
  estado: 'Pendiente' | 'Confirmada' | 'Realizada' | 'Cancelada';
  notas?: string;
  imagenes?: string[];
  videos?: string[];
  tareasPendientes?: Tarea[];
  duracionEstimada?: number;
  horaInicio?: string;
  horaFin?: string;
  ubicacionGPS?: {
    latitud: number;
    longitud: number;
  };
  clima?: {
    temperatura?: number;
    humedad?: number;
    viento?: string;
  };
  fechaCreacion: string;
}

export interface Tarea {
  id: string;
  descripcion: string;
  tipo: TipoActividad;
  costo?: number;
  fechaLimite?: string;
  completada: boolean;
  fechaCompletada?: string;
}

export interface ResumenEconomico {
  fincaId: string;
  periodo: {
    inicio: string;
    fin: string;
  };
  gastosPorTipo: {
    [key in TipoActividad]?: number;
  };
  gastosTotal: number;
  ingresos: number;
  beneficio: number;
  rendimientoPorcentaje: number;
  costosPorHa: number;
}

export interface InformeVolumenCaldo {
  cultivo: TipoCultivo;
  ubicacion: string;
  totalSuperficie: number;
  volumenTotalLitros: number;
  numeroFincas: number;
  fincas: {
    id: string;
    nombre: string;
    cliente: string;
    superficie: number;
    volumenCaldo: number;
    total: number;
  }[];
}

export type TipoAlerta = 
  | 'Temperatura'
  | 'Humedad'
  | 'Lluvia'
  | 'Viento'
  | 'Helada'
  | 'Granizo'
  | 'Plaga'
  | 'Enfermedad';

export interface Alerta {
  id: string;
  fincaId: string;
  tipo: TipoAlerta;
  condicion: string;
  valor: number;
  activa: boolean;
  ultimaActivacion?: string;
  notificaciones: boolean;
}

export interface DatosMeteorologicos {
  fincaId: string;
  timestamp: string;
  temperatura: number;
  humedad: number;
  presion?: number;
  viento?: {
    velocidad: number;
    direccion: string;
  };
  precipitacion?: number;
  humedadSuelo?: number;
  radiacionSolar?: number;
}

export interface PlanAbonado {
  id: string;
  fincaId: string;
  año: number;
  aplicaciones: AplicacionAbono[];
  costoTotal: number;
}

export interface AplicacionAbono {
  fecha: string;
  producto: string;
  dosis: number;
  unidad: string;
  nitrógeno?: number;
  fosforo?: number;
  potasio?: number;
  costo: number;
  aplicada: boolean;
}

export interface FiltrosCliente {
  busqueda?: string;
  provincia?: string;
  tecnico?: string;
  activo?: boolean;
}

export interface FiltrosFinca {
  busqueda?: string;
  cultivo?: TipoCultivo;
  tipoRiego?: TipoRiego;
  superficieMin?: number;
  superficieMax?: number;
}

export interface FiltrosVisita {
  busqueda?: string;
  estado?: Visita['estado'];
  fechaDesde?: string;
  fechaHasta?: string;
  tecnico?: string;
  cliente?: string;
  fincaId?: string;
}

export interface EstadisticasDashboard {
  totalClientes: number;
  totalFincas: number;
  visitasPendientes: number;
  visitasHoy: number;
  superficieTotal: number;
  actividadesEsteMes: number;
  gastosEsteMes: number;
  alertasActivas: number;
}

export interface EventoCalendario {
  id: string;
  tipo: 'visita' | 'actividad' | 'tarea' | 'otro';
  titulo: string;
  fecha: string;
  horaInicio?: string;
  horaFin?: string;
  fincaId?: string;
  clienteId?: string;
  color: string;
  completado: boolean;
}

export interface StorageResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}