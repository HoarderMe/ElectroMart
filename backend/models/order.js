const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  orderId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'customers',
      key: 'customerId'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'userId'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  orderStatus: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  orderTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'orders',
  timestamps: true
});

// Define associations
Order.associate = (models) => {
  Order.belongsTo(models.Customer, {
    foreignKey: 'customerId',
    as: 'customer'
  });
  
  Order.hasOne(models.Payment, {
    foreignKey: 'orderId',
    as: 'payment'
  });
};

module.exports = Order;