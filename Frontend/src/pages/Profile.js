import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [showSettings, setShowSettings] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'your name',
    email: 'yourname@gmail.com',
    mobile: 'Add number',
    location: 'USA',
    profileImage: null
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [settings, setSettings] = useState({
    theme: 'Light',
    language: 'Eng'
  });
  const [saveMessage, setSaveMessage] = useState('');

  // Load user data if available
  useEffect(() => {
    // Don't load profileImage from localStorage (it's too large)
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        // Exclude profileImage from localStorage data
        const { profileImage, ...rest } = parsed;
        setProfileData(prev => ({ ...prev, ...rest }));
      } catch (error) {
        console.error('Failed to parse profile data:', error);
      }
    }

    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || 'your name',
        email: user.email || 'yourname@gmail.com',
        location: user.location || 'USA',
        profileImage: user.avatar || null
      }));
      // Set image preview - handle backend URLs
      if (user.avatar) {
        const avatarUrl = user.avatar.startsWith('http')
          ? user.avatar
          : `http://localhost:5001${user.avatar}`;
        setImagePreview(avatarUrl);
      } else {
        setImagePreview(null);
      }
    }
  }, [user]);

  // Load orders when order history section is active
  useEffect(() => {
    if (activeSection === 'orders') {
      loadOrders();
    }
  }, [activeSection]);

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await api.getMyOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Map order status for user display
  const getUserStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'processing':
      case 'shipped':
        return 'On the Way';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Order Placed';
    }
  };

  const getUserStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    setSaveMessage('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      setSelectedImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Save only non-image data to localStorage (to avoid quota issues)
      const dataToSave = {
        name: profileData.name,
        email: profileData.email,
        mobile: profileData.mobile,
        location: profileData.location
        // Don't save profileImage to localStorage
      };
      localStorage.setItem('profileData', JSON.stringify(dataToSave));

      if (user) {
        // Update profile via API with file upload
        const userData = {
          name: profileData.name,
          email: profileData.email,
          location: profileData.location,
          phone: profileData.mobile
        };

        const response = await api.updateProfile(userData, selectedImageFile);

        if (response.success) {
          // Update user context
          await updateUser(response.user);

          // Clear selected file and update preview
          setSelectedImageFile(null);
          if (response.user.avatar) {
            const avatarUrl = response.user.avatar.startsWith('http')
              ? response.user.avatar
              : `http://localhost:5001${response.user.avatar}`;
            setImagePreview(avatarUrl);
            setProfileData(prev => ({ ...prev, profileImage: response.user.avatar }));
          }

          // Dispatch custom event to notify Header of profile update
          window.dispatchEvent(new Event('profileUpdated'));

          setSaveMessage('Profile updated successfully!');
          setIsEditing(false);

          setTimeout(() => {
            setSaveMessage('');
          }, 3000);
        } else {
          alert('Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert(`Failed to update profile: ${error.message || 'Please try again'}`);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaveMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveMessage('');
    setSelectedImageFile(null);
    setImagePreview(user?.avatar || null);
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfileData(prev => ({
          ...prev,
          ...parsed,
          profileImage: user?.avatar || null
        }));
      } catch (error) {
        console.error('Failed to parse profile data:', error);
      }
    } else if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || 'your name',
        email: user.email || 'yourname@gmail.com',
        location: user.location || 'USA',
        profileImage: user.avatar || null
      }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Main Content */}
      <div className="bg-white py-6 md:py-8 flex-1">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Left-Hand Navigation Menu */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-5">
                {/* User Profile Card */}
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-200">
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-0.5" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Your name</h3>
                    <p className="text-xs text-gray-600" style={{ fontSize: '0.75rem' }}>yourname@gmail.com</p>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-0.5">
                  {/* My Profile */}
                  <button
                    onClick={() => setActiveSection('profile')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors ${activeSection === 'profile' ? 'bg-gray-50' : ''
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700 text-xs">My Profile</span>
                    </div>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Order History */}
                  <button
                    onClick={() => setActiveSection('orders')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors ${activeSection === 'orders' ? 'bg-gray-50' : ''
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-gray-700 text-xs">Order History</span>
                    </div>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Settings */}
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-700 text-xs">Settings</span>
                    </div>
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Notification */}
                  <button className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span className="text-gray-700 text-xs">Notification</span>
                    </div>
                    <span className="text-gray-600 text-xs">Allow</span>
                  </button>

                  {/* Log Out */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-gray-700 text-xs">Log Out</span>
                  </button>
                </div>
              </div>

              {/* Settings Pop-up */}
              {showSettings && (
                <div className="bg-white rounded-lg shadow-xl p-4 mt-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Settings</h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* Theme */}
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-700 text-xs">Theme</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-600 text-xs">{settings.theme}</span>
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-700 text-xs">Language</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-600 text-xs">{settings.language}</span>
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Area - Profile Details or Order History */}
            <div className="lg:col-span-9">
              {activeSection === 'profile' ? (
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 relative">
                  {/* Close Button (X) - Top Right */}
                  {isEditing && (
                    <button
                      onClick={handleCancel}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}

                  {/* User Profile Display */}
                  <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-200">
                    <div className="relative">
                      <img
                        src={
                          imagePreview
                            ? (imagePreview.startsWith('http') || imagePreview.startsWith('data:')
                              ? imagePreview
                              : `http://localhost:5001${imagePreview}`)
                            : profileData.profileImage
                              ? (profileData.profileImage.startsWith('http') || profileData.profileImage.startsWith('data:')
                                ? profileData.profileImage
                                : `http://localhost:5001${profileData.profileImage}`)
                              : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                        }
                        alt="Profile"
                        className="w-14 h-14 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
                        }}
                      />
                      <label className="absolute bottom-0 right-0 w-5 h-5 bg-amber-900 rounded-full flex items-center justify-center border-2 border-white cursor-pointer" style={{ backgroundColor: '#78350F' }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </label>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-0.5" style={{ fontSize: '0.875rem', fontWeight: 600 }}>{profileData.name}</h3>
                      <p className="text-xs text-gray-600" style={{ fontSize: '0.75rem' }}>{profileData.email}</p>
                    </div>
                  </div>

                  {/* Profile Information Fields */}
                  <div className="space-y-0">
                    {/* Name */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <label className="text-gray-700 font-medium" style={{ fontSize: '0.75rem' }}>Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleInputChange}
                          className="text-right text-gray-900 border-none outline-none bg-transparent focus:ring-0 cursor-text"
                          style={{ fontSize: '0.75rem' }}
                        />
                      ) : (
                        <span className="text-right text-gray-900" style={{ fontSize: '0.75rem', textDecoration: 'underline' }}>{profileData.name}</span>
                      )}
                    </div>

                    {/* Email account */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <label className="text-gray-700 font-medium" style={{ fontSize: '0.75rem' }}>Email account</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                          className="text-right text-gray-900 border-none outline-none bg-transparent focus:ring-0 cursor-text"
                          style={{ fontSize: '0.75rem' }}
                        />
                      ) : (
                        <span className="text-right text-gray-900" style={{ fontSize: '0.75rem', textDecoration: 'underline' }}>{profileData.email}</span>
                      )}
                    </div>

                    {/* Mobile number */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <label className="text-gray-700 font-medium" style={{ fontSize: '0.75rem' }}>Mobile number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="mobile"
                          value={profileData.mobile}
                          onChange={handleInputChange}
                          placeholder="Add number"
                          className="text-right text-gray-900 border-none outline-none bg-transparent focus:ring-0 placeholder-gray-400 cursor-text"
                          style={{ fontSize: '0.75rem' }}
                        />
                      ) : (
                        <span className="text-right text-gray-400" style={{ fontSize: '0.75rem', textDecoration: 'underline' }}>{profileData.mobile}</span>
                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <label className="text-gray-700 font-medium" style={{ fontSize: '0.75rem' }}>Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={profileData.location}
                          onChange={handleInputChange}
                          className="text-right text-gray-900 border-none outline-none bg-transparent focus:ring-0 cursor-text"
                          style={{ fontSize: '0.75rem' }}
                        />
                      ) : (
                        <span className="text-right text-gray-900" style={{ fontSize: '0.75rem', textDecoration: 'underline' }}>{profileData.location}</span>
                      )}
                    </div>
                  </div>

                  {/* Success Message */}
                  {saveMessage && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-xs">
                      {saveMessage}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-start">
                    {isEditing ? (
                      <button
                        onClick={handleSave}
                        className="text-white py-2 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#78350F', fontSize: '0.75rem' }}
                      >
                        Save Change
                      </button>
                    ) : (
                      <button
                        onClick={handleEdit}
                        className="text-white py-2 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: '#78350F', fontSize: '0.75rem' }}
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>
                  {loadingOrders ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No orders found.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Order #{order._id?.slice(-8) || 'N/A'}
                              </h3>
                              {order.createdAt && (
                                <p className="text-xs text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900 mb-2">
                                Rs {order.totalAmount?.toLocaleString() || '0'}
                              </p>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getUserStatusColor(order.status)}`}>
                                {getUserStatusLabel(order.status)}
                              </span>
                            </div>
                          </div>
                          <div className="border-t pt-4">
                            <p className="text-sm text-gray-600 mb-2">
                              <span className="font-semibold">Address:</span> {order.billingDetails?.streetAddress}, {order.billingDetails?.city}, {order.billingDetails?.district}
                            </p>
                            <p className="text-sm text-gray-600 mb-3">
                              <span className="font-semibold">Payment:</span> {order.paymentMethod || 'COD'} - {order.paymentStatus || 'pending'}
                            </p>
                            <div className="mt-3">
                              <p className="font-semibold text-gray-900 mb-2 text-sm">Items:</p>
                              <div className="space-y-2">
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                      <img
                                        src={item.product?.image?.startsWith('http')
                                          ? item.product.image
                                          : item.product?.image
                                            ? `http://localhost:5001${item.product.image}`
                                            : 'https://via.placeholder.com/100'}
                                        alt={item.product?.title || 'Product'}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-semibold text-gray-900">
                                        {item.product?.title || 'Product'}
                                      </p>
                                      <p className="text-xs text-gray-600">
                                        Quantity: {item.quantity} × Rs {item.price?.toLocaleString() || '0'}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-bold text-gray-900">
                                        Rs {(item.price * item.quantity).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
