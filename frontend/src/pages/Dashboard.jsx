import { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { accountService } from '../services/account';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card/Card';
import TransactionTable from '../components/transactions/TransactionTable';

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    accountCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '0,00 €';
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(numAmount);
  };

  const fetchUserData = async () => {
    try {
      if (!user) return;

      // Récupération des comptes
      const accountsResponse = await accountService.getUserAccounts();
      const accountsData = Array.isArray(accountsResponse.data) 
        ? accountsResponse.data 
        : Array.isArray(accountsResponse) 
          ? accountsResponse 
          : [];
      
      setAccounts(accountsData);

      // Récupération des transactions pour chaque compte
      const transactionsPromises = accountsData.map(account =>
        accountService.getTransactions(account.id)
      );

      const transactionsResponses = await Promise.all(transactionsPromises);
      
      // Traitement et normalisation des transactions
      const allTransactionsData = transactionsResponses.flatMap(response => {
        const transactions = Array.isArray(response.data) ? response.data : Array.isArray(response) ? response : [];
        return transactions.map(transaction => ({
          ...transaction,
          amount: parseFloat(transaction.amount || 0)
        }));
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setAllTransactions(allTransactionsData);

      // Calcul des statistiques
      const totalBalance = accountsData.reduce((sum, account) => 
        sum + parseFloat(account.balance || 0), 0);
      
      const deposits = allTransactionsData.filter(t => t.type === 'depot');
      const withdrawals = allTransactionsData.filter(t => t.type === 'retrait');
      
      setStats({
        totalBalance,
        totalDeposits: deposits.reduce((sum, t) => sum + (t.amount || 0), 0),
        totalWithdrawals: withdrawals.reduce((sum, t) => sum + (t.amount || 0), 0),
        accountCount: accountsData.length
      });

    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchUserData();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Veuillez vous connecter pour accéder à votre tableau de bord</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
        <button
          onClick={() => navigate('/create-account')}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg 
                    hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouveau compte
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Solde total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-dark-bg dark:text-white  font-bold">{formatCurrency(stats.totalBalance)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total des dépôts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalDeposits)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total des retraits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalWithdrawals)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Nombre de comptes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-dark-bg dark:text-white font-bold">{stats.accountCount}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl mb-6 font-bold text-gray-900 dark:text-white">
        Mes comptes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6
                     border border-gray-200 dark:border-gray-700
                     hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/account/${account.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {account.accountNumber}
                </h3>
                <p className="text-sm text-gray-500">
                  {account.type}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs
                            ${account.status === 'actif'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                }`}>
                {account.status}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-500">Solde</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(account.balance)}
                </p>
              </div>
              <button
                className="text-primary-600 hover:text-primary-700"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/account/${account.id}`);
                }}
              >
                Voir transactions →
              </button>
            </div>
          </div>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Dernières Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable transactions={allTransactions.slice(0, 10)} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;