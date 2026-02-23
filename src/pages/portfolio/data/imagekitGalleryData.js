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

function markSpotlight(images, spotlightIndexes = []) {
  const spotlightSet = new Set(spotlightIndexes);
  return images.map((image, idx) => ({
    ...image,
    spotlight: spotlightSet.has(idx + 1)
  }));
}

export const imagekitGalleries = [
  {
    id: 1,
    name: "Beauty and Editorial",
    images: markSpotlight(
      makeSeries("beautyEditorial", 12, 1000, 1600, 2400, "Beauty Editorial Photo", ""),
      []
    )
  },
  {
    id: 2,
    name: "SFX",
    images: markSpotlight(makeSeries("SFX", 12, 2000, 1228, 1864, "SFX Makeup", ""), [])
  },
  {
    id: 3,
    name: "Theatrical",
    images: markSpotlight(
      makeSeries("theatrical", 12, 3000, 1590, 1999, "Theatrical Makeup", ""),
      []
    )
  },
  {
    id: 4,
    name: "Wedding",
    images: markSpotlight(
      makeSeries("wedding", 12, 4000, 1519, 2048, "Wedding Makeup", ""),
      []
    )
  },
  {
    id: 5,
    name: "Period",
    images: markSpotlight(makeSeries("period", 12, 5000, 1600, 2400, "Period Makeup", ""), [])
  },
  {
    id: 6,
    name: "On Site",
    images: markSpotlight(makeSeries("onsite", 12, 6000, 1600, 2400, "On Site Work", ""), [])
  },
  {
    id: 7,
    name: "Nails",
    images: markSpotlight(makeSeries("nails", 12, 7000, 1200, 1600, "Nail Art", ""), [])
  },
  {
    id: 8,
    name: "Bodypaint",
    images: markSpotlight(
      makeSeries("bodypaint", 12, 8000, 1600, 2400, "Body Painting", ""),
      []
    )
  },
  {
    id: 9,
    name: "Camoflage",
    images: markSpotlight(
      makeSeries("camoflage", 12, 9000, 1200, 1600, "Camoflage", ""),
      []
    )
  },
  {
    id: 10,
    name: "Film / TV",
    images: markSpotlight(
      makeSeries("filmtv", 12, 10000, 1600, 2400, "Film & TV", ""),
      []
    )
  }
];

const spotlightImages = imagekitGalleries.flatMap((gallery) =>
  (Array.isArray(gallery.images) ? gallery.images : [])
    .filter((image) => image?.spotlight)
    .map((image, index) => ({
      ...image,
      id: image.id ?? `spotlight-${gallery.id}-${index}`,
      sourceGalleryName: gallery.name,
      sourceGalleryId: gallery.id
    }))
);

export const spotlightGallery = spotlightImages.length
  ? {
      id: "spotlight",
      name: "Spotlight",
      slug: "spotlight",
      description: "A cross-collection edit of signature looks curated by Emma.",
      images: spotlightImages
    }
  : null;
