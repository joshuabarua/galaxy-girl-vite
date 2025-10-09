import React from 'react';
import resumeData from './resumeData.json';
import './css/resumeMinimal.css';

/**
 * Minimal Scandinavian-style Resume/CV
 * Easy to update via resumeData.json
 */
const ResumeMinimal = () => {
  return (
    <div className="resume-minimal">
      <div className="resume-container">
        {/* Header */}
        <header className="resume-header">
          <div className="resume-header-inner">
            <h1 className="resume-name">{resumeData.name}</h1>
            <p className="resume-title">{resumeData.title}</p>
            {resumeData.subtitle && (
              <p className="resume-subtitle">{resumeData.subtitle}</p>
            )}
          </div>
        </header>

        {/* Contact */}
        <section className="resume-section">
          <div className="resume-contact">
            {resumeData.contact.location && (
              <span className="contact-item">{resumeData.contact.location}</span>
            )}
            {resumeData.contact.license && (
              <span className="contact-item">{resumeData.contact.license}</span>
            )}
          </div>
        </section>

        {/* Bio */}
        {resumeData.bio && (
          <section className="resume-section">
            <p className="resume-bio">{resumeData.bio}</p>
          </section>
        )}

        {/* Experience */}
        {resumeData.experience && resumeData.experience.length > 0 && (
          <section className="resume-section">
            <h2 className="section-title">Experience</h2>
            <div className="experience-list">
              {resumeData.experience.map((item, index) => (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <span className="experience-year">{item.year}</span>
                    <div className="experience-details">
                      <h3 className="experience-project">{item.project}</h3>
                      <p className="experience-role">{item.role}</p>
                      {item.description && (
                        <p className="experience-description">{item.description}</p>
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
          <section className="resume-section">
            <h2 className="section-title">Ongoing Work</h2>
            <div className="experience-list">
              {resumeData.ongoing.map((item, index) => (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <span className="experience-year">{item.period}</span>
                    <div className="experience-details">
                      <h3 className="experience-project">{item.project}</h3>
                      <p className="experience-role">{item.role}</p>
                      {item.description && (
                        <p className="experience-description">{item.description}</p>
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
          <section className="resume-section">
            <h2 className="section-title">Qualifications and Training</h2>
            <ul className="qualifications-list">
              {resumeData.qualifications.map((qual, index) => (
                <li key={index} className="qualification-item">{qual}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Transferrable Skills */}
        {resumeData.transferrableSkills && (
          <section className="resume-section">
            <h2 className="section-title">Transferrable Skills</h2>
            <p className="resume-bio">{resumeData.transferrableSkills}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default ResumeMinimal;
