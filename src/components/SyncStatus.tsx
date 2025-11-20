import React from 'react';
import './SyncStatus.css';

interface SyncStatusProps {
  syncing: boolean;
  error: string | null;
  lastSync: string | null;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ syncing, error, lastSync }) => {
  if (!syncing && !error && !lastSync) {
    return null;
  }

  return (
    <div className="sync-status">
      {syncing && (
        <div className="sync-status-item syncing">
          <span className="sync-spinner">⚙️</span>
          <span>Sincronizando...</span>
        </div>
      )}

      {error && (
        <div className="sync-status-item error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!syncing && !error && lastSync && (
        <div className="sync-status-item success">
          <span>✅</span>
          <span>Sincronizado: {new Date(lastSync).toLocaleTimeString('es-AR')}</span>
        </div>
      )}
    </div>
  );
};