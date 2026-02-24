import generated from "./imagekit.generated.json";

function makeSeries(folder, count, startId, width, height, altPrefix, captionPrefix) {
  const images = [];
  for (let i = 1; i <= count; i += 1) {
    images.push({
      id: startId + (i - 1),
      imagekitPath: `${folder}/${i}.jpg`,
      width,
      height,
      alt: `${altPrefix} ${i}`,
      caption: captionPrefix ? `${captionPrefix} ${i}` : "",
    });
  }
  return images;
}

function hasImageTag(image, tag) {
  if (!image || !tag) return false;
  const normalized = String(tag).toLowerCase();

  if (image[normalized] === true) return true;
  if (normalized === "featured" && image.spotlight === true) return true;

  if (Array.isArray(image.tags)) {
    return image.tags.some((entry) => String(entry).toLowerCase() === normalized);
  }

  return false;
}

const fallbackGalleries = [
  {
    id: 1,
    name: "Beauty & Editorial",
    slug: "beauty-editorial",
    images: makeSeries("beautyEditorial", 12, 1000, 1600, 2400, "Beauty Editorial Photo", ""),
  },
  {
    id: 2,
    name: "SFX",
    slug: "sfx",
    images: makeSeries("SFX", 12, 2000, 1228, 1864, "SFX Makeup", ""),
  },
  {
    id: 3,
    name: "Theatrical",
    slug: "theatrical",
    images: makeSeries("theatrical", 12, 3000, 1590, 1999, "Theatrical Makeup", ""),
  },
  {
    id: 4,
    name: "Wedding",
    slug: "wedding",
    images: makeSeries("wedding", 12, 4000, 1519, 2048, "Wedding Makeup", ""),
  },
  {
    id: 5,
    name: "Period",
    slug: "period",
    images: makeSeries("period", 12, 5000, 1600, 2400, "Period Makeup", ""),
  },
  {
    id: 6,
    name: "On Site",
    slug: "on-site",
    images: makeSeries("onsite", 12, 6000, 1600, 2400, "On Site Work", ""),
  },
  {
    id: 7,
    name: "Nails",
    slug: "nails",
    images: makeSeries("nails", 12, 7000, 1200, 1600, "Nail Art", ""),
  },
  {
    id: 8,
    name: "Bodypaint",
    slug: "bodypaint",
    images: makeSeries("bodypaint", 12, 8000, 1600, 2400, "Body Painting", ""),
  },
  {
    id: 9,
    name: "Camoflage",
    slug: "camoflage",
    images: makeSeries("camoflage", 12, 9000, 1200, 1600, "Camoflage", ""),
  },
  {
    id: 10,
    name: "Film & TV",
    slug: "film-tv",
    images: makeSeries("filmtv", 12, 10000, 1600, 2400, "Film & TV", ""),
  },
];

const generatedGalleries = Array.isArray(generated?.galleries) ? generated.galleries : [];

export const imagekitGalleries = generatedGalleries.some(
  (gallery) => Array.isArray(gallery.images) && gallery.images.length,
)
  ? generatedGalleries
  : fallbackGalleries;

const spotlightImages = imagekitGalleries.flatMap((gallery) =>
  (Array.isArray(gallery.images) ? gallery.images : [])
    .filter((image) => hasImageTag(image, "featured"))
    .map((image, index) => ({
      ...image,
      id: image.id ?? `spotlight-${gallery.id}-${index}`,
      sourceGalleryName: gallery.name,
      sourceGalleryId: gallery.id,
    })),
);



export const spotlightGallery = spotlightImages.length
  ? {
    id: "spotlight",
    name: "Spotlight",
    slug: "spotlight",
    description: "A cross-collection edit of signature looks curated by Emma.",
    images: spotlightImages,
  }
  : null;
