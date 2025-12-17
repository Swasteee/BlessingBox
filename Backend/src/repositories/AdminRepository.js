const Admin = require('../models/Admin');

class AdminRepository {
  async create(adminData) {
    const admin = new Admin(adminData);
    return await admin.save();
  }

  async findByUsername(username) {
    return await Admin.findOne({ username }).select('+password');
  }

  async findById(id) {
    return await Admin.findById(id);
  }

  async update(id, updateData) {
    return await Admin.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }
}

module.exports = new AdminRepository();

