import React from 'react';
import './resume.css';
import {experienceData} from './data';
import {Stack, useTheme, useMediaQuery} from '@mui/material';
import {FaArrowCircleDown, FaEnvelope, FaPhone} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib';
import ResumeFile from '/src/assets/Emma_Barua_Jr_24.pdf';

const Resume = () => {
	const renderExperienceSection = (sectionData, sectionTitle) => {
		return (
			<div className="section" key={sectionTitle}>
				<h3>{sectionTitle.includes('_') ? sectionTitle.replace('_', '/') : sectionTitle}</h3>
				{Object.entries(sectionData)
					.toReversed()
					.map(([id, data]) => (
						<div className="experience-item" key={id}>
							<h4>{data.title}</h4>
							<p>{`${data.designer} ${data.position ? `- ${data.position}` : ''} `}</p>
							<p>{data.role}</p>
							<p>{data.date}</p>
						</div>
					))}
			</div>
		);
	};

	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<>
			<div style={{scrollBehavior: 'smooth'}}>
				<div className="resume-container">
					<div className="resume-wrapper">
						<div className="downloadBtn" aria-label="Download Resume" style={{right: isSmallScreen ? '40px' : '75px', top: isSmallScreen ? '0px' : '15px'}}>
							<Stack direction={'row'} spacing={isSmallScreen ? 0.5 : 3}>
								<IconContext.Provider
									value={{
										color: '#63E6BE',
										size: isSmallScreen ? '20px' : '30px',
									}}>
									<a href={`tel:${import.meta.env.VITE_PHONE}`}>
										<FaPhone />
									</a>
									<a href={`mailto:${import.meta.env.VITE_EMAIL}`}>
										<FaEnvelope />
									</a>
									<a href={ResumeFile} download={ResumeFile}>
										<FaArrowCircleDown alt="Download Resume" />
									</a>
								</IconContext.Provider>
							</Stack>
						</div>

						<div className="resume-contact">
							<span>
								<h1 className="text-2xl"> Emma Robyn</h1>
								<h5 className="text-xl"> Makeup Junior </h5>
								<h5> Screen Skills Film Trainee Alumni 2021</h5>
								<h5> London | Brighton | Reading </h5>
								<h5> Full UK Driving License </h5>
							</span>
						</div>

						<div className="resume-bio">
							<h4>
								An aspiring makeup artist junior, passionate about creating magic in the world of film and television, excited to enhance my skills and use my craft to aid
								in the storytelling process. Looking to move into the world of SFX makeup.
							</h4>
						</div>

						<div className="exp-container">{Object.entries(experienceData).map(([sectionTitle, sectionData]) => renderExperienceSection(sectionData, sectionTitle))}</div>

						<div className="qualifications">
							<h3>Qualifications and Training</h3>
							<ul>
								<li>Extended Level 3 Theatrical hair and Media Makeup</li>
								<li>Level 2 Barbering</li>
								<li>MOISO 3 day Afro hair skills course - Iver Academy</li>
								<li>Diploma in Gel Polish – accredited by the Guild of Beauty Therapists</li>
								<li>3 Intensive Days Flat mould and SFX training</li>
								<li>Screenskills training -Production safety Passport: Safe management of productions. Tackling Harassment and Bullying at work</li>
								<li>Coronavirus basic awareness on production training.</li>
								<li>Barbicide Certification and Barbicide Covid-19 Certification.</li>
							</ul>
						</div>

						<div className="transferrable-skills">
							<h3>Transferrable Skills</h3>
							<h4>
								Drawing from my hospitality background, I've mastered swift, attentive service and meticulous attention to detail, vital in the time-sensitive and
								detail-oriented realm of makeup artistry and VFX makeup. My experience has ingrained in me stringent hygiene standards, keen customer insight, and robust
								organizational skills, essential for excelling in creative roles that demand precision, client understanding, and effective resource management. These
								transferable skills, coupled with my financial acumen from managing monetary transactions and inventory, make me uniquely equipped to deliver exceptional
								results in the dynamic field of makeup artistry.
							</h4>
						</div>

						<div className="references">
							<h4>
								<strong>References Available on Request</strong>
							</h4>
						</div>

						<div className="gpdr">
							<h5>GDPR STATEMENT: This CV may be kept on file and distributed for employment purposes</h5>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Resume;
