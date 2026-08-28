/**
 * Test Suite: Quranic Data Engine & Canonical Mushaf Parity Audit
 * Framework: Vitest / Modern Deterministic TypeScript Test Architecture
 */
import { describe, it, expect } from 'vitest';
import { SURAHS, JUZ_LIST, getJuzForPage, getSurahForPage } from '../data/quranMetadata';
import { fetchQuranPage, normalizeArabic } from '../services/quranApi';

describe('Quranic Data Engine & Canonical Mushaf Parity Suite', () => {
  // Canonical Uthmani Bismillah text string
  const BISMILLAH_CANONICAL = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

  describe('1. Surah 9 (At-Tawbah) Canonical Constraints', () => {
    it('Surah 9 must have bismillahPrecedes set to false and exactly 129 verses', () => {
      const surah9 = SURAHS.find((s) => s.number === 9);
      expect(surah9).toBeDefined();
      expect(surah9?.name).toBe('التوبة');
      expect(surah9?.numberOfAyahs).toBe(129);
      expect(surah9?.bismillahPrecedes).toBe(false);
    });

    it('Surah 9 Verse 1 contains no Bismillah prefix and starts directly with Bara\'ah', async () => {
      const page187 = await fetchQuranPage(187);
      expect(page187).toBeDefined();
      expect(page187.ayahs.length).toBeGreaterThan(0);

      const firstAyahSurah9 = page187.ayahs.find(
        (a) => a.surahNumber === 9 && a.numberInSurah === 1
      );

      expect(firstAyahSurah9).toBeDefined();
      // Verse 1 of At-Tawbah must not contain Basmalah
      expect(firstAyahSurah9?.text).not.toContain('بِسْمِ');
      // Must start with Bara'ah in Uthmani script
      expect(firstAyahSurah9?.text.startsWith('بَرَآءَةٌۭ')).toBe(true);
      expect(firstAyahSurah9?.cleanText?.startsWith('براءه') || firstAyahSurah9?.cleanText?.startsWith('براءة')).toBe(true);
    });
  });

  describe('2. Surah 1 (Al-Fatihah) Canonical Constraints', () => {
    it('Surah 1 Verse 1 content strictly equals the Bismillah verse', async () => {
      const surah1 = SURAHS.find((s) => s.number === 1);
      expect(surah1).toBeDefined();
      expect(surah1?.numberOfAyahs).toBe(7);
      expect(surah1?.bismillahPrecedes).toBe(false); // In Al-Fatihah, Bismillah is Ayah #1 itself

      const page1 = await fetchQuranPage(1);
      expect(page1).toBeDefined();
      expect(page1.ayahs.length).toBe(7);

      const ayah1 = page1.ayahs[0];
      expect(ayah1.numberInSurah).toBe(1);
      expect(ayah1.surahNumber).toBe(1);

      // Clean any potential invisible zero-width characters (BOM / ZWNJ)
      const cleanAyah1 = ayah1.text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
      expect(cleanAyah1).toBe(BISMILLAH_CANONICAL);
    });
  });

  describe('3. Basmalah Header Flags and Traditional Verse Counts (Surahs 2-8 & 10-114)', () => {
    it('Every Surah in ranges 2-8 and 10-114 must have bismillahPrecedes === true', () => {
      SURAHS.forEach((surah) => {
        if (surah.number === 1 || surah.number === 9) {
          expect(surah.bismillahPrecedes).toBe(false);
        } else {
          expect(
            surah.bismillahPrecedes,
            `Surah ${surah.number} (${surah.name}) should have bismillahPrecedes === true`
          ).toBe(true);
        }
      });
    });

    it('All Surahs strictly match traditional verse counts (e.g. Al-Baqarah == 286)', () => {
      expect(SURAHS.length).toBe(114);

      const expectedVerseCounts: Record<number, number> = {
        1: 7,     // Al-Fatihah
        2: 286,   // Al-Baqarah
        3: 200,   // Ali 'Imran
        4: 176,   // An-Nisa
        5: 120,   // Al-Ma'idah
        6: 165,   // Al-An'am
        7: 206,   // Al-A'raf
        8: 75,    // Al-Anfal
        9: 129,   // At-Tawbah
        10: 109,  // Yunus
        18: 110,  // Al-Kahf
        36: 83,   // Ya-Sin
        55: 78,   // Ar-Rahman
        67: 30,   // Al-Mulk
        112: 4,   // Al-Ikhlas
        113: 5,   // Al-Falaq
        114: 6,   // An-Nas
      };

      Object.entries(expectedVerseCounts).forEach(([surahNumStr, count]) => {
        const surahNum = Number(surahNumStr);
        const surah = SURAHS.find((s) => s.number === surahNum);
        expect(surah).toBeDefined();
        expect(surah?.numberOfAyahs).toBe(count);
      });

      // Total count across all 114 Surahs must strictly equal 6236
      const totalQuranAyahs = SURAHS.reduce((sum, s) => sum + s.numberOfAyahs, 0);
      expect(totalQuranAyahs).toBe(6236);
    });
  });

  describe('4. Edge-Case Pagination & Boundary Defense', () => {
    it('Fetches Page 1 with correct metadata and no crash', async () => {
      const page1 = await fetchQuranPage(1);
      expect(page1.pageNumber).toBe(1);
      expect(page1.juzNumber).toBe(1);
      expect(page1.ayahs.length).toBe(7);
      expect(page1.isLeftPage).toBe(false); // Page 1 is right page (odd)
    });

    it('Fetches Page 604 with correct metadata and no crash', async () => {
      const page604 = await fetchQuranPage(604);
      expect(page604.pageNumber).toBe(604);
      expect(page604.juzNumber).toBe(30);
      expect(page604.isLeftPage).toBe(true); // Page 604 is left page (even)
      expect(page604.ayahs.length).toBeGreaterThan(0);
    });

    it('Gracefully clamps Page 0 to Page 1', async () => {
      const page0 = await fetchQuranPage(0);
      expect(page0).toBeDefined();
      expect(page0.pageNumber).toBe(1);
    });

    it('Gracefully clamps negative page numbers to Page 1', async () => {
      const pageNeg = await fetchQuranPage(-99);
      expect(pageNeg).toBeDefined();
      expect(pageNeg.pageNumber).toBe(1);
    });

    it('Gracefully clamps out-of-bounds page numbers (605, 9999) to Page 604', async () => {
      const page605 = await fetchQuranPage(605);
      expect(page605).toBeDefined();
      expect(page605.pageNumber).toBe(604);

      const page9999 = await fetchQuranPage(9999);
      expect(page9999).toBeDefined();
      expect(page9999.pageNumber).toBe(604);
    });

    it('Juz and Surah helper functions handle edge cases cleanly', () => {
      expect(getJuzForPage(1)).toBe(1);
      expect(getJuzForPage(604)).toBe(30);
      expect(getJuzForPage(0)).toBe(1);
      expect(getJuzForPage(999)).toBe(30);

      expect(getSurahForPage(1).name).toBe('الفاتحة');
      expect(getSurahForPage(604).name).toBe('الإخلاص');
    });
  });

  describe('5. Scroll & Layout Shift Invariants on Page Turn', () => {
    it('Ensures scroll reset hook interface is defined and callable', async () => {
      const { useScrollResetOnPageChange } = await import('../hooks/useScrollResetOnPageChange');
      expect(typeof useScrollResetOnPageChange).toBe('function');
    });
  });
});
