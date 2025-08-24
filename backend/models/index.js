
const Customer = require('./customer');
const Address = require('./address');

const User = require('./user');
const Product = require('./product');
const Variant = require('./variant');

const { Cart, CartItem } = require('./cart');
const Order = require('./order');
const OrderItem = require('./orderItem');
const Wishlist = require('./wishlist');
const Payment = require('./payment');


const { Sequelize } = require('sequelize');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
    define: {
      underscored: true,
      timestamps: true
    }
  }
);

// Initialize models
const models = {
  Customer,
  Address,
  User,
  Product,
  Variant,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Wishlist,
  Payment
};

// Customer - Address associations
models.Customer.hasMany(models.Address, { 
  foreignKey: 'customerId',
  as: 'addresses'
});
models.Address.belongsTo(models.Customer, { 
  foreignKey: 'customerId',
  as: 'customer'
});

// Customer - Order associations
models.Customer.hasMany(models.Order, { 
  foreignKey: 'customerId', 
  as: 'orders' 
});
models.Order.belongsTo(models.Customer, { 
  foreignKey: 'customerId', 
  as: 'customer' 
});

// User - Cart associations
models.User.hasMany(models.Cart);
models.Cart.belongsTo(models.User);

// Product - Cart associations
models.Product.hasMany(models.Cart);
models.Cart.belongsTo(models.Product);

// User - Order associations
models.User.hasMany(models.Order, { 
  foreignKey: 'userId', 
  as: 'orders' 
});
models.Order.belongsTo(models.User, { 
  foreignKey: 'userId', 
  as: 'user' 
});

// Order - OrderItem associations
models.Order.hasMany(models.OrderItem, { 
  foreignKey: 'orderId',
  as: 'items'
});
models.OrderItem.belongsTo(models.Order, { 
  foreignKey: 'orderId',
  as: 'order'
});

// Variant - OrderItem associations
models.Variant.hasMany(models.OrderItem, { 
  foreignKey: 'variantId',
  as: 'orderItems'
});
models.OrderItem.belongsTo(models.Variant, { 
  foreignKey: 'variantId',
  as: 'variant'
});

// Product - Variant associations
models.Product.hasMany(models.Variant, {
  foreignKey: 'productId',
  as: 'variants'
});
models.Variant.belongsTo(models.Product, {
  foreignKey: 'productId',
  as: 'product'
});

// Wishlist associations
models.Wishlist.belongsTo(models.User, { 
  foreignKey: 'userId' 
});
models.User.hasMany(models.Wishlist, { 
  foreignKey: 'userId' 
});

models.Wishlist.belongsTo(models.Product, { 
  foreignKey: 'productId' 
});
models.Product.hasMany(models.Wishlist, { 
  foreignKey: 'productId' 
});

models.Wishlist.belongsTo(models.Variant, { 
  foreignKey: 'variantId' 
});
models.Variant.hasMany(models.Wishlist, { 
  foreignKey: 'variantId' 
});

// Order - Payment associations
models.Order.hasOne(models.Payment, {
  foreignKey: 'orderId',
  as: 'payment'
});
models.Payment.belongsTo(models.Order, {
  foreignKey: 'orderId',
  as: 'order'
});

// Import associations
require('./associations');

module.exports = {
  sequelize,
  Sequelize,
  Address,
  User,
  Product,
  Variant,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Wishlist,
  Payment,
  Customer
};
