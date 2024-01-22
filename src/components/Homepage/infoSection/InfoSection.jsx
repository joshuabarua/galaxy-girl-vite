import React from 'react';
import {Button} from '../../../pages/buttonElement';
import {InfoContainer, InfoWrap, InfoRow, Column1, Column2, TextWrap, TopLine, Heading, Subtitle, BtnWrap, ImgWrap, Img} from './infoElements';
import EmmaPic from '../../../assets/images/em2.jpg';

const InfoSection = ({lightBg, lightText, imgStart, topLine, headline, darkText, description, buttonLabel, alt, id}) => {
	return (
		<div className={`info-container ${lightBg ? 'light-bg' : ''}`} id={id} style={{background: lightBg ? '#24003b' : '#ddd8ff'}}>
			<div className="info-wrap">
				<div className={`info-row ${imgStart ? 'img-start' : ''}`} style={{gridTemplateAreas: imgStart ? `'col2 col1'` : `'col1 col2'`}}>
					<div className="column1">
						<div className="text-wrap">
							<p className="top-line"> {topLine} </p>
							<h1 className={`heading ${lightText ? 'light-text' : ''}`} style={{color: darkText ? '#ddd8ff' : '#24003b'}}>
								{headline}
							</h1>
							<p className={`subtitle ${darkText ? 'dark-text' : ''}`} style={{color: darkText ? '#ddd8ff' : '#24003b'}}>
								{description}
							</p>
						</div>
						<div className="btn-wrap">
							<Button to="/portfolio" primary="true" dark="true">
								{buttonLabel}
							</Button>
						</div>
					</div>
					<div className="column2">
						<div className="img-wrap">
							<img src={EmmaPic} alt={alt} className="infoSectionImg" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InfoSection;
