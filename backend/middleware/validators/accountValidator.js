// middleware/validators/accountValidator.js
const { body, param, query } = require('express-validator');

const accountValidator = {
    // Validation de création de compte
    create: [
        body('firstName')
            .trim()
            .notEmpty()
            .withMessage('Le prénom est requis')
            .isLength({ min: 2, max: 50 })
            .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
            .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
            .withMessage('Le prénom contient des caractères invalides'),
        body('lastName')
            .trim()
            .notEmpty()
            .withMessage('Le nom est requis')
            .isLength({ min: 2, max: 50 })
            .withMessage('Le nom doit contenir entre 2 et 50 caractères')
            .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
            .withMessage('Le nom contient des caractères invalides')
    ],

    // Validation des opérations de dépôt
    deposit: [
        param('id')
            .isUUID(4)
            .withMessage('ID de compte invalide'),
        body('amount')
            .isFloat({ min: 0.01 })
            .withMessage('Le montant du dépôt doit être supérieur à 0')
            .custom((value) => {
                if (value > 1000000) {
                    throw new Error('Le montant maximum autorisé est de 1 000 000');
                }
                return true;
            })
    ],

    // Validation des opérations de retrait
    withdraw: [
        param('id')
            .isUUID(4)
            .withMessage('ID de compte invalide'),
        body('amount')
            .isFloat({ min: 0.01 })
            .withMessage('Le montant du retrait doit être supérieur à 0')
            .custom((value) => {
                if (value > 1000000) {
                    throw new Error('Le montant maximum autorisé est de 1 000 000');
                }
                return true;
            })
    ],

    // Validation pour la recherche de transactions
    getTransactions: [
        param('id')
            .isUUID(4)
            .withMessage('ID de compte invalide'),
        query('startDate')
            .optional()
            .isISO8601()
            .withMessage('Format de date invalide'),
        query('endDate')
            .optional()
            .isISO8601()
            .withMessage('Format de date invalide'),
        query('type')
            .optional()
            .isIn(['depot', 'retrait'])
            .withMessage('Type de transaction invalide')
    ],

    // Validation pour obtenir un compte spécifique
    getAccount: [
        param('id')
            .isUUID(4)
            .withMessage('ID de compte invalide')
    ]
};

module.exports = accountValidator;