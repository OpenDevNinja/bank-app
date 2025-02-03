// pages/client/TransactionDetails.jsx
import { TransactionTable } from '../../components/transactions/TransactionTable'
import { Card , CardHeader, CardTitle, CardContent  } from '../../components/ui/card/Card'

const TransactionDetails = ({ account, transactions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Informations du compte */}
      <Card>
        <CardHeader>
          <CardTitle>Détails du compte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Numéro de compte
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {account.accountNumber}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Solde actuel
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {formatCurrency(account.balance)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Statut
              </p>
              <p className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full
                          ${account.status === 'actif'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                }`}>
                {account.status}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Type de compte
              </p>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {account.type}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historique des transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable 
            transactions={transactions} 
            showAccountColumn={false}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionDetails