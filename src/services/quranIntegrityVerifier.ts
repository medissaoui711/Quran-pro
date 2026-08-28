/**
 * Quran Data Integrity & Cryptographic Checksum Engine
 * Uses Web Crypto API SHA-256 for browser and Node crypto fallback
 */

/**
 * Computes the SHA-256 cryptographic hash of a given string payload
 */
export async function computeSHA256(data: string): Promise<string> {
  // If in browser or Web Crypto environment
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const buffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Node.js fallback if crypto.subtle is not accessible
  try {
    const nodeCrypto = await import('crypto');
    return nodeCrypto.createHash('sha256').update(data, 'utf8').digest('hex');
  } catch {
    throw new Error('No cryptographic environment available for SHA-256 calculation');
  }
}

/**
 * Standardizes Quranic page text representation for hashing
 * Formats: "surah:ayah:text|surah:ayah:text"
 */
export function serializePageForHashing(ayahs: Array<{ surahNumber: number; numberInSurah: number; text: string }>): string {
  return ayahs
    .map((a) => `${a.surahNumber}:${a.numberInSurah}:${a.text.trim()}`)
    .join('|');
}

/**
 * Verifies the integrity of a Quranic dataset page
 */
export async function verifyPageDataIntegrity(
  ayahs: Array<{ surahNumber: number; numberInSurah: number; text: string }>,
  expectedHash: string
): Promise<{ isValid: boolean; computedHash: string }> {
  const serialized = serializePageForHashing(ayahs);
  const computedHash = await computeSHA256(serialized);
  return {
    isValid: computedHash.toLowerCase() === expectedHash.toLowerCase(),
    computedHash,
  };
}

/**
 * Known baseline hashes for key canonical checkpoints
 */
export const CANONICAL_CHECKPOINT_HASHES: Record<number, string> = {
  // Page 1 (Al-Fatihah 1-7)
  1: '371baad6c2a47265a7eebecfc9a7d32c575d5e53e41eb7ad2d3ce6655c65a25b',
};
