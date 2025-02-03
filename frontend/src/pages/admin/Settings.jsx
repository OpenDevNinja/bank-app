import React, { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';

const Settings = () => {
  // Données statiques initiales
  const defaultSettings = {
    maintenanceMode: false,
    allowNewRegistrations: true,
    maxDailyTransactions: 1000,
    minTransactionAmount: 1,
    maxTransactionAmount: 10000,
    systemEmail: 'system@example.com',
    supportEmail: 'support@example.com',
    notificationEnabled: true
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);
    
    // Simuler une sauvegarde réussie
    setTimeout(() => {
      setSuccess(true);
      setError(null);
    }, 500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Paramètres Système
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Paramètres sauvegardés avec succès
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Paramètres Généraux
            </h3>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="maintenanceMode" className="text-gray-700 dark:text-gray-300">
                Mode Maintenance
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="allowNewRegistrations"
                name="allowNewRegistrations"
                checked={settings.allowNewRegistrations}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="allowNewRegistrations" className="text-gray-700 dark:text-gray-300">
                Autoriser les nouvelles inscriptions
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="notificationEnabled"
                name="notificationEnabled"
                checked={settings.notificationEnabled}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="notificationEnabled" className="text-gray-700 dark:text-gray-300">
                Activer les notifications
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Limites des Transactions
            </h3>
            
            <div className="space-y-2">
              <label htmlFor="maxDailyTransactions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre maximum de transactions par jour
              </label>
              <input
                type="number"
                id="maxDailyTransactions"
                name="maxDailyTransactions"
                value={settings.maxDailyTransactions}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="minTransactionAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Montant minimum par transaction (€)
              </label>
              <input
                type="number"
                id="minTransactionAmount"
                name="minTransactionAmount"
                value={settings.minTransactionAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="maxTransactionAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Montant maximum par transaction (€)
              </label>
              <input
                type="number"
                id="maxTransactionAmount"
                name="maxTransactionAmount"
                value={settings.maxTransactionAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Configuration des Emails
          </h3>
          
          <div className="space-y-2">
            <label htmlFor="systemEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Système
            </label>
            <input
              type="email"
              id="systemEmail"
              name="systemEmail"
              value={settings.systemEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Support
            </label>
            <input
              type="email"
              id="supportEmail"
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t dark:border-gray-700">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réinitialiser
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;