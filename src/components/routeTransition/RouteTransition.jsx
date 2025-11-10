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
	const timeoutRef = useRef();
	const prevLocationRef = useRef(location.key);
	const isDelayedNav = useRef(false);

	useEffect(() => {
		timeoutRef.current = setTimeout(() => {
			setShowOverlay(false);
			try {
				window.dispatchEvent(new CustomEvent("route-transition-in-complete"));
			} catch {}
		}, fadeFromDuration);
		return () => clearTimeout(timeoutRef.current);
	}, [fadeFromDuration]);

	useEffect(() => {
		const handler = () => {
			isDelayedNav.current = true;
			window.scrollTo(0, 0);
			setResetOverlay(true);
			setShowOverlay(true);
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

	return (
		<div className="route-transition-container">
			<div className="route-transition-overlay">
				<div
					className={`overlay-row overlay-row--top ${
						showOverlay ? "covering" : "revealing"
					} ${resetOverlay ? "reset" : ""}`}></div>
				<div
					className={`overlay-row overlay-row--bottom ${
						showOverlay ? "covering" : "revealing"
					} ${resetOverlay ? "reset" : ""}`}></div>
			</div>
			<div key={contentKey} className="route-transition-content">
				{children}
			</div>
		</div>
	);
};

export default RouteTransition;
