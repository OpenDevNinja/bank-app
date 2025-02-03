const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuration de la connexion à la base de données
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

module.exports = sequelize;  