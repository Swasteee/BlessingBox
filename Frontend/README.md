# Pooja Ecommerce Frontend

An e-commerce website for pooja products built with React and Tailwind CSS.

## Features

- **Home Page**: Product listing with header, banner, and product grid
- **Shop Page**: Product grid with pagination controls
- **Contact Page**: Contact form with contact information panel and social media links
- **Login Page**: User authentication with email/password and Google sign-in option
- **Register Page**: User registration with name, date of birth, email, and password
- **Cart Page**: Shopping cart with order summary and checkout functionality
- **Product Details Page**: Detailed product view with image, description, quantity selector, and reviews

## Tech Stack

- React 18
- React Router DOM
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
Frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Header.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Shop.js
│   │   ├── Contact.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Cart.js
│   │   └── ProductDetails.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Available Routes

- `/` - Home page
- `/shop` - Shop page with product grid and pagination
- `/contact` - Contact page with form and contact information
- `/login` - Login page
- `/register` - Register page
- `/cart` - Shopping cart page
- `/product/:id` - Product details page

## Development

Run the development server with hot reload:
```bash
npm start
```

Build for production:
```bash
npm run build
```

