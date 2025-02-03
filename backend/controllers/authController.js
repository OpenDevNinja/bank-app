// controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../config/mailer');
const { User } = require('../models');
const crypto = require('crypto');
const { Op } = require('sequelize');

// Génération du code d'activation
const generateActivationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Contrôleur pour l'inscription
const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const activationCode = generateActivationCode();

        const user = await User.create({
            email,
            password,
            username,
            activationCode
        });

        await sendMail(
            email,
            'Code d\'activation de votre compte',
            `Votre code d'activation est : ${activationCode}`
        );

        res.status(201).send({ message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Contrôleur pour l'activation du compte
const activate = async (req, res) => {
    try {
        const { email, activationCode } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send({ error: 'Utilisateur non trouvé.' });
        }

        if (user.activationCode !== activationCode) {
            return res.status(400).send({ error: 'Code d\'activation incorrect.' });
        }

        user.isActivated = true;
        user.activationCode = null;
        await user.save();

        res.send({ message: 'Compte activé avec succès.' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Contrôleur pour la connexion
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).send({ error: 'Email ou mot de passe incorrect.' });
        }

        if (!user.isActivated) {
            const newActivationCode = generateActivationCode();
            user.activationCode = newActivationCode;
            await user.save();

            await sendMail(
                email,
                'Nouveau code d\'activation',
                `Votre nouveau code d'activation est : ${newActivationCode}`
            );

            return res.status(403).send({ 
                error: 'Compte non activé. Un nouveau code d\'activation vous a été envoyé par email.' 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ error: 'Email ou mot de passe incorrect.' });
        }

        const token = jwt.sign({ 
            id: user.id,
            role: user.role,
            email: user.email

        }, process.env.JWT_SECRET);
        res.send({ token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

const resendActivationCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).send({ error: 'Utilisateur non trouvé.' });
        }

        if (user.isActivated) {
            return res.status(400).send({ error: 'Ce compte est déjà activé.' });
        }

        // Générer un nouveau code d'activation
        const newActivationCode = generateActivationCode();
        user.activationCode = newActivationCode;
        await user.save();

        // Envoyer le nouveau code par email
        await sendMail(
            email,
            'Nouveau code d\'activation',
            `Votre nouveau code d'activation est : ${newActivationCode}`
        );

        res.send({ message: 'Un nouveau code d\'activation vous a été envoyé par email.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
// Contrôleur pour la déconnexion
const logout = async (req, res) => {
    try {
        req.user.lastLogout = new Date();
        await req.user.save();
        res.send({ message: 'Déconnexion réussie.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const me = async (req, res) => {
    try {
        // On récupère l'utilisateur actuel depuis req.user (ajouté par le middleware authenticate)
        const user = await User.findByPk(req.user.id, {
            attributes: {
                exclude: ['password', 'resetToken', 'resetTokenExpiry', 'activationCode']
            }
        });

        if (!user) {
            return res.status(404).send({ error: 'Utilisateur non trouvé.' });
        }

        // Vous pouvez ajouter d'autres relations si nécessaire
        // Par exemple: include: [{ model: Profile }, { model: Settings }]

        res.send(user);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send({ error: 'Aucun compte associé à cet email.' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // Expire dans 1 heure
        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        
        const emailTemplate = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <title>Réinitialisation de mot de passe</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    }
                    .header {
                        background-color: #3498db;
                        color: white;
                        text-align: center;
                        padding: 15px;
                        border-radius: 5px 5px 0 0;
                        margin-bottom: 20px;
                    }
                    .content {
                        color: #333;
                    }
                    .reset-button {
                        display: block;
                        width: 200px;
                        margin: 20px auto;
                        padding: 12px 20px;
                        background-color: #2ecc71;
                        color: white;
                        text-align: center;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        font-size: 0.8em;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Réinitialisation de mot de passe</h2>
                    </div>
                    <div class="content">
                        <p>Bonjour,</p>
                        <p>Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le bouton ci-dessous pour continuer :</p>
                        
                        <a href="${resetLink}" class="reset-button">
                            Réinitialiser mon mot de passe
                        </a>
                        
                        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.</p>
                        <p>Ce lien est valide pour 1 heure.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Votre Application. Tous droits réservés.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await sendMail(
            email,
            'Réinitialisation de votre mot de passe',
            emailTemplate
        );

        res.send({ message: 'Les instructions de réinitialisation ont été envoyées à votre email.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Contrôleur pour réinitialiser le mot de passe
const resetPassword = async (req, res) => {
    try {
       // console.log('Requête de réinitialisation reçue:', req.body);

        const { token, newPassword } = req.body;
        
        if (!token || !newPassword) {
            console.error('Token ou mot de passe manquant');
            return res.status(400).send({ 
                error: 'Token et nouveau mot de passe requis.' 
            });
        }

        // Recherche de l'utilisateur avec le token
        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    [Op.gt]: new Date() // Token pas encore expiré
                }
            }
        });

        if (!user) {
            console.error('Utilisateur non trouvé pour le token:', token);
            return res.status(400).send({ 
                error: 'Le lien de réinitialisation est invalide ou a expiré.' 
            });
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Mettre à jour le mot de passe et réinitialiser le token
        await user.update({
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        });

        res.send({ message: 'Votre mot de passe a été réinitialisé avec succès.' });
    } catch (error) {
        console.error('Erreur détaillée:', error);
        res.status(500).send({ 
            error: 'Erreur interne du serveur',
            details: error.message 
        });
    }
};

// Contrôleur pour changer le mot de passe (utilisateur connecté)
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        // Vérifier l'ancien mot de passe
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Le mot de passe actuel est incorrect.' });
        }

        // Hasher et sauvegarder le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        await sendMail(
            user.email,
            'Mot de passe modifié',
            'Votre mot de passe a été modifié avec succès.'
        );

        res.send({ message: 'Mot de passe modifié avec succès.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
module.exports = {
    me,
    register,
    activate,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    changePassword,
    resendActivationCode
};
