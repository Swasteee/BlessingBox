const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, dateOfBirth, location } = req.body;

      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
      }

      const user = await UserRepository.create({
        name,
        email,
        password,
        dateOfBirth: dateOfBirth || '',
        location: location || '',
      });

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          location: user.location,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          location: user.location,
          avatar: user.avatar,
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
      const user = await UserRepository.findById(req.user._id);
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          location: user.location,
          avatar: user.avatar,
          phone: user.phone,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const { name, email, location, phone, avatar } = req.body;
      const updateData = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (location !== undefined) updateData.location = location;
      if (phone !== undefined) updateData.phone = phone;
      
      // Handle avatar upload
      if (req.file) {
        // New file uploaded
        updateData.avatar = `/uploads/avatars/${req.file.filename}`;
      } else if (avatar !== undefined) {
        // Avatar URL provided (for external URLs or existing paths)
        updateData.avatar = avatar;
      }

      const user = await UserRepository.update(req.user._id, updateData);

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          location: user.location,
          avatar: user.avatar,
          phone: user.phone,
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

module.exports = new AuthController();

