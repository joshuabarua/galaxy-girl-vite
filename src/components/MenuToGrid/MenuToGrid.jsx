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

const getFolderFromPath = (imagekitPath = "") => {
	if (!imagekitPath) return "";
	const [folder] = imagekitPath.split("/");
	return folder || "";
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

			for (const gallery of items) {
				const images = Array.isArray(gallery?.images) ? gallery.images : [];
				const firstImagePath = images.find((image) => image?.imagekitPath)?.imagekitPath;
				const folder = getFolderFromPath(firstImagePath);

				if (!folder) {
					nextCounts[gallery.slug] = images.length;
					continue;
				}

				const counted = await countFolderImages(folder);
				nextCounts[gallery.slug] = counted || images.length;

				if (cancelled) return;
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
		document.body.classList.add("oh");

		const rowRect = row.DOM.el.getBoundingClientRect();
		const coverEl = coverRef.current;
		if (coverEl) {
			gsap.killTweensOf(coverEl);
			gsap.set(coverEl, {
				top: rowRect.top,
				height: rowRect.height,
				opacity: 1,
				pointerEvents: "auto",
			});
			gsap.to(coverEl, {
				duration: 0.72,
				ease: "power3.inOut",
				top: 0,
				height: window.innerHeight,
			});
		}

		const rowImages = row.DOM.images;
		const previewGridImages = preview.DOM.images.slice(0, 5);
		const state = Flip.getState(rowImages);

		window.setTimeout(() => {
			document.querySelector(".preview")?.classList.add("preview--active");
		}, 180);

		previewGridImages.forEach((pImg, i) => {
			if (rowImages[i]) {
				pImg.style.display = "none";
				pImg.parentNode.insertBefore(rowImages[i], pImg);
				rowImages[i].className = `${pImg.className} flipping`;
			}
		});

		Flip.from(state, {
			duration: 0.9,
			ease: "power3.inOut",
			absolute: true,
			stagger: 0.04,
			onComplete: () => {
				previewGridImages.forEach((p) => (p.style.display = ""));
				rowImages.forEach((rImg) => {
					rImg.className = "cell__img";
					row.DOM.imagesWrap.appendChild(rImg);
					gsap.set(rImg, { opacity: 0 });
				});
				const remainingPreviewImages = preview.DOM.images.slice(5);
				if (remainingPreviewImages.length) {
					gsap.fromTo(
						remainingPreviewImages,
						{ opacity: 0, scale: 0.8 },
						{
							opacity: 1,
							scale: 1,
							duration: 0.5,
							stagger: 0.02,
							ease: "power3.out",
						},
					);
				}
			},
		});

		gsap.to([row.DOM.titleWrap, row.DOM.actionBtn], {
			duration: 0.5,
			ease: "power3.inOut",
			opacity: 0,
			y: -20,
		});

		document
			.querySelector(".preview__close")
			?.classList.add("preview__close--show");

		if (coverEl) {
			gsap.to(coverEl, {
				duration: 0.35,
				delay: 0.8,
				ease: "power2.out",
				opacity: 0,
				onComplete: () => {
					gsap.set(coverEl, { height: 0, pointerEvents: "none" });
				},
			});
		}
	};

	const handleClose = () => {
		if (activeGalleryIndex === -1) return;
		const row = rowsArrRef.current[activeGalleryIndex];
		const preview = previewRefs.current[activeGalleryIndex];
		if (!row || !preview) return;
		const coverEl = coverRef.current;
		const rowRect = row.DOM.el.getBoundingClientRect();

		document.body.classList.remove("oh");
		document
			.querySelector(".preview__close")
			?.classList.remove("preview__close--show");

		const rowImages = row.DOM.images;
		const remainingPreviewImages = preview.DOM.images.slice(5);
		if (remainingPreviewImages.length) {
			gsap.to(remainingPreviewImages, { opacity: 0, duration: 0.3 });
		}
		gsap.set(rowImages, { opacity: 1 });

		document.querySelector(".preview")?.classList.remove("preview--active");

		if (coverEl) {
			gsap.killTweensOf(coverEl);
			gsap.set(coverEl, {
				top: 0,
				height: window.innerHeight,
				opacity: 1,
				pointerEvents: "auto",
			});
			gsap.to(coverEl, {
				duration: 0.72,
				ease: "power3.inOut",
				top: rowRect.top,
				height: rowRect.height,
				onComplete: () => {
					gsap.set(coverEl, { height: 0, opacity: 0, pointerEvents: "none" });
				},
			});
		}

		setTimeout(() => {
			setPreviewVisible(false);
			setActiveGalleryIndex(-1);
		}, 600);

		gsap.to([row.DOM.titleWrap, row.DOM.actionBtn], {
			duration: 0.5,
			ease: "power3.inOut",
			opacity: 1,
			y: 0,
			delay: 0.1,
		});
	};

	if (!items.length) return null;

	return (
		<div className={combineClasses("menu-to-grid", className)}>
			<div className={combineClasses("rows", contentClassName)}>
				{items.map((gallery, index) => {
					const images = Array.isArray(gallery.images) ? gallery.images : [];
					const imageCount = livePhotoCounts[gallery.slug] ?? images.length;
					const imageCountLabel = `${imageCount} ${imageCount === 1 ? "photo" : "photos"}`;
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
									{images.slice(0, 5).map((image, idx) => {
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
									{imageCountLabel}
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
								images: Array.isArray(gallery.images) ? gallery.images : [],
							}}
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
