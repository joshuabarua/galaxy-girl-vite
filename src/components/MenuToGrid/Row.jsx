import React from 'react';
import { getImageKitUrl } from '../../utils/imagekit';


export class Row {
  constructor(rowEl, previewItem) {
    this.DOM = {
      el: rowEl,
      images: [...rowEl.querySelectorAll('.cell__img')],
      title: rowEl.querySelector('.cell__title'),
      titleWrap: rowEl.querySelector('.cell__title-wrap'),
      imagesWrap: rowEl.querySelector('.cell__img-wrap')
    };
    
    this.previewItem = previewItem;
  }
}


const RowComponent = ({ data, index, onClick, isOpen }) => {
  return (
    <div 
      className="row"
      data-row-index={index}
      onClick={onClick}
      style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
    >
      <div className="row__content">
        <div className="cell cell--title">
          <div className="cell__title-wrap">
            <h3 className="cell__title" style={{ '--title-index': index }}>
              <span className="cell__title-inner cell__title-inner--base">{data.name}</span>
              <span className="cell__title-inner cell__title-inner--alt" aria-hidden="true">{data.name}</span>
            </h3>
          </div>
        </div>
        <div className="cell cell--image">
          <div className="cell__img-wrap">
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
      </div>
    </div>
  );
};

export default RowComponent;
