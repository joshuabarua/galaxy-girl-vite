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

  const forceScrollTop = () => {
    const docEl = document.documentElement;
    const body = document.body;
    const scrollingEl = document.scrollingElement || docEl;
    const prevDocBehavior = docEl.style.scrollBehavior;
    const prevBodyBehavior = body.style.scrollBehavior;

    docEl.style.scrollBehavior = 'auto';
    body.style.scrollBehavior = 'auto';

    window.scrollTo(0, 0);
    scrollingEl.scrollTop = 0;
    docEl.scrollTop = 0;
    body.scrollTop = 0;

    const containers = [
      document.getElementById('root'),
      document.querySelector('.app-minimal'),
      document.querySelector('.route-transition-wrapper'),
      document.querySelector('.route-transition-wrapper > .relative.z-0.min-h-full'),
      document.querySelector('main'),
    ];

    containers.forEach((node) => {
      if (!node) return;
      node.scrollTop = 0;
      node.scrollLeft = 0;
    });

    gsap.set(window, { scrollTo: { y: 0, autoKill: false } });

    docEl.style.scrollBehavior = prevDocBehavior;
    body.style.scrollBehavior = prevBodyBehavior;
  };

  const delayedNavigate = useCallback((to, options = {}) => {
    // Start transition first to avoid visible pre-transition jump.
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
      forceScrollTop();
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
