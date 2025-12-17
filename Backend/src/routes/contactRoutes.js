const express = require('express');
const router = express.Router();
const ContactController = require('../controllers/ContactController');
const { adminProtect } = require('../middleware/adminMiddleware');
const { contactValidation } = require('../utils/validators');

router.post('/', contactValidation, ContactController.createContact);
router.get('/admin', adminProtect, ContactController.getAllContacts);
router.get('/admin/:id', adminProtect, ContactController.getContactById);
router.delete('/admin/:id', adminProtect, ContactController.deleteContact);

module.exports = router;

