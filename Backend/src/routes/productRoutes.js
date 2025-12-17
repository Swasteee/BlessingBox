const express = require('express');
const multer = require('multer');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { adminProtect } = require('../middleware/adminMiddleware');
const { productValidation } = require('../utils/validators');
const upload = require('../middleware/uploadMiddleware');

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

router.get('/', ProductController.getAllProducts);
router.get('/admin', adminProtect, ProductController.getAllProductsForAdmin);
router.get('/:id', ProductController.getProductById);
router.post('/', adminProtect, upload.single('image'), handleUploadError, productValidation, ProductController.createProduct);
router.put('/:id', adminProtect, upload.single('image'), handleUploadError, ProductController.updateProduct);
router.delete('/:id', adminProtect, ProductController.deleteProduct);

module.exports = router;

