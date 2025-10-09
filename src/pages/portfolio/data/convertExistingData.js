/**
 * Helper script to convert existing gallery data to Cloudinary format
 * This helps migrate from local images to Cloudinary-hosted images
 * 
 * Usage: Run this in browser console or as a Node script to generate
 * the new data structure
 */

import { gallery } from './galleryImgData';

/**
 * Convert existing gallery data to Cloudinary format
 * You'll need to manually update the cloudinaryId values after upload
 */
export function convertToCloudinaryFormat() {
  const galleries = Object.values(gallery[0]);
  
  const cloudinaryGalleries = galleries.map((galleryGroup, groupIndex) => {
    return {
      id: groupIndex + 1,
      name: galleryGroup.name,
      images: galleryGroup.images.map((img, imgIndex) => {
        // Extract filename from src if possible
        const filename = img.src ? img.src.split('/').pop().split('.')[0] : `image${imgIndex + 1}`;
        
        return {
          id: img.id || (groupIndex + 1) * 1000 + imgIndex + 1,
          cloudinaryId: `portfolio/${galleryGroup.name.toLowerCase().replace(/\s+/g, '_')}/${filename}`,
          width: img.width || 1600,
          height: img.height || 2400,
          alt: `${galleryGroup.name} - Image ${imgIndex + 1}`,
          caption: img.subHtml ? extractCaption(img.subHtml) : "",
          // Keep original for reference during migration
          originalSrc: img.src,
          originalThumb: img.thumb
        };
      })
    };
  });
  
  return cloudinaryGalleries;
}

/**
 * Extract caption from HTML string
 */
function extractCaption(htmlString) {
  if (!htmlString) return "";
  
  // Simple regex to extract text content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  return tempDiv.textContent || tempDiv.innerText || "";
}

/**
 * Generate a mapping file for image migration
 */
export function generateMigrationMap() {
  const galleries = Object.values(gallery[0]);
  const migrationMap = [];
  
  galleries.forEach((galleryGroup) => {
    galleryGroup.images.forEach((img) => {
      if (img.src) {
        migrationMap.push({
          localPath: img.src,
          cloudinaryFolder: `portfolio/${galleryGroup.name.toLowerCase().replace(/\s+/g, '_')}`,
          suggestedPublicId: img.src.split('/').pop().split('.')[0]
        });
      }
    });
  });
  
  return migrationMap;
}

// Export for use in console or script
if (typeof window !== 'undefined') {
  window.convertToCloudinaryFormat = convertToCloudinaryFormat;
  window.generateMigrationMap = generateMigrationMap;
  
  console.log('Migration helpers loaded!');
  console.log('Run: convertToCloudinaryFormat() to see converted data');
  console.log('Run: generateMigrationMap() to see migration mapping');
}
