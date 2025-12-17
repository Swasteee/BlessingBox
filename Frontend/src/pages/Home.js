import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [checkoutData, setCheckoutData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await api.getProducts(true); // Fetch only featured products
        setProducts(response.products || []);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }
    if (!product._id && !product.id) {
      alert('Product ID is missing');
      return;
    }
    try {
      // Check if product is already in cart
      const cartResponse = await api.getCart();
      if (cartResponse.success && cartResponse.cart && cartResponse.cart.items) {
        const productId = product._id || product.id;
        const existsInCart = cartResponse.cart.items.some(
          item => (item.product?._id || item.product?.toString() || item.product) === productId.toString()
        );
        if (existsInCart) {
          alert('This product is already in your cart');
          return;
        }
      }
      const response = await api.addToCart(product._id || product.id, 1);
      if (response.success) {
        alert('Product added to cart');
      } else {
        alert(response.message || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert(`Failed to add product to cart: ${error.message || 'Please try again'}`);
    }
  };

  const handleBuy = (product) => {
    setCheckoutItem(product);
  };

  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    // Here you would call an API; for now we just clear and close.
    setCheckoutItem(null);
    setCheckoutData({ name: '', email: '', phone: '', address: '' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Banner Section */}
      <div className="bg-amber-900 w-full relative overflow-hidden">
        <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left Side Image */}
            <div className="w-full md:w-1/3 flex items-center justify-center mb-4 md:mb-0">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/400x500/D4AF37/8B4513?text=Diya+Stand+Kalash+Brass+Items"
                  alt="Pooja items"
                  className="rounded-lg shadow-lg w-full max-w-xs md:max-w-none"
                />
              </div>
            </div>

            {/* Text Overlay */}
            <div className="flex-1 text-center px-4 md:px-8">
              <h2 className="text-white text-xl md:text-2xl mb-2">This Tihar</h2>
              <p className="text-white text-lg md:text-xl mb-2">Celebrate with our custom selected</p>
              <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">Utensils and components</h1>
            </div>

            {/* Right Side Detail */}
            <div className="hidden md:flex md:w-1/6 items-center justify-center">
              <svg className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-8 md:py-12 flex-1">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product._id || product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
                {/* Product Image */}
                <Link to={`/product/${product._id || product.id}`} className="block w-full h-48 bg-gray-100 cursor-pointer">
                  <img
                    src={product.image?.startsWith('http') ? product.image : `http://localhost:5001${product.image}`}
                    alt={product.title}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  />
                </Link>

                {/* Product Info */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <Link to={`/product/${product._id || product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-amber-900">{product.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>

                  {/* Price */}
                  <div className="mb-2">
                    <p className="text-xl font-bold text-black">Rs {product.price?.toLocaleString() || '500'}</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 px-4 py-2 bg-amber-900 text-white rounded hover:bg-amber-800"
                    >
                      Add to Cart
                    </button>
                    <Link to={`/product/${product._id || product.id}`} className="flex-1">
                      <button
                        className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                      >
                        Buy
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Checkout Modal */}
      {checkoutItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setCheckoutItem(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">Checkout</h3>
            <p className="text-sm text-gray-600 mb-4">
              Buying: <span className="font-semibold">{checkoutItem.title}</span>
            </p>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={checkoutData.name}
                  onChange={handleCheckoutChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={checkoutData.email}
                  onChange={handleCheckoutChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={checkoutData.phone}
                  onChange={handleCheckoutChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={checkoutData.address}
                  onChange={handleCheckoutChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-900"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutItem(null)}
                  className="flex-1 py-2.5 rounded-md font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-md font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#78350F' }}
                >
                  Confirm & Buy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

