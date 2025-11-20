export interface Client {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    dni: string;
    fincas?: Finca[];
}