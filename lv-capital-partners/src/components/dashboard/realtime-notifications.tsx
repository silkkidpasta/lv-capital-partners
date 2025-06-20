'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useUser } from '@clerk/nextjs'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Bell,
  Building,
  CheckCircle,
  DollarSign,
  Eye,
  EyeOff,
  FileText,
  TrendingUp,
  X
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface Notification {
  id: string
  type: 'distribution' | 'performance' | 'document' | 'investment' | 'alert' | 'update'
  title: string
  message: string
  amount?: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  timestamp: Date
  read: boolean
  actionUrl?: string
  metadata?: Record<string, unknown>
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getNotificationIcon = (type: string, priority: string) => {
  const iconClass = `w-5 h-5 ${
    priority === 'urgent' ? 'text-red-500' :
    priority === 'high' ? 'text-orange-500' :
    priority === 'medium' ? 'text-blue-500' :
    'text-gray-500'
  }`

  switch (type) {
    case 'distribution':
      return <DollarSign className={iconClass} />
    case 'performance':
      return <TrendingUp className={iconClass} />
    case 'investment':
      return <Building className={iconClass} />
    case 'document':
      return <FileText className={iconClass} />
    case 'alert':
      return <AlertCircle className={iconClass} />
    default:
      return <Bell className={iconClass} />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500'
    case 'high':
      return 'bg-orange-500'
    case 'medium':
      return 'bg-blue-500'
    default:
      return 'bg-gray-500'
  }
}

export function RealtimeNotifications() {
  const { user } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [showNotifications, setShowNotifications] = useState(true)

  // Simulate real-time notifications for demo
  useEffect(() => {
    if (!user) return

    // Initial notifications
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'distribution',
        title: 'Quarterly Distribution',
        message: 'Q4 2024 distribution from Manhattan Luxury Tower has been processed',
        amount: 12500,
        priority: 'high',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        actionUrl: '/dashboard?tab=distributions'
      },
      {
        id: '2',
        type: 'performance',
        title: 'Portfolio Update',
        message: 'Your portfolio value increased by 2.3% this month',
        priority: 'medium',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        actionUrl: '/dashboard?tab=analytics'
      }
    ]

    setNotifications(initialNotifications)
    setUnreadCount(initialNotifications.filter(n => !n.read).length)
    setIsConnected(true)

    // Simulate periodic new notifications
    const intervalId = setInterval(() => {
      const randomNotifications: Partial<Notification>[] = [
        {
          type: 'distribution',
          title: 'Distribution Processed',
          message: 'Monthly distribution from Austin Tech Campus',
          amount: Math.floor(Math.random() * 5000) + 2000,
          priority: 'high'
        },
        {
          type: 'performance',
          title: 'Portfolio Performance',
          message: `Your portfolio performance updated: ${(Math.random() * 4 + 1).toFixed(1)}% this week`,
          priority: 'medium'
        }
      ]

      // 20% chance to add a new notification every 30 seconds
      if (Math.random() < 0.2) {
        const template = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: template.type as Notification['type'],
          title: template.title || 'New Update',
          message: template.message || 'Portfolio update available',
          amount: template.amount,
          priority: template.priority as Notification['priority'],
          timestamp: new Date(),
          read: false,
          actionUrl: '/dashboard'
        }

        setNotifications(prev => [newNotification, ...prev.slice(0, 9)])
        setUnreadCount(prev => prev + 1)
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(intervalId)
  }, [user])

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
    setUnreadCount(0)
  }

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    const notification = notifications.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (!showNotifications) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(true)}
        className="relative"
      >
        <EyeOff className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
        <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </Button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 z-50"
          >
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNotifications(false)}
                    >
                      <EyeOff className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsExpanded(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="w-fit text-xs"
                  >
                    Mark all as read
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-80">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 hover:bg-muted/20 transition-colors border-l-4 ${
                            notification.read ? 'border-transparent' : `border-l-4 ${getPriorityColor(notification.priority)}`
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type, notification.priority)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className={`text-sm font-medium ${
                                    notification.read ? 'text-muted-foreground' : 'text-foreground'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {notification.message}
                                  </p>
                                  {notification.amount && (
                                    <p className="text-sm font-semibold text-green-600 mt-1">
                                      {formatCurrency(notification.amount)}
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {formatTimeAgo(notification.timestamp)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => markAsRead(notification.id)}
                                      className="p-1 h-6 w-6"
                                    >
                                      <CheckCircle className="w-3 h-3" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => dismissNotification(notification.id)}
                                    className="p-1 h-6 w-6"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                              {notification.actionUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 h-6 text-xs"
                                  onClick={() => {
                                    if (notification.actionUrl) {
                                      window.location.href = notification.actionUrl
                                    }
                                    markAsRead(notification.id)
                                  }}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View Details
                                </Button>
                              )}
                            </div>
                          </div>
                          {index < notifications.length - 1 && (
                            <Separator className="mt-4" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {notifications.length > 0 && (
                  <>
                    <Separator />
                    <div className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center text-xs"
                        onClick={() => {
                          window.location.href = '/dashboard/notifications'
                          setIsExpanded(false)
                        }}
                      >
                        View All Notifications
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
