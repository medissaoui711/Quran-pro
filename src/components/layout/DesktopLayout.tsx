import React from 'react';
import { HeaderNav } from '../HeaderNav';
import { MushafBook } from '../MushafBook';
import { QuranPageData, PaperTheme, ViewMode, Ayah } from '../../types/quran';

interface DesktopLayoutProps {
  theme: PaperTheme;
  renderMode: 'image' | 'text';
  viewMode: ViewMode;
  fontSize: number;
  currentPage: number;
  bookmarksCount: number;
  rightPageData: QuranPageData | null;
  leftPageData: QuranPageData | null;
  isLoadingPage: boolean;
  activeAyahNumber: number | null;
  isBookmarked: boolean;
  toastMessage: string | null;
  onOpenIndex: () => void;
  onOpenBookmarks: () => void;
  onOpenKhatma: () => void;
  onOpenAudio: () => void;
  onToggleViewMode: () => void;
  onToggleRenderMode: () => void;
  onToggleTheme: () => void;
  onChangeFontSize: (delta: number) => void;
  onPageChange: (page: number) => void;
  onAyahClick: (ayah: Ayah) => void;
  onBookmarkCurrentPage: () => void;
  onPlayAyahAudio: (ayah: Ayah) => void;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  theme,
  renderMode,
  viewMode,
  fontSize,
  currentPage,
  bookmarksCount,
  rightPageData,
  leftPageData,
  isLoadingPage,
  activeAyahNumber,
  isBookmarked,
  toastMessage,
  onOpenIndex,
  onOpenBookmarks,
  onOpenKhatma,
  onOpenAudio,
  onToggleViewMode,
  onToggleRenderMode,
  onToggleTheme,
  onChangeFontSize,
  onPageChange,
  onAyahClick,
  onBookmarkCurrentPage,
  onPlayAyahAudio,
}) => {
  return (
    <div
      className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#0e1217] text-slate-100' : 'bg-[#f4ede1] text-[#1a1a1a]'
      }`}
      style={{
        backgroundImage:
          theme === 'dark'
            ? 'radial-gradient(#1e293b 1px, transparent 1px)'
            : 'radial-gradient(#c5a059 0.75px, #f4ede1 0.75px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Top Main Navigation */}
      <HeaderNav
        onOpenIndex={onOpenIndex}
        onOpenBookmarks={onOpenBookmarks}
        onOpenKhatma={onOpenKhatma}
        onOpenAudio={onOpenAudio}
        viewMode={viewMode}
        onToggleViewMode={onToggleViewMode}
        renderMode={renderMode}
        onToggleRenderMode={onToggleRenderMode}
        theme={theme}
        onToggleTheme={onToggleTheme}
        fontSize={fontSize}
        onChangeFontSize={onChangeFontSize}
        currentPage={currentPage}
        onJumpToPage={onPageChange}
        totalPages={604}
        bookmarksCount={bookmarksCount}
      />

      {/* Main Mushaf Content Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 max-w-7xl mx-auto w-full">
        {isLoadingPage || !rightPageData ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#c5a059] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-reem text-[#8b6e31] dark:text-[#e9d19a] text-sm">
              جاري فتح صفحة المصحف الشريف...
            </p>
          </div>
        ) : (
          <MushafBook
            rightPageData={rightPageData}
            leftPageData={leftPageData}
            currentPage={currentPage}
            totalPages={604}
            viewMode={viewMode}
            theme={theme}
            renderMode={renderMode}
            fontSize={fontSize}
            activeAyahNumber={activeAyahNumber}
            onPageChange={onPageChange}
            onAyahClick={onAyahClick}
            onBookmarkCurrentPage={onBookmarkCurrentPage}
            isBookmarked={isBookmarked}
            onOpenAudio={() => {
              if (rightPageData.ayahs.length > 0) {
                onPlayAyahAudio(rightPageData.ayahs[0]);
              }
            }}
            onOpenIndex={onOpenIndex}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-[#1e4d2b] text-[#fdfaf2] border-2 border-[#c5a059] rounded-xl shadow-2xl font-reem text-xs sm:text-sm font-bold animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
