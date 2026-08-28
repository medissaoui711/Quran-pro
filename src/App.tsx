/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Ayah } from './types/quran';
import { AudioProvider } from './context/AudioContext';
import { MobileAppShell } from './components/mobile/MobileAppShell';
import { DesktopLayout } from './components/layout/DesktopLayout';
import { AppModalsContainer } from './components/layout/AppModalsContainer';
import { useThemePreferences } from './hooks/useThemePreferences';
import { useQuranPageData } from './hooks/useQuranPageData';
import { useBookmarks } from './hooks/useBookmarks';
import { useKhatma } from './hooks/useKhatma';
import { useAudioPlaybackSync } from './hooks/useAudioPlaybackSync';

function MushafAppContent() {
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // User preferences & viewport configuration
  const {
    isMobile,
    theme,
    setTheme,
    toggleTheme,
    renderMode,
    setRenderMode,
    toggleRenderMode,
    fontSize,
    setFontSize,
    changeFontSize,
    viewMode,
    setViewMode,
    toggleViewMode,
  } = useThemePreferences();

  // Quran pagination & data caching engine
  const {
    currentPage,
    handlePageChange,
    rightPageData,
    leftPageData,
    isLoadingPage,
  } = useQuranPageData(viewMode, isMobile);

  // Ayah detail selection modal state
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [isAyahDetailOpen, setIsAyahDetailOpen] = useState<boolean>(false);

  const handleAyahClick = (ayah: Ayah) => {
    setSelectedAyah(ayah);
    setIsAyahDetailOpen(true);
  };

  // Bookmarks management
  const {
    bookmarks,
    handleBookmarkCurrentPage,
    handleAddBookmark,
    handleDeleteBookmark,
    isPageBookmarked,
    isAyahBookmarked,
  } = useBookmarks(showToast);

  // Khatma progress tracker
  const {
    khatma,
    updateKhatmaDays,
    recordDailyProgress,
    updateKhatma,
  } = useKhatma(showToast);

  // Audio recitation playback synchronization
  const {
    activeAudioAyah,
    activeAyahNumber,
    isPlayingAudio,
    playAyah,
    openAudioSheet,
    handlePlayAyahAudio,
  } = useAudioPlaybackSync({
    rightPageData,
    leftPageData,
    currentPage,
    viewMode,
    isMobile,
    onPageChange: handlePageChange,
    onSelectAyah: setSelectedAyah,
  });

  // Desktop Drawers & Modals state
  const [isIndexOpen, setIsIndexOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isKhatmaOpen, setIsKhatmaOpen] = useState<boolean>(false);

  // Dedicated Mobile Shell for Handheld Viewports
  if (isMobile) {
    return (
      <div className="w-full min-h-screen overflow-x-hidden">
        <MobileAppShell
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pageData={rightPageData}
          loading={isLoadingPage}
          theme={theme}
          onToggleTheme={toggleTheme}
          onChangeTheme={setTheme}
          renderMode={renderMode}
          onChangeRenderMode={setRenderMode}
          fontSize={fontSize}
          onChangeFontSize={setFontSize}
          activeAyahNumber={activeAyahNumber}
          selectedAyah={isAyahDetailOpen ? selectedAyah : null}
          onAyahClick={handleAyahClick}
          onCloseAyahSheet={() => setIsAyahDetailOpen(false)}
          bookmarks={bookmarks}
          onAddBookmark={handleAddBookmark}
          onDeleteBookmark={handleDeleteBookmark}
          onTogglePageBookmark={() => handleBookmarkCurrentPage(currentPage, rightPageData)}
          isPageBookmarked={isPageBookmarked(currentPage)}
          isAyahBookmarked={isAyahBookmarked(selectedAyah)}
          khatma={khatma}
          onUpdateKhatmaDays={updateKhatmaDays}
          onRecordDailyProgress={recordDailyProgress}
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#1e4d2b] text-[#fdfaf2] border border-[#c5a059] rounded-xl shadow-xl font-reem text-xs font-bold animate-bounce text-center">
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  // Desktop & Tablet Presentation Flow
  return (
    <>
      <DesktopLayout
        theme={theme}
        renderMode={renderMode}
        viewMode={viewMode}
        fontSize={fontSize}
        currentPage={currentPage}
        bookmarksCount={bookmarks.length}
        rightPageData={rightPageData}
        leftPageData={leftPageData}
        isLoadingPage={isLoadingPage}
        activeAyahNumber={activeAyahNumber}
        isBookmarked={isPageBookmarked(currentPage)}
        toastMessage={toastMessage}
        onOpenIndex={() => setIsIndexOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenKhatma={() => setIsKhatmaOpen(true)}
        onOpenAudio={() => {
          if (activeAudioAyah) {
            openAudioSheet();
          } else if (rightPageData && rightPageData.ayahs.length > 0) {
            playAyah(rightPageData.ayahs[0]);
          }
        }}
        onToggleViewMode={toggleViewMode}
        onToggleRenderMode={toggleRenderMode}
        onToggleTheme={toggleTheme}
        onChangeFontSize={changeFontSize}
        onPageChange={handlePageChange}
        onAyahClick={handleAyahClick}
        onBookmarkCurrentPage={() => handleBookmarkCurrentPage(currentPage, rightPageData)}
        onPlayAyahAudio={handlePlayAyahAudio}
      />

      <AppModalsContainer
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isIndexOpen={isIndexOpen}
        onCloseIndex={() => setIsIndexOpen(false)}
        selectedAyah={selectedAyah}
        isAyahDetailOpen={isAyahDetailOpen}
        onCloseAyahDetail={() => setIsAyahDetailOpen(false)}
        onPlayAyahAudio={handlePlayAyahAudio}
        isPlayingAudio={isPlayingAudio}
        activeAyahNumber={activeAyahNumber}
        onAddBookmark={handleAddBookmark}
        isAyahBookmarked={isAyahBookmarked(selectedAyah)}
        isKhatmaOpen={isKhatmaOpen}
        onCloseKhatma={() => setIsKhatmaOpen(false)}
        khatma={khatma}
        onUpdateKhatma={updateKhatma}
        isBookmarksOpen={isBookmarksOpen}
        onCloseBookmarks={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onDeleteBookmark={handleDeleteBookmark}
      />
    </>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <MushafAppContent />
    </AudioProvider>
  );
}
