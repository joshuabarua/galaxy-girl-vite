import styled from 'styled-components';

export const InfoContainer = styled.div`
	color: #fff;
	background: ${(props) => (props.lightbg ? '#24003b' : '#ddd8ff')};
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100vw;
	@media screen and (max-width: 768px) {
		padding: 100px 0;
	}
`;

export const InfoWrap = styled.div`
	display: grid;
	z-index: 1;
	height: 100vh;
	width: 100%;
	max-width: 1100px;
	padding: 0 14px;
	justify-content: center;
`;

export const InfoRow = styled.div`
	display: grid;
	grid-auto-columns: minmax(auto, 1fr);
	align-items: center;
	grid-template-areas: ${(props) => (props.imgstart ? `'col2 col1'` : `'col1 col2'`)};

	@media screen and (max-width: 768px) {
		grid-template-areas: ${(props) => (props.imgstart ? `'col1' 'col2'` : `'col1 col1' 'col2 col2'`)};
	}
`;

export const Column1 = styled.div`
	margin-bottom: 25px;
	padding: 10px 15px;
	grid-area: col1;
`;
export const Column2 = styled.div`
	padding: 0 15px;
	grid-area: col2;
`;

export const TextWrap = styled.div`
	padding-top: 0;
	padding-bottom: 60px;
`;

export const TopLine = styled.p`
	color: #01cf71;
	font-size: 18px;
	line-height: 16px;
	font-weight: 700;
	letter-spacing: 1.4px;
	text-transform: uppercase;
	margin-bottom: 16px;
`;

export const Heading = styled.h1`
	color: ${(props) => (props.dark_text ? '#ddd8ff' : '#24003b')};
	font-size: 48px;
	line-height: 1.1;
	font-weight: 600;
	margin-bottom: 24px;

	@media screen and (max-width: 768px) {
		font-size: 28px;
	}
`;

export const Subtitle = styled.p`
	color: ${(props) => (props.dark_text ? '#ddd8ff' : '#24003b')};
	font-size: 18px;
	line-height: 24px;
`;

export const BtnWrap = styled.div`
	display: flex;
	justify-content: flex-start;
	margin-bottom: 20px;
`;

export const ImgWrap = styled.div`
	max-width: 555px;
	height: 100%;
`;

export const Img = styled.img`
	width: 100%;
	border-radius: 12px;
`;
