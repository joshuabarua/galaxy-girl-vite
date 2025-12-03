import React, { forwardRef, useRef, useImperativeHandle, useState, useEffect, useCallback } from 'react';
import { getImageKitUrl } from '../../utils/imagekit';

const Preview = forwardRef(({ data, index, isActive, onLoadMore, onClose }, ref) => {
  const previewRef = useRef(null);
  const gridRef = useRef(null);
  const titleRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    if (isActive) {
      const initial = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 40 : 20;
      setVisibleCount(initial);
    }
  }, [isActive]);

  // Handle click outside images to close
  const handleBackgroundClick = useCallback((e) => {
    // Check if click is on an image or the load more button
    const isImage = e.target.closest('.preview__item-img') || 
                    e.target.closest('.cell__img') ||
                    e.target.closest('.preview__load-more');
    
    if (!isImage && onClose) {
      onClose();
    }
  }, [onClose]);

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
        <div ref={gridRef} className="preview__item-grid grid">
          {data.images.slice(5, visibleCount).map((img, idx) => {
            const url = img.src
              || (img.imagekitPath ? getImageKitUrl(img.imagekitPath, { width: 600, height: 600 }) : null)
              || '';
            return (
              <div 
                key={idx} 
                className="preview__item-img"
                data-img-index={idx}
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
                try { await onLoadMore(index, visibleCount); } catch {}
              }
              setVisibleCount(prev => prev + 24);
            }}
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default React.memo(Preview);
