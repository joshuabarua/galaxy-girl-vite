import React, {useState, useEffect, useRef} from 'react';
import './heroSectionStyles.css'; // Import the CSS file
import Video from '../../../assets/videos/video4.mp4';
import {Button} from '../../../pages/buttonElement';
import {MdKeyboardArrowRight, MdArrowForward} from 'react-icons/md';

const HeroSection = () => {
	const [hover, setHover] = useState(false);
	const vidRef = useRef();

	//

	useEffect(() => {
		vidRef.current.play();
	}, []);

	const onHover = () => {
		setHover(!hover);
	};

	const handleTouch = (e) => {};

	return (
		<div className="hero-container" id="home">
			<div className="hero-bg">
				<video
					className="video-bg"
					playsInline
					ref={vidRef}
					muted
					autoPlay={true}
					loop
					src={Video}
					disablePictureInPicture={true}
					disableRemotePlayback={true}
					type="video/mp4"
					onTouchMove={handleTouch}
					onTouchStart={handleTouch}
					onTouchEnd={handleTouch}
				/>
			</div>
			<div className="hero-content opacity-0">
				<h1 className="hero-h1 "> Emma Robyn </h1>
				<h1 className="hero-h2">SFX Makeup Artist</h1>
				<h2 className="hero-p">Everything has beauty in it, but not everyone sees it - Confucius</h2>
				<div className="hero-btn-wrapper">
					<Button to="/portfolio" onMouseEnter={onHover} onMouseLeave={onHover} primary="true" dark="true">
						Explore My Artistry {hover ? <MdArrowForward className="arrow-forward" /> : <MdKeyboardArrowRight className="arrow-right" />}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default HeroSection;
