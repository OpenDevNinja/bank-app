// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const authController = require('../controllers/authController');
const { authValidator, validate } = require('../middleware/validators');


router.post('/register', validate(authValidator.register), authController.register);
router.post('/activate', validate(authValidator.activate), authController.activate);
router.post('/login', validate(authValidator.login), authController.login);
router.get('/me', auth, authController.me);
router.post('/resend-activation', authController.resendActivationCode);
router.post('/logout', auth, authController.logout);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', auth, authController.changePassword);


module.exports = router;