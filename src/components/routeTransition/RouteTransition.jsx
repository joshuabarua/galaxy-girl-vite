import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { forceScrollTop } from "../../utils/forceScrollTop";

const RouteTransition = ({
	children,
	fadeToDuration = 250,
	blackHoldDuration = 100,
	fadeFromDuration = 250,
}) => {
	const location = useLocation();
	const [showOverlay, setShowOverlay] = useState(true);
	const [resetOverlay, setResetOverlay] = useState(false);
	const [instantCover, setInstantCover] = useState(false);
	const [contentKey, setContentKey] = useState(location.key);
	const [isShrinking, setIsShrinking] = useState(true);
	const [isEntering, setIsEntering] = useState(false);
	const timeoutRef = useRef();
	const prevLocationRef = useRef(location.key);
	const isDelayedNav = useRef(false);
	const contentRef = useRef(null);
	const pendingLocationRef = useRef(null);

	// Initial mount - fade in
	useEffect(() => {
		timeoutRef.current = setTimeout(() => {
			setShowOverlay(false);
			setIsShrinking(false);
			setIsEntering(true);
			setTimeout(() => setIsEntering(false), fadeFromDuration);
			try {
				window.dispatchEvent(new CustomEvent("route-transition-in-complete"));
			} catch {}
		}, fadeFromDuration);
		return () => clearTimeout(timeoutRef.current);
	}, [fadeFromDuration]);

	// Defensive cleanup on every route change so scroll never stays locked
	useEffect(() => {
		document.body.classList.remove("oh");
		document.documentElement.classList.remove("oh");
		document.body.style.overflowY = "";
		document.body.style.overflowX = "";
		document.querySelector(".preview")?.classList.remove("preview--active");
		document.querySelector(".preview__close")?.classList.remove("preview__close--show");
	}, [location.key]);

	// Handle delayed navigation start event
	useEffect(() => {
		const handler = (e) => {
			isDelayedNav.current = true;
			pendingLocationRef.current = e.detail?.to;
			// Start shrinking/fade out immediately
			setIsShrinking(true);
			setIsEntering(false);
			setInstantCover(true);
			setShowOverlay(true);
			window.setTimeout(() => setInstantCover(false), 180);
		};
		window.addEventListener("delayed-navigation-start", handler);
		return () =>
			window.removeEventListener("delayed-navigation-start", handler);
	}, []);

	// Avoid forcing scroll-top while the old page is still visible.
	// Scroll reset is handled after route swap.

	// Handle actual route change
	useEffect(() => {
		if (prevLocationRef.current === location.key) return;
		prevLocationRef.current = location.key;

		// If this wasn't a delayed nav, start the transition now
		if (!isDelayedNav.current) {
			setIsShrinking(true);
			setIsEntering(false);
			setResetOverlay(true);
			setShowOverlay(true);
			requestAnimationFrame(() => {
				setResetOverlay(false);
			});
		}
		isDelayedNav.current = false;

		const fadeToEff = fadeToDuration;
		const holdEff = blackHoldDuration;
		const fadeFromEff = fadeFromDuration;

		// Wait for fade-out to complete, then swap content
		const t1 = setTimeout(() => {
			forceScrollTop();
			setContentKey(location.key);
			
			// Wait a frame for content to render, then start fade-in
			requestAnimationFrame(() => {
				forceScrollTop();
				const t2 = setTimeout(() => {
					setShowOverlay(false);
					setIsShrinking(false);
					setIsEntering(true);
					forceScrollTop();
					setTimeout(() => setIsEntering(false), fadeFromEff);
					try {
						window.dispatchEvent(new CustomEvent("route-transition-in-complete"));
					} catch {}
				}, holdEff);
				timeoutRef.current = t2;
			});
		}, fadeToEff);

		timeoutRef.current = t1;

		const maxTotal = fadeToEff + holdEff + fadeFromEff + 200;
		const watchdog = setTimeout(() => {
			setShowOverlay(false);
			setIsShrinking(false);
			setIsEntering(false);
			try {
				window.dispatchEvent(new CustomEvent("route-transition-in-complete"));
			} catch {}
		}, Math.max(300, maxTotal));

		return () => {
			clearTimeout(t1);
			clearTimeout(watchdog);
		};
	}, [location.key, fadeToDuration, blackHoldDuration, fadeFromDuration]);

	const overlayClasses = [
		"fixed inset-0 grid grid-cols-1 grid-rows-2 pointer-events-none overflow-hidden z-[2000000]",
	];

	const topRowClasses = [
		"relative bg-[#2a2a2a] overflow-hidden will-change-[transform] transform origin-top transition-transform duration-150ms ease-friction z-[9999]",
	];

	const bottomRowClasses = [
		"relative bg-[#2a2a2a] overflow-hidden will-change-[transform] transform origin-bottom transition-transform duration-150ms ease-friction z-[9999]",
	];

	if (instantCover && showOverlay) {
		topRowClasses.push("transition-none", "scale-y-100");
		bottomRowClasses.push("transition-none", "scale-y-100");
	} else if (resetOverlay) {
		topRowClasses.push("transition-none", "scale-y-0");
		bottomRowClasses.push("transition-none", "scale-y-0");
	} else {
		topRowClasses.push(showOverlay ? "scale-y-100" : "scale-y-0");
		bottomRowClasses.push(showOverlay ? "scale-y-100" : "scale-y-0");
	}

	const contentWrapperClasses = "relative z-0 min-h-full";
	
	// Determine transition state class
	let transitionState = '';
	if (isShrinking) {
		transitionState = 'is-shrinking';
	} else if (isEntering) {
		transitionState = 'is-entering';
	}

	return (
		<div className={`relative min-h-full route-transition-wrapper ${transitionState}`}>
			<div className={overlayClasses.join(" ")} aria-hidden="true">
				<div className={topRowClasses.join(" ")} />
				<div className={bottomRowClasses.join(" ")} />
			</div>
			<div key={contentKey} className={contentWrapperClasses} ref={contentRef}>
				{children}
			</div>
		</div>
	);
};

export default RouteTransition;
