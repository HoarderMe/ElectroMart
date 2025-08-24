const { Wishlist, Product, Variant } = require('../models');

// Add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId, variantId } = req.body;
    const userId = req.user.userId;

    // Check if item already exists in wishlist
    const existingItem = await Wishlist.findOne({
      where: {
        userId,
        productId,
        variantId
      }
    });

    if (existingItem) {
      return res.status(400).json({ message: 'Item already in wishlist' });
    }

    // Create new wishlist item
    const wishlistItem = await Wishlist.create({
      userId,
      productId,
      variantId
    });

    // Fetch the complete item with product and variant details
    const completeItem = await Wishlist.findOne({
      where: { wishlistId: wishlistItem.wishlistId },
      include: [
        {
          model: Product,
          attributes: ['productId', 'name', 'imageUrl', 'price']
        },
        {
          model: Variant,
          attributes: ['variantId', 'name', 'additionalPrice']
        }
      ]
    });

    res.status(201).json(completeItem);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ['productId', 'name', 'imageUrl', 'price']
        },
        {
          model: Variant,
          attributes: ['variantId', 'name', 'additionalPrice']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(wishlistItems);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const userId = req.user.userId;

    const wishlistItem = await Wishlist.findOne({
      where: {
        wishlistId,
        userId
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    await wishlistItem.destroy();
    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist
}; 