'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth'
import academicService from '@/services/academic'
import { AssignmentList } from './components/assignment-list'
import { CreateAssignmentDialog } from './components/create-assignment-dialog'

export default function AssignmentsPage() {
  const { user } = useAuth()
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: academicService.getSections,
  })

  const { data: assignments } = useQuery({
    queryKey: ['assignments', selectedSection],
    queryFn: academicService.getAssignments,
    enabled: !!selectedSection,
  })

  const filteredAssignments = assignments?.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subject.name.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === 'all') return matchesSearch

    const dueDate = new Date(assignment.due_date)
    const now = new Date()

    if (statusFilter === 'upcoming' && dueDate > now) return matchesSearch
    if (statusFilter === 'past' && dueDate <= now) return matchesSearch

    return false
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
        {user?.role === 'teacher' && selectedSection && (
          <CreateAssignmentDialog sectionId={parseInt(selectedSection)} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Select Section</h2>
            <Select
              value={selectedSection}
              onValueChange={setSelectedSection}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a section" />
              </SelectTrigger>
              <SelectContent>
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

          <div>
            <h2 className="text-lg font-semibold mb-2">Search</h2>
            <Input
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Status</h2>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats */}
          {selectedSection && assignments && (
            <div className="bg-white rounded-lg shadow p-4 space-y-4">
              <h2 className="font-semibold text-lg">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">{assignments.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold">
                    {
                      assignments.filter(
                        (a) => new Date(a.due_date) > new Date()
                      ).length
                    }
                  </p>
                </div>
                {user?.role === 'student' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Submitted</p>
                      <p className="text-2xl font-bold">
                        {
                          assignments.filter((a) =>
                            a.submissions?.some(
                              (s) => s.student.id === user.id
                            )
                          ).length
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Missing</p>
                      <p className="text-2xl font-bold text-red-600">
                        {
                          assignments.filter(
                            (a) =>
                              new Date(a.due_date) <= new Date() &&
                              !a.submissions?.some(
                                (s) => s.student.id === user.id
                              )
                          ).length
                        }
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Assignment List */}
        <div className="md:col-span-3">
          {selectedSection ? (
            filteredAssignments ? (
              <AssignmentList
                assignments={filteredAssignments}
                sectionId={parseInt(selectedSection)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                Loading assignments...
              </div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Please select a section to view assignments
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
