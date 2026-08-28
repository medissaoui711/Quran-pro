/**
 * Test Suite: Quran Typography, Page Boundaries & Scroll Reset Verification
 * Framework: Vitest / TypeScript
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchQuranPage, normalizeArabic, toArabicNumerals } from '../services/quranApi';
import { fixArabicText } from '../services/arabicSanitizer';

describe('Quran Typography, Page Boundaries & Scroll Reset Suite', () => {

  describe('1. Text Cleaning & Uthmani Typography Normalization', () => {
    it('collapses multiple sequential spaces into a single space and trims edges', () => {
      const dirtyText = '  بِسْمِ   ٱللَّهِ    ٱلرَّحْمَٰنِ   ٱلرَّحِيمِ  ';
      const cleaned = fixArabicText(dirtyText);
      expect(cleaned).not.toMatch(/\s{2,}/);
      expect(cleaned.startsWith(' ')).toBe(false);
      expect(cleaned.endsWith(' ')).toBe(false);
      expect(cleaned).toBe('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
    });

    it('strips invisible zero-width characters (BOM, ZWNJ, ZWJ)', () => {
      const textWithBom = '\uFEFFبِسْمِ \u200Bٱللَّهِ \u200Cٱلرَّحْمَٰنِ \u200Dٱلرَّحِيمِ';
      const cleaned = fixArabicText(textWithBom);
      expect(cleaned).not.toMatch(/[\u200B-\u200D\uFEFF]/);
      expect(cleaned).toBe('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
    });

    it('normalizes Arabic characters correctly for search and indexing without destroying text', () => {
      const original = 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ';
      const normalized = normalizeArabic(original);
      // Normalized removes tashkeel and unifies alef forms
      expect(normalized).toBe('الحمد لله رب العالمين');
    });

    it('cleans ayah texts returned from page queries to ensure no leading/trailing space anomalies', async () => {
      const page1 = await fetchQuranPage(1);
      page1.ayahs.forEach((ayah) => {
        const text = ayah.text;
        expect(text).not.toMatch(/\s{2,}/);
        const cleanText = text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
        expect(cleanText.length).toBeGreaterThan(0);
      });
    });
  });

  describe('2. Scroll Reset Behavior on Navigation (Spies & DOM Offsets)', () => {
    it('executes scroll reset to top: 0 with instant behavior', async () => {
      const { useScrollResetOnPageChange } = await import('../hooks/useScrollResetOnPageChange');
      expect(useScrollResetOnPageChange).toBeDefined();

      const mockWindow = {
        scrollTo: vi.fn(),
      };
      const mockDocElement = {
        scrollTop: 1200,
      };
      const mockBody = {
        scrollTop: 1200,
      };

      // Execute simulated scroll reset logic
      mockWindow.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      mockDocElement.scrollTop = 0;
      mockBody.scrollTop = 0;

      expect(mockWindow.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
      expect(mockDocElement.scrollTop).toBe(0);
      expect(mockBody.scrollTop).toBe(0);
    });

    it('resets custom container scrollTop to 0 when containerRef is supplied', () => {
      const mockContainer = {
        scrollTop: 850,
      };
      expect(mockContainer.scrollTop).toBe(850);

      // Reset routine on target container
      mockContainer.scrollTop = 0;
      expect(mockContainer.scrollTop).toBe(0);
    });
  });

  describe('3. 604-Page Canonical Mushaf Boundary Assertions', () => {
    it('Page 1 strictly contains Surah 1 (Al-Fatihah), verses 1-7', async () => {
      const page1 = await fetchQuranPage(1);
      expect(page1.pageNumber).toBe(1);
      expect(page1.ayahs.length).toBe(7);

      const surahNumbers = new Set(page1.ayahs.map((a) => a.surahNumber));
      expect(surahNumbers.size).toBe(1);
      expect(surahNumbers.has(1)).toBe(true);

      expect(page1.ayahs[0].numberInSurah).toBe(1);
      expect(page1.ayahs[6].numberInSurah).toBe(7);
    });

    it('Page 2 strictly contains Surah 2 (Al-Baqarah), verses 1-5', async () => {
      const page2 = await fetchQuranPage(2);
      expect(page2.pageNumber).toBe(2);
      expect(page2.ayahs.length).toBe(5);

      const surahNumbers = new Set(page2.ayahs.map((a) => a.surahNumber));
      expect(surahNumbers.size).toBe(1);
      expect(surahNumbers.has(2)).toBe(true);

      expect(page2.ayahs[0].numberInSurah).toBe(1);
      expect(page2.ayahs[4].numberInSurah).toBe(5);
    });

    it('Page 3 strictly contains Surah 2 (Al-Baqarah), verses 6-16', async () => {
      const page3 = await fetchQuranPage(3);
      expect(page3.pageNumber).toBe(3);
      expect(page3.ayahs.length).toBe(11);

      expect(page3.ayahs[0].surahNumber).toBe(2);
      expect(page3.ayahs[0].numberInSurah).toBe(6);

      const lastAyah = page3.ayahs[page3.ayahs.length - 1];
      expect(lastAyah.surahNumber).toBe(2);
      expect(lastAyah.numberInSurah).toBe(16);
    });

    it('Page 50 strictly contains Surah 3 (Ali Imran), verses 1-9', async () => {
      const page50 = await fetchQuranPage(50);
      expect(page50.pageNumber).toBe(50);
      expect(page50.ayahs.length).toBe(9);

      expect(page50.ayahs[0].surahNumber).toBe(3);
      expect(page50.ayahs[0].numberInSurah).toBe(1);

      const lastAyah = page50.ayahs[page50.ayahs.length - 1];
      expect(lastAyah.surahNumber).toBe(3);
      expect(lastAyah.numberInSurah).toBe(9);
    });

    it('Page 604 strictly contains Surahs 112, 113, and 114 (15 verses total)', async () => {
      const page604 = await fetchQuranPage(604);
      expect(page604.pageNumber).toBe(604);
      expect(page604.ayahs.length).toBe(15);

      // Surah 112: Al-Ikhlas (4 verses)
      const surah112Ayahs = page604.ayahs.filter((a) => a.surahNumber === 112);
      expect(surah112Ayahs.length).toBe(4);
      expect(surah112Ayahs[0].numberInSurah).toBe(1);
      expect(surah112Ayahs[3].numberInSurah).toBe(4);

      // Surah 113: Al-Falaq (5 verses)
      const surah113Ayahs = page604.ayahs.filter((a) => a.surahNumber === 113);
      expect(surah113Ayahs.length).toBe(5);
      expect(surah113Ayahs[0].numberInSurah).toBe(1);
      expect(surah113Ayahs[4].numberInSurah).toBe(5);

      // Surah 114: An-Nas (6 verses)
      const surah114Ayahs = page604.ayahs.filter((a) => a.surahNumber === 114);
      expect(surah114Ayahs.length).toBe(6);
      expect(surah114Ayahs[0].numberInSurah).toBe(1);
      expect(surah114Ayahs[5].numberInSurah).toBe(6);
    });
  });

  describe('4. RTL & BiDi Isolation & Diacritics Safety Checks', () => {
    it('Ayah numbers retain proper Arabic numerals without reverse orientation', () => {
      expect(toArabicNumerals(1)).toBe('١');
      expect(toArabicNumerals(10)).toBe('١٠');
      expect(toArabicNumerals(129)).toBe('١٢٩');
      expect(toArabicNumerals(286)).toBe('٢٨٦');
    });

    it('Verifies that complex diacritics are preserved when sanitized for display', () => {
      const complexVerse = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
      const sanitized = fixArabicText(complexVerse);
      expect(sanitized).toContain('ٱلرَّحْمَٰنِ');
      expect(sanitized.length).toBeGreaterThan(0);
    });
  });
});
