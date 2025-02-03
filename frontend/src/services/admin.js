// services/admin.js
import api from './api'

export const adminService = {
  // Gestion des comptes bancaires
  getAllAccounts: async () => {
    return await api.get('/admin/all-accounts')
  },
  
  deactivateAccount: async (accountId) => {
    return await api.patch(`/admin/${accountId}/deactivate`)
  },
  
  reactivateAccount: async (accountId) => {
    return await api.patch(`/admin/${accountId}/reactivate`)
  },

  getDeactivatedAccounts: async () => {
    return await api.get('/admin/deactivated')
  },

  // Gestion des utilisateurs
  getAllUsers: async () => {
    return await api.get('/admin/users')
  },

  blockUser: async (userId) => {
    return await api.put(`/admin/users/${userId}/block`)
  },

  unblockUser: async (userId) => {
    return await api.put(`/admin/users/${userId}/unblock`)
  },

  updateUserRole: async (userId, role) => {
    return await api.put(`/admin/users/${userId}/role`, { role })
  },


  
  
}