import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, Layers, Bookmark, CheckCircle2, ArrowRight } from 'lucide-react';
import { SURAHS, JUZ_LIST } from '../data/quranMetadata';
import { toArabicNumerals, searchQuran } from '../services/quranApi';
import { fixArabicText } from '../services/arabicSanitizer';
import { Ayah } from '../types/quran';

interface SurahIndexDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSurah: (startPage: number) => void;
  onSelectJuz: (pageNumber: number) => void;
  onSelectAyah: (pageNumber: number, ayahNumber: number) => void;
  currentPage: number;
}

export const SurahIndexDrawer: React.FC<SurahIndexDrawerProps> = ({
  isOpen,
  onClose,
  onSelectSurah,
  onSelectJuz,
  onSelectAyah,
  currentPage,
}) => {
  const [activeTab, setActiveTab] = useState<'surahs' | 'juz' | 'search'>('surahs');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Ayah[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Filtered surahs list
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return SURAHS;
    const q = searchQuery.trim().toLowerCase();
    return SURAHS.filter(
      (s) =>
        s.name.includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        String(s.number).includes(q)
    );
  }, [searchQuery]);

  // Execute Quran Text Search
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;
    setIsSearching(true);
    try {
      const results = await searchQuran(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      <div 
        className="w-full max-w-md h-full bg-[#fdfaf2] dark:bg-[#151b23] border-l-4 border-[#c5a059] flex flex-col shadow-2xl overflow-hidden transition-all duration-300"
        dir="rtl"
      >
        {/* Drawer Header with Natural Tones */}
        <div className="px-5 py-4 bg-[#15341d] dark:bg-[#0e1410] text-[#fdfaf2] flex items-center justify-between border-b-2 border-[#c5a059]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#c5a059]" />
            <h2 className="text-lg font-bold font-reem">فهرس المصحف الشريف</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#0a2312] dark:bg-[#1a231d] hover:bg-[#c5a059] hover:text-[#1e4d2b] transition-colors border border-[#c5a059]/40"
            title="إغلاق الفهرس"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#e9d19a] bg-[#f8f3e6] dark:bg-slate-900 text-xs sm:text-sm font-reem">
          <button
            onClick={() => setActiveTab('surahs')}
            className={`flex-1 py-3 text-center font-bold transition-all border-b-2 ${
              activeTab === 'surahs'
                ? 'border-[#1e4d2b] text-[#1e4d2b] dark:text-[#c5a059] bg-[#fdfaf2] dark:bg-[#151b23]'
                : 'border-transparent text-[#8b6e31] hover:text-[#1e4d2b]'
            }`}
          >
            السور ({toArabicNumerals(114)})
          </button>
          <button
            onClick={() => setActiveTab('juz')}
            className={`flex-1 py-3 text-center font-bold transition-all border-b-2 ${
              activeTab === 'juz'
                ? 'border-[#1e4d2b] text-[#1e4d2b] dark:text-[#c5a059] bg-[#fdfaf2] dark:bg-[#151b23]'
                : 'border-transparent text-[#8b6e31] hover:text-[#1e4d2b]'
            }`}
          >
            الأجزاء ({toArabicNumerals(30)})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 text-center font-bold transition-all border-b-2 ${
              activeTab === 'search'
                ? 'border-[#1e4d2b] text-[#1e4d2b] dark:text-[#c5a059] bg-[#fdfaf2] dark:bg-[#151b23]'
                : 'border-transparent text-[#8b6e31] hover:text-[#1e4d2b]'
            }`}
          >
            البحث في الآيات
          </button>
        </div>

        {/* Search Input Bar for Surahs / Verses */}
        <div className="p-3 border-b border-[#e9d19a]/60 bg-[#fdfaf2] dark:bg-[#151b23]">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'search'
                  ? 'اكتب كلمة أو آية للبحث (مثال: قل هو الله)...'
                  : 'ابحث عن اسم السورة أو رقمها...'
              }
              className="w-full pr-10 pl-16 py-2 text-sm bg-white dark:bg-slate-800 text-[#1a1a1a] dark:text-[#fdfaf2] border-2 border-[#c5a059]/60 rounded-lg focus:outline-none focus:border-[#1e4d2b] font-reem placeholder:text-stone-400"
            />
            <Search className="absolute right-3 w-4 h-4 text-[#8b6e31]" />
            {activeTab === 'search' && (
              <button
                type="submit"
                className="absolute left-1.5 px-3 py-1 bg-[#1e4d2b] text-[#fdfaf2] text-xs font-bold rounded hover:bg-[#15341d] transition-colors"
              >
                {isSearching ? 'جاري...' : 'بحث'}
              </button>
            )}
          </form>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* TAB 1: SURAHS INDEX */}
          {activeTab === 'surahs' && (
            <div className="space-y-1">
              {filteredSurahs.map((surah) => {
                const isCurrent =
                  currentPage >= surah.startPage && currentPage <= surah.endPage;

                return (
                  <div
                    key={surah.number}
                    onClick={() => {
                      onSelectSurah(surah.startPage);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border ${
                      isCurrent
                        ? 'bg-[#1e4d2b] text-[#fdfaf2] border-[#c5a059] shadow-md'
                        : 'bg-white/80 dark:bg-slate-800/80 text-[#1a1a1a] dark:text-[#fdfaf2] border-[#e9d19a]/50 hover:bg-[#f4ede1] dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Surah Number Medallion */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${
                          isCurrent
                            ? 'bg-[#c5a059] text-[#1e4d2b] border-[#fdfaf2]'
                            : 'bg-[#f4ede1] dark:bg-slate-900 text-[#8b6e31] border-[#c5a059]'
                        }`}
                      >
                        {toArabicNumerals(surah.number)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base font-quran">
                            سورة {fixArabicText(surah.name)}
                          </h3>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-reem ${
                              isCurrent
                                ? 'bg-[#15341d] text-[#c5a059]'
                                : 'bg-[#e9d19a]/40 text-[#8b6e31] dark:text-amber-300'
                            }`}
                          >
                            {surah.revelationPlaceArabic}
                          </span>
                        </div>
                        <p
                          className={`text-xs font-reem ${
                            isCurrent ? 'text-[#e9d19a]' : 'text-[#8b6e31] dark:text-stone-400'
                          }`}
                        >
                          {toArabicNumerals(surah.numberOfAyahs)} آية • الجزء{' '}
                          {toArabicNumerals(surah.juz)}
                        </p>
                      </div>
                    </div>

                    <div className="text-left flex flex-col items-end">
                      <span
                        className={`text-xs font-bold font-reem ${
                          isCurrent ? 'text-[#fdfaf2]' : 'text-[#1e4d2b] dark:text-amber-400'
                        }`}
                      >
                        صفحة {toArabicNumerals(surah.startPage)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: JUZ & HIZB INDEX */}
          {activeTab === 'juz' && (
            <div className="space-y-2">
              {JUZ_LIST.map((juz, idx) => {
                const nextPage = idx < JUZ_LIST.length - 1 ? JUZ_LIST[idx + 1].startPage - 1 : 604;
                return (
                  <div
                    key={juz.juzNumber}
                    onClick={() => {
                      onSelectJuz(juz.startPage);
                      onClose();
                    }}
                    className="p-3 bg-white/90 dark:bg-slate-800 rounded-lg border border-[#e9d19a] hover:border-[#1e4d2b] hover:bg-[#f4ede1] dark:hover:bg-slate-700 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded bg-[#1e4d2b] text-[#fdfaf2] flex items-center justify-center font-bold text-xs font-reem">
                          {toArabicNumerals(juz.juzNumber)}
                        </span>
                        <h3 className="font-bold text-sm text-[#1e4d2b] dark:text-[#c5a059] font-reem">
                          {fixArabicText(juz.name)}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-[#8b6e31] dark:text-stone-300 font-reem">
                        ص {toArabicNumerals(juz.startPage)} - {toArabicNumerals(nextPage)}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-300 font-reem line-clamp-1 pr-10">
                      يبدأ من سورة {fixArabicText(juz.startSurah)} (الآية {toArabicNumerals(juz.startAyah)})
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: AYAH FULL TEXT SEARCH */}
          {activeTab === 'search' && (
            <div className="space-y-2">
              {isSearching && (
                <div className="p-8 text-center text-[#8b6e31] font-reem animate-pulse">
                  جاري البحث في المصحف الشريف...
                </div>
              )}

              {!isSearching && searchResults.length === 0 && (
                <div className="p-8 text-center text-stone-500 dark:text-stone-400 font-reem text-sm">
                  {searchQuery
                    ? 'لم يتم العثور على نتائج للبحث. جرب كتابة كلمة أخرى بدون تشكيل.'
                    : 'اكتب كلمة في مربع البحث أعلاه ثم اضغط على زر "بحث" لعرض جميع الآيات المطابقة.'}
                </div>
              )}

              {!isSearching &&
                searchResults.map((ayah) => (
                  <div
                    key={ayah.number}
                    onClick={() => {
                      onSelectAyah(ayah.page, ayah.number);
                      onClose();
                    }}
                    className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-[#e9d19a] hover:border-[#1e4d2b] hover:bg-[#f4ede1] dark:hover:bg-slate-700 cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-[#8b6e31] dark:text-[#c5a059] font-reem">
                      <span className="font-bold text-[#1e4d2b] dark:text-amber-300">
                        سورة {fixArabicText(ayah.surahName)} - الآية {toArabicNumerals(ayah.numberInSurah)}
                      </span>
                      <span>صفحة {toArabicNumerals(ayah.page)}</span>
                    </div>
                    <p className="text-sm font-quran text-[#1a1a1a] dark:text-[#fdfaf2] leading-relaxed">
                      {ayah.text}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Bottom Fast Jump Bar */}
        <div className="p-3 bg-[#f8f3e6] dark:bg-slate-900 border-t border-[#e9d19a] flex items-center justify-between text-xs font-reem text-[#8b6e31]">
          <span>الصفحة الحالية: {toArabicNumerals(currentPage)} من ٦٠٤</span>
          <button
            onClick={() => {
              onSelectSurah(1);
              onClose();
            }}
            className="px-3 py-1 bg-[#1e4d2b] text-[#fdfaf2] rounded hover:bg-[#15341d] transition-colors"
          >
            بداية المصحف (الفاتحة)
          </button>
        </div>
      </div>
    </div>
  );
};
