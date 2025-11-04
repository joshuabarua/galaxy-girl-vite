import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { useGrained } from '../../hooks/useGrained';
import { useFadeUpStagger } from '../../hooks/useFadeUpStagger';

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
    <div
      id="contact-minimal-bg"
      className="min-h-screen bg-[#f5f5f5] text-black px-8 py-24 sm:px-6 sm:py-16 overflow-x-hidden overflow-y-auto"
    >
      <div className="max-w-[1200px] mx-auto">
        <header className="fade-up-item text-center mb-16">
          <h1 className="text-[clamp(3rem,6vw,5rem)] font-light tracking-[-0.02em] leading-none mb-4">
            Get in Touch
          </h1>
          <p className="text-sm font-normal tracking-[0.2em] uppercase text-[#666] m-0">
            Let's work together
          </p>
        </header>

        {/* Social icons directly under header */}
        <div className="fade-up-item flex items-center justify-center gap-4 -mt-8 mb-6">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black no-underline font-light transition-opacity duration-300 w-fit hover:opacity-60"
            aria-label="Instagram"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black no-underline font-light transition-opacity duration-300 w-fit hover:opacity-60"
            aria-label="LinkedIn"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <rect x="7" y="10" width="2" height="7" fill="currentColor"/>
              <circle cx="8" cy="7" r="1" fill="currentColor"/>
              <path d="M13 17v-4a3 3 0 0 1 6 0v4h-2v-4a1 1 0 1 0-2 0v4h-2z" fill="currentColor"/>
            </svg>
          </a>
        </div>

        <div className="flex flex-col items-center justify-center gap-10">
          {/* Contact Form */}
          <form
            className="fade-up-item w-full max-w-[560px] mx-auto flex flex-col gap-8"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-3">
              <label htmlFor="name" className="text-xs font-normal tracking-[0.2em] uppercase text-[#999]">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-4 text-base font-light text-black bg-[#fafafa] border border-brand/15 outline-none focus:border-brand"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="email" className="text-xs font-normal tracking-[0.2em] uppercase text-[#999]">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-4 text-base font-light text-black bg-[#fafafa] border border-brand/15 outline-none focus:border-brand"
              />
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="message" className="text-xs font-normal tracking-[0.2em] uppercase text-[#999]">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                className="w-full p-4 text-base font-light text-black bg-[#fafafa] border border-brand/15 outline-none focus:border-brand resize-y min-h-[150px]"
              />
            </div>

            <button
              type="submit"
              className="w-fit px-12 py-4 text-sm font-normal tracking-[0.1em] uppercase text-white bg-black border border-black transition-all duration-300 self-center hover:bg-white hover:text-black"
            >
              Send Message
            </button>

            {status && (
              <p className="text-sm text-black m-0 p-4 bg-[#f5f5f5] border border-brand/15">{status}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactMinimal;
