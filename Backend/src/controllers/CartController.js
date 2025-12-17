const CartRepository = require('../repositories/CartRepository');
const ProductRepository = require('../repositories/ProductRepository');

class CartController {
  async getCart(req, res) {
    try {
      let cart = await CartRepository.findByUserId(req.user._id);

      if (!cart) {
        cart = await CartRepository.create({
          user: req.user._id,
          items: [],
        });
      }

      res.json({
        success: true,
        cart,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required',
        });
      }

      const product = await ProductRepository.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      let cart = await CartRepository.findByUserId(req.user._id);

      if (!cart) {
        cart = await CartRepository.create({
          user: req.user._id,
          items: [{ product: productId, quantity: quantity || 1 }],
        });
      } else {
        const existingItemIndex = cart.items.findIndex(
          (item) => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
          return res.status(400).json({
            success: false,
            message: 'This product is already in your cart',
          });
        } else {
          cart.items.push({ product: productId, quantity: quantity || 1 });
        }

        cart = await CartRepository.update(req.user._id, { items: cart.items });
      }

      res.json({
        success: true,
        cart,
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async updateCartItem(req, res) {
    try {
      const { productId, quantity } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required',
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1',
        });
      }

      let cart = await CartRepository.findByUserId(req.user._id);

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found',
        });
      }

      // Handle both populated and non-populated product references
      const itemIndex = cart.items.findIndex((item) => {
        let itemProductId;
        if (item.product && typeof item.product === 'object' && item.product._id) {
          // Product is populated (object with _id)
          itemProductId = item.product._id.toString();
        } else if (item.product) {
          // Product is ObjectId
          itemProductId = item.product.toString();
        } else {
          return false;
        }
        return itemProductId === productId.toString();
      });

      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart',
        });
      }

      // Update quantity - ensure product reference is ObjectId, not populated object
      const updatedItems = cart.items.map((item, index) => {
        if (index === itemIndex) {
          return {
            product: item.product?._id || item.product,
            quantity: quantity
          };
        }
        return {
          product: item.product?._id || item.product,
          quantity: item.quantity
        };
      });
      
      cart = await CartRepository.update(req.user._id, { items: updatedItems });

      res.json({
        success: true,
        cart,
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async removeFromCart(req, res) {
    try {
      const { productId } = req.params;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required',
        });
      }

      let cart = await CartRepository.findByUserId(req.user._id);

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found',
        });
      }

      // Handle both populated and non-populated product references
      const filteredItems = cart.items.filter((item) => {
        let itemProductId;
        if (item.product && typeof item.product === 'object' && item.product._id) {
          // Product is populated (object with _id)
          itemProductId = item.product._id.toString();
        } else if (item.product) {
          // Product is ObjectId
          itemProductId = item.product.toString();
        } else {
          return true; // Keep items without product (shouldn't happen)
        }
        return itemProductId !== productId.toString();
      });

      // Convert populated objects back to ObjectIds before saving
      const itemsToSave = filteredItems.map((item) => ({
        product: item.product?._id || item.product,
        quantity: item.quantity
      }));

      cart = await CartRepository.update(req.user._id, { items: itemsToSave });

      res.json({
        success: true,
        cart,
      });
    } catch (error) {
      console.error('Error removing cart item:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await CartRepository.clearCart(req.user._id);
      res.json({
        success: true,
        cart,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }
}

module.exports = new CartController();

