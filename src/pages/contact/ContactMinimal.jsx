import React, { useState } from 'react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add your email service integration here (EmailJS, etc.)
    console.log('Form submitted:', formData);
    
    setStatus('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
    
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="contact-minimal">
      <div className="contact-container">
        <header className="contact-header">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">Let's work together</p>
        </header>

        <div className="contact-content">
          {/* Contact Info */}
          <div className="contact-info">
            <div className="info-item">
              <span className="info-label">Email</span>
              <a href="mailto:emma@example.com" className="info-value">
                emma@example.com
              </a>
            </div>
            
            <div className="info-item">
              <span className="info-label">Phone</span>
              <a href="tel:+441234567890" className="info-value">
                +44 123 456 7890
              </a>
            </div>

            <div className="info-item">
              <span className="info-label">Location</span>
              <span className="info-value">London, UK</span>
            </div>

            <div className="info-item">
              <span className="info-label">Social</span>
              <div className="social-links">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  Instagram
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
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
