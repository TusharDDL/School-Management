'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth'
import communicationService from '@/services/communication'
import { MessageList } from './components/message-list'
import { MessageThread } from './components/message-thread'
import { ComposeMessageDialog } from './components/compose-message-dialog'

export default function MessagesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedThread, setSelectedThread] = useState<number | null>(null)

  const { data: messages } = useQuery({
    queryKey: ['messages'],
    queryFn: communicationService.getMessages,
  })

  // Group messages by thread (conversation between two users)
  const threads = messages?.reduce((acc, message) => {
    const otherUser =
      message.sender.id === user?.id ? message.recipient : message.sender
    const threadId = [message.sender.id, message.recipient.id]
      .sort()
      .join('-')

    if (!acc[threadId]) {
      acc[threadId] = {
        id: threadId,
        otherUser,
        messages: [],
        lastMessage: null,
        unreadCount: 0,
      }
    }

    acc[threadId].messages.push(message)
    if (!acc[threadId].lastMessage || 
        new Date(message.created_at) > new Date(acc[threadId].lastMessage.created_at)) {
      acc[threadId].lastMessage = message
    }
    if (!message.is_read && message.recipient.id === user?.id) {
      acc[threadId].unreadCount++
    }

    return acc
  }, {} as Record<string, {
    id: string
    otherUser: any
    messages: typeof messages
    lastMessage: typeof messages[0] | null
    unreadCount: number
  }>)

  const filteredThreads = Object.values(threads || {}).filter((thread) => {
    const otherUser = thread.otherUser
    return (
      otherUser.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      otherUser.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.messages.some((message) =>
        message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }).sort((a, b) => {
    if (!a.lastMessage || !b.lastMessage) return 0
    return new Date(b.lastMessage.created_at).getTime() - 
           new Date(a.lastMessage.created_at).getTime()
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <ComposeMessageDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="space-y-4">
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="bg-white rounded-lg shadow">
            <MessageList
              threads={filteredThreads}
              selectedThread={selectedThread}
              onSelectThread={setSelectedThread}
            />
          </div>
        </div>

        {/* Message Thread */}
        <div className="md:col-span-2">
          {selectedThread ? (
            <MessageThread
              thread={threads?.[selectedThread]}
              onClose={() => setSelectedThread(null)}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
