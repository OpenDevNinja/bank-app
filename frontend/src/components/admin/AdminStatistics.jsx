// src/components/admin/AdminStatistics.jsx - Pour AdminDashboard
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const AdminStatistics = () => {
  // Données simulées pour les statistiques
  const monthlyStats = [
    { month: 'Jan', accounts: 45, transactions: 156 },
    { month: 'Fév', accounts: 52, transactions: 189 },
    { month: 'Mar', accounts: 61, transactions: 245 },
    { month: 'Avr', accounts: 58, transactions: 204 },
    { month: 'Mai', accounts: 65, transactions: 228 },
    { month: 'Juin', accounts: 74, transactions: 276 }
  ];

  return (
    <div className="mt-8 grid gap-8 grid-cols-1 lg:grid-cols-2">
      {/* Graphique des comptes créés */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Évolution des comptes
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="accounts" fill="#0EA5E9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique des transactions */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Volume des transactions
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="transactions" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;