import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Lock, Unlock } from 'lucide-react';
import { adminService } from '../../services/admin';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      //console.log('API Response:', response);
      
      const userData = Array.isArray(response) ? response : response?.data || [];
     // console.log('Processed User Data:', userData);
      
      setUsers(userData);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError("Impossible de charger les utilisateurs");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserBlock = async (userId, isBlocked) => {
    try {
      if (isBlocked) {
        await adminService.unblockUser(userId);
      } else {
        await adminService.blockUser(userId);
      }
      await fetchUsers();
    } catch (err) {
      console.error('Erreur lors du blocage/déblocage:', err);
      setError(isBlocked ? "Impossible de débloquer l'utilisateur" : "Impossible de bloquer l'utilisateur");
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      await fetchUsers();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du rôle:', err);
      setError("Impossible de modifier le rôle de l'utilisateur");
    }
  };

  const filteredUsers = searchTerm
    ? users.filter(user =>
        (user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user?.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    : users;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Chargement des utilisateurs...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Gestion des Utilisateurs
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
            placeholder="Rechercher un utilisateur..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Dernière connexion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <select
                    className="px-2 py-1 rounded-lg border dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                  >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.isActivated && !user.isblocked
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {user.isActivated && !user.isblocked ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {user.lastLogout ? new Date(user.lastLogout).toLocaleString('fr-FR') : 'Jamais'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleUserBlock(user.id, user.isblocked)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      {user.isblocked ? (
                        <Unlock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;