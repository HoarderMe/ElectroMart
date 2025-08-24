const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Customer = sequelize.define("Customer", {
    customerId: {
    	type: DataTypes.INTEGER,
    	primaryKey: true,
    	autoIncrement: true,
  	},
  	firstName: {
    	type: DataTypes.STRING,
    	allowNull: false,
  	},
  	lastName: {
    	type: DataTypes.STRING,
    	allowNull: false,
  	},
  	address: {
    	type: DataTypes.STRING,
    	allowNull: true,
  	},
  	dob: {
    	type: DataTypes.DATE,
    	allowNull: false,
  	},
  	state: {
    	type: DataTypes.STRING,
    	allowNull: true,
  	},
  	country: {
    	type: DataTypes.STRING,
    	allowNull: true,
  	},
  	region: {
    	type: DataTypes.STRING,
    	allowNull: true,
  	},
  	userId: {
    	type: DataTypes.STRING,
    	allowNull: true,
  	},
  	email: {
    	type: DataTypes.STRING,
    	allowNull: true,
		validate: {
			isEmail: true // checks for email format
		}
  	},
  	phoneNumber: {
    	type: DataTypes.STRING,
    	allowNull: true,
  	},
}, {
  tableName: 'customers',
  timestamps: true
});

// Define associations
Customer.associate = (models) => {
  Customer.hasMany(models.Order, {
    foreignKey: 'customerId',
    as: 'orders'
  });
};

module.exports = Customer;
