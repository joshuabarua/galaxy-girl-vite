import { useEffect, useState } from "react";
import { getImageKitUrl } from "../../utils/imagekit";
import { getFolderFromPath } from "./menuToGrid.utils";

const probeImageExists = (path) =>
	new Promise((resolve) => {
		const img = new Image();
		let settled = false;
		const finalize = (exists) => {
			if (settled) return;
			settled = true;
			img.onload = null;
			img.onerror = null;
			resolve(exists);
		};

		const timeoutId = window.setTimeout(() => finalize(false), 2200);
		img.onload = () => {
			window.clearTimeout(timeoutId);
			finalize(true);
		};
		img.onerror = () => {
			window.clearTimeout(timeoutId);
			finalize(false);
		};

		img.src = getImageKitUrl(path, { width: 32, height: 32, quality: 40 });
	});

const countFolderImages = async (folder, maxImages = 180) => {
	if (!folder) return 0;

	const existsAt = async (index) => {
		for (const ext of ["jpg", "png"]) {
			if (await probeImageExists(`${folder}/${index}.${ext}`)) return true;
		}
		return false;
	};

	if (!(await existsAt(1))) return 0;

	let low = 1;
	let high = 2;
	while (high <= maxImages && (await existsAt(high))) {
		low = high;
		high *= 2;
	}

	high = Math.min(high, maxImages + 1);
	while (low + 1 < high) {
		const mid = Math.floor((low + high) / 2);
		if (await existsAt(mid)) {
			low = mid;
		} else {
			high = mid;
		}
	}

	return low;
};

export const useLivePhotoCounts = (items) => {
	const [livePhotoCounts, setLivePhotoCounts] = useState({});
	const [countLoading, setCountLoading] = useState({});

	useEffect(() => {
		let cancelled = false;

		const resolveCounts = async () => {
			const nextCounts = {};
			const loadingState = {};

			items.forEach((gallery) => {
				const images = Array.isArray(gallery?.images) ? gallery.images : [];
				const firstPath = images.find((img) => img?.imagekitPath)?.imagekitPath;
				loadingState[gallery.slug] = Boolean(getFolderFromPath(firstPath));
			});

			setCountLoading(loadingState);

			for (const gallery of items) {
				const images = Array.isArray(gallery?.images) ? gallery.images : [];
				const firstPath = images.find((img) => img?.imagekitPath)?.imagekitPath;
				const folder = getFolderFromPath(firstPath);

				if (!folder) {
					nextCounts[gallery.slug] = images.length;
					if (!cancelled) {
						setCountLoading((prev) => ({ ...prev, [gallery.slug]: false }));
					}
					continue;
				}

				const counted = await countFolderImages(folder);
				nextCounts[gallery.slug] = counted;

				if (cancelled) return;
				setCountLoading((prev) => ({ ...prev, [gallery.slug]: false }));
			}

			if (!cancelled) setLivePhotoCounts(nextCounts);
		};

		resolveCounts();
		return () => {
			cancelled = true;
		};
	}, [items]);

	return { livePhotoCounts, countLoading };
};
