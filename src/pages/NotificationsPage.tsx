import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import BottomNavigation from '../components/BottomNavigation'
import { BellIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface Notification {
  id: string
  title: string
  body: string
  type: 'order' | 'promotion' | 'general'
  isRead: boolean
  createdAt: string
}

const NotificationsPage: React.FC = () => {
  const { t } = useLanguage()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Order Confirmed',
        body: 'Your order IX1640995200 has been confirmed and will be picked up tomorrow.',
        type: 'order',
        isRead: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Special Offer!',
        body: 'Get 20% off on your next order. Use code IRON20',
        type: 'promotion',
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'Service Update',
        body: 'We have added new Steam Iron service to our offerings.',
        type: 'general',
        isRead: true,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    setTimeout(() => {
      setNotifications(mockNotifications)
      setLoading(false)
    }, 1000)
  }, [])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📦'
      case 'promotion':
        return '🎉'
      default:
        return '📢'
    }
  }

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-electric-600 px-4 pt-12 pb-6">
        <h1 className="text-white text-2xl font-bold">{t('common.notifications')}</h1>
        <p className="text-white/80">Stay updated with your orders</p>
      </div>

      <div className="p-4 -mt-4">
        {notifications.length === 0 ? (
          /* Empty State */
          <div className="card text-center py-12">
            <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No notifications yet</h3>
            <p className="text-gray-500">We'll notify you about your orders and special offers</p>
          </div>
        ) : (
          /* Notifications List */
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                className={`card p-4 cursor-pointer transition-all ${
                  !notification.isRead 
                    ? 'border-l-4 border-l-primary-500 bg-primary-50' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl flex-shrink-0">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`font-medium ${
                        !notification.isRead ? 'text-gray-900' : 'text-gray-800'
                      }`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    
                    <p className={`text-sm leading-relaxed ${
                      !notification.isRead ? 'text-gray-700' : 'text-gray-600'
                    }`}>
                      {notification.body}
                    </p>
                    
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="card mt-6 p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">About Notifications</h3>
              <p className="text-sm text-blue-800">
                We'll send you important updates about your orders, special offers, and service announcements.
                You can manage your notification preferences in your profile settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}

export default NotificationsPage
