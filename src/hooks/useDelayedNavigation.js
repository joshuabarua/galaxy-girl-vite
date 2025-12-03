import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export const useDelayedNavigation = ({ 
  fadeToDuration = 200, 
  blackHoldDuration = 50 
} = {}) => {
  const navigate = useNavigate();

  const delayedNavigate = useCallback((to, options = {}) => {
    // Immediately scroll to top before transition starts
    gsap.to(window, { duration: 0, scrollTo: { y: 0, autoKill: false } });
    
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
      // Scroll to top again right before navigation
      gsap.to(window, { duration: 0, scrollTo: { y: 0, autoKill: false } });
      navigate(to, options);
    }, fadeTo + hold);
  }, [navigate, fadeToDuration, blackHoldDuration]);

  return delayedNavigate;
};
