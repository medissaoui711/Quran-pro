import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Bookmark,
  Copy,
  Check,
  Share2,
  BookOpen,
  Volume2,
  Globe,
  Sparkles,
} from 'lucide-react';
import { Ayah } from '../../types/quran';
import { toArabicNumerals, fetchAyahTafsir } from '../../services/quranApi';
import { fixArabicText } from '../../services/arabicSanitizer';

interface MobileAyahBottomSheetProps {
  ayah: Ayah | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayAyahAudio: (ayah: Ayah) => void;
  isPlaying: boolean;
  onAddBookmark: (ayah: Ayah, note?: string, color?: string) => void;
  isBookmarked: boolean;
}

export const MobileAyahBottomSheet: React.FC<MobileAyahBottomSheetProps> = ({
  ayah,
  isOpen,
  onClose,
  onPlayAyahAudio,
  isPlaying,
  onAddBookmark,
  isBookmarked,
}) => {
  const [activeTab, setActiveTab] = useState<'actions' | 'tafsir' | 'translation'>('actions');
  const [tafsir, setTafsir] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [loadingTafsir, setLoadingTafsir] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);
  const [bookmarkNote, setBookmarkNote] = useState<string>('');

  useEffect(() => {
    if (ayah) {
      setLoadingTafsir(true);
      setActiveTab('actions');
      fetchAyahTafsir(ayah.surahNumber, ayah.numberInSurah)
        .then((res) => {
          setTafsir(res.tafsir);
          setTranslation(res.translation);
        })
        .catch(() => {
          setTafsir('لم يتوفر الاتصال بجلب التفسير.');
          setTranslation('Translation unavailable.');
        })
        .finally(() => setLoadingTafsir(false));
    }
  }, [ayah]);

  if (!isOpen || !ayah) return null;

  const handleCopy = () => {
    const textToCopy = `﴿${ayah.text}﴾ [سورة ${ayah.surahName}: ${ayah.numberInSurah}]`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareText = `﴿${ayah.text}﴾ [سورة ${ayah.surahName}: ${ayah.numberInSurah}]`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `سورة ${ayah.surahName} - آية ${ayah.numberInSurah}`,
          text: shareText,
          url: window.location.href,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        // User dismissed or share failed, fallback to copy
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleSaveBookmark = () => {
    onAddBookmark(ayah, bookmarkNote);
    setShowNoteInput(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs select-none"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="w-full max-w-lg mx-auto bg-[#fdfaf2] dark:bg-[#151b23] border-t-4 border-[#c5a059] rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slide-up pb-[env(safe-area-inset-bottom)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sheet Top Grabber Handle */}
        <div className="w-full flex flex-col items-center pt-2.5 pb-1">
          <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-600 rounded-full" />
        </div>

        {/* Sheet Header */}
        <div className="px-4 py-2 flex items-center justify-between border-b border-[#e9d19a]/50">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#1e4d2b] text-[#c5a059] flex items-center justify-center text-xs font-bold font-reem">
              {toArabicNumerals(ayah.numberInSurah)}
            </span>
            <h3 className="font-bold text-sm font-reem text-[#1e4d2b] dark:text-[#c5a059]">
              سورة {fixArabicText(ayah.surahName)} - الآية {toArabicNumerals(ayah.numberInSurah)}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-stone-200 dark:bg-slate-700 text-stone-600 dark:text-stone-300 hover:bg-stone-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ayah Text Display Canvas */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-[#e9d19a]/50 text-center max-h-40 overflow-y-auto">
          <p className="font-quran text-lg sm:text-xl text-[#1a1a1a] dark:text-[#fdfaf2] leading-[2.5] select-text">
            {ayah.text}
            <span className="inline-flex items-center justify-center w-7 h-7 border-2 border-[#c5a059] rounded-full text-xs font-bold text-[#8b6e31] dark:text-[#e9d19a] mx-1.5 align-middle font-reem">
              {toArabicNumerals(ayah.numberInSurah)}
            </span>
          </p>
        </div>

        {/* Tab Segment Controls */}
        <div className="flex items-center justify-around border-b border-[#e9d19a]/50 bg-[#f8f3e6] dark:bg-slate-800 text-xs font-reem">
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'actions'
                ? 'border-[#1e4d2b] text-[#1e4d2b] dark:text-[#c5a059] font-bold bg-white/60 dark:bg-slate-700/60'
                : 'border-transparent text-stone-500 dark:text-stone-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>الخيارات</span>
          </button>

          <button
            onClick={() => setActiveTab('tafsir')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'tafsir'
                ? 'border-[#1e4d2b] text-[#1e4d2b] dark:text-[#c5a059] font-bold bg-white/60 dark:bg-slate-700/60'
                : 'border-transparent text-stone-500 dark:text-stone-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>التفسير الميسر</span>
          </button>

          <button
            onClick={() => setActiveTab('translation')}
            className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'translation'
                ? 'border-[#1e4d2b] text-[#1e4d2b] dark:text-[#c5a059] font-bold bg-white/60 dark:bg-slate-700/60'
                : 'border-transparent text-stone-500 dark:text-stone-400'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>الترجمة</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'actions' && (
            <div className="space-y-3">
              {/* Quick Action Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Audio Play Button */}
                <button
                  onClick={() => onPlayAyahAudio(ayah)}
                  className="p-3 rounded-xl bg-[#1e4d2b] text-[#fdfaf2] border border-[#c5a059] flex items-center justify-center gap-2 font-reem font-bold text-xs shadow-xs active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'إيقاف التلاوة' : 'استمع للآية'}</span>
                </button>

                {/* Bookmark Toggle */}
                <button
                  onClick={() => setShowNoteInput(!showNoteInput)}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-reem font-bold text-xs shadow-xs active:scale-95 transition-all ${
                    isBookmarked
                      ? 'bg-[#c5a059] text-[#1e4d2b] border-[#8b6e31]'
                      : 'bg-white dark:bg-slate-800 text-[#1e4d2b] dark:text-[#e9d19a] border-[#e9d19a]'
                  }`}
                >
                  <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                  <span>{isBookmarked ? 'محفوظة بالإشارات' : 'حفظ بالإشارات'}</span>
                </button>

                {/* Copy Verse */}
                <button
                  onClick={handleCopy}
                  className="p-3 rounded-xl bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-200 border border-[#e9d19a] flex items-center justify-center gap-2 font-reem text-xs active:scale-95 transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
                </button>

                {/* Share Verse */}
                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl bg-white dark:bg-slate-800 text-stone-700 dark:text-stone-200 border border-[#e9d19a] flex items-center justify-center gap-2 font-reem text-xs active:scale-95 transition-all"
                >
                  {shared ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  <span>{shared ? 'تمت المشاركة' : 'مشاركة الآية'}</span>
                </button>
              </div>

              {/* Bookmark Note Input Field */}
              {showNoteInput && (
                <div className="p-3 bg-[#f8f3e6] dark:bg-slate-900 rounded-xl border border-[#c5a059] space-y-2 animate-fade-in">
                  <label className="text-xs font-bold text-[#1e4d2b] dark:text-[#c5a059] font-reem block">
                    تدوين ملاحظة أو تدبر خاص بالآية:
                  </label>
                  <input
                    type="text"
                    value={bookmarkNote}
                    onChange={(e) => setBookmarkNote(e.target.value)}
                    placeholder="مثال: آية الصبر، مراجعة تفسيرها..."
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-[#c5a059] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1e4d2b]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={handleSaveBookmark}
                      className="px-4 py-1.5 bg-[#1e4d2b] text-[#fdfaf2] rounded-lg text-xs font-bold font-reem hover:bg-[#15341d]"
                    >
                      تأكيد الحفظ
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Tafsir Snippet Preview */}
              <div
                onClick={() => setActiveTab('tafsir')}
                className="p-3 rounded-xl bg-[#f8f3e6] dark:bg-slate-900 border border-[#e9d19a] cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#1e4d2b] dark:text-[#c5a059] font-reem">
                  <span>التفسير الميسر</span>
                  <span className="text-[10px] text-[#8b6e31]">عرض كامل ←</span>
                </div>
                {loadingTafsir ? (
                  <div className="text-xs text-[#8b6e31] font-reem animate-pulse">
                    جاري تحميل التفسير الميسر...
                  </div>
                ) : (
                  <p className="text-xs text-stone-700 dark:text-stone-300 line-clamp-2 leading-relaxed font-reem">
                    {tafsir}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tafsir' && (
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-[#e9d19a] space-y-2">
              <h4 className="text-xs font-bold text-[#1e4d2b] dark:text-[#c5a059] font-reem">
                التفسير الميسر المعتمد:
              </h4>
              {loadingTafsir ? (
                <div className="text-xs text-[#8b6e31] font-reem animate-pulse py-4">
                  جاري تحميل التفسير الميسر...
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-reem select-text">
                  {tafsir}
                </p>
              )}
            </div>
          )}

          {activeTab === 'translation' && (
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-[#e9d19a] space-y-2" dir="ltr">
              <h4 className="text-xs font-bold text-[#8b6e31] dark:text-amber-400 font-sans">
                Sahih International English Translation:
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans select-text">
                {translation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
