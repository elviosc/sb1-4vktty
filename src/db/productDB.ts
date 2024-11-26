import { openDB } from 'idb';
import { Product } from '../types/Product';

const DB_NAME = 'product-catalog';
const STORE_NAME = 'products';
const VERSION = 1;

const dbPromise = openDB(DB_NAME, VERSION, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME, { keyPath: 'id' });
  },
});

export const addProduct = async (product: Product) => {
  const db = await dbPromise;
  await db.put(STORE_NAME, product);
};

export const getAllProducts = async (): Promise<Product[]> => {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
};

export const getProduct = async (id: string): Promise<Product | undefined> => {
  const db = await dbPromise;
  return db.get(STORE_NAME, id);
};

export const updateProduct = async (id: string, product: Product) => {
  const db = await dbPromise;
  await db.put(STORE_NAME, { ...product, id });
};

export const deleteProduct = async (id: string) => {
  const db = await dbPromise;
  await db.delete(STORE_NAME, id);
};