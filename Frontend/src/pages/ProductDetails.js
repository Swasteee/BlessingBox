import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await api.getProductById(id);
        if (response.success && response.product) {
          setProduct(response.product);
        } else {
          navigate('/shop');
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, navigate]);

  const provinces = ['Select a Province', 'Province 1', 'Province 2', 'Province 3', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'];
  const districts = ['Select a District', 'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Biratnagar', 'Dharan', 'Butwal'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBuy = () => {
    if (!user) {
      alert('Please login to place an order. Only logged-in users can place orders.');
      navigate('/login');
      return;
    }
    setShowCheckout(true);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }
    if (!product || !product._id) {
      alert('Product not available');
      return;
    }
    try {
      // Check if product is already in cart
      const cartResponse = await api.getCart();
      if (cartResponse.success && cartResponse.cart && cartResponse.cart.items) {
        const existsInCart = cartResponse.cart.items.some(
          item => (item.product?._id || item.product?.toString() || item.product) === product._id.toString()
        );
        if (existsInCart) {
          alert('This product is already in your cart');
          return;
        }
      }
      const response = await api.addToCart(product._id, quantity);
      if (response.success) {
        alert('Product added to cart');
      } else {
        alert(response.message || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      // Check if error is about product already in cart
      if (error.message && error.message.includes('already in your cart')) {
        alert('This product is already in your cart');
      } else {
        alert(`Failed to add product to cart: ${error.message || 'Please try again'}`);
      }
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!product || !product._id) {
      alert('Product not available');
      return;
    }
    if (!user) {
      alert('Please login to place an order. Only logged-in users can place orders.');
      navigate('/login');
      return;
    }
    try {
      const orderData = {
        items: [
          {
            product: product._id,
            quantity: quantity,
            price: product.price
          }
        ],
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
        navigate('/');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert(`Failed to place order: ${error.message || 'Please check all fields are filled correctly'}`);
    }
  };

  const total = product ? product.price * quantity : 0;

  const reviews = [
    {
      id: 1,
      userName: "Ramesh",
      phone: "+977********90",
      rating: 5,
      reviewText: "Very Good product"
    }
  ];

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Product not found</p>
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800"
              >
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const productImageSrc = product.image?.startsWith('http')
    ? product.image
    : `http://localhost:5001${product.image}`;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-gray-600">
            <button onClick={() => navigate(-1)} className="flex items-center hover:text-amber-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm">All products/catrgory/handpicked/{product.title}</span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Side - Product Image */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-lg">
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-8 relative overflow-hidden">
                  {/* Bokeh background effect */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-400 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-yellow-300 rounded-full blur-2xl"></div>
                  </div>
                  <img
                    src={productImageSrc}
                    alt={product.title}
                    className="relative z-10 w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Product Information */}
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">{product.title}</h1>

              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

              {/* Price */}
              <div className="mb-8">
                <p className="text-2xl font-bold text-black">Rs {product?.price?.toLocaleString() || '0'}</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      if (val >= 1) setQuantity(val);
                    }}
                    className="w-20 px-4 py-2 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-amber-900"
                    min="1"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-3 bg-amber-900 text-white rounded-lg font-semibold hover:bg-amber-800"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuy}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-100 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{review.userName}</p>
                        <p className="text-sm text-gray-600">{review.phone}</p>
                      </div>
                      {/* Stars */}
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.reviewText}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                        className="w-full bg-amber-900 text-white py-3 rounded-lg font-semibold hover:bg-amber-800 mt-6"
                      >
                        Place Order
                      </button>
                    </form>
                  </div>

                  {/* Right Side - Order Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Your order</h3>

                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">{product?.title || ''}</p>
                            <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                          </div>
                          <p className="text-gray-900 font-semibold">Rs {product?.price?.toLocaleString() || '0'}</p>
                        </div>

                        <div className="border-t border-gray-300 pt-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-700">Price</span>
                            <span className="text-gray-900 font-semibold">Rs {total.toLocaleString()}</span>
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
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;

