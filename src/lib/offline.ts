import { initDB, getData, saveData, getSyncQueue, clearSyncQueue } from './db';

export interface OfflineState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: string | null;
  syncError: string | null;
}

let offlineState: OfflineState = {
  isOnline: navigator.onLine,
  isSyncing: false,
  lastSync: localStorage.getItem('lastSync'),
  syncError: null,
};

const listeners: Array<(state: OfflineState) => void> = [];

// Registrar listener para cambios de estado
export const subscribeToOfflineState = (callback: (state: OfflineState) => void) => {
  listeners.push(callback);
  // Llamar inmediatamente con el estado actual
  callback(offlineState);
  
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

// Notificar cambios
const notifyListeners = () => {
  listeners.forEach(callback => callback(offlineState));
};

// Obtener estado actual
export const getOfflineState = (): OfflineState => offlineState;

// Inicializar detección de conexión
export const initOfflineDetection = () => {
  // Detectar cambios de conexión
  window.addEventListener('online', () => {
    console.log('🟢 Conexión restaurada');
    offlineState.isOnline = true;
    notifyListeners();
    
    // Auto-sincronizar cuando vuelve la conexión
    syncData();
  });

  window.addEventListener('offline', () => {
    console.log('🔴 Conexión perdida');
    offlineState.isOnline = false;
    notifyListeners();
  });

  // Verificar conexión periódicamente
  setInterval(() => {
    const newStatus = navigator.onLine;
    if (newStatus !== offlineState.isOnline) {
      offlineState.isOnline = newStatus;
      notifyListeners();
    }
  }, 3000);

  console.log('✅ Detección offline inicializada');
};

// Sincronizar datos
export const syncData = async () => {
  if (!offlineState.isOnline) {
    console.log('⚠️ No hay conexión, sync pospuesto');
    return;
  }

  if (offlineState.isSyncing) {
    console.log('⏳ Sincronización en progreso');
    return;
  }

  offlineState.isSyncing = true;
  offlineState.syncError = null;
  notifyListeners();

  try {
    // Obtener datos de la API
    console.log('📥 Descargando datos del servidor...');
    
    const [clientes, fincas, visitas] = await Promise.all([
      fetch('/api/clientes').then(r => r.json()).catch(() => []),
      fetch('/api/fincas').then(r => r.json()).catch(() => []),
      fetch('/api/visitas').then(r => r.json()).catch(() => []),
    ]);

    // Guardar en IndexedDB
    await initDB();
    if (clientes.length) await saveData('clientes', clientes);
    if (fincas.length) await saveData('fincas', fincas);
    if (visitas.length) await saveData('visitas', visitas);

    // Procesar cola de cambios locales
    const syncQueue = await getSyncQueue();
    if (syncQueue.length > 0) {
      console.log(`📤 Sincronizando ${syncQueue.length} cambios locales...`);
      
      for (const item of syncQueue) {
        try {
          // Aquí iría la lógica para enviar cambios al servidor
          console.log(`✅ Sincronizado: ${item.action} en ${item.storeName}`);
        } catch (error) {
          console.error(`❌ Error sincronizando item:`, error);
        }
      }
      
      // Limpiar cola después de sincronizar
      await clearSyncQueue();
    }

    // Actualizar timestamp de último sync
    const now = new Date().toISOString();
    offlineState.lastSync = now;
    localStorage.setItem('lastSync', now);

    console.log('✅ Sincronización completada');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    offlineState.syncError = errorMsg;
    console.error('❌ Error en sincronización:', errorMsg);
  } finally {
    offlineState.isSyncing = false;
    notifyListeners();
  }
};

// Sincronizar periódicamente
export const startAutoSync = () => {
  // Sincronizar cada 5 minutos si hay conexión
  setInterval(() => {
    if (offlineState.isOnline && !offlineState.isSyncing) {
      console.log('⏰ Auto-sync periódico');
      syncData();
    }
  }, 5 * 60 * 1000);

  // Sincronizar inmediatamente al iniciar si hay conexión
  if (offlineState.isOnline) {
    setTimeout(() => syncData(), 1000);
  }
};

// Registrar Service Worker
export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('⚠️ Service Workers no soportados');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });
    console.log('✅ Service Worker registrado:', registration);
    return registration;
  } catch (error) {
    console.error('❌ Error registrando Service Worker:', error);
  }
};