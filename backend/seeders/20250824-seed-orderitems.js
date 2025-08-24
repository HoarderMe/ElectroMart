"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
  await queryInterface.bulkInsert('OrderItems', [
      {
        orderItemId: 1,
        orderId: 1,
        variantId: 1,
        quantity: 1,
        priceAtTime: 699.99,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        orderItemId: 2,
        orderId: 1,
        variantId: 2,
        quantity: 1,
        priceAtTime: 199.99,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        orderItemId: 3,
        orderId: 2,
        variantId: 2,
        quantity: 1,
        priceAtTime: 199.99,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('OrderItems', null, {});
  }
};
