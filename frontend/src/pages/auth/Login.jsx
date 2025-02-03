import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // On efface l'erreur dès que l'utilisateur commence à modifier un champ
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Empêche le rechargement de la page
    
    // Validation basique
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs")
      return
    }

    setIsLoading(true)
    
    try {
      const response = await login(formData)
      
      if (response.token) {
        localStorage.setItem('token', response.token)
        // Redirection en fonction du rôle
        if (response.user?.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/dashboard')
        }
      }
    } catch (err) {
      // On ne log l'erreur que pour le développement
      console.error('Erreur de connexion:', err)
      
      // Gestion spécifique des erreurs
      if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect")
      } else if (err.response?.status === 403) {
        // Redirection vers la page d'activation
        navigate(`/activate?email=${encodeURIComponent(formData.email)}`)
      } else if (!navigator.onLine) {
        setError("Vérifiez votre connexion internet")
      } else {
        setError(err.response?.data?.error || "Email ou mot de passe incorrect")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Connexion à votre compte
          </h2>
        </div>
        
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg" role="alert">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border 
                         border-gray-300 dark:border-gray-600 placeholder-gray-500 
                         text-gray-900 dark:text-white bg-white dark:bg-gray-700
                         focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="exemple@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            {/* Champ Mot de passe */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border
                         border-gray-300 dark:border-gray-600 placeholder-gray-500
                         text-gray-900 dark:text-white bg-white dark:bg-gray-700
                         focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 
                           hover:text-gray-500 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? 
                    <EyeOff className="h-5 w-5" /> : 
                    <Eye className="h-5 w-5" />
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Bouton de connexion */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent
                       text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </span>
              ) : 'Se connecter'}
            </button>
          </div>

          {/* Liens utiles */}
          <div className="flex items-center justify-between text-sm">
            <Link 
              to="/register" 
              className="font-medium text-indigo-600 hover:text-indigo-500 
                       dark:text-indigo-400 transition-colors duration-200"
            >
              Pas encore de compte ?
            </Link>
            
            <Link 
              to="/forgot-password" 
              className="font-medium text-indigo-600 hover:text-indigo-500 
                       dark:text-indigo-400 transition-colors duration-200"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

