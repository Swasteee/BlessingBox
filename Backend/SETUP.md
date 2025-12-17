# Backend Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed and running locally, or MongoDB Atlas account

## Installation Steps

1. **Install Dependencies**
   ```bash
   cd Backend
   npm install
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pooja_ecommerce
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

   **For MongoDB Atlas (Cloud):**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pooja_ecommerce?retryWrites=true&w=majority
   ```

3. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   # On Windows
   mongod
   
   # On macOS/Linux
   sudo systemctl start mongod
   # or
   mongod
   ```

4. **Seed Admin User**
   
   Create the default admin user:
   ```bash
   npm run seed:admin
   ```
   
   Default admin credentials:
   - Username: `admin`
   - Password: `Admin123`

5. **Start the Server**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

6. **Verify Installation**
   
   Open your browser or use Postman/Thunder Client:
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

## Testing the API

### Test User Registration
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

### Test Admin Login
```bash
POST http://localhost:5000/api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin123"
}
```

### Test Get Products
```bash
GET http://localhost:5000/api/products
```

## API Base URL

- Development: `http://localhost:5000`
- Production: Update `PORT` in `.env` file

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify MongoDB connection string format

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using port 5000

### Module Not Found
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## Next Steps

1. Connect your frontend to this backend API
2. Update frontend API base URL to `http://localhost:5000/api`
3. Test all endpoints using Postman or similar tool

