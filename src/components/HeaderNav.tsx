import React, { useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Trophy,
  Volume2,
  Moon,
  Sun,
  Columns,
  Square,
  Type,
  Image as ImageIcon,
  Search,
  Sparkles,
} from 'lucide-react';
import { ViewMode, PaperTheme } from '../types/quran';
import { toArabicNumerals } from '../services/quranApi';
import { PWAInstallButton } from './pwa/PWAInstallButton';

interface HeaderNavProps {
  onOpenIndex: () => void;
  onOpenBookmarks: () => void;
  onOpenKhatma: () => void;
  onOpenAudio: () => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  renderMode: 'image' | 'text';
  onToggleRenderMode: () => void;
  theme: PaperTheme;
  onToggleTheme: () => void;
  fontSize: number;
  onChangeFontSize: (delta: number) => void;
  currentPage: number;
  onJumpToPage: (page: number) => void;
  totalPages: number;
  bookmarksCount: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onOpenIndex,
  onOpenBookmarks,
  onOpenKhatma,
  onOpenAudio,
  viewMode,
  onToggleViewMode,
  renderMode,
  onToggleRenderMode,
  theme,
  onToggleTheme,
  fontSize,
  onChangeFontSize,
  currentPage,
  onJumpToPage,
  totalPages = 604,
  bookmarksCount,
}) => {
  const [jumpInput, setJumpInput] = useState<string>('');
  const [showJumpForm, setShowJumpForm] = useState<boolean>(false);

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpInput, 10);
    if (p >= 1 && p <= totalPages) {
      onJumpToPage(p);
      setShowJumpForm(false);
      setJumpInput('');
    }
  };

  return (
    <header
      className="w-full bg-[#1e4d2b] text-[#fdfaf2] border-b-4 border-[#c5a059] shadow-lg px-2 sm:px-4 py-2 select-none sticky top-0 z-40 transition-all duration-300"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Right Section: Logo and Islamic Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-[#15341d] rounded-lg border border-[#c5a059] shadow-xs">
            <span className="text-base sm:text-xl">📖</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-lg md:text-xl font-bold font-quran text-[#fdfaf2] flex items-center gap-1.5 tracking-wide">
              المُصْحَفُ الإِلِكْتُرُونِيُّ الشَّرِيف
            </h1>
            <p className="text-[10px] sm:text-xs text-[#e9d19a] font-reem hidden sm:block">
              رواية حفص عن عاصم بالرسم العثماني
            </p>
          </div>
        </div>

        {/* Center Section: Primary Navigation Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Surah Index Trigger */}
          <button
            onClick={onOpenIndex}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-[#15341d] hover:bg-[#c5a059] hover:text-[#1e4d2b] text-[#fdfaf2] border border-[#c5a059]/50 text-xs sm:text-sm font-reem font-bold transition-all shadow-xs"
            title="فهرس السور والأجزاء والبحث"
          >
            <BookOpen className="w-4 h-4 text-[#c5a059] group-hover:text-inherit" />
            <span>الفهرس</span>
          </button>

          {/* Khatma Planner Trigger */}
          <button
            onClick={onOpenKhatma}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#15341d] hover:bg-[#c5a059] hover:text-[#1e4d2b] text-[#fdfaf2] border border-[#c5a059]/50 text-xs sm:text-sm font-reem transition-all"
            title="متابعة ختمة القرآن ودعاء الختم"
          >
            <Trophy className="w-4 h-4 text-[#c5a059]" />
            <span className="hidden md:inline">الختمة والدعاء</span>
          </button>

          {/* Bookmarks Trigger */}
          <button
            onClick={onOpenBookmarks}
            className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#15341d] hover:bg-[#c5a059] hover:text-[#1e4d2b] text-[#fdfaf2] border border-[#c5a059]/50 text-xs sm:text-sm font-reem transition-all"
            title="الإشارات والعلامات المحفوظة"
          >
            <Bookmark className="w-4 h-4 text-[#c5a059]" />
            <span className="hidden md:inline">الإشارات</span>
            {bookmarksCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#c5a059] text-[#1e4d2b] text-[10px] font-bold flex items-center justify-center font-reem">
                {toArabicNumerals(bookmarksCount)}
              </span>
            )}
          </button>

          {/* Audio Recitation Trigger */}
          <button
            onClick={onOpenAudio}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#15341d] hover:bg-[#c5a059] hover:text-[#1e4d2b] text-[#fdfaf2] border border-[#c5a059]/50 text-xs sm:text-sm font-reem transition-all"
            title="الاستماع للتلاوة الصوتية"
          >
            <Volume2 className="w-4 h-4 text-[#c5a059]" />
            <span className="hidden lg:inline">التلاوة</span>
          </button>
        </div>

        {/* Left Section: Display & Mode Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Quick Page Jump Button & Popover */}
          <div className="relative">
            <button
              onClick={() => setShowJumpForm(!showJumpForm)}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#15341d] hover:bg-[#c5a059] hover:text-[#1e4d2b] text-[#e9d19a] border border-[#c5a059]/40 text-xs font-reem font-bold"
              title="الانتقال لصفحة محددة"
            >
              ص {toArabicNumerals(currentPage)}
            </button>

            {showJumpForm && (
              <div className="absolute left-0 top-full mt-2 w-48 p-2.5 bg-[#fdfaf2] dark:bg-[#151b23] text-[#1a1a1a] dark:text-white border-2 border-[#c5a059] rounded-xl shadow-2xl z-50">
                <form onSubmit={handleJumpSubmit} className="space-y-2">
                  <label className="text-xs font-reem text-[#8b6e31] dark:text-[#e9d19a] font-bold block">
                    اكتب رقم الصفحة (١ - ٦٠٤):
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min="1"
                      max="604"
                      autoFocus
                      value={jumpInput}
                      onChange={(e) => setJumpInput(e.target.value)}
                      placeholder="رقم الصفحة..."
                      className="w-full px-2 py-1 text-xs border border-[#c5a059] rounded bg-white dark:bg-slate-800 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-[#1e4d2b] text-white text-xs rounded hover:bg-[#15341d] font-reem"
                    >
                      ذهاب
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Render Mode Toggle: Image scan vs Uthmani Font */}
          <button
            onClick={onToggleRenderMode}
            className={`p-1.5 sm:p-2 rounded-lg border transition-all ${
              renderMode === 'image'
                ? 'bg-[#c5a059] text-[#1e4d2b] border-[#8b6e31]'
                : 'bg-[#15341d] text-[#e9d19a] border-[#c5a059]/40 hover:text-white'
            }`}
            title={renderMode === 'image' ? 'التحويل للرسم العثماني النصي' : 'التحويل لصورة المصحف الشريف'}
          >
            {renderMode === 'image' ? (
              <ImageIcon className="w-4 h-4" />
            ) : (
              <Type className="w-4 h-4" />
            )}
          </button>

          {/* Spread View vs Single Page Toggle (Desktop Only) */}
          <button
            onClick={onToggleViewMode}
            className={`p-1.5 sm:p-2 rounded-lg border transition-all hidden md:flex ${
              viewMode === 'spread'
                ? 'bg-[#c5a059] text-[#1e4d2b] border-[#8b6e31]'
                : 'bg-[#15341d] text-[#e9d19a] border-[#c5a059]/40 hover:text-white'
            }`}
            title={viewMode === 'spread' ? 'عرض صفحة واحدة' : 'عرض صفحتين كالمصحف المفتوح'}
          >
            {viewMode === 'spread' ? <Columns className="w-4 h-4" /> : <Square className="w-4 h-4" />}
          </button>

          {/* Font Size Adjusters (if text mode) */}
          {renderMode === 'text' && (
            <div className="hidden sm:flex items-center border border-[#c5a059]/40 rounded-lg overflow-hidden bg-[#15341d]">
              <button
                onClick={() => onChangeFontSize(2)}
                className="px-2 py-1 text-xs text-[#e9d19a] hover:bg-[#c5a059] hover:text-[#1e4d2b]"
                title="تكبير الخط"
              >
                +A
              </button>
              <button
                onClick={() => onChangeFontSize(-2)}
                className="px-2 py-1 text-xs text-[#e9d19a] hover:bg-[#c5a059] hover:text-[#1e4d2b]"
                title="تصغير الخط"
              >
                -A
              </button>
            </div>
          )}

          {/* Theme Toggle (Natural Tones vs Dark Theme) */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-lg bg-[#15341d] text-[#e9d19a] border border-[#c5a059]/40 hover:bg-[#c5a059] hover:text-[#1e4d2b] transition-colors"
            title={theme === 'dark' ? 'الوضع النهاري (الطبيعي)' : 'الوضع الليلي (الداكن)'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Desktop / Responsive PWA Install Button */}
          <PWAInstallButton variant="header" />
        </div>
      </div>
    </header>
  );
};
