import React from "react";
import MenuToGrid from "../components/MenuToGrid/MenuToGrid";
import { imagekitGalleries } from "./portfolio/data/imagekitGalleryData";
import { UI_TUNING } from "../config/uiTuning";
import DelayedLink from "../components/DelayedLink/DelayedLink";
import useHeroParallax from "../hooks/useHeroParallax";
import "./homeMinimal.css";

const HomeMinimal = () => {
	const heroImageUrl = "https://ik.imagekit.io/t3aewf67s/hero/13_1600.jpg";
	const [heroRenderSrc, setHeroRenderSrc] = React.useState(heroImageUrl);
	const [isHeroLoaded, setIsHeroLoaded] = React.useState(false);
	const heroReadyDispatchedRef = React.useRef(false);
	const objectUrlRef = React.useRef("");
	const heroSectionRef = React.useRef(null);

	useHeroParallax(heroSectionRef, { maxShift: 8, lerp: 0.05 });

	const markHeroReady = React.useCallback(() => {
		if (typeof window === "undefined") return;
		if (heroReadyDispatchedRef.current) return;
		heroReadyDispatchedRef.current = true;
		window.dispatchEvent(
			new CustomEvent("home-hero-progress", { detail: { value: 100 } }),
		);
		window.__homeHeroReady = true;
		window.dispatchEvent(new CustomEvent("home-hero-ready"));
	}, []);

	React.useEffect(() => {
		if (typeof window === "undefined") return;
		const dispatchProgress = (value) => {
			window.dispatchEvent(
				new CustomEvent("home-hero-progress", { detail: { value } }),
			);
		};

		if (window.__homeHeroReady) {
			heroReadyDispatchedRef.current = true;
			dispatchProgress(100);
			setIsHeroLoaded(true);
			return;
		}

		let cancelled = false;
		const controller = new AbortController();
		dispatchProgress(0);

		const preloadHero = async () => {
			try {
				const response = await fetch(heroImageUrl, {
					signal: controller.signal,
					cache: "force-cache",
				});
				if (!response.ok) throw new Error("Hero image fetch failed");

				const totalBytes = Number(response.headers.get("content-length") || 0);
				if (response.body && totalBytes > 0) {
					const reader = response.body.getReader();
					const chunks = [];
					let loadedBytes = 0;

					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						if (!value) continue;
						chunks.push(value);
						loadedBytes += value.length;
						if (!cancelled) {
							const pct = Math.min(99, Math.round((loadedBytes / totalBytes) * 100));
							dispatchProgress(pct);
						}
					}

					if (cancelled) return;
					const blob = new Blob(chunks, {
						type: response.headers.get("content-type") || "image/jpeg",
					});
					const objectUrl = URL.createObjectURL(blob);
					objectUrlRef.current = objectUrl;
					setHeroRenderSrc(objectUrl);
					return;
				}

				const blob = await response.blob();
				if (cancelled) return;
				const objectUrl = URL.createObjectURL(blob);
				objectUrlRef.current = objectUrl;
				setHeroRenderSrc(objectUrl);
				dispatchProgress(90);
			} catch {
				if (cancelled) return;
				setHeroRenderSrc(heroImageUrl);
				dispatchProgress(60);
			}
		};

		preloadHero();

		const fallback = window.setTimeout(() => {
			markHeroReady();
		}, 15000);

		return () => {
			cancelled = true;
			controller.abort();
			window.clearTimeout(fallback);
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current);
				objectUrlRef.current = "";
			}
		};
	}, [heroImageUrl, markHeroReady]);

	React.useEffect(() => {
		if (!isHeroLoaded) return;
		if (typeof window === "undefined") return;
		const raf1 = window.requestAnimationFrame(() => {
			window.requestAnimationFrame(() => {
				markHeroReady();
			});
		});
		return () => window.cancelAnimationFrame(raf1);
	}, [isHeroLoaded, markHeroReady]);

	const initOnContainer = (node) => {
		if (!node) {
			try {
				document.documentElement.classList.remove("home-snap");
				document.body.classList.remove("home-snap");
			} catch { }
			return;
		}
		if (typeof window !== "undefined") {
			requestAnimationFrame(() => window.scrollTo(0, 0));
		}
		try {
			document.documentElement.classList.remove("home-snap");
			document.body.classList.remove("home-snap");
		} catch { }
	};

	// Ensure body scrollability when HomeMinimal is active
	React.useEffect(() => {
		document.body.classList.remove("oh");
		document.documentElement.classList.remove("oh");
		document.body.style.overflowY = 'auto';
		document.body.style.overflowX = 'hidden';
		return () => {
			document.body.classList.remove("oh");
			document.documentElement.classList.remove("oh");
			document.body.style.overflowY = '';
			document.body.style.overflowX = '';
		};
	}, []);

	return (
		<div
			id="home-minimal-bg"
			className="home-minimal min-h-screen bg-[#f5f5f5] text-black overflow-x-hidden w-full"
			style={{
				"--hero-copy-delay-base": `${UI_TUNING.home.heroCopyDelaySec}s`,
				"--hero-copy-stagger": `${UI_TUNING.home.heroCopyStaggerSec}s`,
			}}
			ref={initOnContainer}>
			<div className="page-shell">
				<section
					className="hero-section"
					id="hero-logo-container"
					ref={heroSectionRef}>
					{heroImageUrl && (
						<div className="hero-gallery-wrap" aria-hidden="true">
							<img
								className="hero-gallery__item"
								src={heroRenderSrc}
								alt=""
								onLoad={() => setIsHeroLoaded(true)}
								onError={() => markHeroReady()}
							/>
						</div>
					)}
					<div className="hero-atmosphere" aria-hidden="true">
						<span className="hero-atmosphere__blob hero-atmosphere__blob--primary" />
						<span className="hero-atmosphere__blob hero-atmosphere__blob--secondary" />
					</div>
					<div className="hero-content">
						<h1 className="hero-title" aria-label="EMMA BARUA">
							<span className="hero-title-text">
								EMMA BARUA
							</span>
						</h1>
						<div className="hero-subtitle" aria-label="Makeup artist">
							<span className="hero-subtitle-prefix">Makeup Artist</span>
						</div>
					</div>
					<div className="hero-disciplines" aria-label="Specialties">
						<span>FILM</span>
						<span className="hero-disciplines__dot">·</span>
						<span>TV</span>
						<span className="hero-disciplines__dot">·</span>
						<span>EDITORIAL</span>
						<span className="hero-disciplines__dot">·</span>
						<span>BEAUTY</span>
						<span className="hero-disciplines__dot">·</span>
						<span>FASHION</span>

					</div>
				</section>

				<div className="hero-divider" aria-hidden="true">
					<svg
						className="hero-divider__wave"
						viewBox="0 0 1200 120"
						preserveAspectRatio="none">
						<path d="M0,62 C120,18 220,102 338,62 C456,22 548,102 662,62 C776,22 878,102 1002,62 C1098,31 1150,54 1200,62" />
					</svg>
				</div>

				<section className="gallery-section">
					<MenuToGrid
						galleries={imagekitGalleries}
						className="page-shell"
						contentClassName="gallery-content"
					/>
				</section>

				<div className="hero-divider hero-divider--bottom" aria-hidden="true">
					<svg
						className="hero-divider__wave"
						viewBox="0 0 1200 120"
						preserveAspectRatio="none">
						<path d="M0,62 C120,18 220,102 338,62 C456,22 548,102 662,62 C776,22 878,102 1002,62 C1098,31 1150,54 1200,62" />
					</svg>
				</div>

				<footer className="home-footer-cta">
					<p className="home-footer-cta__eyebrow">Planning a shoot?</p>
					<h2 className="home-footer-cta__title">Lets plan something together.</h2>
					<DelayedLink
						className="home-footer-cta__button"
						to="/contact"
						transition={{ fadeToDuration: 360, blackHoldDuration: 180 }}>
						Start a booking
					</DelayedLink>
				</footer>
			</div>
		</div>
	);
};

export default HomeMinimal;

