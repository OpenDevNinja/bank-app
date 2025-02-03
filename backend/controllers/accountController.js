// controllers/accountController.js
const { Transaction, Account } = require('../models');
const { sendMail } = require('../config/mailer');

// Génération du numéro de compte
const generateAccountNumber = async () => {
    const prefix = 'FR76';
    const random = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    const accountNumber = `${prefix}${random}`;
    
    const existingAccount = await Account.findOne({ where: { accountNumber } });
    if (existingAccount) {
        return generateAccountNumber();
    }
    return accountNumber;
};

// Création de compte
const createAccount = async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const accountNumber = await generateAccountNumber();

        const account = await Account.create({
            accountNumber,
            firstName,
            lastName,
            
            userId: req.user.id
        });

        res.status(201).send(account);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Dépôt sur un compte
const deposit = async (req, res) => {
    try {
        const { amount } = req.body;
        
        // Validation du montant
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Le montant du dépôt doit être un nombre positif.' 
            });
        }

        // Recherche du compte
        const account = await Account.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        // Vérification de l'existence du compte
        if (!account) {
            return res.status(404).json({ 
                success: false, 
                error: 'Compte non trouvé.' 
            });
        }

        // Vérification du statut du compte
        if (account.status === 'désactivé') {
            return res.status(400).json({ 
                success: false, 
                error: 'Ce compte est désactivé.' 
            });
        }

        // Calcul du nouveau solde
        const currentBalance = parseFloat(account.balance);
        const depositAmount = parseFloat(amount);
        const newBalance = currentBalance + depositAmount;

        // Mise à jour du solde du compte
        await Account.update(
            { balance: newBalance },
            { 
                where: { 
                    id: account.id,
                    userId: req.user.id
                } 
            }
        );

        // Création de l'enregistrement de transaction
        const transaction = await Transaction.create({
            type: 'depot',
            amount: depositAmount,
            accountId: account.id
        });

        // Réponse avec succès
        return res.status(200).json({
            success: true,
            message: 'Dépôt effectué avec succès',
            data: {
                accountId: account.id,
                transactionId: transaction.id,
                amount: depositAmount,
                newBalance: newBalance,
                transactionDate: transaction.createdAt
            }
        });

    } catch (error) {
        console.error('Erreur lors du dépôt:', error);
        
        return res.status(500).json({
            success: false,
            error: 'Une erreur est survenue lors du dépôt. Veuillez réessayer.'
        });
    }
};
// Retrait sur un compte
const withdraw = async (req, res) => {
    try {
        const account = await Account.findOne({
            where: { 
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!account) {
            return res.status(404).send({ error: 'Compte non trouvé.' });
        }

        if (account.status === 'désactivé') {
            return res.status(400).send({ error: 'Ce compte est désactivé.' });
        }

        const { amount } = req.body;
        if (amount <= 0) {
            return res.status(400).send({ error: 'Le montant doit être positif.' });
        }

        if (account.balance < amount) {
            return res.status(400).send({ error: 'Solde insuffisant.' });
        }

        await Account.update(
            { balance: account.balance - amount },
            { where: { id: account.id } }
        );

        await Transaction.create({
            type: 'retrait',
            amount,
            accountId: account.id
        });

        await sendMail(
            req.user.email,
            'Confirmation de retrait',
            `Un retrait de ${amount}€ a été effectué sur votre compte ${account.accountNumber}.
            Nouveau solde : ${account.balance - amount}€`
        );

        res.send({ message: 'Retrait effectué avec succès.' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Obtenir les transactions d'un compte
const getTransactions = async (req, res) => {
    try {
        const whereClause = { id: req.params.id };
        if (req.user.role !== 'admin') {
            whereClause.userId = req.user.id;
        }

        const account = await Account.findOne({ where: whereClause });
        if (!account) {
            return res.status(404).send({ error: 'Compte non trouvé.' });
        }

        const transactions = await Transaction.findAll({
            where: { accountId: account.id },
            include: [{
                model: Account,
                as: 'account', // Ajout de l'alias ici
                attributes: ['accountNumber', 'firstName', 'lastName']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.send(transactions);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};
// Obtenir les détails d'un compte
const getAccount = async (req, res) => {
    try {
        const whereClause = { id: req.params.id };
        if (req.user.role !== 'admin') {
            whereClause.userId = req.user.id;
        }

        const account = await Account.findOne({ where: whereClause });
        if (!account) {
            return res.status(404).send({ error: 'Compte non trouvé.' });
        }

        res.send(account);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const getUserAccounts = async (req, res) => {
    try {
        const accounts = await Account.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        res.send(accounts);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};



module.exports = {
    createAccount,
    deposit,
    withdraw,
    getTransactions,
    getAccount,
    getUserAccounts

};
