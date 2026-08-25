import React from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export const PWAUpdateToast: React.FC = () => {
  const { hasUpdate, applyUpdate } = usePWA();
  const [dismissed, setDismissed] = React.useState<boolean>(false);

  if (!hasUpdate || dismissed) return null;

  return (
    <div
      className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 max-w-sm bg-[#1e4d2b] text-[#fdfaf2] border-2 border-[#c5a059] rounded-2xl shadow-2xl p-3.5 space-y-2 select-none animate-slide-up"
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#c5a059] animate-pulse" />
          <h4 className="font-bold text-xs font-reem text-[#e9d19a]">
            تحديث جديد متوفر للمصحف
          </h4>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#e9d19a] hover:text-white p-1"
          title="إغلاق"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[11px] font-reem text-[#fdfaf2]/85">
        تتوفر تحسينات جديدة للتطبيق، انقر لتحديث النسخة فوراً دون فقدان موضع قراءتك.
      </p>

      <button
        onClick={applyUpdate}
        className="w-full py-1.5 px-3 rounded-xl bg-[#c5a059] hover:bg-[#e9d19a] text-[#1e4d2b] font-bold font-reem text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>تحديث التطبيق الآن</span>
      </button>
    </div>
  );
};
