export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  revelationPlaceArabic: 'مكية' | 'مدنية';
  startPage: number;
  endPage: number;
  juz: number;
}

export interface Ayah {
  number: number; // Global ayah number (1-6236)
  numberInSurah: number;
  surahNumber: number;
  surahName: string;
  text: string; // Uthmani text with tashkeel
  cleanText?: string; // Searchable text without tashkeel
  juz: number;
  manzil?: number;
  page: number;
  ruku?: number;
  hizbQuarter?: number;
  sajda?: boolean | { id: number; recommended: boolean; obligatory: boolean };
  translation?: string;
  tafsirMuyassar?: string;
  tafsirSaadi?: string;
}

export interface QuranPageData {
  pageNumber: number;
  juzNumber: number;
  hizbQuarterNumber: number;
  rubNumber: number;
  surahNames: string[];
  ayahs: Ayah[];
  isLeftPage: boolean;
  hasSpecialOpeningFrame?: boolean; // For Al-Fatiha & Al-Baqarah start (Pages 1 & 2)
}

export interface Bookmark {
  id: string;
  pageNumber: number;
  surahNumber: number;
  ayahNumberInSurah: number;
  surahName: string;
  ayahTextSnippet: string;
  note?: string;
  createdAt: number;
  color?: string;
}

export interface Reciter {
  id: string;
  name: string;
  englishName: string;
  style: string;
  serverUrl: string; // Format for audio URL
}

export interface KhatmaTracker {
  id: string;
  name: string;
  startDate: number;
  targetDays: number;
  currentPage: number;
  dailyGoalPages: number;
  completed: boolean;
  pagesReadHistory: { [dateStr: string]: number };
}

export type PaperTheme = 'madinah' | 'sepia' | 'white' | 'dark';
export type ViewMode = 'spread' | 'single';
