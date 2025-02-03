// src/components/transactions/TransactionList.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { findTransactionsByAccountId } from '../../data/mockData';

const TransactionList = ({ accountId }) => {
  const { user } = useAuth();
  const transactions = findTransactionsByAccountId(accountId);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Transactions</h1>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-dark-border">
              <thead>
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                        transaction.type === 'depot' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'depot' ? 'Dépôt' : 'Retrait'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {transaction.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;