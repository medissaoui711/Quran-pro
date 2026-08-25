import React, { useState } from 'react';
import { X, Trophy, Calendar, CheckCircle, Flame, BookOpen, Heart, Sparkles } from 'lucide-react';
import { KhatmaTracker } from '../types/quran';
import { toArabicNumerals } from '../services/quranApi';

interface KhatmaTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  onJumpToPage: (page: number) => void;
  khatma: KhatmaTracker;
  onUpdateKhatma: (updated: Partial<KhatmaTracker>) => void;
}

export const DOAA_KHATM_QURAN = `
اللَّهُمَّ ارْحَمْنِي بِالقُرْآنِ وَاجْعَلْهُ لِي إِمَاماً وَنُوراً وَهُدًى وَرَحْمَةً.
اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ وَارْزُقْنِي تِلاَوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ العَالَمِينَ.
اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ وَاجْعَلِ المَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ.
اللَّهُمَّ اجْعَلْ خَيْرَ عُمْرِي آخِرَهُ وَخَيْرَ عَمَلِي خَوَاتِمَهُ وَخَيْرَ أَيَّامِي يَوْمَ أَلْقَاكَ فِيهِ.
اللَّهُمَّ إِنِّي أَسْأَلُكَ عِيشَةً هَنِيَّةً وَمِيتَةً سَوِيَّةً وَمَرَدًّا غَيْرَ مُخْزٍ وَلاَ فَاضِحٍ.
اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ المَسْأَلَةِ وَخَيْرَ الدُّعَاءِ وَخَيْرَ النَّجَاحِ وَخَيْرَ العِلْمِ وَخَيْرَ العَمَلِ وَخَيْرَ الثَّوَابِ وَخَيْرَ الحَيَاةِ وَخَيْرَ المَمَاتِ، وَثَبِّتْنِي وَثَقِّلْ مَوَازِينِي وَحَقِّقْ إِيمَانِي وَارْفَعْ دَرَجَتِي وَتَقَبَّلْ صَلاَتِي وَاغْفِرْ خَطِيئَاتِي وَأَسْأَلُكَ العُلَى مِنَ الجَنَّةِ.
اللَّهُمَّ إِنِّي أَسْأَلُكَ مُوجِبَاتِ رَحْمَتِكَ وَعَزَائِمَ مَغْفِرَتِكَ وَالسَّلاَمَةَ مِنْ كُلِّ إِثْمٍ وَالغَنِيمَةَ مِنْ كُلِّ بِرٍّ وَالفَوْزَ بِالجَنَّةِ وَالنَّجَاةَ مِنَ النَّارِ.
اللَّهُمَّ أَحْسِنْ عَاقِبَتَنَا فِي الأُمُورِ كُلِّهَا، وَأَجِرْنَا مِنْ خِزْيِ الدُّنْيَا وَعَذَابِ الآخِرَةِ.
اللَّهُمَّ اقْسِمْ لَنَا مِنْ خَشْيَتِكَ مَا تَحُولُ بِهِ بَيْنَنَا وَبَيْنَ مَعْصِيَتِكَ وَمِنْ طَاعَتِكَ مَا تُبَلِّغُنَا بِهِ جَنَّتَكَ وَمِنَ اليَقِينِ مَا تُهَوِّنُ بِهِ عَلَيْنَا مَصَائِبَ الدُّنْيَا.
وَصَلَّى اللهُ عَلَى نَبِيِّنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ تَسْلِيمًا كَثِيرًا.
`;

export const KhatmaTrackerModal: React.FC<KhatmaTrackerModalProps> = ({
  isOpen,
  onClose,
  currentPage,
  onJumpToPage,
  khatma,
  onUpdateKhatma,
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'doaa'>('progress');
  const [targetDays, setTargetDays] = useState<number>(khatma.targetDays || 30);

  if (!isOpen) return null;

  const totalPages = 604;
  const progressPercent = Math.min(100, Math.round((currentPage / totalPages) * 100));
  const dailyGoal = Math.ceil(totalPages / targetDays);
  const remainingPages = Math.max(0, totalPages - currentPage);
  const estimatedDaysLeft = Math.ceil(remainingPages / (dailyGoal || 1));

  const handleSavePlan = () => {
    onUpdateKhatma({
      targetDays,
      dailyGoalPages: dailyGoal,
    });
  };

  const handleMarkPageAsProgress = () => {
    onUpdateKhatma({
      currentPage,
      completed: currentPage >= totalPages,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-[#fdfaf2] dark:bg-[#151b23] border-4 border-[#c5a059] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#1e4d2b] text-[#fdfaf2] flex items-center justify-between border-b-2 border-[#c5a059]">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#c5a059]" />
            <h2 className="text-base sm:text-lg font-bold font-reem">
              متابعة ختمة القرآن الكريم ودعاء الختم
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-[#15341d] hover:bg-[#c5a059] hover:text-[#1e4d2b] transition-colors border border-[#c5a059]/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#e9d19a] bg-[#f8f3e6] dark:bg-slate-900 text-xs sm:text-sm font-reem">
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 py-3 text-center font-bold transition-all border-b-2 ${
              activeTab === 'progress'
                ? 'border-[#1e4d2b] text-[#1e4d2b] dark:text-[#c5a059] bg-[#fdfaf2] dark:bg-[#151b23]'
                : 'border-transparent text-[#8b6e31] hover:text-[#1e4d2b]'
            }`}
          >
            خطة الختمة ومتابعة القراءة
          </button>
          <button
            onClick={() => setActiveTab('doaa')}
            className={`flex-1 py-3 text-center font-bold transition-all border-b-2 ${
              activeTab === 'doaa'
                ? 'border-[#1e4d2b] text-[#1e4d2b] dark:text-[#c5a059] bg-[#fdfaf2] dark:bg-[#151b23]'
                : 'border-transparent text-[#8b6e31] hover:text-[#1e4d2b]'
            }`}
          >
            دعاء ختم القرآن الكريم
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'progress' ? (
            <>
              {/* Main Progress Ring & Stats */}
              <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border-2 border-[#e9d19a] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center md:items-start text-center md:text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-5 h-5 text-[#c5a059]" />
                    <span className="text-xs font-bold text-[#8b6e31] dark:text-stone-300 font-reem uppercase tracking-wider">
                      نسبة إنجاز الختمة
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#1e4d2b] dark:text-[#c5a059] font-reem">
                    {toArabicNumerals(progressPercent)}% مُنجز
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 font-reem mt-1">
                    قرأت حتى الصفحة {toArabicNumerals(currentPage)} من أصل {toArabicNumerals(totalPages)} صفحة.
                  </p>
                </div>

                {/* Progress Bar Display */}
                <div className="w-full md:w-1/2 space-y-2">
                  <div className="w-full h-4 bg-[#f4ede1] dark:bg-slate-900 rounded-full border border-[#c5a059] overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-l from-[#1e4d2b] via-[#2d6a3e] to-[#c5a059] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-reem text-[#8b6e31] dark:text-stone-300">
                    <span>البداية (ص ١)</span>
                    <span>المتبقي: {toArabicNumerals(remainingPages)} صفحة</span>
                    <span>الختم (ص ٦٠٤)</span>
                  </div>
                </div>
              </div>

              {/* Khatma Planner Configurations */}
              <div className="p-4 rounded-lg bg-[#f8f3e6] dark:bg-slate-900 border border-[#e9d19a] space-y-4">
                <h3 className="text-sm font-bold text-[#1e4d2b] dark:text-[#c5a059] font-reem flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#c5a059]" />
                  تحديد مدة الختمة المستهدفة:
                </h3>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { days: 30, label: '٣٠ يومًا (شهر)', pages: 20 },
                    { days: 60, label: '٦٠ يومًا (شهران)', pages: 10 },
                    { days: 90, label: '٩٠ يومًا (٣ أشهر)', pages: 7 },
                  ].map((plan) => (
                    <button
                      key={plan.days}
                      onClick={() => {
                        setTargetDays(plan.days);
                        onUpdateKhatma({ targetDays: plan.days, dailyGoalPages: plan.pages });
                      }}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        targetDays === plan.days
                          ? 'bg-[#1e4d2b] text-[#fdfaf2] border-[#c5a059] shadow-md'
                          : 'bg-white dark:bg-slate-800 text-[#1a1a1a] dark:text-[#fdfaf2] border-[#e9d19a] hover:bg-[#f4ede1]'
                      }`}
                    >
                      <div className="text-xs font-bold font-reem">{plan.label}</div>
                      <div className="text-[11px] text-[#c5a059] mt-0.5 font-reem">
                        {toArabicNumerals(plan.pages)} صفحات يومياً
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-[#e9d19a] flex items-center justify-between text-xs font-reem text-[#8b6e31] dark:text-stone-200">
                  <span>الورد اليومي المطلوب: {toArabicNumerals(dailyGoal)} صفحة (حوالي {toArabicNumerals(Math.ceil(dailyGoal / 20))} جزء)</span>
                  <span>الأيام التقديرية المتبقية: {toArabicNumerals(estimatedDaysLeft)} يوم</span>
                </div>
              </div>

              {/* Quick Action: Update Khatma checkpoint to Current Page */}
              <div className="flex justify-center">
                <button
                  onClick={handleMarkPageAsProgress}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1e4d2b] text-[#fdfaf2] border-2 border-[#c5a059] rounded-xl hover:bg-[#15341d] transition-all font-reem font-bold text-sm shadow-md"
                >
                  <CheckCircle className="w-5 h-5 text-[#c5a059]" />
                  <span>تثبيت الصفحة الحالية ({toArabicNumerals(currentPage)}) كموضع قراءتي الحالي</span>
                </button>
              </div>
            </>
          ) : (
            /* TAB 2: DOAA KHATM AL-QURAN */
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border-2 border-[#c5a059] shadow-xs text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#1e4d2b] text-[#fdfaf2] text-xs font-reem mb-3 border border-[#c5a059]">
                  <Sparkles className="w-4 h-4 text-[#c5a059]" />
                  <span>دعاء ختم القرآن الكريم المبارك</span>
                </div>

                <div className="text-right font-quran text-base sm:text-lg text-[#1a1a1a] dark:text-[#fdfaf2] leading-[2.6] whitespace-pre-line select-text p-2">
                  {DOAA_KHATM_QURAN.trim()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#f4ede1] dark:bg-slate-900 border-t border-[#e9d19a] flex justify-between items-center text-xs font-reem text-[#8b6e31]">
          <span>اللهم اجعل القرآن العظيم ربيع قلوبنا ونور صدورنا</span>
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
