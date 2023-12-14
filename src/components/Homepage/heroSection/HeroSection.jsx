import React, {useState} from "react";
import Video from "../../../assets/videos/video4.mp4";
import {
	HeroContainer,
	HeroBg,
	VideoBg,
	HeroContent,
	HeroH1,
	HeroP,
	HeroBtnWrapper,
	ArrowForward,
	ArrowRight,
} from "./heroElements";
import {Button} from "../../../pages/buttonElement";

const HeroSection = () => {
	const [hover, setHover] = useState(false);

	const onHover = () => {
		setHover(!hover);
	};

	return (
		<div style={{display: "flex", width: "100vw", justifyContent: "center"}}>
			<HeroContainer id="home">
				<HeroBg>
					<VideoBg autoPlay loop muted src={Video} type="video/mp4" />
				</HeroBg>
				<HeroContent>
					<HeroH1> Emma Barua ~ Makeup Artist</HeroH1>
					<HeroP>
						"Everything has beauty in it, but not everyone sees it" - Confucius
					</HeroP>
					<HeroBtnWrapper>
						<Button
							to="/contact"
							onMouseEnter={onHover}
							onMouseLeave={onHover}
							primary="true"
							dark="true"
						>
							Work with me! {hover ? <ArrowForward /> : <ArrowRight />}
						</Button>
					</HeroBtnWrapper>
				</HeroContent>
			</HeroContainer>
		</div>
	);
};

export default HeroSection;
