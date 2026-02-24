import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(
  ROOT,
  "src/pages/portfolio/data/imagekit.generated.json",
);
const CACHE_FILE = path.join(ROOT, ".cache/imagekit-sync-cache.json");

const FOLDERS = [
  { name: "Beauty & Editorial", folder: "beautyEditorial" },
  { name: "SFX", folder: "SFX" },
  { name: "Theatrical", folder: "theatrical" },
  { name: "Wedding", folder: "wedding" },
  { name: "Period", folder: "period" },
  { name: "On Site", folder: "onsite" },
  { name: "Nails", folder: "nails" },
  { name: "Bodypaint", folder: "bodypaint" },
  { name: "Camoflage", folder: "camoflage" },
  { name: "Film & TV", folder: "filmtv" },
];

const TTL_MINUTES = Number(process.env.IMAGEKIT_SYNC_TTL_MINUTES || 5);
const CACHE_TTL_MS = TTL_MINUTES * 60 * 1000;

const PRIVATE_KEY =
  process.env.IMAGEKIT_PRIVATE_KEY ||
  process.env.IK_PRIVATE_KEY ||
  process.env.IMAGEKIT_ADMIN_PRIVATE_KEY;
const PUBLIC_KEY = process.env.VITE_IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY;
const API_BASE = "https://api.imagekit.io/v1";
const forceRefresh = process.argv.includes("--force");

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getSequence = (filePath = "") => {
  const filename = filePath.split("/").pop() || "";
  const sequence = Number(filename.split(".")[0]);
  return Number.isFinite(sequence) ? sequence : Number.POSITIVE_INFINITY;
};

const hasTag = (file, tag) =>
  Array.isArray(file?.tags)
    ? file.tags.some((entry) => String(entry).toLowerCase() === tag)
    : false;

async function ensureOutputSkeleton() {
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  const skeleton = {
    generatedAt: null,
    source: "imagekit-sync",
    galleries: [],
  };
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(skeleton, null, 2));
}

async function readCache() {
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeCache(data) {
  await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2));
}

async function fetchFolderFiles(folder) {
  const limit = 100;
  let skip = 0;
  const all = [];

  while (true) {
    const url = new URL(`${API_BASE}/files`);
    url.searchParams.set("path", folder);
    url.searchParams.set("skip", String(skip));
    url.searchParams.set("limit", String(limit));

    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${PRIVATE_KEY}:`).toString("base64")}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`ImageKit API error (${response.status}): ${text}`);
    }

    const page = await response.json();
    const files = Array.isArray(page) ? page : [];
    all.push(...files);

    if (files.length < limit) break;
    skip += limit;
  }

  return all
    .filter((file) => file?.type === "file")
    .sort((a, b) => {
      const bySeq = getSequence(a.filePath) - getSequence(b.filePath);
      if (bySeq !== 0) return bySeq;
      return String(a.filePath || "").localeCompare(String(b.filePath || ""));
    });
}

async function getFolderData() {
  const now = Date.now();
  const cache = await readCache();

  if (!forceRefresh && cache?.fetchedAt && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.byFolder || {};
  }

  const byFolder = {};

  for (const entry of FOLDERS) {
    const files = await fetchFolderFiles(entry.folder);
    byFolder[entry.folder] = files.map((file, idx) => ({
      id: file.fileId || `${entry.folder}-${idx + 1}`,
      imagekitPath: String(file.filePath || "").replace(/^\/+/, ""),
      width: file.width || null,
      height: file.height || null,
      tags: Array.isArray(file.tags) ? file.tags : [],
      featured: hasTag(file, "featured"),
      hero: hasTag(file, "hero"),
    }));
  }

  await writeCache({ fetchedAt: now, byFolder });
  return byFolder;
}

async function run() {
  if (!PRIVATE_KEY) {
    if (PUBLIC_KEY) {
      console.warn(
        "[sync-imagekit] Found VITE_IMAGEKIT_PUBLIC_KEY, but metadata sync needs a PRIVATE key (read-only scope is enough).",
      );
    }
    console.warn(
      "[sync-imagekit] IMAGEKIT_PRIVATE_KEY missing. Using existing generated data.",
    );
    try {
      await fs.access(OUTPUT_FILE);
    } catch {
      await ensureOutputSkeleton();
    }
    return;
  }

  const byFolder = await getFolderData();

  const galleries = FOLDERS.map((entry, index) => {
    const folderImages = byFolder[entry.folder] || [];
    const images = folderImages.map((image, i) => ({
      ...image,
      alt: `${entry.name} ${i + 1}`,
      caption: "",
    }));

    return {
      id: index + 1,
      name: entry.name,
      folder: entry.folder,
      slug: slugify(entry.name),
      images,
    };
  });

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: "imagekit-sync",
        galleries,
      },
      null,
      2,
    ),
  );

  console.log(
    `[sync-imagekit] Synced ${galleries.length} galleries (${galleries.reduce((acc, g) => acc + g.images.length, 0)} images).`,
  );
}

run().catch((error) => {
  console.error("[sync-imagekit] Failed:", error.message || error);
  process.exitCode = 1;
});
