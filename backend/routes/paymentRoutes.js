const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/payment');
const Order = require('../models/order');
const { sequelize } = require('../models');
const { Op } = require('sequelize');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Get all transactions with filters
router.get('/transactions', auth, async (req, res) => {
  try {
    const { status, dateRange, search } = req.query;
    const where = {};

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by date range
    if (dateRange) {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        where.createdAt = {
          [Op.gte]: startDate
        };
      }
    }

    // Search by order ID or payment ID
    if (search) {
      where[Op.or] = [
        { orderId: { [Op.like]: `%${search}%` } },
        { razorpayPaymentId: { [Op.like]: `%${search}%` } }
      ];
    }

    const transactions = await Payment.findAll({
      where,
      include: [{
        model: Order,
        as: 'order',
        attributes: ['orderId', 'orderStatus']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount,
      currency: currency,
      receipt: 'receipt_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
      amount
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Create payment record
      const payment = await Payment.create({
        orderId,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        amount: amount / 100, // Convert from paise to rupees
        currency: 'INR',
        status: 'completed',
        paymentMethod: 'razorpay'
      }, { transaction });

      // Update order status
      await Order.update(
        { orderStatus: 'processing' },
        { 
          where: { orderId },
          transaction
        }
      );

      await transaction.commit();
      res.json({ success: true, payment });
    } else {
      await transaction.rollback();
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    await transaction.rollback();
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, error: 'Payment verification failed' });
  }
});

module.exports = router; 