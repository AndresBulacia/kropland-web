import React, { useState } from 'react';
import { useClientes } from '../hooks/useClientes';
import { useFincas } from '../hooks/useFincas';
import { useVisitas } from '../hooks/useVisitas';
import { SyncStatus } from '../components/SyncStatus';
import './InformesPage.css';

export function InformesPage() {
  const { clientes, loading: loadingClientes, error: errorClientes, syncing: syncingClientes } = useClientes();
  const { fincas, loading: loadingFincas, error: errorFincas, syncing: syncingFincas } = useFincas();
  const { visitas, loading: loadingVisitas, error: errorVisitas, syncing: syncingVisitas } = useVisitas();
  const [filtroVisitas, setFiltroVisitas] = useState('todas');

  const loading = loadingClientes || loadingFincas || loadingVisitas;
  const syncing = syncingClientes || syncingFincas || syncingVisitas;
  const error = errorClientes || errorFincas || errorVisitas;

  // Filtrar visitas
  const visitasFiltradas = filtroVisitas === 'todas' 
    ? visitas 
    : visitas.filter(v => v.estado.toLowerCase() === filtroVisitas.toLowerCase());

  // Estadísticas
  const stats = {
    totalClientes: clientes.length,
    clientesPorRol: {
      productores: clientes.filter(c => c.rol === 'productor').length,
      tecnicos: clientes.filter(c => c.rol === 'tecnico').length,
      admins: clientes.filter(c => c.rol === 'admin').length,
    },
    totalFincas: fincas.length,
    hectareasTotal: fincas.reduce((sum, f) => sum + (f.hectareas || 0), 0),
    cultivosPrincipales: [...new Set(fincas.map(f => f.cultivo))],
    totalVisitas: visitas.length,
    visitasPorEstado: {
      realizadas: visitas.filter(v => v.estado === 'Realizada').length,
      confirmadas: visitas.filter(v => v.estado === 'Confirmada').length,
      pendientes: visitas.filter(v => v.estado === 'Pendiente').length,
    },
  };

  // Exportar a CSV
  const exportarCSV = () => {
    let csv = 'REPORTE GENERAL - ' + new Date().toLocaleDateString() + '\n\n';
    
    csv += 'ESTADÍSTICAS GENERALES\n';
    csv += `Total de Clientes,${stats.totalClientes}\n`;
    csv += `Productores,${stats.clientesPorRol.productores}\n`;
    csv += `Técnicos,${stats.clientesPorRol.tecnicos}\n`;
    csv += `Total de Fincas,${stats.totalFincas}\n`;
    csv += `Hectáreas Totales,${stats.hectareasTotal}\n`;
    csv += `Total de Visitas,${stats.totalVisitas}\n`;
    csv += `Visitas Realizadas,${stats.visitasPorEstado.realizadas}\n`;
    csv += `Visitas Confirmadas,${stats.visitasPorEstado.confirmadas}\n`;
    csv += `Visitas Pendientes,${stats.visitasPorEstado.pendientes}\n\n`;

    csv += 'CLIENTES\n';
    csv += 'Nombre,Email,Teléfono,Rol\n';
    clientes.forEach(c => {
      csv += `"${c.nombre}","${c.email}","${c.telefono}","${c.rol}"\n`;
    });

    csv += '\nFINCAS\n';
    csv += 'Nombre,Cultivo,Hectáreas,Ubicación\n';
    fincas.forEach(f => {
      csv += `"${f.nombre}","${f.cultivo}","${f.hectareas}","${f.ubicacion}"\n`;
    });

    csv += '\nVISITAS\n';
    csv += 'Cliente ID,Finca ID,Fecha,Estado,Nota\n';
    visitas.forEach(v => {
      csv += `"${v.clienteId}","${v.fincaId}","${v.fecha}","${v.estado}","${v.nota}"\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `reporte_kropland_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) return <div className="page-container"><p>Cargando reportes...</p></div>;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>📊 Reportes e Informes</h1>
        <button
          onClick={exportarCSV}
          style={{
            background: '#00A859',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          📥 Descargar CSV
        </button>
      </div>

      <SyncStatus syncing={syncing} error={error} lastSync={null} />

      {error && <div className="error-box">{error}</div>}

      {/* Tarjetas de Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>👥 Clientes Totales</h3>
          <div className="stat-value">{stats.totalClientes}</div>
          <div className="stat-detail">
            <span>Productores: {stats.clientesPorRol.productores}</span>
            <span>Técnicos: {stats.clientesPorRol.tecnicos}</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>🌾 Fincas Registradas</h3>
          <div className="stat-value">{stats.totalFincas}</div>
          <div className="stat-detail">
            <span>{stats.hectareasTotal} hectáreas totales</span>
            <span>{stats.cultivosPrincipales.length} cultivos</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>📅 Visitas Realizadas</h3>
          <div className="stat-value">{stats.visitasPorEstado.realizadas}</div>
          <div className="stat-detail">
            <span>Confirmadas: {stats.visitasPorEstado.confirmadas}</span>
            <span>Pendientes: {stats.visitasPorEstado.pendientes}</span>
          </div>
        </div>

        <div className="stat-card">
          <h3>📈 Tasa de Ejecución</h3>
          <div className="stat-value">
            {stats.totalVisitas > 0 
              ? Math.round((stats.visitasPorEstado.realizadas / stats.totalVisitas) * 100) 
              : 0}%
          </div>
          <div className="stat-detail">
            <span>De {stats.totalVisitas} visitas totales</span>
          </div>
        </div>
      </div>

      {/* Sección de Cultivos */}
      <div className="report-section">
        <h2>🌱 Cultivos Principales</h2>
        <div className="cultivos-list">
          {stats.cultivosPrincipales.length > 0 ? (
            stats.cultivosPrincipales.map((cultivo, idx) => {
              const count = fincas.filter(f => f.cultivo === cultivo).length;
              const hectareas = fincas
                .filter(f => f.cultivo === cultivo)
                .reduce((sum, f) => sum + (f.hectareas || 0), 0);
              return (
                <div key={idx} className="cultivo-item">
                  <div>
                    <strong>{cultivo}</strong>
                    <p>{count} finca(s) - {hectareas} hectáreas</p>
                  </div>
                  <div className="cultivo-bar">
                    <div 
                      className="cultivo-progress"
                      style={{ width: `${(hectareas / stats.hectareasTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No hay cultivos registrados</p>
          )}
        </div>
      </div>

      {/* Sección de Visitas por Estado */}
      <div className="report-section">
        <h2>📋 Estado de Visitas</h2>
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setFiltroVisitas('todas')}
            style={{
              background: filtroVisitas === 'todas' ? '#00A859' : '#E0E0E0',
              color: filtroVisitas === 'todas' ? '#FFFFFF' : '#333',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginRight: '8px',
            }}
          >
            Todas ({stats.totalVisitas})
          </button>
          <button
            onClick={() => setFiltroVisitas('Realizada')}
            style={{
              background: filtroVisitas === 'Realizada' ? '#2E7D32' : '#E0E0E0',
              color: filtroVisitas === 'Realizada' ? '#FFFFFF' : '#333',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginRight: '8px',
            }}
          >
            Realizadas ({stats.visitasPorEstado.realizadas})
          </button>
          <button
            onClick={() => setFiltroVisitas('Confirmada')}
            style={{
              background: filtroVisitas === 'Confirmada' ? '#1976D2' : '#E0E0E0',
              color: filtroVisitas === 'Confirmada' ? '#FFFFFF' : '#333',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginRight: '8px',
            }}
          >
            Confirmadas ({stats.visitasPorEstado.confirmadas})
          </button>
          <button
            onClick={() => setFiltroVisitas('Pendiente')}
            style={{
              background: filtroVisitas === 'Pendiente' ? '#F57C00' : '#E0E0E0',
              color: filtroVisitas === 'Pendiente' ? '#FFFFFF' : '#333',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Pendientes ({stats.visitasPorEstado.pendientes})
          </button>
        </div>

        {visitasFiltradas.length > 0 ? (
          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Finca</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Nota</th>
                </tr>
              </thead>
              <tbody>
                {visitasFiltradas.map(visita => (
                  <tr key={visita.id}>
                    <td>{visita.clienteId}</td>
                    <td>{visita.fincaId}</td>
                    <td>{new Date(visita.fecha).toLocaleDateString('es-AR')}</td>
                    <td>
                      <span className={`badge-table ${visita.estado.toLowerCase()}`}>
                        {visita.estado}
                      </span>
                    </td>
                    <td>{visita.nota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-message">No hay visitas en este estado</p>
        )}
      </div>

      {/* Sección de Últimas Actividades */}
      <div className="report-section">
        <h2>⏱️ Últimas Actividades</h2>
        {visitas.length > 0 ? (
          <div className="activities-list">
            {visitas.slice(-5).reverse().map(visita => (
              <div key={visita.id} className="activity-item">
                <div className="activity-header">
                  <span className="activity-date">
                    {new Date(visita.fecha).toLocaleDateString('es-AR')}
                  </span>
                  <span className={`badge-activity ${visita.estado.toLowerCase()}`}>
                    {visita.estado}
                  </span>
                </div>
                <p className="activity-note">📍 {visita.nota}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-message">No hay actividades registradas</p>
        )}
      </div>

      {/* Generado */}
      <div style={{ 
        marginTop: '40px', 
        textAlign: 'center', 
        color: '#999', 
        fontSize: '12px',
        borderTop: '1px solid #E0E0E0',
        paddingTop: '20px',
      }}>
        <p>Reporte generado: {new Date().toLocaleString('es-AR')}</p>
        <p>Funciona sin conexión - Los datos se sincronizarán automáticamente</p>
      </div>
    </div>
  );
}