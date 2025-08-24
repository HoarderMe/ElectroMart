"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Addresses', [
      {
        street: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        country: 'USA',
        region: 'East',
        postalCode: '10001',
        customerId: 1,
        type: 'home',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Addresses', null, {});
  }
};
