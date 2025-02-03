// src/layouts/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { 
  Home, 
  Wallet, 
  History, 
  Users, 
  Settings, 
  LogOut,
  X, 
  UserCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const clientMenuItems = [
    { icon: Home, label: 'Tableau de bord', path: '/dashboard' },
    { icon: Wallet, label: 'Mes comptes', path: '/account' },
    { icon: History, label: 'Transactions', path: '/transactions' },
  
  ];

  const adminMenuItems = [
    { icon: Home, label: 'Administration', path: 'admin/dashboard' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
    { icon: Wallet, label: 'Comptes', path: '/admin/accounts' },
    { icon: History, label: 'Transactions', path: '/admin/transactions' },
    { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : clientMenuItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 
        transform transition-transform duration-300 ease-in-out
        bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border
        lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* En-tête du sidebar mobile */}
          <div className="h-16 px-4 flex items-center justify-between lg:hidden">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              BankApp
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-bg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className={`
                    flex items-center w-full px-4 py-2 text-sm font-medium rounded-md
                    ${isActive 
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Déconnexion */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-border">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;