/**
 * Gallery data structure for Cloudinary-hosted images
 * 
 * To use this file:
 * 1. Upload your images to Cloudinary
 * 2. Replace the cloudinaryId with your actual Cloudinary public IDs
 * 3. The format is: folder/filename (without extension)
 * 
 * Example: If your image is at https://res.cloudinary.com/your-cloud/image/upload/v1234/portfolio/beauty/image1.jpg
 * Then cloudinaryId should be: "portfolio/beauty/image1"
 */

export const cloudinaryGalleries = [
  {
    id: 1,
    name: "Beauty and Editorial",
    images: [
      {
        id: 1001,
        cloudinaryId: "portfolio/beauty/image1", // Replace with your Cloudinary public ID
        width: 1600,
        height: 2400,
        alt: "Beauty Editorial Photo",
        caption: "Photo by Susan Hinman - The Countess"
      },
      {
        id: 1002,
        cloudinaryId: "portfolio/beauty/image2",
        width: 1600,
        height: 2400,
        alt: "Beauty Editorial Photo",
        caption: "Photo by Susan Hinman - The Countess"
      },
      // Add more images here
    ]
  },
  {
    id: 2,
    name: "SFX Makeup",
    images: [
      {
        id: 2001,
        cloudinaryId: "portfolio/sfx/image1",
        width: 1228,
        height: 1864,
        alt: "SFX Makeup",
        caption: "Photo by Jeff Mood - Evil Faun"
      },
      // Add more images here
    ]
  },
  {
    id: 3,
    name: "Body Paint",
    images: [
      {
        id: 3001,
        cloudinaryId: "portfolio/bodypaint/image1",
        width: 667,
        height: 1000,
        alt: "Body Paint",
        caption: "Photo by Jeff Mood - Lizard Person"
      },
      // Add more images here
    ]
  },
  {
    id: 4,
    name: "Theatrical",
    images: [
      {
        id: 4001,
        cloudinaryId: "portfolio/theatrical/image1",
        width: 1590,
        height: 1999,
        alt: "Theatrical Makeup",
        caption: "Photo by Emma Barua - Goblin Skull"
      },
      // Add more images here
    ]
  },
  {
    id: 5,
    name: "Wedding",
    images: [
      {
        id: 5001,
        cloudinaryId: "portfolio/wedding/image1",
        width: 1519,
        height: 2048,
        alt: "Wedding Makeup",
        caption: "Photo by Emma Barua - Wedding Shoot"
      },
      // Add more images here
    ]
  },
  {
    id: 6,
    name: "Period",
    images: [
      {
        id: 6001,
        cloudinaryId: "portfolio/period/image1",
        width: 1600,
        height: 2400,
        alt: "Period Makeup",
        caption: "Period Makeup"
      },
      // Add more images here
    ]
  },
  {
    id: 7,
    name: "Nails",
    images: [
      {
        id: 7001,
        cloudinaryId: "portfolio/nails/image1",
        width: 1200,
        height: 1600,
        alt: "Nail Art",
        caption: "Nail Art"
      },
      // Add more images here
    ]
  },
  {
    id: 8,
    name: "On Site",
    images: [
      {
        id: 8001,
        cloudinaryId: "portfolio/onsite/image1",
        width: 1600,
        height: 2400,
        alt: "On Site Work",
        caption: "On Site Makeup"
      },
      // Add more images here
    ]
  }
];
