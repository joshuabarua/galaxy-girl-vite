import React, { useEffect, useState, useRef } from 'react';
import resumeData from './resumeData.json';
import { useGrained } from '../../hooks/useGrained';
import { useFadeUpStagger } from '../../hooks/useFadeUpStagger';


const ResumeMinimal = () => {
  const getProjectFontClass = (title) => {
    if (!title) return '';
    const t = title.toLowerCase();
    if (t.includes('death of bunny monroe')) return 'font-bunny';
    if (t.startsWith('the franchise')) return 'font-franchise';
    if (t.startsWith('blitz')) return 'font-blitz';
    if (t.includes('house of dragon')) return 'font-house-of-dragon';
    if (t.includes('witcher')) return 'font-witcher';
    if (t.includes('empire of light')) return 'font-empire-of-light';
    if (t.includes('allelujah')) return 'font-allelujah';
    if (t.includes('netflix')) return 'font-netflix';
    if (t.includes('amazon')) return 'font-amazon';
    if (t.includes('itv')) return 'font-itv';
    if (t.includes('peaky')) return 'font-peaky';
    return '';
  };

  const renderProjectTitle = (title) => {
    if (!title) return null;
    const t = title.toUpperCase();
    // Two-face: THE DEATH OF BUNNY MONRO (base font for THE and OF BUNNY MONRO; alternate for DEATH)
    if (t.includes('DEATH') && t.includes('BUNNY')) {
      const partThe = 'THE ';
      const partDeath = 'DEATH';
      const partRest = ' OF BUNNY MONRO';
      return (
        <>
          <span className='bunny-the'>{partThe}</span>
          <span className="bunny-part-2">{partDeath}</span>
          <span className="bunny-rest">{partRest}</span>
        </>
      );
    }
    // Two-face: Empire of Light -> 'of' is lowercase and alternate font
    if (t.includes('EMPIRE OF LIGHT')) {
      const partEmpire = 'Empire ';
      const partOf = 'of';
      const partLight = ' Light';
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

  useGrained('resume-minimal-bg');

  useEffect(() => {
    document.documentElement.classList.remove('home-snap');
    document.body.classList.remove('home-snap');
  }, []);

  useFadeUpStagger('.fade-up-item', {
    delay: 175,
    stagger: 70,
    duration: 600,
    distance: 40
  });

  const cvUrl = (import.meta?.env?.VITE_CV_URL) || resumeData?.cvUrl || '';

  const containerRef = useRef(null);

  return (
    <div id="resume-minimal-bg" ref={containerRef} className="min-h-screen bg-[#f5f5f5] text-black px-6 pt-10 pb-16 sm:px-5 sm:pt-8 sm:pb-16 overflow-x-hidden">
      <div className="max-w-[760px] mx-auto">
        {/* Header */}
        <header className="fade-up-item mb-0 pb-4 border-b border-brand/10 text-center">
          <div>
            {/* <h1 className="text-[clamp(3rem,4vw,5rem)] font-light tracking-[-0.02em] leading-none m-0">
              {resumeData.name}
            </h1> */}
            <p className="text-2xl font-normal tracking-[0.2em] uppercase text-[#666] m-0">
              {resumeData.title}
            </p>
            {resumeData.subtitle && (
              <p className="text-xs font-light tracking-[0.1em] text-[#999] mt-2 m-0">
                {resumeData.subtitle}
              </p>
            )}
            {cvUrl ? (
              <div className="mt-3 flex justify-center">
                <a
                  className="inline-flex items-center gap-2 text-black no-underline border border-brand/15 px-3 py-2 rounded text-[0.9rem]"
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download CV"
                  title="Download CV"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 3v10m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 15v3a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            ) : null}
          </div>
        </header>

        {/* Contact */}
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

        {/* Bio */}
        {resumeData.bio && (
          <section className="fade-up-item mt-3 mb-0">
            <p className="text-[1.1rem] leading-snug text-[#333] m-0 font-light">{resumeData.bio}</p>
          </section>
        )}

        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <section className="mt-2.5 mb-0 fade-up-item">
            <h2 className="text-xs font-normal tracking-[0.2em] uppercase text-[#999] underline decoration-brand/20 underline-offset-2 [text-decoration-thickness:0.5px] mt-6 mb-2">
              Experience
            </h2>
            <div className="flex flex-col gap-5">
              {resumeData.experience.map((item, index) => (
                <div key={index}>
                  <div className="grid auto-rows-auto grid-cols-[64px_1fr] gap-x-6 gap-y-4 items-start lg:grid-cols-[200px_1fr] lg:gap-x-6 lg:gap-y-3">
                    <span className="text-md text-[#999] pt-1">{item.year}</span>
                    <div className="flex flex-col gap-1">
                      <h3 className={`text-[1.5rem] font-normal m-0 leading-tight experience-project ${getProjectFontClass(item.project)}`}>
                        {renderProjectTitle(item.project)}
                      </h3>
                      <p className="text-[0.95rem] text-[#666] m-0 leading-tight font-light">{item.role}</p>
                      {item.description && (
                        <p className="text-[0.95rem] text-[#666] m-0 leading-tight font-light">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {resumeData.ongoing && resumeData.ongoing.length > 0 && (
          <section className="mt-2.5 mb-0 fade-up-item">
            <h2 className="text-xs font-normal tracking-[0.2em] uppercase text-[#999] underline decoration-brand/20 underline-offset-2 [text-decoration-thickness:0.5px] mt-6 mb-2">
              Ongoing Work
            </h2>
            <div className="flex flex-col gap-5">
              {resumeData.ongoing.map((item, index) => (
                <div key={index}>
                  <div className="grid auto-rows-auto grid-cols-[64px_1fr] gap-x-4 gap-y-2 items-start lg:grid-cols-[160px_1fr] lg:gap-x-6 lg:gap-y-3">
                    <span className="text-xs text-[#999] pt-1">{item.period}</span>
                    <div className="flex flex-col gap-1">
                      <h3 className={`text-[1.2rem] font-normal m-0 leading-tight experience-project ${getProjectFontClass(item.project)}`}>
                        {renderProjectTitle(item.project)}
                      </h3>
                      <p className="text-[0.95rem] text-[#666] m-0 leading-tight font-light">{item.role}</p>
                      {item.description && (
                        <p className="text-[0.95rem] text-[#666] m-0 leading-tight font-light">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Qualifications */}
        {resumeData.qualifications && resumeData.qualifications.length > 0 && (
          <section className="mt-2.5 mb-0">
            <h2 className="text-xs font-normal tracking-[0.2em] uppercase text-[#999] underline decoration-brand/20 underline-offset-2 [text-decoration-thickness:0.5px] mt-6 mb-2">
              Qualifications and Training
            </h2>
            <ul className="list-disc pl-6 m-0 flex flex-col gap-1.5">
              {resumeData.qualifications.map((qual, index) => (
                <li key={index} className="text-[0.95rem] text-[#333] leading-relaxed font-light">{qual}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Transferrable Skills */}
        {resumeData.transferrableSkills && (
          <section className="mt-2.5 mb-0">
            <h2 className="text-xs font-normal tracking-[0.2em] uppercase text-[#999] underline decoration-brand/20 underline-offset-2 [text-decoration-thickness:0.5px] mt-6 mb-2">
              Transferrable Skills
            </h2>
            <p className="text-[1.1rem] leading-snug text-[#333] m-0 font-light">{resumeData.transferrableSkills}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default ResumeMinimal;

