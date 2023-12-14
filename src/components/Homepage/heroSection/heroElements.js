import styled from "styled-components";
import {MdKeyboardArrowRight, MdArrowForward} from "react-icons/md";

export const HeroContainer = styled.div`
	background: #0c0c0c;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 30;
	height: 100vh;
    width: 100vw
	z-index: 1;

	:before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
				180deg,
				rgba(0, 0, 0, 0.2) 0%,
				rgba(0, 0, 0, 0.6) 250%
			),
			linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, transparent 20%);
		z-index: 2;
	}
`;

export const HeroBg = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
`;

export const VideoBg = styled.video`
	width: 100vw;
	height: 100vh;
	-o-object-fit: cover;
	object-fit: cover;
	background: #232a34;
`;

export const HeroContent = styled.div`
	z-index: 3;
	max-width: 1200px;
	padding: 8px 24px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const HeroH1 = styled.h1`
	color: #fff0d8;
	font-size: 48px;
	text-align: center;
	margin-top: 50px;
	z-index: 4;
	@media screen and (max-width: 768px) {
		font-size: 40px;
	}

	@media screen and (max-width: 480px) {
		font-size: 32px;
	}
`;

export const HeroP = styled.p`
	margin-top: 24px;
	color: #fff0d8;
	font-size: 14px;
	text-align: center;
	max-width: 600px;
	z-index: 4;
	font-style: italic;
	@media screen and (max-width: 768px) {
		font-size: 16px;
	}

	@media screen and (max-width: 480px) {
		font-size: 14px;
	}
`;

// export const Button = styled.button`
//     background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)';
//     border: 0;
//     border-radius: 3;
//     box-shadow: '0 3px 5px 2px rgba(255, 105, 135, .3)';
//     color: 'white';
//     height: 48;
//     padding: '0 30px';

// `;

export const HeroBtnWrapper = styled.div`
	margin-top: 50px;
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 4;
`;

export const ArrowForward = styled(MdArrowForward)`
	margin-left: 8px;
	font-size: 20px;
`;

export const ArrowRight = styled(MdKeyboardArrowRight)`
	margin-left: 8px;
	font-size: 20px;
`;
