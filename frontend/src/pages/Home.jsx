import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Shield, CreditCard, ArrowRight, Landmark, Lock, Users } from 'lucide-react'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const features = [
    {
      icon: <CreditCard className="w-8 h-8 text-primary-500" />,
      title: 'Gestion de Compte',
      description: 'Créez et gérez facilement vos comptes bancaires en ligne'
    },
    {
      icon: <Landmark className="w-8 h-8 text-primary-500" />,
      title: 'Transactions Sécurisées',
      description: 'Effectuez des dépôts et retraits en toute sécurité'
    },
    {
      icon: <Lock className="w-8 h-8 text-primary-500" />,
      title: 'Protection Maximale',
      description: 'Vos données sont protégées avec les dernières technologies de sécurité'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Hero Section */}
      <div className="relative bg-white dark:bg-dark-card overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white dark:bg-dark-card sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">Votre banque</span>
                  <span className="block text-primary-600">100% en ligne</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Gérez vos comptes bancaires en toute simplicité. Effectuez vos opérations
                  en quelques clics, où que vous soyez.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => navigate(user ? '/dashboard' : '/register')}
                      className="w-full flex items-center justify-center px-8 py-3 
                               border border-transparent text-base font-medium rounded-md 
                               text-white bg-primary-600 hover:bg-primary-700 md:py-4 
                               md:text-lg md:px-10"
                    >
                      {user ? 'Accéder à mon compte' : 'Créer un compte'}
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => navigate(user ? '/dashboard' : '/login')}
                      className="w-full flex items-center justify-center px-8 py-3 
                               border border-transparent text-base font-medium rounded-md 
                               text-primary-700 bg-primary-100 hover:bg-primary-200 
                               md:py-4 md:text-lg md:px-10"
                    >
                      {user ? 'Tableau de bord' : 'Se connecter'}
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white dark:bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
              Fonctionnalités
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight 
                         text-gray-900 dark:text-white sm:text-4xl">
              Une meilleure façon de gérer votre argent
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 
                                rounded-md bg-primary-500 text-white">
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium 
                               text-gray-900 dark:text-white">
                    {feature.title}
                  </p>
                  <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home