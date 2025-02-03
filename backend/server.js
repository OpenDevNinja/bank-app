// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/database');

// Importation des routes
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Configuration de la sécurité
app.use(helmet()); // Protection contre les vulnérabilités web courantes
app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization"
})); // Configuration CORS
app.use(express.json()); // Parser JSON
app.use(express.urlencoded({ extended: true }))
// Limitation des requêtes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite chaque IP à 100 requêtes par fenêtre
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/admin', adminRoutes);

// Gestion des erreurs globale
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Une erreur est survenue!' });
});

// Synchronisation de la base de données et démarrage du serveur
const PORT = process.env.PORT || 3000;

sequelize.sync( ).then(() => {
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
    });
});
