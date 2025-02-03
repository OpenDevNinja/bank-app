// models/account.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    accountNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('actif', 'désactivé'),
        defaultValue: 'actif'
    },
    
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
})

// Définir les associations
Account.associate = (models) => {
    Account.hasMany(models.Transaction, {
        foreignKey: 'accountId',
        as: 'transactions'
    });
};

module.exports = Account;