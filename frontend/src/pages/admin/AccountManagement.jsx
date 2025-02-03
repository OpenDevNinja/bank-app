import React, { useState, useEffect } from 'react';
import { Search, Eye, Ban, CheckCircle, Plus } from 'lucide-react';
import { adminService } from '../../services/admin';
import { accountService } from '../../services/account';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await adminService.getAllAccounts();
      // Maintenant on stocke directement response car c'est déjà un tableau
      setAccounts(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError("Une erreur est survenue lors du chargement des comptes");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountStatus = async (accountId, currentStatus) => {
    try {
      if (currentStatus === 'actif') {
        await adminService.deactivateAccount(accountId);
      } else {
        await adminService.reactivateAccount(accountId);
      }
      await fetchAccounts();
      setError(null);
    } catch (err) {
      console.error('Error updating account status:', err);
      setError(`Impossible de ${currentStatus === 'actif' ? 'désactiver' : 'réactiver'} le compte`);
    }
  };

  const handleViewAccount = async (accountId) => {
    try {
      const response = await accountService.getAccount(accountId);
      setSelectedAccount(response || null);
      setError(null);
    } catch (err) {
      console.error('Error fetching account details:', err);
      setError("Impossible de récupérer les détails du compte");
    }
  };

  const handleCreateAccount = async () => {
    console.log('Create account functionality to be implemented');
  };

  const filteredAccounts = accounts?.filter(account =>
    account?.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${account?.firstName} ${account?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestion des Comptes
        </h2>
      {/*   <button 
          onClick={handleCreateAccount}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Compte
        </button> */}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="search"
          placeholder="Rechercher un compte..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Numéro de Compte
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Titulaire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Solde
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <tr key={account?.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {account?.accountNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {`${account?.firstName} ${account?.lastName}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('fr-FR', { 
                      style: 'currency', 
                      currency: 'EUR' 
                    }).format(parseFloat(account?.balance) || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      account?.status === 'actif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {account?.status === 'actif' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                  {/*     <button 
                        onClick={() => handleViewAccount(account?.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button> */}
                      <button 
                        onClick={() => handleAccountStatus(account?.id, account?.status)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        {account?.status === 'actif' ? (
                          <Ban className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Aucun compte trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountManagement;