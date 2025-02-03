import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { AlertCircle, ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react'
import { accountService } from '../services/account'

const AccountDetails = () => {
  const { id } = useParams()
  const [account, setAccount] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [operationType, setOperationType] = useState(null)
  const [amount, setAmount] = useState('')
  const [operationLoading, setOperationLoading] = useState(false)

  const fetchData = async () => {
    try {
      const [accountData, transactionsData] = await Promise.all([
        accountService.getAccount(id),
        accountService.getTransactions(id)
      ])
      setAccount(accountData)

     setTransactions(transactionsData.map(transaction => ({
    ...transaction,
    amount: transaction.type === 'retrait' ? -transaction.amount : transaction.amount
  })))
    } catch (err) {
      setError('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  const handleOperation = async (e) => {
    e.preventDefault()
    setOperationLoading(true)
    try {
      const operation = operationType === 'depot' 
        ? accountService.deposit
        : accountService.withdraw
      await operation(id, parseFloat(amount))
      await fetchData()
      setModalOpen(false)
      setAmount('')
    } catch (err) {
    
      setError(err.response?.data?.error || 'Solde insuffisant.')
    } finally {
      setOperationLoading(false)
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
      {/* Informations du compte */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Compte N° {account.accountNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {account.firstName} {account.lastName}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm
                        ${account.status === 'actif'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        }`}>
            {account.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Solde actuel</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(account.balance)}
            </p>
          </div>

          {account.status === 'actif' && (
            <>
              <button
                onClick={() => {
                  setOperationType('depot')
                  setModalOpen(true)
                }}
                className="flex items-center justify-center gap-2 bg-primary-600
                         hover:bg-primary-700 text-white rounded-lg p-4
                         transition-colors"
              >
                <ArrowDownCircle className="w-5 h-5" />
                Faire un dépôt
              </button>

              <button
                onClick={() => {
                  setOperationType('retrait')
                  setModalOpen(true)
                }}
                className="flex items-center justify-center gap-2 bg-primary-600
                         hover:bg-primary-700 text-white rounded-lg p-4
                         transition-colors"
              >
                <ArrowUpCircle className="w-5 h-5" />
                Faire un retrait
              </button>
            </>
          )}
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Historique des transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b dark:border-dark-border">
                <th className="pb-3 px-6">Date</th>
                <th className="pb-3 px-6">Type</th>
                <th className="pb-3 px-6">Montant</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b dark:border-dark-border hover:bg-gray-50
                           dark:hover:bg-dark-bg transition-colors"
                >
                  <td className="py-4 px-6">
                    {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-sm
                                 ${transaction.type === 'depot'
                                   ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                   : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                 }`}>
                      {transaction.type === 'depot' ? 'Dépôt' : 'Retrait'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={transaction.type === 'depot'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'}>
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(transaction.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Aucune transaction pour ce compte
            </div>
          )}
        </div>
      </div>

      {/* Modal pour les opérations */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {operationType === 'depot' ? 'Faire un dépôt' : 'Faire un retrait'}
            </h3>

            <form onSubmit={handleOperation}>
              <div className="mb-4">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Montant
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                  className="w-full p-2 border border-gray-300 dark:border-dark-border
                           rounded-md dark:bg-dark-bg dark:text-white"
                />
              </div>

              {error && (
                <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700
                              dark:text-red-100 rounded-md flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false)
                    setError('')
                    setAmount('')
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300
                           hover:bg-gray-100 dark:hover:bg-dark-bg rounded-md"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={operationLoading || !amount}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md
                           hover:bg-primary-700 disabled:opacity-50
                           disabled:cursor-not-allowed"
                >
                  {operationLoading ? 'En cours...' : 'Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountDetails