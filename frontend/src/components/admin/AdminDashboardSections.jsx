import React from "react";
import { accounts } from "../../data/mockData";

const AdminDashboardSections = () => {
    // Statistiques des comptes désactivés
    const disabledAccounts = accounts.filter(a => a.status === 'désactivé');
    
    return (
      <>
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Comptes récemment désactivés
          </h2>
          <div className="bg-white dark:bg-dark-card shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
              <thead className="bg-gray-50 dark:bg-dark-bg">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Numéro de compte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Titulaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date de désactivation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Solde final
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
                {disabledAccounts.map((account) => (
                  <tr key={account.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {account.accountNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {account.firstName} {account.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(account.updatedAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {account.balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Graphique d'activité */}
          <div className="bg-white dark:bg-dark-card shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Activité des transactions
            </h3>
            {/* Implémentez ici un graphique avec recharts */}
          </div>
  
          {/* Liste des dernières actions administratives */}
          <div className="bg-white dark:bg-dark-card shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Dernières actions administratives
            </h3>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200 dark:divide-dark-border">
                {/* Liste des actions à implémenter */}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  };
  
export default AdminDashboardSections;  