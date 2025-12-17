import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  // Get profile image from user object or localStorage
  useEffect(() => {
    const updateProfileImage = () => {
      if (user?.avatar) {
        // Handle backend URLs
        const avatarUrl = user.avatar.startsWith('http')
          ? user.avatar
          : `http://localhost:5001${user.avatar}`;
        setProfileImage(avatarUrl);
      } else {
        // Don't check localStorage for profileImage (it's too large)
        setProfileImage(null);
      }
    };

    updateProfileImage();

    // Listen for storage changes (e.g., when profile is updated)
    const handleStorageChange = (e) => {
      if (e.key === 'profileData') {
        updateProfileImage();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event for same-tab updates
    const handleProfileUpdate = () => {
      updateProfileImage();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [user]);

  useEffect(() => {
    const loadCartCount = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartCount(0);
        return;
      }
      try {
        const response = await api.getCart();
        if (response.success && response.cart && response.cart.items) {
          setCartCount(response.cart.items.length);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        setCartCount(0);
      }
    };
    loadCartCount();
    // Refresh cart count every 2 seconds
    const interval = setInterval(loadCartCount, 2000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <header className="bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="w-10 h-10 md:w-12 md:h-12 bg-amber-900 rounded flex items-center justify-center flex-shrink-0">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-amber-600 rounded" style={{
              backgroundImage: 'radial-gradient(circle, #D4AF37 30%, transparent 30%), radial-gradient(circle, #D4AF37 30%, transparent 30%)',
              backgroundSize: '50% 50%',
              backgroundPosition: 'top left, bottom right'
            }}></div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 ml-6 xl:ml-12">
            <Link to="/" className="text-sm xl:text-base text-gray-800 hover:text-amber-900">Home</Link>
            <Link to="/shop" className="text-sm xl:text-base text-gray-800 hover:text-amber-900">Shop</Link>
            <Link to="/contact" className="text-sm xl:text-base text-gray-800 hover:text-amber-900">Contact</Link>
            <Link to="/about" className="text-sm xl:text-base text-gray-800 hover:text-amber-900">About</Link>
          </nav>

          {/* Search Bar - Hidden on mobile, visible on tablet+ */}
          <div className="hidden md:flex items-center gap-2 xl:gap-4 flex-1 max-w-md ml-2 xl:ml-2 xl:mr-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchQuery('');
                  }
                }}
                className="w-full px-3 xl:px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 text-sm"
              />
              <button
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchQuery('');
                  }
                }}
                className="absolute right-2 xl:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-900"
              >
                <svg className="w-4 h-4 xl:w-5 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <Link to="/cart" className="px-3 xl:px-4 py-2 bg-amber-900 text-white rounded hover:bg-amber-800 flex items-center justify-center relative">
              <svg className="w-4 h-4 xl:w-5 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Search & Cart */}
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/cart" className="p-2 bg-amber-900 text-white rounded hover:bg-amber-800 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-amber-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop User Info or Action Buttons */}
          {user ? (
            <div className="hidden md:flex items-center gap-2 xl:gap-3">
              <Link to="/profile" className="flex items-center gap-2 xl:gap-3 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt={user.name || 'User'} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <svg className="w-5 h-5 xl:w-6 xl:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  {user.location && <p className="text-xs text-gray-600">{user.location}</p>}
                </div>
              </Link>
              <button
                onClick={logout}
                className="px-2 xl:px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/register" className="px-3 xl:px-4 py-2 bg-amber-900 text-white rounded hover:bg-amber-800 text-sm xl:text-base">SignUp</Link>
              <Link to="/login" className="px-3 xl:px-4 py-2 bg-amber-900 text-white rounded hover:bg-amber-800 text-sm xl:text-base">Login</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4 mt-4">
              <Link to="/" className="text-gray-800 hover:text-amber-900 py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="text-gray-800 hover:text-amber-900 py-2" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
              <Link to="/contact" className="text-gray-800 hover:text-amber-900 py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <Link to="/about" className="text-gray-800 hover:text-amber-900 py-2" onClick={() => setMobileMenuOpen(false)}>About</Link>

              {/* Mobile Search */}
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && mobileSearchQuery.trim()) {
                      navigate(`/shop?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
                      setMobileSearchQuery('');
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                />
                <button
                  onClick={() => {
                    if (mobileSearchQuery.trim()) {
                      navigate(`/shop?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
                      setMobileSearchQuery('');
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-900"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Mobile User Info or Action Buttons */}
              {user ? (
                <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-gray-200">
                  <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt={user.name || 'User'} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      {user.location && <p className="text-xs text-gray-600">{user.location}</p>}
                    </div>
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-left"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-gray-200">
                  <Link to="/register" className="px-4 py-2 bg-amber-900 text-white rounded hover:bg-amber-800 text-center" onClick={() => setMobileMenuOpen(false)}>SignUp</Link>
                  <Link to="/login" className="px-4 py-2 bg-amber-900 text-white rounded hover:bg-amber-800 text-center" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

