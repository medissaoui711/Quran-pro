import React, { useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Bookmark,
  Volume2,
  Search,
  Sparkles,
  Sliders,
  Layers,
} from 'lucide-react';
import { Ayah, QuranPageData, PaperTheme } from '../../types/quran';
import { MushafPageView } from '../MushafPageView';
import { toArabicNumerals } from '../../services/quranApi';
import { fixArabicText } from '../../services/arabicSanitizer';
import { useQuranSwipe } from '../../hooks/useQuranSwipe';

interface MobileReaderViewProps {
  pageData: QuranPageData | null;
  loading: boolean;
  theme: PaperTheme;
  activeAyahNumber: number | null;
  onAyahClick: (ayah: Ayah) => void;
  renderMode: 'image' | 'text';
  fontSize: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  isImmersive: boolean;
  onToggleImmersive: () => void;
  isPageBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const MobileReaderView: React.FC<MobileReaderViewProps> = ({
  pageData,
  loading,
  theme,
  activeAyahNumber,
  onAyahClick,
  renderMode,
  fontSize,
  onPrevPage,
  onNextPage,
  onGoToPage,
  isImmersive,
  onToggleImmersive,
  isPageBookmarked,
  onToggleBookmark,
}) => {
  const [showPagePicker, setShowPagePicker] = useState<boolean>(false);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  // Unified Touch & Mouse gestures for RTL Quran page turning
  const swipeHandlers = useQuranSwipe({
    onNextPage,
    onPrevPage,
    threshold: 35,
  });

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= 604) {
      onGoToPage(pageNum);
      setShowPagePicker(false);
      setJumpPageInput('');
    }
  };

  const currentPage = pageData?.pageNumber || 1;
  const juzNumber = pageData?.juzNumber || 1;
  const surahName = pageData?.surahNames?.[0] || 'الفاتحة';

  return (
    <div
      className="relative w-full min-h-[calc(100vh-3.5rem)] flex flex-col justify-between select-none overflow-hidden touch-pan-y"
      {...swipeHandlers}
      dir="rtl"
    >
      {/* Top Floating Immersive Status Header (Visible especially during Immersive Reading Mode) */}
      <div
        className={`w-full flex items-center justify-between px-3 py-1.5 z-30 transition-all duration-300 ${
          isImmersive
            ? 'bg-[#1e4d2b]/95 text-[#fdfaf2] backdrop-blur-md border-b border-[#c5a059]/40 shadow-sm'
            : 'bg-transparent text-stone-700 dark:text-stone-300'
        }`}
      >
        <div className="flex items-center gap-1.5 text-xs font-reem">
          <span className="font-bold text-[#1e4d2b] dark:text-[#c5a059]">
            الجزء {toArabicNumerals(juzNumber)}
          </span>
          <span>•</span>
          <span className="text-stone-600 dark:text-stone-300 font-bold">
            سورة {fixArabicText(surahName)}
          </span>
        </div>

        {/* Quick Reader Header Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleBookmark}
            className={`p-1.5 rounded-lg text-xs font-reem transition-all ${
              isPageBookmarked
                ? 'bg-[#c5a059] text-[#1e4d2b]'
                : 'text-stone-500 hover:text-[#1e4d2b] dark:text-stone-400'
            }`}
            title="حفظ الصفحة"
          >
            <Bookmark className="w-3.5 h-3.5" fill={isPageBookmarked ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={onToggleImmersive}
            className="p-1.5 rounded-lg text-stone-500 hover:text-[#1e4d2b] dark:text-stone-400 text-xs font-reem"
            title={isImmersive ? 'إظهار شريط التنقل' : 'إخفاء الأشرطة للقراءة'}
          >
            {isImmersive ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Quran Canvas Area */}
      <div className="flex-1 w-full flex items-center justify-center p-1 sm:p-2 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-10 h-10 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-reem text-[#8b6e31] dark:text-[#e9d19a]">
              جاري تحميل صفحة المصحف الشريف...
            </p>
          </div>
        ) : pageData ? (
          <div className="w-full max-w-lg shadow-md rounded-xl overflow-hidden border border-[#e9d19a]/50">
            <MushafPageView
              pageData={pageData}
              theme={theme}
              activeAyahNumber={activeAyahNumber}
              onAyahClick={onAyahClick}
              renderMode={renderMode}
              fontSize={fontSize}
            />
          </div>
        ) : null}
      </div>

      {/* Floating Bottom Quick Pagination Scrubber Pill */}
      <div className="sticky bottom-20 inset-x-0 z-30 flex items-center justify-center pointer-events-none px-4 mb-1">
        <div className="pointer-events-auto bg-[#1e4d2b]/95 backdrop-blur-md text-[#fdfaf2] border-2 border-[#c5a059] shadow-xl rounded-full px-3 py-1.5 flex items-center gap-3 text-xs font-reem">
          {/* Previous Page (RTL Next arrow points Right) */}
          <button
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-full hover:bg-[#c5a059] hover:text-[#1e4d2b] disabled:opacity-30 active:scale-90 transition-all"
            title="الصفحة السابقة"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Page Indicator (Clickable to jump) */}
          <button
            onClick={() => setShowPagePicker(true)}
            className="px-2.5 py-0.5 rounded-full bg-[#15341d] border border-[#c5a059]/60 hover:border-[#c5a059] font-bold text-[#e9d19a] active:scale-95 transition-all text-xs flex items-center gap-1"
            title="انقر للانتقال المباشر لرقم صفحة"
          >
            <span>ص {toArabicNumerals(currentPage)}</span>
            <span className="text-[10px] text-stone-400">/ ٦٠٤</span>
          </button>

          {/* Next Page (RTL Next arrow points Left) */}
          <button
            onClick={onNextPage}
            disabled={currentPage >= 604}
            className="p-1.5 rounded-full hover:bg-[#c5a059] hover:text-[#1e4d2b] disabled:opacity-30 active:scale-90 transition-all"
            title="الصفحة التالية"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Direct Page Jump Bottom Modal */}
      {showPagePicker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xs bg-white dark:bg-[#151b23] border-2 border-[#c5a059] rounded-2xl p-4 shadow-2xl space-y-3">
            <h4 className="text-xs font-bold font-reem text-[#1e4d2b] dark:text-[#c5a059] text-center">
              الانتقال المباشر إلى صفحة (١ - ٦٠٤)
            </h4>

            <form onSubmit={handleJumpSubmit} className="space-y-3">
              <input
                type="number"
                min="1"
                max="604"
                autoFocus
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                placeholder="أدخل رقم الصفحة..."
                className="w-full px-3 py-2 text-center text-sm font-bold bg-[#fdfaf2] dark:bg-slate-800 border-2 border-[#c5a059] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#1e4d2b] text-[#fdfaf2] rounded-xl font-bold font-reem text-xs border border-[#c5a059] hover:bg-[#15341d]"
                >
                  انتقال
                </button>
                <button
                  type="button"
                  onClick={() => setShowPagePicker(false)}
                  className="w-full py-2 bg-stone-200 dark:bg-slate-700 text-stone-700 dark:text-stone-200 rounded-xl font-reem text-xs hover:bg-stone-300"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
