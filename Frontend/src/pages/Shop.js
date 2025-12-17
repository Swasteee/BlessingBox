import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';

const Shop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const productsPerPage = 12;
  const totalPages = Math.ceil(products.length / productsPerPage);

  useEffect(() => {
    // Get search query from URL
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || '';
    setSearchQuery(search);
    setCurrentPage(1); // Reset to first page when search changes
  }, [location.search]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await api.getProducts(false, searchQuery); // Fetch all products with search query
        setProducts(response.products || []);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchQuery]);

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

  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Page Header with Back Arrow */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-amber-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Shop Page</h1>
          </div>
          {searchQuery && (
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Search results for: <span className="font-semibold">"{searchQuery}"</span></span>
              <button
                onClick={() => {
                  navigate('/shop');
                }}
                className="text-gray-500 hover:text-gray-700 p-1"
                title="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-8 flex-1">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <div>
                <p className="text-gray-600 mb-4">No products found for "{searchQuery}".</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <p className="text-gray-600">No products found.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {paginatedProducts.map((product) => {
              const productImageSrc = product.image?.startsWith('http')
                ? product.image
                : `http://localhost:5001${product.image}`;
              return (
                <div key={product._id || product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
                  {/* Product Image */}
                  <Link to={`/product/${product._id || product.id}`} className="block w-full h-64 bg-gray-100">
                    <img
                      src={productImageSrc}
                      alt={product.title}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col h-full">
                    <Link to={`/product/${product._id || product.id}`}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-amber-900">{product.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>

                    {/* Price */}
                    <div className="mb-4">
                      <p className="text-xl font-bold text-black">Rs {product.price?.toLocaleString() || '0'}</p>
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
                        <button className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                          Buy
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && totalPages > 1 && (
          <div className="flex justify-center md:justify-end mt-8">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;&lt;
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 border border-gray-300 rounded ${currentPage === index + 1
                      ? 'bg-amber-900 text-white border-amber-900'
                      : 'hover:bg-gray-50'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;&gt;
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;

