// middleware/validators/authValidator.js
const { body } = require('express-validator');

const authValidator = {
    // Validation de l'inscription
    register: [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Email invalide')
            .normalizeEmail()
            .toLowerCase(),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Le mot de passe doit contenir au moins 8 caractères')
            .matches(/[A-Z]/)
            .withMessage('Le mot de passe doit contenir au moins une majuscule')
            .matches(/[a-z]/)
            .withMessage('Le mot de passe doit contenir au moins une minuscule')
            .matches(/[0-9]/)
            .withMessage('Le mot de passe doit contenir au moins un chiffre')
            .matches(/[!@#$%^&*]/)
            .withMessage('Le mot de passe doit contenir au moins un caractère spécial')
    ],

    // Validation de l'activation du compte
    activate: [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Email invalide')
            .normalizeEmail()
            .toLowerCase(),
        body('activationCode')
            .trim()
            .isLength({ min: 6, max: 6 })
            .withMessage('Le code d\'activation doit contenir exactement 6 chiffres')
            .isNumeric()
            .withMessage('Le code d\'activation doit être numérique')
    ],

    // Validation de la connexion
    login: [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Email invalide')
            .normalizeEmail()
            .toLowerCase(),
        body('password')
            .notEmpty()
            .withMessage('Le mot de passe est requis')
    ]
};

module.exports = authValidator;