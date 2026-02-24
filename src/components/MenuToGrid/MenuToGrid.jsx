import React, { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { slugify } from "../../utils/slugify";
import { Row } from "./Row";
import Preview from "./Preview";
import {
	ROW_PREVIEW_COUNT,
	buildImagesForCount,
	resolvePreviewUrl,
} from "./menuToGrid.utils";
import { useLivePhotoCounts } from "./useLivePhotoCounts";
import { useCenteredRowIndex } from "./useCenteredRowIndex";
import "./MenuToGrid.css";

gsap.registerPlugin(ScrollToPlugin);

const combineClasses = (...classes) => classes.filter(Boolean).join(" ");

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
	const scrollLockYRef = useRef(0);

	const rowRefs = useRef([]);
	const rowsArrRef = useRef([]);
	const previewRefs = useRef([]);
	const centeredRowIndex = useCenteredRowIndex(items, rowRefs);
	const { livePhotoCounts, countLoading } = useLivePhotoCounts(items);

	const lockPageScroll = () => {
		if (typeof window === "undefined") return;
		scrollLockYRef.current = window.scrollY || window.pageYOffset || 0;
		document.documentElement.classList.add("oh");
		document.body.classList.add("oh");
		document.documentElement.style.overflow = "hidden";
		document.body.style.overflow = "hidden";
		document.documentElement.style.height = "100vh";
		document.body.style.height = "100vh";
		document.documentElement.style.overscrollBehavior = "none";
		document.body.style.overscrollBehavior = "none";
	};

	const unlockPageScroll = () => {
		if (typeof window === "undefined") return;
		document.documentElement.classList.remove("oh");
		document.body.classList.remove("oh");
		document.documentElement.style.overflow = "";
		document.body.style.overflow = "";
		document.documentElement.style.height = "";
		document.body.style.height = "";
		document.documentElement.style.overscrollBehavior = "";
		document.body.style.overscrollBehavior = "";
	};

	useEffect(() => {
		return () => {
			unlockPageScroll();
			document.querySelector(".preview")?.classList.remove("preview--active");
			document.querySelector(".preview__close")?.classList.remove("preview__close--show");
		};
	}, []);

	useEffect(() => {
		initializeMenuToGrid();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items]);


	useEffect(() => {
		if (previewVisible) return;
		if (typeof window === "undefined") return;
		const isTouchLike = window.matchMedia("(hover: none), (pointer: coarse)").matches;
		if (!isTouchLike) return;

		rowsArrRef.current.forEach((row, index) => {
			if (!row) return;
			if (index === centeredRowIndex) {
				row.hoverIn();
			} else {
				row.hoverOut();
			}
		});
	}, [centeredRowIndex, previewVisible]);

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

		lockPageScroll();
		const previewOverlay = document.querySelector(".preview");
		preview.DOM.el?.scrollTo?.(0, 0);
		if (previewOverlay) {
			gsap.killTweensOf(previewOverlay);
			gsap.set(previewOverlay, { opacity: 0 });
			previewOverlay.classList.add("preview--active");
			gsap.to(previewOverlay, { opacity: 1, duration: 0.18, ease: "power1.out" });
		}
		document.querySelector(".preview__close")?.classList.add("preview__close--show");

		if (row.mouseenterTimeline) {
			row.mouseenterTimeline.progress(1, false);
		}

		gsap.killTweensOf([preview.DOM.title, ...preview.DOM.images, ".preview__close"]);

		if (preview.DOM.title) {
			gsap.fromTo(
				preview.DOM.title,
				{ opacity: 0, y: 22 },
				{ opacity: 1, y: 0, duration: 0.34, ease: "power2.out" },
			);
		}

		gsap.fromTo(
			preview.DOM.images,
			{ opacity: 0, y: 28 },
			{ opacity: 1, y: 0, duration: 0.42, ease: "power3.out", stagger: 0.012 },
		);

		gsap.to(".preview__close", { opacity: 1, duration: 0.25, ease: "power1.out" });

	};

	const handleClose = () => {
		if (activeGalleryIndex === -1) return;
		const preview = previewRefs.current[activeGalleryIndex];
		if (!preview) return;
		const previewOverlay = document.querySelector(".preview");

		// Only preview images need to be animated out (row images are already
		// back in their row containers after the Flip completed)
		const previewImages = preview.DOM.images || [];

		gsap.timeline({
			onComplete: () => {
				unlockPageScroll();
				if (previewOverlay) {
					previewOverlay.classList.remove("preview--active");
					gsap.set(previewOverlay, { clearProps: "opacity" });
				}
				gsap.set(previewImages, { clearProps: "all" });
				setPreviewVisible(false);
				setActiveGalleryIndex(-1);
			},
		})
			.to(previewOverlay, { opacity: 0, duration: 0.16, ease: "power1.in" }, 0)
			.to(previewImages, {
				opacity: 0,
				y: 10,
				duration: 0.24,
				ease: "power1.in",
				stagger: 0.008,
			}, 0)
			.to(
				preview.DOM.title,
				{
					opacity: 0,
					y: 12,
					duration: 0.2,
					ease: "power1.in",
				},
				0,
			)
			.to(".preview__close", { opacity: 0, duration: 0.18, ease: "power1.in" }, 0);

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
							onFocus={() => handleMouseEnter(index)}
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
										<span className="cell__title-inner">
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

			<div className="preview">
				<button
					className="preview__close"
					aria-label="Close preview"
					onClick={handleClose}>
					<span className="preview__close-icon" aria-hidden="true">←</span>
					<span className="preview__close-label">Back</span>
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
							onClose={handleClose}
							ref={(el) => (previewRefs.current[index] = el)}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default MenuToGrid;
