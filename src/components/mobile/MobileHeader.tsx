import React, { useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Volume2,
  Search,
  Sliders,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { MobileTab } from './MobileBottomNavigation';
import { PaperTheme } from '../../types/quran';
import { toArabicNumerals } from '../../services/quranApi';
import { fixArabicText } from '../../services/arabicSanitizer';

interface MobileHeaderProps {
  activeTab: MobileTab;
  onNavigateTab: (tab: MobileTab) => void;
  currentPage: number;
  currentSurahName: string;
  currentJuzNumber: number;
  theme: PaperTheme;
  onToggleTheme: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onToggleAudio: () => void;
  isPlayingAudio: boolean;
  isImmersiveReading: boolean;
  onToggleImmersiveReading: () => void;
  onOpenQuickJump: () => void;
  isVisible: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  activeTab,
  onNavigateTab,
  currentPage,
  currentSurahName,
  currentJuzNumber,
  theme,
  onToggleTheme,
  isBookmarked,
  onToggleBookmark,
  onToggleAudio,
  isPlayingAudio,
  isImmersiveReading,
  onToggleImmersiveReading,
  onOpenQuickJump,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <header
      className="sticky top-0 z-40 bg-[#15341d] dark:bg-[#0e1410] text-[#fdfaf2] border-b-2 border-[#c5a059] shadow-md select-none pt-[env(safe-area-inset-top)] transition-all duration-300"
      dir="rtl"
    >
      <div className="max-w-md mx-auto px-3 h-14 flex items-center justify-between gap-2">
        {/* Right Section: Title & Context */}
        <div className="flex items-center gap-2 overflow-hidden">
          {activeTab !== 'reader' && activeTab !== 'home' && (
            <button
              onClick={() => onNavigateTab('reader')}
              className="p-1 rounded-lg bg-[#15341d] text-[#e9d19a] hover:bg-[#c5a059] hover:text-[#1e4d2b] transition-colors border border-[#c5a059]/30"
              title="العودة للمصحف"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {activeTab === 'reader' ? (
            <div
              onClick={onOpenQuickJump}
              className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg bg-[#15341d]/80 border border-[#c5a059]/40 active:scale-95 transition-all"
            >
              <span className="text-base">📖</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-bold font-reem text-xs sm:text-sm text-[#fdfaf2] leading-tight">
                  <span className="truncate max-w-[130px]">سورة {fixArabicText(currentSurahName)}</span>
                  <span className="text-[#c5a059]">•</span>
                  <span className="text-[#e9d19a] text-[11px] whitespace-nowrap">
                    ص {toArabicNumerals(currentPage)}
                  </span>
                </div>
                <span className="text-[10px] text-[#e9d19a]/80 font-reem">
                  الجزء {toArabicNumerals(currentJuzNumber)} (اضغط للانتقال)
                </span>
              </div>
            </div>
          ) : activeTab === 'home' ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#15341d] border border-[#c5a059] flex items-center justify-center text-sm shadow-xs">
                📖
              </div>
              <div>
                <h1 className="text-xs sm:text-sm font-bold font-quran text-[#fdfaf2] leading-tight">
                  المُصْحَفُ الشَّرِيف
                </h1>
                <p className="text-[10px] text-[#e9d19a] font-reem leading-tight">
                  رواية حفص عن عاصم
                </p>
              </div>
            </div>
          ) : activeTab === 'index' ? (
            <h2 className="text-sm font-bold font-reem text-[#fdfaf2] flex items-center gap-1.5">
              <Search className="w-4 h-4 text-[#c5a059]" />
              <span>فهرس السور والبحث القرآني</span>
            </h2>
          ) : activeTab === 'bookmarks' ? (
            <h2 className="text-sm font-bold font-reem text-[#fdfaf2] flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-[#c5a059]" />
              <span>الإشارات والعلامات المحفوظة</span>
            </h2>
          ) : (
            <h2 className="text-sm font-bold font-reem text-[#fdfaf2] flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#c5a059]" />
              <span>الختمة والإعدادات والمزيد</span>
            </h2>
          )}
        </div>

        {/* Left Section: Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {activeTab === 'reader' && (
            <>
              {/* Quick Bookmark Toggle */}
              <button
                onClick={onToggleBookmark}
                className={`p-2 rounded-lg border transition-all active:scale-90 ${
                  isBookmarked
                    ? 'bg-[#c5a059] text-[#1e4d2b] border-[#8b6e31] shadow-xs'
                    : 'bg-[#15341d] text-[#e9d19a] border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-[#1e4d2b]'
                }`}
                title={isBookmarked ? 'إزالة العلامة' : 'حفظ صفحة القراءة'}
              >
                <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>

              {/* Quick Audio Toggle */}
              <button
                onClick={onToggleAudio}
                className={`p-2 rounded-lg border transition-all active:scale-90 ${
                  isPlayingAudio
                    ? 'bg-[#c5a059] text-[#1e4d2b] border-[#8b6e31] shadow-xs animate-pulse'
                    : 'bg-[#15341d] text-[#e9d19a] border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-[#1e4d2b]'
                }`}
                title="الاستماع للتلاوة"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {/* Toggle Immersive Fullscreen Reading Mode */}
              <button
                onClick={onToggleImmersiveReading}
                className="p-2 rounded-lg bg-[#15341d] text-[#e9d19a] border border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-[#1e4d2b] transition-all active:scale-90"
                title="وضع القراءة الهادئ (ملء الشاشة)"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Theme Quick Toggle (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-[#15341d] text-[#e9d19a] border border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-[#1e4d2b] transition-all active:scale-90"
            title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
