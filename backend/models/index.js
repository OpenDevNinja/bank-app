// models/index.js
const User = require('./user');
const Account = require('./account');
const Transaction = require('./transaction');

// Définition des associations
User.hasMany(Account, {
    foreignKey: 'userId',
    as: 'accounts',
    onDelete: 'CASCADE'
});

Account.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Account.hasMany(Transaction, {
    foreignKey: 'accountId',
    as: 'transactions',
    onDelete: 'CASCADE'
});

Transaction.belongsTo(Account, {
    foreignKey: 'accountId',
    as: 'account'
});

module.exports = {
    User,
    Account,
    Transaction
};