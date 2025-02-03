// services/account.js
import api from './api'

export const accountService = {
  // Créer un nouveau compte bancaire
  createAccount: async (accountData) => {
    return await api.post('/accounts', accountData)
  },

  // Faire un dépôt
  deposit: async (accountId, amount) => {
    return await api.post(`/accounts/${accountId}/deposit`, { amount })
  },

  // Faire un retrait
  withdraw: async (accountId, amount) => {
    return await api.post(`/accounts/${accountId}/withdraw`, { amount })
  },

  // Obtenir les transactions d'un compte
  getTransactions: async (accountId) => {
    return await api.get(`/accounts/${accountId}/transactions`)
  },

  // Obtenir les détails d'un compte spécifique
  getAccount: async (accountId) => {
    return await api.get(`/accounts/${accountId}`)
  },

  // Obtenir les comptes selon le rôle
  getUserAccounts: async () => {
    return await api.get('/accounts/my-accounts')
  },

/*   // Obtenir tous les comptes (admin uniquement)
  getAllAccounts: async () => {
    return await api.get('/admin/all-accounts')
  },

  // Désactiver un compte (admin uniquement)
  deactivateAccount: async (accountId) => {
    return await api.patch(`/admin/accounts/${accountId}/deactivate`)
  },

  // Obtenir les comptes désactivés (admin uniquement)
  getDeactivatedAccounts: async () => {
    return await api.get('/admin/deactivated-accounts')
  } */
}