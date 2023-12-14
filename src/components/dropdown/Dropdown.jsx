import { React } from "react";
import {
	CloseIcon,
	DropdownContainer,
	Icon,
	DropdownWrapper,
	DropdownMenu,
	DropdownLink,
	DropdownBtnWrap,
	IconFB,
	IconInsta,
} from "./dropdownElements";

export const Dropdown = ({ toggle, isOpen }) => {
	return (
		<DropdownContainer isOpen={isOpen} onClick={toggle}>
			<Icon onClick={toggle}>
				<CloseIcon />
			</Icon>

			<DropdownWrapper>
				<DropdownMenu>
					<DropdownLink to="/" exact="true" strict="strict" onClick={toggle}>
						Home
					</DropdownLink>
					<DropdownLink to="/resume" onClick={toggle}>
						CV
					</DropdownLink>
					<DropdownLink to="/portfolio" onClick={toggle}>
						Portfolio
					</DropdownLink>
					<DropdownLink to="/contact" onClick={toggle}>
						Contact
					</DropdownLink>
				</DropdownMenu>

				<DropdownBtnWrap>
					<a
						href="https://www.facebook.com/thegalaxygirl"
						target="_blank"
						rel="noreferrer"
					>
						<IconFB />
					</a>
					<a
						href="https://www.instagram.com/emmathegalaxygirl/"
						target="_blank"
						rel="noreferrer"
					>
						<IconInsta />
					</a>
				</DropdownBtnWrap>
			</DropdownWrapper>
		</DropdownContainer>
	);
};

export default Dropdown;
