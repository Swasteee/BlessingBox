import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import api from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAdmin();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
    stock: '',
    category: '',
    featured: false
  });
  const [uploadError, setUploadError] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminProducts();
      setProducts(response.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const response = await api.getAdminContacts();
      setContacts(response.contacts || []);
    } catch (error) {
      console.error('Failed to load contacts:', error);
      alert('Failed to load contacts');
    }
  };

  const loadOrders = async () => {
    try {
      const response = await api.getAdminOrders();
      setOrders(response.orders || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      alert('Failed to load orders');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      // Reload orders to reflect the change
      await loadOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status');
    }
  };

  // Map order status for admin display
  const getAdminStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'processing':
        return 'Packed';
      case 'shipped':
        return 'Shifted for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Order Placed';
    }
  };

  useEffect(() => {
    loadProducts();
    loadContacts();
    loadOrders();
  }, []);

  useEffect(() => {
    if (activeSection === 'products') {
      loadProducts();
    } else if (activeSection === 'contacts') {
      loadContacts();
    } else if (activeSection === 'orders') {
      loadOrders();
    }
  }, [activeSection]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      description: '',
      image: '',
      price: '',
      stock: '',
      category: '',
      featured: false
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      image: product.image,
      price: product.price.toString(),
      stock: product.stock?.toString() || '',
      category: product.category || '',
      featured: product.featured || false
    });
    setSelectedImageFile(null);
    setShowProductModal(true);
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setUploadError('Only JPG, PNG, WEBP, GIF images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5MB.');
      return;
    }
    setUploadError('');
    setSelectedImageFile(file);
    if (!editingProduct) {
      setProductForm((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        alert('Product deleted successfully');
        loadProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const productData = {
        title: productForm.title,
        description: productForm.description,
        price: parseFloat(productForm.price),
        stock: productForm.stock ? parseInt(productForm.stock) : 0,
        category: productForm.category || 'general',
        featured: productForm.featured || false,
        image: selectedImageFile || productForm.image
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct._id || editingProduct.id, productData);
        alert('Product updated successfully');
      } else {
        await api.createProduct(productData);
        alert('Product created successfully');
      }

      setShowProductModal(false);
      setEditingProduct(null);
      setSelectedImageFile(null);
      setProductForm({
        title: '',
        description: '',
        image: '',
        price: '',
        stock: '',
        category: '',
        featured: false
      });
      loadProducts();
    } catch (error) {
      alert(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await api.deleteContact(id);
        alert('Contact deleted successfully');
        loadContacts();
      } catch (error) {
        alert('Failed to delete contact');
      }
    }
  };

  // Calculate statistics
  const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalContacts = contacts.length;

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📦' },
    { id: 'orders', label: 'Orders', icon: '🛒' },
    { id: 'contacts', label: 'Contacts', icon: '📧' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeSection === item.id
                      ? 'bg-amber-900 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {activeSection === 'dashboard' ? 'Dashboard Overview' : activeSection}
            </h2>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Dashboard Statistics */}
          {activeSection === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Sales</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">Rs {totalSales.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{totalOrders}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <span className="text-2xl">🛒</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Products</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{totalProducts}</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <span className="text-2xl">📦</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Contacts</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{totalContacts}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <span className="text-2xl">📧</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
                {orders.length === 0 ? (
                  <p className="text-gray-600">No orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {order.billingDetails?.firstName} {order.billingDetails?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{order.billingDetails?.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">Rs {order.totalAmount?.toLocaleString() || '0'}</p>
                          <p className="text-sm text-gray-600 capitalize">{order.status || 'pending'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Section */}
          {activeSection === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
                <button
                  onClick={handleAddProduct}
                  className="px-6 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition-colors"
                >
                  Add Product
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                  <p className="text-gray-600">No products found. Add your first product!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id || product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <img
                        src={product.image?.startsWith('http') ? product.image : `http://localhost:5001${product.image}`}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{product.title}</h3>
                          {product.featured && (
                            <span className="px-2 py-1 text-xs font-semibold bg-amber-900 text-white rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <p className="text-lg font-bold text-black mb-4">Rs {product.price.toLocaleString()}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id || product.id)}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Section */}
          {activeSection === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders Management</h2>
              {orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
                  <p className="text-gray-600">No orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Order #{order._id?.slice(-8) || 'N/A'}
                            </h3>
                            {order.createdAt && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {order.billingDetails?.firstName} {order.billingDetails?.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{order.billingDetails?.email}</p>
                          <p className="text-sm text-gray-600">{order.billingDetails?.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900 mb-2">Rs {order.totalAmount?.toLocaleString() || '0'}</p>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                      'bg-red-100 text-red-800'
                              }`}>
                              {getAdminStatusLabel(order.status || 'pending')}
                            </span>
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-900"
                            >
                              <option value="pending">Order Placed</option>
                              <option value="processing">Packed</option>
                              <option value="shipped">Shifted for Delivery</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">Address:</span> {order.billingDetails?.streetAddress}, {order.billingDetails?.city}, {order.billingDetails?.district}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">Payment:</span> {order.paymentMethod || 'COD'} - {order.paymentStatus || 'pending'}
                        </p>
                        <div className="mt-4">
                          <p className="font-semibold text-gray-900 mb-2">Items:</p>
                          <div className="space-y-3">
                            {order.items?.map((item, idx) => {
                              const productImageSrc = item.product?.image?.startsWith('http')
                                ? item.product.image
                                : item.product?.image
                                  ? `http://localhost:5001${item.product.image}`
                                  : 'https://via.placeholder.com/100';
                              return (
                                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                  <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={productImageSrc}
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
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contacts Section */}
          {activeSection === 'contacts' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Messages</h2>
              {contacts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
                  <p className="text-gray-600">No contact messages yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact._id || contact.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {contact.firstName} {contact.lastName}
                            </h3>
                            {contact.createdAt && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {new Date(contact.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{contact.email}</p>
                          <p className="text-sm text-gray-600">{contact.phone || contact.phoneNumber}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteContact(contact._id || contact.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="space-y-2">
                        {contact.province && <p><span className="font-semibold">Province:</span> {contact.province}</p>}
                        {contact.district && <p><span className="font-semibold">District:</span> {contact.district}</p>}
                        {contact.city && <p><span className="font-semibold">City:</span> {contact.city}</p>}
                        {contact.streetAddress && <p><span className="font-semibold">Address:</span> {contact.streetAddress}</p>}
                        {contact.apartment && <p><span className="font-semibold">Apartment:</span> {contact.apartment}</p>}
                        {contact.zipCode && <p><span className="font-semibold">Zip Code:</span> {contact.zipCode}</p>}
                        {contact.subject && <p><span className="font-semibold">Subject:</span> {contact.subject}</p>}
                        {contact.message && (
                          <div>
                            <p className="font-semibold mb-1">Message:</p>
                            <p className="text-gray-700">{contact.message}</p>
                          </div>
                        )}
                        {contact.orderNotes && (
                          <div>
                            <p className="font-semibold mb-1">Order Notes:</p>
                            <p className="text-gray-700">{contact.orderNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                    setSelectedImageFile(null);
                    setProductForm({
                      title: '',
                      description: '',
                      image: '',
                      price: '',
                      stock: '',
                      category: '',
                      featured: false
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Product Title *</label>
                  <input
                    type="text"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description *</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 resize-none"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Upload Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0])}
                    className="w-full text-sm text-gray-700"
                  />
                  {uploadError && <p className="text-red-600 text-sm mt-2">{uploadError}</p>}
                  {selectedImageFile && (
                    <p className="text-green-700 text-sm mt-2">Image selected: {selectedImageFile.name}</p>
                  )}
                  {!selectedImageFile && editingProduct && productForm.image && (
                    <p className="text-gray-600 text-sm mt-2">Current image will be kept if no new file is selected.</p>
                  )}
                </div>

                {!selectedImageFile && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Or Image URL</label>
                    <input
                      type="url"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Stock</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                    placeholder="general"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Price (Rs) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="w-5 h-5 text-amber-900 border-gray-300 rounded focus:ring-amber-900"
                      style={{ accentColor: '#78350F' }}
                    />
                    <span className="text-gray-700 font-semibold">Show on Home Page</span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1 ml-7">Check this to display the product on the home page</p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductModal(false);
                      setEditingProduct(null);
                      setSelectedImageFile(null);
                      setProductForm({
                        title: '',
                        description: '',
                        image: '',
                        price: '',
                        stock: '',
                        category: '',
                        featured: false
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
