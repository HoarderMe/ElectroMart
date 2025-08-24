const express = require('express');
const {  createOrderWithItems } = require('../controllers/orderController');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();
const orderController = require('../controllers/orderController');
// const { protect, authorize } = require('../middleware/auth');

// Route to create a new order
router.post('/', auth, createOrderWithItems);

// Get all orders (admin only)
router.get('/',  orderController.getAllOrders);

// Get order by ID (admin only)
router.get('/:id', orderController.getOrderById);

// Update order status (admin only)
router.patch('/:id', orderController.updateOrderStatus);

// Get orders by status (admin only)
router.get('/status/:status',orderController.getOrdersByStatus);

// Get orders by date range (admin only)
router.get('/date-range', orderController.getOrdersByDateRange);

// // // Route to get all orders
// router.get('/', getAllOrders);

// // // Route to update order status
// router.put('/:id', updateOrderStatus);

// // // Route to delete an order
// router.delete('/:id', deleteOrder);

module.exports = router;