import { useLayoutEffect, RefObject } from 'react';

/**
 * Standardized Scroll-To-Top Hook for Page Navigation Transitions
 * Guarantees zero scroll offset upon page state change across Window, Document, and local containers.
 */
export function useScrollResetOnPageChange(
  pageDependency: number | string | undefined,
  containerRef?: RefObject<HTMLElement | null>
) {
  useLayoutEffect(() => {
    // 1. Immediate Synchronous Phase: Viewport reset before browser paint
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // 2. Container-specific reset if component utilizes an internal scrollable div
    if (containerRef?.current) {
      containerRef.current.scrollTop = 0;
    }

    // 3. Post-layout frame assurance (guarding against image asset load height jumps)
    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
      if (containerRef?.current) {
        containerRef.current.scrollTop = 0;
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [pageDependency, containerRef]);
}
