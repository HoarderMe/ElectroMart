"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('orders', [
      {
        orderId: 1,
        orderDate: new Date('2025-08-01'),
        customerId: 1,
        userId: 1,
        orderStatus: 'delivered',
        orderTotal: 899.98,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        orderId: 2,
        orderDate: new Date('2025-08-02'),
        customerId: 1,
        userId: 2,
        orderStatus: 'pending',
        orderTotal: 199.99,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Orders', null, {});
  }
};
