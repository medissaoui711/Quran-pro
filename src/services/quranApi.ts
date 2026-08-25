import { Ayah, QuranPageData, Surah } from '../types/quran';
import { SURAHS, getJuzForPage } from '../data/quranMetadata';

// Cache for loaded pages
const pageCache = new Map<number, QuranPageData>();
const surahCache = new Map<number, Ayah[]>();

// Arabic number formatter
export function toArabicNumerals(n: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(n).replace(/[0-9]/g, (d) => arabicDigits[parseInt(d, 10)]);
}

// Arabic Text Normalizer for accurate and fast search
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    // Remove Tashkeel / Harakat
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    // Normalize Alef variants
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Yaa variants
    .replace(/[ىي]/g, 'ي')
    // Normalize Taa Marbuta
    .replace(/ة/g, 'ه')
    // Remove tatweel (kashida)
    .replace(/\u0640/g, '')
    // Remove extra whitespace
    .trim();
}

// Audio URL builder for specific ayah
export function getAyahAudioUrl(serverUrl: string, surahNum: number, ayahNumInSurah: number): string {
  const sStr = String(surahNum).padStart(3, '0');
  const aStr = String(ayahNumInSurah).padStart(3, '0');
  return `${serverUrl}/${sStr}${aStr}.mp3`;
}

// Get high-res Page image URL for authentic Madinah Mushaf
export function getMushafPageImageUrl(pageNumber: number): string {
  const p = Math.max(1, Math.min(604, pageNumber));
  const pStr = String(p).padStart(3, '0');
  // High quality Madinah Mushaf Page scans from reliable Quran CDNs
  return `https://raw.githubusercontent.com/the-quran-project/quran-pages/main/hafs/${pStr}.png`;
}

// Alternative CDN backup for page images
export function getMushafPageImageUrlBackup(pageNumber: number): string {
  const p = Math.max(1, Math.min(604, pageNumber));
  const pStr = String(p).padStart(3, '0');
  return `https://www.searchtruth.org/quran/images2/large/page-${pStr}.png`;
}

// Fetch complete page data (with Ayahs, Surahs, Juz, Hizb)
export async function fetchQuranPage(pageNumber: number): Promise<QuranPageData> {
  const page = Math.max(1, Math.min(604, pageNumber));

  if (pageCache.has(page)) {
    return pageCache.get(page)!;
  }

  try {
    // We fetch Uthmani text along with translation and tafsir from AlQuran Cloud API
    const response = await fetch(`https://api.alquran.cloud/v1/page/${page}/quran-uthmani`);
    if (!response.ok) {
      throw new Error(`Failed to fetch page ${page}`);
    }
    const data = await response.json();
    const ayahsData = data.data.ayahs;

    const surahNamesSet = new Set<string>();
    const ayahs: Ayah[] = ayahsData.map((a: any) => {
      const s = SURAHS.find((s) => s.number === a.surah.number) || {
        name: a.surah.name,
        englishName: a.surah.englishName,
      };
      surahNamesSet.add(s.name);

      return {
        number: a.number,
        numberInSurah: a.numberInSurah,
        surahNumber: a.surah.number,
        surahName: s.name,
        text: a.text,
        cleanText: normalizeArabic(a.text),
        juz: a.juz,
        manzil: a.manzil,
        page: a.page,
        ruku: a.ruku,
        hizbQuarter: a.hizbQuarter,
        sajda: a.sajda,
      };
    });

    const pageData: QuranPageData = {
      pageNumber: page,
      juzNumber: ayahs[0]?.juz || getJuzForPage(page),
      hizbQuarterNumber: ayahs[0]?.hizbQuarter || Math.ceil(page / 10),
      rubNumber: Math.ceil(page / 2.5),
      surahNames: Array.from(surahNamesSet),
      ayahs,
      isLeftPage: page % 2 === 0,
      hasSpecialOpeningFrame: page === 1 || page === 2,
    };

    pageCache.set(page, pageData);
    return pageData;
  } catch (err) {
    console.warn(`Error fetching page ${page} from API, generating structured fallback:`, err);
    // Fallback: Build structured page using offline metadata
    const fallbackPage = generateFallbackPage(page);
    pageCache.set(page, fallbackPage);
    return fallbackPage;
  }
}

// Fetch Tafsir / Translation for a single verse
export async function fetchAyahTafsir(surahNum: number, ayahNum: number): Promise<{ tafsir: string; translation: string }> {
  try {
    const [tafsirRes, transRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/ar.muyassar`),
      fetch(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/en.sahih`),
    ]);

    let tafsir = 'تفسير الآية مأخوذ من التفسير الميسر.';
    let translation = 'Sahih International English Translation.';

    if (tafsirRes.ok) {
      const data = await tafsirRes.json();
      tafsir = data.data.text || tafsir;
    }
    if (transRes.ok) {
      const data = await transRes.json();
      translation = data.data.text || translation;
    }

    return { tafsir, translation };
  } catch (error) {
    return {
      tafsir: 'لم يتوفر الاتصال بجلب التفسير الميسر، تأكد من الاتصال بالإنترنت.',
      translation: 'Translation could not be loaded offline.',
    };
  }
}

// Search verses in Quran
export async function searchQuran(query: string): Promise<Ayah[]> {
  const normalizedQuery = normalizeArabic(query);
  if (!normalizedQuery || normalizedQuery.length < 2) return [];

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/ar`);
    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.matches) {
        return data.data.matches.map((m: any) => ({
          number: m.number,
          numberInSurah: m.numberInSurah,
          surahNumber: m.surah.number,
          surahName: m.surah.name,
          text: m.text,
          cleanText: normalizeArabic(m.text),
          juz: m.juz || getJuzForPage(m.page || 1),
          page: m.page || 1,
        }));
      }
    }
  } catch (err) {
    console.error('API search failed, falling back:', err);
  }

  // Fallback search in cached or loaded pages
  const results: Ayah[] = [];
  pageCache.forEach((pageData) => {
    pageData.ayahs.forEach((a) => {
      if (a.cleanText?.includes(normalizedQuery)) {
        results.push(a);
      }
    });
  });
  return results.slice(0, 50);
}

// Fallback Page Generator for instant offline loading
function generateFallbackPage(page: number): QuranPageData {
  const surah = SURAHS.find((s) => page >= s.startPage && page <= s.endPage) || SURAHS[0];
  const isOpening = page === 1 || page === 2;

  // Sample authentic text for initial pages
  let ayahs: Ayah[] = [];

  if (page === 1) {
    ayahs = [
      { number: 1, numberInSurah: 1, surahNumber: 1, surahName: "الفاتحة", text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", juz: 1, page: 1 },
      { number: 2, numberInSurah: 2, surahNumber: 1, surahName: "الفاتحة", text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ", juz: 1, page: 1 },
      { number: 3, numberInSurah: 3, surahNumber: 1, surahName: "الفاتحة", text: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ", juz: 1, page: 1 },
      { number: 4, numberInSurah: 4, surahNumber: 1, surahName: "الفاتحة", text: "مَـٰلِكِ يَوْمِ ٱلدِّينِ", juz: 1, page: 1 },
      { number: 5, numberInSurah: 5, surahNumber: 1, surahName: "الفاتحة", text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", juz: 1, page: 1 },
      { number: 6, numberInSurah: 6, surahNumber: 1, surahName: "الفاتحة", text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", juz: 1, page: 1 },
      { number: 7, numberInSurah: 7, surahNumber: 1, surahName: "الفاتحة", text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", juz: 1, page: 1 }
    ];
  } else if (page === 2) {
    ayahs = [
      { number: 8, numberInSurah: 1, surahNumber: 2, surahName: "البقرة", text: "الٓمٓ", juz: 1, page: 2 },
      { number: 9, numberInSurah: 2, surahNumber: 2, surahName: "البقرة", text: "ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًۭى لِّلْمُتَّقِينَ", juz: 1, page: 2 },
      { number: 10, numberInSurah: 3, surahNumber: 2, surahName: "البقرة", text: "ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَـٰهُمْ يُنفِقُونَ", juz: 1, page: 2 },
      { number: 11, numberInSurah: 4, surahNumber: 2, surahName: "البقرة", text: "وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْـَٔاخِرَةِ هُمْ يُوقِنُونَ", juz: 1, page: 2 },
      { number: 12, numberInSurah: 5, surahNumber: 2, surahName: "البقرة", text: "أُو۟لَـٰٓئِكَ عَلَىٰ هُدًۭى مِّن رَّبِّهِمْ ۖ وَأُو۟لَـٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ", juz: 1, page: 2 }
    ];
  } else {
    // Default fallback placeholder with Surah indicator
    ayahs = [
      {
        number: page * 10,
        numberInSurah: 1,
        surahNumber: surah.number,
        surahName: surah.name,
        text: `صفحة رقم ${toArabicNumerals(page)} من سورة ${surah.name} المباركة. جاري تحميل النص القرآني الموثق عالي الدقة...`,
        juz: surah.juz,
        page,
      },
    ];
  }

  return {
    pageNumber: page,
    juzNumber: getJuzForPage(page),
    hizbQuarterNumber: Math.ceil(page / 10),
    rubNumber: Math.ceil(page / 2.5),
    surahNames: [surah.name],
    ayahs,
    isLeftPage: page % 2 === 0,
    hasSpecialOpeningFrame: isOpening,
  };
}
