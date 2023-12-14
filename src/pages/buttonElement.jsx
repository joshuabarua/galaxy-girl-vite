import styled from "styled-components";
import {Link} from "react-router-dom";

export const Button = styled(Link)`
	border-radius: 50px;
	width: 20vw;
	min-width: 150px;
	max-width: 225px;
	background: ${({primary}) => (primary ? "#7ce095" : "#62ffc2")};
	white-space: nowrap;
	padding: ${({big}) => (big ? "14px 48px" : "12px 30px")};
	color: ${({dark}) => (dark ? "#24003b" : "#7ce095")};
	font-size: ${({fontBig}) => (fontBig ? "28px" : "14px")};
	outline: none;
	border: none;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 0.2s ease-in-out;
	text-decoration: none !important;
	&:hover {
		transition: all 0.2s ease-in-out;
		background: ${({primary}) => (primary ? "#fff0d8" : "#62ffc2")};
	}
`;
