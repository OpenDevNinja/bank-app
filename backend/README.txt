// README.md
# Application de Gestion de Comptes Bancaires

## Description
Application bancaire permettant la gestion des comptes clients avec un système d'authentification sécurisé, des opérations bancaires et un système de notification par email.

## Fonctionnalités
- Inscription et activation de compte par email
- Authentification sécurisée
- Gestion des comptes bancaires (création, consultation)
- Opérations bancaires (dépôt, retrait)
- Historique des transactions
- Gestion administrative (désactivation de comptes)
- Notifications par email
- Rapports automatisés

## Prérequis
- Node.js (v14 ou supérieur)
- MySQL (v5.7 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le projet
```bash
git clone [url-du-projet]
cd bank-app
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer l'environnement
Créez un fichier `.env` à la racine du projet :
```env
PORT=3000
DB_NAME=bank_app
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
JWT_SECRET=votre_clé_secrète_jwt
EMAIL_USER=votre_email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_application_gmail
```

4. Créer la base de données
```sql
CREATE DATABASE bank_app;
```

5. Démarrer le serveur
```bash
# Mode développement
npm run dev

# Mode production
npm start
```


## API Endpoints

### Authentication
- POST /api/auth/register - Inscription
- POST /api/auth/activate - Activation du compte
- POST /api/auth/login - Connexion
- POST /api/auth/logout - Déconnexion

### Comptes
- POST /api/accounts - Créer un compte
- GET /api/accounts - Lister les comptes
- GET /api/accounts/:id - Détails d'un compte
- POST /api/accounts/:id/deposit - Effectuer un dépôt
- POST /api/accounts/:id/withdraw - Effectuer un retrait
- GET /api/accounts/:id/transactions - Historique des transactions

### Administration
- PATCH /api/admin/:id/deactivate - Désactiver un compte
- GET /api/admin/deactivated-accounts - Lister les comptes désactivés

## Sécurité
- Authentification JWT
- Hashage des mots de passe
- Validation des données
- Rate limiting
- Protection CORS
- Headers sécurisés

## Tests
```bash
npm test
```
## Dépendances
```bash
npm init -y
npm install express sequelize mysql2 bcryptjs jsonwebtoken dotenv cors helmet express-rate-limit node-cron nodemailer nodemailer-smtp-transport uuid  express-validator
npm install --save-dev nodemon
```
## Production
Pour un déploiement en production :
1. Configurer un proxy inverse (nginx recommandé)
2. Utiliser PM2 pour la gestion des processus
3. Configurer SSL
4. Mettre en place des sauvegardes

