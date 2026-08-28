/**
 * Canonical Quranic Structural Data
 * Madinah Mushaf (King Fahd Complex standard)
 * 15 Sajdah positions, 60 Ahzab, and 240 Arba'
 */

export interface SajdahMetadata {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  pageNumber: number;
  targetWord: string;
  isObligatory: boolean; // واجبة / مستحبة
  descriptionArabic: string;
}

export interface HizbQuarterMetadata {
  rubNumber: number; // 1 to 240
  hizbNumber: number; // 1 to 60
  quarterInHizb: 1 | 2 | 3 | 4; // 1: بداية الحزب, 2: ربع, 3: نصف, 4: ثلاثة أرباع
  juzNumber: number; // 1 to 30
  startPage: number;
  startSurahNumber: number;
  startSurahName: string;
  startAyahNumber: number;
  firstWords: string;
}

/**
 * 15 Canonical Sajdah Verses in Hafs 'an 'Asim
 */
export const SAJDAH_VERSES_CANONICAL: SajdahMetadata[] = [
  {
    surahNumber: 7,
    surahName: "الأعراف",
    ayahNumber: 206,
    pageNumber: 176,
    targetWord: "يَسْجُدُونَ",
    isObligatory: true,
    descriptionArabic: "سورة الأعراف - آية 206"
  },
  {
    surahNumber: 13,
    surahName: "الرعد",
    ayahNumber: 15,
    pageNumber: 250,
    targetWord: "وَالْآصَالِ",
    isObligatory: true,
    descriptionArabic: "سورة الرعد - آية 15"
  },
  {
    surahNumber: 16,
    surahName: "النحل",
    ayahNumber: 50,
    pageNumber: 272,
    targetWord: "يُؤْمَرُونَ",
    isObligatory: true,
    descriptionArabic: "سورة النحل - آية 50"
  },
  {
    surahNumber: 17,
    surahName: "الإسراء",
    ayahNumber: 109,
    pageNumber: 293,
    targetWord: "خُشُوعًا",
    isObligatory: true,
    descriptionArabic: "سورة الإسراء - آية 109"
  },
  {
    surahNumber: 19,
    surahName: "مريم",
    ayahNumber: 58,
    pageNumber: 309,
    targetWord: "وَبُكِيًّا",
    isObligatory: true,
    descriptionArabic: "سورة مريم - آية 58"
  },
  {
    surahNumber: 22,
    surahName: "الحج",
    ayahNumber: 18,
    pageNumber: 334,
    targetWord: "يَفْعَلُ مَا يَشَاءُ",
    isObligatory: true,
    descriptionArabic: "سورة الحج - سجدة أولى - آية 18"
  },
  {
    surahNumber: 22,
    surahName: "الحج",
    ayahNumber: 77,
    pageNumber: 341,
    targetWord: "وَاسْجُدُوا",
    isObligatory: true,
    descriptionArabic: "سورة الحج - سجدة ثانية - آية 77"
  },
  {
    surahNumber: 25,
    surahName: "الفرقان",
    ayahNumber: 60,
    pageNumber: 365,
    targetWord: "نُفُورًا",
    isObligatory: true,
    descriptionArabic: "سورة الفرقان - آية 60"
  },
  {
    surahNumber: 27,
    surahName: "النمل",
    ayahNumber: 26,
    pageNumber: 379,
    targetWord: "الْعَظِيمِ",
    isObligatory: true,
    descriptionArabic: "سورة النمل - آية 26"
  },
  {
    surahNumber: 32,
    surahName: "السجدة",
    ayahNumber: 15,
    pageNumber: 416,
    targetWord: "يَسْتَكْبِرُونَ",
    isObligatory: true,
    descriptionArabic: "سورة السجدة - آية 15"
  },
  {
    surahNumber: 38,
    surahName: "ص",
    ayahNumber: 24,
    pageNumber: 454,
    targetWord: "وَأَنَابَ",
    isObligatory: true,
    descriptionArabic: "سورة ص - آية 24"
  },
  {
    surahNumber: 41,
    surahName: "فصلت",
    ayahNumber: 38,
    pageNumber: 480,
    targetWord: "يَسْأَمُونَ",
    isObligatory: true,
    descriptionArabic: "سورة فصلت - آية 38"
  },
  {
    surahNumber: 53,
    surahName: "النجم",
    ayahNumber: 62,
    pageNumber: 528,
    targetWord: "وَاعْبُدُوا",
    isObligatory: true,
    descriptionArabic: "سورة النجم - آية 62"
  },
  {
    surahNumber: 84,
    surahName: "الانشقاق",
    ayahNumber: 21,
    pageNumber: 589,
    targetWord: "يَسْجُدُونَ",
    isObligatory: true,
    descriptionArabic: "سورة الانشقاق - آية 21"
  },
  {
    surahNumber: 96,
    surahName: "العلق",
    ayahNumber: 19,
    pageNumber: 597,
    targetWord: "وَاقْتَرِب",
    isObligatory: true,
    descriptionArabic: "سورة العلق - آية 19"
  }
];

/**
 * 60 Ahzab Structure (2 Ahzab per Juz)
 */
export interface HizbInfo {
  hizbNumber: number;
  juzNumber: number;
  startPage: number;
  startSurahName: string;
  startSurahNumber: number;
  startAyah: number;
  nameArabic: string;
}

export const HIZB_LIST: HizbInfo[] = [
  { hizbNumber: 1, juzNumber: 1, startPage: 1, startSurahName: "الفاتحة", startSurahNumber: 1, startAyah: 1, nameArabic: "الحزب 1 (الم)" },
  { hizbNumber: 2, juzNumber: 1, startPage: 11, startSurahName: "البقرة", startSurahNumber: 2, startAyah: 75, nameArabic: "الحزب 2 (أفتطمعون)" },
  { hizbNumber: 3, juzNumber: 2, startPage: 22, startSurahName: "البقرة", startSurahNumber: 2, startAyah: 142, nameArabic: "الحزب 3 (سيقول)" },
  { hizbNumber: 4, juzNumber: 2, startPage: 32, startSurahName: "البقرة", startSurahNumber: 2, startAyah: 203, nameArabic: "الحزب 4 (واذكروا الله)" },
  { hizbNumber: 5, juzNumber: 3, startPage: 42, startSurahName: "البقرة", startSurahNumber: 2, startAyah: 253, nameArabic: "الحزب 5 (تلك الرسل)" },
  { hizbNumber: 6, juzNumber: 3, startPage: 51, startSurahName: "آل عمران", startSurahNumber: 3, startAyah: 15, nameArabic: "الحزب 6 (قل أؤنبئكم)" },
  { hizbNumber: 7, juzNumber: 4, startPage: 62, startSurahName: "آل عمران", startSurahNumber: 3, startAyah: 93, nameArabic: "الحزب 7 (لن تنالوا)" },
  { hizbNumber: 8, juzNumber: 4, startPage: 72, startSurahName: "آل عمران", startSurahNumber: 3, startAyah: 171, nameArabic: "الحزب 8 (يستبشرون)" },
  { hizbNumber: 9, juzNumber: 5, startPage: 82, startSurahName: "النساء", startSurahNumber: 4, startAyah: 24, nameArabic: "الحزب 9 (والمحصنات)" },
  { hizbNumber: 10, juzNumber: 5, startPage: 92, startSurahName: "النساء", startSurahNumber: 4, startAyah: 88, nameArabic: "الحزب 10 (فما لكم)" },
  { hizbNumber: 11, juzNumber: 6, startPage: 102, startSurahName: "النساء", startSurahNumber: 4, startAyah: 148, nameArabic: "الحزب 11 (لا يحب الله)" },
  { hizbNumber: 12, juzNumber: 6, startPage: 111, startSurahName: "المائدة", startSurahNumber: 5, startAyah: 27, nameArabic: "الحزب 12 (واتل عليهم)" },
  { hizbNumber: 13, juzNumber: 7, startPage: 121, startSurahName: "المائدة", startSurahNumber: 5, startAyah: 82, nameArabic: "الحزب 13 (لتجدن)" },
  { hizbNumber: 14, juzNumber: 7, startPage: 132, startSurahName: "الأنعام", startSurahNumber: 6, startAyah: 36, nameArabic: "الحزب 14 (إنما يستجيب)" },
  { hizbNumber: 15, juzNumber: 8, startPage: 142, startSurahName: "الأنعام", startSurahNumber: 6, startAyah: 111, nameArabic: "الحزب 15 (ولو أننا)" },
  { hizbNumber: 16, juzNumber: 8, startPage: 151, startSurahName: "الأعراف", startSurahNumber: 7, startAyah: 1, nameArabic: "الحزب 16 (المص)" },
  { hizbNumber: 17, juzNumber: 9, startPage: 162, startSurahName: "الأعراف", startSurahNumber: 7, startAyah: 88, nameArabic: "الحزب 17 (قال الملأ)" },
  { hizbNumber: 18, juzNumber: 9, startPage: 172, startSurahName: "الأعراف", startSurahNumber: 7, startAyah: 171, nameArabic: "الحزب 18 (وإذ نتقنا)" },
  { hizbNumber: 19, juzNumber: 10, startPage: 182, startSurahName: "الأنفال", startSurahNumber: 8, startAyah: 41, nameArabic: "الحزب 19 (واعلموا)" },
  { hizbNumber: 20, juzNumber: 10, startPage: 192, startSurahName: "التوبة", startSurahNumber: 9, startAyah: 34, nameArabic: "الحزب 20 (يا أيها الذين آمنوا إن كثيرا)" },
  { hizbNumber: 21, juzNumber: 11, startPage: 201, startSurahName: "التوبة", startSurahNumber: 9, startAyah: 93, nameArabic: "الحزب 21 (يعتذرون)" },
  { hizbNumber: 22, juzNumber: 11, startPage: 211, startSurahName: "يونس", startSurahNumber: 10, startAyah: 26, nameArabic: "الحزب 22 (للذين أحسنوا)" },
  { hizbNumber: 23, juzNumber: 12, startPage: 222, startSurahName: "هود", startSurahNumber: 11, startAyah: 6, nameArabic: "الحزب 23 (وما من دابة)" },
  { hizbNumber: 24, juzNumber: 12, startPage: 231, startSurahName: "هود", startSurahNumber: 11, startAyah: 84, nameArabic: "الحزب 24 (وإلى مدين)" },
  { hizbNumber: 25, juzNumber: 13, startPage: 242, startSurahName: "يوسف", startSurahNumber: 12, startAyah: 53, nameArabic: "الحزب 25 (وما أبرئ)" },
  { hizbNumber: 26, juzNumber: 13, startPage: 252, startSurahName: "الرعد", startSurahNumber: 13, startAyah: 19, nameArabic: "الحزب 26 (أفمن يعلم)" },
  { hizbNumber: 27, juzNumber: 14, startPage: 262, startSurahName: "الحجر", startSurahNumber: 15, startAyah: 1, nameArabic: "الحزب 27 (ربما)" },
  { hizbNumber: 28, juzNumber: 14, startPage: 272, startSurahName: "النحل", startSurahNumber: 16, startAyah: 51, nameArabic: "الحزب 28 (وقال الله)" },
  { hizbNumber: 29, juzNumber: 15, startPage: 282, startSurahName: "الإسراء", startSurahNumber: 17, startAyah: 1, nameArabic: "الحزب 29 (سبحان الذي)" },
  { hizbNumber: 30, juzNumber: 15, startPage: 292, startSurahName: "الإسراء", startSurahNumber: 17, startAyah: 99, nameArabic: "الحزب 30 (أولم يروا)" },
  { hizbNumber: 31, juzNumber: 16, startPage: 302, startSurahName: "الكهف", startSurahNumber: 18, startAyah: 75, nameArabic: "الحزب 31 (قال ألم أقل لك)" },
  { hizbNumber: 32, juzNumber: 16, startPage: 312, startSurahName: "طه", startSurahNumber: 20, startAyah: 1, nameArabic: "الحزب 32 (طه)" },
  { hizbNumber: 33, juzNumber: 17, startPage: 322, startSurahName: "الأنبياء", startSurahNumber: 21, startAyah: 1, nameArabic: "الحزب 33 (اقترب للناس)" },
  { hizbNumber: 34, juzNumber: 17, startPage: 332, startSurahName: "الحج", startSurahNumber: 22, startAyah: 1, nameArabic: "الحزب 34 (يا أيها الناس اتقوا ربكم)" },
  { hizbNumber: 35, juzNumber: 18, startPage: 342, startSurahName: "المؤمنون", startSurahNumber: 23, startAyah: 1, nameArabic: "الحزب 35 (قد أفلح)" },
  { hizbNumber: 36, juzNumber: 18, startPage: 352, startSurahName: "النور", startSurahNumber: 24, startAyah: 21, nameArabic: "الحزب 36 (يا أيها الذين آمنوا لا تتبعوا)" },
  { hizbNumber: 37, juzNumber: 19, startPage: 362, startSurahName: "الفرقان", startSurahNumber: 25, startAyah: 21, nameArabic: "الحزب 37 (وقال الذين)" },
  { hizbNumber: 38, juzNumber: 19, startPage: 371, startSurahName: "الشعراء", startSurahNumber: 26, startAyah: 111, nameArabic: "الحزب 38 (قالوا أنؤمن لك)" },
  { hizbNumber: 39, juzNumber: 20, startPage: 382, startSurahName: "النمل", startSurahNumber: 27, startAyah: 60, nameArabic: "الحزب 39 (أمن خلق)" },
  { hizbNumber: 40, juzNumber: 20, startPage: 391, startSurahName: "القصص", startSurahNumber: 28, startAyah: 51, nameArabic: "الحزب 40 (ولقد وصلنا)" },
  { hizbNumber: 41, juzNumber: 21, startPage: 402, startSurahName: "العنكبوت", startSurahNumber: 29, startAyah: 46, nameArabic: "الحزب 41 (اتل ما أوحي)" },
  { hizbNumber: 42, juzNumber: 21, startPage: 413, startSurahName: "لقمان", startSurahNumber: 31, startAyah: 22, nameArabic: "الحزب 42 (ومن يسلم)" },
  { hizbNumber: 43, juzNumber: 22, startPage: 422, startSurahName: "الأحزاب", startSurahNumber: 33, startAyah: 31, nameArabic: "الحزب 43 (ومن يقنت)" },
  { hizbNumber: 44, juzNumber: 22, startPage: 431, startSurahName: "سبأ", startSurahNumber: 34, startAyah: 24, nameArabic: "الحزب 44 (قل من يرزقكم)" },
  { hizbNumber: 45, juzNumber: 23, startPage: 442, startSurahName: "يس", startSurahNumber: 36, startAyah: 28, nameArabic: "الحزب 45 (وما أنزلنا)" },
  { hizbNumber: 46, juzNumber: 23, startPage: 451, startSurahName: "الصافات", startSurahNumber: 37, startAyah: 145, nameArabic: "الحزب 46 (فنبذناه)" },
  { hizbNumber: 47, juzNumber: 24, startPage: 462, startSurahName: "الزمر", startSurahNumber: 39, startAyah: 32, nameArabic: "الحزب 47 (فمن أظلم)" },
  { hizbNumber: 48, juzNumber: 24, startPage: 472, startSurahName: "غافر", startSurahNumber: 40, startAyah: 41, nameArabic: "الحزب 48 (ويا قوم مالي)" },
  { hizbNumber: 49, juzNumber: 25, startPage: 482, startSurahName: "فصلت", startSurahNumber: 41, startAyah: 47, nameArabic: "الحزب 49 (إليه يرد)" },
  { hizbNumber: 50, juzNumber: 25, startPage: 492, startSurahName: "الزخرف", startSurahNumber: 43, startAyah: 24, nameArabic: "الحزب 50 (قال أولو جئتكم)" },
  { hizbNumber: 51, juzNumber: 26, startPage: 502, startSurahName: "الأحقاف", startSurahNumber: 46, startAyah: 1, nameArabic: "الحزب 51 (حم)" },
  { hizbNumber: 52, juzNumber: 26, startPage: 513, startSurahName: "الفتح", startSurahNumber: 48, startAyah: 18, nameArabic: "الحزب 52 (لقد رضي الله)" },
  { hizbNumber: 53, juzNumber: 27, startPage: 522, startSurahName: "الذاريات", startSurahNumber: 51, startAyah: 31, nameArabic: "الحزب 53 (قال فما خطبكم)" },
  { hizbNumber: 54, juzNumber: 27, startPage: 531, startSurahName: "الرحمن", startSurahNumber: 55, startAyah: 1, nameArabic: "الحزب 54 (الرحمن)" },
  { hizbNumber: 55, juzNumber: 28, startPage: 542, startSurahName: "المجادلة", startSurahNumber: 58, startAyah: 1, nameArabic: "الحزب 55 (قد سمع الله)" },
  { hizbNumber: 56, juzNumber: 28, startPage: 551, startSurahName: "الصف", startSurahNumber: 61, startAyah: 1, nameArabic: "الحزب 56 (سبح لله)" },
  { hizbNumber: 57, juzNumber: 29, startPage: 562, startSurahName: "الملك", startSurahNumber: 67, startAyah: 1, nameArabic: "الحزب 57 (تبارك الذي)" },
  { hizbNumber: 58, juzNumber: 29, startPage: 572, startSurahName: "الجن", startSurahNumber: 72, startAyah: 1, nameArabic: "الحزب 58 (قل أوحي إلي)" },
  { hizbNumber: 59, juzNumber: 30, startPage: 582, startSurahName: "النبأ", startSurahNumber: 78, startAyah: 1, nameArabic: "الحزب 59 (عم يتساءلون)" },
  { hizbNumber: 60, juzNumber: 30, startPage: 591, startSurahName: "الطارق", startSurahNumber: 86, startAyah: 1, nameArabic: "الحزب 60 (والسماء والطارق)" }
];

/**
 * Helper to check if an Ayah contains a canonical Sajdah
 */
export function getSajdahInfo(surahNumber: number, ayahNumber: number): SajdahMetadata | undefined {
  return SAJDAH_VERSES_CANONICAL.find(
    (s) => s.surahNumber === surahNumber && s.ayahNumber === ayahNumber
  );
}

/**
 * Helper to find the Hizb for any given page
 */
export function getHizbForPage(pageNumber: number): HizbInfo {
  for (let i = HIZB_LIST.length - 1; i >= 0; i--) {
    if (pageNumber >= HIZB_LIST[i].startPage) {
      return HIZB_LIST[i];
    }
  }
  return HIZB_LIST[0];
}
