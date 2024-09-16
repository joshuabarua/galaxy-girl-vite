import React from 'react';
import HeroSection from '../components/Homepage/heroSection/HeroSection';
import InfoSection from '../components/Homepage/infoSection/InfoSection';
import Slider from '../components/slider/Slider';
import {aboutObjOne, servicesObj} from '../components/Homepage/infoSection/data';
import ServicesSection from '../components/Homepage/servicesSection/ServicesSection';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Home = () => {
	useGSAP(() => {
		const introTimeline = gsap.timeline();

		introTimeline
			.set('.hero-content', {opacity: 1})
			.from('.hero-h1', {
				scale: 3,
				opacity: 0,
				delay: 0.2,
				ease: 'power4.in',
				stagger: 0.3,
			})
			.from(
				'.hero-h2',
				{
					opacity: 0,
					y: 30,
				},
				'+=.5'
			)
			.from('.hero-p', {
				opacity: 0,
				y: 10,
			})
			.from('.hero-btn-wrapper', {
				opacity: 0,
				y: 10,
				duration: 0.6,
			})
			.from('nav', {
				opacity: 0,
				y: -10,
				duration: 0.6,
			});

		const scrollTr = gsap.timeline({
			scrollTrigger: {
				trigger: '.home',
				start: 'top top',
				end: 'bottom bottom',
				scrub: 1.5,
				markers: false,
			},
		});
		scrollTr
			.fromTo(
				'body',
				{
					backgroundColor: '#bfb7f6',
				},
				{
					backgroundColor: '#ddd8ff',
					overwrite: 'auto',
				},
				1
			)
			.from(
				'.top-line',
				{
					scale: 1.3,
					y: 20,
					opacity: 0,
					rotate: -10,
					ease: 'back.out(3)',
					duration: 0.3,
				},
				0.9
			)
			.from('.heading', {
				y: 20,
				opacity: 0,
			})
			.from('.subtitle', {
				y: 20,
				opacity: 0,
			});
	});

	return (
		<div className="home">
			<HeroSection />
			<InfoSection {...aboutObjOne} />
			<Slider />
			<ServicesSection />
		</div>
	);
};

export default Home;
