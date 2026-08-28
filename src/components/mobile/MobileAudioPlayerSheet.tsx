import React from 'react';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { RECITERS } from '../../data/quranMetadata';
import { toArabicNumerals } from '../../services/quranApi';
import { fixArabicText } from '../../services/arabicSanitizer';
import { useQuranAudio } from '../../context/AudioContext';

export const MobileAudioPlayerSheet: React.FC = () => {
  const {
    currentAyah,
    isPlaying,
    isAudioSheetOpen,
    selectedReciter,
    playbackSpeed,
    isRepeat,
    isMuted,
    currentTime,
    duration,
    progress,
    togglePlay,
    nextAyah,
    prevAyah,
    closeAudioSheet,
    setReciter,
    setSpeed,
    toggleRepeat,
    toggleMute,
    seek,
  } = useQuranAudio();

  if (!isAudioSheetOpen || !currentAyah) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/65 backdrop-blur-xs select-none"
      onClick={closeAudioSheet}
      dir="rtl"
    >
      <div
        className="w-full max-w-lg mx-auto bg-[#15341d] dark:bg-[#0e1410] text-[#fdfaf2] border-t-4 border-[#c5a059] rounded-t-3xl shadow-2xl p-5 space-y-4 animate-slide-up pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grabber Handle */}
        <div className="w-full flex flex-col items-center pt-1 pb-1">
          <div className="w-12 h-1.5 bg-[#c5a059]/40 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#c5a059]" />
            <h3 className="font-bold text-sm font-reem text-[#fdfaf2]">
              مشغل التلاوات القرآنية المباركة
            </h3>
          </div>
          <button
            onClick={closeAudioSheet}
            className="p-1 rounded-full bg-[#15341d] text-[#e9d19a] hover:bg-[#c5a059] hover:text-[#1e4d2b]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Central Quran & Reciter Medallion Artwork */}
        <div className="py-4 px-3 bg-[#15341d] border-2 border-[#c5a059]/60 rounded-2xl flex flex-col items-center text-center space-y-2 relative overflow-hidden shadow-inner">
          {/* Pulsing Ripple Graphic */}
          <div
            className={`w-16 h-16 rounded-full border-2 border-[#c5a059] flex items-center justify-center text-2xl transition-all ${
              isPlaying ? 'animate-pulse scale-105 shadow-[0_0_20px_rgba(197,160,89,0.5)]' : ''
            }`}
          >
            🕌
          </div>

          <div>
            <h4 className="font-bold text-base font-reem text-[#e9d19a]">
              سورة {fixArabicText(currentAyah.surahName)} - الآية {toArabicNumerals(currentAyah.numberInSurah)}
            </h4>
            <span className="text-xs text-[#fdfaf2]/80 font-reem">
              صفحة {toArabicNumerals(currentAyah.page)} • الجزء {toArabicNumerals(currentAyah.juz)}
            </span>
          </div>

          <p className="font-quran text-sm text-[#fdfaf2] max-h-20 overflow-y-auto px-2 line-clamp-3 leading-relaxed">
            {currentAyah.text}
          </p>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="w-full accent-[#c5a059] h-2 bg-[#15341d] rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-[#e9d19a]">
            <span>{Math.floor(currentTime)}ث</span>
            <span>{Math.floor(duration)}ث</span>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center justify-center gap-5 pt-1">
          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className={`p-2.5 rounded-full border transition-all ${
              isRepeat
                ? 'bg-[#c5a059] text-[#1e4d2b] border-[#8b6e31]'
                : 'bg-[#15341d] text-[#e9d19a] border-[#c5a059]/40'
            }`}
            title="تكرار الآية"
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* Previous Ayah */}
          <button
            onClick={prevAyah}
            className="p-3 rounded-full bg-[#15341d] text-[#e9d19a] hover:text-[#fdfaf2] border border-[#c5a059]/40 active:scale-90 transition-transform"
            title="الآية السابقة"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Play/Pause Main Button */}
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-[#c5a059] text-[#1e4d2b] flex items-center justify-center shadow-lg active:scale-90 hover:scale-105 transition-transform"
            title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
          </button>

          {/* Next Ayah */}
          <button
            onClick={nextAyah}
            className="p-3 rounded-full bg-[#15341d] text-[#e9d19a] hover:text-[#fdfaf2] border border-[#c5a059]/40 active:scale-90 transition-transform"
            title="الآية التالية"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Mute */}
          <button
            onClick={toggleMute}
            className={`p-2.5 rounded-full border transition-all ${
              isMuted
                ? 'bg-red-900/60 text-red-200 border-red-500'
                : 'bg-[#15341d] text-[#e9d19a] border-[#c5a059]/40'
            }`}
            title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Reciter Selector & Playback Speed Bar */}
        <div className="pt-2 border-t border-[#c5a059]/30 flex items-center justify-between gap-2 text-xs font-reem">
          <div className="flex-1">
            <select
              value={selectedReciter.id}
              onChange={(e) => {
                const found = RECITERS.find((r) => r.id === e.target.value);
                if (found) setReciter(found);
              }}
              className="w-full px-3 py-2 rounded-xl bg-[#15341d] border border-[#c5a059] text-[#fdfaf2] text-xs font-reem focus:outline-none focus:border-[#e9d19a] cursor-pointer"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#15341d] text-white">
                  {r.name} ({r.style})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => setSpeed(speed)}
                className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                  playbackSpeed === speed
                    ? 'bg-[#c5a059] text-[#1e4d2b] border-[#8b6e31]'
                    : 'bg-[#15341d] text-[#e9d19a] border-[#c5a059]/40'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
