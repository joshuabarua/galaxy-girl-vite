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
 */
export default function useHeroParallax(sectionRef, opts = {}) {
    const {
        maxShift = 18,
        lerp = 0.08,
        tiltRange = 20,
    } = opts;

    // normalised target  -1 … 1  (set by input handlers)
    const target = useRef({ x: 0, y: 0 });
    // current interpolated value
    const current = useRef({ x: 0, y: 0 });
    const rafId = useRef(0);
    const elementsRef = useRef([]);

    /* ── collect the elements we want to shift ── */
    const collectElements = useCallback(() => {
        const section = sectionRef.current;
        if (!section) return [];
        return [
            section.querySelector(".hero-title"),
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
                el.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0)`;
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

        /* ── Desktop: mousemove ── */
        const handleMouseMove = (e) => {
            const rect = section.getBoundingClientRect();
            // normalise to -1…1
            target.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            target.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        };

        const handleMouseLeave = () => {
            target.current.x = 0;
            target.current.y = 0;
        };

        section.addEventListener("mousemove", handleMouseMove, { passive: true });
        section.addEventListener("mouseleave", handleMouseLeave, { passive: true });

        /* ── Mobile: DeviceOrientation (gyroscope) ── */
        let gyroAttached = false;

        const handleOrientation = (e) => {
            // gamma: left-to-right tilt (-90…90)
            // beta:  front-to-back tilt (-180…180)
            const gamma = e.gamma || 0;
            const beta = e.beta || 0;
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
            // We'll request on first user tap on the hero section
            const requestPermission = async () => {
                try {
                    const perm = await DeviceOrientationEvent.requestPermission();
                    if (perm === "granted") attachGyro();
                } catch { /* user declined */ }
            };
            section.addEventListener("click", requestPermission, { once: true });
        } else if (typeof DeviceOrientationEvent !== "undefined") {
            attachGyro();
        }

        /* ── Cleanup ── */
        return () => {
            cancelAnimationFrame(rafId.current);
            section.removeEventListener("mousemove", handleMouseMove);
            section.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("deviceorientation", handleOrientation);
            // reset transforms
            elementsRef.current.forEach((el) => {
                el.style.transform = "";
            });
        };
    }, [sectionRef, collectElements, maxShift, lerp, tiltRange]);
}
