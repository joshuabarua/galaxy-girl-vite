import { getImageKitUrl } from "../../utils/imagekit";

export const ROW_PREVIEW_COUNT = 4;

export const resolvePreviewUrl = (image) => {
	if (!image) return "";
	if (image.thumb) return image.thumb;
	if (image.imagekitPath) {
		return getImageKitUrl(image.imagekitPath, {
			width: 320,
			height: 320,
			crop: "faces",
		});
	}
	return image.src || "";
};

export const getFolderFromPath = (imagekitPath = "") => {
	if (!imagekitPath) return "";
	const [folder] = imagekitPath.split("/");
	return folder || "";
};

const getExtensionFromPath = (imagekitPath = "") => {
	const ext = imagekitPath.split(".").pop();
	if (!ext || ext.includes("/")) return "jpg";
	return ext.toLowerCase();
};

const getSequenceIndexFromPath = (imagekitPath = "") => {
	const filename = imagekitPath.split("/").pop() || "";
	const numericPart = filename.split(".")[0];
	const parsed = Number(numericPart);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const buildImagesForCount = (images, count) => {
	if (!Array.isArray(images) || !images.length) return [];
	if (!Number.isFinite(count) || count <= images.length) return images;

	const firstPath = images.find((img) => img?.imagekitPath)?.imagekitPath || "";
	const folder = getFolderFromPath(firstPath);
	if (!folder) return images;

	const ext = getExtensionFromPath(firstPath);
	const existingByIndex = new Map();

	images.forEach((img) => {
		const index = getSequenceIndexFromPath(img?.imagekitPath || "");
		if (index !== null) existingByIndex.set(index, img);
	});

	const merged = [];
	for (let i = 1; i <= count; i += 1) {
		if (existingByIndex.has(i)) {
			merged.push(existingByIndex.get(i));
			continue;
		}

		merged.push({
			id: `${folder}-${i}`,
			imagekitPath: `${folder}/${i}.${ext}`,
			alt: `${folder} ${i}`,
			caption: "",
		});
	}

	return merged;
};
