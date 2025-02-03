import { useState, useEffect } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { accountService } from '../../services/account'

const MyAccounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const fetchAccounts = async () => {
    try {
      // Vérifie si l'utilisateur est chargé et authentifié
      if (!user) {
        setAccounts([])
        return
      }

      const response = user.role === 'admin' 
        ? await accountService.getAllAccounts()
        : await accountService.getUserAccounts()
      
      // S'assure que la réponse contient les données
      const data = response?.data || response
      setAccounts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erreur lors du chargement des comptes:', err)
      setError('Erreur lors du chargement des comptes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchAccounts()
    }
  }, [user, authLoading])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  // Affiche le loader pendant le chargement de l'authentification ou des comptes
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  // Affiche un message si l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Veuillez vous connecter pour accéder à vos comptes
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg
                     hover:bg-primary-700 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user.role === 'admin' ? 'Gestion des comptes' : 'Mes comptes'}
        </h1>
        {(user.role === 'admin' || accounts.length === 0) && (
          <button
            onClick={() => navigate('/create-account')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white 
                     rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouveau compte
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6
                     border border-gray-200 dark:border-dark-border
                     hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/account/${account.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {account.accountNumber}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {account.firstName} {account.lastName}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs
                            ${account.status === 'actif'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                }`}>
                {account.status}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Solde</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(account.balance)}
                </p>
              </div>
              <button
                className="text-primary-600 hover:text-primary-700
                         dark:text-primary-400 dark:hover:text-primary-300"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/account/${account.id}`)
                }}
              >
                Voir détails →
              </button>
            </div>
          </div>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {user.role === 'admin'
              ? 'Aucun compte bancaire enregistré'
              : 'Vous n\'avez pas encore de compte bancaire'}
          </p>
          <button
            onClick={() => navigate('/create-account')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg
                     hover:bg-primary-700 transition-colors"
          >
            Créer un compte
          </button>
        </div>
      )}
    </div>
  )
}

export default MyAccounts