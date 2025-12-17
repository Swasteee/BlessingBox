const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { adminProtect } = require('../middleware/adminMiddleware');
const { adminLoginValidation } = require('../utils/validators');

router.post('/login', adminLoginValidation, AdminController.login);
router.get('/me', adminProtect, AdminController.getMe);

module.exports = router;

