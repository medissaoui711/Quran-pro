import { getMushafPageImageUrl } from './quranApi';

// The exact cache name used by the service worker
const PAGES_CACHE = 'mushaf-pages-mushaf-pwa-v4';
const TOTAL_PAGES = 604;

export interface DownloadProgress {
  downloaded: number;
  total: number;
  percentage: number;
  isDownloading: boolean;
  isCompleted: boolean;
  error?: string;
}

export type ProgressCallback = (progress: DownloadProgress) => void;

class OfflineStorageService {
  private isDownloading = false;
  private abortController: AbortController | null = null;

  /**
   * Check how many pages are currently cached
   */
  async checkCacheStatus(): Promise<{ downloaded: number; total: number; isCompleted: boolean }> {
    try {
      const hasCaches = 'caches' in window;
      if (!hasCaches) return { downloaded: 0, total: TOTAL_PAGES, isCompleted: false };

      const cache = await caches.open(PAGES_CACHE);
      const keys = await cache.keys();
      
      // Count only page images
      let downloaded = 0;
      for (const req of keys) {
        if (req.url.includes('.png') || req.url.includes('page-')) {
          downloaded++;
        }
      }

      // Cap at TOTAL_PAGES just in case there are duplicates or other pngs
      downloaded = Math.min(downloaded, TOTAL_PAGES);

      return {
        downloaded,
        total: TOTAL_PAGES,
        isCompleted: downloaded >= TOTAL_PAGES
      };
    } catch (error) {
      console.error('Error checking cache status:', error);
      return { downloaded: 0, total: TOTAL_PAGES, isCompleted: false };
    }
  }

  /**
   * Download all missing pages to cache
   */
  async downloadAllPages(onProgress: ProgressCallback): Promise<void> {
    if (this.isDownloading) return;
    
    if (!('caches' in window)) {
      onProgress({
        downloaded: 0,
        total: TOTAL_PAGES,
        percentage: 0,
        isDownloading: false,
        isCompleted: false,
        error: 'متصفحك لا يدعم خاصية التخزين بدون اتصال'
      });
      return;
    }

    this.isDownloading = true;
    this.abortController = new AbortController();

    try {
      const cache = await caches.open(PAGES_CACHE);
      const status = await this.checkCacheStatus();
      let downloadedCount = status.downloaded;

      // Ensure we don't start from 0 if some are already cached
      let percentage = Math.round((downloadedCount / TOTAL_PAGES) * 100);
      onProgress({
        downloaded: downloadedCount,
        total: TOTAL_PAGES,
        percentage,
        isDownloading: true,
        isCompleted: downloadedCount >= TOTAL_PAGES,
      });

      if (downloadedCount >= TOTAL_PAGES) {
        this.isDownloading = false;
        return;
      }

      // Download pages concurrently but limit concurrency to avoid overwhelming the network
      const CONCURRENCY = 5;
      const pagesToDownload: number[] = [];

      for (let i = 1; i <= TOTAL_PAGES; i++) {
        const url = getMushafPageImageUrl(i);
        const request = new Request(url, { mode: 'cors' });
        const cachedResponse = await cache.match(request);
        if (!cachedResponse) {
          pagesToDownload.push(i);
        }
      }

      for (let i = 0; i < pagesToDownload.length; i += CONCURRENCY) {
        if (this.abortController.signal.aborted) {
          break;
        }

        const chunk = pagesToDownload.slice(i, i + CONCURRENCY);
        await Promise.all(
          chunk.map(async (pageNum) => {
            if (this.abortController?.signal.aborted) return;

            const url = getMushafPageImageUrl(pageNum);
            try {
              const request = new Request(url, { mode: 'cors' });
              // Check again just to be safe
              const exists = await cache.match(request);
              if (!exists) {
                const response = await fetch(request, { signal: this.abortController.signal });
                if (response.ok) {
                  await cache.put(request, response);
                  downloadedCount++;
                  percentage = Math.round((downloadedCount / TOTAL_PAGES) * 100);
                  
                  onProgress({
                    downloaded: downloadedCount,
                    total: TOTAL_PAGES,
                    percentage,
                    isDownloading: true,
                    isCompleted: false,
                  });
                }
              }
            } catch (err: any) {
              if (err.name !== 'AbortError') {
                console.error(`Error downloading page ${pageNum}:`, err);
              }
            }
          })
        );
      }

      // Final Check
      const finalStatus = await this.checkCacheStatus();
      this.isDownloading = false;
      onProgress({
        downloaded: finalStatus.downloaded,
        total: TOTAL_PAGES,
        percentage: Math.round((finalStatus.downloaded / TOTAL_PAGES) * 100),
        isDownloading: false,
        isCompleted: finalStatus.isCompleted,
      });

    } catch (error: any) {
      this.isDownloading = false;
      if (error.name === 'AbortError') {
        const status = await this.checkCacheStatus();
        onProgress({
          downloaded: status.downloaded,
          total: TOTAL_PAGES,
          percentage: Math.round((status.downloaded / TOTAL_PAGES) * 100),
          isDownloading: false,
          isCompleted: status.isCompleted,
        });
      } else {
        onProgress({
          downloaded: 0,
          total: TOTAL_PAGES,
          percentage: 0,
          isDownloading: false,
          isCompleted: false,
          error: 'حدث خطأ أثناء تحميل الصفحات. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.'
        });
      }
    }
  }

  /**
   * Cancel ongoing download
   */
  cancelDownload(): void {
    if (this.isDownloading && this.abortController) {
      this.abortController.abort();
      this.isDownloading = false;
    }
  }

  /**
   * Clear downloaded pages
   */
  async clearCache(): Promise<void> {
    try {
      this.cancelDownload();
      if ('caches' in window) {
        await caches.delete(PAGES_CACHE);
        
        // Also recreate an empty cache immediately so SW can still use it for new accesses
        await caches.open(PAGES_CACHE);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export const offlineStorageService = new OfflineStorageService();
