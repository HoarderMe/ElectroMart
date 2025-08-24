const express = require('express');
const router = express.Router();
// const { protect } = require('../middleware/auth');
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');
const { auth } = require('../middleware/auth');

// All routes are protected


// Add item to wishlist
router.post('/', auth, addToWishlist);

// Get user's wishlist
router.get('/', auth,getWishlist);

// Remove item from wishlist
router.delete('/:wishlistId',auth, removeFromWishlist);

module.exports = router; 