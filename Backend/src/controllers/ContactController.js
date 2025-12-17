const ContactRepository = require('../repositories/ContactRepository');

class ContactController {
  async createContact(req, res) {
    try {
      const { firstName, lastName, email, phoneNumber, subject, message } = req.body;

      const contact = await ContactRepository.create({
        firstName,
        lastName,
        email,
        phoneNumber: phoneNumber || '',
        subject: subject || 'General Inquiry',
        message,
      });

      res.status(201).json({
        success: true,
        message: 'Contact message sent successfully',
        contact,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async getAllContacts(req, res) {
    try {
      const contacts = await ContactRepository.findAll();
      res.json({
        success: true,
        count: contacts.length,
        contacts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async getContactById(req, res) {
    try {
      const contact = await ContactRepository.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found',
        });
      }
      res.json({
        success: true,
        contact,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async deleteContact(req, res) {
    try {
      const contact = await ContactRepository.delete(req.params.id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contact not found',
        });
      }

      res.json({
        success: true,
        message: 'Contact deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }
}

module.exports = new ContactController();

