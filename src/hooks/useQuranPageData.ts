import { useState, useEffect, useCallback } from 'react';
import { QuranPageData, ViewMode } from '../types/quran';
import { fetchQuranPage } from '../services/quranApi';

export function useQuranPageData(viewMode: ViewMode, isMobile: boolean) {
  // Persistence state loaders
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('mushaf_current_page') : null;
    return saved ? Math.max(1, Math.min(604, parseInt(saved, 10))) : 1;
  });

  const [rightPageData, setRightPageData] = useState<QuranPageData | null>(null);
  const [leftPageData, setLeftPageData] = useState<QuranPageData | null>(null);
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);

  // Disable automatic browser scroll restoration to prevent landing mid-page on page turn
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Save current page to localStorage
  useEffect(() => {
    localStorage.setItem('mushaf_current_page', String(currentPage));
  }, [currentPage]);

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

          // Intelligent pre-fetching of next and previous pages for instant audio transition
          if (currentPage < 604) {
            fetchQuranPage(currentPage + 1).catch(() => {});
            if (currentPage + 2 <= 604) {
              fetchQuranPage(currentPage + 2).catch(() => {});
            }
          }
          if (currentPage > 1) {
            fetchQuranPage(currentPage - 1).catch(() => {});
          }
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

  // Page change handler with UX Scroll Reset
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage((prevPage) => {
      const clamped = Math.max(1, Math.min(604, newPage));
      if (clamped !== prevPage) {
        // Enforce SCROLL RESET ON PAGE CHANGE (Zero Tolerance Rule #1)
        // behavior: 'instant' avoids visual layout shifts (CLS) mid-render
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
        return clamped;
      }
      return prevPage;
    });
  }, []);

  return {
    currentPage,
    setCurrentPage,
    handlePageChange,
    rightPageData,
    leftPageData,
    isLoadingPage,
  };
}
