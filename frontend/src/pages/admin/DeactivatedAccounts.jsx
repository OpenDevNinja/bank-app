import { useState, useEffect } from 'react'

import { RefreshCw, AlertCircle } from 'lucide-react'
import { accountService } from '../../services/account'

const DeactivatedAccounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDeactivatedAccounts = async () => {
    try {
      const data = await accountService.getDeactivatedAccounts()
      setAccounts(data)
    } catch (err) {
      setError('Erreur lors du chargement des comptes désactivés')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeactivatedAccounts()
  }, [])

  const handleReactivate = async (accountId) => {
    try {
      await accountService.reactivateAccount(accountId)
      await fetchDeactivatedAccounts()
    } catch (err) {
      setError('Erreur lors de la réactivation du compte')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Comptes Désactivés
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 
                       dark:text-red-100 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-dark-card rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
            <thead className="bg-gray-50 dark:bg-dark-bg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                             dark:text-gray-400 uppercase tracking-wider">
                  N° Compte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                             dark:text-gray-400 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                             dark:text-gray-400 uppercase tracking-wider">
                  Solde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                             dark:text-gray-400 uppercase tracking-wider">
                  Date de désactivation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 
                             dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 
                             dark:divide-dark-border">
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 
                               dark:text-white">
                    {account.accountNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 
                               dark:text-white">
                    {account.firstName} {account.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 
                               dark:text-white">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(account.balance)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 
                               dark:text-white">
                    {new Date(account.updatedAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleReactivate(account.id)}
                      className="text-primary-600 hover:text-primary-900 
                               dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Réactiver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {accounts.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Aucun compte désactivé
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeactivatedAccounts