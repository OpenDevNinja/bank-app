import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  ArrowRight, Lock, Wallet, TrendingUp 
} from 'lucide-react'

const HomeCarousel = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      icon: <Wallet className="w-16 h-16 text-primary-600" />,
      title: "Transformez Vos Finances en Opportunités",
      subtitle: "Découvrez une gestion bancaire qui propulse votre patrimoine vers de nouveaux sommets",
      benefits: [
        "Stratégies d'investissement personnalisées",
        "Croissance financière garantie",
        "Conseil expert à chaque étape"
      ]
    },
    {
      icon: <Lock className="w-16 h-16 text-primary-600" />,
      title: "Sécurité Absolue, Tranquillité Totale",
      subtitle: "La technologie de pointe protège chaque transaction, chaque centime",
      benefits: [
        "Cryptage bancaire de nouvelle génération",
        "Surveillance 24/7 contre la fraude",
        "Protection remboursement garanti"
      ]
    },
    {
      icon: <TrendingUp className="w-16 h-16 text-primary-600" />,
      title: "Votre Argent, Votre Liberté",
      subtitle: "Une banque mobile qui s'adapte à votre vie, pas l'inverse",
      benefits: [
        "Gestion instantanée depuis votre smartphone",
        "Comptes 100% flexibles",
        "Zéro contrainte, 100% de contrôle"
      ]
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5 }}
          className="w-full space-y-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            {heroSlides[currentSlide].icon}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {heroSlides[currentSlide].title}
            </h2>
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {heroSlides[currentSlide].subtitle}
          </p>
          
          <ul className="space-y-3 mb-8">
            {heroSlides[currentSlide].benefits.map((benefit, index) => (
              <li 
                key={index} 
                className="flex items-center space-x-3 text-lg text-gray-700 dark:text-gray-200"
              >
                <ArrowRight className="text-primary-600" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          
          
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default HomeCarousel