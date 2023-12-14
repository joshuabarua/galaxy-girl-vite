import React, {useState} from "react";
import {
	ResumeContainer,
	ResumeWrapper,
	ResumeContact,
	ResumeBio,
	WorkExperienceTitle,
	WorkExperienceData,
	TVExpTitle,
	TvExpData,
	CommercialExpTitle,
	CommercialExpData,
	QualificationTraining,
	TheatreExpTitle,
	TheatreExpData,
	WorkshopsExpTitle,
	WorkshopsExpData,
	FashionExpTitle,
	FashionExpData,
	VideogamesExpTitle,
	ClosingFoot,
	ReferencesReq,
	VideogamesExpData,
	TransferrableSkills,
} from "./resumeElements";
import Navbar from "../../components/nav/Navbar";
import Dropdown from "../../components/dropdown/Dropdown";
// import emmaCVpdf from "../../assets/CV/BlankCV.pdf";
import "./resume.css";

const Resume = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	const expData = [
		{
			id: 1,
			title: "Netflix 6 part Docu-drama – April 2021",
			designer: "Jo Barass - Short Makeup Desginer, Raw TV",
			role: "Crowd Makeup artist trainee daily",
		},
		{
			id: 2,
			title: "Perfect 10 (BBC iFeatures film) - Aug 2018",
			designer: "Elizabeth Samways – Production coordinator",
			role: "Crowd makeup artist daily - film featured at BFI festival, London 2019",
		},
		{
			id: 3,
			title: "The time machine (Short film) - May 2018",
			designer: "Matthew Grant – Director",
			role: "Makeup artist - SFX",
		},
		{
			id: 4,
			title: "Roses (short student film) - May 2018",
			designer: "Elizabeth Samways – production coordinator",
			role: "Makeup artist - Brighton University film. Beauty & casualty",
		},
		{
			id: 5,
			title: "Under Glass (short student film) - Sept 2017 shorturl.at/pyGLW",
			designer: "James Hart - Director",
			role: "Crowd Makeup artist - Men’s makeup. Brighton University film",
		},
		{
			id: 6,
			title: "ITV’s Goodwood Revival – Sept 2019",
			designer: "Aurora Media Worldwide",
			role: "Makeup artist - Period makeup for Zoe Hardman, for live & recorded segments",
		},
		{
			id: 7,
			title: "Jacob’s mini cheddars Advert – April 2017",
			designer: "Carol Hart – Makeup Designer",
			role: "Makeup Trainee",
		},
		{
			id: 8,
			title: "The Roar App – Oct 2016",
			designer: "The Noise Next Door Comedy Troupe",
			role: "Makeup artist - Men’s Makeup. Social media campaign",
		},
		{
			id: 9,
			title: "Amazon Web Services - June 2019",
			designer: "Baerclaw Productions Elizabeth Samways – Production coordinator",
			role: "Makeup artist",
		},
		{
			id: 10,
			title: "Medical Virtual Reality at Dimension Studios – Jan 2018",
			designer: "Jon Moore – Head makeup designer",
			role: "Makeup artist assistant - VR test shoots for Medical VR. Application and removal of SFX makeup",
		},
		{
			id: 11,
			title: "Alcina (local theatre production) - Nov 2016",
			designer: "Joe Paxton - Director",
			role: "Makeup artist - face & body paint",
		},
		{
			id: 12,
			title: "ILS ltd SFX Workshop (International Location Safety) - Oct 2018",
			designer: "ILS ltd",
			role: "Makeup artist – Teaching basic SFX casualty makeup for company’s NGO training program",
		},
		{
			id: 13,
			title: "Betty Lou Vintage - June 2017 – Present",
			designer: "Owned by Elizabeth Samways and Emily Dauris",
			role: "Makeup artist - Vintage themed Weddings and Hen Parties",
		},
		{
			id: 14,
			title: "Boudoir and Creative Photoshoots –May2017 – Present (May 2021)",
			designer: "Susan Grace Hinman - Owner & Photographer",
			role: "Makeup artist - Boudoir photoshoot packages offered by creative photographer and creative hair and makeup for editorial",
		},
		{
			id: 15,
			title: "Self employed – July 2016 - Present",
			designer: "Self Employed",
			role: "Makeup artist - Working on clients for various events, weddings, etc",
		},
		{
			id: 16,
			title: "Peaky Blinders Charity Fashion show at the Grand Hotel, Brighton – May 2018",
			designer: "Hosted by Stephanie Prior",
			role: "Makeup artist",
		},
		{
			id: 17,
			title: "Brighton university fashion show b19/b20 - May 2017",
			designer: "Brighton University students",
			role: "Makeup artist",
		},
		{
			id: 18,
			title: "Horror virtual reality at Dimension Studios – Dec 2017",
			designer: "Jon Moore – Head makeup designer",
			role: "Makeup artist assistant - Assisting with SFX makeup application and removal",
		},
	];

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
		<div style={{scrollBehavior: "smooth"}}>
			<ResumeContainer>
				<Dropdown isOpen={isOpen} toggle={toggle} />
				<Navbar toggle={toggle} />
				<ResumeWrapper>
					<button className="downloadBtn">
						<a href="/" download="MUA_EmmaRoby_CV">
							Download CV
						</a>
					</button>

					<ResumeContact>
						<text>
							<h2> Emma Robyn </h2>
							<h6> Makeup Artist Trainee </h6>
							<h6> ScreenSkills Film Trainee 2020-21</h6>
							<h6> Brighton and London based, willing to travel </h6>
							<h6>
								M: (+44) 1234567890 &nbsp;&nbsp;&nbsp;&nbsp; E:
								email@email.com{" "}
							</h6>
						</text>
					</ResumeContact>

					<ResumeBio>
						<text>
							<h4>
								A creative makeup artist looking to work in the film industry
								by expanding my expertise, knowledge, and repertoire of
								skills having been accepted as a Screenskills 2020/21
								trainee. Currently training 1.5 days a week as a Barber in an
								effort to expand upon my skills during Covid related
								downtime, finishing in July 2021. Based in Brighton, London
								(close to Pinewood or South East) and Norwich with
								accommodation at each location.
							</h4>
						</text>
					</ResumeBio>

					<WorkExperienceTitle>
						<text>
							<h3>Work Experience</h3>
							<h4>Films / Short Films</h4>
						</text>
					</WorkExperienceTitle>

					<WorkExperienceData>
						<span>
							<h4>Job / Title</h4>
						</span>

						<span>
							<h4>Designer/Production</h4>
						</span>

						<span>
							<h4>Role & Job Details</h4>
						</span>

						{renderExperienceData(0, 5)}
					</WorkExperienceData>

					<TVExpTitle>
						<h4>TV / Adverts</h4>
					</TVExpTitle>

					<TvExpData>{renderExperienceData(5, 8)}</TvExpData>

					<CommercialExpTitle>
						<h4>Commercial / Internal Videos</h4>
					</CommercialExpTitle>

					<CommercialExpData>{renderExperienceData(8, 10)}</CommercialExpData>

					<TheatreExpTitle>
						<h4>Theatre</h4>
					</TheatreExpTitle>

					<TheatreExpData>{renderExperienceData(10, 11)}</TheatreExpData>

					<WorkshopsExpTitle>
						<h4>Workshops</h4>
					</WorkshopsExpTitle>

					<WorkshopsExpData>{renderExperienceData(11, 12)}</WorkshopsExpData>

					<FashionExpTitle>
						<h4>Fashion</h4>
					</FashionExpTitle>

					<FashionExpData>{renderExperienceData(12, 14)}</FashionExpData>

					<VideogamesExpTitle>
						<h4>Video Games</h4>
					</VideogamesExpTitle>

					<VideogamesExpData>{renderExperienceData(14, 15)}</VideogamesExpData>

					<QualificationTraining>
						<h3>Qualifications & Training </h3>
						<div className="qualificatonList">
							<ul>
								<li>
									<h5>
										Extended Level 3 Diploma in Theatrical hair and Media
										Makeup – Grade: Distinction
									</h5>
								</li>
								<li>
									<h5>
										Diploma in Gel Polish, accredited by the Guild of
										Beauty Therapists
									</h5>
								</li>
								<li>
									<h5>
										Intensive Flat mould & SFX training with Laura Odette
										Phipps
									</h5>
								</li>
								<li>
									<h5>
										Screenskills training: Production safety Passport (Safe
										management of productions)
									</h5>
								</li>
								<li>
									<h5>
										Screenskills training: Tackling harassment and bullying
										at work & Coronavirus basic awareness on production
										training
									</h5>
								</li>
								<li>
									<h5> Barbicide & Barbicide Covid-19 Certifications </h5>
								</li>
								<li>
									<h5>Kryolan Casualty Effects and Camouflage Workshop </h5>
								</li>
								<li>
									<h5> Online Workshop with Naomi Donne </h5>
								</li>
								<li>
									<h5> Barbering Level 2 – in progress </h5>
								</li>
							</ul>
						</div>
					</QualificationTraining>

					<TransferrableSkills>
						<h3>Transferrable Skills</h3>
						<h6>
							Working in hospitality has allowed me to effectively manage my
							time during short turn arounds, promptly resolving issues and
							anticipating needs while delivering a fast, friendly service.
							It’s also taught me to make great tea and coffee! I’ve training
							in hygiene, health and safety and customer service. I’ve managed
							opening and closing duties including reconciliation of the cash
							drawer, so I’ve cash handling skills as well as overseeing and
							prioritizing daily tasks and handling stock control.
						</h6>
					</TransferrableSkills>

					<ReferencesReq>
						<h4> References Available on Request</h4>
					</ReferencesReq>

					<ClosingFoot>
						<h5>
							GDPR STATEMENT: This CV may be kept on file and distributed for
							employment purposes
						</h5>
					</ClosingFoot>
				</ResumeWrapper>
			</ResumeContainer>
		</div>
	);
};

export default Resume;
