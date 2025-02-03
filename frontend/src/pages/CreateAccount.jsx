import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AlertCircle } from 'lucide-react'
import { accountService } from '../services/account'

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
   
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
    

      const accountData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        
      }

      const response = await accountService.createAccount(accountData)
      navigate(`/account/${response.id}`)
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du compte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-dark-card rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Créer un nouveau compte
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-dark-border
                         rounded-md dark:bg-dark-bg dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-dark-border
                         rounded-md dark:bg-dark-bg dark:text-white"
              />
            </div>
          </div>

        

          {error && (
            <div className="p-2 bg-red-100 dark:bg-red-900 text-red-700
                          dark:text-red-100 rounded-md flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-600 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-dark-bg rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md
                       hover:bg-primary-700 disabled:opacity-50
                       disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer le compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAccount