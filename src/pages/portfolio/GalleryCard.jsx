import React, {useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './css/portfolioStyles.module.css';
import p5 from 'p5';

function GalleryCard({imageGroup, id}) {
	const navigate = useNavigate();

	// const sketchRef = useRef();
	// let p5Instance = useRef(null);

	// useEffect(() => {
	// 	p5Instance.current = new p5((p) => {
	// 		let img;

	// 		p.preload = () => {
	// 			img = p.loadImage(imageGroup.images[0].src);
	// 		};
	// 		p.setup = () => {
	// 			p.frameRate(10);
	// 			let canvas = p.createCanvas(1024, 780);
	// 			p.image(img, -1000, -1000);
	// 			canvas.mouseOver(pauseDrawing);
	// 			canvas.mouseOut(resumeDrawing);
	// 		};

	// 		p.draw = () => {
	// 			for (let x = 0; x < p.width; x += 7) {
	// 				let offset = p.sin(p.frameCount * 0.05 + x * 0.02) * 10;

	// 				let sx = x % img.width;
	// 				let sy = 0;
	// 				let sw = 5;
	// 				let sh = img.height;

	// 				let dx = x + offset;
	// 				let dy = 0;
	// 				let dw = 10;
	// 				let dh = p.height;

	// 				p.copy(img, sx, sy, sw, sh, dx, dy, dw, dh);
	// 			}
	// 		};

	// 		function pauseDrawing() {
	// 			p.noLoop();
	// 		}

	// 		function resumeDrawing() {
	// 			p.loop();
	// 		}
	// 	}, sketchRef.current);

	// 	return () => {
	// 		if (p5Instance.current) {
	// 			p5Instance.current.remove();
	// 		}
	// 	};
	// }, [imageGroup.images[0].src]);

	const handleClick = () => {
		navigate(`/portfolio/gallery/${id}`);
	};
	return (
		<div className={styles.gallery_card} style={{animationDelay: `${0.1 * id}s`}} onClick={handleClick}>
			<div className={styles.gallery_card_img}>
				{/* <div ref={sketchRef} className={styles.galleryCardImgDiv} /> */}
				<img src={`${imageGroup.images[0].src}`} />
			</div>
			<div className={styles.card_text}>
				<h2>{imageGroup.name}</h2>
			</div>
		</div>
	);
}

export default GalleryCard;
