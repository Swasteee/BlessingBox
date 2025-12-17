const Product = require('../models/Product');

class ProductRepository {
  async create(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async findAll(filters = {}) {
    const query = { isActive: true };
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.featured !== undefined) {
      query.featured = filters.featured;
    }
    if (filters.search) {
      // Search in title and description
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }
    return await Product.find(query).sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Product.findById(id);
  }

  async update(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }

  async findAllForAdmin() {
    return await Product.find().sort({ createdAt: -1 });
  }
}

module.exports = new ProductRepository();

