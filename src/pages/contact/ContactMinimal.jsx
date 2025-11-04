import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useGrained } from '../../hooks/useGrained';
import { useFadeUpStagger } from '../../hooks/useFadeUpStagger';
import './css/contactMinimal.css';

/**
 * Minimal Scandinavian-style contact page
 */
const ContactMinimal = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setStatus('Sending...');
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC;

      const params = {
        from_name: formData.name,
        from_email: formData.email,
        subject: 'Website enquiry',
        message: formData.message,
        to_name: 'Galaxy Girl Website',
      };

      await emailjs.send(serviceId, templateId, params, publicKey);
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      console.error('Email send failed:', err);
      setStatus('Failed to send. Please try again.');
      setTimeout(() => setStatus(''), 4000);
    }
  };

  // Apply grain to white background
  useGrained('contact-minimal-bg');

  // Staggered fade-up animations
  useFadeUpStagger('.fade-up-item', {
    delay: 250,
    stagger: 70,
    duration: 600,
    distance: 40
  });

  return (
    <div id="contact-minimal-bg" className="contact-minimal">
      <div className="contact-container">
        <header className="contact-header fade-up-item">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">Let's work together</p>
        </header>

        {/* Social icons directly under header */}
        <div className="header-social fade-up-item">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <rect x="7" y="10" width="2" height="7" fill="currentColor"/>
              <circle cx="8" cy="7" r="1" fill="currentColor"/>
              <path d="M13 17v-4a3 3 0 0 1 6 0v4h-2v-4a1 1 0 1 0-2 0v4h-2z" fill="currentColor"/>
            </svg>
          </a>
        </div>

        <div className="contact-content">

          {/* Contact Form */}
          <form className="contact-form fade-up-item" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="form-textarea"
              />
            </div>

            <button type="submit" className="form-submit">
              Send Message
            </button>

            {status && <p className="form-status">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactMinimal;
