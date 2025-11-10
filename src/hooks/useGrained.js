import { useEffect } from 'react';
import { applyGrain } from '../utils/grained';

export const useGrained = (elementId, options = {}) => {
  useEffect(() => {
    const defaults = {
      animate: true,
      patternWidth: 100,
      patternHeight: 100,
      grainOpacity: 0.09,
      grainDensity: 1,
      grainWidth: 0.9,
      grainHeight: 0.9,
      grainChaos: 0.5,
      grainSpeed: 10,
      bubbles: true
    };

    const { disable, ...rest } = options;
    if (disable) {
      return () => { };
    }

    if (typeof window === 'undefined') {
      return () => { };
    }

    const disabledEnv = import.meta.env.VITE_DISABLE_GRAINED === 'true' || Boolean(window.__DISABLE_GRAINED);
    if (disabledEnv) {
      return () => { };
    }

    const finalOptions = { ...defaults, ...rest };
    const registry = (window.__grainedRegistry = window.__grainedRegistry || {});
    const key = JSON.stringify(finalOptions);

    const existing = registry[elementId];
    if (existing && existing.optionsKey === key && existing.applied) {
      return () => { };
    }

    const apply = () => {
      const element = document.getElementById(elementId);
      if (!element) {
        return () => { };
      }

      const entry = registry[elementId];
      if (entry && entry.optionsKey === key && entry.applied) {
        return entry.cleanup || (() => { });
      }

      const cleanup = applyGrain(element, finalOptions);
      registry[elementId] = { applied: true, optionsKey: key, cleanup };
      return cleanup;
    };

    let observer;
    let cleanupFn = () => { };

    const init = () => {
      const element = document.getElementById(elementId);
      if (!element) return;

      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              cleanupFn = apply();
              try { observer.disconnect(); } catch { }
              break;
            }
          }
        }, { root: null, rootMargin: '15%', threshold: 0 });
        observer.observe(element);
      } else {
        cleanupFn = apply();
      }
    };

    let timer;
    if (typeof window.requestIdleCallback === 'function') {
      timer = window.requestIdleCallback(init, { timeout: 200 });
    } else {
      timer = window.setTimeout(init, 20);
    }

    return () => {
      if (observer) {
        try { observer.disconnect(); } catch { }
      }
      if (timer) {
        try {
          window.cancelIdleCallback ? window.cancelIdleCallback(timer) : clearTimeout(timer);
        } catch { }
      }
      cleanupFn();
    };
  }, [elementId, JSON.stringify(options)]);
};
