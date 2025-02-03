// utils/helpers.js
const cron = require('node-cron');
const { Op } = require('sequelize');
const Account = require('../models/account');
const User = require('../models/user');
const { sendMail } = require('../config/mailer');

// Fonction pour envoyer le rapport mensuel des comptes désactivés
const sendMonthlyDeactivatedReport = async () => {
    try {
        // Récupérer tous les comptes désactivés ce mois-ci
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const deactivatedAccounts = await Account.findAll({
            where: {
                status: 'désactivé',
                updatedAt: {
                    [Op.gte]: startOfMonth
                }
            }
        });

        // Récupérer tous les admins
        const admins = await User.findAll({
            where: { role: 'admin' }
        });

        // Préparer le rapport
        const reportHtml = `
            <h2>Rapport des comptes désactivés du mois</h2>
            <p>Nombre total de comptes désactivés : ${deactivatedAccounts.length}</p>
            <ul>
                ${deactivatedAccounts.map(account => `
                    <li>
                        Compte N°${account.accountNumber}<br>
                        Nom: ${account.lastName} ${account.firstName}<br>
                        Date de désactivation: ${account.updatedAt.toLocaleDateString()}
                    </li>
                `).join('')}
            </ul>
        `;

        // Envoyer le rapport à tous les admins
        for (const admin of admins) {
            await sendMail(
                admin.email,
                'Rapport mensuel des comptes désactivés',
                reportHtml
            );
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi du rapport mensuel:', error);
    }
};

// Planifier l'envoi du rapport 2 jours avant la fin du mois
cron.schedule('0 0 */28-29 * *', async () => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysUntilEndOfMonth = lastDayOfMonth.getDate() - today.getDate();

    if (daysUntilEndOfMonth === 2) {
        await sendMonthlyDeactivatedReport();
    }
});
