import React, { useState } from 'react';
import { Download, CheckCircle2, Share2 } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';
import { IOSInstallGuideModal } from './IOSInstallGuideModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'menu' | 'mobile-card';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { isInstallable, isInstalled, isStandalone, isIOS, promptInstall } = usePWA();
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  // If already installed or running in standalone mode, don't show install button
  if (isStandalone || isInstalled) {
    if (variant === 'mobile-card') {
      return (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-[#c5a059]/40 rounded-xl text-[#e9d19a] text-xs font-reem">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>تطبيق المصحف الشريف مثبت على جهازك ويعمل كتطبيق مستقل.</span>
        </div>
      );
    }
    return null;
  }

  // If not installable and not iOS, hide
  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (isInstallable) {
      setIsInstalling(true);
      try {
        await promptInstall();
      } finally {
        setIsInstalling(false);
      }
    }
  };

  if (variant === 'header') {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={isInstalling}
          className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold font-reem bg-gradient-to-r from-[#c5a059] to-[#e9d19a] hover:from-[#e9d19a] hover:to-[#fdf0cd] text-[#15341d] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${className}`}
          title="تثبيت المصحف كتطبيق مستقل على جهازك"
        >
          {isIOS ? <Share2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          <span>{isIOS ? 'إضافة للشاشة' : 'تثبيت التطبيق'}</span>
        </button>

        {showIOSModal && <IOSInstallGuideModal onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  if (variant === 'mobile-card') {
    return (
      <>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1e4d2b] to-[#15341d] border-2 border-[#c5a059] text-[#fdfaf2] shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15341d] border border-[#c5a059] flex items-center justify-center text-xl shadow-inner">
              📖
            </div>
            <div>
              <h4 className="font-bold font-reem text-sm text-[#e9d19a]">
                تثبيت المصحف على هاتفك
              </h4>
              <p className="text-[11px] text-[#fdfaf2]/80 font-reem">
                احصل على تجربة تطبيق سريعة تعمل في نافذة مستقلة وبدون إنترنت
              </p>
            </div>
          </div>

          <button
            onClick={handleClick}
            disabled={isInstalling}
            className="w-full py-2.5 px-4 rounded-xl bg-[#c5a059] hover:bg-[#e9d19a] text-[#1e4d2b] font-bold font-reem text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            {isIOS ? <Share2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{isIOS ? 'طريقة الإضافة للشاشة الرئيسية (iOS)' : 'تثبيت المصحف الآن'}</span>
          </button>
        </div>

        {showIOSModal && <IOSInstallGuideModal onClose={() => setShowIOSModal(false)} />}
      </>
    );
  }

  return null;
};
