/**
 * ImageKit utility functions for image optimization and delivery
 */

const URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

/**
 * Build an ImageKit transformation string
 * Docs: https://imagekit.io/docs/url-transformation
 */
function buildTransform({ width, height, crop = 'maintain_ratio', quality = 'auto', format = 'auto' } = {}) {
  const parts = [];
  if (width) parts.push(`w-${width}`);
  if (height) parts.push(`h-${height}`);
  if (crop) parts.push(`c-${crop}`);
  if (quality) parts.push(`q-${quality}`);
  if (format) parts.push(`f-${format}`);
  return parts.length ? `tr=${parts.join(',')}` : '';
}

/**
 * Generate ImageKit URL with transformations
 * @param {string} path - Path of the asset in ImageKit (e.g., "portfolio/beauty/image1.jpg")
 * @param {object} options - Transformation options
 * @returns {string}
 */
export const getImageKitUrl = (path, options = {}) => {
  if (!URL_ENDPOINT) {
    console.warn('VITE_IMAGEKIT_URL_ENDPOINT is not set');
  }
  // Normalize slashes and ensure we don't double up
  const base = (URL_ENDPOINT || '').replace(/\/$/, '');
  const normalizedPath = (`/${path || ''}`).replace(/\/+/g, '/');
  const tr = buildTransform(options);
  return tr ? `${base}${normalizedPath}?${tr}` : `${base}${normalizedPath}`;
};

/**
 * Generate responsive srcset string
 */
export const getImageKitSrcSet = (path, widths = [400, 800, 1200, 1600]) => {
  return widths.map(w => `${getImageKitUrl(path, { width: w })} ${w}w`).join(', ');
};
