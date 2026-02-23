import React, { useEffect, useState, useRef } from "react";
import resumeData from "./resumeData.json";
import { useGrained } from "../../hooks/useGrained";
import { useFadeUpStagger } from "../../hooks/useFadeUpStagger";

const ResumeMinimal = () => {
	const getProjectFontClass = (title) => {
		if (!title) return "";
		const t = title.toLowerCase();
		if (t.includes("death of bunny monroe")) return "font-bunny";
		if (t.startsWith("the franchise")) return "font-franchise";
		if (t.startsWith("blitz")) return "font-blitz";
		if (t.includes("house of dragon")) return "font-house-of-dragon";
		if (t.includes("witcher")) return "font-witcher";
		if (t.includes("empire of light")) return "font-empire-of-light";
		if (t.includes("allelujah")) return "font-allelujah";
		if (t.includes("netflix")) return "font-netflix";
		if (t.includes("amazon")) return "font-amazon";
		if (t.includes("itv")) return "font-itv";
		if (t.includes("peaky")) return "font-peaky";
		return "";
	};

	const renderProjectTitle = (title) => {
		if (!title) return null;
		const t = title.toUpperCase();
		if (t.includes("DEATH") && t.includes("BUNNY")) {
			const partThe = "THE ";
			const partDeath = "DEATH";
			const partRest = " OF BUNNY MONRO";
			return (
				<>
					<span className="bunny-the">{partThe}</span>
					<span className="bunny-part-2">{partDeath}</span>
					<span className="bunny-rest">{partRest}</span>
				</>
			);
		}
		if (t.includes("EMPIRE OF LIGHT")) {
			const partEmpire = "Empire ";
			const partOf = "of";
			const partLight = " Light";
			return (
				<>
					<span className="empire">{partEmpire}</span>
					<span className="empire-of">{partOf}</span>
					<span className="empire">{partLight}</span>
				</>
			);
		}

		return title;
	};

	useGrained("resume-minimal-bg", {
		grainOpacity: 0.055,
		grainDensity: 1.7,
		grainWidth: 0.95,
		grainHeight: 0.95,
		grainChaos: 1.8,
		grainSpeed: 5,
		animate: true,
		bubbles: false,
	});

	useEffect(() => {
		document.documentElement.classList.remove("home-snap");
		document.body.classList.remove("home-snap");
	}, []);

	useFadeUpStagger(".fade-up-item", {
		delay: 175,
		stagger: 70,
		duration: 600,
		distance: 40,
	});

	const localCvUrl = new URL("../../assets/Resume.pdf", import.meta.url).href;
	const cvUrl = import.meta?.env?.VITE_CV_URL || resumeData?.cvUrl || localCvUrl;

	const containerRef = useRef(null);

	return (
		<div
			id="resume-minimal-bg"
			ref={containerRef}
			className="min-h-screen bg-[#f5f5f5] text-black overflow-x-hidden">
			<div className="w-[90vw] max-w-[900px] mx-auto page-shell">
				<header className="relative fade-up-item pb-4 border-b border-brand/10 text-center">
					{cvUrl && (
						<a
							className="absolute top-0 right-0 inline-flex items-center justify-center w-11 h-11 rounded-full border border-brand/20 text-black transition-colors duration-200 hover:bg-black hover:text-white"
							href={cvUrl}
							target="_blank"
							rel="noopener noreferrer"
							download="Emma-Barua-CV.pdf"
							aria-label="Download CV"
							title="Download CV">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								rel="aria-hidden"
								className="shrink-0">
								<path
									d="M12 3v10m0 0 4-4m-4 4-4-4"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span className="sr-only">Download CV</span>
						</a>
					)}
					<div>
						<p className="text-2xl font-normal tracking-[0.2em] uppercase text-[#666] m-0">
							{resumeData.title}
						</p>
						{resumeData.subtitle && (
							<p className="text-xs font-light tracking-[0.1em] text-[#999] mt-2 m-0">
								{resumeData.subtitle}
							</p>
						)}
					</div>
				</header>

				<section className="fade-up-item mt-4 mb-0">
					<div className="flex flex-wrap gap-6 text-[0.95rem] justify-center items-center text-center">
						{resumeData.contact.location && (
							<span className="text-[#666]">{resumeData.contact.location}</span>
						)}
						{resumeData.contact.license && (
							<span className="text-[#666]">{resumeData.contact.license}</span>
						)}
					</div>
				</section>

				{resumeData.bio && (
					<section className="fade-up-item mt-3 mb-0">
						<p className="text-[1.1rem] leading-snug text-[#333] m-0 font-light">
							{resumeData.bio}
						</p>
					</section>
				)}

				{resumeData.experienceGroups &&
					resumeData.experienceGroups.length > 0 && (
						<div className="flex flex-col">
							{resumeData.experienceGroups.map((group, groupIndex) => (
								<section
									key={group?.title || groupIndex}
									className="mt-2.5 mb-0 fade-up-item">
									<h2 className="text-xs font-normal tracking-[0.2em] uppercase text-[#999] underline decoration-brand/20 underline-offset-2 [text-decoration-thickness:0.5px] mt-6 mb-2">
										{group?.title}
									</h2>
									<div className="flex flex-col gap-5">
										{group?.items?.map((item, itemIndex) => (
											<div key={`${groupIndex}-${itemIndex}`}>
												<div className="grid auto-rows-auto grid-cols-[92px_1fr] gap-x-6 gap-y-4 items-start lg:grid-cols-[220px_1fr] lg:gap-x-8 lg:gap-y-3">
													<span className="text-sm text-[#999] uppercase tracking-[0.15em] pt-1">
														{item?.period}
													</span>
													<div className="flex flex-col gap-1">
														<h3
															className={`text-[1.15rem] lg:text-[1.4rem] font-normal m-0 leading-tight experience-project ${getProjectFontClass(
																item?.project
															)}`}>
															{renderProjectTitle(item?.project)}
														</h3>
														{item?.role && (
															<p className="text-[0.95rem] text-[#666] m-0 leading-tight font-light">
																{item.role}
															</p>
														)}
														{item?.collaborator && (
															<p className="text-[0.95rem] text-[#666] m-0 leading-tight font-light">
																{item.collaborator}
															</p>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								</section>
							))}
						</div>
					)}

				{resumeData.qualifications && resumeData.qualifications.length > 0 && (
					<section className="mt-2.5 mb-0">
						<h2 className="text-xs font-normal tracking-[0.2em] uppercase text-[#999] underline decoration-brand/20 underline-offset-2 [text-decoration-thickness:0.5px] mt-6 mb-2">
							Qualifications and Training
						</h2>
						<ul className="list-disc pl-6 m-0 flex flex-col gap-1.5">
							{resumeData.qualifications.map((qual, index) => (
								<li
									key={index}
									className="text-[0.95rem] text-[#333] leading-relaxed font-light">
									{qual}
								</li>
							))}
						</ul>
					</section>
				)}

				{resumeData.transferrableSkills && (
					<section className="mt-2.5 mb-0">
						<h2 className="text-xs font-normal tracking-[0.2em] uppercase text-[#999] underline decoration-brand/20 underline-offset-2 [text-decoration-thickness:0.5px] mt-6 mb-2">
							Transferrable Skills
						</h2>
						<p className="text-[1.1rem] leading-snug text-[#333] m-0 font-light">
							{resumeData.transferrableSkills}
						</p>
					</section>
				)}
			</div>
		</div>
	);
};

export default ResumeMinimal;
