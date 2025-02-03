// routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const accountController = require('../controllers/accountController');
const { validate, accountValidator } = require('../middleware/validators');


router.post('/',
    auth,
    validate(accountValidator.create),
    accountController.createAccount
);

router.post('/:id/deposit',
    auth,
    validate(accountValidator.deposit),
    accountController.deposit
);

router.post('/:id/withdraw',
    auth,
    validate(accountValidator.withdraw),
    accountController.withdraw
);

router.get('/my-accounts',
    auth,
    accountController.getUserAccounts
);

router.get('/:id/transactions',
    auth,
    accountController.getTransactions);

router.get('/:id',
    auth,
    accountController.getAccount);


module.exports = router;