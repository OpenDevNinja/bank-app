const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const { validate, adminValidator } = require('../middleware/validators');





router.patch('/:id/deactivate',
    auth,
    isAdmin,
    validate(adminValidator.deactivate),
    adminController.deactivateAccount
);

router.get('/deactivate-accounts',
    auth,
    isAdmin,
    adminController.getDeactivatedAccounts);

router.patch('/:id/reactivate',
    auth,
    isAdmin,
    validate(adminValidator.reactivate),
    adminController.reactivateAccount
);

router.get('/all-accounts',
    auth,
    isAdmin,
    adminController.getAllAccounts
);


router.get('/users', auth,isAdmin, adminController.getAllUsers);
router.put('/users/:userId/block',auth,isAdmin, adminController.blockUser);
router.put('/users/:userId/unblock',auth,isAdmin, adminController.unblockUser);
router.put('/users/:userId/role', auth,isAdmin, adminController.updateUserRole);


module.exports = router;