import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import { getImageKitUrl } from '../../utils/imagekit';

const Preview = forwardRef(({ data, index, isActive }, ref) => {
  const previewRef = useRef(null);
  const gridRef = useRef(null);
  const titleRef = useRef(null);

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
      className={`preview__item ${isActive ? 'preview__item--current' : ''}`}
      data-preview-index={index}
    >
      <div className="preview__item-content">
        <div className="preview__item-header">
          <h2 ref={titleRef} className="preview__item-title">
            <span className="preview__item-title-inner">{data.name}</span>
          </h2>
        </div>
        <div ref={gridRef} className="preview__item-grid grid">
          {data.images.slice(5).map((img, idx) => {
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
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;
