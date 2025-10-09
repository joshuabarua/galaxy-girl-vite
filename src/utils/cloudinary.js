/**
 * Cloudinary utility functions for image optimization and delivery
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

/**
 * Generate Cloudinary URL with transformations
 * @param {string} publicId - The public ID of the image in Cloudinary
 * @param {object} options - Transformation options
 * @returns {string} - Optimized Cloudinary URL
 */
export const getCloudinaryUrl = (publicId, options = {}) => {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
  } = options;

  const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  
  const transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (gravity) transformations.push(`g_${gravity}`);
  
  const transformString = transformations.join(',');
  
  return `${baseUrl}/${transformString}/${publicId}`;
};

/**
 * Generate responsive image URLs for srcset
 * @param {string} publicId - The public ID of the image in Cloudinary
 * @param {array} widths - Array of widths for responsive images
 * @returns {string} - srcset string
 */
export const getResponsiveSrcSet = (publicId, widths = [400, 800, 1200, 1600]) => {
  return widths
    .map(width => `${getCloudinaryUrl(publicId, { width })} ${width}w`)
    .join(', ');
};

/**
 * Preload images
 * @param {string} selector - CSS selector for images to preload
 * @returns {Promise} - Promise that resolves when all images are loaded
 */
export const preloadImages = (selector = 'img') => {
  return new Promise((resolve) => {
    const images = [...document.querySelectorAll(selector)];
    let loadedCount = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      resolve();
      return;
    }

    const imageLoaded = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        resolve();
      }
    };

    images.forEach(img => {
      if (img.complete) {
        imageLoaded();
      } else {
        img.addEventListener('load', imageLoaded);
        img.addEventListener('error', imageLoaded);
      }
    });
  });
};

/**
 * Preload fonts
 * @param {string} fontId - Font ID to preload
 * @returns {Promise} - Promise that resolves when fonts are loaded
 */
export const preloadFonts = (fontId) => {
  return document.fonts.ready;
};
