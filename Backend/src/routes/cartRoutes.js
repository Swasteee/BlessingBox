const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, CartController.getCart);
router.post('/add', protect, CartController.addToCart);
router.put('/update', protect, CartController.updateCartItem);
router.delete('/item/:productId', protect, CartController.removeFromCart);
router.delete('/clear', protect, CartController.clearCart);

module.exports = router;

