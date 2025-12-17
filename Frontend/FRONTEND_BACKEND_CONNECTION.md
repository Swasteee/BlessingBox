# Frontend-Backend Connection Guide

This document explains how the frontend is connected to the backend API.

## Setup

1. **Create `.env` file in Frontend directory:**
   ```
   REACT_APP_API_URL=http://localhost:5001/api
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   cd Frontend
   npm install
   ```

## API Configuration

The API utility is located at `Frontend/src/utils/api.js` and handles all backend communication.

### Base URL
- Default: `http://localhost:5001/api`
- Can be configured via `REACT_APP_API_URL` environment variable

## Authentication

### User Authentication
- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`
- **Get Current User**: `GET /api/auth/me`
- **Update Profile**: `PUT /api/auth/profile`

Tokens are stored in `localStorage` as `token`.

### Admin Authentication
- **Login**: `POST /api/admin/login`
- Admin tokens are stored in `localStorage` as `adminToken`

## Updated Components

### Contexts
1. **AuthContext** (`src/context/AuthContext.js`)
   - Now uses backend API for login/register
   - Stores JWT token instead of user data
   - Automatically loads user on mount if token exists

2. **AdminContext** (`src/context/AdminContext.js`)
   - Uses backend API for admin login
   - Stores admin JWT token

### Pages Updated

1. **Login** (`src/pages/Login.js`)
   - Calls backend API for authentication
   - Shows error messages on failure

2. **Register** (`src/pages/Register.js`)
   - Calls backend API for registration
   - Automatically logs in after registration

3. **Home** (`src/pages/Home.js`)
   - Fetches products from backend API
   - Add to cart uses backend API (requires login)

4. **AdminLogin** (`src/pages/AdminLogin.js`)
   - Uses backend API for admin authentication

## Remaining Updates Needed

The following pages still need to be updated to use the backend API:

1. **Shop.js** - Fetch products from API
2. **ProductDetails.js** - Fetch product details, add to cart, create orders
3. **Cart.js** - Fetch cart from API, update quantities, remove items
4. **Contact.js** - Submit contact form to API
5. **Profile.js** - Update profile using API
6. **AdminDashboard.js** - CRUD operations for products and contacts

## Image URLs

Product images are served from:
- Uploaded images: `http://localhost:5001/uploads/products/<filename>`
- External URLs: Used as-is

## Error Handling

All API calls include error handling. Failed requests will:
- Show error messages to users
- Log errors to console
- Return appropriate error states

## Testing

1. Start the backend server:
   ```bash
   cd Backend
   npm run dev
   ```

2. Start the frontend:
   ```bash
   cd Frontend
   npm start
   ```

3. Test the connection:
   - Register a new user
   - Login with credentials
   - Browse products
   - Add items to cart (requires login)

## Notes

- All API calls require authentication tokens for protected routes
- Cart functionality requires user login
- Admin routes require admin authentication
- Image uploads use FormData for file uploads

