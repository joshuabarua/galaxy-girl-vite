import React from "react";
import {Icon} from "@iconify/react";
import "./sliderStyles.css";
import perfect10 from "../../assets/images/logos-filmtitles/Perfect10film.jpeg";
import Amw from "../../assets/images/logos-filmtitles/auroraMediaWorldwide.jpg";
import Itv from "../../assets/images/logos-filmtitles/itv-logo.png";
import Baerclaw from "../../assets/images/logos-filmtitles/baerclawproductions.png";
import Goodwood from "../../assets/images/logos-filmtitles/goodwood.png";
import Underglass from "../../assets/images/logos-filmtitles/underglass.png";
import Jacobsminis from "../../assets/images/logos-filmtitles/jacobsminis.png";

const Slider = () => {
	const companies = [
		{logo: Underglass, className: "logosImg4"},
		{logo: Jacobsminis, className: "logosImg3"},
		{logo: "logos:netflix", className: "logosImg", iconSize: "50px"},
		{logo: Goodwood, className: "logosImg2"},
		{logo: "fa-brands:imdb", className: "logosImg2", iconSize: "100px"},
		{logo: perfect10, className: "logosImg2"},
		{logo: "logos:aws", className: "logosImg2", iconSize: "100px"},
		{logo: Amw, className: "logosImg2"},
		{logo: Baerclaw, className: "logosImg2"},
		{logo: Itv, className: "logosImg3"},
		{logo: Underglass, className: "logosImg4"},
		{logo: Jacobsminis, className: "logosImg3"},
		{logo: "logos:netflix", className: "logosImg", iconSize: "50px"},
		{logo: Goodwood, className: "logosImg2"},
		{logo: "fa-brands:imdb", className: "logosImg2", iconSize: "100px"},
		{logo: perfect10, className: "logosImg2"},
		{logo: "logos:aws", className: "logosImg2", iconSize: "100px"},
		{logo: Amw, className: "logosImg2"},
		{logo: Baerclaw, className: "logosImg2"},
		{logo: Itv, className: "logosImg3"},
	];
	//TODO: FIX THIS SLIDER!!
	return (
		<>
			<div className="sliderContainer">
				<div className="slider">
					<ul>
						{companies.map((company, index) => (
							<li key={index}>
								<div className={company.className}>
									{company.iconSize ? (
										<Icon
											icon={company.logo}
											style={{fontSize: company.iconSize || "inherit"}}
										/>
									) : (
										<img src={company.logo} alt="" />
									)}
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
};

export default Slider;
