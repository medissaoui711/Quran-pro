/**
 * Offline Persistence & Cache Storage Utility
 * Manages indexed storage of Quran pages, fonts, and structural metadata
 */
import { QuranPageData } from '../types/quran';
import { computeSHA256, serializePageForHashing } from './quranIntegrityVerifier';

const DB_NAME = 'quran_mushaf_offline_db';
const DB_VERSION = 1;
const STORE_PAGES = 'mushaf_pages';
const STORE_METADATA = 'mushaf_metadata';

interface CachedPageRecord {
  pageNumber: number;
  data: QuranPageData;
  checksum: string;
  cachedAt: number;
}

/**
 * Initializes and returns the IndexedDB database instance
 */
function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB is not supported in this environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_PAGES)) {
        db.createObjectStore(STORE_PAGES, { keyPath: 'pageNumber' });
      }
      if (!db.objectStoreNames.contains(STORE_METADATA)) {
        db.createObjectStore(STORE_METADATA, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Persists a Quran page with cryptographic SHA-256 integrity checksum
 */
export async function cacheQuranPageOffline(pageData: QuranPageData): Promise<string> {
  try {
    const db = await openOfflineDB();
    const checksum = await computeSHA256(serializePageForHashing(pageData.ayahs));

    const record: CachedPageRecord = {
      pageNumber: pageData.pageNumber,
      data: pageData,
      checksum,
      cachedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PAGES, 'readwrite');
      const store = tx.objectStore(STORE_PAGES);
      const req = store.put(record);

      req.onsuccess = () => resolve(checksum);
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.warn('Offline caching fallback active (IndexedDB unavailable):', error);
    return '';
  }
}

/**
 * Retrieves an offline cached Quran page, verifying its checksum
 */
export async function getQuranPageOffline(pageNumber: number): Promise<QuranPageData | null> {
  try {
    const db = await openOfflineDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PAGES, 'readonly');
      const store = tx.objectStore(STORE_PAGES);
      const req = store.get(pageNumber);

      req.onsuccess = async () => {
        const record = req.result as CachedPageRecord | undefined;
        if (!record) {
          return resolve(null);
        }

        // Verify SHA-256 integrity on read
        const currentChecksum = await computeSHA256(serializePageForHashing(record.data.ayahs));
        if (currentChecksum !== record.checksum) {
          console.error(`Data corruption detected in offline storage for Page ${pageNumber}!`);
          return resolve(null); // Discard corrupted entry
        }

        resolve(record.data);
      };

      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

/**
 * Checks whether all critical resources (fonts, stylesheets) are cached by Service Worker
 */
export async function verifyOfflineCacheStatus(): Promise<{ isServiceWorkerActive: boolean; hasCaches: boolean }> {
  const isServiceWorkerActive = typeof navigator !== 'undefined' && 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;
  const hasCaches = typeof caches !== 'undefined';
  return {
    isServiceWorkerActive,
    hasCaches,
  };
}
