import { useEffect, useRef, useCallback } from "react";

/**
 * Subtle 3D parallax for the hero title.
 *
 * Desktop  → mousemove over the hero section
 * Mobile   → DeviceOrientationEvent (gyroscope beta / gamma)
 *
 * The text moves in the *opposite* direction of the input to create
 * a depth / "floating" illusion.
 *
 * @param {React.RefObject} sectionRef  – ref to the hero <section>
 * @param {Object} [opts]
 * @param {number} [opts.maxShift=18]   – max px translation
 * @param {number} [opts.lerp=0.08]     – smoothing factor (0..1, lower = smoother)
 * @param {number} [opts.tiltRange=20]  – degrees of tilt mapped to full range
 * @param {number} [opts.maxRotate=6]   – max rotation in degrees
 */
export default function useHeroParallax(sectionRef, opts = {}) {
    const {
        maxShift = 18,
        lerp = 0.08,
        tiltRange = 20,
        maxRotate = 6,
    } = opts;

    // normalised target  -1 … 1  (set by input handlers)
    const target = useRef({ x: 0, y: 0 });
    // current interpolated value
    const current = useRef({ x: 0, y: 0 });
    const rafId = useRef(0);
    const elementsRef = useRef([]);
    const permissionHandlerRef = useRef(null);

    /* ── collect the elements we want to shift ── */
    const collectElements = useCallback(() => {
        const section = sectionRef.current;
        if (!section) return [];
        return [
            section.querySelector(".hero-title-text"),
        ].filter(Boolean);
    }, [sectionRef]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || typeof window === "undefined") return;

        elementsRef.current = collectElements();
        if (!elementsRef.current.length) return;

        /* ── apply the transform ── */
        const applyTransform = () => {
            const els = elementsRef.current;
            els.forEach((el) => {
                const shiftX = -(current.current.x * maxShift);
                const shiftY = -(current.current.y * maxShift);
                const rotateY = current.current.x * maxRotate;
                const rotateX = -(current.current.y * maxRotate);
                el.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                el.style.transformStyle = "preserve-3d";
                el.style.transformOrigin = "center center";
                el.style.willChange = "transform";
            });
        };

        /* ── animation loop ── */
        const tick = () => {
            current.current.x += (target.current.x - current.current.x) * lerp;
            current.current.y += (target.current.y - current.current.y) * lerp;
            applyTransform();
            rafId.current = requestAnimationFrame(tick);
        };
        rafId.current = requestAnimationFrame(tick);

        const updateTargetFromPoint = (clientX, clientY) => {
            if (hasGyroData) return; // Prioritize gyro, stop jitter
            const rect = section.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const normalizedX = ((clientX - rect.left) / rect.width - 0.5) * 2;
            const normalizedY = ((clientY - rect.top) / rect.height - 0.5) * 2;
            target.current.x = Math.max(-1, Math.min(1, normalizedX));
            target.current.y = Math.max(-1, Math.min(1, normalizedY));
        };

        /* ── Desktop / Pointer input ── */
        const handlePointerMove = (e) => {
            updateTargetFromPoint(e.clientX, e.clientY);
        };

        const handleTouchMove = (e) => {
            const touch = e.touches?.[0];
            if (!touch) return;
            updateTargetFromPoint(touch.clientX, touch.clientY);
        };

        const handlePointerLeave = () => {
            if (hasGyroData) return;
            target.current.x = 0;
            target.current.y = 0;
        };

        section.addEventListener("pointermove", handlePointerMove, { passive: true });
        section.addEventListener("pointerleave", handlePointerLeave, { passive: true });
        section.addEventListener("touchmove", handleTouchMove, { passive: true });
        section.addEventListener("touchend", handlePointerLeave, { passive: true });

        /* ── Mobile: DeviceOrientation (gyroscope) ── */
        let gyroAttached = false;
        let hasGyroData = false;

        const handleOrientation = (e) => {
            // If the hardware doesn't provide data (e.g. desktop with no gyro), bail out
            if (e.gamma == null || e.beta == null) return;
            
            hasGyroData = true; // Prevents pointer/touch events from jittering

            // gamma: left-to-right tilt (-90…90)
            // beta:  front-to-back tilt (-180…180)
            const gamma = e.gamma;
            const beta = e.beta;
            
            // Limit the tilt angle strictly to prevent extreme spinning/jumping
            target.current.x = Math.max(-1, Math.min(1, gamma / tiltRange));
            target.current.y = Math.max(-1, Math.min(1, (beta - 45) / tiltRange)); // 45° is neutral hold angle
        };

        const attachGyro = () => {
            if (gyroAttached) return;
            gyroAttached = true;
            window.addEventListener("deviceorientation", handleOrientation, { passive: true });
        };

        // iOS 13+ requires permission
        if (typeof DeviceOrientationEvent !== "undefined" &&
            typeof DeviceOrientationEvent.requestPermission === "function") {
            // We'll request on first user tap/click
            const requestPermission = async () => {
                try {
                    const perm = await DeviceOrientationEvent.requestPermission();
                    if (perm === "granted") {
                        attachGyro();
                    }
                } catch (err) {
                    console.error("Device orientation permission error:", err);
                }
            };
            permissionHandlerRef.current = requestPermission;
            // Best practice is to use 'click' or 'touchend' for permissions to guarantee it's counted as a user gesture
            window.addEventListener("click", requestPermission, { once: true });
            window.addEventListener("touchend", requestPermission, { once: true });
        } else if (typeof DeviceOrientationEvent !== "undefined") {
            attachGyro();
        }

        /* ── Cleanup ── */
        return () => {
            cancelAnimationFrame(rafId.current);
            if (permissionHandlerRef.current) {
                window.removeEventListener("click", permissionHandlerRef.current);
                window.removeEventListener("touchend", permissionHandlerRef.current);
                permissionHandlerRef.current = null;
            }
            section.removeEventListener("pointermove", handlePointerMove);
            section.removeEventListener("pointerleave", handlePointerLeave);
            section.removeEventListener("touchmove", handleTouchMove);
            section.removeEventListener("touchend", handlePointerLeave);
            window.removeEventListener("deviceorientation", handleOrientation);
            // reset transforms
            elementsRef.current.forEach((el) => {
                el.style.transform = "";
                el.style.transformStyle = "";
                el.style.transformOrigin = "";
                el.style.willChange = "";
            });
        };
    }, [sectionRef, collectElements, maxShift, lerp, tiltRange, maxRotate]);
}
