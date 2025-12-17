const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');
const { orderValidation } = require('../utils/validators');

router.post('/', protect, orderValidation, OrderController.createOrder);
router.get('/my-orders', protect, OrderController.getMyOrders);
router.get('/:id', protect, OrderController.getOrderById);
router.get('/admin/all', adminProtect, OrderController.getAllOrders);
router.put('/:id/status', adminProtect, OrderController.updateOrderStatus);

module.exports = router;

