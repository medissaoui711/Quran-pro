import React, { useRef, useCallback } from 'react';

interface SwipeHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
}

interface UseQuranSwipeOptions {
  onNextPage: () => void;
  onPrevPage: () => void;
  threshold?: number; // Minimum px distance to trigger swipe
  enabled?: boolean;
}

/**
 * useQuranSwipe - Unified and robust Touch & Mouse Drag gesture hook
 * Specifically tailored for Arabic RTL Quran reading:
 * - Swipe from Left to Right (diffX > 0) -> Next Page (towards page 604)
 * - Swipe from Right to Left (diffX < 0) -> Prev Page (towards page 1)
 */
export function useQuranSwipe({
  onNextPage,
  onPrevPage,
  threshold = 35,
  enabled = true,
}: UseQuranSwipeOptions): SwipeHandlers {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isMouseDown = useRef<boolean>(false);
  const mouseStartX = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);

  const handleSwipeEnd = useCallback(
    (startX: number, startY: number, endX: number, endY: number) => {
      const diffX = endX - startX;
      const diffY = endY - startY;

      // Ensure horizontal intent is dominant over vertical scroll
      if (Math.abs(diffX) >= threshold && Math.abs(diffX) > Math.abs(diffY) * 1.1) {
        if (diffX > 0) {
          // Dragged Left-to-Right in Arabic Mushaf -> Next Page (towards 604)
          onNextPage();
        } else {
          // Dragged Right-to-Left in Arabic Mushaf -> Prev Page (towards 1)
          onPrevPage();
        }
      }
    },
    [onNextPage, onPrevPage, threshold]
  );

  // Touch Events (Mobile & Touch screens)
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    },
    [enabled]
  );

  const onTouchMove = useCallback(() => {
    // Keep touch positions updated if needed
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || touchStartX.current === null || touchStartY.current === null) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      handleSwipeEnd(touchStartX.current, touchStartY.current, touchEndX, touchEndY);

      touchStartX.current = null;
      touchStartY.current = null;
    },
    [enabled, handleSwipeEnd]
  );

  // Mouse Drag Events (Desktop testing & touch pads)
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || e.button !== 0) return; // Only primary left click
      isMouseDown.current = true;
      mouseStartX.current = e.clientX;
      mouseStartY.current = e.clientY;
    },
    [enabled]
  );

  const onMouseMove = useCallback(() => {
    // optional tracking
  }, []);

  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || !isMouseDown.current || mouseStartX.current === null || mouseStartY.current === null) return;
      const mouseEndX = e.clientX;
      const mouseEndY = e.clientY;

      handleSwipeEnd(mouseStartX.current, mouseStartY.current, mouseEndX, mouseEndY);

      isMouseDown.current = false;
      mouseStartX.current = null;
      mouseStartY.current = null;
    },
    [enabled, handleSwipeEnd]
  );

  const onMouseLeave = useCallback(() => {
    isMouseDown.current = false;
    mouseStartX.current = null;
    mouseStartY.current = null;
  }, []);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
  };
}
