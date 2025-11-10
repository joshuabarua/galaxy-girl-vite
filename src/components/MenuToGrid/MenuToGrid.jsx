import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { preloadImages, preloadFonts } from '../../utils/media';
import { getImageKitUrl } from '../../utils/imagekit';
import { Row } from './Row';
import Preview from './Preview';
import './MenuToGrid.css';

gsap.registerPlugin(Flip);

const MenuToGrid = ({ galleries }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [galleriesState, setGalleriesState] = useState(Array.isArray(galleries) ? galleries : []);
  const [activeIndex, setActiveIndex] = useState(-1);
  const coverRef = useRef(null);
  const closeCtrlRef = useRef(null);
  const rowRefs = useRef([]);
  const previewRefs = useRef([]);
  
  const isOpenRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const currentRowRef = useRef(-1);
  const rowsArrRef = useRef([]);
  const mouseenterTimelineRef = useRef(null);
  const prefetchedRef = useRef(new Set());

  const handleLoadMore = useCallback(async (index, currentCount) => {
    try {
      const g = galleriesState[index];
      if (!g || !Array.isArray(g.images) || g.images.length === 0) return;
      const first = g.images[0];
      const folderSlug = (first?.imagekitPath || '').split('/')[0] || '';
      if (!folderSlug) return;
      const folder = `/${folderSlug}`;
      const limit = 20;
      const skip = currentCount;
      const params = new URLSearchParams({ folder, limit: String(limit), skip: String(skip) });
      const resp = await fetch(`/api/images?${params.toString()}`);
      if (!resp.ok) return;
      const json = await resp.json();
      const files = Array.isArray(json?.files) ? json.files : [];
      if (!files.length) return;

      setGalleriesState(prev => {
        const next = [...prev];
        const gi = { ...next[index] };
        const existing = new Set((gi.images || []).map(it => it.imagekitPath || it.src || it.id));
        const additions = files
          .filter(f => {
            const key = f.imagekitPath || f.src || f.id;
            return key && !existing.has(key);
          })
          .map(f => ({
            imagekitPath: f.imagekitPath || '',
            width: f.width,
            height: f.height,
            src: f.src,
            thumb: f.thumb,
            id: f.id || f.imagekitPath,
          }));
        gi.images = [...(gi.images || []), ...additions];
        next[index] = gi;
        return next;
      });
    } catch (e) {
    }
  }, [galleriesState]);

  useEffect(() => {
    initializeMenuToGrid();
    Promise.all([
      preloadImages('.cell__img-inner'),
      preloadFonts('gdf6msi')
    ]).then(() => {
      setIsLoading(false);
      document.body.classList.remove('loading');
      document.body.classList.add('js');
    });
  }, []);

  const initializeMenuToGrid = () => {
    const tryInitialize = (attempts = 0) => {
      const allRefsReady = rowRefs.current.length > 0 && 
                          previewRefs.current.length > 0 &&
                          rowRefs.current.every(ref => ref !== null) &&
                          previewRefs.current.every(ref => ref !== null && ref.DOM);
      
      if (!allRefsReady && attempts < 10) {
        setTimeout(() => tryInitialize(attempts + 1), 100);
        return;
      }
      
      const rowsArr = [];
      rowRefs.current.forEach((rowEl, position) => {
        const previewRef = previewRefs.current[position];
        
        if (rowEl && previewRef && previewRef.DOM) {
          const rowDom = rowEl.querySelector('.row');
          const previewItem = previewRef;
          const rowInstance = new Row(rowDom, previewItem);
          rowsArr.push(rowInstance);
        }
      });
      
      rowsArrRef.current = rowsArr;
    };

    setTimeout(() => tryInitialize(), 100);
  };

  const handleRowClick = useCallback((index) => {
    if (isAnimatingRef.current) return;
    if (!rowsArrRef.current || rowsArrRef.current.length === 0) {
      initializeMenuToGrid();
      setTimeout(() => handleRowClick(index), 300);
      return;
    }
    
    isAnimatingRef.current = true;
    isOpenRef.current = true;
    currentRowRef.current = index;
    setActiveIndex(index);
    
    const row = rowsArrRef.current[index];
    if (!row) {
      isAnimatingRef.current = false;
      return;
    }
    
    const cover = coverRef.current;
    const closeCtrl = closeCtrlRef.current;
    const body = document.body;

    const titleTargets = rowsArrRef.current
      .map(r => r?.DOM?.title)
      .filter(Boolean);
    gsap.killTweensOf([cover, ...titleTargets]);

    const previewTitle = row.previewItem?.DOM?.title || null;
    const rowImagesOpen = Array.isArray(row.DOM.images) ? row.DOM.images.filter(Boolean) : [];
    const previewImagesOpen = Array.from(row.previewItem?.DOM?.images || []);
    const imageTargetsOpen = [...rowImagesOpen, ...previewImagesOpen];

    gsap.timeline({
      onStart: () => {
        body.classList.add('oh');
        row.DOM.el.classList.add('row--current');
        row.previewItem.DOM.el.classList.add('preview__item--current');

        gsap.set(row.previewItem.DOM.images, {opacity: 0});
        gsap.set(cover, {
          height: row.DOM.el.offsetHeight - 1,
          top: row.DOM.el.getBoundingClientRect()['top'],
          opacity: 1,
          position: 'fixed',
          left: 0,
          width: '100%'
        });
        const csCover = cover ? getComputedStyle(cover) : null;
        const rto = document.querySelector('.route-transition-overlay');
        if (rto) {
          const csRto = getComputedStyle(rto);
        }
        
        if (previewTitle) {
          gsap.set(previewTitle, {
          yPercent: -100,
          rotation: 15,
          transformOrigin: '100% 50%',
          opacity: 0
          });
        }

        closeCtrl.classList.add('preview__close--show');
      },
      onComplete: () => isAnimatingRef.current = false
    })
    .addLabel('start', 0)
    .to(cover, {
      duration: 0.6,
      ease: 'power4.inOut',
      height: window.innerHeight,
      top: 0
    }, 'start')
    .to(titleTargets, {
      duration: 0.4,
      ease: 'power4.inOut',
      yPercent: (_, target) => {
        return target.getBoundingClientRect()['top'] > row.DOM.el.getBoundingClientRect()['top'] ? 100 : -100;
      },
      rotation: 0
    }, 'start')
    .add(() => {
      mouseenterTimelineRef.current?.progress(1, false);
      const rowImages = rowImagesOpen;
      const flipstate = Flip.getState(rowImages, { simple: true });
      if (row.previewItem?.DOM?.grid && rowImages.length) {
        row.previewItem.DOM.grid.prepend(...rowImages);
      }
      const tlInner = gsap.timeline();
      tlInner.add(Flip.from(flipstate, {
        duration: 0.5,
        ease: 'power4.inOut',
        stagger: 0.02,
      }));
      const previewImages = previewImagesOpen;
      if (previewImages.length) {
        tlInner.to(previewImages, {
          duration: 0.5,
          ease: 'power4.inOut',
          startAt: { scale: 0, yPercent: () => gsap.utils.random(0, 200) },
          scale: 1,
          opacity: 1,
          yPercent: 0,
          stagger: 0.02
        }, 0.03 * (rowImages.length || 0));
      }
    }, 'start')
    .to(previewTitle ? previewTitle : [], {
      duration: 0.7,
      ease: 'power4.inOut',
      yPercent: 0,
      rotation: 0,
      opacity: 1,
      onComplete: () => row.DOM.titleWrap.classList.remove('cell__title--switch')
    }, 'start')
    .to(closeCtrl, {
      duration: 0.8,
      ease: 'power4.inOut',
      opacity: 1
    }, 'start');
  }, []);

  const handleMouseEnter = useCallback((index) => {
    try {
      if (!prefetchedRef.current.has(index)) {
        const currentCount = (galleriesState[index]?.images?.length || 0) - 5;
        handleLoadMore(index, Math.max(0, currentCount));
        prefetchedRef.current.add(index);
      }
    } catch {}
    
    if (isOpenRef.current) return;
    
    const row = rowsArrRef.current[index];
    if (!row) return;
    
    gsap.killTweensOf([row.DOM.images, row.DOM.title]);
    
    mouseenterTimelineRef.current = gsap.timeline()
      .addLabel('start', 0)
      .to(row.DOM.images, {
        duration: 0.25,
        ease: 'power4.out',
        startAt: {
          scale: 0.8, 
          xPercent: 20
        },
        scale: 1,
        xPercent: 0,
        opacity: 1,
        stagger: -0.035
      }, 'start')
      .to(row.DOM.titleWrap, {
        duration: 0.2,
        ease: 'power2.out',
        paddingLeft: 6
      }, 'start')
      .set(row.DOM.title, {transformOrigin: '0% 50%'}, 'start')
      .to(row.DOM.title, {
        duration: 0.2,
        ease: 'power2.in',
        yPercent: -50,
        onComplete: () => row.DOM.titleWrap.classList.add('cell__title--switch')
      }, 'start')
      .to(row.DOM.title, {
        duration: 0.35,
        ease: 'power4.out',
        startAt: {
          yPercent: 50, 
          rotation: 5
        },
        yPercent: 0,
        rotation: 0
      }, 'start+=0.3');
  }, [galleriesState, handleLoadMore]);

  const handleMouseLeave = useCallback((index) => {
    if (isOpenRef.current) return;
    
    const row = rowsArrRef.current[index];
    if (!row) return;
    
    gsap.killTweensOf([row.DOM.images, row.DOM.title]);
    
    gsap.timeline()
      .addLabel('start')
      .to(row.DOM.images, {
        duration: 0.25,
        ease: 'power4.in',
        opacity: 0,
        scale: 0.8
      }, 'start')
      .to(row.DOM.titleWrap, {
        duration: 0.2,
        ease: 'power2.out',
        paddingLeft: 0
      }, 'start')
      .to(row.DOM.title, {
        duration: 0.2,
        ease: 'power2.in',
        yPercent: -50,
        onComplete: () => row.DOM.titleWrap.classList.remove('cell__title--switch')
      }, 'start')
      .to(row.DOM.title, {
        duration: 0.35,
        ease: 'power4.out',
        startAt: {
          yPercent: 50, 
          rotation: 5
        },
        yPercent: 0,
        rotation: 0
      }, 'start+=0.3');
  }, []);

  const handleCloseClick = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    isOpenRef.current = false;
    
    const currentRow = currentRowRef.current;
    const row = rowsArrRef.current[currentRow];
    if (!row) return;
    
    const previewTitleClose = row.previewItem?.DOM?.title || null;
    const rowImagesClose = Array.isArray(row.DOM.images) ? row.DOM.images.filter(Boolean) : [];
    const previewImagesClose = Array.from(row.previewItem?.DOM?.images || []);
    const imageTargetsClose = [...rowImagesClose, ...previewImagesClose];
    const titleTargetsClose = rowsArrRef.current.map(r => r?.DOM?.title).filter(Boolean);
    
    const cover = coverRef.current;
    const closeCtrl = closeCtrlRef.current;
    const body = document.body;
    
    const rowRect = row.DOM.el.getBoundingClientRect();

    gsap.timeline({
      defaults: {duration: 0.5, ease: 'power4.inOut'},
      onStart: () => {
        closeCtrl.classList.remove('preview__close--show');
        if (cover) {
          gsap.set(cover, {
            position: 'fixed',
            left: 0,
            width: '100%',
            height: window.innerHeight,
            top: 0,
            opacity: 1,
            zIndex: 150
          });
        }
      },
      onComplete: () => {
        row.DOM.el.classList.remove('row--current');
        row.previewItem.DOM.el.classList.remove('preview__item--current');
        body.classList.remove('oh');
        isAnimatingRef.current = false;
        setActiveIndex(-1);
      }
    })
    .addLabel('start', 0)
    .to(closeCtrl ? closeCtrl : [], {
      duration: 0.3,
      opacity: 0
    }, 'start')
    .to(previewTitleClose ? previewTitleClose : [], {
      duration: 0.3,
      ease: 'power3.in',
      yPercent: 100,
      opacity: 0
    }, 'start')
    .to(imageTargetsClose, {
      duration: 0.3,
      ease: 'power3.in',
      scale: 0,
      opacity: 0,
      stagger: 0.02,
      onComplete: () => row.DOM.imagesWrap.prepend(...row.DOM.images)
    }, 'start+=0.2')
    .to(cover ? cover : [], {
      duration: 1.1,
      ease: 'power4.inOut',
      height: Math.max(0, row.DOM.el.offsetHeight - 1),
      top: rowRect.top
    }, 'start')
    .to(cover ? cover : [], {
      duration: 0.2,
      opacity: 0
    }, 'start+=0.9')
    .to(titleTargetsClose, {
      yPercent: 0,
      stagger: {
        each: 0.03,
        grid: 'auto',
        from: currentRow
      }
    }, 'start+=0.4');
  };

  return (
    <div className="menu-to-grid">
      {isLoading && (
        <div className="loading"></div>
      )}
      
      <div className="content">
        <div className="rows">
          {galleriesState.map((gallery, index) => (
            <div key={index} ref={el => rowRefs.current[index] = el}>
              <div id={`row-${index}`} className="row" data-row-index={index} 
       onClick={(e) => handleRowClick(Number(e.currentTarget.dataset.rowIndex))}
       onMouseEnter={(e) => handleMouseEnter(Number(e.currentTarget.dataset.rowIndex))}
       onMouseLeave={(e) => handleMouseLeave(Number(e.currentTarget.dataset.rowIndex))}>
                <div className="cell cell--title">
                  <div className="cell__title-wrap">
                    <h3 className="cell__title" style={{ '--title-index': index }}>
                      <span className="cell__title-inner cell__title-inner--base">{gallery.name}</span>
                      <span className="cell__title-inner cell__title-inner--alt" aria-hidden="true">{gallery.name}</span>
                    </h3>
                  </div>
                </div>
                <div className="cell cell--image">
                  <div className="cell__img-wrap">
                    {gallery.images.slice(0, 5).map((img, idx) => {
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
          ))}
        </div>
      </div>

      <div className="preview">
        {galleriesState.map((gallery, index) => (
          <Preview 
            key={index}
            ref={el => previewRefs.current[index] = el}
            data={gallery}
            index={index}
            isActive={activeIndex === index}
            onLoadMore={handleLoadMore}
          />
        ))}
      </div>

      <div ref={coverRef} id="menu-to-grid-cover" className="cover"></div>
      
      <div ref={closeCtrlRef} className="preview__close">
        <button className="preview__close-button" onClick={handleCloseClick}>×</button>
      </div>
    </div>
  );
};

export default MenuToGrid;
