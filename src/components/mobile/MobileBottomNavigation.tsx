import React from 'react';
import {
  Home,
  BookOpen,
  Search,
  Bookmark,
  Menu,
  Sliders,
  Trophy,
} from 'lucide-react';
import { toArabicNumerals } from '../../services/quranApi';

export type MobileTab = 'home' | 'reader' | 'index' | 'bookmarks' | 'more';

interface MobileBottomNavigationProps {
  activeTab: MobileTab;
  onSelectTab: (tab: MobileTab) => void;
  bookmarksCount: number;
  hasActiveAudio: boolean;
  isVisible: boolean;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  activeTab,
  onSelectTab,
  bookmarksCount,
  hasActiveAudio,
  isVisible,
}) => {
  if (!isVisible) return null;

  const tabs: { id: MobileTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'reader', label: 'المصحف', icon: BookOpen },
    { id: 'index', label: 'الفهرس', icon: Search },
    { id: 'bookmarks', label: 'الإشارات', icon: Bookmark },
    { id: 'more', label: 'المزيد والضبط', icon: Sliders },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-[#15341d] dark:bg-[#0e1410] border-t-2 border-[#c5a059] shadow-2xl transition-transform duration-300 select-none pb-[env(safe-area-inset-bottom)]"
      dir="rtl"
      style={{
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full w-full py-1 transition-all duration-200 active:scale-95 touch-manipulation ${
                isActive
                  ? 'text-[#fdfaf2]'
                  : 'text-[#e9d19a]/70 hover:text-[#e9d19a]'
              }`}
            >
              {/* Active Indicator Top Pill */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-[#c5a059] rounded-b-full shadow-xs animate-fade-in" />
              )}

              {/* Icon Container with Highlight */}
              <div
                className={`relative p-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#15341d] text-[#c5a059] border border-[#c5a059]/50 shadow-inner'
                    : ''
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />

                {/* Bookmark Count Badge */}
                {tab.id === 'bookmarks' && bookmarksCount > 0 && (
                  <span className="absolute -top-1 -left-1 min-w-[16px] h-4 px-1 rounded-full bg-[#c5a059] text-[#1e4d2b] text-[10px] font-bold flex items-center justify-center font-reem">
                    {toArabicNumerals(bookmarksCount)}
                  </span>
                )}

                {/* Audio Playing Pulsing Dot Indicator */}
                {tab.id === 'reader' && hasActiveAudio && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>

              {/* Tab Title */}
              <span
                className={`text-[11px] font-reem mt-0.5 transition-all truncate px-0.5 ${
                  isActive ? 'font-bold text-[#fdfaf2]' : 'font-normal'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
