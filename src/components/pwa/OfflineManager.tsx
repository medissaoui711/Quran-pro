import React, { useState, useEffect } from 'react';
import { CloudDownload, Trash2, XCircle, CheckCircle2, Loader2, WifiOff } from 'lucide-react';
import { offlineStorageService, DownloadProgress } from '../../services/offlineStorage';
import { toArabicNumerals } from '../../services/quranApi';

export const OfflineManager: React.FC = () => {
  const [progress, setProgress] = useState<DownloadProgress>({
    downloaded: 0,
    total: 604,
    percentage: 0,
    isDownloading: false,
    isCompleted: false,
  });

  const [isInitializing, setIsInitializing] = useState(true);

  const fetchStatus = async () => {
    const status = await offlineStorageService.checkCacheStatus();
    setProgress((prev) => ({
      ...prev,
      downloaded: status.downloaded,
      percentage: Math.round((status.downloaded / status.total) * 100),
      isCompleted: status.isCompleted,
    }));
    setIsInitializing(false);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleStartDownload = () => {
    setProgress((prev) => ({ ...prev, isDownloading: true, error: undefined }));
    offlineStorageService.downloadAllPages((newProgress) => {
      setProgress(newProgress);
    });
  };

  const handleCancelDownload = () => {
    offlineStorageService.cancelDownload();
    fetchStatus(); // Refresh status after cancel
  };

  const handleClearCache = async () => {
    if (window.confirm('هل أنت متأكد من حذف صفحات المصحف من الذاكرة المحلية؟ ستحتاج لإنترنت لقراءتها مجدداً.')) {
      await offlineStorageService.clearCache();
      await fetchStatus();
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 text-[#c5a059] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#c5a059] shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#1e4d2b] flex items-center justify-center text-[#c5a059]">
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-sm font-reem text-[#1e4d2b] dark:text-[#c5a059]">
            القراءة بدون إنترنت
          </h3>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 font-reem">
            تحميل صفحات المصحف الشريف لقراءتها لاحقاً بدون اتصال.
          </p>
        </div>
      </div>

      {progress.error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-400 font-reem">
          {progress.error}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold font-reem text-[#1e4d2b] dark:text-[#e9d19a]">
          <span>حالة التحميل</span>
          <span>
            {toArabicNumerals(progress.percentage)}% ({toArabicNumerals(progress.downloaded)} / {toArabicNumerals(progress.total)})
          </span>
        </div>
        <div className="w-full h-3 bg-[#f4ede1] dark:bg-slate-700 rounded-full overflow-hidden border border-[#c5a059]/40 relative">
          <div
            className={`h-full transition-all duration-300 ${progress.isCompleted ? 'bg-emerald-600' : 'bg-gradient-to-l from-[#1e4d2b] to-[#c5a059]'}`}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-2">
        {progress.isCompleted ? (
          <div className="flex-1 p-2.5 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold font-reem text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>المصحف جاهز بدون إنترنت</span>
          </div>
        ) : progress.isDownloading ? (
          <button
            onClick={handleCancelDownload}
            className="flex-1 py-2.5 rounded-xl bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 font-bold font-reem text-xs flex items-center justify-center gap-1.5 transition-colors border border-red-200 dark:border-red-800"
          >
            <XCircle className="w-4 h-4" />
            <span>إيقاف التحميل</span>
          </button>
        ) : (
          <button
            onClick={handleStartDownload}
            className="flex-1 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#e9d19a] text-[#1e4d2b] font-bold font-reem text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md active:scale-95"
          >
            <CloudDownload className="w-4 h-4" />
            <span>{progress.downloaded > 0 ? 'استكمال التحميل' : 'تحميل المصحف كاملاً'}</span>
          </button>
        )}

        {progress.downloaded > 0 && !progress.isDownloading && (
          <button
            onClick={handleClearCache}
            title="تفريغ الذاكرة المؤقتة"
            className="p-2.5 rounded-xl bg-stone-100 dark:bg-slate-700 hover:bg-stone-200 dark:hover:bg-slate-600 text-stone-600 dark:text-stone-400 transition-colors border border-stone-200 dark:border-stone-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
