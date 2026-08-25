import React from 'react';
import { WifiOff } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div
      className="fixed top-14 sm:top-4 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 bg-[#15341d] text-[#e9d19a] border border-[#c5a059] rounded-full shadow-lg flex items-center gap-2 text-xs font-reem select-none animate-fade-in"
      dir="rtl"
    >
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span>أنت غير متصل بالإنترنت (تعمل القراءة دون اتصال)</span>
    </div>
  );
};
