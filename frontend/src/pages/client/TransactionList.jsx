import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Card , CardHeader, CardTitle, CardContent } from '../../components/ui/card/Card';
import { accountService } from '../../services/account';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [amountRange, setAmountRange] = useState({
    min: '',
    max: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchData = async () => {
    try {
      setLoading(true);
      const accountsResponse = await accountService.getUserAccounts();
      const accountsData = accountsResponse.data || accountsResponse;
      setAccounts(accountsData);

      const transactionsPromises = accountsData.map(account =>
        accountService.getTransactions(account.id)
      );
      const transactionsResponses = await Promise.all(transactionsPromises);
      
      const allTransactions = transactionsResponses.flatMap(response => {
        const transactions = response.data || response;
        return transactions.map(transaction => ({
          ...transaction,
          amount: parseFloat(transaction.amount || 0)
        }));
      });

      setTransactions(allTransactions);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return '0,00 €';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(numAmount);
  };

  const getTransactionTypeStyle = (type) => {
    return type === 'depot' 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'depot':
        return 'Dépôt';
      case 'retrait':
        return 'Retrait';
      default:
        return type;
    }
  };

  // Filtrer les transactions
  const filteredTransactions = transactions.filter(transaction => {
    const searchMatch = 
      transaction.account?.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${transaction.account?.firstName} ${transaction.account?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());

    const accountMatch = selectedAccount === 'all' || transaction.accountId === selectedAccount;
    const typeMatch = selectedType === 'all' || transaction.type === selectedType;
    
    const dateMatch = (!dateRange.start || new Date(transaction.createdAt) >= new Date(dateRange.start)) &&
                     (!dateRange.end || new Date(transaction.createdAt) <= new Date(dateRange.end));

    const amountMatch = (!amountRange.min || transaction.amount >= parseFloat(amountRange.min)) &&
                       (!amountRange.max || transaction.amount <= parseFloat(amountRange.max));

    return searchMatch && accountMatch && typeMatch && dateMatch && amountMatch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = filteredTransactions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedAccount('all');
    setSelectedType('all');
    setDateRange({ start: '', end: '' });
    setAmountRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="text-3xl text-white mb-4 font-bold">Liste des Transactions</CardTitle>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tous les comptes</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.accountNumber}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Tous les types</option>
              <option value="depot">Dépôt</option>
              <option value="retrait">Retrait</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white flex items-center gap-2 border rounded-md hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filtres
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Période</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="px-2 py-1 border rounded-md"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="px-2 py-1 border rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Montant</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={amountRange.min}
                    onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                    className="px-2 py-1 border rounded-md"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={amountRange.max}
                    onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                    className="px-2 py-1 border rounded-md"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 text-sm text-gray-600 border rounded-md hover:bg-gray-100"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Montant</th>
                <th className="px-4 py-2 text-left">N° de compte</th>
                <th className="px-4 py-2 text-left">Titulaire</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b ">
                  <td className="px-4 py-2 dark:text-white">
                    {format(new Date(transaction.createdAt), 'dd MMMM yyyy', { locale: fr })}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${getTransactionTypeStyle(transaction.type)}`}>
                      {getTransactionTypeLabel(transaction.type)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={transaction.type === 'depot' ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-2 dark:text-white ">{transaction.account?.accountNumber}</td>
                  <td className="px-4 py-2 dark:text-white">
                    {transaction.account 
                      ? `${transaction.account.firstName} ${transaction.account.lastName}`
                      : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredTransactions.length)} sur {filteredTransactions.length} transactions
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;