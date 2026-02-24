import React, { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { getImageKitUrl } from "../../utils/imagekit";
import { slugify } from "../../utils/slugify";
import { Row } from "./Row";
import Preview from "./Preview";
import "./MenuToGrid.css";

gsap.registerPlugin(Flip, ScrollToPlugin);

const resolvePreviewUrl = (image) => {
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

const combineClasses = (...classes) => classes.filter(Boolean).join(" ");
const ROW_PREVIEW_COUNT = 4;

const getFolderFromPath = (imagekitPath = "") => {
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

const buildImagesForCount = (images, count) => {
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
			if (await probeImageExists(`${folder}/${index}.${ext}`)) {
				return true;
			}
		}
		return false;
	};
	const hasFirst = await existsAt(1);
	if (!hasFirst) return 0;

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

const MenuToGrid = ({
	galleries = [],
	className = "",
	contentClassName = "",
}) => {
	const items = useMemo(
		() =>
			(Array.isArray(galleries) ? galleries : []).map((gallery, index) => ({
				...gallery,
				slug: gallery?.slug || slugify(gallery?.name || `gallery-${index}`),
			})),
		[galleries],
	);

	const [previewVisible, setPreviewVisible] = useState(false);
	const [activeGalleryIndex, setActiveGalleryIndex] = useState(-1);
	const [revealedRows, setRevealedRows] = useState(() => new Set());
	const [centeredRowIndex, setCenteredRowIndex] = useState(-1);
	const [livePhotoCounts, setLivePhotoCounts] = useState({});
	const [countLoading, setCountLoading] = useState({});

	const rowRefs = useRef([]);
	const rowsArrRef = useRef([]);
	const previewRefs = useRef([]);
	const coverRef = useRef(null);

	useEffect(() => {
		initializeMenuToGrid();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items]);

	useEffect(() => {
		setRevealedRows(new Set());
		setCenteredRowIndex(-1);
	}, [items]);

	useEffect(() => {
		let cancelled = false;

		const resolveCounts = async () => {
			const nextCounts = {};
			const loadingState = {};

			items.forEach((gallery) => {
				const images = Array.isArray(gallery?.images) ? gallery.images : [];
				const firstImagePath = images.find((image) => image?.imagekitPath)?.imagekitPath;
				loadingState[gallery.slug] = Boolean(getFolderFromPath(firstImagePath));
			});

			setCountLoading(loadingState);

			for (const gallery of items) {
				const images = Array.isArray(gallery?.images) ? gallery.images : [];
				const firstImagePath = images.find((image) => image?.imagekitPath)?.imagekitPath;
				const folder = getFolderFromPath(firstImagePath);

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

	useEffect(() => {
		if (!items.length) return undefined;

		const observer = new IntersectionObserver(
			(entries) => {
				setRevealedRows((prev) => {
					const next = new Set(prev);
					let didChange = false;

					entries.forEach((entry) => {
						if (!entry.isIntersecting) return;
						const index = Number(entry.target.getAttribute("data-row-index"));
						if (!Number.isNaN(index) && !next.has(index)) {
							next.add(index);
							didChange = true;
						}
						observer.unobserve(entry.target);
					});

					return didChange ? next : prev;
				});
			},
			{ threshold: 0.4, rootMargin: "0px 0px -8% 0px" },
		);

		rowRefs.current.forEach((rowEl) => {
			if (rowEl) observer.observe(rowEl);
		});

		return () => observer.disconnect();
	}, [items]);

	useEffect(() => {
		if (!items.length) return undefined;

		const intersectingRows = new Map();

		const pickCenterRow = () => {
			if (!intersectingRows.size) {
				setCenteredRowIndex(-1);
				return;
			}

			const viewportCenter = window.innerHeight / 2;
			let nearestIndex = -1;
			let nearestDistance = Number.POSITIVE_INFINITY;

			intersectingRows.forEach((rowEl, index) => {
				const rect = rowEl.getBoundingClientRect();
				const rowCenter = rect.top + rect.height / 2;
				const distance = Math.abs(viewportCenter - rowCenter);
				if (distance < nearestDistance) {
					nearestDistance = distance;
					nearestIndex = index;
				}
			});

			setCenteredRowIndex(nearestIndex);
		};

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const index = Number(entry.target.getAttribute("data-row-index"));
					if (Number.isNaN(index)) return;
					if (entry.isIntersecting) {
						intersectingRows.set(index, entry.target);
					} else {
						intersectingRows.delete(index);
					}
				});
				pickCenterRow();
			},
			{
				root: null,
				threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
				rootMargin: "-38% 0px -38% 0px",
			},
		);

		rowRefs.current.forEach((rowEl) => {
			if (rowEl) observer.observe(rowEl);
		});

		const onScroll = () => pickCenterRow();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, [items]);

	const initializeMenuToGrid = () => {
		const tryInitialize = (attempts = 0) => {
			const allRefsReady =
				rowRefs.current.length > 0 &&
				rowRefs.current.every((ref) => ref !== null);

			if (!allRefsReady && attempts < 10) {
				setTimeout(() => tryInitialize(attempts + 1), 100);
				return;
			}

			const rowsArr = [];
			rowRefs.current.forEach((rowEl) => {
				if (rowEl) {
					rowsArr.push(new Row(rowEl));
				}
			});

			rowsArrRef.current = rowsArr;
		};

		setTimeout(() => tryInitialize(), 100);
	};

	const handleMouseEnter = (index) => {
		const row = rowsArrRef.current[index];
		row?.hoverIn();
	};

	const handleMouseLeave = (index) => {
		if (previewVisible) return;
		const row = rowsArrRef.current[index];
		row?.hoverOut();
	};

	const handleRowClick = (e, gallery, index) => {
		e.preventDefault();
		if (previewVisible) return;

		const row = rowsArrRef.current[index];
		const preview = previewRefs.current[index];
		if (!row || !preview) return;

		setActiveGalleryIndex(index);
		setPreviewVisible(true);

		const coverEl = coverRef.current;
		const rowRect = row.DOM.el.getBoundingClientRect();

		gsap.killTweensOf([coverEl, ...rowsArrRef.current.map((r) => r.DOM.title)]);

		const tl = gsap.timeline({
			onStart: () => {
				document.body.classList.add("oh");
				row.DOM.el.classList.add("row--current");

				gsap.set(preview.DOM.images, { opacity: 0 });

				// Position cover at the row, then expand to full viewport
				if (coverEl) {
					gsap.set(coverEl, {
						height: rowRect.height - 1,
						top: rowRect.top,
						opacity: 1,
						pointerEvents: "auto",
					});
				}

				// Set preview title offscreen
				if (preview.DOM.title) {
					gsap.set(preview.DOM.title, {
						yPercent: -100,
						rotation: 15,
						transformOrigin: "100% 50%",
					});
				}

				document
					.querySelector(".preview__close")
					?.classList.add("preview__close--show");
			},
		});

		tl.addLabel("start", 0);

		// Cover expands from row to full viewport height
		if (coverEl) {
			tl.to(
				coverEl,
				{
					duration: 0.9,
					ease: "power4.inOut",
					height: window.innerHeight,
					top: 0,
				},
				"start",
			);
		}

		// All row titles animate out: above the clicked row go up, below go down
		tl.to(
			rowsArrRef.current.map((r) => r.DOM.title),
			{
				duration: 0.5,
				ease: "power4.inOut",
				yPercent: (_, target) => {
					return target.getBoundingClientRect().top > rowRect.top
						? 100
						: -100;
				},
				rotation: 0,
			},
			"start",
		);

		// Force hover animation to finish, then Flip images into grid
		tl.add(() => {
			// Force hover timeline to completion so images are visible
			if (row.mouseenterTimeline) {
				row.mouseenterTimeline.progress(1, false);
			}

			const rowImages = row.DOM.images;
			const previewGrid = preview.DOM.grid;

			if (rowImages.length && previewGrid) {
				const flipstate = Flip.getState(rowImages, { simple: true });

				// Move row images into the preview grid temporarily for the Flip
				rowImages.forEach((img) => {
					previewGrid.prepend(img);
				});

				Flip.from(flipstate, {
					duration: 0.9,
					ease: "power4.inOut",
					stagger: 0.04,
					onComplete: () => {
						// Return row images to their row container — they were only
						// used as visual proxies during the Flip transition
						rowImages.forEach((rImg) => {
							rImg.className = "cell__img";
							row.DOM.imagesWrap?.appendChild(rImg);
							gsap.set(rImg, { clearProps: "all" });
							gsap.set(rImg, { opacity: 0 });
						});

						// Reveal the preview's own images
						gsap.to(preview.DOM.images, {
							duration: 0.5,
							ease: "power3.out",
							startAt: { scale: 0.85, opacity: 0 },
							scale: 1,
							opacity: 1,
							stagger: 0.03,
						});
					},
				});
			} else {
				// No row images to Flip — just reveal preview images directly
				gsap.to(preview.DOM.images, {
					duration: 0.9,
					ease: "power4.inOut",
					startAt: {
						scale: 0,
						yPercent: () => gsap.utils.random(0, 200),
					},
					scale: 1,
					opacity: 1,
					yPercent: 0,
					stagger: 0.04,
				});
			}
		}, "start");

		// Preview title animates in
		if (preview.DOM.title) {
			tl.to(
				preview.DOM.title,
				{
					duration: 1,
					ease: "power4.inOut",
					yPercent: 0,
					rotation: 0,
					onComplete: () =>
						row.DOM.titleWrap?.classList.remove("cell__title--switch"),
				},
				"start",
			);
		}

		// Close button fades in
		tl.to(
			".preview__close",
			{
				duration: 1,
				ease: "power4.inOut",
				opacity: 1,
			},
			"start",
		);

		// Show preview overlay with slight delay
		window.setTimeout(() => {
			document.querySelector(".preview")?.classList.add("preview--active");
		}, 180);
	};

	const handleClose = () => {
		if (activeGalleryIndex === -1) return;
		const row = rowsArrRef.current[activeGalleryIndex];
		const preview = previewRefs.current[activeGalleryIndex];
		if (!row || !preview) return;
		const coverEl = coverRef.current;
		const currentIdx = activeGalleryIndex;

		// Only preview images need to be animated out (row images are already
		// back in their row containers after the Flip completed)
		const previewImages = preview.DOM.images || [];

		gsap.timeline({
			defaults: { duration: 0.5, ease: "power4.inOut" },
			onStart: () => document.body.classList.remove("oh"),
			onComplete: () => {
				row.DOM.el.classList.remove("row--current");
				document.querySelector(".preview")?.classList.remove("preview--active");
				// Reset preview image states for next open
				gsap.set(previewImages, { clearProps: "all" });
				setPreviewVisible(false);
				setActiveGalleryIndex(-1);
			},
		})
			.addLabel("start", 0)
			// Preview images scale down with stagger
			.to(
				previewImages,
				{
					scale: 0,
					opacity: 0,
					stagger: 0.03,
				},
				0,
			)
			// Preview title slides out
			.to(
				preview.DOM.title,
				{
					duration: 0.6,
					yPercent: 100,
				},
				"start",
			)
			// Close button fades out
			.to(
				".preview__close",
				{
					opacity: 0,
				},
				"start",
			)
			// Cover shrinks back after delay
			.to(
				coverEl,
				{
					ease: "power4",
					height: 0,
					top:
						row.DOM.el.getBoundingClientRect().top +
						row.DOM.el.offsetHeight / 2,
					onStart: () => {
						gsap.set(coverEl, {
							opacity: 1,
							height: window.innerHeight,
							top: 0,
							pointerEvents: "auto",
						});
					},
				},
				"start+=0.4",
			)
			// Cover fades out
			.to(
				coverEl,
				{
					duration: 0.3,
					opacity: 0,
					onComplete: () => {
						gsap.set(coverEl, {
							height: 0,
							pointerEvents: "none",
						});
					},
				},
				"start+=0.9",
			)
			// All row titles stagger back in
			.to(
				rowsArrRef.current.map((r) => r.DOM.title),
				{
					yPercent: 0,
					stagger: {
						each: 0.03,
						grid: "auto",
						from: currentIdx,
					},
				},
				"start+=0.4",
			);

		document
			.querySelector(".preview__close")
			?.classList.remove("preview__close--show");
	};

	if (!items.length) return null;

	return (
		<div className={combineClasses("menu-to-grid", className)}>
			<div className={combineClasses("rows", contentClassName)}>
				{items.map((gallery, index) => {
					const images = Array.isArray(gallery.images) ? gallery.images : [];
					const hasResolvedCount = Object.prototype.hasOwnProperty.call(
						livePhotoCounts,
						gallery.slug,
					);
					const imageCount = hasResolvedCount ? livePhotoCounts[gallery.slug] : null;
					const isCountLoading = Boolean(countLoading[gallery.slug]);
					const imagesForRow = buildImagesForCount(
						images,
						imageCount ?? images.length,
					);
					const imageCountLabel =
						imageCount === null
							? ""
							: `${imageCount} ${imageCount === 1 ? "photo" : "photos"}`;
					return (
						<div
							key={gallery.slug}
							className={combineClasses(
								"row",
								revealedRows.has(index) && "row--revealed",
								centeredRowIndex === index && "row--centered",
							)}
							data-row-index={index}
							ref={(el) => (rowRefs.current[index] = el)}
							role="button"
							tabIndex={0}
							aria-label={`Open ${gallery?.name ?? "portfolio"} album, ${imageCountLabel}`}
							onClick={(e) => handleRowClick(e, gallery, index)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ")
									handleRowClick(e, gallery, index);
							}}
							onFocus={() => {
								setRevealedRows((prev) => {
									if (prev.has(index)) return prev;
									const next = new Set(prev);
									next.add(index);
									return next;
								});
								handleMouseEnter(index);
							}}
							onBlur={() => handleMouseLeave(index)}
							onMouseEnter={() => handleMouseEnter(index)}
							onMouseLeave={() => handleMouseLeave(index)}
							style={{
								cursor: "pointer",
								pointerEvents: previewVisible ? "none" : "auto",
							}}>
							<div className="cell cell--title">
								<div className="cell__title-wrap">
									<h3 className="cell__title">
										<span className="cell__title-inner cell__title-inner--base">
											{gallery?.name}
										</span>
										<span
											className="cell__title-inner cell__title-inner--alt"
											aria-hidden="true">
											{gallery?.name}
										</span>
									</h3>
								</div>
							</div>
							<div className="cell cell--image">
								<div className="cell__img-wrap">
									{imagesForRow.slice(0, ROW_PREVIEW_COUNT).map((image, idx) => {
										const previewUrl = resolvePreviewUrl(image);
										return (
											<div
												key={idx}
												className="cell__img"
												data-flip-id={`${gallery.slug}-img-${idx}`}
												style={{
													backgroundImage: previewUrl
														? `url(${previewUrl})`
														: undefined,
												}}>
												<div
													className="cell__img-inner"
													style={{
														backgroundImage: previewUrl
															? `url(${previewUrl})`
															: undefined,
													}}
													role="presentation"
												/>
											</div>
										);
									})}
								</div>
								<span className="cell__meta-count" aria-hidden="true">
									{isCountLoading || imageCount === null ? (
										<span className="cell__meta-loading" aria-label="Loading photo count">
											<span className="cell__meta-spinner" />
											<span className="cell__meta-loading-text">Loading</span>
										</span>
									) : (
										imageCountLabel
									)}
								</span>
							</div>
							<div className="cell cell--action" aria-hidden="true">
								<svg
									className="cell__action-arrow"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg">
									<path
										d="M5 12H19M19 12L12 5M19 12L12 19"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</div>
					);
				})}
			</div>

			<div className="cover" ref={coverRef} aria-hidden="true" />

			<div className="preview">
				<button
					className="preview__close"
					aria-label="Close preview"
					onClick={handleClose}>
					<span className="preview__close-button">×</span>
				</button>
				<div className="preview__inner">
					{items.map((gallery, index) => (
						<Preview
							key={`preview-${gallery.slug}`}
							data={{
								...gallery,
								images: buildImagesForCount(
									Array.isArray(gallery.images) ? gallery.images : [],
									livePhotoCounts[gallery.slug],
								),
							}}
							previewCount={ROW_PREVIEW_COUNT}
							index={index}
							isActive={activeGalleryIndex === index}
							ref={(el) => (previewRefs.current[index] = el)}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default MenuToGrid;
