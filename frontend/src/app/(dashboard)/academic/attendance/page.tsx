'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/auth'
import academicService from '@/services/academic'
import { AttendanceTable } from './components/attendance-table'
import { MarkAttendanceDialog } from './components/mark-attendance-dialog'

export default function AttendancePage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSection, setSelectedSection] = useState<string>('')

  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: academicService.getSections,
  })

  const { data: attendance } = useQuery({
    queryKey: ['attendance', selectedDate, selectedSection],
    queryFn: () =>
      academicService.getAttendance({
        section: selectedSection ? parseInt(selectedSection) : undefined,
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined,
      }),
    enabled: !!selectedSection && !!selectedDate,
  })

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance Management</h1>
        {user?.role === 'teacher' && selectedSection && selectedDate && (
          <MarkAttendanceDialog
            sectionId={parseInt(selectedSection)}
            date={selectedDate}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <h2 className="text-lg font-semibold mb-2">Select Date</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </div>
        </div>

        {/* Attendance Table */}
        <div className="md:col-span-2">
          {selectedSection && selectedDate ? (
            <AttendanceTable
              attendance={attendance || []}
              date={selectedDate}
              sectionId={parseInt(selectedSection)}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              Please select a section and date to view attendance
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
