import axiosInstance from '@/lib/axios'
import { User } from './auth'

export interface Announcement {
  id: number
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
  author: User
  target_roles: string[]
  target_classes: {
    id: number
    name: string
  }[]
  target_sections: {
    id: number
    name: string
    class_name: {
      id: number
      name: string
    }
  }[]
  attachment: string | null
  is_active: boolean
  created_at: string
}

export interface Message {
  id: number
  sender: User
  recipient: User
  subject: string
  content: string
  attachment: string | null
  is_read: boolean
  created_at: string
}

export interface Notification {
  id: number
  title: string
  message: string
  notification_type: string
  recipient: User
  is_read: boolean
  content_type: string | null
  object_id: number | null
  created_at: string
}

const communicationService = {
  // Announcements
  async getAnnouncements(params?: { section?: number }) {
    const response = await axiosInstance.get('/api/communication/announcements/', {
      params,
    })
    return response.data
  },

  async createAnnouncement(data: FormData) {
    const response = await axiosInstance.post(
      '/api/communication/announcements/',
      data
    )
    return response.data
  },

  async updateAnnouncement(id: number, data: FormData) {
    const response = await axiosInstance.patch(
      `/api/communication/announcements/${id}/`,
      data
    )
    return response.data
  },

  async deleteAnnouncement(id: number) {
    await axiosInstance.delete(`/api/communication/announcements/${id}/`)
  },

  // Messages
  async getMessages() {
    const response = await axiosInstance.get('/api/communication/messages/')
    return response.data
  },

  async sendMessage(data: FormData) {
    const response = await axiosInstance.post(
      '/api/communication/messages/',
      data
    )
    return response.data
  },

  async markMessageAsRead(id: number) {
    const response = await axiosInstance.post(
      `/api/communication/messages/${id}/mark_read/`
    )
    return response.data
  },

  async deleteMessage(id: number) {
    await axiosInstance.delete(`/api/communication/messages/${id}/`)
  },

  // Notifications
  async getNotifications() {
    const response = await axiosInstance.get('/api/communication/notifications/')
    return response.data
  },

  async markNotificationAsRead(id: number) {
    const response = await axiosInstance.post(
      `/api/communication/notifications/${id}/mark_read/`
    )
    return response.data
  },

  async markAllNotificationsAsRead() {
    const response = await axiosInstance.post(
      '/api/communication/notifications/mark_all_read/'
    )
    return response.data
  },

  async deleteNotification(id: number) {
    await axiosInstance.delete(`/api/communication/notifications/${id}/`)
  },
}

export default communicationService