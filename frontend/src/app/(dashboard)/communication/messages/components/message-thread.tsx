'use client'

import { useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Message } from '@/services/communication'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X } from 'lucide-react'
import communicationService from '@/services/communication'

interface MessageThreadProps {
  thread: {
    id: string
    otherUser: any
    messages: Message[]
    lastMessage: Message | null
    unreadCount: number
  }
  onClose: () => void
}

const replySchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Message is required'),
  file: z.any().optional(),
})

type ReplyFormData = z.infer<typeof replySchema>

export function MessageThread({ thread, onClose }: MessageThreadProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const form = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      subject: thread.lastMessage?.subject.startsWith('Re:')
        ? thread.lastMessage.subject
        : `Re: ${thread.lastMessage?.subject || ''}`,
      content: '',
    },
  })

  const { mutate: sendMessage, isLoading } = useMutation({
    mutationFn: (data: FormData) => communicationService.sendMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      form.reset()
    },
  })

  const { mutate: markAsRead } = useMutation({
    mutationFn: (messageId: number) =>
      communicationService.markMessageAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  useEffect(() => {
    // Mark unread messages as read
    thread.messages.forEach((message) => {
      if (!message.is_read && message.recipient.id === user?.id) {
        markAsRead(message.id)
      }
    })
  }, [thread.messages, user?.id, markAsRead])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread.messages])

  const onSubmit = (data: ReplyFormData) => {
    const formData = new FormData()
    formData.append('subject', data.subject)
    formData.append('content', data.content)
    formData.append('recipient_id', thread.otherUser.id)
    if (data.file?.[0]) {
      formData.append('attachment', data.file[0])
    }
    sendMessage(formData)
  }

  return (
    <div className="bg-white rounded-lg shadow flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="font-semibold">
            {thread.otherUser.first_name} {thread.otherUser.last_name}
          </h2>
          <p className="text-sm text-gray-500">
            {thread.otherUser.role.replace('_', ' ')}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread.messages.map((message) => {
          const isOwnMessage = message.sender.id === user?.id

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  isOwnMessage
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                }`}
              >
                <div className="flex justify-between items-start gap-4 mb-1">
                  <p className="font-medium">{message.subject}</p>
                  <p className="text-xs opacity-70">
                    {format(
                      new Date(message.created_at),
                      'MMM d, h:mm a'
                    )}
                  </p>
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.attachment && (
                  <div className="mt-2">
                    <Button
                      variant={isOwnMessage ? 'secondary' : 'outline'}
                      size="sm"
                      asChild
                    >
                      <a
                        href={message.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Attachment
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Form */}
      <div className="p-4 border-t">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Textarea
                        placeholder="Type your message..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
