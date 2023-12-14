import React, {useState} from "react";
import Dropdown from "../components/dropdown/Dropdown";
import Navbar from "../components/Homepage/navHomepage/Navbar";
import HeroSection from "../components/Homepage/heroSection/HeroSection";
import InfoSection from "../components/Homepage/infoSection/InfoSection";
import Slider from "../components/slider/Slider";
import ImageSection from "../components/Homepage/imageSection/ImageSection";
import {aboutObjOne} from "../components/Homepage/infoSection/data";

const Home = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div style={{scrollBehavior: "smooth"}}>
			<Dropdown isOpen={isOpen} toggle={toggle} />
			<Navbar toggle={toggle} />
			<HeroSection />
			<InfoSection {...aboutObjOne}> </InfoSection>
			<Slider />
			<ImageSection />
		</div>
	);
};

export default Home;
