import { useState, useEffect } from 'react';
import { type EstadisticasDashboard } from '../types';

export const useEstadisticas = () => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasDashboard>({
    totalClientes: 0,
    totalFincas: 0,
    visitasPendientes: 0,
    visitasHoy: 0,
    superficieTotal: 0,
    actividadesEsteMes: 0,
    gastosEsteMes: 0,
    alertasActivas: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const cargarEstadisticas = () => {
      try {
        // Obtener clientes
        const clientesStr = localStorage.getItem('kropland_clientes');
        const clientes = clientesStr ? JSON.parse(clientesStr) : [];
        
        // Obtener fincas
        const fincasStr = localStorage.getItem('kropland_fincas');
        const fincas = fincasStr ? JSON.parse(fincasStr) : [];
        
        // Obtener visitas
        const visitasStr = localStorage.getItem('kropland_visitas');
        const visitas = visitasStr ? JSON.parse(visitasStr) : [];
        
        // Obtener actividades
        const actividadesStr = localStorage.getItem('kropland_actividades');
        const actividades = actividadesStr ? JSON.parse(actividadesStr) : [];

        // Calcular superficie total
        const superficieTotal = fincas.reduce((total: number, finca: any) => 
          total + (finca.superficie || 0), 0
        );

        // Calcular visitas pendientes
        const visitasPendientes = visitas.filter((v: any) => 
          v.estado === 'Pendiente' || v.estado === 'Confirmada'
        ).length;

        // Visitas de hoy
        const hoy = new Date().toISOString().split('T')[0];
        const visitasHoy = visitas.filter((v: any) => 
          v.fecha === hoy
        ).length;

        // Actividades este mes
        const mesActual = new Date().getMonth();
        const añoActual = new Date().getFullYear();
        const actividadesEsteMes = actividades.filter((a: any) => {
          const fechaActividad = new Date(a.fecha);
          return fechaActividad.getMonth() === mesActual && 
                 fechaActividad.getFullYear() === añoActual;
        }).length;

        // Gastos este mes
        const gastosEsteMes = actividades
          .filter((a: any) => {
            const fechaActividad = new Date(a.fecha);
            return fechaActividad.getMonth() === mesActual && 
                   fechaActividad.getFullYear() === añoActual;
          })
          .reduce((total: number, a: any) => total + (a.costoTotal || 0), 0);

        setEstadisticas({
          totalClientes: clientes.length,
          totalFincas: fincas.length,
          visitasPendientes,
          visitasHoy,
          superficieTotal: Math.round(superficieTotal * 100) / 100,
          actividadesEsteMes,
          gastosEsteMes: Math.round(gastosEsteMes * 100) / 100,
          alertasActivas: 3 // Simulado por ahora
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(cargarEstadisticas, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { estadisticas, loading };
};