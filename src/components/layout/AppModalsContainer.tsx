import React from 'react';
import { SurahIndexDrawer } from '../SurahIndexDrawer';
import { AyahDetailModal } from '../AyahDetailModal';
import { KhatmaTrackerModal } from '../KhatmaTrackerModal';
import { BookmarksDrawer } from '../BookmarksDrawer';
import { AudioPlayerBar } from '../AudioPlayerBar';
import { PWAUpdateToast } from '../pwa/PWAUpdateToast';
import { OfflineIndicator } from '../pwa/OfflineIndicator';
import { Ayah, Bookmark, KhatmaTracker } from '../../types/quran';

interface AppModalsContainerProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  // Index Drawer
  isIndexOpen: boolean;
  onCloseIndex: () => void;
  // Ayah Detail Modal
  selectedAyah: Ayah | null;
  isAyahDetailOpen: boolean;
  onCloseAyahDetail: () => void;
  onPlayAyahAudio: (ayah: Ayah) => void;
  isPlayingAudio: boolean;
  activeAyahNumber: number | null;
  onAddBookmark: (ayah: Ayah, note?: string, color?: string) => void;
  isAyahBookmarked: boolean;
  // Khatma Modal
  isKhatmaOpen: boolean;
  onCloseKhatma: () => void;
  khatma: KhatmaTracker;
  onUpdateKhatma: (updated: Partial<KhatmaTracker>) => void;
  // Bookmarks Drawer
  isBookmarksOpen: boolean;
  onCloseBookmarks: () => void;
  bookmarks: Bookmark[];
  onDeleteBookmark: (id: string) => void;
}

export const AppModalsContainer: React.FC<AppModalsContainerProps> = ({
  currentPage,
  onPageChange,
  isIndexOpen,
  onCloseIndex,
  selectedAyah,
  isAyahDetailOpen,
  onCloseAyahDetail,
  onPlayAyahAudio,
  isPlayingAudio,
  activeAyahNumber,
  onAddBookmark,
  isAyahBookmarked,
  isKhatmaOpen,
  onCloseKhatma,
  khatma,
  onUpdateKhatma,
  isBookmarksOpen,
  onCloseBookmarks,
  bookmarks,
  onDeleteBookmark,
}) => {
  return (
    <>
      {/* Surah, Juz & Ayah Search Index Drawer */}
      <SurahIndexDrawer
        isOpen={isIndexOpen}
        onClose={onCloseIndex}
        onSelectSurah={onPageChange}
        onSelectJuz={onPageChange}
        onSelectAyah={(page) => {
          onPageChange(page);
        }}
        currentPage={currentPage}
      />

      {/* Ayah Details, Tafseer & Actions Modal */}
      <AyahDetailModal
        ayah={selectedAyah}
        isOpen={isAyahDetailOpen}
        onClose={onCloseAyahDetail}
        onPlayAyahAudio={onPlayAyahAudio}
        isPlaying={isPlayingAudio && activeAyahNumber === selectedAyah?.number}
        onAddBookmark={onAddBookmark}
        isBookmarked={isAyahBookmarked}
      />

      {/* Khatma Tracker & Du'a Modal */}
      <KhatmaTrackerModal
        isOpen={isKhatmaOpen}
        onClose={onCloseKhatma}
        currentPage={currentPage}
        onJumpToPage={onPageChange}
        khatma={khatma}
        onUpdateKhatma={onUpdateKhatma}
      />

      {/* Bookmarks & Saved Ayahs Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={onCloseBookmarks}
        bookmarks={bookmarks}
        onSelectBookmark={(page) => {
          onPageChange(page);
        }}
        onDeleteBookmark={onDeleteBookmark}
      />

      {/* Bottom Floating Audio Reciter Bar */}
      <AudioPlayerBar />

      {/* PWA System Update & Offline Notifications */}
      <PWAUpdateToast />
      <OfflineIndicator />
    </>
  );
};
