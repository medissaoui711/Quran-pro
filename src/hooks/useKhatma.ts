import { useState, useEffect } from 'react';
import { KhatmaTracker } from '../types/quran';

export const INITIAL_KHATMA: KhatmaTracker = {
  id: 'main-khatma',
  name: 'ختمتي المباركة',
  startDate: Date.now(),
  targetDays: 30,
  currentPage: 1,
  dailyGoalPages: 20,
  completed: false,
  pagesReadHistory: {},
};

export function useKhatma(showToast: (msg: string) => void) {
  const [khatma, setKhatma] = useState<KhatmaTracker>(() => {
    try {
      const saved = localStorage.getItem('mushaf_khatma');
      return saved ? JSON.parse(saved) : INITIAL_KHATMA;
    } catch {
      return INITIAL_KHATMA;
    }
  });

  // Save khatma to localStorage
  useEffect(() => {
    localStorage.setItem('mushaf_khatma', JSON.stringify(khatma));
  }, [khatma]);

  const updateKhatmaDays = (days: number) => {
    setKhatma((prev) => ({ ...prev, targetDays: days }));
  };

  const recordDailyProgress = (page: number) => {
    const today = new Date().toISOString().split('T')[0];
    setKhatma((prev) => ({
      ...prev,
      currentPage: page,
      pagesReadHistory: {
        ...prev.pagesReadHistory,
        [today]: page,
      },
    }));
    showToast(`تم تثبيت صفحة ${page} كإنجاز اليوم`);
  };

  const updateKhatma = (updated: Partial<KhatmaTracker>) => {
    setKhatma((prev) => ({ ...prev, ...updated }));
  };

  return {
    khatma,
    setKhatma,
    updateKhatmaDays,
    recordDailyProgress,
    updateKhatma,
  };
}
