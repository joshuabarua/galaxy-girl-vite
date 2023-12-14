import styled from 'styled-components';
import {FaTimes, FaFacebook, FaInstagram} from 'react-icons/fa';
import {Link as LinkR} from 'react-router-dom';

export const DropdownContainer = styled.aside`
	position: fixed;
	z-index: 999;
	width: 100%;
	height: 100%;
	background: #24003b;
	display: grid;
	align-items: center;
	top: 0;
	left: 0;
	transition: 0.3s ease-in-out;
	opacity: ${(props) => (props.isOpen ? '100%' : '0')};
	top: ${(props) => (props.isOpen ? '0' : '-100%')};
`;

export const CloseIcon = styled(FaTimes)`
	color: #fff0d8;
`;

export const Icon = styled.div`
	position: absolute;
	top: 1.2rem;
	right: 1.5rem;
	background: transparent;
	font-size: 2rem;
	cursor: pointer;
	outline: none;
`;
export const DropdownWrapper = styled.div`
	color: gray;
`;

export const DropdownMenu = styled.ul`
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: repeat(6, 80px);
	text-align: center;

	@media screen and (max-width: 480px) {
		grid-template-rows: repeat(6, 60px);
	}
`;

export const DropdownLink = styled(LinkR)`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.5rem;
	text-decoration: none;
	list-style: none;
	transition: 0.2s ease-in-out;
	color: #ddd8ff;
	cursor: pointer;
	&.active {
		text-decoration-line: underline !important;
		text-decoration-style: solid;
		padding-bottom: 0.3rem;
		color: #fff0d8;
	}
	&:hover {
		color: #fff0d8;
		transition: 0.2s ease-in-out;
		text-decoration-line: underline;
		text-decoration-style: wavy;
		padding-bottom: 0.3em;
	}
`;

export const DropdownBtnWrap = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 24px;
`;

export const IconFB = styled(FaFacebook)`
	border-radius: 15px;
	outline: none;
	color: #f0d8ff;
	border: none;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	text-decoration: none;
	margin-left: 24px;
	&:hover {
		transition: all 0.2s ease-in-out;
		color: #4267b2;
		transform: scale(1.5);
	}
`;

export const IconInsta = styled(FaInstagram)`
	border-radius: 4px;
	outline: none;
	color: #f0d8ff;
	border: none;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	text-decoration: none;
	margin-left: 24px;

	&:hover {
		transition: all 0.2s ease-in-out;
		color: #e4405f;
		transform: scale(1.5);
	}
`;
