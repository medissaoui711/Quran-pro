import React, { useState } from 'react';
import {
  Trophy,
  Sliders,
  Volume2,
  BookOpen,
  Sun,
  Moon,
  Sparkles,
  Check,
  RotateCcw,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { KhatmaTracker, PaperTheme, Reciter } from '../../types/quran';
import { RECITERS } from '../../data/quranMetadata';
import { toArabicNumerals } from '../../services/quranApi';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { OfflineManager } from '../pwa/OfflineManager';

interface MobileMoreSettingsViewProps {
  theme: PaperTheme;
  onChangeTheme: (theme: PaperTheme) => void;
  renderMode: 'image' | 'text';
  onChangeRenderMode: (mode: 'image' | 'text') => void;
  fontSize: number;
  onChangeFontSize: (size: number) => void;
  selectedReciter: Reciter;
  onChangeReciter: (reciter: Reciter) => void;
  playbackSpeed: number;
  onChangePlaybackSpeed: (speed: number) => void;
  khatma: KhatmaTracker;
  onUpdateKhatmaDays: (days: number) => void;
  onRecordDailyProgress: (page: number) => void;
  currentPage: number;
}

const THEME_OPTIONS: { id: PaperTheme; name: string; bg: string; text: string; border: string }[] = [
  { id: 'madinah', name: 'طبيعي المدينة', bg: '#fdfaf2', text: '#1a1a1a', border: '#c5a059' },
  { id: 'sepia', name: 'بيج دافئ', bg: '#f4ede1', text: '#2b2118', border: '#ba8d42' },
  { id: 'white', name: 'أبيض ناصع', bg: '#ffffff', text: '#0f172a', border: '#cca43b' },
  { id: 'dark', name: 'ليلي مريح', bg: '#151b23', text: '#f1f5f9', border: '#b89738' },
];

export const MobileMoreSettingsView: React.FC<MobileMoreSettingsViewProps> = ({
  theme,
  onChangeTheme,
  renderMode,
  onChangeRenderMode,
  fontSize,
  onChangeFontSize,
  selectedReciter,
  onChangeReciter,
  playbackSpeed,
  onChangePlaybackSpeed,
  khatma,
  onUpdateKhatmaDays,
  onRecordDailyProgress,
  currentPage,
}) => {
  const [showDoaa, setShowDoaa] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'khatma' | 'reading' | 'audio' | 'about'>('khatma');

  const totalPages = 604;
  const progressPercent = Math.min(100, Math.round((currentPage / totalPages) * 100));

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 pb-28 select-none" dir="rtl">
      {/* Category Segment Tabs */}
      <div className="grid grid-cols-4 p-1 bg-[#f4ede1] dark:bg-slate-800/80 rounded-xl border border-[#c5a059]/40 text-xs font-reem">
        <button
          onClick={() => setActiveTab('khatma')}
          className={`py-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeTab === 'khatma'
              ? 'bg-[#1e4d2b] text-[#fdfaf2] shadow-xs'
              : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>الختمة</span>
        </button>

        <button
          onClick={() => setActiveTab('reading')}
          className={`py-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeTab === 'reading'
              ? 'bg-[#1e4d2b] text-[#fdfaf2] shadow-xs'
              : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>القراءة</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`py-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeTab === 'audio'
              ? 'bg-[#1e4d2b] text-[#fdfaf2] shadow-xs'
              : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>الصوت</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`py-2 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 ${
            activeTab === 'about'
              ? 'bg-[#1e4d2b] text-[#fdfaf2] shadow-xs'
              : 'text-stone-600 dark:text-stone-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>عن التطبيق</span>
        </button>
      </div>

      {/* Tab 1: Khatma Tracker */}
      {activeTab === 'khatma' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#c5a059] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm font-reem text-[#1e4d2b] dark:text-[#c5a059] flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#c5a059]" />
                <span>متابعة خطة الختمة المباركة</span>
              </h3>
              <span className="text-xs font-bold font-reem px-2 py-0.5 rounded-full bg-[#1e4d2b] text-[#fdfaf2]">
                {toArabicNumerals(progressPercent)}% مُنجز
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-3 bg-[#f4ede1] dark:bg-slate-700 rounded-full overflow-hidden border border-[#c5a059]/40">
                <div
                  className="h-full bg-gradient-to-l from-[#1e4d2b] to-[#c5a059] transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-reem text-stone-500 dark:text-stone-400">
                <span>الموضع الحالي: ص {toArabicNumerals(currentPage)}</span>
                <span>المتبقي: {toArabicNumerals(Math.max(0, 604 - currentPage))} صفحة</span>
              </div>
            </div>

            {/* Target Duration Selector */}
            <div className="space-y-1.5 pt-2 border-t border-[#e9d19a]/40">
              <label className="text-xs font-bold font-reem text-stone-700 dark:text-stone-300 block">
                تحديد مدة الختمة المستهدفة:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[15, 30, 60, 90].map((days) => (
                  <button
                    key={days}
                    onClick={() => onUpdateKhatmaDays(days)}
                    className={`py-2 rounded-xl text-xs font-bold font-reem border transition-all ${
                      khatma.targetDays === days
                        ? 'bg-[#1e4d2b] text-[#fdfaf2] border-[#c5a059] shadow-xs'
                        : 'bg-[#f8f3e6] dark:bg-slate-700 text-stone-700 dark:text-stone-300 border-[#e9d19a]'
                    }`}
                  >
                    {toArabicNumerals(days)} يوماً
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 font-reem text-center mt-1">
                الورد اليومي المطلوب: {toArabicNumerals(Math.ceil(604 / (khatma.targetDays || 30)))} صفحة يومياً.
              </p>
            </div>

            {/* Record Progress Button */}
            <button
              onClick={() => onRecordDailyProgress(currentPage)}
              className="w-full py-2.5 bg-[#1e4d2b] hover:bg-[#15341d] active:scale-95 text-[#fdfaf2] rounded-xl font-bold font-reem text-xs border border-[#c5a059] flex items-center justify-center gap-1.5 shadow-xs transition-all"
            >
              <Check className="w-4 h-4 text-[#c5a059]" />
              <span>تثبيت صفحة {toArabicNumerals(currentPage)} كإنجاز اليوم</span>
            </button>
          </div>

          {/* Doaa Khatm Al-Quran Accordion */}
          <div className="rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#e9d19a] overflow-hidden shadow-2xs">
            <button
              onClick={() => setShowDoaa(!showDoaa)}
              className="w-full p-3.5 flex items-center justify-between font-bold font-reem text-xs text-[#1e4d2b] dark:text-[#c5a059] hover:bg-[#f8f3e6] dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>🤲</span>
                <span>دعاء ختم القرآن الكريم المأثور</span>
              </div>
              {showDoaa ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showDoaa && (
              <div className="p-4 bg-[#fdfaf2] dark:bg-slate-900 border-t border-[#e9d19a] space-y-3 font-reem text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-loose">
                <p>
                  اللَّهُمَّ ارْحَمْنِي بالقُرْآنِ وَاجْعَلهُ لِي إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً.
                </p>
                <p>
                  اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ وَارْزُقْنِي تِلاَوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ العَالَمِينَ.
                </p>
                <p>
                  اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Reading & Appearance Settings */}
      {activeTab === 'reading' && (
        <div className="space-y-3">
          {/* Theme Palette */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#e9d19a] shadow-xs space-y-3">
            <h3 className="font-bold text-xs font-reem text-[#1e4d2b] dark:text-[#c5a059] flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#c5a059]" />
              <span>مظهر ونمط ألوان ورق المصحف</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChangeTheme(opt.id)}
                  className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all active:scale-95 ${
                    theme === opt.id
                      ? 'border-[#1e4d2b] dark:border-[#c5a059] ring-2 ring-[#c5a059]/40 shadow-xs'
                      : 'border-stone-200 dark:border-stone-700'
                  }`}
                  style={{ backgroundColor: opt.bg, color: opt.text }}
                >
                  <span className="font-bold text-xs font-reem">{opt.name}</span>
                  {theme === opt.id && <Check className="w-4 h-4 text-[#c5a059]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Render Mode (HD Image vs Vector Text) */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#e9d19a] shadow-xs space-y-3">
            <h3 className="font-bold text-xs font-reem text-[#1e4d2b] dark:text-[#c5a059]">
              أسلوب عرض صفحات المصحف:
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeRenderMode('image')}
                className={`p-3 rounded-xl border-2 text-right transition-all ${
                  renderMode === 'image'
                    ? 'bg-[#1e4d2b] text-[#fdfaf2] border-[#c5a059] shadow-xs'
                    : 'bg-[#f8f3e6] dark:bg-slate-700 text-stone-700 dark:text-stone-300 border-[#e9d19a]'
                }`}
              >
                <span className="block font-bold text-xs font-reem">🖼️ مصحف المدينة المصور</span>
                <span className="text-[10px] opacity-80 font-reem">مطابق للمصحف المطبوع</span>
              </button>

              <button
                onClick={() => onChangeRenderMode('text')}
                className={`p-3 rounded-xl border-2 text-right transition-all ${
                  renderMode === 'text'
                    ? 'bg-[#1e4d2b] text-[#fdfaf2] border-[#c5a059] shadow-xs'
                    : 'bg-[#f8f3e6] dark:bg-slate-700 text-stone-700 dark:text-stone-300 border-[#e9d19a]'
                }`}
              >
                <span className="block font-bold text-xs font-reem">✍️ خط عثماني رقمي</span>
                <span className="text-[10px] opacity-80 font-reem">تكبير وتصغير تفاعلي</span>
              </button>
            </div>
          </div>

          {/* Offline Manager for Reading Tab */}
          <OfflineManager />

          {/* Font Size Slider (if text mode) */}
          {renderMode === 'text' && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#e9d19a] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold font-reem text-[#1e4d2b] dark:text-[#c5a059]">
                <span>حجم خط الآيات القرآنية:</span>
                <span>{toArabicNumerals(fontSize)} نقطة</span>
              </div>

              <input
                type="range"
                min="18"
                max="36"
                step="1"
                value={fontSize}
                onChange={(e) => onChangeFontSize(parseInt(e.target.value, 10))}
                className="w-full accent-[#1e4d2b]"
              />

              <div className="p-3 rounded-lg bg-[#fdfaf2] dark:bg-slate-900 border border-[#e9d19a] text-center">
                <p className="font-quran leading-loose text-[#1a1a1a] dark:text-[#fdfaf2]" style={{ fontSize: `${fontSize}px` }}>
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ﴿١﴾
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Audio Recitation Settings */}
      {activeTab === 'audio' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#e9d19a] shadow-xs space-y-3">
            <h3 className="font-bold text-xs font-reem text-[#1e4d2b] dark:text-[#c5a059] flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#c5a059]" />
              <span>اختيار القارئ الصوتي المعتمد</span>
            </h3>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {RECITERS.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => onChangeReciter(rec)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                    selectedReciter.id === rec.id
                      ? 'bg-[#1e4d2b] text-[#fdfaf2] border-[#c5a059] shadow-2xs'
                      : 'bg-[#f8f3e6] dark:bg-slate-700 text-stone-800 dark:text-stone-200 border-[#e9d19a]'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs font-reem leading-tight">{rec.name}</h4>
                    <span className="text-[10px] opacity-75 font-reem">{rec.style}</span>
                  </div>

                  {selectedReciter.id === rec.id && <Check className="w-4 h-4 text-[#c5a059]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Playback Speed */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#e9d19a] shadow-xs space-y-2">
            <h3 className="font-bold text-xs font-reem text-[#1e4d2b] dark:text-[#c5a059]">
              سرعة التلاوة الصوتية:
            </h3>

            <div className="grid grid-cols-4 gap-1.5">
              {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onChangePlaybackSpeed(speed)}
                  className={`py-2 rounded-xl text-xs font-bold font-reem border transition-all ${
                    playbackSpeed === speed
                      ? 'bg-[#1e4d2b] text-[#fdfaf2] border-[#c5a059] shadow-xs'
                      : 'bg-[#f8f3e6] dark:bg-slate-700 text-stone-700 dark:text-stone-300 border-[#e9d19a]'
                  }`}
                >
                  {speed === 1.0 ? 'عادية (1x)' : `${speed}x`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: About & Virtues */}
      {activeTab === 'about' && (
        <div className="space-y-3">
          {/* PWA Install Banner */}
          <PWAInstallButton variant="mobile-card" />

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-[#c5a059] shadow-xs space-y-2.5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#1e4d2b] text-[#c5a059] border-2 border-[#c5a059] flex items-center justify-center text-xl mx-auto shadow-sm">
              📖
            </div>
            <h3 className="font-bold text-sm font-quran text-[#1e4d2b] dark:text-[#c5a059]">
              المصحف الإلكتروني الشريف
            </h3>
            <p className="text-xs font-reem text-stone-600 dark:text-stone-300 leading-relaxed">
              تطبيق إسلامي لقراءة وتدبر القرآن الكريم برواية حفص عن عاصم بالرسم العثماني المعتمد، وتلاوات كبار قراء العالم الإسلامي مع التفسير الميسر.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8f3e6] dark:bg-slate-900 border border-[#c5a059] space-y-2">
            <h4 className="font-bold text-xs font-reem text-[#1e4d2b] dark:text-[#c5a059] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
              <span>من فضائل تلاوة القرآن الكريم:</span>
            </h4>
            <p className="text-xs font-reem text-stone-700 dark:text-stone-300 leading-relaxed">
              قال رسول الله ﷺ: «مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالحَسَنَةُ بِعَشْرِ أَمْثَالِهَا، لاَ أَقُولُ الم حَرْفٌ، وَلَكِنْ أَلِفٌ حَرْفٌ وَلاَمٌ حَرْفٌ وَمِيمٌ حَرْفٌ».
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
