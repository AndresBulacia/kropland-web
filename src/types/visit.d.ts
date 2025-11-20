export interface Visit {
    id: string;
    clienteId: string;
    fincaId: string;
    tecnico: string;
    fecha: string;
    notas?: string;
    estado: 'pendiente' | 'hecha';
}