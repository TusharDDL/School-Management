'use client'

import { format } from 'date-fns'
import { Message } from '@/services/communication'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface MessageListProps {
  threads: {
    id: string
    otherUser: any
    messages: Message[]
    lastMessage: Message | null
    unreadCount: number
  }[]
  selectedThread: string | null
  onSelectThread: (threadId: string) => void
}

export function MessageList({
  threads,
  selectedThread,
  onSelectThread,
}: MessageListProps) {
  if (threads.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No messages found
      </div>
    )
  }

  return (
    <div className="divide-y">
      {threads.map((thread) => (
        <button
          key={thread.id}
          onClick={() => onSelectThread(thread.id)}
          className={cn(
            'w-full text-left p-4 hover:bg-gray-50 transition-colors',
            selectedThread === thread.id && 'bg-gray-50'
          )}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">
                {thread.otherUser.first_name} {thread.otherUser.last_name}
              </h3>
              <p className="text-sm text-gray-500">
                {thread.otherUser.role.replace('_', ' ')}
              </p>
            </div>
            {thread.unreadCount > 0 && (
              <Badge>{thread.unreadCount}</Badge>
            )}
          </div>
          {thread.lastMessage && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {thread.lastMessage.subject}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {thread.lastMessage.content}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {format(
                  new Date(thread.lastMessage.created_at),
                  'MMM d, h:mm a'
                )}
              </p>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
