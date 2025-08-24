const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Validate token endpoint
router.get('/validate', verifyToken, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user.userId,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ error: 'Token validation failed' });
  }
});

// Google OAuth endpoint
router.post('/google', async (req, res) => {
  try {
    console.log('Received Google auth request body:', req.body);
    const { credential } = req.body;
    
    if (!credential) {
      console.error('No credential provided in request');
      return res.status(400).json({ error: 'No credential provided' });
    }

    console.log('Verifying Google token...');
    const ticket = await oauth2Client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    console.log('Google payload:', payload);
    
    if (!payload) {
      console.error('No payload received from Google');
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      console.error('No email in Google payload');
      return res.status(400).json({ error: 'No email provided by Google' });
    }

    // Find or create user
    console.log('Looking for existing user with email:', email);
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('Creating new user with data:', { email, name, picture, googleId });
      try {
        // Generate a random password for Google users
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        user = await User.create({
          email,
          username: name || email.split('@')[0], // Use email username if name is not provided
          password: hashedPassword,
          phoneNumber: '0000000000', // Default value
          dob: new Date(), // Default value
          role: 'customer',
          googleId,
          googleAccessToken: credential.substring(0, 1000), // Store only a portion of the token
          googleRefreshToken: null // We don't need to store the refresh token for this flow
        });
        console.log('New user created:', user);
      } catch (createError) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ 
          error: 'Failed to create user', 
          details: createError.message,
          code: createError.code
        });
      }
    } else {
      console.log('Existing user found:', user);
      // Update user's Google information
      user.googleAccessToken = credential.substring(0, 1000); // Store only a portion of the token
      user.googleId = googleId;
      await user.save();
    }

    // Generate JWT token
    console.log('Generating JWT token for user:', user.userId);

    const jwtToken = jwt.sign(
      { 
        userId: user.userId,
        email: user.email,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = {
      token: jwtToken,
      user: {
        id: user.userId,
        email: user.email,
        username: user.username,
        role: user.role
      }
    };
    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ 
      error: 'Authentication failed', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.post('/callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  res.json(tokens);
});

module.exports = router; 