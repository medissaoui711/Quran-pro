import { Surah, Reciter } from '../types/quran';

export const SURAHS: Surah[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", englishNameTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 1, endPage: 1, juz: 1 },
  { number: 2, name: "البقرة", englishName: "Al-Baqarah", englishNameTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 2, endPage: 49, juz: 1 },
  { number: 3, name: "آل عمران", englishName: "Ali 'Imran", englishNameTranslation: "Family of Imran", numberOfAyahs: 200, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 50, endPage: 76, juz: 3 },
  { number: 4, name: "النساء", englishName: "An-Nisa", englishNameTranslation: "The Women", numberOfAyahs: 176, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 77, endPage: 106, juz: 4 },
  { number: 5, name: "المائدة", englishName: "Al-Ma'idah", englishNameTranslation: "The Table Spread", numberOfAyahs: 120, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 106, endPage: 127, juz: 6 },
  { number: 6, name: "الأنعام", englishName: "Al-An'am", englishNameTranslation: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 128, endPage: 150, juz: 7 },
  { number: 7, name: "الأعراف", englishName: "Al-A'raf", englishNameTranslation: "The Heights", numberOfAyahs: 206, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 151, endPage: 176, juz: 8 },
  { number: 8, name: "الأنفال", englishName: "Al-Anfal", englishNameTranslation: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 177, endPage: 186, juz: 9 },
  { number: 9, name: "التوبة", englishName: "At-Tawbah", englishNameTranslation: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 187, endPage: 207, juz: 10 },
  { number: 10, name: "يونس", englishName: "Yunus", englishNameTranslation: "Jonah", numberOfAyahs: 109, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 208, endPage: 221, juz: 11 },
  { number: 11, name: "هود", englishName: "Hud", englishNameTranslation: "Hud", numberOfAyahs: 123, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 221, endPage: 235, juz: 11 },
  { number: 12, name: "يوسف", englishName: "Yusuf", englishNameTranslation: "Joseph", numberOfAyahs: 111, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 235, endPage: 248, juz: 12 },
  { number: 13, name: "الرعد", englishName: "Ar-Ra'd", englishNameTranslation: "The Thunder", numberOfAyahs: 43, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 249, endPage: 255, juz: 13 },
  { number: 14, name: "إبراهيم", englishName: "Ibrahim", englishNameTranslation: "Abraham", numberOfAyahs: 52, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 255, endPage: 261, juz: 13 },
  { number: 15, name: "الحجر", englishName: "Al-Hijr", englishNameTranslation: "The Rocky Tract", numberOfAyahs: 99, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 262, endPage: 267, juz: 14 },
  { number: 16, name: "النحل", englishName: "An-Nahl", englishNameTranslation: "The Bee", numberOfAyahs: 128, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 267, endPage: 281, juz: 14 },
  { number: 17, name: "الإسراء", englishName: "Al-Isra", englishNameTranslation: "The Night Journey", numberOfAyahs: 111, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 282, endPage: 293, juz: 15 },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", englishNameTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 293, endPage: 304, juz: 15 },
  { number: 19, name: "مريم", englishName: "Maryam", englishNameTranslation: "Mary", numberOfAyahs: 98, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 305, endPage: 312, juz: 16 },
  { number: 20, name: "طه", englishName: "Ta-Ha", englishNameTranslation: "Ta-Ha", numberOfAyahs: 135, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 312, endPage: 321, juz: 16 },
  { number: 21, name: "الأنبياء", englishName: "Al-Anbiya", englishNameTranslation: "The Prophets", numberOfAyahs: 112, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 322, endPage: 331, juz: 17 },
  { number: 22, name: "الحج", englishName: "Al-Hajj", englishNameTranslation: "The Pilgrimage", numberOfAyahs: 78, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 332, endPage: 341, juz: 17 },
  { number: 23, name: "المؤمنون", englishName: "Al-Mu'minun", englishNameTranslation: "The Believers", numberOfAyahs: 118, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 342, endPage: 349, juz: 18 },
  { number: 24, name: "النور", englishName: "An-Nur", englishNameTranslation: "The Light", numberOfAyahs: 64, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 350, endPage: 359, juz: 18 },
  { number: 25, name: "الفرقان", englishName: "Al-Furqan", englishNameTranslation: "The Criterion", numberOfAyahs: 77, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 359, endPage: 366, juz: 18 },
  { number: 26, name: "الشعراء", englishName: "Ash-Shu'ara", englishNameTranslation: "The Poets", numberOfAyahs: 227, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 367, endPage: 376, juz: 19 },
  { number: 27, name: "النمل", englishName: "An-Naml", englishNameTranslation: "The Ant", numberOfAyahs: 93, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 377, endPage: 385, juz: 19 },
  { number: 28, name: "القصص", englishName: "Al-Qasas", englishNameTranslation: "The Stories", numberOfAyahs: 88, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 385, endPage: 396, juz: 20 },
  { number: 29, name: "العنكبوت", englishName: "Al-'Ankabut", englishNameTranslation: "The Spider", numberOfAyahs: 69, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 396, endPage: 404, juz: 20 },
  { number: 30, name: "الروم", englishName: "Ar-Rum", englishNameTranslation: "The Romans", numberOfAyahs: 60, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 404, endPage: 410, juz: 21 },
  { number: 31, name: "لقمان", englishName: "Luqman", englishNameTranslation: "Luqman", numberOfAyahs: 34, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 411, endPage: 414, juz: 21 },
  { number: 32, name: "السجدة", englishName: "As-Sajdah", englishNameTranslation: "The Prostration", numberOfAyahs: 30, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 415, endPage: 417, juz: 21 },
  { number: 33, name: "الأحزاب", englishName: "Al-Ahzab", englishNameTranslation: "The Combined Forces", numberOfAyahs: 73, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 418, endPage: 427, juz: 21 },
  { number: 34, name: "سبأ", englishName: "Saba", englishNameTranslation: "Sheba", numberOfAyahs: 54, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 428, endPage: 434, juz: 22 },
  { number: 35, name: "فاطر", englishName: "Fatir", englishNameTranslation: "Originator", numberOfAyahs: 45, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 434, endPage: 440, juz: 22 },
  { number: 36, name: "يس", englishName: "Ya-Sin", englishNameTranslation: "Ya-Sin", numberOfAyahs: 83, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 440, endPage: 445, juz: 22 },
  { number: 37, name: "الصافات", englishName: "As-Saffat", englishNameTranslation: "Those who set the Ranks", numberOfAyahs: 182, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 446, endPage: 452, juz: 23 },
  { number: 38, name: "ص", englishName: "Sad", englishNameTranslation: "The Letter Sad", numberOfAyahs: 88, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 453, endPage: 458, juz: 23 },
  { number: 39, name: "الزمر", englishName: "Az-Zumar", englishNameTranslation: "The Troops", numberOfAyahs: 75, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 458, endPage: 467, juz: 23 },
  { number: 40, name: "غافر", englishName: "Ghafir", englishNameTranslation: "The Forgiver", numberOfAyahs: 85, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 467, endPage: 476, juz: 24 },
  { number: 41, name: "فصلت", englishName: "Fussilat", englishNameTranslation: "Explained in Detail", numberOfAyahs: 54, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 477, endPage: 482, juz: 24 },
  { number: 42, name: "الشورى", englishName: "Ash-Shura", englishNameTranslation: "The Consultation", numberOfAyahs: 53, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 483, endPage: 489, juz: 25 },
  { number: 43, name: "الزخرف", englishName: "Az-Zukhruf", englishNameTranslation: "The Ornaments of Gold", numberOfAyahs: 89, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 489, endPage: 495, juz: 25 },
  { number: 44, name: "الدخان", englishName: "Ad-Dukhan", englishNameTranslation: "The Smoke", numberOfAyahs: 59, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 496, endPage: 498, juz: 25 },
  { number: 45, name: "الجاثية", englishName: "Al-Jathiyah", englishNameTranslation: "The Crouching", numberOfAyahs: 37, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 499, endPage: 502, juz: 25 },
  { number: 46, name: "الأحقاف", englishName: "Al-Ahqaf", englishNameTranslation: "The Wind-Curved Sandhills", numberOfAyahs: 35, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 502, endPage: 506, juz: 26 },
  { number: 47, name: "محمد", englishName: "Muhammad", englishNameTranslation: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 507, endPage: 510, juz: 26 },
  { number: 48, name: "الفتح", englishName: "Al-Fath", englishNameTranslation: "The Victory", numberOfAyahs: 29, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 511, endPage: 515, juz: 26 },
  { number: 49, name: "الحجرات", englishName: "Al-Hujurat", englishNameTranslation: "The Rooms", numberOfAyahs: 18, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 515, endPage: 517, juz: 26 },
  { number: 50, name: "ق", englishName: "Qaf", englishNameTranslation: "The Letter Qaf", numberOfAyahs: 45, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 518, endPage: 520, juz: 26 },
  { number: 51, name: "الذاريات", englishName: "Adh-Dhariyat", englishNameTranslation: "The Winnowing Winds", numberOfAyahs: 60, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 520, endPage: 523, juz: 26 },
  { number: 52, name: "الطور", englishName: "At-Tur", englishNameTranslation: "The Mount", numberOfAyahs: 49, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 523, endPage: 525, juz: 27 },
  { number: 53, name: "النجم", englishName: "An-Najm", englishNameTranslation: "The Star", numberOfAyahs: 62, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 526, endPage: 528, juz: 27 },
  { number: 54, name: "القمر", englishName: "Al-Qamar", englishNameTranslation: "The Moon", numberOfAyahs: 55, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 528, endPage: 531, juz: 27 },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", englishNameTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 531, endPage: 534, juz: 27 },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'ah", englishNameTranslation: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 534, endPage: 537, juz: 27 },
  { number: 57, name: "الحديد", englishName: "Al-Hadid", englishNameTranslation: "The Iron", numberOfAyahs: 29, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 537, endPage: 541, juz: 27 },
  { number: 58, name: "المجادلة", englishName: "Al-Mujadila", englishNameTranslation: "The Pleading Woman", numberOfAyahs: 22, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 542, endPage: 545, juz: 28 },
  { number: 59, name: "الحشر", englishName: "Al-Hashr", englishNameTranslation: "The Exile", numberOfAyahs: 24, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 545, endPage: 548, juz: 28 },
  { number: 60, name: "الممتحنة", englishName: "Al-Mumtahanah", englishNameTranslation: "She that is to be examined", numberOfAyahs: 13, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 549, endPage: 551, juz: 28 },
  { number: 61, name: "الصف", englishName: "As-Saf", englishNameTranslation: "The Ranks", numberOfAyahs: 14, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 551, endPage: 552, juz: 28 },
  { number: 62, name: "الجمعة", englishName: "Al-Jumu'ah", englishNameTranslation: "The Congregation", numberOfAyahs: 11, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 553, endPage: 554, juz: 28 },
  { number: 63, name: "المنافقون", englishName: "Al-Munafiqun", englishNameTranslation: "The Hypocrites", numberOfAyahs: 11, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 554, endPage: 555, juz: 28 },
  { number: 64, name: "التغابن", englishName: "At-Taghabun", englishNameTranslation: "The Mutual Disillusion", numberOfAyahs: 18, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 556, endPage: 557, juz: 28 },
  { number: 65, name: "الطلاق", englishName: "At-Talaq", englishNameTranslation: "The Divorce", numberOfAyahs: 12, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 558, endPage: 559, juz: 28 },
  { number: 66, name: "التحريم", englishName: "At-Tahrim", englishNameTranslation: "The Prohibition", numberOfAyahs: 12, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 560, endPage: 561, juz: 28 },
  { number: 67, name: "الملك", englishName: "Al-Mulk", englishNameTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 562, endPage: 564, juz: 29 },
  { number: 68, name: "القلم", englishName: "Al-Qalam", englishNameTranslation: "The Pen", numberOfAyahs: 52, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 564, endPage: 566, juz: 29 },
  { number: 69, name: "الحاقة", englishName: "Al-Haqqah", englishNameTranslation: "The Reality", numberOfAyahs: 52, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 566, endPage: 568, juz: 29 },
  { number: 70, name: "المعارج", englishName: "Al-Ma'arij", englishNameTranslation: "The Ascending Stairways", numberOfAyahs: 44, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 568, endPage: 570, juz: 29 },
  { number: 71, name: "نوح", englishName: "Nuh", englishNameTranslation: "Noah", numberOfAyahs: 28, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 570, endPage: 571, juz: 29 },
  { number: 72, name: "الجن", englishName: "Al-Jinn", englishNameTranslation: "The Jinn", numberOfAyahs: 28, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 572, endPage: 573, juz: 29 },
  { number: 73, name: "المزمل", englishName: "Al-Muzzammil", englishNameTranslation: "The Enshrouded One", numberOfAyahs: 20, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 574, endPage: 575, juz: 29 },
  { number: 74, name: "المدثر", englishName: "Al-Muddaththir", englishNameTranslation: "The Cloaked One", numberOfAyahs: 56, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 575, endPage: 577, juz: 29 },
  { number: 75, name: "القيامة", englishName: "Al-Qiyamah", englishNameTranslation: "The Resurrection", numberOfAyahs: 40, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 577, endPage: 578, juz: 29 },
  { number: 76, name: "الإنسان", englishName: "Al-Insan", englishNameTranslation: "Man", numberOfAyahs: 31, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 578, endPage: 580, juz: 29 },
  { number: 77, name: "المرسلات", englishName: "Al-Mursalat", englishNameTranslation: "The Emissaries", numberOfAyahs: 50, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 580, endPage: 581, juz: 29 },
  { number: 78, name: "النبأ", englishName: "An-Naba", englishNameTranslation: "The Tidings", numberOfAyahs: 40, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 582, endPage: 583, juz: 30 },
  { number: 79, name: "النازعات", englishName: "An-Nazi'at", englishNameTranslation: "Those who drag forth", numberOfAyahs: 46, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 583, endPage: 584, juz: 30 },
  { number: 80, name: "عبس", englishName: "'Abasa", englishNameTranslation: "He Frowned", numberOfAyahs: 42, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 585, endPage: 586, juz: 30 },
  { number: 81, name: "التكوير", englishName: "At-Takwir", englishNameTranslation: "The Overthrowing", numberOfAyahs: 29, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 586, endPage: 587, juz: 30 },
  { number: 82, name: "الانفطار", englishName: "Al-Infitar", englishNameTranslation: "The Cleaving", numberOfAyahs: 19, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 587, endPage: 587, juz: 30 },
  { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", englishNameTranslation: "The Defrauding", numberOfAyahs: 36, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 587, endPage: 589, juz: 30 },
  { number: 84, name: "الانشقاق", englishName: "Al-Inshiqaq", englishNameTranslation: "The Splitting Open", numberOfAyahs: 25, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 589, endPage: 590, juz: 30 },
  { number: 85, name: "البروج", englishName: "Al-Buruj", englishNameTranslation: "The Mansions of the Stars", numberOfAyahs: 22, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 590, endPage: 591, juz: 30 },
  { number: 86, name: "الطارق", englishName: "At-Tariq", englishNameTranslation: "The Morning Star", numberOfAyahs: 17, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 591, endPage: 592, juz: 30 },
  { number: 87, name: "الأعلى", englishName: "Al-A'la", englishNameTranslation: "The Most High", numberOfAyahs: 19, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 591, endPage: 592, juz: 30 },
  { number: 88, name: "الغاشية", englishName: "Al-Ghashiyah", englishNameTranslation: "The Overwhelming", numberOfAyahs: 26, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 592, endPage: 593, juz: 30 },
  { number: 89, name: "الفجر", englishName: "Al-Fajr", englishNameTranslation: "The Dawn", numberOfAyahs: 30, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 593, endPage: 594, juz: 30 },
  { number: 90, name: "البلد", englishName: "Al-Balad", englishNameTranslation: "The City", numberOfAyahs: 20, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 594, endPage: 595, juz: 30 },
  { number: 91, name: "الشمس", englishName: "Ash-Shams", englishNameTranslation: "The Sun", numberOfAyahs: 15, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 595, endPage: 595, juz: 30 },
  { number: 92, name: "الليل", englishName: "Al-Layl", englishNameTranslation: "The Night", numberOfAyahs: 21, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 595, endPage: 596, juz: 30 },
  { number: 93, name: "الضحى", englishName: "Ad-Duhaa", englishNameTranslation: "The Morning Hours", numberOfAyahs: 11, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 596, endPage: 596, juz: 30 },
  { number: 94, name: "الشرح", englishName: "Ash-Sharh", englishNameTranslation: "The Relief", numberOfAyahs: 8, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 596, endPage: 597, juz: 30 },
  { number: 95, name: "التين", englishName: "At-Tin", englishNameTranslation: "The Fig", numberOfAyahs: 8, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 597, endPage: 597, juz: 30 },
  { number: 96, name: "العلق", englishName: "Al-'Alaq", englishNameTranslation: "The Clot", numberOfAyahs: 19, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 597, endPage: 598, juz: 30 },
  { number: 97, name: "القدر", englishName: "Al-Qadr", englishNameTranslation: "The Power", numberOfAyahs: 5, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 598, endPage: 598, juz: 30 },
  { number: 98, name: "البينة", englishName: "Al-Bayyinah", englishNameTranslation: "The Clear Proof", numberOfAyahs: 8, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 598, endPage: 599, juz: 30 },
  { number: 99, name: "الزلزلة", englishName: "Az-Zalzalah", englishNameTranslation: "The Earthquake", numberOfAyahs: 8, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 599, endPage: 599, juz: 30 },
  { number: 100, name: "العاديات", englishName: "Al-'Adiyat", englishNameTranslation: "The Courser", numberOfAyahs: 11, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 599, endPage: 600, juz: 30 },
  { number: 101, name: "القارعة", englishName: "Al-Qari'ah", englishNameTranslation: "The Calamity", numberOfAyahs: 11, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 600, endPage: 600, juz: 30 },
  { number: 102, name: "التكاثر", englishName: "At-Takathur", englishNameTranslation: "The Rivalry in world increase", numberOfAyahs: 8, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 600, endPage: 600, juz: 30 },
  { number: 103, name: "العصر", englishName: "Al-'Asr", englishNameTranslation: "The Declining Day", numberOfAyahs: 3, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 601, endPage: 601, juz: 30 },
  { number: 104, name: "الهمزة", englishName: "Al-Humazah", englishNameTranslation: "The Traducer", numberOfAyahs: 9, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 601, endPage: 601, juz: 30 },
  { number: 105, name: "الفيل", englishName: "Al-Fil", englishNameTranslation: "The Elephant", numberOfAyahs: 5, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 601, endPage: 602, juz: 30 },
  { number: 106, name: "قريش", englishName: "Quraysh", englishNameTranslation: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 602, endPage: 602, juz: 30 },
  { number: 107, name: "الماعون", englishName: "Al-Ma'un", englishNameTranslation: "The Small Kindness", numberOfAyahs: 7, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 602, endPage: 602, juz: 30 },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", englishNameTranslation: "The Abundance", numberOfAyahs: 3, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 602, endPage: 602, juz: 30 },
  { number: 109, name: "الكافرون", englishName: "Al-Kafirun", englishNameTranslation: "The Disbelievers", numberOfAyahs: 6, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 603, endPage: 603, juz: 30 },
  { number: 110, name: "النصر", englishName: "An-Nasr", englishNameTranslation: "The Divine Support", numberOfAyahs: 3, revelationType: "Medinan", revelationPlaceArabic: "مدنية", startPage: 603, endPage: 603, juz: 30 },
  { number: 111, name: "المسد", englishName: "Al-Masad", englishNameTranslation: "The Palm Fiber", numberOfAyahs: 5, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 603, endPage: 603, juz: 30 },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", englishNameTranslation: "The Sincerity", numberOfAyahs: 4, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 604, endPage: 604, juz: 30 },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", englishNameTranslation: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 604, endPage: 604, juz: 30 },
  { number: 114, name: "الناس", englishName: "An-Nas", englishNameTranslation: "Mankind", numberOfAyahs: 6, revelationType: "Meccan", revelationPlaceArabic: "مكية", startPage: 604, endPage: 604, juz: 30 }
];

export const JUZ_LIST = [
  { juzNumber: 1, name: "الجزء الأول", startPage: 1, startSurah: "الفاتحة", startAyah: 1 },
  { juzNumber: 2, name: "الجزء الثاني (سَيَقُولُ)", startPage: 22, startSurah: "البقرة", startAyah: 142 },
  { juzNumber: 3, name: "الجزء الثالث (تِلْكَ الرُّسُلُ)", startPage: 42, startSurah: "البقرة", startAyah: 253 },
  { juzNumber: 4, name: "الجزء الرابع (لَن تَنَالُوا)", startPage: 62, startSurah: "آل عمران", startAyah: 93 },
  { juzNumber: 5, name: "الجزء الخامس (وَالْمُحْصَنَاتُ)", startPage: 82, startSurah: "النساء", startAyah: 24 },
  { juzNumber: 6, name: "الجزء السادس (لَا يُحِبُّ اللَّهُ)", startPage: 102, startSurah: "النساء", startAyah: 148 },
  { juzNumber: 7, name: "الجزء السابع (وَإِذَا سَمِعُوا)", startPage: 121, startSurah: "المائدة", startAyah: 82 },
  { juzNumber: 8, name: "الجزء الثامن (وَلَوْ أَنَّنَا)", startPage: 142, startSurah: "الأنعام", startAyah: 111 },
  { juzNumber: 9, name: "الجزء التاسع (قَالَ الْمَلَأُ)", startPage: 162, startSurah: "الأعراف", startAyah: 88 },
  { juzNumber: 10, name: "الجزء العاشر (وَاعْلَمُوا)", startPage: 182, startSurah: "الأنفال", startAyah: 41 },
  { juzNumber: 11, name: "الجزء الحادي عشر (يَعْتَذِرُونَ)", startPage: 201, startSurah: "التوبة", startAyah: 93 },
  { juzNumber: 12, name: "الجزء الثاني عشر (وَمَا مِن دَابَّةٍ)", startPage: 222, startSurah: "هود", startAyah: 6 },
  { juzNumber: 13, name: "الجزء الثالث عشر (وَمَا أُبَرِّئُ)", startPage: 242, startSurah: "يوسف", startAyah: 53 },
  { juzNumber: 14, name: "الجزء الرابع عشر (رُّبَمَا)", startPage: 262, startSurah: "الحجر", startAyah: 1 },
  { juzNumber: 15, name: "الجزء الخامس عشر (سُبْحَانَ الَّذِي)", startPage: 282, startSurah: "الإسراء", startAyah: 1 },
  { juzNumber: 16, name: "الجزء السادس عشر (قَالَ أَلَمْ)", startPage: 302, startSurah: "الكهف", startAyah: 75 },
  { juzNumber: 17, name: "الجزء السابع عشر (اقْتَرَبَ لِلنَّاسِ)", startPage: 322, startSurah: "الأنبياء", startAyah: 1 },
  { juzNumber: 18, name: "الجزء الثامن عشر (قَدْ أَفْلَحَ)", startPage: 342, startSurah: "المؤمنون", startAyah: 1 },
  { juzNumber: 19, name: "الجزء التاسع عشر (وَقَالَ الَّذِينَ)", startPage: 362, startSurah: "الفرقان", startAyah: 21 },
  { juzNumber: 20, name: "الجزء العشرون (أَمَّنْ خَلَقَ)", startPage: 382, startSurah: "النمل", startAyah: 60 },
  { juzNumber: 21, name: "الجزء الحادي والعشرون (اتْلُ مَا أُوحِيَ)", startPage: 402, startSurah: "العنكبوت", startAyah: 46 },
  { juzNumber: 22, name: "الجزء الثاني والعشرون (وَمَن يَقْنُتْ)", startPage: 422, startSurah: "الأحزاب", startAyah: 31 },
  { juzNumber: 23, name: "الجزء الثالث والعشرون (وَمَا أَنزَلْنَا)", startPage: 442, startSurah: "يس", startAyah: 28 },
  { juzNumber: 24, name: "الجزء الرابع والعشرون (فَمَنْ أَظْلَمُ)", startPage: 462, startSurah: "الزمر", startAyah: 32 },
  { juzNumber: 25, name: "الجزء الخامس والعشرون (إِلَيْهِ يُرَدُّ)", startPage: 482, startSurah: "فصلت", startAyah: 47 },
  { juzNumber: 26, name: "الجزء السادس والعشرون (حم)", startPage: 502, startSurah: "الأحقاف", startAyah: 1 },
  { juzNumber: 27, name: "الجزء السابع والعشرون (قَالَ فَمَا خَطْبُكُمْ)", startPage: 522, startSurah: "الذاريات", startAyah: 31 },
  { juzNumber: 28, name: "الجزء الثامن والعشرون (قَدْ سَمِعَ اللَّهُ)", startPage: 542, startSurah: "المجادلة", startAyah: 1 },
  { juzNumber: 29, name: "الجزء التاسع والعشرون (تَبَارَكَ الَّذِي)", startPage: 562, startSurah: "الملك", startAyah: 1 },
  { juzNumber: 30, name: "الجزء الثلاثون (عَمَّ يَتَسَاءَلُونَ)", startPage: 582, startSurah: "النبأ", startAyah: 1 }
];

export const RECITERS: Reciter[] = [
  {
    id: "Alaa_Aql",
    name: "علاء عقل",
    englishName: "Sheikh Alaa Aql",
    style: "مرتل خاشع",
    serverUrl: "https://everyayah.com/data/Alafasy_128kbps"
  },
  {
    id: "Alafasy_128kbps",
    name: "مشاري راشد العفاسي",
    englishName: "Mishary Rashid Alafasy",
    style: "مرتل",
    serverUrl: "https://everyayah.com/data/Alafasy_128kbps"
  },
  {
    id: "Abdul_Basit_Murattal_192kbps",
    name: "عبد الباسط عبد الصمد (مرتل)",
    englishName: "AbdulBaset AbdulSamad (Murattal)",
    style: "مرتل",
    serverUrl: "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps"
  },
  {
    id: "Abdul_Basit_Mujawwad_128kbps",
    name: "عبد الباسط عبد الصمد (مجود)",
    englishName: "AbdulBaset AbdulSamad (Mujawwad)",
    style: "مجود",
    serverUrl: "https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps"
  },
  {
    id: "Husary_128kbps",
    name: "محمود خليل الحصري",
    englishName: "Mahmoud Khalil Al-Husary",
    style: "مرتل",
    serverUrl: "https://everyayah.com/data/Husary_128kbps"
  },
  {
    id: "Ghamadi_40kbps",
    name: "سعد الغامدي",
    englishName: "Saad Al-Ghamdi",
    style: "مرتل",
    serverUrl: "https://everyayah.com/data/Ghamadi_40kbps"
  },
  {
    id: "Maher_AlMuaiqly_64kbps",
    name: "ماهر المعيقلي",
    englishName: "Maher Al-Muaiqly",
    style: "مرتل",
    serverUrl: "https://everyayah.com/data/Maher_AlMuaiqly_64kbps"
  },
  {
    id: "Minshawy_Murattal_128kbps",
    name: "محمد صديق المنشاوي",
    englishName: "Mohamed Siddiq Al-Minshawi",
    style: "مرتل",
    serverUrl: "https://everyayah.com/data/Minshawy_Murattal_128kbps"
  }
];

export function getJuzForPage(page: number): number {
  for (let i = JUZ_LIST.length - 1; i >= 0; i--) {
    if (page >= JUZ_LIST[i].startPage) {
      return JUZ_LIST[i].juzNumber;
    }
  }
  return 1;
}

export function getSurahForPage(page: number): Surah {
  for (let s of SURAHS) {
    if (page >= s.startPage && page <= s.endPage) {
      return s;
    }
  }
  return SURAHS[0];
}
