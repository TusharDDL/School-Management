'use client'

import { format } from 'date-fns'
import { Announcement } from '@/services/communication'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EditAnnouncementDialog } from './edit-announcement-dialog'

interface AnnouncementListProps {
  announcements: Announcement[]
  canEdit: boolean
}

export function AnnouncementList({
  announcements,
  canEdit,
}: AnnouncementListProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>
      case 'medium':
        return <Badge>Medium Priority</Badge>
      case 'low':
        return <Badge variant="secondary">Low Priority</Badge>
      default:
        return null
    }
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No announcements found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{announcement.title}</CardTitle>
                <CardDescription>
                  By {announcement.author.first_name}{' '}
                  {announcement.author.last_name} |{' '}
                  {format(
                    new Date(announcement.created_at),
                    'MMM d, yyyy h:mm a'
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {getPriorityBadge(announcement.priority)}
                {canEdit && (
                  <EditAnnouncementDialog announcement={announcement} />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none">
                {announcement.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {announcement.attachment && (
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={announcement.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Attachment
                    </a>
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {announcement.target_roles.map((role) => (
                  <Badge
                    key={role}
                    variant="outline"
                    className="capitalize"
                  >
                    {role.replace('_', ' ')}
                  </Badge>
                ))}
                {announcement.target_sections.map((section) => (
                  <Badge
                    key={section.id}
                    variant="outline"
                  >
                    {section.class_name.name} - {section.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
