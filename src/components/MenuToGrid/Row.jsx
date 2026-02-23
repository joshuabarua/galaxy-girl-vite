import React from 'react';
import { gsap } from 'gsap';
import { getImageKitUrl } from '../../utils/imagekit';

export class Row {
  constructor(rowEl, previewItem) {
    this.DOM = {
      el: rowEl,
      images: [...rowEl.querySelectorAll('.cell__img')],
      title: rowEl.querySelector('.cell__title'),
      titleWrap: rowEl.querySelector('.cell__title-wrap'),
      imagesWrap: rowEl.querySelector('.cell__img-wrap'),
      actionBtn: rowEl.querySelector('.cell--action')
    };

    this.previewItem = previewItem;
    this.mouseenterTimeline = null;
  }

  hoverIn() {
    gsap.killTweensOf([this.DOM.title, this.DOM.actionBtn]);

    this.mouseenterTimeline = gsap.timeline()
      .addLabel('start', 0)
      .to(this.DOM.titleWrap, {
        duration: 0.2,
        ease: 'power2.out',
        paddingLeft: 6
      }, 'start')
      .to(this.DOM.actionBtn, {
        duration: 0.25,
        ease: 'power2.out',
        x: 4
      }, 'start')
      .set(this.DOM.title, { transformOrigin: '0% 50%' }, 'start')
      .to(this.DOM.title, {
        duration: 0.2,
        ease: 'power2.in',
        yPercent: -50,
        onComplete: () => this.DOM.titleWrap.classList.add('cell__title--switch')
      }, 'start')
      .to(this.DOM.title, {
        duration: 0.35,
        ease: 'power4.out',
        startAt: {
          yPercent: 50,
          rotation: 5
        },
        yPercent: 0,
        rotation: 0
      }, 'start+=0.3');
  }

  hoverOut() {
    gsap.killTweensOf([this.DOM.title, this.DOM.actionBtn]);

    gsap.timeline()
      .addLabel('start')
      .to(this.DOM.titleWrap, {
        duration: 0.2,
        ease: 'power2.out',
        paddingLeft: 0
      }, 'start')
      .to(this.DOM.actionBtn, {
        duration: 0.2,
        ease: 'power2.out',
        x: 0
      }, 'start')
      .to(this.DOM.title, {
        duration: 0.2,
        ease: 'power2.in',
        yPercent: -50,
        onComplete: () => this.DOM.titleWrap.classList.remove('cell__title--switch')
      }, 'start')
      .to(this.DOM.title, {
        duration: 0.35,
        ease: 'power4.out',
        startAt: {
          yPercent: 50,
          rotation: 5
        },
        yPercent: 0,
        rotation: 0
      }, 'start+=0.3');
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
      <div className="cell cell--action" aria-hidden="true">
        <span className="cell__action-text">View Gallery</span>
        <svg
          className="cell__action-arrow"
          width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export default RowComponent;
