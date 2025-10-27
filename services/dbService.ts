const DB_NAME = 'SpruceDB';
const STORE_NAME = 'images';
const DB_VERSION = 1;

let db: IDBDatabase;

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(true);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', request.error);
      reject(false);
    };

    request.onsuccess = (event) => {
      db = request.result;
      resolve(true);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveImage = (id: string, base64: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      initDB().then(() => saveImage(id, base64).then(resolve).catch(reject)).catch(reject);
      return;
    }
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    transaction.oncomplete = () => {
      resolve();
    };
    
    transaction.onerror = (event) => {
      console.error('Transaction error:', transaction.error);
      reject(transaction.error);
    };

    store.put({ id, base64 });
  });
};

export const getImage = (id: string): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      initDB().then(() => getImage(id).then(resolve).catch(reject)).catch(reject);
      return;
    }
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result?.base64);
    };

    request.onerror = (event) => {
      console.error('Get request error:', request.error);
      reject(request.error);
    };
  });
};
