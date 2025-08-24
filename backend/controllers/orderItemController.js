const { OrderItem, Order, Variant } = require('../models');

const orderItemController = {
  // Create an order item
  async createOrderItem(req, res) {
    try {
      const { orderId, variantId, quantity, priceAtTime } = req.body;
      const order = await Order.findByPk(orderId);
      const variant = await Variant.findByPk(variantId);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      if (!variant) return res.status(404).json({ error: 'Variant not found' });
      if (variant.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });
      
      const orderItem = await OrderItem.create({ orderId, variantId, quantity, priceAtTime });
      await variant.update({ stock: variant.stock - quantity }); // Update stock
      res.status(201).json(orderItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all order items
  async getAllOrderItems(req, res) {
    try {
      const orderItems = await OrderItem.findAll({ include: ['Order', 'Variant'] });
      res.status(200).json(orderItems);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get order item by ID
  async getOrderItemById(req, res) {
    try {
      const { id } = req.params;
      const orderItem = await OrderItem.findByPk(id, { include: ['Order', 'Variant'] });
      if (!orderItem) return res.status(404).json({ error: 'OrderItem not found' });
      res.status(200).json(orderItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update an order item
  async updateOrderItem(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const orderItem = await OrderItem.findByPk(id, { include: 'Variant' });
      if (!orderItem) return res.status(404).json({ error: 'OrderItem not found' });
      
      const variant = orderItem.Variant;
      const stockDifference = quantity - orderItem.quantity;
      if (stockDifference > 0 && variant.stock < stockDifference) {
        return res.status(400).json({ error: 'Insufficient stock' });
      }

      await orderItem.update({ quantity });
      await variant.update({ stock: variant.stock - stockDifference });
      res.status(200).json(orderItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete an order item
  async deleteOrderItem(req, res) {
    try {
      const { id } = req.params;
      const orderItem = await OrderItem.findByPk(id, { include: 'Variant' });
      if (!orderItem) return res.status(404).json({ error: 'OrderItem not found' });
      
      const variant = orderItem.Variant;
      await variant.update({ stock: variant.stock + orderItem.quantity }); // Restore stock
      await orderItem.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = orderItemController;