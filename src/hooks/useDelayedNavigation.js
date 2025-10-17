import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Hook for delayed navigation with fade-to-black transition
 * Dispatches event to trigger overlay, waits for fade-to-black, then navigates
 */
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

    // Navigate after fade-to-black + hold completes
    setTimeout(() => {
      navigate(to, options);
    }, fadeToDuration + blackHoldDuration);
  }, [navigate, fadeToDuration, blackHoldDuration]);

  return delayedNavigate;
};
