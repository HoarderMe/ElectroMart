"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('customers', [
      {
        customerId: 1,
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        dob: new Date('1995-05-05'),
        state: 'NY',
        country: 'USA',
        region: 'East',
  userId: '2',
        email: 'customer@electromart.com',
        phoneNumber: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('customers', null, {});
  }
};
