import React from 'react';
import { Bookmark as BookmarkIcon, Trash2, ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { Bookmark } from '../../types/quran';
import { toArabicNumerals } from '../../services/quranApi';
import { fixArabicText } from '../../services/arabicSanitizer';

interface MobileBookmarksViewProps {
  bookmarks: Bookmark[];
  onSelectPage: (page: number) => void;
  onDeleteBookmark: (id: string) => void;
  onOpenReader: () => void;
}

export const MobileBookmarksView: React.FC<MobileBookmarksViewProps> = ({
  bookmarks,
  onSelectPage,
  onDeleteBookmark,
  onOpenReader,
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 pb-24 select-none" dir="rtl">
      {/* Header Info */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1e4d2b] text-[#c5a059] flex items-center justify-center">
            <BookmarkIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-reem text-[#1e4d2b] dark:text-[#c5a059]">
              الإشارات المرجعية المحفوظة
            </h3>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-reem">
              إجمالي {toArabicNumerals(bookmarks.length)} إشارة
            </span>
          </div>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-[#e9d19a] text-center space-y-3 my-6">
          <div className="w-12 h-12 rounded-full bg-[#f8f3e6] dark:bg-slate-700 text-[#c5a059] flex items-center justify-center mx-auto text-xl">
            🔖
          </div>
          <h4 className="font-bold text-sm font-reem text-[#1e4d2b] dark:text-[#c5a059]">
            لا توجد إشارات مرجعية بعد
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-reem leading-relaxed">
            يمكنك حفظ أي صفحة أو آية تتدبرها أثناء القراءة بالضغط على أيقونة الإشارة المرجعية.
          </p>
          <button
            onClick={onOpenReader}
            className="px-4 py-2 bg-[#1e4d2b] text-[#fdfaf2] rounded-xl text-xs font-bold font-reem border border-[#c5a059] hover:bg-[#15341d] active:scale-95 transition-all shadow-xs"
          >
            الانتقال للمصحف الشريف
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="p-3.5 bg-white dark:bg-slate-800 border-2 border-[#e9d19a] hover:border-[#1e4d2b] rounded-2xl shadow-2xs space-y-2 transition-all active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div
                  onClick={() => onSelectPage(bookmark.pageNumber)}
                  className="flex items-center gap-2.5 cursor-pointer flex-1"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#1e4d2b] text-[#c5a059] flex items-center justify-center font-bold text-xs font-reem shadow-2xs">
                    {toArabicNumerals(bookmark.pageNumber)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-quran text-[#1e4d2b] dark:text-[#fdfaf2] leading-tight">
                      سورة {fixArabicText(bookmark.surahName)}
                    </h4>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 font-reem">
                      صفحة {toArabicNumerals(bookmark.pageNumber)} • آية {toArabicNumerals(bookmark.ayahNumberInSurah || 1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDeleteBookmark(bookmark.id)}
                    className="p-2 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                    title="حذف الإشارة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectPage(bookmark.pageNumber)}
                    className="p-2 text-[#1e4d2b] dark:text-[#c5a059] hover:bg-[#f8f3e6] dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="فتح في المصحف"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Ayah Snippet */}
              {bookmark.ayahTextSnippet && (
                <p
                  onClick={() => onSelectPage(bookmark.pageNumber)}
                  className="font-quran text-xs text-stone-700 dark:text-stone-300 line-clamp-2 leading-relaxed bg-[#fdfaf2] dark:bg-slate-900/60 p-2 rounded-lg border border-[#e9d19a]/40 cursor-pointer"
                >
                  {bookmark.ayahTextSnippet}
                </p>
              )}

              {/* Note if exists */}
              {bookmark.note && (
                <div className="text-[11px] font-reem text-[#8b6e31] dark:text-amber-300 bg-[#f8f3e6] dark:bg-amber-950/30 px-2.5 py-1 rounded-lg border border-[#c5a059]/30">
                  <span className="font-bold">ملاحظة: </span>
                  {bookmark.note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
