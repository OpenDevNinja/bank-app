// config/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration du transporteur de mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Fonction pour envoyer des emails
const sendMail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        });
        return true;
    } catch (error) {
        console.error('Erreur d\'envoi d\'email:', error);
        return false;
    }
};

module.exports = { sendMail };