const URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

function buildTransform({ width, height, crop = 'maintain_ratio', focus, quality = 'auto', format = 'auto' } = {}) {
  const parts = [];
  if (width) parts.push(`w-${width}`);
  if (height) parts.push(`h-${height}`);
  if (crop) parts.push(`c-${crop}`);
  if (focus) parts.push(`fo-${focus}`);
  if (quality) parts.push(`q-${quality}`);
  if (format) parts.push(`f-${format}`);
  return parts.length ? `tr=${parts.join(',')}` : '';
}

export const getImageKitUrl = (path, options = {}) => {
  if (!URL_ENDPOINT) {
    console.warn('VITE_IMAGEKIT_URL_ENDPOINT is not set');
  }
  const base = (URL_ENDPOINT || '').replace(/\/$/, '');
  const normalizedPath = (`/${path || ''}`).replace(/\/+/g, '/');
  const tr = buildTransform(options);
  return tr ? `${base}${normalizedPath}?${tr}` : `${base}${normalizedPath}`;
};

export const getImageKitSrcSet = (path, widths = [400, 800, 1200, 1600]) => {
  return widths
    .map((w) => `${getImageKitUrl(path, { width: w })} ${w}w`)
    .join(', ');
};
