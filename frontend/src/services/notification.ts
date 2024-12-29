import axiosInstance from '@/lib/axios'

export interface NotificationPreferences {
  id: number
  user_id: number
  email_notifications: boolean
  push_notifications: boolean
  announcement_notifications: boolean
  message_notifications: boolean
  assignment_notifications: boolean
  assessment_notifications: boolean
  attendance_notifications: boolean
  fee_notifications: boolean
}

const notificationService = {
  // Notification Preferences
  async getNotificationPreferences() {
    const response = await axiosInstance.get('/api/notifications/preferences/')
    return response.data
  },

  async updateNotificationPreferences(data: Partial<NotificationPreferences>) {
    const response = await axiosInstance.patch('/api/notifications/preferences/', data)
    return response.data
  },

  // Web Push Notifications
  async subscribeToPushNotifications(subscription: PushSubscription) {
    const response = await axiosInstance.post('/api/notifications/push/subscribe/', {
      subscription: subscription.toJSON(),
    })
    return response.data
  },

  async unsubscribeFromPushNotifications(subscription: PushSubscription) {
    const response = await axiosInstance.post('/api/notifications/push/unsubscribe/', {
      subscription: subscription.toJSON(),
    })
    return response.data
  },

  // Email Notifications
  async verifyEmailForNotifications(email: string) {
    const response = await axiosInstance.post('/api/notifications/email/verify/', {
      email,
    })
    return response.data
  },

  async confirmEmailVerification(token: string) {
    const response = await axiosInstance.post('/api/notifications/email/confirm/', {
      token,
    })
    return response.data
  },

  // Service Worker Registration
  async registerServiceWorker() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered:', registration)

        // Request notification permission
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          })
          await this.subscribeToPushNotifications(subscription)
        }

        return registration
      } catch (error) {
        console.error('Service Worker registration failed:', error)
        throw error
      }
    }
    throw new Error('Push notifications not supported')
  },

  async unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await this.unsubscribeFromPushNotifications(subscription)
        await subscription.unsubscribe()
      }
      await registration.unregister()
    }
  },
}

export default notificationService