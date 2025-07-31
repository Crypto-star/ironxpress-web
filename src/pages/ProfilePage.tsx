import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import BottomNavigation from '../components/BottomNavigation'
import { 
  ArrowLeftIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      setLoading(true)
      await signOut()
      toast.success('Signed out successfully')
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    } finally {
      setLoading(false)
    }
  }

  const menuItems = [
    {
      id: 'orders',
      title: 'My Orders',
      description: 'View your order history',
      icon: DocumentTextIcon,
      action: () => navigate('/orders')
    },
    {
      id: 'addresses',
      title: 'Manage Addresses',
      description: 'Add or edit delivery addresses',
      icon: MapPinIcon,
      action: () => navigate('/addresses')
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Notification and app preferences',
      icon: CogIcon,
      action: () => navigate('/settings')
    },
    {
      id: 'support',
      title: 'Help & Support',
      description: 'Get help with your orders',
      icon: QuestionMarkCircleIcon,
      action: () => navigate('/support')
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      description: 'Read our terms of service',
      icon: ShieldCheckIcon,
      action: () => navigate('/terms')
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'How we handle your data',
      icon: ShieldCheckIcon,
      action: () => navigate('/privacy')
    },
    {
      id: 'about',
      title: 'About Us',
      description: 'Learn more about IronXpress',
      icon: QuestionMarkCircleIcon,
      action: () => navigate('/about')
    }
  ]

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <UserCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Please sign in</h3>
          <p className="text-gray-500 mb-6">Sign in to access your profile and order history</p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">Profile</h1>
            <p className="text-sm text-gray-500">Manage your account</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* User Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <UserCircleIcon className="h-10 w-10 text-primary-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {user.user_metadata?.full_name || 'User'}
              </h2>
              <div className="space-y-1 mt-2">
                {user.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full bg-white rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              </button>
            )
          })}
        </div>

        {/* Sign Out Button */}
        <div className="mt-8">
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full bg-red-50 border border-red-200 text-red-600 py-4 rounded-xl font-medium hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">IronXpress</p>
          <p className="text-xs text-gray-400 mt-1">Version 1.0.0</p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

export default ProfilePage
