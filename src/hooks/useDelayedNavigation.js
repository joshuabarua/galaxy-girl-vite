import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useDelayedNavigation = ({ 
  fadeToDuration = 200, 
  blackHoldDuration = 50 
} = {}) => {
  const navigate = useNavigate();

  const delayedNavigate = useCallback((to, options = {}) => {
    // Trigger fade-to-black overlay
    window.dispatchEvent(new CustomEvent('delayed-navigation-start', { 
      detail: { to, options } 
    }));

    // Allow per-call overrides (options.transition), else adjust timing per route
    const override = options.transition || {};
    const fadeTo = typeof override.fadeToDuration === 'number'
      ? override.fadeToDuration
      : (to === '/' ? Math.max(100, fadeToDuration - 80) : fadeToDuration);
    const hold = typeof override.blackHoldDuration === 'number'
      ? override.blackHoldDuration
      : (to === '/' ? Math.max(20, blackHoldDuration - 20) : blackHoldDuration);

    // Navigate after fade-to-black + hold completes
    setTimeout(() => {
      navigate(to, options);
    }, fadeTo + hold);
  }, [navigate, fadeToDuration, blackHoldDuration]);

  return delayedNavigate;
};
