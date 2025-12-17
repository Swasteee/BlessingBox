import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  const navigate = useNavigate();

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
          <span className="text-gray-800 text-base">About Page</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6 flex-1">
        {/* Title and Subtitle - Centered */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2" style={{ color: '#000000', fontSize: '2rem', fontWeight: 700 }}>About Us</h2>
          <p className="text-black" style={{ fontSize: '0.95rem', color: '#000000' }}>What Make us Best for you ?</p>
        </div>

        {/* Main Content Block - Tilted Dark Brown Box */}
        <div className="max-w-6xl mx-auto relative py-8" style={{ perspective: '1400px' }}>
          {/* Soft glow / base plate for a 4D-like depth */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              filter: 'blur(24px)',
              transform: 'scale(1.05)',
              background: 'radial-gradient(80% 60% at 50% 40%, rgba(255,255,255,0.12), rgba(120,53,15,0.25) 60%, transparent 90%)'
            }}
          />
          <div 
            className="bg-amber-900 rounded-2xl p-6 md:p-8 lg:p-10 relative overflow-hidden"
            style={{ 
              backgroundColor: '#78350F',
              transform: 'perspective(1400px) rotate(-1.6deg) translateZ(32px)',
              boxShadow: '0 28px 70px rgba(0,0,0,0.4), 0 16px 40px rgba(0,0,0,0.32), 0 8px 20px rgba(0,0,0,0.22)',
              minHeight: '400px',
              transition: 'transform 0.35s ease',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            {/* Back layer for parallax tint */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08), transparent 40%, rgba(0,0,0,0.1) 100%)',
                opacity: 0.8
              }}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center h-full">
              {/* Left Side - Store Image */}
              <div className="relative z-10">
                <div 
                  className="rounded-xl overflow-hidden"
                  style={{
                    transform: 'perspective(1200px) rotate(1.8deg) translateZ(38px)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 12px 30px rgba(0,0,0,0.3), 0 6px 16px rgba(0,0,0,0.22)',
                    transition: 'transform 0.35s ease'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                    alt="Store interior with traditional items"
                    className="w-full h-full object-cover"
                    style={{ minHeight: '300px', maxHeight: '500px' }}
                  />
                </div>
              </div>

              {/* Right Side - Text Content */}
              <div className="relative z-10 text-white pr-0 lg:pr-4">
                <h3 
                  className="font-bold mb-4 lg:mb-5"
                  style={{ 
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    lineHeight: '1.3',
                    color: '#FFFFFF'
                  }}
                >
                  We Are Experts in Building Dreams
                </h3>
                <p 
                  className="mb-6 lg:mb-8 leading-relaxed"
                  style={{ 
                    fontSize: '0.9rem',
                    lineHeight: '1.7',
                    color: 'rgba(255, 255, 255, 0.95)'
                  }}
                >
                  Construction is a general term meaning the art and science to form objects, systems, or organizations, and comes from Latin constructio and Old French construction.
                </p>
                <button
                  className="text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-all"
                  style={{
                    backgroundColor: '#7C2D12',
                    fontSize: '1rem',
                    fontWeight: 600,
                    boxShadow: '0 6px 18px rgba(0,0,0,0.32), 0 3px 10px rgba(0,0,0,0.24)',
                    transform: 'translateZ(14px)',
                    transition: 'transform 0.35s ease, box-shadow 0.35s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateZ(20px) scale(1.06)';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.4), 0 5px 14px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateZ(14px) scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.32), 0 3px 10px rgba(0,0,0,0.24)';
                  }}
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;

