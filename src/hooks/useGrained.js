import { applyGrain } from '../utils/grained';
import { useEffect } from 'react';

/**
 * Hook to apply grained.js effect to an element
 * @param {string} elementId 
 * @param {object} options 
 */
export const useGrained = (elementId, options = {}) => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!window.grained) {
      console.warn('Grained.js not loaded');
    }

    const baseOptions = {
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

    const isHighRes = window.innerWidth >= 1440;
    const defaultOptions = isHighRes
      ? {
          ...baseOptions,
          patternWidth: 80,
          patternHeight: 80,
          grainDensity: 1.4,
          grainOpacity: 0.11
        }
      : baseOptions;

    const finalOptions = { ...defaultOptions, ...options };

    const registry = (window.__grainedRegistry = window.__grainedRegistry || {});
    const selector = `#${elementId}`;
    const optionsKey = JSON.stringify(finalOptions);

    const existing = registry[elementId];
    if (existing && existing.optionsKey === optionsKey && existing.applied) {
      return () => {};
    }

    const apply = () => {
      const element = document.getElementById(elementId);
      if (!element) {
        return () => {};
      }

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

      const cleanup = applyGrain(element, finalOptions);
      registry[elementId] = { applied: true, optionsKey, cleanup };
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
      const entry = registry[elementId];
      if (entry) {
        entry.applied = false;
        entry.cleanup = undefined;
      }
    };
  }, [elementId, JSON.stringify(options)]);
};
