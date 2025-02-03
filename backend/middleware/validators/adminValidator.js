// middleware/validators/adminValidator.js
const { param, query } = require('express-validator');

const adminValidator = {

    
    reactivate: [
        param('id')
            .isUUID(4)
            .withMessage('ID de compte invalide')
    ],
    
    // Validation pour désactiver un compte
    deactivate: [
        param('id')
            .isUUID(4)
            .withMessage('ID de compte invalide')
    ],

    // Validation pour la liste des comptes désactivés
    getDeactivatedAccounts: [
        query('startDate')
            .optional()
            .isISO8601()
            .withMessage('Format de date invalide'),
        query('endDate')
            .optional()
            .isISO8601()
            .withMessage('Format de date invalide')
    ]
};

module.exports = adminValidator;