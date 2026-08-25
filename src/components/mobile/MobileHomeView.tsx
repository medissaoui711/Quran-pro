import React from 'react';
import {
  BookOpen,
  Play,
  Bookmark,
  Trophy,
  Search,
  Sparkles,
  ArrowLeft,
  Flame,
  CheckCircle2,
  Clock,
  Volume2,
} from 'lucide-react';
import { Bookmark as BookmarkType, KhatmaTracker, Reciter } from '../../types/quran';
import { toArabicNumerals } from '../../services/quranApi';
import { fixArabicText } from '../../services/arabicSanitizer';
import { SURAHS } from '../../data/quranMetadata';

interface MobileHomeViewProps {
  currentPage: number;
  onOpenReader: (page?: number) => void;
  onOpenIndex: () => void;
  onOpenBookmarks: () => void;
  onOpenKhatma: () => void;
  onOpenAudio: () => void;
  bookmarks: BookmarkType[];
  khatma: KhatmaTracker;
  selectedReciter: Reciter;
}

const FEATURED_SURAHS = [
  { number: 1, name: 'الفاتحة', startPage: 1, badge: 'أم الكتاب' },
  { number: 18, name: 'الكهف', startPage: 293, badge: 'نور الجمعة' },
  { number: 36, name: 'يس', startPage: 440, badge: 'قلب القرآن' },
  { number: 67, name: 'الملك', startPage: 562, badge: 'المنجية' },
  { number: 55, name: 'الرحمن', startPage: 531, badge: 'عروس القرآن' },
  { number: 56, name: 'الواقعة', startPage: 534, badge: 'سورة الغنى' },
];

export const MobileHomeView: React.FC<MobileHomeViewProps> = ({
  currentPage,
  onOpenReader,
  onOpenIndex,
  onOpenBookmarks,
  onOpenKhatma,
  onOpenAudio,
  bookmarks,
  khatma,
  selectedReciter,
}) => {
  // Find current surah based on current page
  const currentSurah =
    SURAHS.find((s) => currentPage >= s.startPage && currentPage <= s.endPage) || SURAHS[0];

  const totalPages = 604;
  const progressPercent = Math.min(100, Math.round((currentPage / totalPages) * 100));

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 pb-24 select-none" dir="rtl">
      {/* Islamic Daily Greeting Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-l from-[#1e4d2b] to-[#15341d] text-[#fdfaf2] border-2 border-[#c5a059] shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#e9d19a] font-reem font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>مرحباً بك في روضة القرآن الكريم</span>
          </div>
          <h2 className="text-lg font-bold font-quran text-[#fdfaf2]">
            ﴿ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا ﴾
          </h2>
          <p className="text-[11px] text-[#fdfaf2]/80 font-reem">
            قال ﷺ: «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ».
          </p>
        </div>
      </div>

      {/* Hero Continue Reading Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#c5a059] shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1e4d2b] text-[#c5a059] border border-[#c5a059] flex items-center justify-center font-bold text-xs">
              📖
            </div>
            <div>
              <span className="text-[10px] text-[#8b6e31] dark:text-stone-400 font-reem block font-bold">
                آخر موضع قراءة محفوظ
              </span>
              <h3 className="font-bold text-base font-reem text-[#1e4d2b] dark:text-[#c5a059]">
                سورة {fixArabicText(currentSurah.name)}
              </h3>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-[#f8f3e6] dark:bg-slate-700 text-[#8b6e31] dark:text-[#e9d19a] text-xs font-bold font-reem border border-[#e9d19a]">
            صفحة {toArabicNumerals(currentPage)}
          </span>
        </div>

        {/* Mushaf Progress Meter */}
        <div className="space-y-1">
          <div className="w-full h-2 bg-[#f4ede1] dark:bg-slate-700 rounded-full overflow-hidden border border-[#c5a059]/30">
            <div
              className="h-full bg-gradient-to-l from-[#1e4d2b] to-[#c5a059] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-reem text-stone-500 dark:text-stone-400">
            <span>صفحة {toArabicNumerals(currentPage)} من ٦٠٤</span>
            <span>{toArabicNumerals(progressPercent)}% من المصحف</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => onOpenReader(currentPage)}
          className="w-full py-3 px-4 bg-[#1e4d2b] hover:bg-[#15341d] active:scale-[0.98] text-[#fdfaf2] border-2 border-[#c5a059] rounded-xl flex items-center justify-center gap-2 font-reem font-bold text-sm shadow-md transition-all"
        >
          <BookOpen className="w-4 h-4 text-[#c5a059]" />
          <span>متابعة التلاوة الآن</span>
          <ArrowLeft className="w-4 h-4 text-[#c5a059] mr-auto" />
        </button>
      </div>

      {/* Quick Actions Grid (Search, Bookmarks, Audio, Khatma) */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onOpenIndex}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#e9d19a] hover:border-[#1e4d2b] flex flex-col items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all text-center"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f8f3e6] dark:bg-slate-700 text-[#1e4d2b] dark:text-[#c5a059] flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-reem font-bold text-[#1e4d2b] dark:text-[#e9d19a]">
            البحث
          </span>
        </button>

        <button
          onClick={onOpenBookmarks}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#e9d19a] hover:border-[#1e4d2b] flex flex-col items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all text-center"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f8f3e6] dark:bg-slate-700 text-[#1e4d2b] dark:text-[#c5a059] flex items-center justify-center">
            <Bookmark className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-reem font-bold text-[#1e4d2b] dark:text-[#e9d19a]">
            الإشارات
          </span>
        </button>

        <button
          onClick={onOpenAudio}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#e9d19a] hover:border-[#1e4d2b] flex flex-col items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all text-center"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f8f3e6] dark:bg-slate-700 text-[#1e4d2b] dark:text-[#c5a059] flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-reem font-bold text-[#1e4d2b] dark:text-[#e9d19a]">
            التلاوة
          </span>
        </button>

        <button
          onClick={onOpenKhatma}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#e9d19a] hover:border-[#1e4d2b] flex flex-col items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all text-center"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f8f3e6] dark:bg-slate-700 text-[#1e4d2b] dark:text-[#c5a059] flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-reem font-bold text-[#1e4d2b] dark:text-[#e9d19a]">
            الختمة
          </span>
        </button>
      </div>

      {/* Featured Surahs Quick Access */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold font-reem text-[#1e4d2b] dark:text-[#c5a059]">
            سور للقراءة السريعة
          </h3>
          <button
            onClick={onOpenIndex}
            className="text-[11px] text-[#8b6e31] dark:text-[#e9d19a] font-reem font-bold hover:underline"
          >
            عرض كافة السور ←
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {FEATURED_SURAHS.map((s) => (
            <button
              key={s.number}
              onClick={() => onOpenReader(s.startPage)}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-[#e9d19a] hover:border-[#1e4d2b] active:scale-95 text-right flex items-center justify-between shadow-2xs transition-all"
            >
              <div>
                <h4 className="font-bold text-xs font-quran text-[#1e4d2b] dark:text-[#fdfaf2]">
                  سورة {s.name}
                </h4>
                <span className="text-[10px] text-[#c5a059] font-reem">{s.badge}</span>
              </div>
              <span className="text-[10px] text-stone-400 font-reem">
                ص {toArabicNumerals(s.startPage)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Bookmarks Widget if exist */}
      {bookmarks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold font-reem text-[#1e4d2b] dark:text-[#c5a059] flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>آخر الإشارات المحفوظة</span>
            </h3>
            <button
              onClick={onOpenBookmarks}
              className="text-[11px] text-[#8b6e31] dark:text-[#e9d19a] font-reem font-bold hover:underline"
            >
              عرض الكل ({toArabicNumerals(bookmarks.length)}) ←
            </button>
          </div>

          <div className="space-y-1.5">
            {bookmarks.slice(0, 2).map((b) => (
              <div
                key={b.id}
                onClick={() => onOpenReader(b.pageNumber)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-[#e9d19a] hover:border-[#1e4d2b] cursor-pointer flex items-center justify-between active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[#1e4d2b] text-[#c5a059] flex items-center justify-center text-[10px] font-bold font-reem">
                    {toArabicNumerals(b.pageNumber)}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold font-quran text-[#1e4d2b] dark:text-[#fdfaf2]">
                      سورة {fixArabicText(b.surahName)}
                    </h4>
                    {b.note && (
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate max-w-[180px]">
                        {b.note}
                      </p>
                    )}
                  </div>
                </div>
                <ArrowLeft className="w-4 h-4 text-stone-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reciter Info Pill */}
      <div
        onClick={onOpenAudio}
        className="p-3 rounded-xl bg-[#f8f3e6] dark:bg-slate-900 border border-[#c5a059]/40 flex items-center justify-between cursor-pointer active:scale-98 transition-all"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1e4d2b] text-[#c5a059] flex items-center justify-center text-xs">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-reem block">
              القارئ الصوتي الحالي:
            </span>
            <h4 className="text-xs font-bold font-reem text-[#1e4d2b] dark:text-[#e9d19a]">
              {selectedReciter.name}
            </h4>
          </div>
        </div>
        <span className="text-[10px] text-[#c5a059] font-reem font-bold px-2 py-0.5 rounded bg-[#1e4d2b]/10 dark:bg-[#1e4d2b]">
          تغيير القارئ
        </span>
      </div>
    </div>
  );
};
