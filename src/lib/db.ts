interface DBConfig {
  name: string;
  version: number;
  stores: Record<string, any>;
}

const DB_CONFIG: DBConfig = {
  name: 'KroplandDB',
  version: 1,
  stores: {
    clientes: { keyPath: 'id' },
    fincas: { keyPath: 'id' },
    visitas: { keyPath: 'id' },
    actividades: { keyPath: 'id' },
    sync_queue: { autoIncrement: true },
  },
};

let db: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);

    request.onerror = () => {
      console.error('❌ Error abriendo IndexedDB:', request.error);
      reject(request.error);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      try {
        // Crear object stores
        Object.entries(DB_CONFIG.stores).forEach(([storeName, config]) => {
          if (!database.objectStoreNames.contains(storeName)) {
            console.log(`📦 Creando store: ${storeName}`);
            database.createObjectStore(storeName, config);
          }
        });
      } catch (error) {
        console.error('❌ Error creando stores:', error);
        throw error;
      }
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('✅ IndexedDB inicializada');
      resolve(db);
    };
  });
};

// Guardar datos
export const saveData = async (storeName: string, data: any[]): Promise<void> => {
  const database = await initDB();
  const transaction = database.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    try {
      // Limpiar store primero
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        // Agregar nuevos datos
        data.forEach(item => {
          try {
            store.add(item);
          } catch (error) {
            console.error('Error agregando item:', error);
          }
        });
      };

      transaction.oncomplete = () => {
        console.log(`✅ Datos guardados en ${storeName}`);
        resolve();
      };

      transaction.onerror = () => {
        console.error(`❌ Error guardando en ${storeName}:`, transaction.error);
        reject(transaction.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

// Obtener todos los datos
export const getData = async (storeName: string): Promise<any[]> => {
  try {
    const database = await initDB();
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        console.error(`❌ Error leyendo ${storeName}:`, request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error en getData:', error);
    return [];
  }
};

// Obtener un item
export const getItem = async (storeName: string, id: string): Promise<any> => {
  try {
    const database = await initDB();
    const transaction = database.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error en getItem:', error);
    return null;
  }
};

// Agregar/actualizar item
export const putItem = async (storeName: string, data: any): Promise<void> => {
  try {
    const database = await initDB();
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.put(data);

      request.onsuccess = () => {
        console.log(`✅ Item guardado en ${storeName}`);
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error en putItem:', error);
    throw error;
  }
};

// Eliminar item
export const deleteItem = async (storeName: string, id: string): Promise<void> => {
  try {
    const database = await initDB();
    const transaction = database.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log(`✅ Item eliminado de ${storeName}`);
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error en deleteItem:', error);
    throw error;
  }
};

// Agregar a cola de sincronización
export const addToSyncQueue = async (action: string, storeName: string, data: any): Promise<void> => {
  try {
    const database = await initDB();
    const transaction = database.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');

    const queueItem = {
      action,
      storeName,
      data,
      timestamp: new Date().toISOString(),
      synced: false,
    };

    return new Promise((resolve, reject) => {
      const request = store.add(queueItem);

      request.onsuccess = () => {
        console.log(`📤 Item añadido a sync_queue:`, action);
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error en addToSyncQueue:', error);
    throw error;
  }
};

// Obtener cola de sincronización
export const getSyncQueue = async (): Promise<any[]> => {
  try {
    const database = await initDB();
    const transaction = database.transaction(['sync_queue'], 'readonly');
    const store = transaction.objectStore('sync_queue');

    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error en getSyncQueue:', error);
    return [];
  }
};

// Limpiar cola de sincronización
export const clearSyncQueue = async (): Promise<void> => {
  try {
    const database = await initDB();
    const transaction = database.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');

    return new Promise((resolve, reject) => {
      const request = store.clear();

      request.onsuccess = () => {
        console.log('✅ Sync queue limpiada');
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error en clearSyncQueue:', error);
    throw error;
  }
};