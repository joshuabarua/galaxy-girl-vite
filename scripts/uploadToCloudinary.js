/**
 * Script to upload images to Cloudinary
 * 
 * Usage:
 * 1. Install cloudinary package: npm install cloudinary
 * 2. Set up your .env file with Cloudinary credentials
 * 3. Run: node scripts/uploadToCloudinary.js
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET
});

/**
 * Upload a single image to Cloudinary
 */
async function uploadImage(filePath, folder) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      resource_type: 'image'
    });
    
    console.log(`✓ Uploaded: ${result.public_id}`);
    return result;
  } catch (error) {
    console.error(`✗ Failed to upload ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Upload all images from a directory
 */
async function uploadDirectory(dirPath, cloudinaryFolder) {
  const files = fs.readdirSync(dirPath);
  const results = [];

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively upload subdirectories
      const subResults = await uploadDirectory(
        filePath, 
        `${cloudinaryFolder}/${file}`
      );
      results.push(...subResults);
    } else if (isImageFile(file)) {
      const result = await uploadImage(filePath, cloudinaryFolder);
      if (result) {
        results.push({
          originalPath: filePath,
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height
        });
      }
    }
  }

  return results;
}

/**
 * Check if file is an image
 */
function isImageFile(filename) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
}

/**
 * Generate gallery data structure from upload results
 */
function generateGalleryData(results, galleryName) {
  return results.map((result, index) => ({
    id: index + 1,
    cloudinaryId: result.publicId,
    width: result.width,
    height: result.height,
    alt: `${galleryName} Image ${index + 1}`,
    caption: ""
  }));
}

/**
 * Main upload function
 */
async function main() {
  console.log('🚀 Starting Cloudinary upload...\n');

  // Define your image directories and their corresponding Cloudinary folders
  const uploadTasks = [
    {
      localPath: path.join(__dirname, '../src/assets/images/portfolio/beautyEditorial'),
      cloudinaryFolder: 'portfolio/beauty',
      galleryName: 'Beauty and Editorial'
    },
    {
      localPath: path.join(__dirname, '../src/assets/images/portfolio/SFX_makeup'),
      cloudinaryFolder: 'portfolio/sfx',
      galleryName: 'SFX Makeup'
    },
    {
      localPath: path.join(__dirname, '../src/assets/images/portfolio/bodypaint'),
      cloudinaryFolder: 'portfolio/bodypaint',
      galleryName: 'Body Paint'
    },
    {
      localPath: path.join(__dirname, '../src/assets/images/portfolio/Theatrical'),
      cloudinaryFolder: 'portfolio/theatrical',
      galleryName: 'Theatrical'
    },
    {
      localPath: path.join(__dirname, '../src/assets/images/portfolio/Wedding'),
      cloudinaryFolder: 'portfolio/wedding',
      galleryName: 'Wedding'
    },
    {
      localPath: path.join(__dirname, '../src/assets/images/portfolio/Period'),
      cloudinaryFolder: 'portfolio/period',
      galleryName: 'Period'
    },
    {
      localPath: path.join(__dirname, '../src/assets/images/portfolio/Nails'),
      cloudinaryFolder: 'portfolio/nails',
      galleryName: 'Nails'
    },
    {
      localPath: path.join(__dirname, '../src/assets/images/portfolio/OnSite'),
      cloudinaryFolder: 'portfolio/onsite',
      galleryName: 'On Site'
    }
  ];

  const allGalleries = [];

  for (const task of uploadTasks) {
    if (!fs.existsSync(task.localPath)) {
      console.log(`⚠ Skipping ${task.galleryName}: Directory not found at ${task.localPath}\n`);
      continue;
    }

    console.log(`📁 Uploading ${task.galleryName}...`);
    const results = await uploadDirectory(task.localPath, task.cloudinaryFolder);
    const galleryData = generateGalleryData(results, task.galleryName);
    
    allGalleries.push({
      name: task.galleryName,
      images: galleryData
    });

    console.log(`✓ Completed ${task.galleryName}: ${results.length} images\n`);
  }

  // Save gallery data to a JSON file
  const outputPath = path.join(__dirname, '../src/pages/portfolio/data/uploadedGalleryData.json');
  fs.writeFileSync(outputPath, JSON.stringify(allGalleries, null, 2));
  
  console.log(`\n✅ Upload complete!`);
  console.log(`📄 Gallery data saved to: ${outputPath}`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Review the generated gallery data`);
  console.log(`   2. Copy the data to cloudinaryGalleryData.js`);
  console.log(`   3. Add captions and alt text as needed`);
}

// Run the script
main().catch(console.error);
