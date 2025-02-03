import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  CreditCard, Landmark, Lock, ArrowRight, ShieldCheck, 
  Wallet, TrendingUp, PhoneCall, HeartHandshake 
} from 'lucide-react'
import HomeCarousel from '../components/HomeCarousel'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      image: "https://illustrations.undraw.co/money-house",
      title: "Votre Finances, Votre Liberté",
      subtitle: "Gérez vos comptes avec élégance et simplicité"
    },
    {
      image: "https://illustrations.undraw.co/digital-banking",
      title: "Bancaire 100% Mobile",
      subtitle: "Vos services bancaires dans votre poche"
    },
    {
      image: "https://illustrations.undraw.co/financial-data",
      title: "Sécurité Maximale",
      subtitle: "Protection de vos données en temps réel"
    }
  ]

  const features = [
    {
      icon: <CreditCard className="w-8 h-8 text-white" />,
      title: 'Gestion de Compte',
      description: 'Contrôle total de vos finances numériques'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      title: 'Transactions Sécurisées',
      description: 'Protocoles de sécurité de dernière génération'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      title: 'Investissements',
      description: 'Opportunités d\'investissement personnalisées'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-dark-bg dark:to-dark-bg"
    >
      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 min-h-screen items-center max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 lg:pr-12"
        >
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Votre Banque</span>
            <span className="block text-primary-600">Numérique Moderne</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Une expérience bancaire fluide, sécurisée et intuitive. 
            Gérez vos finances avec une simplicité révolutionnaire.
          </p>
          
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="flex items-center justify-center px-8 py-3 
                         text-white bg-primary-600 rounded-xl 
                         shadow-lg hover:shadow-xl transition-all"
            >
              {user ? 'Mon Tableau de Bord' : 'Créer un Compte'}
              <ArrowRight className="ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="flex items-center justify-center px-8 py-3 
                         text-primary-600 bg-primary-100 rounded-xl 
                         hover:bg-primary-200 transition-all"
            >
              Se connecter
              <ArrowRight className="ml-2" />
            </motion.button>
          </div>
        </motion.div>

        {/* Right Carousel */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
          <HomeCarousel />
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-dark-card py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Nos Fonctionnalités Principales
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Découvrez les innovations qui transforment votre expérience bancaire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-primary-100 dark:bg-dark-bg p-6 rounded-xl 
                           flex flex-col items-center text-center 
                           transform transition-all hover:shadow-xl"
              >
                <div className="bg-primary-500 p-4 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Home