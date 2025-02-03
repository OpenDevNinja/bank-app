import api from './api'
import { jwtDecode } from 'jwt-decode' 

export const authService = {
  async register(data) {
    try {
      const response = await api.post('/auth/register', data)
      return response
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async activate(data) {
    try {
      const response = await api.post('/auth/activate', data)
      return response
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      const token = response.token
      
      // Stocker le token
      localStorage.setItem('token', token)
      
      // Décoder le token pour obtenir les informations utilisateur
      const decodedToken = jwtDecode(token)
      
      // Construire l'objet utilisateur à partir du token décodé
      const user = {
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role
      }
      
      return { token, user }
    } catch (error) {
      throw error.response?.data || error.message
    }
  },


  async logout() {
    try {
      await api.post('/auth/logout')
      localStorage.removeItem('token')
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async requestPasswordReset(email) {
    try {
      const response = await api.post('/auth/request-password-reset', { email })
      return response
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async resetPassword(data) {
    try {
      console.log('Données envoyées au serveur:', data) // Débogage
      const response = await api.post('/auth/reset-password', data)
      return response
    } catch (error) {
      console.error('Erreur dans resetPassword:', error) // Log d'erreur
      throw error.response?.data || error.message
    }
  },

  async changePassword(data) {
    try {
      const response = await api.post('/auth/change-password', data)
      return response
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async resendActivationCode(email) {
    try {
      const response = await api.post('/auth/resend-activation', { email })
      return response
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}