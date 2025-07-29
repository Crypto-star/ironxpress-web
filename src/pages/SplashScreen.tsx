import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

const SplashScreen: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user } = useAuth()

  const messages = [
    t('splash.plugging'),
    t('splash.notifications'),
    t('splash.optimization'),
    t('splash.temperature'),
    t('splash.ready')
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1
        }
        return prev
      })
      setProgress((prev) => prev + 20)
    }, 2000)

    const timer = setTimeout(() => {
      clearInterval(interval)
      // Redirect based on auth status
      if (user) {
        navigate('/home')
      } else {
        navigate('/auth')
      }
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [navigate, user, messages.length])

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* App Logo/Icon */}
        <div className="relative mb-8">
          {/* Iron Icon with Glow Effect */}
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 iron-glow rounded-full animate-pulse-glow"></div>
            <div className="relative bg-gradient-to-br from-gray-600 to-gray-800 w-32 h-32 rounded-lg shadow-2xl flex items-center justify-center animate-float">
              {/* Iron Shape */}
              <div className="relative">
                <div className="w-16 h-20 bg-gradient-to-b from-gray-400 to-gray-600 rounded-t-lg relative">
                  {/* Iron Handle */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gradient-to-b from-gray-500 to-gray-700 rounded-t-full"></div>
                  {/* Iron Plate */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gradient-to-b from-gray-500 to-gray-700 rounded-b-full"></div>
                  {/* Steam Effects */}
                  <div className="absolute -top-8 left-2 w-1 h-6 bg-white/60 rounded-full animate-steam"></div>
                  <div className="absolute -top-8 left-6 w-1 h-6 bg-white/60 rounded-full animate-steam delay-300"></div>
                  <div className="absolute -top-8 left-10 w-1 h-6 bg-white/60 rounded-full animate-steam delay-700"></div>
                  {/* Spark Effects */}
                  <div className="absolute top-4 right-1 w-1 h-1 bg-yellow-400 rounded-full animate-spark"></div>
                  <div className="absolute top-8 right-2 w-1 h-1 bg-yellow-400 rounded-full animate-spark delay-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-bold text-white mb-8 text-center animate-fade-in">
          {t('app.name')}
        </h1>

        {/* Loading Messages */}
        <div className="h-6 mb-8">
          <p className="text-white text-lg text-center animate-fade-in key={currentMessage}">
            {messages[currentMessage]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mb-8">
          <div 
            className="h-full bg-gradient-to-r from-white to-primary-200 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Circular Progress Loader */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 left-0 right-0">
        <p className="text-white/70 text-center text-sm">
          Powered by IronXpress Technology
        </p>
      </div>
    </div>
  )
}

export default SplashScreen
