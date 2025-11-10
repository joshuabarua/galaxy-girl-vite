import { useEffect } from 'react';

export const useGrained = (elementId, options = {}) => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const defaultOptions = {
      animate: true,
      patternWidth: 100,
      patternHeight: 100,
      grainOpacity: 0.09,
      grainDensity: 1,
      grainWidth: 0.7,
      grainHeight: 0.7,
      grainChaos: 0.5,
      grainSpeed: 10,
      bubbles: true
    };

    const { disable, ...restOptions } = options;
    const disabled = disable || import.meta.env.VITE_DISABLE_GRAINED === 'true' || Boolean(window.__DISABLE_GRAINED);

    if (disabled) {
      return;
    }

    if (!window.grained) {
      console.warn('Grained.js not loaded');
      return;
    }

    const finalOptions = { ...defaultOptions, ...restOptions };

    const registry = (window.__grainedRegistry = window.__grainedRegistry || {});
    const selector = `#${elementId}`;
    const optionsKey = JSON.stringify(finalOptions);

    const existing = registry[elementId];
    if (existing && existing.optionsKey === optionsKey && existing.applied) {
      return () => { };
    }

    let observer;
    const apply = () => {
      const entry = registry[elementId];
      if (entry && entry.optionsKey === optionsKey && entry.applied) {
        return;
      }
      try {
        window.grained(selector, finalOptions);
        registry[elementId] = { applied: true, optionsKey };
        window.__grainedCalls = (window.__grainedCalls || 0) + 1;
        const set = (window.__grainedTargets = window.__grainedTargets || new Set());
        set.add(elementId);
        if (!window.getGrainedCounts) {
          window.getGrainedCounts = () => ({
            calls: window.__grainedCalls || 0,
            targets: Array.from(window.__grainedTargets || [])
          });
        }
      } catch (e) {
        console.error('Grained error:', e);
      }
    };

    const init = () => {
      const element = document.getElementById(elementId);
      if (!element) return;
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              apply();
              try { observer.disconnect(); } catch { }
              break;
            }
          }
        }, { root: null, rootMargin: '15%', threshold: 0 });
        observer.observe(element);
      } else {
        apply();
      }
    };

    let timer;
    const schedule = () => {
      if ('requestIdleCallback' in window) {
        timer = window.requestIdleCallback(init, { timeout: 200 });
      } else {
        timer = setTimeout(init, 20);
      }
    };
    schedule();

    return () => {
      if (observer) {
        try { observer.disconnect(); } catch { }
      }
      if (timer) {
        try { window.cancelIdleCallback ? window.cancelIdleCallback(timer) : clearTimeout(timer); } catch { }
      }
    };
  }, [elementId, JSON.stringify(options)]);
};
