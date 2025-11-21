import { initDB, saveData, getSyncQueue, clearSyncQueue } from './db';
import { mockApi } from '../api/mock';
import type { Cliente, Finca, Visita } from '../types';

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

// Notificar cambios
const notifyListeners = () => {
  listeners.forEach(callback => callback(offlineState));
};

const updateOfflineState = (updates: Partial<OfflineState>) => {
  offlineState = { ...offlineState, ...updates };
  notifyListeners();
};

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

// Obtener estado actual
export const getOfflineState = (): OfflineState => offlineState;

// Inicializar detección de conexión
export const initOfflineDetection = () => {
  // Detectar cambios de conexión
  window.addEventListener('online', () => {
    console.log('🟢 Conexión restaurada');
    
    updateOfflineState({ isOnline: true });

    // Auto-sincronizar cuando vuelve la conexión
    syncData();
  });

  window.addEventListener('offline', () => {
    console.log('🔴 Conexión perdida');
    updateOfflineState({ isOnline: false });
  });

  // Verificar conexión periódicamente
  setInterval(() => {
    const newStatus = navigator.onLine;
    if (newStatus !== offlineState.isOnline) {
      updateOfflineState({ isOnline: newStatus });
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

  updateOfflineState({ isSyncing: true, syncError: null });

  try {
    await initDB();
    
    // Reproducir la cola local primero para no pisar cambios pendientes
    const syncQueue = await getSyncQueue();
    if (syncQueue.length > 0) {
      console.log(`📤 Sincronizando ${syncQueue.length} cambios locales...`);
      
      const fallidos: string[] = [];

      for (const item of syncQueue) {
        try {
          if (item.storeName === 'clientes') {
            await syncCliente(item.action, item.data as any);
          } else if (item.storeName === 'fincas') {
            await syncFinca(item.action, item.data as any);
          } else if (item.storeName === 'visitas') {
            await syncVisita(item.action, item.data as any);
          }
          console.log(`✅ Sincronizado: ${item.action} en ${item.storeName}`);
        } catch (error) {
          fallidos.push(`${item.storeName}:${item.action}`);
          console.error(`❌ Error sincronizando item ${item.storeName}/${item.action}:`, error);
        }
      }
      
      if (fallidos.length > 0) {
        throw new Error(`No se pudieron sincronizar ${fallidos.length} cambios (${fallidos.join(', ')})`);
      }
      await clearSyncQueue();
    }

    // Descargar snapshot actualizado después de aplicar la cola
    console.log('📥 Descargando datos del servidor mock...');

    const [clientes, fincas, visitas] = await Promise.all([
      mockApi.getClientes(),
      mockApi.getFincas(),
      mockApi.getVisitas(),
    ]);

    if (clientes.length) await saveData('clientes', clientes as Cliente[]);
    if (fincas.length) await saveData('fincas', fincas as Finca[]);
    if (visitas.length) await saveData('visitas', visitas as Visita[]);

    const now = new Date().toISOString();
    updateOfflineState({ lastSync: now });
    localStorage.setItem('lastSync', now);

    console.log('✅ Sincronización completada');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    updateOfflineState({ syncError: errorMsg });
    console.error('❌ Error en sincronización:', errorMsg);
  } finally {
    updateOfflineState({ isSyncing: false });
  }
};

const syncCliente = async (action: string, payload: any) => {
  if (action === 'create') {
    await mockApi.createCliente(payload as Cliente);
  } else if (action === 'update') {
    await mockApi.updateCliente(payload.id, payload.cambios as Partial<Cliente>);
  } else if (action === 'delete') {
    await mockApi.deleteCliente(payload.id);
  }
};

const syncFinca = async (action: string, payload: any) => {
  if (action === 'create') {
    await mockApi.createFinca(payload as Finca);
  } else if (action === 'update') {
    await mockApi.updateFinca(payload.id, payload.cambios as Partial<Finca>);
  } else if (action === 'delete') {
    await mockApi.deleteFinca(payload.id);
  }
};

const syncVisita = async (action: string, payload: any) => {
  if (action === 'create') {
    await mockApi.createVisita(payload as Visita);
  } else if (action === 'update') {
    await mockApi.updateVisita(payload.id, payload.cambios as Partial<Visita>);
  } else if (action === 'delete') {
    await mockApi.deleteVisita(payload.id);
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
    // Esperar a que la página esté completamente cargada
    if (document.readyState !== 'complete') {
      await new Promise(resolve => window.addEventListener('load', resolve));
    }

    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    console.log('✅ Service Worker registrado:', registration.scope);

    // Escuchar actualizaciones del Service Worker
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🔄 Nueva versión disponible');
            // Aquí podrías mostrar una notificación al usuario
            // por ejemplo: mostrar un toast "Nueva versión disponible, recarga la página"
          }
        });
      }
    });

    // Forzar actualización del SW cuando se carga la página
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    // Recargar la página cuando el nuevo service worker tome control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('🔄 Service Worker actualizado, recargando...');
        window.location.reload();
      }
    });

    return registration;
  } catch (error) {
    console.error('❌ Error registrando Service Worker:', error);
  }
};