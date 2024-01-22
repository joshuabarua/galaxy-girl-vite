import React from 'react';
import {FaTimes, FaFacebook, FaInstagram} from 'react-icons/fa';
import {Link as LinkR} from 'react-router-dom';
import './DropdownStyles.css'; // Import the CSS file here

export const Dropdown = ({toggle, isOpen}) => {
	return (
		<aside className="dropdown-container" style={{opacity: isOpen ? '100%' : '0', top: isOpen ? '0' : '-100%'}} onClick={toggle}>
			<div className="icon" onClick={toggle}>
				<FaTimes className="close-icon" />
			</div>

			<div className="dropdown-wrapper">
				<ul className={window.innerWidth <= 480 ? 'dropdown-menu dropdown-menu-small' : 'dropdown-menu'}>
					<LinkR className="dropdown-link" to="/" exact="true" strict="strict" onClick={toggle}>
						Home
					</LinkR>
					<LinkR className="dropdown-link" to="/resume" onClick={toggle}>
						CV
					</LinkR>
					<LinkR className="dropdown-link" to="/portfolio" onClick={toggle}>
						Portfolio
					</LinkR>
					<LinkR className="dropdown-link" to="/contact" onClick={toggle}>
						Contact
					</LinkR>
				</ul>

				<div className="dropdown-btn-wrap">
					<a href="https://www.facebook.com/thegalaxygirl" target="_blank" rel="noreferrer">
						<FaFacebook className="icon-fb" />
					</a>
					<a href="https://www.instagram.com/emmathegalaxygirl/" target="_blank" rel="noreferrer">
						<FaInstagram className="icon-insta" />
					</a>
				</div>
			</div>
		</aside>
	);
};

export default Dropdown;
