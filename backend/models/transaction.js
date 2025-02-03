// models/transaction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM('depot', 'retrait'),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Accounts',
            key: 'id'
        }
    }
});
Transaction.associate = (models) => {
    Transaction.belongsTo(models.Account, {
        foreignKey: 'accountId',
        as: 'account'
    });
};


module.exports = Transaction;