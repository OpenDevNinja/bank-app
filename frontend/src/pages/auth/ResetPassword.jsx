
// pages/auth/ResetPassword.jsx
import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { authService } from '../../services/auth'

const ResetPassword = () => {
  const navigate = useNavigate()
  const { token } = useParams()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
  
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
  
    setLoading(true)
  
    try {
      console.log('Token reçu:', token) // Débogage
      console.log('Données envoyées:', {
        token,
        newPassword: formData.password
      })
  
      const response = await authService.resetPassword({
        token,
        newPassword: formData.password
      })
      
      navigate('/login', { 
        state: { 
          message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.' 
        }
      })
    } catch (err) {
      console.error('Erreur de réinitialisation:', err) // Log détaillé de l'erreur
      setError(
        err.response?.data?.error || 
        'Une erreur est survenue lors de la réinitialisation du mot de passe.'
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-dark-text">
            Réinitialisation du mot de passe
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Entrez votre nouveau mot de passe
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <label htmlFor="password" className="sr-only">Nouveau mot de passe</label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border
                         border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg
                         placeholder-gray-500 text-gray-900 dark:text-dark-text focus:ring-primary-500
                         focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Nouveau mot de passe"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <EyeOff className="h-5 w-5 text-gray-400" /> : 
                  <Eye className="h-5 w-5 text-gray-400" />
                }
              </button>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border
                         border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg
                         placeholder-gray-500 text-gray-900 dark:text-dark-text focus:ring-primary-500
                         focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Confirmer le nouveau mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent
                       text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <Link 
              to="/login" 
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ResetPassword