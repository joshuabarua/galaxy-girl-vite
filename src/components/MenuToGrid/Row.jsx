import React, { useRef, useEffect } from 'react';
import { getImageKitUrl } from '../../utils/imagekit';
import './styles.css';

/**
 * Row component for MenuToGrid animation
 * Displays a row of thumbnail images that animate on hover
 */
const Row = ({ data, index, onClick, isOpen }) => {
  const rowRef = useRef(null);
  const imagesWrapRef = useRef(null);
  const titleWrapRef = useRef(null);

  return (
    <div 
      ref={rowRef}
      className="row"
      data-row-index={index}
      onClick={onClick}
      style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
    >
      <div className="row__content">
        <div className="cell cell--image">
          <div ref={imagesWrapRef} className="cell__img-wrap">
            {data.images.slice(0, 5).map((img, idx) => {
              const url = img.thumb
                || (img.imagekitPath ? getImageKitUrl(img.imagekitPath, { width: 300, height: 300 }) : null)
                || img.src
                || '';
              return (
                <div 
                  key={idx} 
                  className="cell__img"
                  data-img-index={idx}
                  style={{ 
                    backgroundImage: url ? `url(${url})` : undefined,
                    '--img-index': idx
                  }}
                >
                  <div 
                    className="cell__img-inner"
                    style={{ 
                      backgroundImage: url ? `url(${url})` : undefined,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="cell cell--title">
          <div ref={titleWrapRef} className="cell__title-wrap">
            <h3 className="cell__title">
              <span className="cell__title-inner">{data.name}</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Row;
