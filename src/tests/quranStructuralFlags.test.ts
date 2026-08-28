/**
 * Quranic Metadata & Structural Boundaries Test Suite
 * Validating 15 Canonical Sajdahs, 30 Ajza, 60 Ahzab, and Offset-Free Navigation
 */
import { describe, it, expect } from 'vitest';
import { SAJDAH_VERSES_CANONICAL, HIZB_LIST, getSajdahInfo, getHizbForPage } from '../data/quranStructuralData';
import { JUZ_LIST, SURAHS, getJuzForPage, getSurahForPage } from '../data/quranMetadata';
import { fetchQuranPage } from '../services/quranApi';

describe('Quranic Structural Metadata Validation Suite', () => {

  describe('1. 15 Canonical Sajdah (Prostration) Markers Validation', () => {
    it('contains exactly 15 canonical Sajdah verses according to Hafs an Asim', () => {
      expect(SAJDAH_VERSES_CANONICAL.length).toBe(15);
    });

    it('verifies all 15 Sajdah positions match standard Surah and Ayah numbers without omission', () => {
      const expectedSajdahs = [
        { surah: 7, ayah: 206, page: 176 },
        { surah: 13, ayah: 15, page: 250 },
        { surah: 16, ayah: 50, page: 272 },
        { surah: 17, ayah: 109, page: 293 },
        { surah: 19, ayah: 58, page: 309 },
        { surah: 22, ayah: 18, page: 334 },
        { surah: 22, ayah: 77, page: 341 },
        { surah: 25, ayah: 60, page: 365 },
        { surah: 27, ayah: 26, page: 379 },
        { surah: 32, ayah: 15, page: 416 },
        { surah: 38, ayah: 24, page: 454 },
        { surah: 41, ayah: 38, page: 480 },
        { surah: 53, ayah: 62, page: 528 },
        { surah: 84, ayah: 21, page: 589 },
        { surah: 96, ayah: 19, page: 597 },
      ];

      expectedSajdahs.forEach(({ surah, ayah, page }) => {
        const sajdah = getSajdahInfo(surah, ayah);
        expect(sajdah, `Missing Sajdah in Surah ${surah}:${ayah}`).toBeDefined();
        expect(sajdah?.pageNumber).toBe(page);
        expect(sajdah?.targetWord.length).toBeGreaterThan(0);
      });
    });

    it('confirms fetchQuranPage flags Sajdah verses with sajda: true in live API / fallback payload', async () => {
      // Test Surah 96 (Al-Alaq), Ayah 19 on Page 597
      const page597 = await fetchQuranPage(597);
      const sajdahAyah = page597.ayahs.find((a) => a.surahNumber === 96 && a.numberInSurah === 19);
      expect(sajdahAyah).toBeDefined();
      expect(Boolean(sajdahAyah?.sajda)).toBe(true);

      // Non-sajdah ayah should be false
      const regularAyah = page597.ayahs.find((a) => a.surahNumber === 96 && a.numberInSurah === 1);
      expect(Boolean(regularAyah?.sajda)).toBe(false);
    });
  });

  describe('2. 30 Ajza (Juz\') Boundary Consistency', () => {
    it('contains strictly 30 Ajza entries spanning pages 1 to 604', () => {
      expect(JUZ_LIST.length).toBe(30);
      expect(JUZ_LIST[0].startPage).toBe(1);
      expect(JUZ_LIST[29].startPage).toBe(582);
    });

    it('verifies Juz start pages are strictly monotonically increasing', () => {
      for (let i = 1; i < JUZ_LIST.length; i++) {
        expect(JUZ_LIST[i].startPage).toBeGreaterThan(JUZ_LIST[i - 1].startPage);
        expect(JUZ_LIST[i].juzNumber).toBe(i + 1);
      }
    });

    it('correctly maps any page between 1 and 604 to its corresponding Juz number', () => {
      expect(getJuzForPage(1)).toBe(1);
      expect(getJuzForPage(21)).toBe(1);
      expect(getJuzForPage(22)).toBe(2);
      expect(getJuzForPage(41)).toBe(2);
      expect(getJuzForPage(42)).toBe(3);
      expect(getJuzForPage(582)).toBe(30);
      expect(getJuzForPage(604)).toBe(30);
    });
  });

  describe('3. 60 Ahzab (Hizb) Structural Alignment', () => {
    it('contains strictly 60 Ahzab, with exactly 2 Ahzab per Juz', () => {
      expect(HIZB_LIST.length).toBe(60);

      // Every Juz must have exactly 2 Ahzab
      for (let juz = 1; juz <= 30; juz++) {
        const ahzabInJuz = HIZB_LIST.filter((h) => h.juzNumber === juz);
        expect(ahzabInJuz.length).toBe(2);
        expect(ahzabInJuz[0].hizbNumber).toBe(juz * 2 - 1);
        expect(ahzabInJuz[1].hizbNumber).toBe(juz * 2);
      }
    });

    it('verifies Hizb navigation returns exact Page with zero offset', () => {
      // Hizb 1 starts on Page 1 (Al-Fatihah: 1)
      expect(HIZB_LIST[0].startPage).toBe(1);
      expect(HIZB_LIST[0].startSurahNumber).toBe(1);
      expect(HIZB_LIST[0].startAyah).toBe(1);

      // Hizb 3 (Juz 2) starts on Page 22 (Al-Baqarah: 142)
      expect(HIZB_LIST[2].startPage).toBe(22);
      expect(HIZB_LIST[2].startSurahNumber).toBe(2);
      expect(HIZB_LIST[2].startAyah).toBe(142);

      // Hizb 60 (Juz 30) starts on Page 591 (At-Tariq: 1)
      expect(HIZB_LIST[59].startPage).toBe(591);
      expect(HIZB_LIST[59].startSurahNumber).toBe(86);
      expect(HIZB_LIST[59].startAyah).toBe(1);
    });

    it('resolves the correct Hizb for any given page', () => {
      expect(getHizbForPage(1).hizbNumber).toBe(1);
      expect(getHizbForPage(10).hizbNumber).toBe(1);
      expect(getHizbForPage(11).hizbNumber).toBe(2);
      expect(getHizbForPage(22).hizbNumber).toBe(3);
      expect(getHizbForPage(604).hizbNumber).toBe(60);
    });
  });

  describe('4. Surah Index to Page Discrepancy Check', () => {
    it('verifies all 114 Surahs have valid startPage and endPage within 1-604', () => {
      expect(SURAHS.length).toBe(114);
      SURAHS.forEach((surah) => {
        expect(surah.startPage).toBeGreaterThanOrEqual(1);
        expect(surah.endPage).toBeLessThanOrEqual(604);
        expect(surah.endPage).toBeGreaterThanOrEqual(surah.startPage);
      });
    });

    it('confirms getSurahForPage always returns the primary Surah occupying the page', () => {
      expect(getSurahForPage(1).name).toBe('الفاتحة');
      expect(getSurahForPage(2).name).toBe('البقرة');
      expect(getSurahForPage(49).name).toBe('البقرة');
      expect(getSurahForPage(50).name).toBe('آل عمران');
      expect(getSurahForPage(604).name).toBe('الإخلاص');
    });
  });
});
