const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('adminToken');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const getFormDataHeaders = (token) => {
  const authToken = token || getAuthToken();
  return {
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Auth APIs
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (userData, avatarFile = null) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    // Add text fields
    if (userData.name) formData.append('name', userData.name);
    if (userData.email) formData.append('email', userData.email);
    if (userData.location !== undefined) formData.append('location', userData.location);
    if (userData.phone !== undefined) formData.append('phone', userData.phone);
    if (userData.avatar && !avatarFile) formData.append('avatar', userData.avatar); // For URL avatars

    // Add avatar file if provided
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData, browser will set it with boundary
      },
      body: formData,
    });
    return handleResponse(response);
  },

  // Product APIs
  getProducts: async (featured = false, search = '') => {
    let url = featured
      ? `${API_BASE_URL}/products?featured=true`
      : `${API_BASE_URL}/products`;
    if (search) {
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}search=${encodeURIComponent(search)}`;
    }
    const response = await fetch(url);
    return handleResponse(response);
  },

  getProductById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse(response);
  },

  // Admin Product APIs
  getAdminProducts: async () => {
    const adminToken = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/products/admin`, {
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      },
    });
    return handleResponse(response);
  },

  createProduct: async (productData) => {
    const adminToken = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    if (productData.stock !== undefined) formData.append('stock', productData.stock);
    if (productData.category) formData.append('category', productData.category);
    if (productData.featured !== undefined) formData.append('featured', productData.featured);
    if (productData.image instanceof File) {
      formData.append('image', productData.image);
    } else if (productData.image) {
      formData.append('image', productData.image);
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      },
      body: formData,
    });
    return handleResponse(response);
  },

  updateProduct: async (id, productData) => {
    const adminToken = localStorage.getItem('adminToken');
    const formData = new FormData();
    if (productData.title) formData.append('title', productData.title);
    if (productData.description) formData.append('description', productData.description);
    if (productData.price !== undefined) formData.append('price', productData.price);
    if (productData.stock !== undefined) formData.append('stock', productData.stock);
    if (productData.category) formData.append('category', productData.category);
    if (productData.isActive !== undefined) formData.append('isActive', productData.isActive);
    if (productData.featured !== undefined) formData.append('featured', productData.featured);
    if (productData.image instanceof File) {
      formData.append('image', productData.image);
    } else if (productData.image) {
      formData.append('image', productData.image);
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      },
      body: formData,
    });
    return handleResponse(response);
  },

  deleteProduct: async (id) => {
    const adminToken = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      },
    });
    return handleResponse(response);
  },

  // Cart APIs
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    return handleResponse(response);
  },

  updateCartItem: async (productId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    return handleResponse(response);
  },

  removeFromCart: async (productId) => {
    const response = await fetch(`${API_BASE_URL}/cart/item/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  clearCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Order APIs
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  getMyOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getOrderById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAdminOrders: async () => {
    const adminToken = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/orders/admin/all`, {
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      },
    });
    return handleResponse(response);
  },

  updateOrderStatus: async (orderId, status) => {
    const adminToken = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  // Contact APIs
  submitContact: async (contactData) => {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    return handleResponse(response);
  },

  // Admin APIs
  adminLogin: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  getAdminContacts: async () => {
    const adminToken = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/contact/admin`, {
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      },
    });
    return handleResponse(response);
  },

  deleteContact: async (id) => {
    const adminToken = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/contact/admin/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken && { Authorization: `Bearer ${adminToken}` }),
      },
    });
    return handleResponse(response);
  },
};

export default api;

