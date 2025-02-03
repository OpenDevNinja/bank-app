// controllers/adminController.js

const { Account, User } = require("../models");

// Réactiver un compte
const reactivateAccount = async (req, res) => {
    try {
        const account = await Account.findByPk(req.params.id);
        if (!account) {
            return res.status(404).send({ error: 'Compte non trouvé.' });
        }

        if (account.status !== 'désactivé') {
            return res.status(400).send({ error: 'Le compte est déjà actif.' });
        }

        await Account.update(
            { status: 'actif' },
            { where: { id: account.id } }
        );

        res.send({ message: 'Compte réactivé avec succès.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Désactiver un compte
const deactivateAccount = async (req, res) => {
    try {
        const account = await Account.findByPk(req.params.id);
        if (!account) {
            return res.status(404).send({ error: 'Compte non trouvé.' });
        }

        await Account.update(
            { status: 'désactivé' },
            { where: { id: account.id } }
        );

        res.send({ message: 'Compte désactivé avec succès.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Obtenir la liste des comptes désactivés
const getDeactivatedAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll({
            where: { status: 'désactivé' },
            order: [['updatedAt', 'DESC']]
        });

        res.send(accounts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
// Obtenir tous les comptes (admin) et les comptes actifs (utilisateur connecté)
const getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll({
            order: [['createdAt', 'DESC']],         
        });

        res.send(accounts);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { 
                exclude: ['password', 'resetToken', 'resetTokenExpiry', 'activationCode'] 
            }
        });
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const blockUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ error: 'Utilisateur non trouvé.' });
        }

        if (user.role === 'admin') {
            return res.status(403).send({ error: 'Impossible de bloquer un administrateur.' });
        }

        user.isblocked = true;
        await user.save();

        res.send({ message: 'Utilisateur bloqué avec succès.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Débloquer un utilisateur
const unblockUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ error: 'Utilisateur non trouvé.' });
        }

        user.isblocked = false;
        await user.save();

        res.send({ message: 'Utilisateur débloqué avec succès.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Mettre à jour le rôle d'un utilisateur
const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['admin', 'client'].includes(role)) {
            return res.status(400).send({ error: 'Rôle invalide.' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ error: 'Utilisateur non trouvé.' });
        }

        user.role = role;
        await user.save();

        res.send({ message: 'Rôle de l\'utilisateur mis à jour avec succès.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    reactivateAccount,
    deactivateAccount,
    getDeactivatedAccounts,
    getAllAccounts,
    getAllUsers,
    blockUser,
    unblockUser,
    updateUserRole

};
