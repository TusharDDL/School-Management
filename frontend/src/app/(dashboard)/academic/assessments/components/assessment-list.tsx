'use client'

import { format } from 'date-fns'
import { useAuth } from '@/lib/auth'
import { Assessment } from '@/services/academic'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EnterResultsDialog } from './enter-results-dialog'
import { ViewResultsDialog } from './view-results-dialog'

interface AssessmentListProps {
  assessments: Assessment[]
  sectionId: number
}

export function AssessmentList({ assessments, sectionId }: AssessmentListProps) {
  const { user } = useAuth()
  const isTeacher = user?.role === 'teacher'

  const getStatusBadge = (date: string) => {
    const assessmentDate = new Date(date)
    const today = new Date()

    if (assessmentDate > today) {
      return <Badge variant="secondary">Upcoming</Badge>
    } else if (
      assessmentDate.toDateString() === today.toDateString()
    ) {
      return <Badge>Today</Badge>
    } else {
      return <Badge variant="outline">Past</Badge>
    }
  }

  if (assessments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No assessments found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {assessments.map((assessment) => (
        <Card key={assessment.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{assessment.name}</CardTitle>
                <CardDescription>
                  {assessment.subject.name} |{' '}
                  {format(new Date(assessment.date), 'MMMM d, yyyy')}
                </CardDescription>
              </div>
              {getStatusBadge(assessment.date)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Marks</p>
                <p className="text-lg font-semibold">
                  {assessment.total_marks}
                </p>
              </div>
              <div className="space-x-2">
                {isTeacher ? (
                  <EnterResultsDialog
                    assessment={assessment}
                    sectionId={sectionId}
                  />
                ) : (
                  <ViewResultsDialog
                    assessment={assessment}
                    sectionId={sectionId}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
