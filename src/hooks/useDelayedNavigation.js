import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useDelayedNavigation = ({ 
  fadeToDuration = 200, 
  blackHoldDuration = 50 
} = {}) => {
  const navigate = useNavigate();

  const delayedNavigate = useCallback((to, options = {}) => {
    window.dispatchEvent(new CustomEvent('delayed-navigation-start', { 
      detail: { to, options } 
    }));

    const override = options.transition || {};
    const fadeTo = typeof override.fadeToDuration === 'number'
      ? override.fadeToDuration
      : fadeToDuration;
    const hold = typeof override.blackHoldDuration === 'number'
      ? override.blackHoldDuration
      : blackHoldDuration;

    setTimeout(() => {
      navigate(to, options);
    }, fadeTo + hold);
  }, [navigate, fadeToDuration, blackHoldDuration]);

  return delayedNavigate;
};
