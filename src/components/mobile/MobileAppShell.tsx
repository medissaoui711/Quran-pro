import React, { useState } from 'react';
import { MobileBottomNavigation, MobileTab } from './MobileBottomNavigation';
import { MobileHeader } from './MobileHeader';
import { MobileHomeView } from './MobileHomeView';
import { MobileReaderView } from './MobileReaderView';
import { MobileIndexView } from './MobileIndexView';
import { MobileBookmarksView } from './MobileBookmarksView';
import { MobileMoreSettingsView } from './MobileMoreSettingsView';
import { MobileAyahBottomSheet } from './MobileAyahBottomSheet';
import { MobileAudioMiniPlayer } from './MobileAudioMiniPlayer';
import { MobileAudioPlayerSheet } from './MobileAudioPlayerSheet';

import {
  Ayah,
  Bookmark,
  KhatmaTracker,
  PaperTheme,
  QuranPageData,
  Reciter,
} from '../../types/quran';
import { SURAHS } from '../../data/quranMetadata';
import { useQuranAudio } from '../../context/AudioContext';

interface MobileAppShellProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  pageData: QuranPageData | null;
  loading: boolean;
  theme: PaperTheme;
  onToggleTheme: () => void;
  onChangeTheme: (theme: PaperTheme) => void;
  renderMode: 'image' | 'text';
  onChangeRenderMode: (mode: 'image' | 'text') => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  activeAyahNumber: number | null;
  selectedAyah: Ayah | null;
  onAyahClick: (ayah: Ayah) => void;
  onCloseAyahSheet: () => void;
  bookmarks: Bookmark[];
  onAddBookmark: (ayah: Ayah, note?: string, color?: string) => void;
  onDeleteBookmark: (id: string) => void;
  onTogglePageBookmark: () => void;
  isPageBookmarked: boolean;
  isAyahBookmarked: boolean;
  khatma: KhatmaTracker;
  onUpdateKhatmaDays: (days: number) => void;
  onRecordDailyProgress: (page: number) => void;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  currentPage,
  onPageChange,
  pageData,
  loading,
  theme,
  onToggleTheme,
  onChangeTheme,
  renderMode,
  onChangeRenderMode,
  fontSize,
  onChangeFontSize,
  activeAyahNumber,
  selectedAyah,
  onAyahClick,
  onCloseAyahSheet,
  bookmarks,
  onAddBookmark,
  onDeleteBookmark,
  onTogglePageBookmark,
  isPageBookmarked,
  isAyahBookmarked,
  khatma,
  onUpdateKhatmaDays,
  onRecordDailyProgress,
}) => {
  const [activeTab, setActiveTab] = useState<MobileTab>('reader');
  const [isImmersive, setIsImmersive] = useState<boolean>(false);

  const {
    currentAyah: audioAyah,
    isPlaying: isPlayingAudio,
    isAudioOpen,
    playAyah,
    openAudioSheet,
    selectedReciter,
    setReciter,
    playbackSpeed,
    setSpeed,
  } = useQuranAudio();

  // Derive current Surah and Juz info
  const currentSurah =
    SURAHS.find((s) => currentPage >= s.startPage && currentPage <= s.endPage) || SURAHS[0];
  const currentJuzNumber = pageData?.juzNumber || currentSurah.juz || 1;

  // When user navigates to a new page from anywhere, switch to reader
  const handleSelectPage = (page: number) => {
    onPageChange(page);
    setActiveTab('reader');
  };

  const handleNextPage = () => {
    if (currentPage < 604) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between w-full transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#151b23] text-slate-100' : 'bg-[#fdfaf2] text-[#1a1a1a]'
      }`}
      dir="rtl"
    >
      {/* Mobile Top Header */}
      <MobileHeader
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
        currentPage={currentPage}
        currentSurahName={currentSurah.name}
        currentJuzNumber={currentJuzNumber}
        theme={theme}
        onToggleTheme={onToggleTheme}
        isBookmarked={isPageBookmarked}
        onToggleBookmark={onTogglePageBookmark}
        onToggleAudio={() => {
          if (audioAyah) {
            openAudioSheet();
          } else if (pageData?.ayahs?.[0]) {
            playAyah(pageData.ayahs[0]);
          }
        }}
        isPlayingAudio={isPlayingAudio}
        isImmersiveReading={isImmersive}
        onToggleImmersiveReading={() => setIsImmersive(!isImmersive)}
        onOpenQuickJump={() => setActiveTab('index')}
        isVisible={!isImmersive || activeTab !== 'reader'}
      />

      {/* Main Tab Content View */}
      <main className="flex-1 w-full flex flex-col">
        {activeTab === 'home' && (
          <MobileHomeView
            currentPage={currentPage}
            onOpenReader={handleSelectPage}
            onOpenIndex={() => setActiveTab('index')}
            onOpenBookmarks={() => setActiveTab('bookmarks')}
            onOpenKhatma={() => setActiveTab('more')}
            onOpenAudio={() => {
              if (audioAyah) openAudioSheet();
              else if (pageData?.ayahs?.[0]) playAyah(pageData.ayahs[0]);
            }}
            bookmarks={bookmarks}
            khatma={khatma}
            selectedReciter={selectedReciter}
          />
        )}

        {activeTab === 'reader' && (
          <MobileReaderView
            pageData={pageData}
            loading={loading}
            theme={theme}
            activeAyahNumber={activeAyahNumber}
            onAyahClick={onAyahClick}
            renderMode={renderMode}
            fontSize={fontSize}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onGoToPage={onPageChange}
            isImmersive={isImmersive}
            onToggleImmersive={() => setIsImmersive(!isImmersive)}
            isPageBookmarked={isPageBookmarked}
            onToggleBookmark={onTogglePageBookmark}
          />
        )}

        {activeTab === 'index' && <MobileIndexView onSelectPage={handleSelectPage} />}

        {activeTab === 'bookmarks' && (
          <MobileBookmarksView
            bookmarks={bookmarks}
            onSelectPage={handleSelectPage}
            onDeleteBookmark={onDeleteBookmark}
            onOpenReader={() => setActiveTab('reader')}
          />
        )}

        {activeTab === 'more' && (
          <MobileMoreSettingsView
            theme={theme}
            onChangeTheme={onChangeTheme}
            renderMode={renderMode}
            onChangeRenderMode={onChangeRenderMode}
            fontSize={fontSize}
            onChangeFontSize={onChangeFontSize}
            selectedReciter={selectedReciter}
            onChangeReciter={setReciter}
            playbackSpeed={playbackSpeed}
            onChangePlaybackSpeed={setSpeed}
            khatma={khatma}
            onUpdateKhatmaDays={onUpdateKhatmaDays}
            onRecordDailyProgress={onRecordDailyProgress}
            currentPage={currentPage}
          />
        )}
      </main>

      {/* Floating Mini Audio Player when audio is active */}
      <MobileAudioMiniPlayer />

      {/* Expanded Audio Bottom Sheet */}
      <MobileAudioPlayerSheet />

      {/* Ayah Contextual Action Bottom Sheet */}
      <MobileAyahBottomSheet
        ayah={selectedAyah}
        isOpen={!!selectedAyah}
        onClose={onCloseAyahSheet}
        onPlayAyahAudio={(ayah) => playAyah(ayah)}
        isPlaying={isPlayingAudio && audioAyah?.number === selectedAyah?.number}
        onAddBookmark={onAddBookmark}
        isBookmarked={isAyahBookmarked}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNavigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (isImmersive) setIsImmersive(false);
        }}
        bookmarksCount={bookmarks.length}
        hasActiveAudio={isAudioOpen && isPlayingAudio}
        isVisible={!isImmersive || activeTab !== 'reader'}
      />
    </div>
  );
};
