const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { is } = require('express/lib/request');

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
   	password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
		validate: {
			isEmail: true // checks for email format
		}
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'customer'),
        allowNull: false,
        defaultValue: 'customer'
    },
    googleId: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    googleAccessToken: {
        type: DataTypes.TEXT('LONG'),
        allowNull: true
    },
    googleRefreshToken: {
        type: DataTypes.TEXT('LONG'),
        allowNull: true
    }
});

module.exports = User;