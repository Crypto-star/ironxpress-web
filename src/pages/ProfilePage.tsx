import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage, Language } from '../contexts/LanguageContext'
import BottomNavigation from '../components/BottomNavigation'
import toast from 'react-hot-toast'
import {
  UserIcon,
  PhoneIcon,
  LanguageIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()
  
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const languages = [
    { code: 'en' as Language, name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    { code: 'or' as Language, name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🏳️' }
  ]

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setShowLanguageModal(false)
    toast.success('Language updated successfully!')
  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      await signOut()
      toast.success('Logged out successfully!')
      navigate('/auth')
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Failed to logout')
    } finally {
      setLoading(false)
    }
  }

  const menuItems = [
    {
      icon: LanguageIcon,
      title: t('profile.language_preference'),
      subtitle: languages.find(l => l.code === language)?.nativeName,
      action: () => setShowLanguageModal(true)
    },
    {
      icon: QuestionMarkCircleIcon,
      title: t('profile.support'),
      subtitle: 'Get help and contact us',
      action: () => navigate('/support')
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-electric-600 px-4 pt-12 pb-6">
        <h1 className="text-white text-2xl font-bold">{t('common.profile')}</h1>
        <p className="text-white/80">Manage your account and preferences</p>
      </div>

      <div className="p-4 -mt-4">
        {/* User Info Card */}
        <div className="card mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-electric-500 rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {user?.user_metadata?.full_name || 'User'}
              </h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <PhoneIcon className="h-4 w-4" />
                <span className="text-sm">{user?.phone || 'Not available'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary-50 to-electric-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-1">{t('profile.personal_info')}</h3>
            <p className="text-sm text-gray-600">
              Your account information is secured and encrypted
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3 mb-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.action}
              className="card w-full text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.subtitle}</p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>

        {/* App Info */}
        <div className="card mb-6 bg-gray-50">
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-2">{t('app.name')}</h3>
            <p className="text-sm text-gray-600 mb-2">Version 1.0.0</p>
            <p className="text-xs text-gray-500">
              Your trusted partner for professional ironing services
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="font-medium">
            {loading ? 'Logging out...' : t('common.logout')}
          </span>
        </button>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('home.select_language')}
              </h3>
              
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      language === lang.code
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{lang.flag}</span>
                      <div>
                        <p className="font-medium">{lang.nativeName}</p>
                        <p className="text-sm text-gray-600">{lang.name}</p>
                      </div>
                      {language === lang.code && (
                        <div className="ml-auto w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowLanguageModal(false)}
                className="btn-secondary w-full mt-4"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  )
}

export default ProfilePage
