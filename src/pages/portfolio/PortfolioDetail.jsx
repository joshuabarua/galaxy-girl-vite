import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { imagekitGalleries, spotlightGallery } from "./data/imagekitGalleryData";
import { getImageKitUrl } from "../../utils/imagekit";
import { slugify } from "../../utils/slugify";
import { useGrained } from "../../hooks/useGrained";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

gsap.registerPlugin(Flip);

const PortfolioDetail = () => {
	const { slug } = useParams();
	const location = useLocation();
	const gridRef = useRef(null);
	const hasAnimated = useRef(false);
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState(0);

	const openLightbox = useCallback((idx) => {
		setLightboxIndex(idx);
		setLightboxOpen(true);
	}, []);

	const allGalleries = spotlightGallery
		? [...imagekitGalleries, spotlightGallery]
		: imagekitGalleries;

	const gallery = allGalleries.find(
		(g) => (g.slug || slugify(g.name)) === slug
	);

	useGrained("portfolio-detail-bg", {
		grainOpacity: 0.055,
		grainDensity: 1.7,
		grainWidth: 0.95,
		grainHeight: 0.95,
		grainChaos: 1.8,
		grainSpeed: 5,
		animate: true,
		bubbles: false,
	});

	useEffect(() => {
		if (!hasAnimated.current && location.state?.fromHome && gridRef.current) {
			hasAnimated.current = true;

			const flipData = sessionStorage.getItem('flipState');

			if (flipData) {
				const { imagePositions } = JSON.parse(flipData);
				const images = Array.from(gridRef.current.querySelectorAll('[data-flip-id]')).slice(0, 5);

				// Set initial positions from the home row
				gsap.set(images, {
					position: 'fixed',
					zIndex: 1000,
					opacity: 1
				});

				images.forEach((img, idx) => {
					if (imagePositions[idx]) {
						gsap.set(img, {
							top: imagePositions[idx].top,
							left: imagePositions[idx].left,
							width: imagePositions[idx].width,
							height: imagePositions[idx].height
						});
					}
				});

				// Animate to grid positions
				requestAnimationFrame(() => {
					images.forEach((img, idx) => {
						const rect = img.getBoundingClientRect();
						const finalTop = rect.top;
						const finalLeft = rect.left;
						const finalWidth = rect.width;
						const finalHeight = rect.height;

						// Reset to initial position
						if (imagePositions[idx]) {
							gsap.set(img, {
								top: imagePositions[idx].top,
								left: imagePositions[idx].left,
								width: imagePositions[idx].width,
								height: imagePositions[idx].height
							});
						}

						// Animate to final position
						gsap.to(img, {
							top: finalTop,
							left: finalLeft,
							width: finalWidth,
							height: finalHeight,
							duration: 0.8,
							ease: 'power3.inOut',
							delay: idx * 0.05,
							onComplete: () => {
								gsap.set(img, { clearProps: 'all' });
							}
						});
					});
				});

				// Fade in remaining images
				const remainingImages = Array.from(gridRef.current.querySelectorAll('[data-flip-id]')).slice(5);
				gsap.fromTo(
					remainingImages,
					{ opacity: 0, scale: 0.8 },
					{ opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', stagger: 0.02, delay: 0.4 }
				);

				sessionStorage.removeItem('flipState');
			} else {
				// Fallback animation
				const images = gridRef.current.querySelectorAll('[data-flip-id]');
				gsap.fromTo(
					images,
					{ opacity: 0, scale: 0.8 },
					{ opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.03 }
				);
			}
		}
	}, [location.state]);

	if (!gallery) {
		return (
			<div
				id="portfolio-detail-bg"
				className="min-h-screen bg-[#f5f5f5] text-black flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-3xl mb-4">Gallery not found</h1>
					<Link to="/" className="text-brand underline">
						Return to home
					</Link>
				</div>
			</div>
		);
	}

	const images = Array.isArray(gallery.images) ? gallery.images : [];

	const slides = images.map((image) => ({
		src: image.imagekitPath
			? getImageKitUrl(image.imagekitPath, { width: 2400 })
			: image.src || "",
		alt: image.alt || gallery.name,
		width: image.width || 1600,
		height: image.height || 2400,
	}));

	return (
		<div
			id="portfolio-detail-bg"
			className="min-h-screen bg-[#f5f5f5] text-black overflow-x-hidden">
			<div className="page-shell w-[90vw] max-w-[1400px] mx-auto">
				<header className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-light tracking-wide">{gallery.name}</h1>
					<Link
						to="/"
						className="inline-flex items-center gap-2 px-4 py-2 border border-brand/20 rounded-full hover:bg-black hover:text-white transition-colors"
						aria-label="Back to home">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M19 12H5M5 12L12 19M5 12L12 5"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						Back
					</Link>
				</header>

				{/* Masonry CSS Grid Layout */}
				<style>{`
					.masonry-grid {
						display: grid;
						grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
						grid-auto-rows: 10px;
						gap: 20px;
						align-items: start;
					}
					
					/* Micro-interaction scale on hover */
					.masonry-item {
						border-radius: 8px;
						overflow: hidden;
						position: relative;
						background-color: #e5e7eb; /* gray-200 */
						transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1);
					}
					
					.masonry-item:hover {
						transform: translateY(-4px) scale(1.02);
						box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
						z-index: 10;
					}

					.masonry-img {
						width: 100%;
						height: 100%;
						object-fit: cover;
						display: block;
						transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
					}

					.masonry-item:hover .masonry-img {
						transform: scale(1.05);
					}
				`}</style>

				<div ref={gridRef} className="masonry-grid pb-24">
					{images.map((image, idx) => {
						const imageWidth = image.width || 600;
						const imageHeight = image.height || 800;
						const aspectRatio = imageWidth / imageHeight;
						const estimatedHeight = 300 / aspectRatio;
						const rowSpan = Math.ceil((estimatedHeight + 20) / 30);

						const imageUrl = image.imagekitPath
							? getImageKitUrl(image.imagekitPath, { width: 800 })
							: image.src || "";

						return (
							<button
								key={idx}
								data-flip-id={`${slug}-img-${idx}`}
								className="masonry-item"
								style={{ gridRowEnd: `span ${rowSpan}`, background: 'none', border: 'none', padding: 0, cursor: 'zoom-in', display: 'block', width: '100%', textAlign: 'left' }}
								onClick={() => openLightbox(idx)}
								aria-label={`View ${image.alt || `${gallery.name} photo ${idx + 1}`} in full screen`}
							>
								{imageUrl && (
									<img
										src={imageUrl}
										alt={image.alt || `${gallery.name} ${idx + 1}`}
										className="masonry-img"
										loading="lazy"
									/>
								)}
							</button>
						);
					})}
				</div>

				<Lightbox
					open={lightboxOpen}
					close={() => setLightboxOpen(false)}
					index={lightboxIndex}
					slides={slides}
					plugins={[Zoom, Thumbnails]}
					zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
					thumbnails={{ position: "bottom", width: 80, height: 60, gap: 8, border: 1, borderRadius: 2, padding: 2 }}
					styles={{ container: { backgroundColor: 'rgba(0,0,0,0.95)' } }}
				/>
			</div>
		</div>
	);
};

export default PortfolioDetail;
