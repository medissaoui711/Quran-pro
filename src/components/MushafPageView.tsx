import React, { useState } from 'react';
import { Ayah, QuranPageData, PaperTheme } from '../types/quran';
import { MushafFrame, SurahHeaderBanner, BasmalahBanner } from './MushafFrame';
import { toArabicNumerals, getMushafPageImageUrl, getMushafPageImageUrlBackup } from '../services/quranApi';
import { SURAHS } from '../data/quranMetadata';

interface MushafPageViewProps {
  pageData: QuranPageData;
  theme: PaperTheme;
  activeAyahNumber: number | null;
  onAyahClick: (ayah: Ayah) => void;
  renderMode: 'image' | 'text';
  fontSize?: number;
  highlightTajweed?: boolean;
}

export const MushafPageView: React.FC<MushafPageViewProps> = ({
  pageData,
  theme,
  activeAyahNumber,
  onAyahClick,
  renderMode = 'image',
  fontSize = 22,
}) => {
  const [imageError, setImageError] = useState(false);
  const [useBackupImage, setUseBackupImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const mainSurahName = pageData.surahNames[0] || 'الفاتحة';
  const surahInfo = SURAHS.find((s) => s.name === mainSurahName) || SURAHS[0];

  // Group ayahs by surah to insert headers if a new surah starts on this page
  const ayahsBySurah: { [surahNum: number]: Ayah[] } = {};
  pageData.ayahs.forEach((ayah) => {
    if (!ayahsBySurah[ayah.surahNumber]) {
      ayahsBySurah[ayah.surahNumber] = [];
    }
    ayahsBySurah[ayah.surahNumber].push(ayah);
  });

  const surahKeys = Object.keys(ayahsBySurah).map(Number);

  // Background and theme classes
  const themeClass = `theme-${theme}`;

  return (
    <div
      className={`relative w-full h-full min-h-[580px] sm:min-h-[720px] md:min-h-[820px] flex flex-col justify-between transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#151b23] text-slate-100'
          : 'bg-[#fdfaf2] text-[#1a1a1a]'
      } ${pageData.isLeftPage ? 'book-spine-shadow-left' : 'book-spine-shadow-right'}`}
      style={{ backgroundColor: theme === 'dark' ? '#151b23' : '#fdfaf2' }}
    >
      {/* If Render Mode is High-Definition Scanned Authentic Mushaf Page */}
      {renderMode === 'image' && !imageError ? (
        <div className="relative w-full h-full p-2 sm:p-4 flex flex-col items-center justify-center">
          {/* Subtle Skeleton Loader while Image Loads */}
          {!imageLoaded && (
            <div className="absolute inset-4 flex flex-col items-center justify-center bg-[#c5a059]/10 animate-pulse rounded-md">
              <div className="text-[#8b6e31] font-reem text-sm sm:text-base">
                جاري تحميل صفحة المصحف {toArabicNumerals(pageData.pageNumber)}...
              </div>
            </div>
          )}

          <img
            src={useBackupImage ? getMushafPageImageUrlBackup(pageData.pageNumber) : getMushafPageImageUrl(pageData.pageNumber)}
            alt={`صفحة المصحف الشريف رقم ${pageData.pageNumber}`}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              if (!useBackupImage) {
                setUseBackupImage(true);
              } else {
                setImageError(true);
              }
            }}
            className={`w-full h-full max-h-[820px] object-contain select-none transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${theme === 'dark' ? 'filter invert hue-rotate-180 brightness-90 contrast-125' : ''}`}
          />

          {/* Bottom Floating Quick Actions Toolbar over page */}
          <div className="w-full flex items-center justify-between px-3 py-1 text-[11px] sm:text-xs text-[#8b6e31] dark:text-amber-300 font-reem mt-1 border-t border-[#e9d19a]/30">
            <span>الجزء {toArabicNumerals(pageData.juzNumber)}</span>
            <span>صفحة {toArabicNumerals(pageData.pageNumber)}</span>
            <span>سورة {mainSurahName}</span>
          </div>
        </div>
      ) : (
        /* Vector / Typography High-Resolution Text Rendering within Islamic Frame */
        <MushafFrame
          pageNumber={pageData.pageNumber}
          juzNumber={pageData.juzNumber}
          surahName={mainSurahName}
          isOpeningPage={pageData.hasSpecialOpeningFrame}
          theme={theme}
        >
          <div className="w-full flex-1 flex flex-col justify-center leading-loose">
            {surahKeys.map((sNum) => {
              const currentSurah = SURAHS.find((s) => s.number === sNum) || surahInfo;
              const surahAyahs = ayahsBySurah[sNum];
              const isStartOfSurah = surahAyahs[0]?.numberInSurah === 1;

              return (
                <div key={sNum} className="w-full mb-2">
                  {/* Surah Header if page begins a new Surah */}
                  {isStartOfSurah && sNum !== 1 && (
                    <>
                      <SurahHeaderBanner
                        surahName={currentSurah.name}
                        ayahCount={currentSurah.numberOfAyahs}
                        revelationPlace={currentSurah.revelationPlaceArabic}
                      />
                      {sNum !== 9 && <BasmalahBanner theme={theme} />}
                    </>
                  )}

                  {/* Verses flow */}
                  <div
                    className="w-full text-center font-quran leading-[2.6] sm:leading-[2.9] md:leading-[3.2] px-1 sm:px-2 text-justify [text-align-last:center] transition-colors duration-200"
                    style={{
                      fontSize: `${fontSize}px`,
                      color: theme === 'dark' ? '#f8fafc' : '#1a1a1a',
                    }}
                  >
                    {surahAyahs.map((ayah) => {
                      const isActive = activeAyahNumber === ayah.number;

                      return (
                        <span
                          key={ayah.number}
                          onClick={() => onAyahClick(ayah)}
                          style={{
                            color: isActive
                              ? theme === 'dark'
                                ? '#6ee7b7'
                                : '#1e4d2b'
                              : theme === 'dark'
                              ? '#f8fafc'
                              : '#1a1a1a',
                          }}
                          className={`cursor-pointer inline transition-all duration-200 rounded px-1 py-0.5 mx-0.5 hover:bg-[#c5a059]/25 active:scale-95 ${
                            isActive
                              ? theme === 'dark'
                                ? 'bg-emerald-950/80 font-bold underline decoration-[#c5a059] decoration-2 shadow-xs'
                                : 'bg-[#1e4d2b]/20 font-bold underline decoration-[#c5a059] decoration-2'
                              : ''
                          }`}
                          title={`سورة ${ayah.surahName} - الآية ${ayah.numberInSurah} (انقر للاستماع والتفسير)`}
                        >
                          <span className="leading-normal">{ayah.text}</span>
                          
                          {/* Ayah End Ornamental Marker ﴿١﴾ matching Natural Tones style */}
                          <span
                            className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 border-2 border-[#c5a059] rounded-full text-xs sm:text-sm font-bold mx-1.5 align-middle select-none transition-colors"
                            style={{
                              backgroundColor: theme === 'dark' ? '#15241b' : '#fdfaf2',
                              color: theme === 'dark' ? '#fbbf24' : '#8b6e31',
                              borderColor: theme === 'dark' ? '#e9d19a' : '#c5a059',
                            }}
                          >
                            {toArabicNumerals(ayah.numberInSurah)}
                          </span>

                          {/* Sajdah Marker badge if exists */}
                          {ayah.sajda && (
                            <span className="inline-flex items-center text-[10px] sm:text-xs bg-[#1e4d2b] text-[#fdfaf2] border border-[#c5a059] px-1.5 py-0.5 rounded mx-1 font-reem">
                              ۩ سجدة
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </MushafFrame>
      )}
    </div>
  );
};
