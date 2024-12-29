'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/auth'
import academicService from '@/services/academic'
import communicationService from '@/services/communication'
import { AnnouncementList } from './components/announcement-list'
import { CreateAnnouncementDialog } from './components/create-announcement-dialog'

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedSection, setSelectedSection] = useState<string>('')

  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: academicService.getSections,
  })

  const { data: announcements } = useQuery({
    queryKey: ['announcements', selectedSection],
    queryFn: () =>
      selectedSection
        ? communicationService.getAnnouncements({
            section: parseInt(selectedSection),
          })
        : communicationService.getAnnouncements(),
  })

  const filteredAnnouncements = announcements?.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())

    if (priorityFilter === 'all') return matchesSearch
    return announcement.priority === priorityFilter && matchesSearch
  })

  const canCreateAnnouncement = ['super_admin', 'school_admin', 'teacher'].includes(
    user?.role || ''
  )

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        {canCreateAnnouncement && (
          <CreateAnnouncementDialog />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Search</h2>
            <Input
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Priority</h2>
            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {user?.role !== 'student' && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Section</h2>
              <Select
                value={selectedSection}
                onValueChange={setSelectedSection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sections</SelectItem>
                  {sections?.map((section) => (
                    <SelectItem
                      key={section.id}
                      value={section.id.toString()}
                    >
                      {section.class_name.name} - {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quick Stats */}
          {announcements && (
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
              <h2 className="font-semibold text-lg">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">
                    {announcements.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">High Priority</p>
                  <p className="text-2xl font-bold text-red-600">
                    {
                      announcements.filter(
                        (a) => a.priority === 'high'
                      ).length
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">This Week</p>
                  <p className="text-2xl font-bold">
                    {
                      announcements.filter((a) => {
                        const date = new Date(a.created_at)
                        const now = new Date()
                        const weekAgo = new Date(
                          now.getTime() - 7 * 24 * 60 * 60 * 1000
                        )
                        return date > weekAgo
                      }).length
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">With Files</p>
                  <p className="text-2xl font-bold">
                    {
                      announcements.filter((a) => a.attachment)
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Announcement List */}
        <div className="md:col-span-3">
          {announcements ? (
            <AnnouncementList
              announcements={filteredAnnouncements || []}
              canEdit={canCreateAnnouncement}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Loading announcements...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
