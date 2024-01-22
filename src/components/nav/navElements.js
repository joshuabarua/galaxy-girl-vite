// import {FaBars, FaFacebook, FaInstagram} from 'react-icons/fa';
// import {NavLink as LinkR} from 'react-router-dom';
// import styled from 'styled-components';

// export const Nav = styled.nav`
// 	background: ${(props) => (props.scrollNav ? 'rgba(36, 0, 59, 0.5)' : '#24003b')};
// 	height: 80px;
// 	width: 100%;
// 	margin-top: -0px;
// 	display: flex;
// 	justify-content: space-between;
// 	padding: 0.5rem calc((100vw - 1000px) / 2);
// 	z-index: 10;
// 	position: fixed;
// 	transition: 0.4s ease-in-out;
// 	top: ${(props) => (props.scrollNav ? '-20%' : '0')};

// 	&:hover {
// 		background: #24003b;
// 	}
// `;

// export const NavLink = styled(LinkR)`
// 	color: ${(props) => (props.scrollNav ? 'transparent' : '#ddd8ff')};
// 	display: flex;
// 	align-items: center;
// 	text-decoration: none;
// 	padding: 0 1rem;
// 	height: 100%;
// 	cursor: pointer;
// 	&.active {
// 		text-underline-offset: 5px;
// 		padding-bottom: 0.3rem;
// 		color: #fff0d8;
// 	}
// 	&:hover {
// 		transition: 0.2s ease-in-out;
// 		-webkit-transition: 0.2s ease-in-out;
// 		-moz-transition: 0.2s ease-in-out;
// 		padding-bottom: 0.3em;
// 		text-decoration-line: underline;
// 		text-decoration-style: solid;
// 		text-underline-offset: 5px;
// 	}
// `;

// export const LogoImg = styled.img`
// 	padding-top: 7px;
// 	max-width: 50px;
// 	transition: 0.5s ease-in-out;
// 	-webkit-transition: 0.5s ease-in-out;
// 	-moz-transition: 0.5s ease-in-out;

// 	transform: scale(1);
// 	-webkit-transform: scale(1);
// 	-moz-transform: scale(1);
// 	&:hover {
// 		transform: scale(1.5);
// 		-webkit-transform: scale(1.5);
// 		-moz-transform: scale(1.5);

// 		transition: 0.5s ease-in;
// 		-webkit-transition: 0.5s ease-in;
// 		/* Start the shake animation and make the animation last for 0.5 seconds */
// 		-webkit-animation: shake 0.9s;
// 		-webkit-animation-iteration-count: infinite;
// 		-moz-animation: shake 0.9s;
// 		animation: shake 0.9s;
// 		/* When the animation is finished, start again */
// 		animation-iteration-count: infinite;
// 		-moz-animation-iteration-count: infinite;
// 	}

// 	@keyframes shake {
// 		0% {
// 			transform: translate(1px, 1px) rotate(0deg);
// 		}
// 		10% {
// 			transform: translate(-1px, -2px) rotate(-1deg);
// 		}
// 		20% {
// 			transform: translate(-3px, 0px) rotate(1deg);
// 		}
// 		30% {
// 			transform: translate(3px, 2px) rotate(0deg);
// 		}
// 		40% {
// 			transform: translate(1px, -1px) rotate(1deg);
// 		}
// 		50% {
// 			transform: translate(-1px, 2px) rotate(-1deg);
// 		}
// 		60% {
// 			transform: translate(-3px, 1px) rotate(0deg);
// 		}
// 		70% {
// 			transform: translate(3px, 1px) rotate(-1deg);
// 		}
// 		80% {
// 			transform: translate(-1px, -1px) rotate(1deg);
// 		}
// 		90% {
// 			transform: translate(1px, 2px) rotate(0deg);
// 		}
// 		100% {
// 			transform: translate(1px, -2px) rotate(-1deg);
// 		}

// 		0% {
// 			-webkit-transform: translate(1px, 1px) rotate(0deg);
// 		}
// 		10% {
// 			-webkit-transform: translate(-1px, -2px) rotate(-1deg);
// 		}
// 		20% {
// 			-webkit-transform: translate(-3px, 0px) rotate(1deg);
// 		}
// 		30% {
// 			-webkit-transform: translate(3px, 2px) rotate(0deg);
// 		}
// 		40% {
// 			-webkit-transform: translate(1px, -1px) rotate(1deg);
// 		}
// 		50% {
// 			-webkit-transform: translate(-1px, 2px) rotate(-1deg);
// 		}
// 		60% {
// 			-webkit-transform: translate(-3px, 1px) rotate(0deg);
// 		}
// 		70% {
// 			-webkit-transform: translate(3px, 1px) rotate(-1deg);
// 		}
// 		80% {
// 			-webkit-transform: translate(-1px, -1px) rotate(1deg);
// 		}
// 		90% {
// 			-webkit-transform: translate(1px, 2px) rotate(0deg);
// 		}
// 		100% {
// 			-webkit-transform: translate(1px, -2px) rotate(-1deg);
// 		}

// 		0% {
// 			-moz-transform: translate(1px, 1px) rotate(0deg);
// 		}
// 		10% {
// 			-moz-transform: translate(-1px, -2px) rotate(-1deg);
// 		}
// 		20% {
// 			-moz-transform: translate(-3px, 0px) rotate(1deg);
// 		}
// 		30% {
// 			-moz-transform: translate(3px, 2px) rotate(0deg);
// 		}
// 		40% {
// 			-moz-transform: translate(1px, -1px) rotate(1deg);
// 		}
// 		50% {
// 			-moz-transform: translate(-1px, 2px) rotate(-1deg);
// 		}
// 		60% {
// 			-moz-transform: translate(-3px, 1px) rotate(0deg);
// 		}
// 		70% {
// 			-moz-transform: translate(3px, 1px) rotate(-1deg);
// 		}
// 		80% {
// 			-moz-transform: translate(-1px, -1px) rotate(1deg);
// 		}
// 		90% {
// 			-moz-transform: translate(1px, 2px) rotate(0deg);
// 		}
// 		100% {
// 			-moz-transform: translate(1px, -2px) rotate(-1deg);
// 		}
// 	}
// `;

// export const Bars = styled(FaBars)`
// 	display: none;
// 	color: #ddd8ff;
// 	@media screen and (max-width: 768px) {
// 		display: block;
// 		position: absolute;
// 		top: 0;
// 		right: 0;
// 		transform: translate(-100%, 75%);
// 		font-size: 1.8rem;
// 		cursor: pointer;
// 	}
// `;

// export const NavMenu = styled.div`
// 	display: flex;
// 	align-items: center;
// 	margin-right: -24px;
// 	white-space: nowrap;
// 	@media screen and (max-width: 768px) {
// 		display: none;
// 	}
// `;

// export const NavBtn = styled.nav`
// 	display: flex;
// 	align-items: center;
// 	margin-right: 24px;

// 	@media screen and (max-width: 768px) {
// 		display: none;
// 	}
// `;

// /* not needed
// export const NavBtnLink = styled(LinkR)`
//   border-radius: 4px;
//   background: #256ce1;
//   padding: 10px 22px;
//   color: #fff;
//   outline: none;
//   border: none;
//   cursor: pointer;
//   transition: all 0.2s ease-in-out;
//   text-decoration: none;
//   margin-left: 24px;
//   &:hover {
//     transition: all 0.2s ease-in-out;
//     background: #fff;
//     color: #010606;
//   }
// `; */

// export const IconFB = styled(FaFacebook)`
// 	border-radius: 15px;
// 	outline: none;
// 	color: #f0d8ff;
// 	border: none;
// 	cursor: pointer;
// 	transition: all 0.2s ease-in-out;
// 	text-decoration: none;
// 	margin-left: 24px;
// 	&:hover {
// 		transition: all 0.2s ease-in-out;
// 		color: #4267b2;
// 		margin-bottom: 0.3em;
// 		transform: scale(1.5);
// 	}
// `;

// export const IconInsta = styled(FaInstagram)`
// 	border-radius: 4px;
// 	outline: none;
// 	color: #f0d8ff;
// 	border: none;
// 	cursor: pointer;
// 	transition: all 0.2s ease-in-out;
// 	text-decoration: none;
// 	margin-left: 24px;

// 	&:hover {
// 		transition: all 0.2s ease-in-out;
// 		color: #e4405f;
// 		margin-bottom: 0.3em;
// 		transform: scale(1.5);
// 	}
// `;
