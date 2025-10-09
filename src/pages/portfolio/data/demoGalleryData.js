/**
 * Demo gallery data with Cloudinary demo images
 * Use this to test the MenuToGrid animation before uploading your own images
 * 
 * These use Cloudinary's public demo images, so they'll work immediately
 * Replace with your own cloudinaryGalleryData.js when ready
 */

export const demoGalleries = [
  {
    id: 1,
    name: "Beauty and Editorial",
    images: [
      {
        id: 1001,
        // Using Cloudinary demo images - replace with your own
        cloudinaryId: "demo/woman-portrait",
        width: 1600,
        height: 2400,
        alt: "Beauty Editorial Photo 1",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 1002,
        cloudinaryId: "demo/woman-portrait-2",
        width: 1600,
        height: 2400,
        alt: "Beauty Editorial Photo 2",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 1003,
        cloudinaryId: "demo/fashion-model",
        width: 1600,
        height: 2400,
        alt: "Beauty Editorial Photo 3",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 1004,
        cloudinaryId: "demo/makeup-portrait",
        width: 1600,
        height: 2400,
        alt: "Beauty Editorial Photo 4",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 1005,
        cloudinaryId: "demo/beauty-shot",
        width: 1600,
        height: 2400,
        alt: "Beauty Editorial Photo 5",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 1006,
        cloudinaryId: "demo/editorial-1",
        width: 1600,
        height: 2400,
        alt: "Beauty Editorial Photo 6",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 1007,
        cloudinaryId: "demo/editorial-2",
        width: 1600,
        height: 2400,
        alt: "Beauty Editorial Photo 7",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 1008,
        cloudinaryId: "demo/editorial-3",
        width: 1600,
        height: 2400,
        alt: "Beauty Editorial Photo 8",
        caption: "Demo Image - Replace with your own"
      }
    ]
  },
  {
    id: 2,
    name: "SFX Makeup",
    images: [
      {
        id: 2001,
        cloudinaryId: "demo/sfx-1",
        width: 1228,
        height: 1864,
        alt: "SFX Makeup 1",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 2002,
        cloudinaryId: "demo/sfx-2",
        width: 1228,
        height: 1864,
        alt: "SFX Makeup 2",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 2003,
        cloudinaryId: "demo/sfx-3",
        width: 1228,
        height: 1864,
        alt: "SFX Makeup 3",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 2004,
        cloudinaryId: "demo/sfx-4",
        width: 1228,
        height: 1864,
        alt: "SFX Makeup 4",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 2005,
        cloudinaryId: "demo/sfx-5",
        width: 1228,
        height: 1864,
        alt: "SFX Makeup 5",
        caption: "Demo Image - Replace with your own"
      }
    ]
  },
  {
    id: 3,
    name: "Body Paint",
    images: [
      {
        id: 3001,
        cloudinaryId: "demo/bodypaint-1",
        width: 667,
        height: 1000,
        alt: "Body Paint 1",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 3002,
        cloudinaryId: "demo/bodypaint-2",
        width: 667,
        height: 1000,
        alt: "Body Paint 2",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 3003,
        cloudinaryId: "demo/bodypaint-3",
        width: 667,
        height: 1000,
        alt: "Body Paint 3",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 3004,
        cloudinaryId: "demo/bodypaint-4",
        width: 667,
        height: 1000,
        alt: "Body Paint 4",
        caption: "Demo Image - Replace with your own"
      }
    ]
  },
  {
    id: 4,
    name: "Theatrical",
    images: [
      {
        id: 4001,
        cloudinaryId: "demo/theatrical-1",
        width: 1590,
        height: 1999,
        alt: "Theatrical Makeup 1",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 4002,
        cloudinaryId: "demo/theatrical-2",
        width: 1590,
        height: 1999,
        alt: "Theatrical Makeup 2",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 4003,
        cloudinaryId: "demo/theatrical-3",
        width: 1590,
        height: 1999,
        alt: "Theatrical Makeup 3",
        caption: "Demo Image - Replace with your own"
      },
      {
        id: 4004,
        cloudinaryId: "demo/theatrical-4",
        width: 1590,
        height: 1999,
        alt: "Theatrical Makeup 4",
        caption: "Demo Image - Replace with your own"
      }
    ]
  }
];

/**
 * Helper function to switch between demo and real data
 */
export const useGalleryData = (useDemo = false) => {
  if (useDemo) {
    return demoGalleries;
  }
  
  // Import your real data here
  try {
    const { cloudinaryGalleries } = require('./cloudinaryGalleryData');
    return cloudinaryGalleries;
  } catch (error) {
    console.warn('Could not load cloudinaryGalleryData, using demo data');
    return demoGalleries;
  }
};
