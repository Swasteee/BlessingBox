const Cart = require('../models/Cart');

class CartRepository {
  async findByUserId(userId) {
    return await Cart.findOne({ user: userId })
      .populate('items.product', 'title image price stock');
  }

  async create(cartData) {
    const cart = new Cart(cartData);
    const savedCart = await cart.save();
    return await Cart.findById(savedCart._id)
      .populate('items.product', 'title image price stock');
  }

  async update(userId, updateData) {
    return await Cart.findOneAndUpdate(
      { user: userId },
      updateData,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).populate('items.product', 'title image price stock');
  }

  async clearCart(userId) {
    return await Cart.findOneAndUpdate(
      { user: userId },
      { items: [] },
      { new: true }
    );
  }

  async delete(userId) {
    return await Cart.findOneAndDelete({ user: userId });
  }
}

module.exports = new CartRepository();

