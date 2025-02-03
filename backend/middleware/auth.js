// middleware/auth.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware d'authentification
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { id: decoded.id } });

        if (!user || new Date(decoded.iat * 1000) < new Date(user.lastLogout)) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Veuillez vous authentifier.' });
    }
};

// Middleware pour vérifier si l'utilisateur est un admin
const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send({ error: 'Accès non autorisé.' });
    }
    next();
};

module.exports = { auth, isAdmin };