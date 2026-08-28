import { useState, useEffect } from 'react';
import { PaperTheme, ViewMode } from '../types/quran';

export function useThemePreferences() {
  // Mobile viewport detection
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'spread' : 'single';
  });

  const [renderMode, setRenderMode] = useState<'image' | 'text'>('image');
  
  const [theme, setTheme] = useState<PaperTheme>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('mushaf_theme') : null;
    return (saved as PaperTheme) || 'dark';
  });

  const [fontSize, setFontSize] = useState<number>(24);

  // Sync Dark Theme with HTML Document Class for Tailwind & CSS dark: selectors
  useEffect(() => {
    localStorage.setItem('mushaf_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  // Resize listener for viewport responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (window.innerWidth < 1024 && viewMode === 'spread') {
        setViewMode('single');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'madinah' : 'dark'));
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'spread' ? 'single' : 'spread'));
  };

  const toggleRenderMode = () => {
    setRenderMode((prev) => (prev === 'image' ? 'text' : 'image'));
  };

  const changeFontSize = (delta: number) => {
    setFontSize((prev) => Math.max(16, Math.min(36, prev + delta)));
  };

  return {
    isMobile,
    theme,
    setTheme,
    toggleTheme,
    renderMode,
    setRenderMode,
    toggleRenderMode,
    fontSize,
    setFontSize,
    changeFontSize,
    viewMode,
    setViewMode,
    toggleViewMode,
  };
}
