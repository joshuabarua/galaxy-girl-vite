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

export const preloadFonts = () => {
  return document.fonts.ready;
};
