import React from 'react';
import { Home, Wallet, History, UserCircle, LogOut, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const MobileNavigation = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleNavigation = async (path, isLogout = false) => {
    if (isLogout) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    } else {
      navigate(path);
    }
  };

  const clientMenuItems = [
    { icon: Home, label: 'Accueil', path: '/dashboard' },
    { icon: Wallet, label: 'Comptes', path: '/account' },
    { icon: History, label: 'Transactions', path: '/transactions' },
    { icon: LogOut, label: 'Déconnexion', path: '/logout', isLogout: true }
  ];

  const adminMenuItems = [
    { icon: Home, label: 'Admin', path: '/admin/dashboard' },
    { icon: Wallet, label: 'Comptes', path: '/admin/accounts' },
    { icon: History, label: 'Transactions', path: '/admin/transactions' },
    { icon: UserCircle, label: 'Utilisateurs', path: '/admin/users' },
    { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
    { icon: LogOut, label: 'Déconnexion', path: '/logout', isLogout: true }
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : clientMenuItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border">
      <div className="flex justify-around items-center h-16">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.path, item.isLogout)}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;