import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect, useCallback } from 'react';
import { getImageKitUrl } from '../../utils/imagekit';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const Preview = forwardRef(({ data, index, isActive, onLoadMore, onClose, previewCount = 4 }, ref) => {
  const previewRef = useRef(null);
  const gridRef = useRef(null);
  const titleRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (isActive) {
      const initial = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 40 : 20;
      setVisibleCount(initial);
    }
  }, [isActive]);

  // Close lightbox if the preview panel closes
  useEffect(() => {
    if (!isActive) setLightboxOpen(false);
  }, [isActive]);

  const openLightbox = useCallback((idx) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  }, []);

  // Handle click outside images to close preview panel
  const handleBackgroundClick = useCallback((e) => {
    if (lightboxOpen) return; // don't close preview while lightbox is open
    const isImage = e.target.closest('.preview__item-img') ||
                    e.target.closest('.cell__img') ||
                    e.target.closest('.preview__load-more');
    if (!isImage && onClose) {
      onClose();
    }
  }, [onClose, lightboxOpen]);

  useImperativeHandle(ref, () => ({
    DOM: {
      el: previewRef.current,
      grid: gridRef.current,
      title: titleRef.current,
      get images() {
        return [...(gridRef.current?.querySelectorAll('.preview__item-img') || [])];
      }
    }
  }), []);

  // Build full-res slides for the lightbox
  const slides = data.images.map((img) => ({
    src: img.src || (img.imagekitPath ? getImageKitUrl(img.imagekitPath, { width: 2400 }) : ''),
    alt: img.alt || data.name,
    width: img.width || 1600,
    height: img.height || 2400,
  }));

  return (
    <div
      ref={previewRef}
      id={`preview-item-${index}`}
      className={`preview__item ${isActive ? 'preview__item--current' : ''}`}
      data-preview-index={index}
      onClick={isActive ? handleBackgroundClick : undefined}
    >
      <div className="preview__item-content">
        <div className="preview__item-header">
          <h2 ref={titleRef} className="preview__item-title">
            <span className="preview__item-title-inner">{data.name}</span>
          </h2>
        </div>
		<div ref={gridRef} className="preview__item-grid">
          {data.images.slice(0, visibleCount).map((img, idx) => {
            const url = img.src
              || (img.imagekitPath ? getImageKitUrl(img.imagekitPath, { width: 1000, crop: 'maintain_ratio' }) : null)
              || '';
            return (
              <div
                key={idx}
                className="preview__item-img"
                data-img-index={idx}
                data-flip-id={`${data.slug}-img-${idx}`}
                style={{ cursor: 'zoom-in' }}
                onClick={(e) => { e.stopPropagation(); openLightbox(idx); }}
                role="button"
                tabIndex={isActive ? 0 : -1}
                aria-label={`View photo ${idx + 1} of ${data.name} fullscreen`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); openLightbox(idx); } }}
              >
                <div
                  className="preview__item-img-inner"
                  style={{
                    backgroundImage: url ? `url(${url})` : undefined,
                  }}
                />
              </div>
            );
          })}
        </div>
        {data.images.length > visibleCount && (
          <button
            type="button"
            className="preview__load-more"
            onClick={async () => {
              if (typeof onLoadMore === 'function') {
                try { await onLoadMore(index, visibleCount); } catch { }
              }
              setVisibleCount(prev => prev + 24);
            }}
          >
            Load more
          </button>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Zoom, Thumbnails]}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        thumbnails={{ position: 'bottom', width: 80, height: 60, gap: 8, border: 1, borderRadius: 2, padding: 2 }}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.95)' } }}
      />
    </div>
  );
});

Preview.displayName = 'Preview';

export default React.memo(Preview);
