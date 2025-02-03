// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'client'),
        defaultValue: 'client'
    },
    activationCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isActivated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastLogout: {
        type: DataTypes.DATE,
        allowNull: true
    },
    isblocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true
    },
});

// Hook pour hasher le mot de passe avant la création
User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;