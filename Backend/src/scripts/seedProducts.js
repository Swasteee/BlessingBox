require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/database');

const seedProducts = async () => {
  try {
    await connectDB();

    const defaultProducts = [
      {
        title: "Jalani Pooja Samagri",
        description: "Complete Tihar pooja kit with diyos, colors, oil, tika, and all essential items for traditional celebrations.",
        image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
        price: 500,
        stock: 50,
        category: "pooja-kit"
      },
      {
        title: "Brass Diya Set",
        description: "Beautiful handcrafted brass diyas for lighting during festivals. Set of 12 pieces with traditional designs.",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        price: 850,
        stock: 30,
        category: "diya"
      },
      {
        title: "Copper Kalash",
        description: "Sacred copper kalash for pooja rituals. Perfect for storing holy water and performing religious ceremonies.",
        image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
        price: 1200,
        stock: 25,
        category: "kalash"
      },
      {
        title: "Incense Sticks Pack",
        description: "Premium quality incense sticks in various fragrances. Pack of 100 sticks for daily worship and meditation.",
        image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
        price: 350,
        stock: 100,
        category: "incense"
      },
      {
        title: "Rudraksha Mala",
        description: "Authentic Rudraksha prayer beads mala with 108 beads. Handcrafted for meditation and spiritual practices.",
        image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
        price: 2500,
        stock: 20,
        category: "mala"
      },
      {
        title: "Sandalwood Paste",
        description: "Pure sandalwood paste for tilak and pooja rituals. Natural and fragrant, perfect for religious ceremonies.",
        image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
        price: 450,
        stock: 40,
        category: "paste"
      },
      {
        title: "Pooja Thali Set",
        description: "Complete pooja thali set with compartments for kumkum, turmeric, rice, and other pooja essentials.",
        image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
        price: 750,
        stock: 35,
        category: "thali"
      },
      {
        title: "Ganesh Idol",
        description: "Beautiful brass Ganesh idol for home worship. Handcrafted with intricate details and traditional design.",
        image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
        price: 1800,
        stock: 15,
        category: "idol"
      }
    ];

    // Check if products already exist
    const existingProducts = await Product.find();
    if (existingProducts.length > 0) {
      console.log(`Products already exist in database (${existingProducts.length} products found)`);
      console.log('Skipping seed. To reseed, delete existing products first.');
      process.exit(0);
    }

    // Insert products
    const products = await Product.insertMany(defaultProducts);
    console.log(`Successfully seeded ${products.length} products to database:`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - Rs ${product.price}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();

