import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useFincas } from '../hooks/useFincas';
import { useClientes } from '../hooks/useClientes';
import type { Finca } from '../types';
import './MapaPage.css';

// Icono personalizado para Leaflet
const crearIcono = (tipo: string) => {
  const colores: { [key: string]: string } = {
    'Olivo': '#8B7355',
    'Almendro': '#D2B48C',
    'Vid': '#9370DB',
    'Cítricos': '#FFA500',
    'Manzano': '#DC143C',
    'Peral': '#CD853F',
    'Melocotonero': '#FFB6C1',
    'Otro': '#808080'
  };

  const color = colores[tipo] || '#00A859';

  return new L.Icon({
    iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(color)}'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12c0 7 10 13 10 13s10-6 10-13c0-5.52-4.48-10-10-10zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z'/%3E%3C/svg%3E`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

export const MapaPage: React.FC = () => {
  const { fincas } = useFincas();
  const { clientes } = useClientes();
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [miUbicacion, setMiUbicacion] = useState<{ lat: number; lng: number } | null>(null);
  const [filtroCliente, setFiltroCliente] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const markersRef = useRef<L.Marker[]>([]);

  // Inicializar mapa
  useEffect(() => {
    if (!containerRef.current) return;

    // Crear mapa centrado en España (coordenadas por defecto)
    const map = L.map(containerRef.current).setView([40.0, -3.0], 6);

    // Agregar tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;

    // Obtener geolocalización del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMiUbicacion({ lat: latitude, lng: longitude });

          // Centrar mapa en ubicación del usuario
          map.setView([latitude, longitude], 10);

          // Agregar marker de ubicación actual
          L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: '#00A859',
            color: '#193C1E',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8
          })
            .addTo(map)
            .bindPopup('📍 Tu ubicación actual', { closeButton: true });
        },
        (error) => {
          console.log('Geolocalización no disponible:', error);
        }
      );
    }

    return () => {
      map.remove();
    };
  }, []);

  // Agregar markers de fincas
  useEffect(() => {
    if (!mapRef.current) return;

    // Limpiar markers anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filtrar fincas
    let fincasFiltradas = fincas;

    if (filtroCliente) {
      fincasFiltradas = fincasFiltradas.filter(f => f.clienteId === filtroCliente);
    }

    if (filtroTipo) {
      fincasFiltradas = fincasFiltradas.filter(f => f.cultivo === filtroTipo);
    }

    // Agregar markers
    fincasFiltradas.forEach(finca => {
      if (finca.ubicacion?.latitud && finca.ubicacion?.longitud) {
        const cliente = clientes.find(c => c.id === finca.clienteId);

        const marker = L.marker(
          [finca.ubicacion?.latitud, finca.ubicacion?.longitud],
          { icon: crearIcono(finca.cultivo) }
        ).addTo(mapRef.current!);

        // Popup con información
        const popupContent = `
          <div class="popup-finca">
            <h3>${finca.nombre}</h3>
            <p><strong>Cliente:</strong> ${cliente?.nombre || 'Desconocido'}</p>
            <p><strong>Cultivo:</strong> ${finca.cultivo}</p>
            <p><strong>Superficie:</strong> ${finca.superficie} ha</p>
            <p><strong>Riego:</strong> ${finca.tipoRiego}</p>
            ${finca.ubicacion ? `<p><strong>Ubicación:</strong> ${finca.ubicacion}</p>` : ''}
            <button class="btn-detalles" onclick="window.location.href='/fincas'">Ver detalles</button>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'popup-leaflet'
        });

        markersRef.current.push(marker);
      }
    });

    // Ajustar zoom si hay markers
    if (markersRef.current.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.1), { maxZoom: 13 });
    }
  }, [fincas, clientes, filtroCliente, filtroTipo]);

  // Obtener tipos de cultivo únicos
  const tiposCultivo = Array.from(new Set(fincas.map(f => f.cultivo)));

  return (
    <div className="map-page">
      <div className="map-header">
        <div>
          <h1>🗺️ Mapa de Fincas</h1>
          <p className="subtitle">Visualiza todas tus fincas geolocalizadas</p>
        </div>
        <div className="map-stats">
          <div className="stat">
            <span className="stat-valor">{fincas.length}</span>
            <span className="stat-label">Fincas</span>
          </div>
          <div className="stat">
            <span className="stat-valor">{clientes.length}</span>
            <span className="stat-label">Clientes</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="map-filtros">
        <div className="filtro-grupo">
          <label>🔍 Cliente</label>
          <select
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            className="filtro-select"
          >
            <option value="">Todos los clientes</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="filtro-grupo">
          <label>🌱 Cultivo</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="filtro-select"
          >
            <option value="">Todos los cultivos</option>
            {tiposCultivo.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        {(filtroCliente || filtroTipo) && (
          <button
            className="btn-limpiar"
            onClick={() => {
              setFiltroCliente('');
              setFiltroTipo('');
            }}
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>

      {/* Leyenda */}
      <div className="map-leyenda">
        <h4>🎨 Leyenda de cultivos</h4>
        <div className="leyenda-items">
          {tiposCultivo.map(tipo => (
            <div key={tipo} className="leyenda-item">
              <div className="leyenda-color" style={{ backgroundColor: ['Olivo', 'Almendro', 'Vid', 'Cítricos', 'Manzano', 'Peral', 'Melocotonero'].includes(tipo) ? '#00A859' : '#808080' }}></div>
              <span>{tipo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mapa */}
      <div className="map-container" ref={containerRef}></div>

      {/* Info */}
      <div className="map-info">
        <p>💡 Tip: Click en cualquier marcador para ver información de la finca</p>
        {miUbicacion && (
          <p>📍 Tu ubicación: {miUbicacion.lat.toFixed(4)}, {miUbicacion.lng.toFixed(4)}</p>
        )}
      </div>
    </div>
  );
};