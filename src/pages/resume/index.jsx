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
							<p>{data.title}</p>
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
								Working in hospitality has allowed me to effectively manage my time cluring short turn arounds, promptly resolving issues and anticipating needs while
								delivering a fast, frienclly service. It's also taught me to mal‹e great tea and coffee! I have training in hygiene, health and safety and customer service.
								I've managed opening and closing cluties inclucling reconciliation of the cash drawer, so I have cash handling sl‹ills, as well as overseeing and
								prioritising daily tasl‹s and handling stocl‹ control.
							</h4>
						</div>

						<div className="references">
							<h4>
								<strong>References Available on Request</strong>
							</h4>
						</div>

						<div className="gpdr italic felx flex-col">
							<h5>GDPR STATEMENT</h5>
							<h5>This CV may be kept on file and distributed for employment purposes</h5>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Resume;
