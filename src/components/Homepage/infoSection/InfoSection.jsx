import React from 'react';
import {Button} from '../../../pages/buttonElement';
import './infoSectionStyles.css';

const InfoSection = ({lightBg, lightText, imgStart, topLine, headline, darkText, description, buttonLabel, alt, imgEm, services}) => {
	return (
		<div className={`info-container ${lightBg ? 'light-bg' : ''}`} style={{background: lightBg ? '#24003b' : '#ddd8ff'}}>
			<div className={`info-row ${imgStart ? 'img-start' : ''}`}>
				{imgEm && (
					<div className="img-wrap">
						<img src={imgEm} alt={alt} className="infoSectionImg" />
					</div>
				)}
				<div className="text-area">
					<div className="text-wrap">
						<p className="top-line"> {topLine} </p>
						<h1 className={`heading ${lightText ? 'light-text' : ''}`} style={{color: darkText ? '#ddd8ff' : '#24003b'}}>
							{headline}
						</h1>
						{services ? (
							<div className="services-container">
								{Object.entries(services).map(([key, {description, icon}]) => (
									<div key={key} className="service-item">
										<img src={icon} alt={`${key}-icon`} className="service-icon" />
										<p className={`subtitle ${darkText ? 'dark-text' : ''}`} style={{color: darkText ? '#ddd8ff' : '#24003b'}}>
											{description}
										</p>
									</div>
								))}
							</div>
						) : (
							<>
								<p className={`subtitle ${darkText ? 'dark-text' : ''}`} style={{color: darkText ? '#ddd8ff' : '#24003b'}}>
									{description}
								</p>
								<div className="btn-wrap">
									<Button to="/portfolio" primary="true" dark="true">
										{buttonLabel}
									</Button>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default InfoSection;
