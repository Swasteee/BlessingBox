import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-red-900 text-white py-8 relative overflow-hidden mt-auto">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-8 flex gap-2">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{
              animationDelay: `${i * 0.1}s`
            }}></div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <p className="text-center">© 2024 Pooja Ecommerce. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

