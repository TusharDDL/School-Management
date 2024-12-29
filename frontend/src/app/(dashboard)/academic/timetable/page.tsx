'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import academicService from '@/services/academic'
import { TimetableGrid } from './components/timetable-grid'
import { AddTimetableEntryDialog } from './components/add-timetable-entry-dialog'

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export default function TimetablePage() {
  const { user } = useAuth()
  const [selectedSection, setSelectedSection] = useState<string>('')

  const { data: sections } = useQuery({
    queryKey: ['sections'],
    queryFn: academicService.getSections,
  })

  const { data: timetable } = useQuery({
    queryKey: ['timetable', selectedSection],
    queryFn: () =>
      selectedSection
        ? academicService.getTimetable(parseInt(selectedSection))
        : null,
    enabled: !!selectedSection,
  })

  // Group timetable entries by weekday and sort by start time
  const groupedTimetable = WEEKDAYS.map((day, index) => ({
    day,
    entries: timetable
      ?.filter((entry) => entry.weekday === index)
      .sort((a, b) => {
        const timeA = new Date(`1970-01-01T${a.start_time}`)
        const timeB = new Date(`1970-01-01T${b.start_time}`)
        return timeA.getTime() - timeB.getTime()
      }),
  }))

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Timetable</h1>
        {user?.role === 'school_admin' && selectedSection && (
          <AddTimetableEntryDialog sectionId={parseInt(selectedSection)} />
        )}
      </div>

      <div className="space-y-6">
        {/* Section Selector */}
        <div className="max-w-sm">
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

        {/* Timetable */}
        {selectedSection ? (
          timetable ? (
            <TimetableGrid
              timetable={groupedTimetable}
              sectionId={parseInt(selectedSection)}
            />
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Loading timetable...
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Please select a section to view timetable
          </div>
        )}
      </div>
    </div>
  )
}
