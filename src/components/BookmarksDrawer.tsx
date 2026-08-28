import React from 'react';
import { Bookmark as BookmarkIcon, X, Trash2, ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import { Bookmark } from '../types/quran';
import { toArabicNumerals } from '../services/quranApi';
import { fixArabicText } from '../services/arabicSanitizer';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: Bookmark[];
  onSelectBookmark: (page: number, ayahNumber?: number) => void;
  onDeleteBookmark: (id: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectBookmark,
  onDeleteBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      <div
        className="w-full max-w-md h-full bg-[#fdfaf2] dark:bg-[#151b23] border-l-4 border-[#c5a059] flex flex-col shadow-2xl overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#15341d] dark:bg-[#0e1410] text-[#fdfaf2] flex items-center justify-between border-b-2 border-[#c5a059]">
          <div className="flex items-center gap-2">
            <BookmarkIcon className="w-5 h-5 text-[#c5a059]" />
            <h2 className="text-lg font-bold font-reem">العلامات المرجعية والإشارات ({toArabicNumerals(bookmarks.length)})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#0a2312] dark:bg-[#1a231d] hover:bg-[#c5a059] hover:text-[#1e4d2b] transition-colors border border-[#c5a059]/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-stone-500 dark:text-stone-400 p-6">
              <BookmarkIcon className="w-12 h-12 text-[#c5a059]/50 mb-3" />
              <p className="font-reem text-sm">لا توجد إشارات مرجعية محفوظة حتى الآن.</p>
              <p className="text-xs text-stone-400 dark:text-stone-400 mt-1 font-reem">
                اضغط على أيقونة الإشارة في شريط القراءة أو انقر على أي آية لحفظ موضع قراءتك وتدبراتك.
              </p>
            </div>
          ) : (
            bookmarks.map((b) => {
              const formattedDate = new Date(b.createdAt).toLocaleDateString('ar-EG', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={b.id}
                  className="p-3.5 bg-white dark:bg-slate-800 rounded-xl border-2 border-[#e9d19a] hover:border-[#1e4d2b] transition-all shadow-xs space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div
                      onClick={() => {
                        onSelectBookmark(b.pageNumber, b.ayahNumberInSurah);
                        onClose();
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded bg-[#1e4d2b] text-[#c5a059] border border-[#c5a059] flex items-center justify-center font-bold text-xs font-reem">
                        {toArabicNumerals(b.pageNumber)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm font-quran text-[#1e4d2b] dark:text-[#c5a059]">
                          سورة {fixArabicText(b.surahName)}
                          {b.ayahNumberInSurah > 0 && ` (الآية ${toArabicNumerals(b.ayahNumberInSurah)})`}
                        </h3>
                        <span className="text-[11px] text-[#8b6e31] dark:text-stone-400 font-reem">
                          صفحة {toArabicNumerals(b.pageNumber)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteBookmark(b.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                      title="حذف الإشارة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {b.ayahTextSnippet && (
                    <p
                      onClick={() => {
                        onSelectBookmark(b.pageNumber, b.ayahNumberInSurah);
                        onClose();
                      }}
                      className="text-xs font-quran text-stone-700 dark:text-stone-300 line-clamp-2 cursor-pointer bg-[#fdfaf2] dark:bg-slate-900/60 p-2 rounded border border-[#e9d19a]/40 leading-relaxed"
                    >
                      « {b.ayahTextSnippet} »
                    </p>
                  )}

                  {b.note && (
                    <div className="flex items-start gap-1.5 text-xs text-[#8b6e31] dark:text-amber-300 font-reem bg-[#f8f3e6] dark:bg-slate-900 px-2.5 py-1.5 rounded">
                      <Tag className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>{b.note}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-reem pt-1 border-t border-stone-100 dark:border-slate-700">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formattedDate}
                    </span>
                    <button
                      onClick={() => {
                        onSelectBookmark(b.pageNumber, b.ayahNumberInSurah);
                        onClose();
                      }}
                      className="text-[#1e4d2b] dark:text-[#c5a059] font-bold hover:underline"
                    >
                      الانتقال للصفحة ←
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f8f3e6] dark:bg-slate-900 border-t border-[#e9d19a] text-center text-xs font-reem text-[#8b6e31]">
          يتم حفظ الإشارات تلقائيًا في ذاكرة المتصفح للرجوع إليها في أي وقت
        </div>
      </div>
    </div>
  );
};
