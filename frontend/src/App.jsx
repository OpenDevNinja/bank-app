import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import CreateAccount from './pages/CreateAccount'
import AccountDetails from './pages/AccountDetails'

import Layout from './components/layout/Layout'
import DeactivatedAccounts from './pages/admin/DeactivatedAccounts'
import AccountList from './components/accounts/AccountList'
import { AdminRoute, PrivateRoute } from './routes/PrivateRoute'
import ActivateAccount from './pages/auth/ActivateAccount'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import AdminDashboard from './pages/admin/AdminDashboard'
import MyAccounts from './pages/client/MyAccounts'
import TransactionList from './pages/client/TransactionList'

import UserManagement from './pages/admin/UserManagement'
import AccountManagement from './pages/admin/AccountManagement'
import TransactionManagement from './pages/admin/TransactionManagement'
import Settings from './pages/admin/Settings'

// Composant principal de l'application
const App = () => {
  // État pour gérer le thème (dark/light)
  const [darkMode, setDarkMode] = useState(false)

  // Effet pour charger le thème depuis le localStorage
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Fonction pour basculer le thème
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev
      localStorage.setItem('darkMode', newMode)
      document.documentElement.classList.toggle('dark')
      return newMode
    })
  }

  return (
    <AuthProvider>
      <Router>
        <div className={`min-h-screen bg-gray-50 dark:bg-dark-bg 
                        transition-colors duration-300`}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/activate" element={<ActivateAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />


            {/* Routes protégées */}
            <Route element={<Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}>
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/account/:id" element={<AccountDetails />} />
                <Route path="/account" element={<MyAccounts />} />
                <Route path="/transactions" element={<TransactionList />} />
              </Route>

              {/* Routes Admin */}
              <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/accounts" element={<AccountList />} />
                <Route path="/admin/deactivated" element={<DeactivatedAccounts />} />
                <Route path="/admin/accounts/" element={<AccountManagement />} />
                <Route path="/admin/users/" element={<UserManagement />} />
                <Route path="/admin/transactions/" element={<TransactionManagement />} />
                <Route path="/admin/settings" element={<Settings />} />
                

              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App