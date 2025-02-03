import { Menu, Sun, Moon, Bell } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Header = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  const { user, logout } = useAuth()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)
  const navigate = useNavigate()

  // Fermer le menu profile quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-dark-card
                     border-b dark:border-dark-border z-50">
      <div className="h-full flex items-center justify-between px-4">
        {/* Partie gauche */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg
                     text-gray-600 dark:text-gray-400 md:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text">
            BankApp
          </h1>
        </div>

        {/* Partie droite */}
        <div className="flex items-center space-x-4">
          {/* Bouton thème */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg
                     text-gray-600 dark:text-gray-400"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg
                          text-gray-600 dark:text-gray-400 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100
                       dark:hover:bg-dark-bg"
            >
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center
                          justify-center text-white font-medium">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:block text-sm text-gray-700 dark:text-gray-300">
                {user?.username}
              </span>
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-card
                           rounded-lg shadow-lg border dark:border-dark-border py-1">
                <div className="px-4 py-2 border-b dark:border-dark-border">
                  <p className="text-sm font-medium text-gray-900 dark:text-dark-text">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role === 'admin' ? 'Administrateur' : 'Client'}
                  </p>
                </div>

                <a
                  href="#profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                          hover:bg-gray-100 dark:hover:bg-dark-bg"
                >
                  Mon profil
                </a>

                <a
                  href="#settings"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300
                          hover:bg-gray-100 dark:hover:bg-dark-bg"
                >
                  Paramètres
                </a>

                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600
                          hover:bg-gray-100 dark:hover:bg-dark-bg"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header