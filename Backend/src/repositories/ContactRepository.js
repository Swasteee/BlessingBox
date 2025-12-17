const Contact = require('../models/Contact');

class ContactRepository {
  async create(contactData) {
    const contact = new Contact(contactData);
    return await contact.save();
  }

  async findAll() {
    return await Contact.find().sort({ createdAt: -1 });
  }

  async findById(id) {
    return await Contact.findById(id);
  }

  async update(id, updateData) {
    return await Contact.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Contact.findByIdAndDelete(id);
  }
}

module.exports = new ContactRepository();

