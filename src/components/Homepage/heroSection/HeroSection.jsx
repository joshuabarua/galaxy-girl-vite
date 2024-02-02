import React, {useState} from 'react';
import './heroSectionStyles.css'; // Import the CSS file
import Video from '../../../assets/videos/video4.mp4';
import {Button} from '../../../pages/buttonElement';
import {MdKeyboardArrowRight, MdArrowForward} from 'react-icons/md';

const HeroSection = () => {
	const [hover, setHover] = useState(false);

	const onHover = () => {
		setHover(!hover);
	};

	return (
		<div className="hero-container" id="home">
			<div className="hero-bg">
				<video className="video-bg" autoPlay loop muted src={Video} disablePictureInPicture={true} disableRemotePlayback={true} controls={false} type="video/mp4" />
			</div>
			<div className="hero-content">
				<h1 className="hero-h1"> Emma Barua ~ Makeup Artist</h1>
				<p className="hero-p">"Everything has beauty in it, but not everyone sees it" - Confucius</p>
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
