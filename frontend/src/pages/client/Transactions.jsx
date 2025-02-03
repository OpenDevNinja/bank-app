// pages/client/Transactions.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { accountService } from '../../services/account'
import { Card,CardHeader, CardTitle, CardContent } from '../../components/ui/card/Card'
import { TransactionTable } from '../../components/transactions/TransactionTable'

const MyTransactions = () => {
  const { accountId } = useParams()
  const [transactions, setTransactions] = useState([])
  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAccountData = async () => {
    try {
      setLoading(true)
      // Récupérer les détails du compte
      const accountResponse = await accountService.getAccount(accountId)
      setAccount(accountResponse.data || accountResponse)

      // Récupérer les transactions
      const transactionsResponse = await accountService.getTransactions(accountId)
      setTransactions(transactionsResponse.data || transactionsResponse)
    } catch (err) {
      console.error('Erreur lors du chargement des transactions:', err)
      setError('Erreur lors du chargement des transactions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccountData()
  }, [accountId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            Transactions du compte {account?.accountNumber}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable transactions={transactions} />
        </CardContent>
      </Card>
    </div>
  )
}

export default MyTransactions