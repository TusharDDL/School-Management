'use client'

import { format } from 'date-fns'
import { useAuth } from '@/lib/auth'
import { Assignment } from '@/services/academic'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SubmitAssignmentDialog } from './submit-assignment-dialog'
import { ViewSubmissionsDialog } from './view-submissions-dialog'

interface AssignmentListProps {
  assignments: Assignment[]
  sectionId: number
}

export function AssignmentList({
  assignments,
  sectionId,
}: AssignmentListProps) {
  const { user } = useAuth()
  const isTeacher = user?.role === 'teacher'

  const getStatusBadge = (dueDate: string, submissions?: any[]) => {
    const due = new Date(dueDate)
    const now = new Date()
    const isSubmitted = submissions?.some(
      (s) => s.student.id === user?.id
    )

    if (due > now) {
      return <Badge variant="secondary">Upcoming</Badge>
    } else if (due.toDateString() === now.toDateString()) {
      return <Badge>Due Today</Badge>
    } else {
      if (isSubmitted) {
        return <Badge variant="outline">Submitted</Badge>
      }
      return <Badge variant="destructive">Past Due</Badge>
    }
  }

  if (assignments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No assignments found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {assignments.map((assignment) => (
        <Card key={assignment.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{assignment.title}</CardTitle>
                <CardDescription>
                  {assignment.subject.name} | Due:{' '}
                  {format(new Date(assignment.due_date), 'PPp')}
                </CardDescription>
              </div>
              {getStatusBadge(assignment.due_date, assignment.submissions)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {assignment.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {assignment.file && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={assignment.file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Attachment
                      </a>
                    </Button>
                  )}
                </div>

                <div className="space-x-2">
                  {isTeacher ? (
                    <ViewSubmissionsDialog
                      assignment={assignment}
                      sectionId={sectionId}
                    />
                  ) : (
                    <SubmitAssignmentDialog
                      assignment={assignment}
                      sectionId={sectionId}
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
