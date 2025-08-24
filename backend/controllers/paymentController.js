// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const { Order, Payment } = require('../models');
// const dotenv = require('dotenv');

// dotenv.config();

// // Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// // Create a new order
// const createOrder = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const order = await Order.findByPk(orderId);

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     // Create Razorpay order
//     const razorpayOrder = await razorpay.orders.create({
//       amount: Math.round(order.orderTotal * 100), // Convert to paise
//       currency: 'INR',
//       receipt: `order_${orderId}`,
//       notes: {
//         orderId: orderId
//       }
//     });

//     // Create payment record
//     const payment = await Payment.create({
//       orderId: orderId,
//       razorpayOrderId: razorpayOrder.id,
//       amount: order.orderTotal,
//       status: 'pending'
//     });

//     res.json({
//       orderId: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency,
//       paymentId: payment.paymentId
//     });
//   } catch (error) {
//     console.error('Error creating payment order:', error);
//     res.status(500).json({ message: 'Error creating payment order' });
//   }
// };

// // Verify payment
// const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       paymentId
//     } = req.body;

//     // Verify signature
//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest('hex');

//     const isAuthentic = expectedSignature === razorpay_signature;

//     if (!isAuthentic) {
//       return res.status(400).json({ message: 'Invalid payment signature' });
//     }

//     // Update payment record
//     const payment = await Payment.findByPk(paymentId);
//     if (!payment) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }

//     await payment.update({
//       razorpayPaymentId: razorpay_payment_id,
//       razorpaySignature: razorpay_signature,
//       status: 'completed'
//     });

//     // Update order status
//     const order = await Order.findByPk(payment.orderId);
//     await order.update({ orderStatus: 'processing' });

//     res.json({
//       message: 'Payment verified successfully',
//       paymentId: payment.paymentId,
//       orderId: order.orderId
//     });
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     res.status(500).json({ message: 'Error verifying payment' });
//   }
// };

// // Get payment status
// const getPaymentStatus = async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     const payment = await Payment.findByPk(paymentId, {
//       include: [{
//         model: Order,
//         attributes: ['orderId', 'orderStatus', 'orderTotal']
//       }]
//     });

//     if (!payment) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }

//     res.json(payment);
//   } catch (error) {
//     console.error('Error fetching payment status:', error);
//     res.status(500).json({ message: 'Error fetching payment status' });
//   }
// };

// module.exports = {
//   createOrder,
//   verifyPayment,
//   getPaymentStatus
// }; 