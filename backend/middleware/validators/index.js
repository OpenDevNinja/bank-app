// middleware/validators/index.js
const { validationResult } = require('express-validator');
const authValidator = require('./authValidator');
const accountValidator = require('./accountValidator');
const adminValidator = require('./adminValidator');

// Middleware de validation générique
const validate = (validations) => {
    return async (req, res, next) => {
        // Exécute toutes les validations
        await Promise.all(validations.map(validation => validation.run(req)));

        // Vérifie s'il y a des erreurs
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        // Formate et renvoie les erreurs
        return res.status(400).json({
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    };
};

module.exports = {
    validate,
    authValidator,
    accountValidator,
    adminValidator
};