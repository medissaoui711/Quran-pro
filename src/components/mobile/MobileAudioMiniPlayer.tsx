import React from 'react';
import { Play, Pause, ChevronUp, X } from 'lucide-react';
import { toArabicNumerals } from '../../services/quranApi';
import { fixArabicText } from '../../services/arabicSanitizer';
import { useQuranAudio } from '../../context/AudioContext';

export const MobileAudioMiniPlayer: React.FC = () => {
  const {
    currentAyah,
    isPlaying,
    isAudioOpen,
    isAudioSheetOpen,
    selectedReciter,
    togglePlay,
    openAudioSheet,
    closeAudio,
  } = useQuranAudio();

  if (!isAudioOpen || !currentAyah || isAudioSheetOpen) return null;

  return (
    <div
      className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] inset-x-2 z-40 max-w-md mx-auto bg-[#1e4d2b] text-[#fdfaf2] border-2 border-[#c5a059] rounded-2xl shadow-2xl p-2 select-none animate-slide-up"
      dir="rtl"
      style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.35)' }}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Play/Pause Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="w-10 h-10 rounded-full bg-[#c5a059] text-[#1e4d2b] flex items-center justify-center shadow-md active:scale-90 transition-transform shrink-0"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        {/* Center Info - Click to expand */}
        <div
          onClick={openAudioSheet}
          className="flex-1 min-w-0 cursor-pointer py-1 px-1 flex flex-col justify-center"
        >
          <div className="flex items-center gap-1.5 font-bold font-reem text-xs text-[#fdfaf2] truncate">
            <span>سورة {fixArabicText(currentAyah.surahName)}</span>
            <span className="text-[#c5a059]">•</span>
            <span className="text-[#e9d19a]">آية {toArabicNumerals(currentAyah.numberInSurah)}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#e9d19a]/80 font-reem truncate">
            <span>{selectedReciter.name}</span>
            <span>(انقر لفتح المشغل)</span>
          </div>
        </div>

        {/* Action Buttons: Expand & Close */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={openAudioSheet}
            className="p-2 text-[#e9d19a] hover:text-[#fdfaf2] active:scale-90 transition-transform"
            title="توسيع المشغل"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeAudio();
            }}
            className="p-2 text-[#e9d19a] hover:text-red-400 active:scale-90 transition-transform"
            title="إغلاق المشغل"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
