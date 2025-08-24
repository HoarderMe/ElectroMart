const express = require('express');
const { createProduct, getAllProducts, updateProduct } = require('../controllers/productController');
const { Product, Variant } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Route to get all products
router.get('/', getAllProducts);

// Route to get a single product by ID
// router.get('/:id', getProductById);

// // Route to create a new product
router.post('/', createProduct);

// // Route to update a product by ID
router.put('/:id', updateProduct);

// // Route to delete a product by ID
// router.delete('/:id', deleteProduct);

// Get products by category with filters
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const {
      priceRange,
      brands,
      ratings,
      availability
    } = req.query;

    const where = {
      category: category
    };

    // Apply price range filter only if provided
    if (priceRange) {
      try {
        const [min, max] = JSON.parse(priceRange);
        where.price = {
          [Op.between]: [min, max]
        };
      } catch (error) {
        console.error('Error parsing price range:', error);
      }
    }

    // Apply brand filter only if provided
    if (brands) {
      try {
        const brandList = JSON.parse(brands);
        if (brandList.length > 0) {
          where.brand = {
            [Op.in]: brandList
          };
        }
      } catch (error) {
        console.error('Error parsing brands:', error);
      }
    }

    // Apply rating filter only if provided
    if (ratings) {
      try {
        const ratingList = JSON.parse(ratings);
        if (ratingList.length > 0) {
          where.rating = {
            [Op.gte]: Math.min(...ratingList)
          };
        }
      } catch (error) {
        console.error('Error parsing ratings:', error);
      }
    }

    // Apply availability filter only if not 'all'
    if (availability && availability !== 'all') {
      where.stock = availability === 'inStock' ? { [Op.gt]: 0 } : 0;
    }

    const products = await Product.findAll({
      where,
      include: [{
        model: Variant,
        as: 'variants',
        attributes: ['variantId', 'name', 'stock', 'additionalPrice']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;