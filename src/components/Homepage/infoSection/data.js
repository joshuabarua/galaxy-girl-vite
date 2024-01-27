import filmtv from '../../../assets/images/services-icons/filmtv.png';
import commercials from '../../../assets/images/services-icons/commercials.png';
import theatre from '../../../assets/images/services-icons/theatre.png';
import workshops from '../../../assets/images/services-icons/workshops.png';
import fashion from '../../../assets/images/services-icons/fashion.png';
import bespoke from '../../../assets/images/services-icons/bespoke.png';
import emImg2 from '../../../assets/images/em2.jpg';
import emImg3 from '../../../assets/images/em1.jpg';

export const aboutObjOne = {
	id: 'about',
	lightBg: false,
	lightText: true,
	lightTextDesc: true,
	topLine: 'About Me',
	headline: `Welcome! I'm Emma, your go-to Makeup and Special Effects (SFX) virtuoso.`,
	description:
		"With a vibrant journey of over 5 years, I've honed my craft in the realms of beauty and media makeup, leaving a trail of awe-inspiring transformations. My expertise isn't just skin deep; it's rooted in comprehensive training that spans barbering, film, and television, ensuring every brushstroke tells a story. I invite you to immerse yourself in my meticulously curated portfolio, a testament to my dedication and artistic flair. While you're there, don't miss my CV, a chronicle of my professional odyssey. Eager to bring your vision to life? Let's connect! Drop me a message, and let's sculpt the extraordinary together.",
	buttonLabel: 'Explore My Artistry',
	imgStart: true,
	imgEm: emImg2,
	alt: 'Emma Barua',
	dark: true,
	primary: true,
	darkText: false,
};

export const servicesObj = {
	id: 'services',
	lightBg: false,
	lightText: false,
	lightTextDesc: true,
	topLine: 'Services',
	headline: `Discover the Magic of Makeup Artistry`,
	services: {
		filmtv: {
			title: 'Film & Television',
			description:
				'From Netflix dramas to ITV’s live segments, I bring narratives to life with my diverse skill set, adapting from subtle enhancements to vibrant transformations.',
			icon: filmtv,
		},
		commercial: {
			title: 'Commercial & Advertising',
			description:
				' Partner with me for campaigns that resonate. My portfolio includes major brands like Jacob’s Mini Cheddars and Amazon Web Services, ensuring your message is impactful and memorable.',
			icon: commercials,
		},
		theatre: {
			title: 'Theatre & Performance',
			description:
				"Experience the magic of theatre and performance makeup. Whether it's for a local play or a high-profile fashion show, I capture the essence of each character with meticulous detail.",
			icon: theatre,
		},
		workshops: {
			title: 'Workshops & Training',
			description:
				'Join my transformative workshops where I share my extensive knowledge, from SFX casualty makeup to intensive training sessions, nurturing the next generation of makeup artists.',
			icon: workshops,
		},
		fashion: {
			title: 'Fashion & Editorial',
			description:
				'Elevate your fashion projects with my creative flair. From fashion shows to editorial shoots, my work ensures your project is the epitome of style and sophistication.',
			icon: fashion,
		},
		bespoke: {
			title: 'Bespoke Services',
			description: 'Tailored for your special occasions, from weddings to events, I provide personalized makeup services that ensure you look and feel your absolute best.',
			icon: bespoke,
		},
	},
	imgStart: false,
	alt: 'Emma Robyn at Work',
	dark: true,
	primary: true,
	darkText: false,
};
