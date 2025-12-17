# Database Verification Guide

## Yes, Products ARE Saved to MongoDB

Products are saved to MongoDB when:
1. Admin creates a product through the API (`POST /api/products`)
2. Admin creates a product through the admin dashboard (which calls the API)

## How Products are Saved

1. **Product Model** (`src/models/Product.js`)
   - Uses Mongoose schema connected to MongoDB
   - Fields: title, description, image, price, stock, category, isActive
   - Includes timestamps (createdAt, updatedAt)

2. **Product Repository** (`src/repositories/ProductRepository.js`)
   - `create()` method uses `new Product()` and `product.save()` which saves to MongoDB
   - All CRUD operations interact with MongoDB

3. **Database Connection** (`src/config/database.js`)
   - Connects to MongoDB using the `MONGODB_URI` from `.env` file
   - Database name: `pooja_ecommerce` (or as specified in MONGODB_URI)

## Verify Products are in Database

### Method 1: Using MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to your MongoDB instance (localhost:27017 or Atlas)
3. Select database: `pooja_ecommerce`
4. Select collection: `products`
5. You should see all products there

### Method 2: Using MongoDB Shell
```bash
# Connect to MongoDB
mongo

# Or if using MongoDB 6+
mongosh

# Switch to database
use pooja_ecommerce

# View all products
db.products.find().pretty()

# Count products
db.products.countDocuments()
```

### Method 3: Using API
```bash
# Get all products
GET http://localhost:5000/api/products

# Get products for admin (shows all including inactive)
GET http://localhost:5000/api/products/admin
Authorization: Bearer <admin_token>
```

## Seed Initial Products

To add sample products to your database, run:

```bash
npm run seed:products
```

This will add 8 default products to your database.

**Note:** The seed script will skip if products already exist. To reseed, delete existing products first.

## Check Database Connection

1. **Check `.env` file:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/pooja_ecommerce
   ```
   Or for MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pooja_ecommerce
   ```

2. **Start backend server:**
   ```bash
   npm run dev
   ```
   
   You should see: `MongoDB Connected: <host>`

3. **If connection fails:**
   - Check if MongoDB is running
   - Verify MONGODB_URI is correct
   - Check network/firewall settings (for Atlas)

## Database Collections

Your MongoDB database `pooja_ecommerce` will have these collections:
- `users` - User accounts
- `products` - Product catalog
- `orders` - Customer orders
- `carts` - Shopping carts
- `contacts` - Contact form submissions
- `admins` - Admin accounts

## Troubleshooting

### Products not showing up?
1. Check if backend server is running
2. Verify MongoDB connection (check server logs)
3. Check if products collection exists in database
4. Verify API endpoint is working: `GET http://localhost:5000/api/products`

### Products not saving?
1. Check admin authentication token
2. Verify request format (especially for file uploads)
3. Check server logs for errors
4. Verify MongoDB connection is active

### Database connection issues?
1. Ensure MongoDB is running locally OR Atlas cluster is accessible
2. Check `.env` file has correct `MONGODB_URI`
3. Verify network connectivity
4. Check MongoDB logs for connection errors

