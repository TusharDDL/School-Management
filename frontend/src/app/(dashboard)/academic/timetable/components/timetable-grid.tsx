'use client'

import { format } from 'date-fns'
import { useAuth } from '@/lib/auth'
import { Timetable } from '@/services/academic'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EditTimetableEntryDialog } from './edit-timetable-entry-dialog'

interface TimetableGridProps {
  timetable: {
    day: string
    entries?: Timetable[]
  }[]
  sectionId: number
}

export function TimetableGrid({ timetable, sectionId }: TimetableGridProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'school_admin'

  const formatTime = (time: string) => {
    return format(new Date(`1970-01-01T${time}`), 'h:mm a')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {timetable.map(({ day, entries }) => (
        <Card key={day}>
          <CardHeader>
            <CardTitle>{day}</CardTitle>
            <CardDescription>
              {entries?.length || 0} {entries?.length === 1 ? 'class' : 'classes'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries?.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-secondary/50 rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">
                        {entry.subject.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatTime(entry.start_time)} -{' '}
                        {formatTime(entry.end_time)}
                      </p>
                    </div>
                    {isAdmin && (
                      <EditTimetableEntryDialog
                        entry={entry}
                        sectionId={sectionId}
                      />
                    )}
                  </div>
                  <p className="text-sm">
                    {entry.subject.teacher.first_name}{' '}
                    {entry.subject.teacher.last_name}
                  </p>
                </div>
              ))}
              {!entries?.length && (
                <p className="text-sm text-gray-500 text-center py-2">
                  No classes scheduled
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
