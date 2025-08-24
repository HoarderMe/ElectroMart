const { Product, Variant } = require('../models');

const productController = {
  // Create a product
  async createProduct(req, res) {
    const { name, category, brand, sku, imageUrl, description, price, stock, variants } = req.body;

    if (!name || !category || !brand || !sku || !price || !stock || !Array.isArray(variants)) {
      return res.status(400).json({ message: 'Missing required fields or variants format is invalid' });
    }

    try {
      // Check if the product is unique
      const existingProduct = await Product.findOne({ where: { name, sku } });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with the same name and SKU already exists' });
      }

      const newProduct = await Product.create({
        name,
        category,
        brand,
        sku,
        imageUrl,
        description,
        price,
        stock,
      });

      const variantData = variants.map(variant => ({
        ...variant,
        productId: newProduct.productId,
      }));

      await Variant.bulkCreate(variantData);

      const fullProduct = await Product.findOne({
        where: { productId: newProduct.productId },
        include: [{
          model: Variant,
          as: 'variants'
        }]
      });

      res.status(201).json(fullProduct);
    } catch (error) {
      console.error('Error creating product with variants:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get all products
  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll({ 
        include: [{
          model: Variant,
          as: 'variants'
        }]
      });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get product by ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, { 
        include: [{
          model: Variant,
          as: 'variants'
        }]
      });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a product
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        category,
        brand,
        sku,
        imageUrl,
        description,
        price,
        stock,
        variants
      } = req.body;

      // 1) Find the product
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // 2) Update product fields
      await product.update({
        name,
        category,
        brand,
        sku,
        imageUrl,
        description,
        price,
        stock
      });

      // 3) If variants provided, replace them wholesale
      if (Array.isArray(variants)) {
        // remove existing
        await Variant.destroy({ where: { productId: id } });

        // bulk‐create new
        const variantData = variants.map(v => ({
          productId:       id,
          name:            v.name,
          additionalPrice: v.additionalPrice,
          stock:           v.stock
        }));
        if (variantData.length) {
          await Variant.bulkCreate(variantData);
        }
      }

      // 4) Fetch fresh with variants
      const fullProduct = await Product.findByPk(id, { 
        include: [{
          model: Variant,
          as: 'variants'
        }]
      });
      return res.status(200).json(fullProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Delete a product
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      await product.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = productController;