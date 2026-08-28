import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Maximize2, Minimize2, Bookmark as BookmarkIcon, Volume2, BookOpen, Layers } from 'lucide-react';
import { QuranPageData, PaperTheme, ViewMode, Ayah } from '../types/quran';
import { MushafPageView } from './MushafPageView';
import { toArabicNumerals } from '../services/quranApi';
import { SURAHS, getJuzForPage } from '../data/quranMetadata';
import { useQuranSwipe } from '../hooks/useQuranSwipe';
import { useScrollResetOnPageChange } from '../hooks/useScrollResetOnPageChange';

interface MushafBookProps {
  rightPageData: QuranPageData;
  leftPageData: QuranPageData | null;
  currentPage: number;
  totalPages?: number;
  viewMode: ViewMode;
  theme: PaperTheme;
  renderMode: 'image' | 'text';
  fontSize: number;
  activeAyahNumber: number | null;
  onPageChange: (newPage: number) => void;
  onAyahClick: (ayah: Ayah) => void;
  onBookmarkCurrentPage: () => void;
  isBookmarked: boolean;
  onOpenAudio: () => void;
  onOpenIndex: () => void;
}

export const MushafBook: React.FC<MushafBookProps> = ({
  rightPageData,
  leftPageData,
  currentPage,
  totalPages = 604,
  viewMode,
  theme,
  renderMode,
  fontSize,
  activeAyahNumber,
  onPageChange,
  onAyahClick,
  onBookmarkCurrentPage,
  isBookmarked,
  onOpenAudio,
  onOpenIndex,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard navigation (Left/Right keys for Quran navigation)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        // Next page in Arabic RTL Quran
        handleNext();
      } else if (e.key === 'ArrowRight') {
        // Previous page in Arabic RTL Quran
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, viewMode]);

  // Guaranteed scroll reset for desktop/tablet layout on page transition
  useScrollResetOnPageChange(currentPage);

  const handleNext = () => {
    const step = viewMode === 'spread' && currentPage > 1 ? 2 : 1;
    if (currentPage + step <= totalPages) {
      onPageChange(currentPage + step);
    } else if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  };

  const handlePrev = () => {
    const step = viewMode === 'spread' && currentPage > 2 ? 2 : 1;
    if (currentPage - step >= 1) {
      onPageChange(currentPage - step);
    } else if (currentPage > 1) {
      onPageChange(1);
    }
  };

  const currentJuz = getJuzForPage(currentPage);
  const currentSurah = rightPageData.surahNames[0] || 'الفاتحة';

  // Support touch & mouse swipe on desktop/tablets
  const swipeHandlers = useQuranSwipe({
    onNextPage: handleNext,
    onPrevPage: handlePrev,
    threshold: 40,
  });

  return (
    <div className="w-full flex flex-col items-center justify-center select-none py-2 px-1 sm:px-4">
      {/* Top Floating Controls Bar in Natural Tones theme */}
      <div 
        className="w-full max-w-5xl flex items-center justify-between px-3.5 py-2 mb-2 rounded-xl border-2 text-[#fdfaf2] shadow-md transition-colors duration-300"
        style={{
          backgroundColor: '#1e4d2b',
          borderColor: '#c5a059',
        }}
      >
        {/* Right Info: Surah & Juz Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenIndex}
            className="flex items-center gap-1.5 px-3 py-1 text-xs sm:text-sm font-reem bg-[#15341d] text-[#e9d19a] hover:bg-[#c5a059] hover:text-[#1e4d2b] border border-[#c5a059]/40 rounded-lg transition-colors font-bold shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-[#c5a059]" />
            <span>سورة {currentSurah}</span>
          </button>

          <span className="hidden sm:inline-block text-xs text-[#e9d19a] font-reem bg-[#15341d] px-2.5 py-1 rounded-md border border-[#c5a059]/30">
            الجزء {toArabicNumerals(currentJuz)}
          </span>
        </div>

        {/* Center Page Indicator */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#e9d19a] font-reem">
          <span>صفحة {toArabicNumerals(currentPage)}</span>
          {viewMode === 'spread' && leftPageData && (
            <span> - {toArabicNumerals(leftPageData.pageNumber)}</span>
          )}
          <span className="text-[#e9d19a]/70 text-xs">/ {toArabicNumerals(totalPages)}</span>
        </div>

        {/* Left Actions: Bookmark, Audio, Fullscreen */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onBookmarkCurrentPage}
            className={`p-1.5 sm:p-2 rounded-lg border transition-all ${
              isBookmarked
                ? 'bg-[#c5a059] text-[#1e4d2b] border-[#8b6e31] shadow-xs'
                : 'bg-[#15341d] text-[#e9d19a] border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-[#1e4d2b]'
            }`}
            title="حفظ علامة القراءة الحالية"
          >
            <BookmarkIcon className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={onOpenAudio}
            className="p-1.5 sm:p-2 rounded-lg bg-[#15341d] text-[#e9d19a] border border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-[#1e4d2b] transition-colors"
            title="التلاوة والاستماع الصوتي"
          >
            <Volume2 className="w-4 h-4 text-[#c5a059]" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 rounded-lg bg-[#15341d] text-[#e9d19a] border border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-[#1e4d2b] transition-colors hidden sm:flex"
            title="ملء الشاشة"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Authentic Book Display Area */}
      <div className="relative w-full max-w-5xl flex items-center justify-center">
        
        {/* Right Arrow (Previous page in RTL Quran) */}
        <button
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className="absolute -right-2 sm:-right-5 md:-right-8 top-1/2 -translate-y-1/2 z-30 w-8 h-12 sm:w-11 sm:h-16 flex items-center justify-center rounded-r-xl bg-[#1e4d2b] hover:bg-[#c5a059] text-[#c5a059] hover:text-[#1e4d2b] border-2 border-[#c5a059] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xl"
          title="الصفحة السابقة (السهم الأيمن)"
          aria-label="Previous Page"
        >
          <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>

        {/* Book Spine / Cover Container with 3D Effect */}
        <div 
          className="relative w-full book-outer-shadow rounded-lg p-1.5 sm:p-3 bg-[#241a10] border-4 border-[#c5a059] transition-all duration-300 touch-pan-y cursor-grab active:cursor-grabbing"
          {...swipeHandlers}
        >
          
          {/* Subtle Leather Texture Grain & Stitching */}
          <div className="w-full rounded border border-[#c5a059]/40 overflow-hidden bg-[#1c140d]">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`page-spread-${currentPage}-${viewMode}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="w-full flex flex-col md:flex-row items-stretch justify-center relative min-h-[580px] sm:min-h-[720px] md:min-h-[800px]"
              >
                {/* Right Page (In Arabic Mushaf Spread) */}
                <div
                  className={`w-full ${
                    viewMode === 'spread' && leftPageData ? 'md:w-1/2 border-l border-[#c5a059]/40' : 'w-full'
                  } flex flex-col`}
                >
                  <MushafPageView
                    pageData={rightPageData}
                    theme={theme}
                    renderMode={renderMode}
                    fontSize={fontSize}
                    activeAyahNumber={activeAyahNumber}
                    onAyahClick={onAyahClick}
                  />
                </div>

                {/* Book Center Binding / Spine Divider in Spread View */}
                {viewMode === 'spread' && leftPageData && (
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-3 -translate-x-1/2 z-20 pointer-events-none bg-gradient-to-r from-black/40 via-black/10 to-black/40 shadow-inner" />
                )}

                {/* Left Page (Only in Double Page Spread mode on larger screens) */}
                {viewMode === 'spread' && leftPageData && (
                  <div className="hidden md:flex md:w-1/2 flex-col">
                    <MushafPageView
                      pageData={leftPageData}
                      theme={theme}
                      renderMode={renderMode}
                      fontSize={fontSize}
                      activeAyahNumber={activeAyahNumber}
                      onAyahClick={onAyahClick}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* Left Arrow (Next page in RTL Quran) */}
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="absolute -left-2 sm:-left-5 md:-left-8 top-1/2 -translate-y-1/2 z-30 w-8 h-12 sm:w-11 sm:h-16 flex items-center justify-center rounded-l-xl bg-[#1e4d2b] hover:bg-[#c5a059] text-[#c5a059] hover:text-[#1e4d2b] border-2 border-[#c5a059] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xl"
          title="الصفحة التالية (السهم الأيسر)"
          aria-label="Next Page"
        >
          <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* Bottom Page Navigation Slider & Fast Jumper in Natural Tones */}
      <div 
        className="w-full max-w-4xl mt-3 px-4 py-2.5 rounded-xl border-2 flex flex-col sm:flex-row items-center gap-3 shadow-md"
        style={{
          backgroundColor: '#1e4d2b',
          borderColor: '#c5a059',
        }}
      >
        <span className="text-xs text-[#e9d19a] font-reem whitespace-nowrap font-bold">
          الانتقال المباشر بالصفحات:
        </span>
        
        {/* Slider input */}
        <input
          type="range"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => onPageChange(parseInt(e.target.value, 10))}
          className="w-full accent-[#c5a059] h-2 bg-[#15341d] rounded-lg cursor-pointer transition-all border border-[#c5a059]/30"
        />

        {/* Direct page number input */}
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (val >= 1 && val <= totalPages) {
                onPageChange(val);
              }
            }}
            className="w-16 px-2 py-1 text-center font-bold text-xs sm:text-sm bg-[#15341d] text-[#e9d19a] border border-[#c5a059] rounded-lg focus:outline-none focus:border-[#e9d19a] font-reem"
          />
          <span className="text-xs text-[#e9d19a]/80 font-reem">من ٦٠٤</span>
        </div>
      </div>
    </div>
  );
};
