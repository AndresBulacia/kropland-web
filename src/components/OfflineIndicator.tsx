import React, { useEffect, useState } from 'react';
import { getOfflineState, subscribeToOfflineState, syncData } from '../lib/offline';
import type { OfflineState } from '../lib/offline';
import './OfflineIndicator.css';

export const OfflineIndicator: React.FC = () => {
  const [state, setState] = useState<OfflineState>(getOfflineState());

  useEffect(() => {
    const unsubscribe = subscribeToOfflineState(setState);
    return unsubscribe;
  }, []);

  if (state.isOnline && !state.isSyncing) {
    return null; // No mostrar nada si está online
  }

  return (
    <div className={`offline-indicator ${state.isOnline ? 'online' : 'offline'}`}>
      <div className="offline-content">
        <div className="offline-icon">
          {state.isSyncing ? (
            <>
              <span className="sync-spinner">⚙️</span>
              <span className="sync-text">Sincronizando...</span>
            </>
          ) : state.isOnline ? (
            <>
              <span className="online-icon">🟢</span>
              <span className="online-text">Conexión restaurada</span>
            </>
          ) : (
            <>
              <span className="offline-icon-emoji">🔴</span>
              <span className="offline-text">Modo offline - Cambios se guardarán localmente</span>
            </>
          )}
        </div>

        {state.lastSync && (
          <div className="sync-info">
            Último sync: {new Date(state.lastSync).toLocaleTimeString('es-AR')}
          </div>
        )}

        {state.syncError && (
          <div className="sync-error">
            ⚠️ Error en sync: {state.syncError}
          </div>
        )}

        {state.isOnline && !state.isSyncing && (
          <button className="sync-button" onClick={() => syncData()}>
            🔄 Sincronizar ahora
          </button>
        )}
      </div>
    </div>
  );
};