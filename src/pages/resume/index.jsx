import React, {useState} from 'react';
// import emmaCVpdf from "../../assets/CV/BlankCV.pdf";
import './resume.css';
import {expData, experienceData} from './data';
import {Icon} from '@iconify/react';
import {Stack} from '@mui/material';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {FaArrowCircleDown} from 'react-icons/fa';
import {IconContext} from 'react-icons/lib';
import ResumeFile from '/src/assets/Emma_Barua_CV_trainee_mua.pdf';

const Resume = () => {
	const renderExperienceSection = (sectionData, sectionTitle) => {
		return (
			<div className="section" key={sectionTitle}>
				<h3>{sectionTitle.includes('_') ? sectionTitle.replace('_', '/') : sectionTitle}</h3>
				{Object.entries(sectionData)
					.toReversed()
					.map(([id, data]) => (
						<div key={id} className="experience-item">
							<h4>{data.title}</h4>
							<p>{`${data.designer} ${data.position ? `- ${data.position}` : ''} `}</p>
							{/* <p>{data.designer2 ? data.designer2 : ''}</p>
						<p>{data.position2 ? data.position2 : ''}</p> */}
							<p>{data.role}</p>
							<p>{data.date}</p>
						</div>
					))}
			</div>
		);
	};

	return (
		<>
			<div style={{scrollBehavior: 'smooth'}}>
				<div className="resume-container">
					<div className="resume-wrapper">
						<div className="downloadBtn" aria-label="Download Resume">
							<IconContext.Provider
								value={{
									color: '#63E6BE',
									size: '40px',
								}}>
								<a href={ResumeFile} download={ResumeFile} style={{textDecoration: 'none'}}>
									<FaArrowCircleDown alt="Download Resume" />
								</a>
							</IconContext.Provider>
						</div>

						<div className="resume-contact">
							<span>
								<h2> Emma Robyn</h2>
								<h5> Makeup Artist Trainee </h5>
								<h5> Screen Skills Film Trainee 2020-21</h5>
								<h5> London & Brighton based, willing to travel </h5>
								<h5> Level 3 Theatrical Hair & Media Makeup </h5>
								<h5>Level 2 Barbering</h5>
								<h5> Full UK Driving License </h5>

								<Stack gap={0.5} direction={'row'} display={'flex'} alignItems={'center'}>
									<Icon icon="carbon:phone" />
									<h5>07449 203 870</h5>
									<Icon icon="carbon:email" />
									<h5> emmabarua@yahoo.co.uk </h5>
								</Stack>
							</span>
						</div>

						<div className="resume-bio">
							<h4>
								A creative makeup artist looking to work in the film industry by expanding my expertise, knowledge, and repertoire of skills having been accepted as a
								Screenskills 2020/21 trainee.
							</h4>
						</div>

						<div className="exp-container">{Object.entries(experienceData).map(([sectionTitle, sectionData]) => renderExperienceSection(sectionData, sectionTitle))}</div>
						<div className="qualifications">
							<h3>Qualifications and Training</h3>
							<ul>
								<li>Extended Level 3 Diploma in Theatrical hair and Media Makeup – Grade: Distinction.</li>
								<li>Diploma in Gel Polish – accredited by the Guild of Beauty Therapists.</li>
								<li>3 intensive Days Flat mould and SFX training with Laura Odette Phipps.</li>
								<li>Screenskills training -Production safety Passport (Safe management of productions). Tackling Harassment and Bullying at work</li>
								<li>Coronavirus basic awareness on production training.</li>
								<li>Barbicide Certification and Barbicide Covid-19 Certification.</li>
								<li>Kryolan Casualty effects and Camouflage workshop.</li>
								<li>Online Workshop with Naomi Donne.</li>
								<li>Level 2 Barbering</li>
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
