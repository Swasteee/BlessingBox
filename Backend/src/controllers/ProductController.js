const ProductRepository = require('../repositories/ProductRepository');

class ProductController {
  async getAllProducts(req, res) {
    try {
      const filters = {};
      if (req.query.featured === 'true') {
        filters.featured = true;
      }
      if (req.query.category) {
        filters.category = req.query.category;
      }
      if (req.query.search) {
        filters.search = req.query.search;
      }
      const products = await ProductRepository.findAll(filters);
      res.json({
        success: true,
        count: products.length,
        products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await ProductRepository.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      res.json({
        success: true,
        product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async createProduct(req, res) {
    try {
      const { title, description, price, stock, category, featured } = req.body;
      
      let imageUrl = '';
      if (req.file) {
        imageUrl = `/uploads/products/${req.file.filename}`;
      } else if (req.body.image) {
        imageUrl = req.body.image;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Product image is required',
        });
      }

      const product = await ProductRepository.create({
        title,
        description,
        image: imageUrl,
        price,
        stock: stock || 0,
        category: category || 'general',
        featured: featured === 'true' || featured === true,
      });

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const { title, description, price, stock, category, isActive, featured } = req.body;
      const updateData = {};

      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (price !== undefined) updateData.price = price;
      if (stock !== undefined) updateData.stock = stock;
      if (category) updateData.category = category;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (featured !== undefined) {
        updateData.featured = featured === 'true' || featured === true;
      }

      if (req.file) {
        updateData.image = `/uploads/products/${req.file.filename}`;
      } else if (req.body.image) {
        updateData.image = req.body.image;
      }

      const product = await ProductRepository.update(req.params.id, updateData);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      res.json({
        success: true,
        product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await ProductRepository.delete(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      res.json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async getAllProductsForAdmin(req, res) {
    try {
      const products = await ProductRepository.findAllForAdmin();
      res.json({
        success: true,
        count: products.length,
        products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }
}

module.exports = new ProductController();

