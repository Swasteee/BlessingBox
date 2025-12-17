const OrderRepository = require('../repositories/OrderRepository');
const CartRepository = require('../repositories/CartRepository');
const ProductRepository = require('../repositories/ProductRepository');

class OrderController {
  async createOrder(req, res) {
    try {
      const { items, billingDetails, paymentMethod } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Order items are required',
        });
      }

      if (!billingDetails) {
        return res.status(400).json({
          success: false,
          message: 'Billing details are required',
        });
      }

      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        if (!item.product || !item.quantity) {
          return res.status(400).json({
            success: false,
            message: 'Each item must have a product ID and quantity',
          });
        }

        const product = await ProductRepository.findById(item.product);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product ${item.product} not found`,
          });
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      const shippingCost = 0;
      const finalTotal = totalAmount + shippingCost;

      const order = await OrderRepository.create({
        user: req.user._id,
        items: orderItems,
        billingDetails,
        totalAmount: finalTotal,
        shippingCost,
        paymentMethod: paymentMethod || 'cod',
      });

      await CartRepository.clearCart(req.user._id);

      res.status(201).json({
        success: true,
        order,
      });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async getMyOrders(req, res) {
    try {
      const orders = await OrderRepository.findByUserId(req.user._id);
      res.json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await OrderRepository.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      if (order.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this order',
        });
      }

      res.json({
        success: true,
        order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await OrderRepository.findAll();
      res.json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { status } = req.body;

      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status',
        });
      }

      const order = await OrderRepository.update(req.params.id, { status });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      res.json({
        success: true,
        order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }
}

module.exports = new OrderController();

