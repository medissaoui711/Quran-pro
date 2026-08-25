import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Ayah, Reciter } from '../types/quran';
import { RECITERS } from '../data/quranMetadata';
import { getAyahAudioUrl } from '../services/quranApi';

interface AudioContextType {
  currentAyah: Ayah | null;
  isPlaying: boolean;
  isAudioOpen: boolean;
  selectedReciter: Reciter;
  playbackSpeed: number;
  isRepeat: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  playAyah: (ayah: Ayah) => void;
  togglePlay: () => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  nextAyah: () => void;
  prevAyah: () => void;
  closeAudio: () => void;
  openAudioSheet: () => void;
  closeAudioSheet: () => void;
  isAudioSheetOpen: boolean;
  setReciter: (reciter: Reciter) => void;
  setSpeed: (speed: number) => void;
  toggleRepeat: () => void;
  toggleMute: () => void;
  seek: (percent: number) => void;
  registerNavigationHandlers: (handlers: { onNext: () => void; onPrev: () => void }) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioOpen, setIsAudioOpen] = useState<boolean>(false);
  const [isAudioSheetOpen, setIsAudioSheetOpen] = useState<boolean>(false);

  const [selectedReciter, setSelectedReciter] = useState<Reciter>(() => {
    try {
      const saved = localStorage.getItem('mushaf_selected_reciter_id');
      if (saved) {
        const found = RECITERS.find((r) => r.id === saved);
        if (found) return found;
      }
    } catch {
      // fallback
    }
    return RECITERS[0];
  });

  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const navHandlersRef = useRef<{ onNext: () => void; onPrev: () => void }>({
    onNext: () => {},
    onPrev: () => {},
  });

  const registerNavigationHandlers = useCallback(
    (handlers: { onNext: () => void; onPrev: () => void }) => {
      navHandlersRef.current = handlers;
    },
    []
  );

  const audioUrl = currentAyah
    ? getAyahAudioUrl(selectedReciter.serverUrl, currentAyah.surahNumber, currentAyah.numberInSurah)
    : undefined;

  // Save selected reciter
  useEffect(() => {
    if (selectedReciter?.id) {
      localStorage.setItem('mushaf_selected_reciter_id', selectedReciter.id);
    }
  }, [selectedReciter]);

  // Sync playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Sync mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Audio Playback trigger
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && audioUrl) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Audio playback prevented or failed:', err);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, audioUrl]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      const cur = audio.currentTime || 0;
      const dur = audio.duration || 1;
      setCurrentTime(cur);
      setDuration(dur);
      setProgress((cur / dur) * 100);
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    } else {
      navHandlersRef.current.onNext();
    }
  };

  const playAyah = useCallback((ayah: Ayah) => {
    setCurrentAyah(ayah);
    setIsAudioOpen(true);
    setIsPlaying(true);
  }, []);

  const pauseAudio = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeAudio = useCallback(() => {
    if (currentAyah) {
      setIsPlaying(true);
      setIsAudioOpen(true);
    }
  }, [currentAyah]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const nextAyah = useCallback(() => {
    navHandlersRef.current.onNext();
  }, []);

  const prevAyah = useCallback(() => {
    navHandlersRef.current.onPrev();
  }, []);

  const closeAudio = useCallback(() => {
    setIsPlaying(false);
    setIsAudioOpen(false);
    setIsAudioSheetOpen(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const openAudioSheet = useCallback(() => {
    setIsAudioSheetOpen(true);
  }, []);

  const closeAudioSheet = useCallback(() => {
    setIsAudioSheetOpen(false);
  }, []);

  const setReciter = useCallback((reciter: Reciter) => {
    setSelectedReciter(reciter);
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setPlaybackSpeed(speed);
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeat((prev) => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const seek = useCallback(
    (percent: number) => {
      const audio = audioRef.current;
      if (audio && duration > 0) {
        const targetTime = (percent / 100) * duration;
        audio.currentTime = targetTime;
        setCurrentTime(targetTime);
        setProgress(percent);
      }
    },
    [duration]
  );

  return (
    <AudioContext.Provider
      value={{
        currentAyah,
        isPlaying,
        isAudioOpen,
        selectedReciter,
        playbackSpeed,
        isRepeat,
        isMuted,
        currentTime,
        duration,
        progress,
        playAyah,
        togglePlay,
        pauseAudio,
        resumeAudio,
        nextAyah,
        prevAyah,
        closeAudio,
        openAudioSheet,
        closeAudioSheet,
        isAudioSheetOpen,
        setReciter,
        setSpeed,
        toggleRepeat,
        toggleMute,
        seek,
        registerNavigationHandlers,
      }}
    >
      {/* Universal Hidden Persistent Audio Engine Instance */}
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={(e) => {
          if (audioUrl) {
            console.warn('Quran Audio Stream error on:', audioUrl, e);
          }
          setIsPlaying(false);
        }}
        playsInline
      />
      {children}
    </AudioContext.Provider>
  );
};

export const useQuranAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useQuranAudio must be used within an AudioProvider');
  }
  return context;
};
