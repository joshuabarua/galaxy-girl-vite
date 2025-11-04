import React from 'react';
import resumeData from './resumeData.json';
import { useGrained } from '../../hooks/useGrained';
import { useFadeUpStagger } from '../../hooks/useFadeUpStagger';

/**
 * Minimal Scandinavian-style Resume/CV
 * Easy to update via resumeData.json
 */
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

    // Default rendering without special parentheses handling
    return title;
  };

  // Apply grain to white background
  useGrained('resume-minimal-bg');

  // Staggered fade-up animations
  useFadeUpStagger('.fade-up-item', {
    delay: 175,
    stagger: 70,
    duration: 600,
    distance: 40
  });

  const cvUrl = (import.meta?.env?.VITE_CV_URL) || resumeData?.cvUrl || '';

  return (
    <div id="resume-minimal-bg" className="min-h-screen bg-[#f5f5f5] text-black px-8 py-16 sm:px-6 overflow-x-hidden overflow-y-auto">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <header className="fade-up-item mb-0 pb-4 border-b border-brand/10 text-center">
          <div>
            <h1 className="text-[clamp(3rem,4vw,5rem)] font-light tracking-[-0.02em] leading-none m-0">
              {resumeData.name}
            </h1>
            <p className="text-sm font-normal tracking-[0.2em] uppercase text-[#666] m-0">
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
        <section className="fade-up-item my-4">
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
          <section className="fade-up-item my-3">
            <p className="text-[1.1rem] leading-snug text-[#333] m-0 font-light">{resumeData.bio}</p>
          </section>
        )}

        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <section className="my-3 fade-up-item">
            <h2 className="text-xs font-normal tracking-[0.2em] uppercase text-[#999] underline decoration-brand/20 underline-offset-2 [text-decoration-thickness:0.5px] mt-8 mb-3">
              Experience
            </h2>
            <div className="flex flex-col gap-5">
              {resumeData.experience.map((item, index) => (
                <div key={index}>
                  <div className="grid grid-cols-[80px_1fr] gap-6 items-start lg:grid-cols-[200px_1fr] lg:gap-10">
                    <span className="text-sm text-[#999] pt-1">{item.year}</span>
                    <div className="flex flex-col gap-2">
                      <h3 className={`text-[1.3rem] font-normal m-0 leading-snug experience-project ${getProjectFontClass(item.project)}`}>
                        {renderProjectTitle(item.project)}
                      </h3>
                      <p className="text-[0.95rem] text-[#666] m-0 font-light">{item.role}</p>
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

        {/* Ongoing Projects */}
        {resumeData.ongoing && resumeData.ongoing.length > 0 && (
          <section className="my-3 fade-up-item">
            <h2 className="text-xs font-normal tracking-[0.2em] uppercase text-[#999] underline decoration-brand/20 underline-offset-2 [text-decoration-thickness:0.5px] mt-8 mb-3">
              Ongoing Work
            </h2>
            <div className="flex flex-col gap-5">
              {resumeData.ongoing.map((item, index) => (
                <div key={index}>
                  <div className="grid grid-cols-[80px_1fr] gap-6 items-start lg:grid-cols-[200px_1fr] lg:gap-10">
                    <span className="text-sm text-[#999] pt-1">{item.period}</span>
                    <div className="flex flex-col gap-2">
                      <h3 className={`text-[1.3rem] font-normal m-0 leading-snug experience-project ${getProjectFontClass(item.project)}`}>
                        {renderProjectTitle(item.project)}
                      </h3>
                      <p className="text-[0.95rem] text-[#666] m-0 font-light">{item.role}</p>
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
          <section className="my-3">
            <h2 className="text-xs font-normal tracking-[0.2em] uppercase text-[#999] underline decoration-brand/20 underline-offset-2 [text-decoration-thickness:0.5px] mt-8 mb-3">
              Qualifications and Training
            </h2>
            <ul className="list-disc pl-6 m-0 flex flex-col gap-2">
              {resumeData.qualifications.map((qual, index) => (
                <li key={index} className="text-[0.95rem] text-[#333] leading-relaxed font-light">{qual}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Transferrable Skills */}
        {resumeData.transferrableSkills && (
          <section className="my-3">
            <h2 className="text-xs font-normal tracking-[0.2em] uppercase text-[#999] underline decoration-brand/20 underline-offset-2 [text-decoration-thickness:0.5px] mt-8 mb-3">
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

