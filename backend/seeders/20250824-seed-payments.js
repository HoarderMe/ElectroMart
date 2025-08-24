"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('payments', [
      {
        paymentId: 1,
        orderId: 1,
        razorpayOrderId: 'rp_order_1',
        razorpayPaymentId: 'rp_pay_1',
        razorpaySignature: 'sig_1',
        amount: 899.98,
        currency: 'INR',
        status: 'completed',
        paymentMethod: 'razorpay',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        paymentId: 2,
        orderId: 2,
        razorpayOrderId: 'rp_order_2',
        razorpayPaymentId: 'rp_pay_2',
        razorpaySignature: 'sig_2',
        amount: 199.99,
        currency: 'INR',
        status: 'pending',
        paymentMethod: 'razorpay',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Payments', null, {});
  }
};
