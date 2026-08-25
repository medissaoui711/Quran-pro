/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { MushafBook } from './components/MushafBook';
import { SurahIndexDrawer } from './components/SurahIndexDrawer';
import { AyahDetailModal } from './components/AyahDetailModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { KhatmaTrackerModal } from './components/KhatmaTrackerModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { MobileAppShell } from './components/mobile/MobileAppShell';
import { QuranPageData, PaperTheme, ViewMode, Ayah, Bookmark, KhatmaTracker } from './types/quran';
import { fetchQuranPage } from './services/quranApi';
import { AudioProvider, useQuranAudio } from './context/AudioContext';
import { PWAUpdateToast } from './components/pwa/PWAUpdateToast';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

const INITIAL_KHATMA: KhatmaTracker = {
  id: 'main-khatma',
  name: 'ختمتي المباركة',
  startDate: Date.now(),
  targetDays: 30,
  currentPage: 1,
  dailyGoalPages: 20,
  completed: false,
  pagesReadHistory: {},
};

function MushafAppContent() {
  // Mobile viewport detection
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  // Persistence state loaders
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const saved = localStorage.getItem('mushaf_current_page');
    return saved ? Math.max(1, Math.min(604, parseInt(saved, 10))) : 1;
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'spread' : 'single';
  });

  const [renderMode, setRenderMode] = useState<'image' | 'text'>('image');
  const [theme, setTheme] = useState<PaperTheme>('madinah');
  const [fontSize, setFontSize] = useState<number>(24);

  // Quran Page data state
  const [rightPageData, setRightPageData] = useState<QuranPageData | null>(null);
  const [leftPageData, setLeftPageData] = useState<QuranPageData | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);

  // Ayah modal selection state
  const [selectedAyah, setSelectedAyah] = useState<Ayah | null>(null);
  const [isAyahDetailOpen, setIsAyahDetailOpen] = useState<boolean>(false);

  // Unified Audio Context Hooks
  const {
    currentAyah: activeAudioAyah,
    isPlaying: isPlayingAudio,
    playAyah,
    openAudioSheet,
    registerNavigationHandlers,
  } = useQuranAudio();

  const activeAyahNumber = activeAudioAyah ? activeAudioAyah.number : null;

  // Modals & Drawers state
  const [isIndexOpen, setIsIndexOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isKhatmaOpen, setIsKhatmaOpen] = useState<boolean>(false);

  // Bookmarks persistence
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('mushaf_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Khatma tracker persistence
  const [khatma, setKhatma] = useState<KhatmaTracker>(() => {
    try {
      const saved = localStorage.getItem('mushaf_khatma');
      return saved ? JSON.parse(saved) : INITIAL_KHATMA;
    } catch {
      return INITIAL_KHATMA;
    }
  });

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync Dark Theme with HTML Document Class for Tailwind & CSS dark: selectors
  useEffect(() => {
    localStorage.setItem('mushaf_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  // Resize listener for viewport responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (window.innerWidth < 1024 && viewMode === 'spread') {
        setViewMode('single');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  // Save current page
  useEffect(() => {
    localStorage.setItem('mushaf_current_page', String(currentPage));
  }, [currentPage]);

  // Save bookmarks
  useEffect(() => {
    localStorage.setItem('mushaf_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Save khatma
  useEffect(() => {
    localStorage.setItem('mushaf_khatma', JSON.stringify(khatma));
  }, [khatma]);

  // Fetch Page Data whenever currentPage or viewMode changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingPage(true);

    const loadPages = async () => {
      try {
        const rightPage = await fetchQuranPage(currentPage);
        let leftPage: QuranPageData | null = null;

        // In spread view, if currentPage is odd and < 604, left page is currentPage + 1
        if (viewMode === 'spread' && currentPage < 604 && !isMobile) {
          leftPage = await fetchQuranPage(currentPage + 1);
        }

        if (isMounted) {
          setRightPageData(rightPage);
          setLeftPageData(leftPage);
          setIsLoadingPage(false);
        }
      } catch (err) {
        console.error('Error fetching Quran pages:', err);
        if (isMounted) setIsLoadingPage(false);
      }
    };

    loadPages();
    return () => {
      isMounted = false;
    };
  }, [currentPage, viewMode, isMobile]);

  // Page change handler
  const handlePageChange = useCallback((newPage: number) => {
    const clamped = Math.max(1, Math.min(604, newPage));
    setCurrentPage(clamped);
  }, []);

  // Ayah click handler
  const handleAyahClick = (ayah: Ayah) => {
    setSelectedAyah(ayah);
    setIsAyahDetailOpen(true);
  };

  // Play audio for specific ayah
  const handlePlayAyahAudio = (ayah: Ayah) => {
    setSelectedAyah(ayah);
    playAyah(ayah);
  };

  // Bookmark current page
  const handleBookmarkCurrentPage = () => {
    const pageNum = currentPage;
    const existingIndex = bookmarks.findIndex((b) => b.pageNumber === pageNum);

    if (existingIndex >= 0) {
      setBookmarks(bookmarks.filter((_, i) => i !== existingIndex));
      showToast(`تمت إزالة علامة القراءة للصفحة ${pageNum}`);
    } else {
      const surahName = rightPageData?.surahNames[0] || 'الفاتحة';
      const firstAyah = rightPageData?.ayahs[0];
      const newBookmark: Bookmark = {
        id: `bm-${Date.now()}`,
        pageNumber: pageNum,
        surahNumber: firstAyah?.surahNumber || 1,
        ayahNumberInSurah: firstAyah?.numberInSurah || 1,
        surahName,
        ayahTextSnippet: firstAyah?.text || '',
        createdAt: Date.now(),
      };
      setBookmarks([newBookmark, ...bookmarks]);
      showToast(`تم حفظ الصفحة ${pageNum} في الإشارات المرجعية`);
    }
  };

  // Add custom bookmark from Ayah modal
  const handleAddBookmark = (ayah: Ayah, note?: string, color?: string) => {
    const newBookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      pageNumber: ayah.page,
      surahNumber: ayah.surahNumber,
      ayahNumberInSurah: ayah.numberInSurah,
      surahName: ayah.surahName,
      ayahTextSnippet: ayah.text,
      note,
      color,
      createdAt: Date.now(),
    };
    setBookmarks([newBookmark, ...bookmarks]);
    showToast(`تم حفظ الآية ${ayah.numberInSurah} من سورة ${ayah.surahName}`);
  };

  // Delete bookmark
  const handleDeleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
    showToast('تم حذف الإشارة');
  };

  // Audio next & prev handlers registered to central audio engine
  useEffect(() => {
    registerNavigationHandlers({
      onNext: () => {
        if (!activeAudioAyah || !rightPageData) return;
        const allCurrentAyahs = [...rightPageData.ayahs, ...(leftPageData?.ayahs || [])];
        const curIdx = allCurrentAyahs.findIndex((a) => a.number === activeAudioAyah.number);

        if (curIdx >= 0 && curIdx < allCurrentAyahs.length - 1) {
          const nextA = allCurrentAyahs[curIdx + 1];
          playAyah(nextA);
        } else if (currentPage < 604) {
          const nextPage = currentPage + (viewMode === 'spread' ? 2 : 1);
          if (nextPage <= 604) {
            handlePageChange(nextPage);
          }
        }
      },
      onPrev: () => {
        if (!activeAudioAyah || !rightPageData) return;
        const allCurrentAyahs = [...rightPageData.ayahs, ...(leftPageData?.ayahs || [])];
        const curIdx = allCurrentAyahs.findIndex((a) => a.number === activeAudioAyah.number);

        if (curIdx > 0) {
          const prevA = allCurrentAyahs[curIdx - 1];
          playAyah(prevA);
        } else if (currentPage > 1) {
          const prevPage = currentPage - (viewMode === 'spread' ? 2 : 1);
          if (prevPage >= 1) {
            handlePageChange(prevPage);
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
    playAyah,
    handlePageChange,
    registerNavigationHandlers,
  ]);

  const isCurrentPageBookmarked = bookmarks.some((b) => b.pageNumber === currentPage);

  // If Mobile Viewport: Render the Dedicated Mobile Application Shell
  if (isMobile) {
    return (
      <div className="w-full min-h-screen overflow-x-hidden">
        <MobileAppShell
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pageData={rightPageData}
          loading={isLoadingPage}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'madinah' : 'dark')}
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
          onTogglePageBookmark={handleBookmarkCurrentPage}
          isPageBookmarked={isCurrentPageBookmarked}
          isAyahBookmarked={bookmarks.some(
            (b) =>
              b.surahNumber === selectedAyah?.surahNumber &&
              b.ayahNumberInSurah === selectedAyah?.numberInSurah
          )}
          khatma={khatma}
          onUpdateKhatmaDays={(days) => setKhatma({ ...khatma, targetDays: days })}
          onRecordDailyProgress={(page) => {
            const today = new Date().toISOString().split('T')[0];
            setKhatma({
              ...khatma,
              currentPage: page,
              pagesReadHistory: {
                ...khatma.pagesReadHistory,
                [today]: page,
              },
            });
            showToast(`تم تثبيت صفحة ${page} كإنجاز اليوم`);
          }}
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

  // Desktop View
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
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === 'spread' ? 'single' : 'spread')}
        renderMode={renderMode}
        onToggleRenderMode={() => setRenderMode(renderMode === 'image' ? 'text' : 'image')}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'madinah' : 'dark')}
        fontSize={fontSize}
        onChangeFontSize={(delta) => setFontSize(Math.max(16, Math.min(36, fontSize + delta)))}
        currentPage={currentPage}
        onJumpToPage={handlePageChange}
        totalPages={604}
        bookmarksCount={bookmarks.length}
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
            onPageChange={handlePageChange}
            onAyahClick={handleAyahClick}
            onBookmarkCurrentPage={handleBookmarkCurrentPage}
            isBookmarked={isCurrentPageBookmarked}
            onOpenAudio={() => {
              if (rightPageData.ayahs.length > 0) {
                handlePlayAyahAudio(rightPageData.ayahs[0]);
              }
            }}
            onOpenIndex={() => setIsIndexOpen(true)}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-[#1e4d2b] text-[#fdfaf2] border-2 border-[#c5a059] rounded-xl shadow-2xl font-reem text-xs sm:text-sm font-bold animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Drawers & Modals */}
      <SurahIndexDrawer
        isOpen={isIndexOpen}
        onClose={() => setIsIndexOpen(false)}
        onSelectSurah={handlePageChange}
        onSelectJuz={handlePageChange}
        onSelectAyah={(page, ayahNum) => {
          handlePageChange(page);
        }}
        currentPage={currentPage}
      />

      <AyahDetailModal
        ayah={selectedAyah}
        isOpen={isAyahDetailOpen}
        onClose={() => setIsAyahDetailOpen(false)}
        onPlayAyahAudio={handlePlayAyahAudio}
        isPlaying={isPlayingAudio && activeAyahNumber === selectedAyah?.number}
        onAddBookmark={handleAddBookmark}
        isBookmarked={bookmarks.some(
          (b) =>
            b.surahNumber === selectedAyah?.surahNumber &&
            b.ayahNumberInSurah === selectedAyah?.numberInSurah
        )}
      />

      <KhatmaTrackerModal
        isOpen={isKhatmaOpen}
        onClose={() => setIsKhatmaOpen(false)}
        currentPage={currentPage}
        onJumpToPage={handlePageChange}
        khatma={khatma}
        onUpdateKhatma={(updated) => setKhatma({ ...khatma, ...updated })}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={(page) => {
          handlePageChange(page);
        }}
        onDeleteBookmark={handleDeleteBookmark}
      />

      {/* Bottom Floating Audio Reciter Bar */}
      <AudioPlayerBar />

      {/* PWA System Update & Offline Notifications */}
      <PWAUpdateToast />
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <MushafAppContent />
    </AudioProvider>
  );
}
