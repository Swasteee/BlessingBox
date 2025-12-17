# Pooja Ecommerce - Full Stack Application

A complete e-commerce platform for pooja products built with React (Frontend) and Node.js/Express (Backend).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Default Credentials](#default-credentials)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## Features

### User Features
- User registration and authentication
- Browse products on home page and shop page
- Product search functionality
- Product details view
- Shopping cart with quantity management
- Order placement with billing details
- Order history tracking
- User profile management with avatar upload
- Contact form submission

### Admin Features
- Admin authentication
- Product management (Create, Read, Update, Delete)
- Featured products toggle for home page display
- Order management with status updates
- Contact message management
- Dashboard with sales statistics
- Product image uploads

## Tech Stack

### Frontend
- **React** 18.2.0
- **React Router DOM** 6.20.0
- **Tailwind CSS** 3.3.6
- **React Scripts** 5.0.1

### Backend
- **Node.js** (v14 or higher)
- **Express.js** 4.18.2
- **MongoDB** with Mongoose 8.0.3
- **JWT** (JSON Web Tokens) for authentication
- **Bcryptjs** for password hashing
- **Multer** for file uploads
- **Express Validator** for request validation
- **CORS** for cross-origin requests

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher) - [Download Node.js](https://nodejs.org/)
2. **npm** (comes with Node.js) or **yarn**
3. **MongoDB** - Choose one:
   - **Local MongoDB** - [Download MongoDB](https://www.mongodb.com/try/download/community)
   - **MongoDB Atlas** (Cloud) - [Sign up for free](https://www.mongodb.com/cloud/atlas)

## Project Structure

```
pooja_Ecommerce/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, upload middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── repositories/    # Data access layer
│   │   ├── routes/          # API routes
│   │   ├── scripts/         # Seed scripts
│   │   ├── utils/           # Validators and utilities
│   │   ├── app.js           # Express app configuration
│   │   └── server.js        # Server entry point
│   ├── public/
│   │   └── uploads/         # Uploaded files (products, avatars)
│   ├── package.json
│   └── .env                 # Environment variables (create this)
│
└── Frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/      # Reusable components (Header, Footer)
    │   ├── context/         # React Context (Auth, Admin)
    │   ├── pages/          # Page components
    │   ├── utils/           # API utilities
    │   ├── App.js           # Main app component
    │   └── index.js         # Entry point
    ├── package.json
    └── tailwind.config.js
```

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd Backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- express-validator
- cors
- dotenv
- multer
- nodemon (dev dependency)

### 3. Configure Environment Variables

Create a `.env` file in the `Backend` directory:

```env
# Server Port
PORT=5000

# MongoDB Connection String
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/pooja_ecommerce

# For MongoDB Atlas (Cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pooja_ecommerce?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

# Environment
NODE_ENV=development
```

**Important:** Replace `your_jwt_secret_key_here_change_in_production` with a strong, random secret key in production.

### 4. Start MongoDB

**For Local MongoDB:**

- **Windows:**
  ```bash
  mongod
  ```
  Or start MongoDB as a Windows service.

- **macOS/Linux:**
  ```bash
  sudo systemctl start mongod
  # or
  mongod
  ```

**For MongoDB Atlas:**
- No local installation needed. Just use your connection string in the `.env` file.

### 5. Create Upload Directories

Create the necessary directories for file uploads:

```bash
# Windows (PowerShell)
mkdir -p public\uploads\products
mkdir -p public\uploads\avatars

# macOS/Linux
mkdir -p public/uploads/products
mkdir -p public/uploads/avatars
```

### 6. Seed Admin User

Create the default admin user:

```bash
npm run seed:admin
```

This will create an admin user with:
- **Username:** `admin`
- **Password:** `Admin123`
- **Email:** `admin@pooja.com`

**Note:** If the admin user already exists, the script will skip creation.

### 7. (Optional) Seed Sample Products

If you want to add sample products:

```bash
npm run seed:products
```

### 8. Start the Backend Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The backend server will start on `http://localhost:5000`

### 9. Verify Backend Installation

Open your browser or use a tool like Postman:

```
GET http://localhost:5000/
```

You should see:
```json
{
  "success": true,
  "message": "Pooja Ecommerce API is running"
}
```

## Frontend Setup

### 1. Navigate to Frontend Directory

Open a new terminal and navigate to the Frontend directory:

```bash
cd Frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- react
- react-dom
- react-router-dom
- react-scripts
- tailwindcss
- postcss
- autoprefixer

### 3. Configure API URL (Optional)

The frontend is configured to use `http://localhost:5000/api` by default. If your backend runs on a different URL, create a `.env` file in the `Frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start the Frontend Development Server

```bash
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## Running the Application

### Complete Setup Steps

1. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

2. **Start Backend Server** (Terminal 1)
   ```bash
   cd Backend
   npm run dev
   ```

3. **Start Frontend Server** (Terminal 2)
   ```bash
   cd Frontend
   npm start
   ```

4. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`

## Default Credentials

### Admin Login
- **URL:** `http://localhost:3000/admin/login`
- **Username:** `admin`
- **Password:** `Admin123`

### User Registration
Users need to register first at `http://localhost:3000/register` before they can log in.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all active products (with optional `featured` and `search` query params)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/admin` - Get all products for admin (protected)
- `POST /api/products` - Create product (admin, protected)
- `PUT /api/products/:id` - Update product (admin, protected)
- `DELETE /api/products/:id` - Delete product (admin, protected)

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart` - Add item to cart (protected)
- `PUT /api/cart/:itemId` - Update cart item quantity (protected)
- `DELETE /api/cart/:itemId` - Remove item from cart (protected)
- `DELETE /api/cart` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `GET /api/orders/admin/all` - Get all orders (admin, protected)
- `PUT /api/orders/:id/status` - Update order status (admin, protected)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact/admin` - Get all contacts (admin, protected)
- `GET /api/contact/admin/:id` - Get contact by ID (admin, protected)
- `DELETE /api/contact/admin/:id` - Delete contact (admin, protected)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get admin info (protected)

## Troubleshooting

### Backend Issues

#### MongoDB Connection Error
- **Error:** `MongoNetworkError` or connection timeout
- **Solution:**
  - Ensure MongoDB is running (check with `mongosh` or MongoDB Compass)
  - Verify `MONGODB_URI` in `.env` file is correct
  - For MongoDB Atlas, check your IP whitelist and connection string
  - Ensure network connectivity

#### Port Already in Use
- **Error:** `EADDRINUSE: address already in use :::5000`
- **Solution:**
  - Change `PORT` in `.env` file to a different port (e.g., `5001`)
  - Or stop the process using port 5000:
    ```bash
    # Windows
    netstat -ano | findstr :5000
    taskkill /PID <PID> /F
    
    # macOS/Linux
    lsof -ti:5000 | xargs kill -9
    ```

#### Module Not Found
- **Error:** `Cannot find module 'xyz'`
- **Solution:**
  ```bash
  cd Backend
  rm -rf node_modules package-lock.json
  npm install
  ```

#### JWT Secret Error
- **Error:** `jwt malformed` or token errors
- **Solution:**
  - Ensure `JWT_SECRET` is set in `.env` file
  - Use a strong, random secret key
  - Restart the server after changing `.env`

### Frontend Issues

#### Cannot Connect to Backend
- **Error:** `Network Error` or `Failed to fetch`
- **Solution:**
  - Ensure backend server is running on `http://localhost:5000`
  - Check `REACT_APP_API_URL` in Frontend `.env` file
  - Verify CORS is enabled in backend (should be by default)
  - Check browser console for detailed error messages

#### Module Not Found
- **Error:** `Cannot find module 'xyz'`
- **Solution:**
  ```bash
  cd Frontend
  rm -rf node_modules package-lock.json
  npm install
  ```

#### Port 3000 Already in Use
- **Error:** `Port 3000 is already in use`
- **Solution:**
  - Use a different port:
    ```bash
    PORT=3001 npm start
    ```
  - Or stop the process using port 3000

#### Tailwind CSS Not Working
- **Error:** Styles not applying
- **Solution:**
  - Ensure `tailwind.config.js` exists
  - Check `postcss.config.js` is configured
  - Restart the development server
  - Clear browser cache

### File Upload Issues

#### Images Not Uploading
- **Error:** Upload fails or images not displaying
- **Solution:**
  - Ensure `Backend/public/uploads/products` and `Backend/public/uploads/avatars` directories exist
  - Check file permissions on upload directories
  - Verify `multer` configuration in middleware
  - Check file size limits (default: 2MB for avatars, 5MB for products)

### Authentication Issues

#### Token Expired
- **Error:** `Token expired` or unauthorized access
- **Solution:**
  - Log out and log in again
  - Check `JWT_EXPIRE` in backend `.env` (default: 7d)
  - Clear browser localStorage and try again

#### Admin Access Denied
- **Error:** Cannot access admin routes
- **Solution:**
  - Ensure you're logged in as admin (not regular user)
  - Verify admin token is stored in localStorage
  - Check admin middleware is working correctly

## Development Scripts

### Backend Scripts
- `npm start` - Start server in production mode
- `npm run dev` - Start server in development mode with nodemon
- `npm run seed:admin` - Seed admin user
- `npm run seed:products` - Seed sample products

### Frontend Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production MongoDB
4. Set up proper file storage (consider cloud storage for uploads)
5. Use PM2 or similar process manager:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name pooja-backend
   ```

### Frontend
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `build` folder to a hosting service (Netlify, Vercel, etc.)
3. Update `REACT_APP_API_URL` to your production backend URL

## Additional Resources

- [Backend README](./Backend/README.md) - Detailed backend documentation
- [Backend SETUP Guide](./Backend/SETUP.md) - Backend setup instructions
- [Frontend README](./Frontend/README.md) - Frontend documentation

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the backend and frontend README files
3. Check console logs for detailed error messages

## License

ISC

