const jwt = require('jsonwebtoken');
const AdminRepository = require('../repositories/AdminRepository');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

class AdminController {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      const admin = await AdminRepository.findByUsername(username);
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const isMatch = await admin.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const token = generateToken(admin._id);

      res.json({
        success: true,
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async getMe(req, res) {
    try {
      const admin = await AdminRepository.findById(req.admin._id);
      res.json({
        success: true,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }
}

module.exports = new AdminController();

