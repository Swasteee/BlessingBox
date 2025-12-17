# Pooja Ecommerce Backend API

Backend API for Pooja Ecommerce application built with Node.js, Express, and MongoDB.

## Features

- User authentication (register, login)
- Product management (CRUD operations)
- Shopping cart functionality
- Order management
- Contact form submissions
- Admin authentication and management

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for request validation
- Bcrypt for password hashing

## Project Structure

```
Backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/                   # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── Contact.js
│   │   └── Admin.js
│   ├── repositories/             # Data access layer
│   │   ├── UserRepository.js
│   │   ├── ProductRepository.js
│   │   ├── OrderRepository.js
│   │   ├── CartRepository.js
│   │   ├── ContactRepository.js
│   │   └── AdminRepository.js
│   ├── controllers/              # Business logic
│   │   ├── AuthController.js
│   │   ├── ProductController.js
│   │   ├── CartController.js
│   │   ├── OrderController.js
│   │   ├── ContactController.js
│   │   └── AdminController.js
│   ├── routes/                   # API routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── contactRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/               # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── utils/
│   │   └── validators.js        # Request validation
│   ├── app.js                    # Express app configuration
│   └── server.js                 # Server entry point
├── package.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pooja_ecommerce
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Make sure MongoDB is running on your system.

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/admin` - Get all products (admin, protected)
- `POST /api/products` - Create product (admin, protected)
- `PUT /api/products/:id` - Update product (admin, protected)
- `DELETE /api/products/:id` - Delete product (admin, protected)

### Cart
- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/update` - Update cart item (protected)
- `DELETE /api/cart/item/:productId` - Remove item from cart (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders/my-orders` - Get user orders (protected)
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

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Database Models

### User
- name, email, password, dateOfBirth, location, avatar, phone, role

### Product
- title, description, image, price, stock, category, isActive

### Order
- user, items, billingDetails, totalAmount, shippingCost, status, paymentMethod, paymentStatus

### Cart
- user, items

### Contact
- firstName, lastName, email, phoneNumber, subject, message, isRead

### Admin
- username, password, email, role

## Notes

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Request validation is handled using express-validator
- The project follows a modular architecture with repositories pattern

