import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { forceScrollTop } from '../utils/forceScrollTop';

export const useDelayedNavigation = ({ 
  fadeToDuration = 200, 
  blackHoldDuration = 50 
} = {}) => {
  const navigate = useNavigate();

  const delayedNavigate = useCallback((to, options = {}) => {
    const skipTransitionStart = Boolean(options.skipTransitionStart);
    // Start transition first to avoid visible pre-transition jump.
    if (!skipTransitionStart) {
      window.dispatchEvent(new CustomEvent('delayed-navigation-start', {
        detail: { to, options }
      }));
    }

    const override = options.transition || {};
    const fadeTo = typeof override.fadeToDuration === 'number'
      ? override.fadeToDuration
      : fadeToDuration;
    const hold = typeof override.blackHoldDuration === 'number'
      ? override.blackHoldDuration
      : blackHoldDuration;

    setTimeout(() => {
      navigate(to, options);

      // HashRouter/location transitions can restore old scroll position asynchronously.
      // Force top again after navigation settles.
      const rafId = window.requestAnimationFrame(forceScrollTop);
      const timeoutA = window.setTimeout(forceScrollTop, 80);
      const timeoutB = window.setTimeout(forceScrollTop, 220);
      const timeoutC = window.setTimeout(forceScrollTop, 420);

      window.setTimeout(() => {
        window.cancelAnimationFrame(rafId);
        window.clearTimeout(timeoutA);
        window.clearTimeout(timeoutB);
        window.clearTimeout(timeoutC);
      }, 520);
    }, fadeTo + hold);
  }, [navigate, fadeToDuration, blackHoldDuration]);

  return delayedNavigate;
};
