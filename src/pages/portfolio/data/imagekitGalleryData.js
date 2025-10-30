/**
 * Gallery data structure for ImageKit-hosted images
 * Use imagekitPath including file extension, e.g. "beautyEditorial/0.jpg"
 */

function makeSeries(folder, count, startId, width, height, altPrefix, captionPrefix) {
  const images = [];
  for (let i = 1; i <= count; i++) {
    images.push({
      id: startId + (i - 1),
      imagekitPath: `${folder}/${i}.jpg`,
      width,
      height,
      alt: `${altPrefix} ${i}`,
      caption: captionPrefix ? `${captionPrefix} ${i}` : ""
    });
  }
  return images;
}

export const imagekitGalleries = [
  {
    id: 1,
    name: "Beauty and Editorial",
    images: makeSeries("beautyEditorial", 12, 1000, 1600, 2400, "Beauty Editorial Photo", "")
  },
  {
    id: 2,
    name: "SFX",
    images: makeSeries("SFX", 12, 2000, 1228, 1864, "SFX Makeup", "")
  },
  {
    id: 3,
    name: "Theatrical",
    images: makeSeries("theatrical", 12, 3000, 1590, 1999, "Theatrical Makeup", "")
  },
  {
    id: 4,
    name: "Wedding",
    images: makeSeries("wedding", 12, 4000, 1519, 2048, "Wedding Makeup", "")
  },
  {
    id: 5,
    name: "Period",
    images: makeSeries("period", 12, 5000, 1600, 2400, "Period Makeup", "")
  },
  {
    id: 6,
    name: "On Site",
    images: makeSeries("onsite", 12, 6000, 1600, 2400, "On Site Work", "")
  },
  {
    id: 7,
    name: "Nails",
    images: makeSeries("nails", 12, 7000, 1200, 1600, "Nail Art", "")
  },
  {
    id: 8,
    name: "Bodypaint",
    images: makeSeries("bodypaint", 12, 8000, 1600, 2400, "Body Painting", "")
  },

  {
    id: 9,
    name: "Camoflage",
    images: makeSeries("camoflage", 12, 9000, 1200, 1600, "Camoflage", "")
  },
  {
    id: 10,
    name: "Film / TV",
    images: makeSeries("filmtv", 12, 9000, 1600, 2400, "Film & TV", "")
  },
];
