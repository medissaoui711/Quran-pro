import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Bookmark, Copy, Check, Share2, BookOpen, Volume2 } from 'lucide-react';
import { Ayah } from '../types/quran';
import { toArabicNumerals, fetchAyahTafsir } from '../services/quranApi';
import { fixArabicText } from '../services/arabicSanitizer';

interface AyahDetailModalProps {
  ayah: Ayah | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayAyahAudio: (ayah: Ayah) => void;
  isPlaying: boolean;
  onAddBookmark: (ayah: Ayah, note?: string, color?: string) => void;
  isBookmarked: boolean;
}

export const AyahDetailModal: React.FC<AyahDetailModalProps> = ({
  ayah,
  isOpen,
  onClose,
  onPlayAyahAudio,
  isPlaying,
  onAddBookmark,
  isBookmarked,
}) => {
  const [tafsir, setTafsir] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  const [loadingTafsir, setLoadingTafsir] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [bookmarkNote, setBookmarkNote] = useState<string>('');
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);

  useEffect(() => {
    if (ayah) {
      setLoadingTafsir(true);
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

  const handleSaveBookmark = () => {
    onAddBookmark(ayah, bookmarkNote);
    setShowNoteInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-[#fdfaf2] dark:bg-[#151b23] border-4 border-[#c5a059] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#15341d] dark:bg-[#0e1410] text-[#fdfaf2] flex items-center justify-between border-b-2 border-[#c5a059]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#c5a059]" />
            <h2 className="text-base sm:text-lg font-bold font-reem">
              سورة {fixArabicText(ayah.surahName)} - الآية {toArabicNumerals(ayah.numberInSurah)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-[#0a2312] dark:bg-[#1a231d] hover:bg-[#c5a059] hover:text-[#1e4d2b] transition-colors border border-[#c5a059]/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main Ayah Typography Banner */}
          <div className="p-5 rounded-lg bg-white dark:bg-slate-800 border-2 border-[#e9d19a] text-center shadow-xs">
            <p className="font-quran text-xl sm:text-2xl md:text-3xl text-[#1a1a1a] dark:text-[#fdfaf2] leading-[2.8] select-text quran-text-container" dir="rtl">
              <span>{ayah.text}</span>
              <bdi className="inline-flex items-center justify-center w-8 h-8 border-2 border-[#c5a059] rounded-full text-xs sm:text-sm font-bold text-[#8b6e31] dark:text-[#e9d19a] mx-2 align-middle font-reem ayah-num-symbol">
                {toArabicNumerals(ayah.numberInSurah)}
              </bdi>
            </p>

            <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-[#e9d19a]/50 text-xs font-reem text-[#8b6e31] dark:text-stone-300">
              <span>الجزء: {toArabicNumerals(ayah.juz)}</span>
              <span>•</span>
              <span>الصفحة: {toArabicNumerals(ayah.page)}</span>
              {ayah.sajda && (
                <>
                  <span>•</span>
                  <span className="text-[#1e4d2b] dark:text-emerald-400 font-bold">۩ موضع سجدة</span>
                </>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={() => onPlayAyahAudio(ayah)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e4d2b] text-[#fdfaf2] border border-[#c5a059] rounded-lg hover:bg-[#15341d] transition-all text-xs sm:text-sm font-reem shadow-xs"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'إيقاف التلاوة' : 'استمع للآية'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 text-[#1e4d2b] dark:text-amber-300 border border-[#c5a059] rounded-lg hover:bg-[#f4ede1] transition-all text-xs sm:text-sm font-reem"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الآية'}</span>
            </button>

            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border transition-all text-xs sm:text-sm font-reem ${
                isBookmarked
                  ? 'bg-[#c5a059] text-[#1e4d2b] border-[#8b6e31]'
                  : 'bg-white dark:bg-slate-800 text-[#8b6e31] dark:text-stone-300 border-[#c5a059] hover:bg-[#f4ede1]'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
              <span>{isBookmarked ? 'محفوظة بالعلامات' : 'حفظ في الإشارات'}</span>
            </button>
          </div>

          {/* Bookmark Note Input Field if opened */}
          {showNoteInput && (
            <div className="p-3 bg-[#f8f3e6] dark:bg-slate-900 rounded-lg border border-[#c5a059] space-y-2">
              <label className="text-xs font-bold text-[#1e4d2b] dark:text-amber-300 font-reem block">
                إضافة ملاحظة أو تدبّر حول هذه الآية (اختياري):
              </label>
              <input
                type="text"
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                placeholder="مثال: آية الصبر واليقين، مراجعة تفسيرها..."
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-[#c5a059] rounded focus:outline-none focus:border-[#1e4d2b] font-reem"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSaveBookmark}
                  className="px-3 py-1 bg-[#1e4d2b] text-white text-xs rounded hover:bg-[#15341d] font-reem"
                >
                  حفظ الإشارة
                </button>
              </div>
            </div>
          )}

          {/* Tafsir Al-Muyassar */}
          <div className="p-4 rounded-lg bg-[#f8f3e6] dark:bg-slate-900 border border-[#e9d19a] space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-[#1e4d2b] dark:text-[#c5a059] font-reem flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1e4d2b]"></span>
              التفسير الميسر:
            </h3>
            {loadingTafsir ? (
              <div className="text-xs text-[#8b6e31] font-reem animate-pulse py-2">
                جاري تحميل التفسير الميسر المعتمد...
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-[#1a1a1a] dark:text-stone-200 leading-relaxed font-reem select-text">
                {tafsir}
              </p>
            )}
          </div>

          {/* English Sahih Translation */}
          {translation && (
            <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-[#e9d19a] space-y-1.5" dir="ltr">
              <h3 className="text-xs font-bold text-[#8b6e31] dark:text-amber-400 font-sans">
                English Translation (Sahih International):
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-sans select-text">
                {translation}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#f4ede1] dark:bg-slate-900 border-t border-[#e9d19a] flex justify-between items-center text-xs font-reem text-[#8b6e31]">
          <span>المصحف الشريف - رواية حفص عن عاصم بالرسم العثماني</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1e4d2b] text-[#fdfaf2] rounded-lg hover:bg-[#15341d] font-reem"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
