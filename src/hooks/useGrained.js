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

    // Small delay to ensure element is rendered
    const timer = setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        try {
          window.grained(`#${elementId}`, finalOptions);
        } catch (e) {
          console.error('Grained error:', e);
        }
      }
    }, 20);

    return () => clearTimeout(timer);
  }, [elementId, JSON.stringify(options)]);
};
