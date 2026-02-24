import { gsap } from "gsap";

export class Row {
	constructor(rowEl) {
		this.DOM = {
			el: rowEl,
			images: [...rowEl.querySelectorAll(".cell__img")],
			title: rowEl.querySelector(".cell__title"),
			actionBtn: rowEl.querySelector(".cell--action"),
		};

		this.mouseenterTimeline = null;
	}

	hoverIn() {
		gsap.killTweensOf([this.DOM.images, this.DOM.actionBtn]);

		this.mouseenterTimeline = gsap
			.timeline()
			.addLabel("start", 0)
			.to(
				this.DOM.images,
				{
					duration: 0.4,
					ease: "power3.out",
					startAt: {
						scale: 0.82,
						xPercent: 18,
					},
					scale: 1,
					xPercent: 0,
					opacity: 1,
					stagger: -0.035,
				},
				"start",
			)
			.to(
				this.DOM.actionBtn,
				{
					duration: 0.35,
					ease: "power2.out",
					opacity: 1,
					x: 0,
				},
				"start+=0.05",
			);
	}

	hoverOut() {
		gsap.killTweensOf([this.DOM.images, this.DOM.actionBtn]);

		gsap
			.timeline()
			.addLabel("start")
			.to(
				this.DOM.images,
				{
					duration: 0.35,
					ease: "power2.inOut",
					opacity: 0,
					scale: 0.84,
				},
				"start",
			)
			.to(
				this.DOM.actionBtn,
				{
					duration: 0.24,
					ease: "power2.out",
					opacity: 0,
					x: -8,
				},
				"start",
			);
	}
}
