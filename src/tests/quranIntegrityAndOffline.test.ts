/**
 * Test Suite: Cryptographic Integrity & Offline Storage Verification
 * Framework: Vitest / TypeScript
 */
import { describe, it, expect } from 'vitest';
import { computeSHA256, serializePageForHashing, verifyPageDataIntegrity } from '../services/quranIntegrityVerifier';
import { fetchQuranPage } from '../services/quranApi';

describe('Quran Cryptographic Integrity & Offline Storage Suite', () => {

  describe('1. SHA-256 Checksum Calculation & Tamper Detection', () => {
    it('computes deterministic SHA-256 hash for Quranic text', async () => {
      const sampleText = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
      const hash1 = await computeSHA256(sampleText);
      const hash2 = await computeSHA256(sampleText);

      expect(hash1).toBeDefined();
      expect(hash1.length).toBe(64); // 256 bits = 64 hex chars
      expect(hash1).toBe(hash2);
    });

    it('immediately flags any unauthorized modification or character alteration', async () => {
      const originalAyahs = [
        { surahNumber: 1, numberInSurah: 1, text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' },
        { surahNumber: 1, numberInSurah: 2, text: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ' },
      ];

      const originalHash = await computeSHA256(serializePageForHashing(originalAyahs));

      // Introduce a single character tamper (e.g. replacing alef with alef with hamza or omitting diacritic)
      const tamperedAyahs = [
        { surahNumber: 1, numberInSurah: 1, text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' },
        { surahNumber: 1, numberInSurah: 2, text: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَالَمِينَ' }, // Missing dagger alif
      ];

      const checkOriginal = await verifyPageDataIntegrity(originalAyahs, originalHash);
      const checkTampered = await verifyPageDataIntegrity(tamperedAyahs, originalHash);

      expect(checkOriginal.isValid).toBe(true);
      expect(checkTampered.isValid).toBe(false);
      expect(checkTampered.computedHash).not.toBe(originalHash);
    });

    it('verifies real API fetched page generates a valid, consistent cryptographic signature', async () => {
      const page1 = await fetchQuranPage(1);
      const hash = await computeSHA256(serializePageForHashing(page1.ayahs));

      expect(hash).toBeDefined();
      expect(hash.length).toBe(64);

      const verification = await verifyPageDataIntegrity(page1.ayahs, hash);
      expect(verification.isValid).toBe(true);
    });
  });

  describe('2. Serialization Determinism & Normalization', () => {
    it('serializes Quran page items into a deterministic string format', () => {
      const ayahs = [
        { surahNumber: 114, numberInSurah: 1, text: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ' },
        { surahNumber: 114, numberInSurah: 2, text: 'مَلِكِ ٱلنَّاسِ' },
      ];

      const serialized = serializePageForHashing(ayahs);
      expect(serialized).toBe('114:1:قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ|114:2:مَلِكِ ٱلنَّاسِ');
    });
  });
});
