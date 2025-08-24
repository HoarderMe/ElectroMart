const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Product = require('./product');
const Variant = require('./variant');

const Wishlist = sequelize.define('Wishlist', {
  wishlistId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'userId'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'products',
      key: 'productId'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  variantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'variants',
      key: 'variantId'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'wishlists',
  timestamps: true
});

// Define associations
Wishlist.belongsTo(User, { foreignKey: 'userId' });
Wishlist.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(Wishlist, { foreignKey: 'userId' });
Product.hasMany(Wishlist, { foreignKey: 'productId' });

module.exports = Wishlist; 