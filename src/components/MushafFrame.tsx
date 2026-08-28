import React from 'react';
import { PaperTheme } from '../types/quran';
import { toArabicNumerals } from '../services/quranApi';

interface MushafFrameProps {
  pageNumber: number;
  juzNumber: number;
  surahName: string;
  isOpeningPage?: boolean;
  theme: PaperTheme;
  children: React.ReactNode;
}

export const MushafFrame: React.FC<MushafFrameProps> = ({
  pageNumber,
  juzNumber,
  surahName,
  isOpeningPage = false,
  theme,
  children,
}) => {
  const isLeft = pageNumber % 2 === 0;

  // Opening page elaborate gilded illumination border (Pages 1 & 2)
  if (isOpeningPage) {
    return (
      <div className="relative w-full h-full p-2 sm:p-4 md:p-6 flex flex-col justify-between select-none">
        {/* Outer Gold & Deep Islamic Forest Green Illumination Frame */}
        <div 
          className="relative w-full h-full border-[6px] sm:border-[12px] rounded-sm p-2 sm:p-4 shadow-2xl flex flex-col justify-between overflow-hidden"
          style={{
            borderColor: '#c5a059',
            borderImage: 'linear-gradient(to bottom right, #c5a059, #e9d19a, #8b6e31) 1',
            backgroundColor: theme === 'dark' ? '#151b23' : '#fdfaf2'
          }}
        >
          {/* Ornate Corner Arabesque Accents */}
          <div className="absolute top-0 left-0 w-16 sm:w-24 h-16 sm:h-24 border-t-4 border-l-4 border-[#1e4d2b] -m-1 sm:-m-2 z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:h-24 border-t-4 border-r-4 border-[#1e4d2b] -m-1 sm:-m-2 z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 border-b-4 border-l-4 border-[#1e4d2b] -m-1 sm:-m-2 z-10 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-16 sm:w-24 h-16 sm:h-24 border-b-4 border-r-4 border-[#1e4d2b] -m-1 sm:-m-2 z-10 pointer-events-none" />

          {/* Inner Golden Double Floral Frame */}
          <div className="w-full h-full border-2 border-[#c5a059] p-2 sm:p-5 flex flex-col justify-between relative bg-opacity-40">
            {/* Header / Surah Name Top Badge in Natural Tones style */}
            <header className="w-full flex justify-between items-center px-2 sm:px-8 mb-4 sm:mb-6 border-b-2 border-[#e9d19a] pb-3" dir="rtl">
              <div className="flex flex-col items-center">
                <span className="text-[#8b6e31] dark:text-[#e9d19a] text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-1 font-reem">
                  الجزء {toArabicNumerals(juzNumber)}
                </span>
                <div className="h-1 w-8 sm:w-12 bg-[#1e4d2b] dark:bg-[#c5a059] rounded-full"></div>
              </div>
              
              <div className="relative px-5 sm:px-10 py-1.5 sm:py-2.5 bg-[#1e4d2b] dark:bg-[#0a2312] border border-[#c5a059] rounded-sm shadow-md">
                <div className="absolute inset-0 border border-[#c5a059] m-0.5 sm:m-1"></div>
                <h1 className="text-[#fdfaf2] text-sm sm:text-xl md:text-2xl font-quran font-bold relative z-10">
                  سُورَةُ {surahName}
                </h1>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[#8b6e31] dark:text-[#e9d19a] text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-1 font-reem">
                  الحزب {toArabicNumerals(Math.ceil(pageNumber / 10))}
                </span>
                <div className="h-1 w-8 sm:w-12 bg-[#1e4d2b] dark:bg-[#c5a059] rounded-full"></div>
              </div>
            </header>

            {/* Core Text Content */}
            <div className="flex-1 flex flex-col justify-center my-2 sm:my-4">
              {children}
            </div>

            {/* Bottom Page Number Ornament (8-point Islamic Star) */}
            <footer className="w-full flex justify-center items-center py-2">
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14">
                <div className="absolute inset-0 border-2 border-[#c5a059] rotate-45"></div>
                <div className="absolute inset-0 border-2 border-[#1e4d2b]"></div>
                <span className="relative z-10 text-sm sm:text-lg font-bold text-[#1e4d2b] dark:text-amber-300 font-reem">
                  {toArabicNumerals(pageNumber)}
                </span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    );
  }

  // Standard Page Frame (Pages 3 to 604) in Natural Tones theme
  return (
    <div className="relative w-full h-full p-2 sm:p-4 md:p-5 flex flex-col justify-between select-none">
      {/* Outer Natural Tones Gold Gilded Margin Frame */}
      <div 
        className="w-full h-full border-[5px] sm:border-[8px] rounded-sm p-1.5 sm:p-2.5 flex flex-col justify-between relative shadow-md"
        style={{
          borderColor: '#c5a059',
          borderImage: 'linear-gradient(to bottom right, #c5a059, #e9d19a, #8b6e31) 1',
          backgroundColor: theme === 'dark' ? '#151b23' : '#fdfaf2'
        }}
      >
        {/* Subtle Decorative Forest Green Corners */}
        <div className="absolute top-0 left-0 w-8 sm:w-14 h-8 sm:h-14 border-t-2 border-l-2 border-[#1e4d2b] -m-1 z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 sm:w-14 h-8 sm:h-14 border-t-2 border-r-2 border-[#1e4d2b] -m-1 z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 sm:w-14 h-8 sm:h-14 border-b-2 border-l-2 border-[#1e4d2b] -m-1 z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 sm:w-14 h-8 sm:h-14 border-b-2 border-r-2 border-[#1e4d2b] -m-1 z-10 pointer-events-none" />

        {/* Top Header Row (Juz, Surah Name, Hizb) */}
        <header className="w-full flex justify-between items-center px-3 sm:px-6 mb-2 border-b-2 border-[#e9d19a]/80 pb-2" dir="rtl">
          <div className="flex flex-col items-center">
            <span className="text-[#8b6e31] dark:text-[#e9d19a] text-[10px] sm:text-xs font-bold font-reem">
              الجزء {toArabicNumerals(juzNumber)}
            </span>
            <div className="h-0.5 w-6 sm:w-10 bg-[#1e4d2b] dark:bg-[#c5a059] rounded-full mt-0.5"></div>
          </div>
          
          <div className="relative px-4 sm:px-8 py-1 bg-[#1e4d2b] dark:bg-[#0a2312] border border-[#c5a059] rounded-xs shadow-xs">
            <div className="absolute inset-0 border border-[#c5a059] m-0.5"></div>
            <h1 className="text-[#fdfaf2] text-xs sm:text-base md:text-lg font-quran font-bold relative z-10">
              سُورَةُ {surahName}
            </h1>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[#8b6e31] dark:text-[#e9d19a] text-[10px] sm:text-xs font-bold font-reem">
              الحزب {toArabicNumerals(Math.ceil(pageNumber / 10))}
            </span>
            <div className="h-0.5 w-6 sm:w-10 bg-[#1e4d2b] dark:bg-[#c5a059] rounded-full mt-0.5"></div>
          </div>
        </header>

        {/* Inner Classical Text Border */}
        <div className="w-full flex-1 border border-[#c5a059]/40 p-2 sm:p-4 md:p-5 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Side Decorative Golden Line Accents */}
          <div className="absolute top-1/2 left-1 transform -translate-y-1/2 hidden sm:flex flex-col space-y-2 pointer-events-none">
            <div className="w-0.5 h-12 bg-[#e9d19a] opacity-40"></div>
            <div className="w-0.5 h-4 bg-[#8b6e31]"></div>
            <div className="w-0.5 h-12 bg-[#e9d19a] opacity-40"></div>
          </div>
          <div className="absolute top-1/2 right-1 transform -translate-y-1/2 hidden sm:flex flex-col space-y-2 pointer-events-none">
            <div className="w-0.5 h-12 bg-[#e9d19a] opacity-40"></div>
            <div className="w-0.5 h-4 bg-[#8b6e31]"></div>
            <div className="w-0.5 h-12 bg-[#e9d19a] opacity-40"></div>
          </div>

          {/* Verses Container */}
          <div className="flex-1 flex flex-col justify-between py-1">
            {children}
          </div>
        </div>

        {/* Bottom Page Number (Natural Tones Geometric Medallion) */}
        <footer className="w-full flex justify-center items-center py-1 mt-1">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
            <div className="absolute inset-0 border border-[#c5a059] rotate-45"></div>
            <div className="absolute inset-0 border border-[#1e4d2b]"></div>
            <span className="relative z-10 text-xs sm:text-sm font-bold text-[#1e4d2b] dark:text-amber-300 font-reem">
              {toArabicNumerals(pageNumber)}
            </span>
          </div>
        </footer>

        {/* Margin Decorative Hizb/Rub Marker if on page edge */}
        {pageNumber % 2 === 0 && (
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center pointer-events-none">
            <div className="w-6 h-14 bg-[#1e4d2b] text-[#fdfaf2] border border-[#c5a059] rounded-r-md text-[10px] font-bold flex items-center justify-center [writing-mode:vertical-rl] shadow-sm font-reem">
              الحزب {toArabicNumerals(Math.ceil(pageNumber / 10))}
            </div>
          </div>
        )}
        {pageNumber % 2 !== 0 && (
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center pointer-events-none">
            <div className="w-6 h-14 bg-[#1e4d2b] text-[#fdfaf2] border border-[#c5a059] rounded-l-md text-[10px] font-bold flex items-center justify-center [writing-mode:vertical-rl] shadow-sm font-reem">
              الجزء {toArabicNumerals(juzNumber)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Surah Headpiece Banner Component
export const SurahHeaderBanner: React.FC<{
  surahName: string;
  ayahCount: number;
  revelationPlace: 'مكية' | 'مدنية';
}> = ({ surahName, ayahCount, revelationPlace }) => {
  return (
    <div className="w-full my-3 sm:my-4 select-none">
      <div className="relative w-full py-2 px-4 border-2 border-[#c5a059] rounded-sm bg-[#1e4d2b] dark:bg-[#0a2312] text-center shadow-md overflow-hidden flex items-center justify-center min-h-[44px]">
        {/* Geometric Islamic Ornament Inner Lines */}
        <div className="absolute inset-0 border border-[#e9d19a]/40 m-1 pointer-events-none"></div>
        
        {/* Left item (absolute on sm) */}
        <span className="hidden sm:inline absolute left-4 bg-[#15341d] dark:bg-[#151b23] border border-[#c5a059]/40 px-2.5 py-0.5 rounded text-[11px] text-[#e9d19a] font-reem">
          {revelationPlace}
        </span>
        
        {/* Perfectly centered title */}
        <h2 className="text-base sm:text-xl md:text-2xl font-bold font-quran text-[#fdfaf2] tracking-wider relative z-10 mx-auto">
          سُورَةُ {surahName}
        </h2>

        {/* Right item (absolute on sm) */}
        <span className="hidden sm:inline absolute right-4 bg-[#15341d] dark:bg-[#151b23] border border-[#c5a059]/40 px-2.5 py-0.5 rounded text-[11px] text-[#e9d19a] font-reem">
          {toArabicNumerals(ayahCount)} آيات
        </span>
      </div>
    </div>
  );
};

// Basmalah Calligraphy Banner
export const BasmalahBanner: React.FC<{ theme?: PaperTheme }> = ({ theme }) => {
  return (
    <div className="w-full text-center my-3 sm:my-4 select-none" dir="rtl">
      <div
        className="inline-block px-4 py-1 text-center font-quran text-lg sm:text-2xl md:text-3xl tracking-wide transition-colors quran-text-container"
        dir="rtl"
        style={{
          wordSpacing: '8px',
          color: theme === 'dark' ? '#f8fafc' : '#1a1a1a',
        }}
      >
        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
      </div>
    </div>
  );
};

