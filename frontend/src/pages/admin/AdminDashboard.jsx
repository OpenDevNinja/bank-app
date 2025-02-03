import React, { useState, useEffect } from 'react';
import { ArrowUpCircle, CreditCard, History, UserCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card/Card';
import { adminService } from '../../services/admin';
import AdminStatistics from '../../components/admin/AdminStatistics';


const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalAccounts: 0,
    activeAccounts: 0,
    totalClients: 0,
    totalTransactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupération des données via les APIs
        const accounts = await adminService.getAllAccounts();
        const users = await adminService.getAllUsers();

       

        // Calcul des statistiques avec les tableaux directement
        const totalAccounts = Array.isArray(accounts) ? accounts.length : 0;
        const activeAccounts = Array.isArray(accounts) 
          ? accounts.filter(a => a.status === 'actif').length 
          : 0;
        const totalClients = Array.isArray(users) 
          ? users.filter(u => u.role === 'client').length 
          : 0;
        
        // Pour les transactions, on part du principe que chaque compte a eu au moins une transaction
        // Vous pouvez ajuster cette logique selon votre besoin réel
        const totalTransactions = totalAccounts; // Ou toute autre logique de calcul des transactions

        setDashboardData({
          totalAccounts,
          activeAccounts,
          totalClients,
          totalTransactions,
        });

        

      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Erreur lors du chargement des données: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Comptes total',
      value: dashboardData.totalAccounts,
      icon: <CreditCard className="h-6 w-6 text-gray-400" />,
    },
    {
      title: 'Comptes actifs',
      value: dashboardData.activeAccounts,
      icon: <ArrowUpCircle className="h-6 w-6 text-green-400" />,
    },
    {
      title: 'Clients total',
      value: dashboardData.totalClients,
      icon: <UserCircle className="h-6 w-6 text-blue-400" />,
    },
    {
      title: 'Transactions',
      value: dashboardData.totalTransactions,
      icon: <History className="h-6 w-6 text-purple-400" />,
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Administration
      </h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {card.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {card.title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AdminStatistics />
    </div>
  );
};

export default AdminDashboard;