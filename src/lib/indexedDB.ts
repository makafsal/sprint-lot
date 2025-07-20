import { DB_NAME, DB_VERSION, TICKETS_STORE } from "@/app/constants";

export const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (db.objectStoreNames.contains(TICKETS_STORE)) {
        db.deleteObjectStore(TICKETS_STORE); // delete the old store
      }

      // recreate with autoIncrement
      const store: IDBObjectStore = db.createObjectStore(TICKETS_STORE, {
        keyPath: "id",
        autoIncrement: true
      });

      // Ensure the gameIdIndex exists
      if (!store.indexNames.contains("gameIdIndex")) {
        store.createIndex("gameIdIndex", "gameId", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
  });
};
