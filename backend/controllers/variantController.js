const { Variant, Product } = require('../models');

const variantController = {
  // Create a variant
  async createVariant(req, res) {
    try {
      const { productId, name, additionalPrice, stock } = req.body;
      const product = await Product.findByPk(productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      const variant = await Variant.create({ productId, name, additionalPrice, stock });
      res.status(201).json(variant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all variants
  async getAllVariants(req, res) {
    try {
      const variants = await Variant.findAll({ 
        include: [{
          model: Product,
          as: 'product'
        }]
      });
      res.status(200).json(variants);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get variant by ID
  async getVariantById(req, res) {
    try {
      const { id } = req.params;
      const variant = await Variant.findByPk(id, { 
        include: [{
          model: Product,
          as: 'product'
        }]
      });
      if (!variant) return res.status(404).json({ error: 'Variant not found' });
      res.status(200).json(variant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a variant
  async updateVariant(req, res) {
    try {
      const { id } = req.params;
      const { name, additionalPrice, stock } = req.body;
      const variant = await Variant.findByPk(id);
      if (!variant) return res.status(404).json({ error: 'Variant not found' });
      await variant.update({ name, additionalPrice, stock });
      res.status(200).json(variant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a variant
  async deleteVariant(req, res) {
    try {
      const { id } = req.params;
      const variant = await Variant.findByPk(id);
      if (!variant) return res.status(404).json({ error: 'Variant not found' });
      await variant.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = variantController;