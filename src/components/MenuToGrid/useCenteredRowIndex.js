import { useEffect, useState } from "react";

export const useCenteredRowIndex = (items, rowRefs) => {
	const [centeredRowIndex, setCenteredRowIndex] = useState(-1);

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
	}, [items, rowRefs]);

	return centeredRowIndex;
};
