"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('products', [
      {
        productId: 1,
        name: 'Smartphone X',
        category: 'Electronics',
        brand: 'ElectroBrand',
        imageUrl: 'https://example.com/smartphone.jpg',
        sku: 'SMX-001',
        description: 'Latest smartphone with advanced features',
        price: 699.99,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 2,
        name: 'Wireless Headphones',
        category: 'Accessories',
        brand: 'SoundBrand',
        imageUrl: 'https://example.com/headphones.jpg',
        sku: 'WH-002',
        description: 'Noise-cancelling over-ear headphones',
        price: 199.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
