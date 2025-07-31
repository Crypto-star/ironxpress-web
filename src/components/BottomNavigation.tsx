import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  BellIcon, 
  UserIcon 
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  BellIcon as BellIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid'

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const { cartCount } = useCart()

  const navItems = [
    {
      key: 'home',
      label: t('common.home'),
      path: '/',
      icon: HomeIcon,
      activeIcon: HomeIconSolid
    },
    {
      key: 'cart',
      label: t('common.cart'),
      path: '/cart',
      icon: ShoppingCartIcon,
      activeIcon: ShoppingCartIconSolid,
      badge: cartCount > 0 ? cartCount : undefined
    },
    {
      key: 'notifications',
      label: t('common.notifications'),
      path: '/notifications',
      icon: BellIcon,
      activeIcon: BellIconSolid
    },
    {
      key: 'profile',
      label: t('common.profile'),
      path: '/profile',
      icon: UserIcon,
      activeIcon: UserIconSolid
    }
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = isActive ? item.activeIcon : item.icon
          
          return (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${
                isActive ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation
