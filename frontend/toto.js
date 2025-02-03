

// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ActivateAccount from './pages/auth/ActivateAccount';
import AdminRoutes from './routes/AdminRoutes';
import ClientRoutes from './routes/ClientRoutes';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/activate" element={<ActivateAccount />} />

            {/* Routes Admin */}
            <Route path="/admin" element={<AdminRoutes />}>
              <Route index element={<AdminDashboard />} />
              <Route path="accounts" element={<AccountManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* Routes Client */}
            <Route path="/client" element={<ClientRoutes />}>
              <Route index element={<ClientDashboard />} />
              <Route path="accounts" element={<MyAccounts />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;





// Suite de AccountList.jsx - Ajout des actions
const AccountList = () => {
  // ... code précédent ...

  const renderAccountActions = (account) => (
    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
      <div className="flex justify-end gap-2">
        {account.status === 'actif' && (
          <>
            <button
              onClick={() => navigate(`/deposit/${account.id}`)}
              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Dépôt
            </button>
            <button
              onClick={() => navigate(`/withdraw/${account.id}`)}
              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Retrait
            </button>
          </>
        )}
        <button
          onClick={() => navigate(`/transactions/${account.id}`)}
          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Historique
        </button>
      </div>
    </td>
  );

  return (
    // ... reste du code ...
    <tbody>
      {accounts.map((account) => (
        <tr key={account.id}>
          {/* ... autres cellules ... */}
          {renderAccountActions(account)}
        </tr>
      ))}
    </tbody>
    // ... reste du code ...
  );
};



  

































































// Mise à jour de services/auth.js pour ajouter les nouvelles méthodes
export const authService = {
  // ... autres méthodes existantes ...

  async requestPasswordReset(data) {
    const response = await axios.post(`${API_URL}/auth/request-password-reset`, data)
    return response.data
  },

  async resetPassword(data) {
    const response = await axios.post(`${API_URL}/auth/reset-password`, data)
    return response.data
  }
}
