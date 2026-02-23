import React from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import MenuToGrid from "../components/MenuToGrid/MenuToGrid";
import {
	imagekitGalleries,
	spotlightGallery,
} from "./portfolio/data/imagekitGalleryData";
import { useGrained } from "../hooks/useGrained";
import { getImageKitUrl } from "../utils/imagekit";
import { slugify } from "../utils/slugify";
import "./homeMinimal.css";

const craftFocusAreas = ["Editorial", "Film", "TV", "SFX", "Bridal"];

const featuredDescriptions = {
	"Beauty and Editorial":
		"Polished skin stories, expressive texture, and camera-first detail for editorial direction.",
	SFX: "Creature texture, surreal finishes, and character-built transformations crafted for the lens.",
	Theatrical:
		"Stage-tested looks with readable contrast and dramatic detail from front row to close-up.",
	Wedding:
		"Long-wear bridal artistry focused on softness, elegance, and flash-friendly finish.",
};

const HomeMinimal = () => {
	const featuredCardRef = React.useRef(null);

	const featuredGallery = spotlightGallery;

	const featuredImages = Array.isArray(featuredGallery?.images)
		? featuredGallery.images
		: [];
	const featuredCoverImage = featuredImages[0];
	const featuredPreviewImages = featuredImages.slice(1, 6);
	const featuredImageUrl = featuredCoverImage?.imagekitPath
		? getImageKitUrl(featuredCoverImage.imagekitPath, { width: 1080, height: 900 })
		: featuredCoverImage?.src || "";
	const featuredSlug = featuredGallery
		? featuredGallery.slug || slugify(featuredGallery.name || "featured-gallery")
		: "";
	const featuredDescription =
		featuredGallery?.description ||
		featuredDescriptions[featuredGallery?.name] ||
		"A curated album showcasing polished looks, technical range, and camera-ready artistry.";

	const getFeaturedThumbUrl = React.useCallback(
		(image) => {
			if (!image) return "";
			if (image.imagekitPath) {
				return getImageKitUrl(image.imagekitPath, {
					width: 360,
					height: 360,
					crop: "faces",
				});
			}
			return image.src || "";
		},
		[],
	);

	const handleFeaturedMouseMove = React.useCallback((event) => {
		const card = featuredCardRef.current;
		if (!card) return;
		const bounds = card.getBoundingClientRect();
		const x = ((event.clientX - bounds.left) / bounds.width) * 100;
		const y = ((event.clientY - bounds.top) / bounds.height) * 100;
		card.style.setProperty("--pointer-x", `${Math.max(0, Math.min(100, x))}%`);
		card.style.setProperty("--pointer-y", `${Math.max(0, Math.min(100, y))}%`);
	}, []);

	const resetFeaturedPointer = React.useCallback(() => {
		const card = featuredCardRef.current;
		if (!card) return;
		card.style.setProperty("--pointer-x", "70%");
		card.style.setProperty("--pointer-y", "26%");
	}, []);

	useGrained("home-minimal-bg", {
		grainOpacity: 0.055,
		bubbles: false,
		grainDensity: 1.7,
		grainChaos: 1.8,
		grainSpeed: 5,
		animate: true,
	});

	const initOnContainer = (node) => {
		if (!node) {
			try {
				document.documentElement.classList.remove("home-snap");
				document.body.classList.remove("home-snap");
			} catch {}
			return;
		}
		if (typeof window !== "undefined") {
			requestAnimationFrame(() => window.scrollTo(0, 0));
		}
		try {
			document.documentElement.classList.remove("home-snap");
			document.body.classList.remove("home-snap");
		} catch {}
	};

	const initHeroSection = () => {};

	const initHeroTitle = (el) => {
		if (!el || el.dataset.gsapped) return;
		el.dataset.gsapped = "1";
		const originalText = el.textContent || "";
		const frag = document.createDocumentFragment();
		const chars = [];
		for (let i = 0; i < originalText.length; i++) {
			const ch = originalText[i];
			const span = document.createElement("span");
			span.className = "hero-char";
			span.textContent = ch;
			span.style.opacity = "0";
			frag.appendChild(span);
			chars.push(span);
		}
		el.textContent = "";
		el.appendChild(frag);

		const perChar = 2;
		const stagger = 0.1;
		const startDelay = 0.4;

		gsap.to(chars, {
			opacity: 1,
			duration: perChar,
			stagger,
			ease: "none",
			delay: startDelay,
		});

		const subtitleDelay = startDelay + 1;
		const scrollDelay = subtitleDelay + 1;
		gsap.to(".hero-subtitle", {
			opacity: 1,
			y: 8,
			duration: 0.6,
			ease: "power2.out",
			delay: subtitleDelay,
		});
		gsap.to(".scroll-indicator", {
			opacity: 1,
			y: 6,
			duration: 0.6,
			ease: "power2.out",
			delay: scrollDelay,
		});
	};

	return (
		<div
			id="home-minimal-bg"
			className="home-minimal min-h-screen bg-[#f5f5f5] text-black overflow-x-hidden w-full"
			ref={initOnContainer}>
			<div className="page-shell">
				<section
					className="hero-section flex items-center justify-center flex-col px-8 relative"
					id="hero-logo-container"
					ref={initHeroSection}>
					<div className="hero-atmosphere" aria-hidden="true">
						<span className="hero-atmosphere__blob hero-atmosphere__blob--primary" />
						<span className="hero-atmosphere__blob hero-atmosphere__blob--secondary" />
					</div>
					<div className="hero-content text-center flex flex-col items-center gap-2 max-w-[600px] px-8 mx-auto relative z-10">
						<h1 className="hero-title" aria-label="EMMA BARUA">
							<span className="hero-title-text" ref={initHeroTitle}>
								EMMA BARUA
							</span>
						</h1>
						<div className="hero-subtitle" aria-label="Makeup artist specialties">
							<span className="hero-subtitle-prefix">Makeup Artist</span>
						</div>
					</div>
				</section>

				<section className="hero-craft-band" aria-label="Craft focus areas">
					<div className="hero-craft-inline" aria-hidden="true">
						{craftFocusAreas.map((focus, index) => (
							<React.Fragment key={focus}>
								<span className="hero-craft-item">{focus}</span>
								{index < craftFocusAreas.length - 1 && (
									<span className="hero-craft-dot">·</span>
								)}
							</React.Fragment>
						))}
					</div>
				</section>

				{featuredGallery && (
					<section className="featured-section" aria-label="Featured album">
						<Link
							ref={featuredCardRef}
							className="featured-card"
							to={`/portfolio/${featuredSlug}`}
							onMouseMove={handleFeaturedMouseMove}
							onMouseLeave={resetFeaturedPointer}
							onBlur={resetFeaturedPointer}
							aria-label={`Open featured album ${featuredGallery.name}`}>
							<div className="featured-card__image-wrap">
								{featuredImageUrl && (
									<img
										src={featuredImageUrl}
										alt={featuredCoverImage?.alt || featuredGallery.name}
										className="featured-card__image"
										loading="lazy"
									/>
								)}
								<div className="featured-card__veil" aria-hidden="true" />
								{featuredPreviewImages.length > 0 && (
									<div className="featured-card__thumb-rail" aria-hidden="true">
										{featuredPreviewImages.map((image, index) => {
											const thumbUrl = getFeaturedThumbUrl(image);
											if (!thumbUrl) return null;
											return (
												<span
													className="featured-card__thumb"
													key={image.id || `${image.imagekitPath || "thumb"}-${index}`}>
													<img
														src={thumbUrl}
														alt=""
														loading="lazy"
													/>
												</span>
											);
										})}
									</div>
								)}
							</div>
							<div className="featured-card__content">
								<p className="featured-card__kicker">Featured Album</p>
								<h2 className="featured-card__title">{featuredGallery.name}</h2>
								<p className="featured-card__description">{featuredDescription}</p>
								<div className="featured-card__meta" aria-hidden="true">
									<span>{featuredImages.length} photos</span>
								</div>
							</div>
						</Link>
					</section>
				)}

				<section className="gallery-section">
					<MenuToGrid
						galleries={imagekitGalleries}
						className="page-shell"
						contentClassName="gallery-content"
					/>
				</section>

				<footer className="home-footer-cta">
					<p className="home-footer-cta__eyebrow">Planning a shoot?</p>
					<h2 className="home-footer-cta__title">Lets plan something together.</h2>
					<Link className="home-footer-cta__button" to="/contact">
						Start a booking
					</Link>
				</footer>
			</div>
		</div>
	);
};

export default HomeMinimal;
