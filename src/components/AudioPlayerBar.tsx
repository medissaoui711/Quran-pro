import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  X,
} from 'lucide-react';
import { RECITERS } from '../data/quranMetadata';
import { toArabicNumerals } from '../services/quranApi';
import { fixArabicText } from '../services/arabicSanitizer';
import { useQuranAudio } from '../context/AudioContext';

export const AudioPlayerBar: React.FC = () => {
  const {
    currentAyah,
    isPlaying,
    isAudioOpen,
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
    closeAudio,
    setReciter,
    setSpeed,
    toggleRepeat,
    toggleMute,
    seek,
  } = useQuranAudio();

  const toggleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  if (!isAudioOpen || !currentAyah) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 bg-[#15341d] dark:bg-[#0e1410] text-[#fdfaf2] border-t-4 border-[#c5a059] shadow-2xl p-2 sm:p-3 transition-transform duration-300 select-none"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Right Info: Current Ayah & Surah */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#0a2312] dark:bg-[#1a231d] border border-[#c5a059] flex items-center justify-center text-[#c5a059]">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold font-reem flex items-center gap-1.5 text-[#e9d19a]">
                <span>سورة {fixArabicText(currentAyah.surahName)}</span>
                <span>-</span>
                <span>الآية {toArabicNumerals(currentAyah.numberInSurah)}</span>
              </div>
              <div className="text-[11px] text-[#fdfaf2]/80 font-reem">
                صفحة {toArabicNumerals(currentAyah.page)} • الجزء {toArabicNumerals(currentAyah.juz)}
              </div>
            </div>
          </div>

          {/* Close audio player button */}
          <button
            onClick={closeAudio}
            className="p-1 rounded-md bg-[#15341d] text-[#e9d19a] hover:bg-[#c5a059] hover:text-[#1e4d2b] md:hidden"
            title="إغلاق المشغل"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Playback Controls & Progress Bar */}
        <div className="flex-1 max-w-xl w-full flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            {/* Prev Ayah */}
            <button
              onClick={prevAyah}
              className="p-1.5 rounded-full hover:bg-[#15341d] text-[#e9d19a] hover:text-[#fdfaf2] transition-colors"
              title="الآية السابقة"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[#c5a059] hover:bg-[#e9d19a] text-[#1e4d2b] flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Next Ayah */}
            <button
              onClick={nextAyah}
              className="p-1.5 rounded-full hover:bg-[#15341d] text-[#e9d19a] hover:text-[#fdfaf2] transition-colors"
              title="الآية التالية"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Repeat verse toggle */}
            <button
              onClick={toggleRepeat}
              className={`p-1.5 rounded-full transition-colors ${
                isRepeat
                  ? 'bg-[#c5a059] text-[#1e4d2b]'
                  : 'hover:bg-[#15341d] text-[#e9d19a]'
              }`}
              title="تكرار الآية"
            >
              <Repeat className="w-4 h-4" />
            </button>

            {/* Speed Toggle */}
            <button
              onClick={toggleSpeed}
              className="px-2 py-0.5 rounded text-xs font-bold bg-[#15341d] border border-[#c5a059]/40 text-[#e9d19a] hover:bg-[#c5a059] hover:text-[#1e4d2b] transition-colors font-mono"
              title="سرعة التلاوة"
            >
              {playbackSpeed}x
            </button>
          </div>

          {/* Progress Bar & Time */}
          <div className="w-full flex items-center gap-2 text-[11px] font-mono text-[#e9d19a]">
            <span>{Math.floor(currentTime)}ث</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="flex-1 accent-[#c5a059] h-1.5 bg-[#15341d] rounded-lg cursor-pointer"
            />
            <span>{Math.floor(duration)}ث</span>
          </div>
        </div>

        {/* Left: Reciter Selector & Volume Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5">
            <select
              value={selectedReciter.id}
              onChange={(e) => {
                const found = RECITERS.find((r) => r.id === e.target.value);
                if (found) setReciter(found);
              }}
              className="px-2 py-1 rounded bg-[#15341d] border border-[#c5a059]/60 text-[#fdfaf2] text-xs font-reem focus:outline-none focus:border-[#c5a059] cursor-pointer max-w-[150px] sm:max-w-[190px]"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#15341d] text-white">
                  {r.name} ({r.style})
                </option>
              ))}
            </select>
          </div>

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded-full border transition-colors ${
              isMuted
                ? 'bg-red-900/60 text-red-200 border-red-500'
                : 'hover:bg-[#15341d] text-[#e9d19a] border-transparent'
            }`}
            title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Desktop Close button */}
          <button
            onClick={closeAudio}
            className="p-1.5 rounded-full hover:bg-[#15341d] text-[#e9d19a] hover:text-[#fdfaf2] hidden md:block"
            title="إغلاق المشغل"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
