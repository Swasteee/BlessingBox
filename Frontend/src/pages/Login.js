import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('abc@gmail.com');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - White Content Area (2/3 width) */}
      <div className="w-full lg:w-2/3 bg-white flex flex-col items-center justify-center p-6 md:p-8 lg:p-12 relative min-h-screen lg:min-h-0">
        {/* Logo */}
        <div className="absolute top-6 left-6 w-12 h-12 bg-amber-900 rounded flex items-center justify-center">
          <div className="w-8 h-8 bg-amber-600 rounded" style={{
            backgroundImage: 'radial-gradient(circle, #D4AF37 30%, transparent 30%), radial-gradient(circle, #D4AF37 30%, transparent 30%)',
            backgroundSize: '50% 50%',
            backgroundPosition: 'top left, bottom right'
          }}></div>
        </div>

        <div className="w-full max-w-md mt-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Log in</h1>
          <p className="text-gray-600 mb-8">Please login to continue to your account.</p>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="abc@gmail.com"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Keep me logged in */}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="keepLoggedIn"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="keepLoggedIn" className="ml-2 text-gray-700">
              Keep me logged in
            </label>
          </div>

          {/* Sign in Button */}
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-6"
          >
            Sign in
          </button>

          {/* Separator */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Sign in with Google */}
          <button 
            onClick={handleLogin}
            className="w-full bg-white text-gray-700 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 mb-6 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          {/* Sign up Link */}
          <p className="text-center text-gray-600">
            Need an account? <Link to="/register" className="text-blue-600 hover:underline">Create one</Link>
          </p>
        </div>
      </div>

      {/* Right Side - Festive Background (1/3 width) */}
      <div className="hidden lg:block lg:w-1/3 relative bg-red-900 overflow-hidden">
        {/* Golden Sparkles */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #FFD700 2px, transparent 2px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px'
        }}></div>

        {/* String Lights */}
        <div className="absolute top-8 left-0 right-0 flex justify-around z-10">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-yellow-300 rounded-full animate-pulse shadow-lg" style={{
              animationDelay: `${i * 0.2}s`,
              boxShadow: '0 0 10px #FFD700, 0 0 20px #FFD700'
            }}></div>
          ))}
        </div>

        {/* Golden Archway */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-64 h-80 z-20">
          <svg viewBox="0 0 200 300" className="w-full h-full">
            <path d="M 20 50 Q 20 20 50 20 L 150 20 Q 180 20 180 50 L 180 250 Q 180 280 150 280 L 50 280 Q 20 280 20 250 Z" 
                  fill="#D4AF37" stroke="#B8860B" strokeWidth="3"/>
            <circle cx="100" cy="80" r="15" fill="#FFD700"/>
            <circle cx="100" cy="120" r="15" fill="#FFD700"/>
            <circle cx="100" cy="160" r="15" fill="#FFD700"/>
          </svg>
        </div>

        {/* Golden Temples/Shrines */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-16 h-20 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-t-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-yellow-600 rounded-t-full"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-800 rounded"></div>
            </div>
          ))}
        </div>

        {/* Golden Platter and Bowls */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-end gap-4 z-10">
          {/* Large Platter */}
          <div className="w-48 h-12 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full relative">
            <div className="absolute inset-2 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            </div>
          </div>

          {/* Rice Bowl */}
          <div className="w-16 h-16 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full relative">
            <div className="absolute inset-2 bg-white rounded-full"></div>
          </div>

          {/* Small Bowls */}
          {[1, 2].map((i) => (
            <div key={i} className="w-12 h-12 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full relative">
              <div className="absolute inset-2 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;

