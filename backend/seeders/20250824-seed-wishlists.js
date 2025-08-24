"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('wishlists', [
      {
        wishlistId: 1,
        userId: 2,
        productId: 1,
        variantId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        wishlistId: 2,
        userId: 2,
        productId: 2,
        variantId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Wishlists', null, {});
  }
};
