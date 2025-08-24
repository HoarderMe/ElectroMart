"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('variants', [
      {
        variantId: 1,
        productId: 1,
        name: 'Black',
        additionalPrice: 0.00,
        stock: 25,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        variantId: 2,
        productId: 2,
        name: 'Standard',
        additionalPrice: 0.00,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Variants', null, {});
  }
};
