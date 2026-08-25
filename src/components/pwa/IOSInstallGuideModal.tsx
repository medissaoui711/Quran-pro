import React from 'react';
import { X, Share, PlusSquare, Smartphone } from 'lucide-react';

interface IOSInstallGuideModalProps {
  onClose: () => void;
}

export const IOSInstallGuideModal: React.FC<IOSInstallGuideModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="w-full max-w-sm bg-[#1e4d2b] border-2 border-[#c5a059] rounded-3xl p-5 text-[#fdfaf2] shadow-2xl space-y-4 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#c5a059]/30 pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#c5a059]" />
            <h3 className="font-bold font-reem text-sm text-[#e9d19a]">
              إضافة المصحف إلى الشاشة الرئيسية
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-[#15341d] text-[#e9d19a] hover:bg-[#c5a059] hover:text-[#1e4d2b]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3 font-reem text-xs leading-relaxed text-[#fdfaf2]/90">
          <p className="text-[11px] text-[#e9d19a]">
            لتثبيت التطبيق على جهاز iPhone أو iPad عبر متصفح Safari:
          </p>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#15341d] border border-[#c5a059]/40">
            <span className="w-6 h-6 rounded-full bg-[#c5a059] text-[#1e4d2b] font-bold flex items-center justify-center text-xs shrink-0">
              ١
            </span>
            <div className="flex-1">
              <span>اضغط على زر المشاركة</span>
              <span className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 bg-slate-800 rounded border border-slate-600 text-blue-400">
                <Share className="w-3.5 h-3.5" />
                <span>مشاركة / Share</span>
              </span>
              <span>في أسفل متصفح Safari.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#15341d] border border-[#c5a059]/40">
            <span className="w-6 h-6 rounded-full bg-[#c5a059] text-[#1e4d2b] font-bold flex items-center justify-center text-xs shrink-0">
              ٢
            </span>
            <div className="flex-1">
              <span>مرر لأسفل واختر</span>
              <span className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 bg-slate-800 rounded border border-slate-600 text-amber-300">
                <PlusSquare className="w-3.5 h-3.5" />
                <span>إضافة إلى الشاشة الرئيسية</span>
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#15341d] border border-[#c5a059]/40">
            <span className="w-6 h-6 rounded-full bg-[#c5a059] text-[#1e4d2b] font-bold flex items-center justify-center text-xs shrink-0">
              ٣
            </span>
            <div className="flex-1">
              <span>اضغط على </span>
              <strong className="text-[#e9d19a]">"إضافة" (Add)</strong>
              <span> أعلى اليمين لتثبيت أيقونة المصحف الشريف.</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-[#c5a059] text-[#1e4d2b] rounded-xl font-bold font-reem text-xs hover:bg-[#e9d19a] transition-colors"
        >
          فهمت ذلك
        </button>
      </div>
    </div>
  );
};
