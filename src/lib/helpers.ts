export const formatDate = (date: string | Date) =>
    new Date(date).toLocaleDateString('es-ES');

export const uid = () => crypto.randomUUID();