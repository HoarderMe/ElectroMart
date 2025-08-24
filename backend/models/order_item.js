// models/order_item.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  orderItemId: {
    type:  DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type:  DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'orderId'
    }
  },
  variantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Variants',
      key: 'variantId'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  priceAtTime: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'OrderItems',
  timestamps: true
});

module.exports = OrderItem;
