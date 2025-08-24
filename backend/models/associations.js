const User = require('./user');
const Cart = require('./cart').Cart;
const CartItem = require('./cart').CartItem;
const Product = require('./product');
const Variant = require('./variant');
const Order = require('./order');
const OrderItem = require('./orderItem');
const Wishlist = require('./wishlist');

// Cart associations
Cart.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Cart, { foreignKey: 'userId' });

Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

CartItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(CartItem, { foreignKey: 'productId' });

CartItem.belongsTo(Variant, { foreignKey: 'variantId' });
Variant.hasMany(CartItem, { foreignKey: 'variantId' });

// Order associations
Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

OrderItem.belongsTo(Variant, { foreignKey: 'variantId' });
Variant.hasMany(OrderItem, { foreignKey: 'variantId' });

// Wishlist associations
Wishlist.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Wishlist, { foreignKey: 'userId' });

Wishlist.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Wishlist, { foreignKey: 'productId' });

Wishlist.belongsTo(Variant, { foreignKey: 'variantId' });
Variant.hasMany(Wishlist, { foreignKey: 'variantId' });

module.exports = {
  User,
  Cart,
  CartItem,
  Product,
  Variant,
  Order,
  OrderItem,
  Wishlist
}; 