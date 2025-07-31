import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import BottomNavigation from '../components/BottomNavigation'
import { 
  ArrowLeftIcon,
  BellIcon,
  CheckIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
  type: 'order' | 'promotion' | 'system'
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    
    // Simulate loading notifications
    setTimeout(() => {
      setNotifications([
        {
          id: '1',
          title: 'Order Confirmed',
          message: 'Your order #12345 has been confirmed and will be picked up soon.',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          type: 'order'
        },
        {
          id: '2',
          title: 'Special Offer',
          message: 'Get 20% off on your next order! Use code SAVE20',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: true,
          type: 'promotion'
        },
        {
          id: '3',
          title: 'Order Delivered',
          message: 'Your order #12344 has been delivered successfully.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true,
          type: 'order'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [user, navigate])

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.read
  )

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📦'
      case 'promotion':
        return '🎉'
      case 'system':
        return '⚙️'
      default:
        return '🔔'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else {
      return `${days}d ago`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <div className="bg-white shadow-sm px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Notifications</h1>
              <p className="text-sm text-gray-500">
                {filteredNotifications.filter(n => !n.read).length} unread
              </p>
            </div>
          </div>
          
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="text-primary-600 text-sm font-medium hover:text-primary-700"
            >
              Mark all read
            </button>
          )}
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-primary-100 text-primary-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {filteredNotifications.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <BellIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? 'All caught up! Check back later for updates.'
                : 'We\'ll notify you when something important happens.'}
            </p>
          </div>
        ) : (
          /* Notifications List */
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl border p-4 transition-all ${
                  notification.read 
                    ? 'border-gray-200' 
                    : 'border-primary-200 bg-primary-50/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon */}
                  <div className="text-2xl flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium mb-1 ${
                          notification.read ? 'text-gray-800' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className={`text-sm mb-2 ${
                          notification.read ? 'text-gray-600' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 text-primary-600 hover:bg-primary-100 rounded-full transition-colors"
                            title="Mark as read"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  )
}

export default NotificationsPage
