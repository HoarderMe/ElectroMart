const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Customer } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      const { 
        username,
        firstName,
        lastName, 
        email, 
        password, 
        phoneNumber, 
        dob 
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already in use" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user with role 'customer'
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        dob,
        role: 'customer' // Set default role as customer
      });

      // Create customer profile
      const customer = await Customer.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        dob,
        userId: user.userId,
        address: '' // Default empty address
      });

      // Create JWT token
      const token = jwt.sign(
        { 
          userId: user.userId,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.status(201).json({
        token,
        user: {
          userId: user.userId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create JWT token
      const token = jwt.sign(
        { 
          userId: user.userId,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        token,
        user: {
          userId: user.userId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findOne({
        where: { userId: req.user.userId },
        include: [{
          model: Customer,
          attributes: ['customerId', 'address']
        }]
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        userId: user.userId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        customer: user.Customer
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { firstName, lastName, email, phoneNumber } = req.body;
      const user = await User.findByPk(req.user.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user fields
      await user.update({
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        email: email || user.email,
        phoneNumber: phoneNumber || user.phoneNumber
      });

      // Update customer fields
      const customer = await Customer.findOne({ where: { userId: user.userId } });
      if (customer) {
        await customer.update({
          firstName: firstName || customer.firstName,
          lastName: lastName || customer.lastName,
          email: email || customer.email,
          phoneNumber: phoneNumber || customer.phoneNumber
        });
      }

      res.json({ 
        message: 'Profile updated successfully',
        user: {
          userId: user.userId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findByPk(req.user.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await user.update({ password: hashedPassword });
      
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = authController; 