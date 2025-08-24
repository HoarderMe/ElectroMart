const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Variant = sequelize.define('Variant', {
  variantId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'productId'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  additionalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'variants',
  timestamps: true
});

// Define associations
Variant.associate = (models) => {
  Variant.belongsTo(models.Product, {
    foreignKey: 'productId',
    as: 'product'
  });
};

module.exports = Variant;