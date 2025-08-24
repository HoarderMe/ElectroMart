"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        userId: 1,
        username: 'admin',
        email: 'admin@electromart.com',
        password: 'hashedpassword',
        phoneNumber: '1111111111',
        dob: new Date('1990-01-01'),
        role: 'admin',
        googleId: null,
        googleAccessToken: null,
        googleRefreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        username: 'customer',
        email: 'customer@electromart.com',
        password: 'hashedpassword',
        phoneNumber: '2222222222',
        dob: new Date('1995-05-05'),
        role: 'customer',
        googleId: null,
        googleAccessToken: null,
        googleRefreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
