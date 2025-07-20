import { Ticket } from "@/app/types";
import { RESPONSE, TICKETS_STORE } from "@/app/constants";
import { openDB } from "./indexedDB";

// Add or update an item
export const createTicket = async (ticket: Ticket) => {
  const db: IDBDatabase = await openDB();

  return new Promise<number>((resolve, reject) => {
    const transaction = db.transaction(TICKETS_STORE, "readwrite");
    const store = transaction.objectStore(TICKETS_STORE);

    store.add(ticket)

    transaction.oncomplete = () => resolve(RESPONSE.SUCCESS);
    transaction.onerror = () => reject(RESPONSE.SUCCESS);
  });
};

// Delete an item by id
export const deleteTicket = async (id: number) => {
  const db = await openDB();

  return new Promise<number>((resolve, reject) => {
    const transaction = db.transaction(TICKETS_STORE, "readwrite");
    const store = transaction.objectStore(TICKETS_STORE);

    store.delete(id);

    transaction.oncomplete = () => resolve(RESPONSE.SUCCESS);
    transaction.onerror = () => reject(RESPONSE.FAILURE);
  });
};

// Fetch all items
export const getAllTickets = async (gameId?: number) => {
  const db = await openDB();

  return new Promise<Ticket[]>((resolve, reject) => {
    const tx = db.transaction(TICKETS_STORE, "readonly");
    const store = tx.objectStore(TICKETS_STORE);

    const index = store.index("gameIdIndex");
    const request = index.getAll(gameId);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(RESPONSE.FAILURE);
  });
};
