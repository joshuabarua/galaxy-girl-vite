import React, {useState} from 'react';
import HeroSection from '../components/Homepage/heroSection/HeroSection';
import InfoSection from '../components/Homepage/infoSection/InfoSection';
import Slider from '../components/slider/Slider';
import ImageSection from '../components/Homepage/imageSection/ImageSection';
import {aboutObjOne, servicesObj} from '../components/Homepage/infoSection/data';

const Home = () => {
	return (
		<div style={{scrollBehavior: 'smooth'}}>
			<HeroSection />
			<InfoSection {...aboutObjOne} />
			<Slider />
			<InfoSection {...servicesObj} />
			<ImageSection />
		</div>
	);
};

export default Home;
