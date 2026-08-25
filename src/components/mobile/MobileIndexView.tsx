import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  BookOpen,
  Layers,
  Sparkles,
  ChevronLeft,
  Filter,
} from 'lucide-react';
import { SURAHS, JUZ_LIST } from '../../data/quranMetadata';
import { toArabicNumerals, searchQuran, normalizeArabic } from '../../services/quranApi';
import { fixArabicText } from '../../services/arabicSanitizer';
import { Ayah } from '../../types/quran';

interface MobileIndexViewProps {
  onSelectPage: (page: number) => void;
}

type IndexSegment = 'surahs' | 'juz' | 'hizb' | 'search';

export const MobileIndexView: React.FC<MobileIndexViewProps> = ({ onSelectPage }) => {
  const [segment, setSegment] = useState<IndexSegment>('surahs');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revelationFilter, setRevelationFilter] = useState<'all' | 'Meccan' | 'Medinan'>('all');
  
  // Search state for full Quran text
  const [searchResults, setSearchResults] = useState<Ayah[]>([]);
  const [isSearchingText, setIsSearchingText] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Filter Surahs by query & revelation type
  const filteredSurahs = useMemo(() => {
    const norm = normalizeArabic(searchQuery);
    return SURAHS.filter((s) => {
      const matchName = normalizeArabic(s.name).includes(norm) || s.number.toString().includes(norm);
      const matchRev = revelationFilter === 'all' || s.revelationType === revelationFilter;
      return matchName && matchRev;
    });
  }, [searchQuery, revelationFilter]);

  // Execute full text search
  const handleExecuteSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;

    setIsSearchingText(true);
    setHasSearched(true);
    setSegment('search');
    try {
      const results = await searchQuran(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearchingText(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-3 space-y-3 pb-24 select-none" dir="rtl">
      {/* Search Input Bar */}
      <form onSubmit={handleExecuteSearch} className="relative">
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-800 border-2 border-[#c5a059] rounded-2xl shadow-sm">
          <div className="p-2 text-[#1e4d2b] dark:text-[#c5a059]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن اسم سورة أو كلمة في القرآن..."
            className="flex-1 bg-transparent py-1.5 px-1 text-xs sm:text-sm font-reem text-stone-800 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
                setHasSearched(false);
              }}
              className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-[#1e4d2b] text-[#fdfaf2] rounded-xl text-xs font-bold font-reem border border-[#c5a059] hover:bg-[#15341d] active:scale-95 transition-all shadow-xs"
          >
            بحث
          </button>
        </div>
      </form>

      {/* Segment Tabs (السور | الأجزاء | الأحزاب | نتائج البحث) */}
      <div className="grid grid-cols-4 p-1 bg-[#f4ede1] dark:bg-slate-800/80 rounded-xl border border-[#c5a059]/40 text-xs font-reem">
        <button
          onClick={() => setSegment('surahs')}
          className={`py-2 rounded-lg font-bold transition-all text-center ${
            segment === 'surahs'
              ? 'bg-[#1e4d2b] text-[#fdfaf2] shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:text-[#1e4d2b]'
          }`}
        >
          السور ({toArabicNumerals(114)})
        </button>

        <button
          onClick={() => setSegment('juz')}
          className={`py-2 rounded-lg font-bold transition-all text-center ${
            segment === 'juz'
              ? 'bg-[#1e4d2b] text-[#fdfaf2] shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:text-[#1e4d2b]'
          }`}
        >
          الأجزاء ({toArabicNumerals(30)})
        </button>

        <button
          onClick={() => setSegment('hizb')}
          className={`py-2 rounded-lg font-bold transition-all text-center ${
            segment === 'hizb'
              ? 'bg-[#1e4d2b] text-[#fdfaf2] shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:text-[#1e4d2b]'
          }`}
        >
          الأحزاب ({toArabicNumerals(60)})
        </button>

        <button
          onClick={() => setSegment('search')}
          className={`py-2 rounded-lg font-bold transition-all text-center ${
            segment === 'search'
              ? 'bg-[#1e4d2b] text-[#fdfaf2] shadow-xs'
              : 'text-stone-600 dark:text-stone-300 hover:text-[#1e4d2b]'
          }`}
        >
          البحث {searchResults.length > 0 ? `(${toArabicNumerals(searchResults.length)})` : ''}
        </button>
      </div>

      {/* Surahs List Segment */}
      {segment === 'surahs' && (
        <div className="space-y-2">
          {/* Quick Filter: All / Meccan / Medinan */}
          <div className="flex items-center justify-between px-1 text-[11px] font-reem">
            <span className="text-stone-500 dark:text-stone-400">
              عدد السور: {toArabicNumerals(filteredSurahs.length)}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setRevelationFilter('all')}
                className={`px-2 py-0.5 rounded-full border text-[10px] ${
                  revelationFilter === 'all'
                    ? 'bg-[#c5a059] text-[#1e4d2b] border-[#8b6e31] font-bold'
                    : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setRevelationFilter('Meccan')}
                className={`px-2 py-0.5 rounded-full border text-[10px] ${
                  revelationFilter === 'Meccan'
                    ? 'bg-[#c5a059] text-[#1e4d2b] border-[#8b6e31] font-bold'
                    : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                }`}
              >
                مكية
              </button>
              <button
                onClick={() => setRevelationFilter('Medinan')}
                className={`px-2 py-0.5 rounded-full border text-[10px] ${
                  revelationFilter === 'Medinan'
                    ? 'bg-[#c5a059] text-[#1e4d2b] border-[#8b6e31] font-bold'
                    : 'bg-white dark:bg-slate-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                }`}
              >
                مدنية
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            {filteredSurahs.map((surah) => (
              <div
                key={surah.number}
                onClick={() => onSelectPage(surah.startPage)}
                className="p-3 bg-white dark:bg-slate-800 border border-[#e9d19a] hover:border-[#1e4d2b] rounded-2xl cursor-pointer flex items-center justify-between shadow-2xs active:scale-[0.99] transition-all"
              >
                {/* Surah Number & Title */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f8f3e6] dark:bg-slate-700 border border-[#c5a059] flex items-center justify-center font-bold text-xs font-reem text-[#1e4d2b] dark:text-[#c5a059]">
                    {toArabicNumerals(surah.number)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base font-quran text-[#1e4d2b] dark:text-[#fdfaf2] leading-tight">
                      سورة {fixArabicText(surah.name)}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-stone-500 dark:text-stone-400 font-reem mt-0.5">
                      <span
                        className={`px-1.5 py-0.2 rounded font-bold ${
                          surah.revelationType === 'Meccan'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        {surah.revelationPlaceArabic}
                      </span>
                      <span>{toArabicNumerals(surah.numberOfAyahs)} آية</span>
                      <span>•</span>
                      <span>الجزء {toArabicNumerals(surah.juz)}</span>
                    </div>
                  </div>
                </div>

                {/* Page Jump Badge */}
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-1 rounded-xl bg-[#f8f3e6] dark:bg-slate-700 text-[#8b6e31] dark:text-[#e9d19a] text-xs font-bold font-reem border border-[#e9d19a]">
                    ص {toArabicNumerals(surah.startPage)}
                  </span>
                  <ChevronLeft className="w-4 h-4 text-stone-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Juz Segment (30 Parts) */}
      {segment === 'juz' && (
        <div className="space-y-1.5">
          {JUZ_LIST.map((j) => (
            <div
              key={j.juzNumber}
              onClick={() => onSelectPage(j.startPage)}
              className="p-3 bg-white dark:bg-slate-800 border border-[#e9d19a] hover:border-[#1e4d2b] rounded-2xl cursor-pointer flex items-center justify-between shadow-2xs active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1e4d2b] text-[#c5a059] border border-[#c5a059] flex items-center justify-center font-bold text-xs font-reem">
                  {toArabicNumerals(j.juzNumber)}
                </div>
                <div>
                  <h3 className="font-bold text-sm font-reem text-[#1e4d2b] dark:text-[#fdfaf2]">
                    {j.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-quran truncate max-w-[200px]">
                    يبدأ من سورة {j.startSurah} - آية {toArabicNumerals(j.startAyah)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-2 py-1 rounded-xl bg-[#f8f3e6] dark:bg-slate-700 text-[#8b6e31] dark:text-[#e9d19a] text-xs font-bold font-reem border border-[#e9d19a]">
                  ص {toArabicNumerals(j.startPage)}
                </span>
                <ChevronLeft className="w-4 h-4 text-stone-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hizb Segment (60 Ahzab) */}
      {segment === 'hizb' && (
        <div className="space-y-1.5">
          {Array.from({ length: 60 }).map((_, idx) => {
            const hizbNum = idx + 1;
            const approxPage = Math.min(604, Math.max(1, Math.round((hizbNum - 1) * 10.05 + 1)));
            const relatedSurah = SURAHS.find((s) => approxPage >= s.startPage && approxPage <= s.endPage) || SURAHS[0];

            return (
              <div
                key={hizbNum}
                onClick={() => onSelectPage(approxPage)}
                className="p-3 bg-white dark:bg-slate-800 border border-[#e9d19a] hover:border-[#1e4d2b] rounded-2xl cursor-pointer flex items-center justify-between shadow-2xs active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f8f3e6] dark:bg-slate-700 border border-[#c5a059] flex items-center justify-center font-bold text-xs font-reem text-[#1e4d2b] dark:text-[#c5a059]">
                    {toArabicNumerals(hizbNum)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-reem text-[#1e4d2b] dark:text-[#fdfaf2]">
                      الحزب {toArabicNumerals(hizbNum)}
                    </h3>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 font-reem">
                      سورة {relatedSurah.name} • الجزء {toArabicNumerals(Math.ceil(hizbNum / 2))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-1 rounded-xl bg-[#f8f3e6] dark:bg-slate-700 text-[#8b6e31] dark:text-[#e9d19a] text-xs font-bold font-reem border border-[#e9d19a]">
                    ص {toArabicNumerals(approxPage)}
                  </span>
                  <ChevronLeft className="w-4 h-4 text-stone-400" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Text Search Results */}
      {segment === 'search' && (
        <div className="space-y-2">
          {isSearchingText ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <div className="w-8 h-8 border-3 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-reem text-[#8b6e31] dark:text-[#e9d19a]">
                جاري البحث في آيات القرآن الكريم...
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-600 dark:text-stone-300 font-reem px-1">
                تم العثور على {toArabicNumerals(searchResults.length)} آية مطابقة:
              </div>

              {searchResults.map((ayah) => (
                <div
                  key={ayah.number}
                  onClick={() => onSelectPage(ayah.page)}
                  className="p-3 bg-white dark:bg-slate-800 border border-[#e9d19a] hover:border-[#1e4d2b] rounded-2xl cursor-pointer space-y-1.5 shadow-2xs active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#1e4d2b] dark:text-[#c5a059] font-reem">
                    <span>
                      سورة {fixArabicText(ayah.surahName)} - آية {toArabicNumerals(ayah.numberInSurah)}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-[#f8f3e6] dark:bg-slate-700 text-[10px] font-bold border border-[#e9d19a]">
                      صفحة {toArabicNumerals(ayah.page)}
                    </span>
                  </div>

                  <p className="font-quran text-sm text-[#1a1a1a] dark:text-[#fdfaf2] leading-relaxed select-text">
                    {ayah.text}
                  </p>
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="text-center py-12 space-y-2">
              <span className="text-2xl">🔍</span>
              <p className="text-xs font-reem text-stone-500 dark:text-stone-400">
                لم يتم العثور على نتائج مطابقة للبحث «{searchQuery}».
              </p>
            </div>
          ) : (
            <div className="text-center py-10 space-y-2">
              <span className="text-3xl">📖</span>
              <p className="text-xs font-reem text-stone-500 dark:text-stone-400">
                اكتب أي كلمة في شريط البحث أعلاه واضغط على زر "بحث".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
