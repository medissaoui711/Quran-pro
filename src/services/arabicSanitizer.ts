/**
 * Arabic Text Normalizer & Sanitizer
 * Conforms to Arabic Recovery Protocol for Sidebar and Text Display
 */

export function fixArabicText(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // Replacement mapping rules
  cleaned = cleaned.replace(/جُٔحدز/g, 'المادة');
  cleaned = cleaned.replace(/جٔحدز/g, 'المادة');

  // Merge isolated spaced single characters (e.g., "ق ا ن و ن" -> "قانون")
  cleaned = cleaned.replace(/([\u0600-\u06FF])\s+([\u0600-\u06FF])\s+([\u0600-\u06FF])\s+([\u0600-\u06FF])\s+([\u0600-\u06FF])/g, '$1$2$3$4$5');
  cleaned = cleaned.replace(/([\u0600-\u06FF])\s+([\u0600-\u06FF])\s+([\u0600-\u06FF])\s+([\u0600-\u06FF])/g, '$1$2$3$4');
  cleaned = cleaned.replace(/([\u0600-\u06FF])\s+([\u0600-\u06FF])\s+([\u0600-\u06FF])/g, '$1$2$3');

  // Remove irregular zero-width joiners/spaces if any
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // Collapse multiple whitespaces
  cleaned = cleaned.replace(/\s+/g, ' ');

  return cleaned.trim();
}
