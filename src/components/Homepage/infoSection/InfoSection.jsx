import React from 'react';
import {Button} from '../../../pages/buttonElement';
import './infoSectionStyles.css';
import BrushStrokeImg from '../../../assets/images/abstract/BrushStroke4.png';
import BrushStrokeImg2 from '../../../assets/images/abstract/BrushStroke2.png';
import BrushStrokeImg3 from '../../../assets/images/abstract/BrushStroke9.png';
import BrushStrokeImg4 from '../../../assets/images/abstract/BrushStroke3.png';
import BrushStrokeImg5 from '../../../assets/images/abstract/BrushStroke6.png';

const InfoSection = ({lightBg, lightText, imgStart, topLine, headline, darkText, description, buttonLabel, alt, imgEm, services}) => {
	return (
		<div className={`${services ? 'info-container-services' : 'info-container'} ${lightBg ? 'light-bg' : ''}`} style={{background: lightBg ? '#24003b' : '#ddd8ff'}}>
			<div className={`info-row ${imgStart ? 'img-start' : ''}`}>
				{imgEm && (
					<div className="img-wrap">
						<img src={imgEm} alt={alt} className="infoSectionImg" />
						<img
							src={BrushStrokeImg3}
							alt="imghere"
							style={{width: '10vw', minWidth: '200px', position: 'absolute', zIndex: -1, right: '-25px', marginTop: '-200px', transform: 'rotate(50deg)', opacity: '60%'}}
						/>
						<img
							src={BrushStrokeImg4}
							alt="imghere"
							style={{
								width: '10vw',
								minWidth: '150px',
								position: 'absolute',
								zIndex: -1,
								left: '50px',
								marginBottom: '-700px',
								transform: 'rotate(100deg)',
								opacity: '60%',
							}}
						/>
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
								<img
									src={BrushStrokeImg}
									alt="imghere"
									style={{height: '200px', position: 'absolute', zIndex: -1, right: '10%', marginBottom: '900px', transform: 'rotate(30deg)', opacity: '60%'}}
								/>
								{Object.entries(services).map(([key, {description, icon, title}]) => (
									<div key={key} className="service-item">
										<div className="service-title">
											<img src={icon} alt={`${key}-icon`} className="service-icon" />
											<h2 style={{color: '#24003b', fontWeight: 700}}>{title}</h2>
										</div>
										<p
											className={`subtitle ${darkText ? 'dark-text' : ''}`}
											style={{
												color: darkText ? '#ddd8ff' : '#24003b',
												fontStyle: 'italic',
											}}>
											{description}
										</p>
									</div>
								))}
								<img
									src={BrushStrokeImg2}
									alt="imghere"
									style={{
										height: '100px',
										position: 'absolute',
										zIndex: -1,
										left: '4%',
										marginTop: '400px',
										transform: 'rotate(10deg)',
										opacity: '60%',
										overflow: 'hidden',
									}}
								/>
							</div>
						) : (
							<>
								<p className={`subtitle ${darkText ? 'dark-text' : ''}`} style={{color: darkText ? '#ddd8ff' : '#24003b'}}>
									{description}
								</p>
								<div className="btn-wrap">
									<Button to="/contact" primary="true" dark="true">
										{buttonLabel}
									</Button>
									<img
										src={BrushStrokeImg5}
										alt="imghere"
										style={{
											width: '10vw',
											minWidth: '200px',
											position: 'absolute',
											zIndex: -1,
											right: '25%',
											marginTop: '-100px',
											transform: 'rotate(70deg)',
											opacity: '60%',
										}}
									/>
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
