
// Pour le AuthContext
import { createContext, useState, useEffect } from 'react'
import { authService } from '../services/auth'
import api from '../services/api'
import { validationRules } from '../utils/validation'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const validatePassword = (password) => {
    const errors = []
    if (password.length < validationRules.password.minLength) {
      errors.push(`Le mot de passe doit contenir au moins ${validationRules.password.minLength} caractères`)
    }
    
    validationRules.password.patterns.forEach(({ pattern, message }) => {
      if (!pattern.test(password)) {
        errors.push(message)
      }
    })
    
    return errors
  }

  const validateEmail = (email) => {
    if (!validationRules.email.pattern.test(email)) {
      return [validationRules.email.message]
    }
    return []
  }

  const validateUsername = (username) => {
    if (!validationRules.username.pattern.test(username)) {
      return [validationRules.username.message]
    }
    return []
  }

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await api.get('/auth/me')
      setUser(response)
    } catch (err) {
      console.error('Échec de la vérification de connexion:', err)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async ({ email, password }) => {
    try {
      const emailErrors = validateEmail(email)
      if (emailErrors.length > 0) {
        throw new Error(emailErrors.join(', '))
      }

      const response = await authService.login({ email, password })
      localStorage.setItem('token', response.token)
      setUser(response.user)
      return response
    } catch (err) {
      setError(err.message || "Échec de la connexion: Vérifiez vos identifiants")
      throw err
    }
  }

  const register = async ({ username, email, password }) => {
    try {
      const emailErrors = validateEmail(email)
      const passwordErrors = validatePassword(password)
      const usernameErrors = validateUsername(username)
      
      const allErrors = [...emailErrors, ...passwordErrors, ...usernameErrors]
      if (allErrors.length > 0) {
        throw new Error(allErrors.join('\n'))
      }

      const response = await authService.register({ username, email, password })
      return response
    } catch (err) {
      setError(err.message || "Échec de l'inscription: Veuillez vérifier vos informations")
      throw err
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      localStorage.removeItem('token')
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
      throw new Error('Erreur lors de la déconnexion. Veuillez réessayer.')
    }
  }

  const activate = async (activationData) => {
    try {
      const response = await authService.activate(activationData)
      return response
    } catch (error) {
      setError("Échec de l'activation du compte: Code invalide ou expiré")
      throw new Error("Échec de l'activation du compte: Code invalide ou expiré")
    }
  }

  const resendActivationCode = async (email) => {
    try {
      const response = await authService.resendActivationCode(email)
      return response
    } catch (error) {
      setError("Échec de l'envoi du code d'activation")
      throw new Error("Échec de l'envoi du code d'activation")
    }
  }


  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      activate,
      resendActivationCode 
    }}>
      {children}
    </AuthContext.Provider>
  )
}