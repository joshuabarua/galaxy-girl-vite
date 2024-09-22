import React from 'react';
import {Icon} from '@iconify/react';
import './sliderStyles.css';
import perfect10 from '../../assets/images/logos-filmtitles/Perfect10film_resized.jpeg';
import Amw from '../../assets/images/logos-filmtitles/auroraMediaWorldwide.jpg';
import Itv from '../../assets/images/logos-filmtitles/itv-hub-100.png';
import Aws from '../../assets/images/logos-filmtitles/aws-100.png';
import Imdb from '../../assets/images/logos-filmtitles/imdb-100.png';
import Netflix from '../../assets/images/logos-filmtitles/netflix-100.png';
import Baerclaw from '../../assets/images/logos-filmtitles/baerclawproductions_enhanced.png';
import Goodwood from '../../assets/images/logos-filmtitles/goodwood_enhanced.png';
import Underglass from '../../assets/images/logos-filmtitles/underglass_enhanced.png';
import Jacobsminis from '../../assets/images/logos-filmtitles/jacobsminis_resized.png';
import Marquee from 'react-fast-marquee';

const Slider = () => {
	const companies = [
		{logo: Jacobsminis, className: 'logosImg3'},
		{logo: Imdb, className: 'logosImg2'},
		{logo: Netflix, className: 'logosImg2'},
		{logo: perfect10, className: 'logosImg2'},
		{logo: Itv, className: 'logosImg2'},
		{logo: Amw, className: 'logosImg2'},
		{logo: Aws, className: 'logosImg2'},
	];

	return (
		<div className="marquee-container flex">
			<Marquee speed={100} gradient={false}>
				{companies.map((company, index) => {
					return <img key={index} src={company.logo} className={`${company.className} marquee-logo size-20 rounded-sm`} style={{margin: '0 40px'}} alt="company-logo" />;
				})}
			</Marquee>
		</div>
	);
};

export default Slider;
