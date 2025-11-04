import { useEffect } from 'react';

/**
 * Hook to apply grained.js effect to an element
 * @param {string} elementId - ID of the element to apply grain to
 * @param {object} options - Grained options
 */
export const useGrained = (elementId, options = {}) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.grained) {
      console.warn('Grained.js not loaded');
      return;
    }

    const defaultOptions = {
      animate: true,
      patternWidth: 100,
      patternHeight: 100,
      grainOpacity: 0.09,
      grainDensity: 1,
      grainWidth: 1,
      grainHeight: 1,
      grainChaos: 0.5,
      grainSpeed: 10
    };

    const finalOptions = { ...defaultOptions, ...options };

    // Global registry to prevent duplicate initializations per elementId
    const registry = (window.__grainedRegistry = window.__grainedRegistry || {});
    const selector = `#${elementId}`;
    const optionsKey = JSON.stringify(finalOptions);

    // Bail early if already applied with same options
    const existing = registry[elementId];
    if (existing && existing.optionsKey === optionsKey && existing.applied) {
      return () => {};
    }

    let observer;
    const apply = () => {
      const entry = registry[elementId];
      if (entry && entry.optionsKey === optionsKey && entry.applied) {
        return; // already applied with same options
      }
      try {
        window.grained(selector, finalOptions);
        registry[elementId] = { applied: true, optionsKey };
        // Counters
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
      // Lazy init when visible
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              apply();
              try { observer.disconnect(); } catch {}
              break;
            }
          }
        }, { root: null, rootMargin: '15%', threshold: 0 });
        observer.observe(element);
      } else {
        apply();
      }
    };

    // Small delay or idle callback to ensure element is rendered
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
        try { observer.disconnect(); } catch {}
      }
      if (timer) {
        try { window.cancelIdleCallback ? window.cancelIdleCallback(timer) : clearTimeout(timer); } catch {}
      }
    };
  }, [elementId, JSON.stringify(options)]);
};
