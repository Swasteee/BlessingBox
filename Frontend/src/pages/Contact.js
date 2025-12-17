import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.submitContact(formData);
      alert('Thank you for your message! We will get back to you soon.');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Page Header with Back Arrow */}
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-700 hover:text-amber-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-gray-800 text-base">Contact Page</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-4 flex-1">
        {/* Title and Subtitle - Centered */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>Contact Us</h2>
          <p className="text-gray-500" style={{ fontSize: '0.95rem' }}>Any question or remarks? Just write us a message!</p>
        </div>

        {/* Contact Section - 50/50 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-7xl mx-auto">
          {/* Left Panel - Contact Information */}
          <div className="bg-amber-900 rounded-lg p-6 md:p-8 relative overflow-hidden" style={{ minHeight: '400px', backgroundColor: '#78350F' }}>
            {/* Decorative circles in bottom right */}
            <div className="absolute bottom-0 right-0 opacity-15" style={{ width: '200px', height: '200px' }}>
              <div className="absolute bottom-0 right-0 rounded-full" style={{ width: '100px', height: '100px', backgroundColor: '#451A03' }}></div>
              <div className="absolute bottom-2 right-2 rounded-full" style={{ width: '80px', height: '80px', backgroundColor: '#451A03' }}></div>
              <div className="absolute bottom-4 right-4 rounded-full" style={{ width: '60px', height: '60px', backgroundColor: '#451A03' }}></div>
            </div>

            <div className="relative z-10 flex flex-col h-full">
              {/* Title Section */}
              <div className="mb-10">
                <h3 className="text-white font-bold mb-1.5" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Contact Information</h3>
                <p className="text-white" style={{ fontSize: '0.875rem' }}>Say something to start a live chat!</p>
              </div>

              {/* Contact Details */}
              <div className="flex-1 space-y-6 mb-8">
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', backgroundColor: '#92400E' }}>
                    <svg className="text-white" style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-white" style={{ fontSize: '0.875rem' }}>+977 9876543210</span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', backgroundColor: '#92400E' }}>
                    <svg className="text-white" style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-white" style={{ fontSize: '0.875rem' }}>demo@gmail.com</span>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ width: '40px', height: '40px', backgroundColor: '#92400E' }}>
                    <svg className="text-white" style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-white leading-relaxed" style={{ fontSize: '0.875rem' }}>Baneshwor, Kathmandu 44600 Nepal</span>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex items-center gap-3 mt-auto">
                {/* Twitter */}
                <a href="#" className="rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" style={{ width: '40px', height: '40px', backgroundColor: '#92400E' }}>
                  <svg className="text-white" style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                </a>

                {/* Instagram (selected - white background) */}
                <a href="#" className="rounded-full flex items-center justify-center" style={{ width: '40px', height: '40px', backgroundColor: '#FFFFFF', border: '2px solid white' }}>
                  <svg className="text-amber-900" style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* Discord */}
                <a href="#" className="rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" style={{ width: '40px', height: '40px', backgroundColor: '#92400E' }}>
                  <svg className="text-white" style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.007-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Panel - Contact Form */}
          <div className="bg-white rounded-lg p-6 md:p-8" style={{ boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1), 4px 0 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name and Last Name in same row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5" style={{ fontSize: '0.875rem' }}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-900 focus:border-amber-900"
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5" style={{ fontSize: '0.875rem' }}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-900 focus:border-amber-900"
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              {/* Email and Phone Number in same row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5" style={{ fontSize: '0.875rem' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-900 focus:border-amber-900"
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-1.5" style={{ fontSize: '0.875rem' }}>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-900 focus:border-amber-900"
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              {/* Select Subject */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2.5" style={{ fontSize: '0.875rem' }}>Select Subject?</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="subject"
                      value="General Inquiry"
                      checked={formData.subject === 'General Inquiry'}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-4 h-4 text-amber-900 focus:ring-amber-900 border-gray-300"
                      style={{ accentColor: '#78350F' }}
                    />
                    <span className="text-gray-700" style={{ fontSize: '0.875rem' }}>General Inquiry</span>
                  </label>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5" style={{ fontSize: '0.875rem' }}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-900 focus:border-amber-900 resize-none"
                  style={{ fontSize: '0.875rem' }}
                  placeholder="Write your message.."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full text-white py-2.5 rounded-md font-semibold hover:opacity-90 transition-opacity mt-1 disabled:opacity-50"
                style={{ backgroundColor: '#78350F', fontSize: '0.875rem' }}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
