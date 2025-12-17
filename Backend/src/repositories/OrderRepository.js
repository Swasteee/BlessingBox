const Order = require('../models/Order');

class OrderRepository {
  async create(orderData) {
    const order = new Order(orderData);
    return await order.save();
  }

  async findByUserId(userId) {
    return await Order.find({ user: userId })
      .populate('items.product', 'title image price')
      .sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Order.findById(id)
      .populate('user', 'name email')
      .populate('items.product', 'title image price');
  }

  async findAll() {
    return await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'title image price')
      .sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (order) {
      return await Order.findById(id)
        .populate('user', 'name email')
        .populate('items.product', 'title image price');
    }
    return order;
  }

  async delete(id) {
    return await Order.findByIdAndDelete(id);
  }
}

module.exports = new OrderRepository();

