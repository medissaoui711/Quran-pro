import { useEffect } from 'react';
import { Ayah, QuranPageData, ViewMode } from '../types/quran';
import { useQuranAudio } from '../context/AudioContext';
import { fetchQuranPage } from '../services/quranApi';

interface AudioPlaybackSyncProps {
  rightPageData: QuranPageData | null;
  leftPageData: QuranPageData | null;
  currentPage: number;
  viewMode: ViewMode;
  isMobile: boolean;
  onPageChange: (newPage: number) => void;
  onSelectAyah: (ayah: Ayah) => void;
}

export function useAudioPlaybackSync({
  rightPageData,
  leftPageData,
  currentPage,
  viewMode,
  isMobile,
  onPageChange,
  onSelectAyah,
}: AudioPlaybackSyncProps) {
  const {
    currentAyah: activeAudioAyah,
    isPlaying: isPlayingAudio,
    playAyah,
    openAudioSheet,
    registerNavigationHandlers,
  } = useQuranAudio();

  const activeAyahNumber = activeAudioAyah ? activeAudioAyah.number : null;

  // Play audio for specific ayah and select it
  const handlePlayAyahAudio = (ayah: Ayah) => {
    onSelectAyah(ayah);
    playAyah(ayah);
  };

  // Audio next & prev handlers registered to central audio engine with seamless continuous playback across pages
  useEffect(() => {
    registerNavigationHandlers({
      onNext: async () => {
        if (!activeAudioAyah || !rightPageData) return;
        const allCurrentAyahs = [...rightPageData.ayahs, ...(leftPageData?.ayahs || [])];
        const curIdx = allCurrentAyahs.findIndex((a) => a.number === activeAudioAyah.number);

        if (curIdx >= 0 && curIdx < allCurrentAyahs.length - 1) {
          const nextA = allCurrentAyahs[curIdx + 1];
          playAyah(nextA);
        } else if (currentPage < 604) {
          // Last ayah on the current page/spread: advance page and continue playing first ayah of next page
          const nextPageNum = (viewMode === 'spread' && !isMobile) ? currentPage + 2 : currentPage + 1;
          if (nextPageNum <= 604) {
            onPageChange(nextPageNum);
            try {
              const nextPage = await fetchQuranPage(nextPageNum);
              if (nextPage.ayahs && nextPage.ayahs.length > 0) {
                playAyah(nextPage.ayahs[0]);
              }
            } catch (err) {
              console.error('Failed to continue audio playback on next page:', err);
            }
          }
        }
      },
      onPrev: async () => {
        if (!activeAudioAyah || !rightPageData) return;
        const allCurrentAyahs = [...rightPageData.ayahs, ...(leftPageData?.ayahs || [])];
        const curIdx = allCurrentAyahs.findIndex((a) => a.number === activeAudioAyah.number);

        if (curIdx > 0) {
          const prevA = allCurrentAyahs[curIdx - 1];
          playAyah(prevA);
        } else if (currentPage > 1) {
          // First ayah on current page/spread: go back to previous page and play its last ayah
          const prevPageNum = (viewMode === 'spread' && !isMobile)
            ? Math.max(1, currentPage - 2)
            : currentPage - 1;

          if (prevPageNum >= 1) {
            onPageChange(prevPageNum);
            try {
              // In spread mode, the previous ayah is the last ayah of the left page (prevPageNum + 1) if it exists
              let targetPage = prevPageNum;
              if (viewMode === 'spread' && !isMobile && prevPageNum < 604) {
                targetPage = prevPageNum + 1;
              }
              const prevPage = await fetchQuranPage(targetPage);
              if (prevPage.ayahs && prevPage.ayahs.length > 0) {
                playAyah(prevPage.ayahs[prevPage.ayahs.length - 1]);
              }
            } catch (err) {
              console.error('Failed to play previous audio on prev page:', err);
            }
          }
        }
      },
    });
  }, [
    activeAudioAyah,
    rightPageData,
    leftPageData,
    currentPage,
    viewMode,
    isMobile,
    playAyah,
    onPageChange,
    registerNavigationHandlers,
  ]);

  return {
    activeAudioAyah,
    activeAyahNumber,
    isPlayingAudio,
    playAyah,
    openAudioSheet,
    handlePlayAyahAudio,
  };
}
