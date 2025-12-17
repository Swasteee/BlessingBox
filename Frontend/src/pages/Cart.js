import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    province: '',
    district: '',
    city: '',
    streetAddress: '',
    apartment: '',
    zipCode: '',
    phone: '',
    email: '',
    orderNotes: ''
  });

  const provinces = ['Select a Province', 'Province 1', 'Province 2', 'Province 3', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'];
  const districts = ['Select a District', 'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Biratnagar', 'Dharan', 'Butwal'];

  // Helper function to deduplicate and format cart items
  const processCartItems = (cartItems) => {
    const itemsMap = new Map();

    cartItems.forEach((item) => {
      const productId = item.product?._id?.toString() || item.product?.toString() || item.product;
      if (productId) {
        if (itemsMap.has(productId)) {
          // Product already exists, merge quantities
          const existing = itemsMap.get(productId);
          existing.quantity += item.quantity || 1;
        } else {
          // New product
          itemsMap.set(productId, {
            _id: productId,
            id: productId,
            title: item.product?.title || 'Product',
            description: item.product?.description || '',
            image: item.product?.image?.startsWith('http')
              ? item.product.image
              : item.product?.image
                ? `http://localhost:5001${item.product.image}`
                : 'https://via.placeholder.com/200',
            price: item.product?.price || 0,
            quantity: item.quantity || 1
          });
        }
      }
    });

    return Array.from(itemsMap.values());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectItem = (productId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item._id || item.id)));
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0) {
      alert('Please select items to remove');
      return;
    }
    if (!window.confirm(`Remove ${selectedItems.size} item(s) from cart?`)) {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to manage cart');
      return;
    }
    try {
      // Remove all selected items - ensure productIds are strings
      const removePromises = Array.from(selectedItems).map(productId =>
        api.removeFromCart(String(productId))
      );
      await Promise.all(removePromises);
      // Reload cart
      const response = await api.getCart();
      if (response.success && response.cart && response.cart.items) {
        const items = response.cart.items.map((item) => ({
          _id: item.product?._id || item.product,
          id: item.product?._id || item.product,
          title: item.product?.title || 'Product',
          description: item.product?.description || '',
          image: item.product?.image?.startsWith('http')
            ? item.product.image
            : item.product?.image
              ? `http://localhost:5001${item.product.image}`
              : 'https://via.placeholder.com/200',
          price: item.product?.price || 0,
          quantity: item.quantity || 1
        }));
        setCartItems(items);
        setSelectedItems(new Set());
      }
    } catch (error) {
      console.error('Failed to remove items:', error);
      alert('Failed to remove items from cart');
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.getCart();
        if (response.success && response.cart && response.cart.items) {
          const items = processCartItems(response.cart.items);
          setCartItems(items);
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const selectedCartItems = selectedItems.size > 0
    ? cartItems.filter(item => selectedItems.has(item._id || item.id))
    : cartItems;

  const subtotal = selectedCartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    const itemsToCheckout = selectedItems.size > 0
      ? cartItems.filter(item => selectedItems.has(item._id || item.id))
      : cartItems;

    if (itemsToCheckout.length === 0) {
      alert('Please select items to checkout or your cart is empty');
      return;
    }
    if (!user) {
      alert('Please login to place an order. Only logged-in users can place orders.');
      navigate('/login');
      return;
    }
    try {
      setSubmitting(true);
      const orderData = {
        items: itemsToCheckout.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity || 1,
          price: item.price
        })),
        billingDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          province: formData.province,
          district: formData.district,
          city: formData.city,
          streetAddress: formData.streetAddress,
          apartment: formData.apartment || '',
          zipCode: formData.zipCode,
          phone: formData.phone,
          email: formData.email,
          orderNotes: formData.orderNotes || ''
        },
        paymentMethod: 'cod'
      };
      const response = await api.createOrder(orderData);
      if (response.success) {
        alert('Order placed successfully!');
        setShowCheckout(false);
        setFormData({
          firstName: '',
          lastName: '',
          province: '',
          district: '',
          city: '',
          streetAddress: '',
          apartment: '',
          zipCode: '',
          phone: '',
          email: '',
          orderNotes: ''
        });
        // Remove ordered items from cart
        const removePromises = itemsToCheckout.map(item =>
          api.removeFromCart(item._id || item.id)
        );
        await Promise.all(removePromises);
        // Reload cart
        const cartResponse = await api.getCart();
        if (cartResponse.success && cartResponse.cart && cartResponse.cart.items) {
          // Deduplicate items by product ID and merge quantities
          const itemsMap = new Map();

          cartResponse.cart.items.forEach((item) => {
            const productId = item.product?._id?.toString() || item.product?.toString() || item.product;
            if (productId) {
              if (itemsMap.has(productId)) {
                const existing = itemsMap.get(productId);
                existing.quantity += item.quantity || 1;
              } else {
                itemsMap.set(productId, {
                  _id: productId,
                  id: productId,
                  title: item.product?.title || 'Product',
                  description: item.product?.description || '',
                  image: item.product?.image?.startsWith('http')
                    ? item.product.image
                    : item.product?.image
                      ? `http://localhost:5001${item.product.image}`
                      : 'https://via.placeholder.com/200',
                  price: item.product?.price || 0,
                  quantity: item.quantity || 1
                });
              }
            }
          });

          const items = Array.from(itemsMap.values());
          setCartItems(items);
          setSelectedItems(new Set());
        }
        navigate('/');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert(`Failed to place order: ${error.message || 'Please check all fields are filled correctly'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to manage cart');
      return;
    }
    try {
      // Ensure productId is a string
      const productIdStr = String(productId);
      await api.removeFromCart(productIdStr);
      // Reload cart after removal
      const response = await api.getCart();
      if (response.success && response.cart && response.cart.items) {
        const items = processCartItems(response.cart.items);
        setCartItems(items);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('Failed to remove item from cart');
    }
  };

  const handleQuantityChange = async (productId, delta) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to manage cart');
      return;
    }
    const item = cartItems.find(i => (i._id || i.id) === productId);
    if (!item) return;

    const newQuantity = Math.max(1, (item.quantity || 1) + delta);
    try {
      // Ensure productId is a string
      const productIdStr = String(productId);
      await api.updateCartItem(productIdStr, newQuantity);
      // Reload cart after update
      const response = await api.getCart();
      if (response.success && response.cart && response.cart.items) {
        // Deduplicate items by product ID and merge quantities
        const itemsMap = new Map();

        response.cart.items.forEach((item) => {
          const productId = item.product?._id?.toString() || item.product?.toString() || item.product;
          if (productId) {
            if (itemsMap.has(productId)) {
              const existing = itemsMap.get(productId);
              existing.quantity += item.quantity || 1;
            } else {
              itemsMap.set(productId, {
                _id: productId,
                id: productId,
                title: item.product?.title || 'Product',
                description: item.product?.description || '',
                image: item.product?.image?.startsWith('http')
                  ? item.product.image
                  : item.product?.image
                    ? `http://localhost:5001${item.product.image}`
                    : 'https://via.placeholder.com/200',
                price: item.product?.price || 0,
                quantity: item.quantity || 1
              });
            }
          }
        });

        const items = Array.from(itemsMap.values());
        setCartItems(items);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert('Failed to update quantity');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-12 flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
            <Link to="/" className="px-6 py-3 bg-amber-900 text-white rounded-lg hover:bg-amber-800 inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {/* Select All / Remove Selected */}
              {cartItems.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                      onChange={handleSelectAll}
                      className="w-5 h-5 text-amber-900 border-gray-300 rounded focus:ring-amber-900"
                      style={{ accentColor: '#78350F' }}
                    />
                    <span className="text-gray-700 font-semibold">
                      Select All ({selectedItems.size} selected)
                    </span>
                  </label>
                  {selectedItems.size > 0 && (
                    <button
                      onClick={handleRemoveSelected}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Remove Selected
                    </button>
                  )}
                </div>
              )}
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const productId = item._id || item.id;
                  const isSelected = selectedItems.has(productId);
                  return (
                    <div key={productId} className={`bg-white border rounded-lg p-4 flex flex-col sm:flex-row gap-4 ${isSelected ? 'border-amber-900 border-2' : 'border-gray-200'}`}>
                      {/* Checkbox */}
                      <div className="flex items-start pt-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectItem(productId)}
                          className="w-5 h-5 text-amber-900 border-gray-300 rounded focus:ring-amber-900 mt-1"
                          style={{ accentColor: '#78350F' }}
                        />
                      </div>
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-48 sm:h-32 bg-gray-100 rounded-lg flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{item.description}</p>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-700">Quantity:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuantityChange(productId, -1)}
                                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(productId, 1)}
                                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-lg font-semibold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Rs. {item.price?.toLocaleString() || '0'} each</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemove(productId)}
                          className="mt-4 text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>Rs. {shipping}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>Rs. {total}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!user) {
                      alert('Please login to place an order. Only logged-in users can place orders.');
                      navigate('/login');
                      return;
                    }
                    if (selectedItems.size === 0 && cartItems.length > 0) {
                      if (!window.confirm('No items selected. Checkout all items?')) {
                        return;
                      }
                      setSelectedItems(new Set(cartItems.map(item => item._id || item.id)));
                    }
                    setShowCheckout(true);
                  }}
                  className="w-full bg-amber-900 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 mb-4"
                >
                  {selectedItems.size > 0
                    ? `Proceed to Checkout (${selectedItems.size} item${selectedItems.size > 1 ? 's' : ''})`
                    : 'Proceed to Checkout'
                  }
                </button>

                <Link to="/" className="block text-center text-amber-900 hover:text-amber-800">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Billing Details</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side - Billing Form */}
                <div className="lg:col-span-2">
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    {/* First Name and Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                        />
                      </div>
                    </div>

                    {/* Province and District */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Province <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="province"
                          value={formData.province}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                        >
                          {provinces.map((province) => (
                            <option key={province} value={province === 'Select a Province' ? '' : province}>
                              {province}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          District <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                        >
                          {districts.map((district) => (
                            <option key={district} value={district === 'Select a District' ? '' : district}>
                              {district}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                      />
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        placeholder="House number and street name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                      />
                    </div>

                    {/* Apartment */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Apartment, suite, unit etc. (optional)
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                      />
                    </div>

                    {/* Zip Code and Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Zip/Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                      />
                    </div>

                    {/* Order Notes */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Order notes
                      </label>
                      <textarea
                        name="orderNotes"
                        value={formData.orderNotes}
                        onChange={handleInputChange}
                        placeholder="Notes about your order (optional)"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-amber-900 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 mt-6 disabled:opacity-50"
                    >
                      {submitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </form>
                </div>

                {/* Right Side - Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Your order</h3>

                    <div className="space-y-4 mb-6">
                      {selectedCartItems.map((item) => (
                        <div key={item._id || item.id} className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">{item.title}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="text-gray-900 font-semibold">Rs {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                      {selectedCartItems.length === 0 && (
                        <p className="text-gray-500 text-sm text-center py-4">No items selected</p>
                      )}

                      <div className="border-t border-gray-300 pt-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Subtotal</span>
                          <span className="text-gray-900 font-semibold">Rs {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">Shipping</span>
                          <span className="text-green-600 font-semibold">Free</span>
                        </div>
                        <div className="border-t border-gray-300 pt-4 mt-4">
                          <div className="flex justify-between">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-lg font-bold text-gray-900">Rs {total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="border-t border-gray-300 pt-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          defaultChecked
                          className="w-5 h-5 text-amber-900 focus:ring-amber-900"
                          style={{ accentColor: '#78350F' }}
                        />
                        <span className="text-gray-900 font-semibold">Cash on delivery</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Cart;

