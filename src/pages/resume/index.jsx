import React, {useState} from 'react';
// import emmaCVpdf from "../../assets/CV/BlankCV.pdf";
import './resume.css';
import {expData, experienceData} from './data';
import {Icon} from '@iconify/react';
import {Stack} from '@mui/material';

const Resume = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	const renderExperienceSection = (sectionData, sectionTitle) => {
		return (
			<div className="section">
				<h3>{sectionTitle.includes('_') ? sectionTitle.replace('_', '/') : sectionTitle}</h3>
				{Object.entries(sectionData).map(([id, data]) => (
					<div key={id} className="experience-item">
						<h4>{data.title}</h4>
						<p>{data.designer}</p>
						<p>{data.role}</p>
						<p>{data.date}</p>
					</div>
				))}
			</div>
		);
	};

	const renderExperienceData = (start, end) => {
		return expData.slice(start, end).map((list) => (
			<React.Fragment key={list.id}>
				<span>
					<h5>{list.title}</h5>
				</span>

				<span>
					<h5>{list.designer} </h5>
				</span>

				<span>
					<h5>{list.role}</h5>
				</span>
			</React.Fragment>
		));
	};

	return (
		<>
			<div style={{scrollBehavior: 'smooth'}}>
				<div className="resume-container">
					<div className="resume-wrapper">
						<button className="downloadBtn">
							<a href="/" download="MUA_EmmaRoby_CV">
								Download CV
							</a>
						</button>

						<div className="resume-contact">
							<text>
								<h2> Emma Robyn</h2>
								<h5> Makeup Artist </h5>
								<h5> Screen Skills Film Trainee 2020-21</h5>
								<h5> Brighton & London </h5>
								<Stack gap={0.5} direction={'row'} display={'flex'} alignItems={'center'}>
									<Icon icon="carbon:phone" />
									<h5>(+44) 1234567890 &nbsp;&nbsp;&nbsp;&nbsp;</h5>
									<Icon icon="carbon:email" />
									<h5> email@email.com </h5>
								</Stack>
							</text>
						</div>

						<div className="resume-bio">
							<text>
								<h4>
									A creative makeup artist looking to work in the film industry by expanding my expertise, knowledge, and repertoire of skills having been accepted as a
									Screenskills 2020/21 trainee. Currently training 1.5 days a week as a Barber in an effort to expand upon my skills during Covid related downtime,
									finishing in July 2021. Based in Brighton, London (close to Pinewood or South East) and Norwich with accommodation at each location.
								</h4>
							</text>
						</div>

						<div className="exp-container">{Object.entries(experienceData).map(([sectionTitle, sectionData]) => renderExperienceSection(sectionData, sectionTitle))}</div>

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
							<h4> References Available on Request</h4>
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
