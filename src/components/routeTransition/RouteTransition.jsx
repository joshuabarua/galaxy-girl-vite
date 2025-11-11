import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const RouteTransition = ({
	children,
	fadeToDuration = 200,
	blackHoldDuration = 50,
	fadeFromDuration = 200,
}) => {
	const location = useLocation();
	const [showOverlay, setShowOverlay] = useState(true);
	const [resetOverlay, setResetOverlay] = useState(false);
	const [contentKey, setContentKey] = useState(location.key);
	const [isShrinking, setIsShrinking] = useState(true);
	const [bodyHasOverlayBlock, setBodyHasOverlayBlock] = useState(false);
	const timeoutRef = useRef();
	const prevLocationRef = useRef(location.key);
	const isDelayedNav = useRef(false);

	useEffect(() => {
		timeoutRef.current = setTimeout(() => {
			setShowOverlay(false);
			setIsShrinking(false);
			try {
				window.dispatchEvent(new CustomEvent("route-transition-in-complete"));
			} catch {}
		}, fadeFromDuration);
		return () => clearTimeout(timeoutRef.current);
	}, [fadeFromDuration]);

	useEffect(() => {
		if (typeof document === "undefined" || typeof MutationObserver === "undefined") {
			return;
		}
		const update = () => {
			setBodyHasOverlayBlock(document.body.classList.contains("oh"));
		};
		update();
		const observer = new MutationObserver(update);
		observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const handler = () => {
			isDelayedNav.current = true;
			window.scrollTo(0, 0);
			setResetOverlay(true);
			setShowOverlay(true);
			setIsShrinking(true);
			requestAnimationFrame(() => {
				setResetOverlay(false);
			});
		};
		window.addEventListener("delayed-navigation-start", handler);
		return () =>
			window.removeEventListener("delayed-navigation-start", handler);
	}, []);

	useEffect(() => {
		if (prevLocationRef.current === location.key) return;
		prevLocationRef.current = location.key;

		window.scrollTo(0, 0);

		if (!isDelayedNav.current) {
			setResetOverlay(true);
			setShowOverlay(true);
			setIsShrinking(true);
			requestAnimationFrame(() => {
				setResetOverlay(false);
			});
		}
		isDelayedNav.current = false;

		const fadeToEff = fadeToDuration;
		const holdEff = blackHoldDuration;
		const fadeFromEff = fadeFromDuration;

		const t1 = setTimeout(() => {
			setContentKey(location.key);
			window.scrollTo(0, 0);
			const t2 = setTimeout(() => {
				setShowOverlay(false);
				setIsShrinking(false);
				window.scrollTo(0, 0);
				try {
					window.dispatchEvent(new CustomEvent("route-transition-in-complete"));
				} catch {}
			}, fadeFromEff);
			timeoutRef.current = t2;
		}, fadeToEff + holdEff);

		timeoutRef.current = t1;

		const maxTotal = fadeToEff + holdEff + fadeFromEff + 150;
		const watchdog = setTimeout(() => {
			setShowOverlay(false);
			try {
				window.dispatchEvent(new CustomEvent("route-transition-in-complete"));
			} catch {}
		}, Math.max(250, maxTotal));

		return () => {
			clearTimeout(t1);
			clearTimeout(watchdog);
		};
	}, [location.key, fadeToDuration, blackHoldDuration, fadeFromDuration]);

	const overlayClasses = [
		"fixed inset-0 grid grid-cols-1 grid-rows-2 pointer-events-none overflow-hidden z-[2000000]",
	];

	if (bodyHasOverlayBlock) {
		overlayClasses.push("hidden");
	}

	const topRowClasses = [
		"relative bg-[#2a2a2a] overflow-hidden will-change-[transform] transform origin-top transition-transform duration-[150ms] ease-[cubic-bezier(0.65,0,0.35,1)] z-[9999]",
	];

	const bottomRowClasses = [
		"relative bg-[#2a2a2a] overflow-hidden will-change-[transform] transform origin-bottom transition-transform duration-[150ms] ease-[cubic-bezier(0.65,0,0.35,1)] z-[9999]",
	];

	if (resetOverlay) {
		topRowClasses.push("transition-none", "scale-y-0");
		bottomRowClasses.push("transition-none", "scale-y-0");
	} else {
		topRowClasses.push(showOverlay ? "scale-y-100" : "scale-y-0");
		bottomRowClasses.push(showOverlay ? "scale-y-100" : "scale-y-0");
	}

	const contentClasses = [
		"relative z-0 transform origin-center transition-transform duration-[250ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
		isShrinking ? "scale-[0.94]" : "scale-100",
	];

	return (
		<div className="relative min-h-full">
			<div className={overlayClasses.join(" ")}>
				<div className={topRowClasses.join(" ")} />
				<div className={bottomRowClasses.join(" ")} />
			</div>
			<div key={contentKey} className={contentClasses.join(" ")}>
				{children}
			</div>
		</div>
	);
};

export default RouteTransition;
