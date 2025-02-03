import React, { useState, useEffect } from 'react';
import { Search, ArrowUpRight, ArrowDownLeft, Eye } from 'lucide-react';
import { adminService } from '../../services/admin';
import { accountService } from '../../services/account';

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const accounts = await adminService.getAllAccounts();
      if (Array.isArray(accounts)) {
        const allTransactions = await Promise.all(
          accounts.map(async (account) => {
            try {
              const accountTransactions = await accountService.getTransactions(account.id);
              return accountTransactions.map(transaction => ({
                ...transaction,
                accountNumber: account.accountNumber,
                accountOwner: `${account.firstName} ${account.lastName}`
              }));
            } catch (err) {
              console.error(`Error fetching transactions for account ${account.id}:`, err);
              return [];
            }
          })
        );
        const flattenedTransactions = allTransactions.flat();
        setTransactions(flattenedTransactions);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError("Impossible de charger les transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTransaction = async (accountId) => {
    try {
      const transactions = await accountService.getTransactions(accountId);
      setSelectedTransaction(transactions[0] || null);
      setError(null);
    } catch (err) {
      console.error('Error viewing transaction details:', err);
      setError("Impossible de voir les détails de la transaction");
    }
  };

  const getTransactionTypeIcon = (type) => {
    switch(type) {
      case 'depot':
        return <ArrowDownLeft className="h-4 w-4 text-green-500 mr-2" />;
      case 'retrait':
        return <ArrowUpRight className="h-4 w-4 text-red-500 mr-2" />;
      default:
        return null;
    }
  };

  const getTransactionTypeText = (type) => {
    const types = {
      'depot': 'Dépôt',
      'retrait': 'Retrait'
    };
    return types[type] || type;
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      signDisplay: 'never'
    }).format(Math.abs(amount));
    
    return type === 'depot' ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      transaction.accountNumber?.toLowerCase().includes(searchLower) ||
      transaction.accountOwner?.toLowerCase().includes(searchLower) ||
      transaction.amount?.toString().includes(searchLower);
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Chargement des transactions...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Gestion des Transactions
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="search"
            placeholder="Rechercher par compte ou montant..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Toutes les opérations</option>
          <option value="depot">Dépôts</option>
          <option value="retrait">Retraits</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Compte
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Titulaire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(transaction.createdAt).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      {getTransactionTypeIcon(transaction.type)}
                      {getTransactionTypeText(transaction.type)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {transaction.accountNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {transaction.accountOwner}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={transaction.type === 'depot' ? 'text-green-600' : 'text-red-600'}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewTransaction(transaction.accountId)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Aucune transaction trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-4">Détails de la Transaction</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{new Date(selectedTransaction.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Montant</p>
                  <p className={selectedTransaction.type === 'depot' ? 'text-green-600' : 'text-red-600'}>
                    {formatAmount(selectedTransaction.amount, selectedTransaction.type)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p>{getTransactionTypeText(selectedTransaction.type)}</p>
              </div>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;