import { useState, useEffect } from 'react';
import { Bookmark, Ayah, QuranPageData } from '../types/quran';

export function useBookmarks(showToast: (msg: string) => void) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('mushaf_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('mushaf_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Bookmark or unbookmark current page
  const handleBookmarkCurrentPage = (currentPage: number, rightPageData: QuranPageData | null) => {
    const pageNum = currentPage;
    const existingIndex = bookmarks.findIndex((b) => b.pageNumber === pageNum);

    if (existingIndex >= 0) {
      setBookmarks((prev) => prev.filter((_, i) => i !== existingIndex));
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
      setBookmarks((prev) => [newBookmark, ...prev]);
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
    setBookmarks((prev) => [newBookmark, ...prev]);
    showToast(`تم حفظ الآية ${ayah.numberInSurah} من سورة ${ayah.surahName}`);
  };

  // Delete bookmark
  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    showToast('تم حذف الإشارة');
  };

  const isPageBookmarked = (page: number) => {
    return bookmarks.some((b) => b.pageNumber === page);
  };

  const isAyahBookmarked = (ayah: Ayah | null) => {
    if (!ayah) return false;
    return bookmarks.some(
      (b) => b.surahNumber === ayah.surahNumber && b.ayahNumberInSurah === ayah.numberInSurah
    );
  };

  return {
    bookmarks,
    handleBookmarkCurrentPage,
    handleAddBookmark,
    handleDeleteBookmark,
    isPageBookmarked,
    isAyahBookmarked,
  };
}
